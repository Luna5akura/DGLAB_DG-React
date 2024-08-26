// app/api/socket/message-handler.ts
import WebSocket from 'ws';
import { getClient, getRelation, addRelation, getAllClients } from './client-manager';

const punishmentDuration = 5; // 默认发送时间5秒
const punishmentTime = 1; // 默认一秒发送1次

// 存储客户端和发送计时器关系
const clientTimers = new Map<string, NodeJS.Timeout>();

export function handleMessage(ws: WebSocket, message: string) {
  console.log("收到消息：" + message);
  let data;
  try {
    data = JSON.parse(message);
  } catch (e) {
    // 非JSON数据处理
    ws.send(JSON.stringify(
      { type: 'msg', clientId: "", targetId: "", message: '403' }
    ));
    return;
  }

  // 非法消息来源拒绝
  if (getClient(data.clientId) !== ws && getClient(data.targetId) !== ws) {
    ws.send(JSON.stringify(
      { type: 'msg', clientId: "", targetId: "", message: '404' }
    ));
    return;
  }

  if (data.type && data.clientId && data.message && data.targetId) {
    switch (data.type) {
      // 优先处理绑定关系
      case "bind":
        handleBindMessage(data, ws);
        break;
      case 1:
      case 2:
      case 3:
        handleStrengthAdjustment(data, ws);
        break;
      case 4:
        handleSpecificStrength(data, ws);
        break;
      case "clientMsg":
        handleClientMessage(data, ws);
        break;
      case 'elementData':
        console.log('Received element data:', data);
      default:
        handleDefaultMessage(data, ws);
        break;
    }
  }
}

function handleBindMessage(data: any, ws: WebSocket) {
  const { clientId, targetId } = data;
  const clients = getAllClients();
  // 服务器下发绑定关系
  if (clients.has(clientId) && clients.has(targetId)) {
    // relations的双方都不存在这俩id
    if (![clientId, targetId].some(id => getRelation(id) || Array.from(clients.values()).includes(<WebSocket>getClient(id)))) {
      addRelation(clientId, targetId);
      const client = getClient(clientId);
      const sendData = { clientId, targetId, message: "200", type: "bind" };
      ws.send(JSON.stringify(sendData));
      client?.send(JSON.stringify(sendData));
    } else {
      ws.send(JSON.stringify(
        { type: "bind", clientId, targetId, message: "400" }
      ));
    }
  } else {
    ws.send(JSON.stringify(
      { clientId, targetId, message: "401", type: "bind" }
    ));
  }
}

function handleStrengthAdjustment(data: any, ws: WebSocket) {
  // 服务器下发APP强度调节
  const { clientId, targetId, type, channel } = data;
  if (getRelation(clientId) !== targetId) {
    ws.send(JSON.stringify(
      { type: "bind", clientId, targetId, message: "402" }
    ));
    return;
  }
  const client = getClient(targetId);
  if (client) {
    const sendType = type - 1;
    const sendChannel = channel || 1;
    const sendStrength = type >= 3 ? data.strength : 1;
    const msg = `strength-${sendChannel}+${sendType}+${sendStrength}`;
    client.send(JSON.stringify(
      { type: "msg", clientId, targetId, message: msg }
    ));
  }
}

function handleSpecificStrength(data: any, ws: WebSocket) {
  // 服务器下发指定APP强度
  const { clientId, targetId, message } = data;
  if (getRelation(clientId) !== targetId) {
    ws.send(JSON.stringify(
      { type: "bind", clientId, targetId, message: "402" }
    ));
    return;
  }
  const client = getClient(targetId);
  if (client) {
    client.send(JSON.stringify(
      { type: "msg", clientId, targetId, message }
    ));
  }
}

function handleClientMessage(data: any, ws: WebSocket) {
  // 服务端下发给客户端的消息
  const { clientId, targetId, message, channel, time } = data;
  if (getRelation(clientId) !== targetId) {
    ws.send(JSON.stringify(
      {type: "bind", clientId, targetId, message: "402" }
    ));
    return;
  }
  if (!channel) {
    // 240531.现在必须指定通道(允许一次只覆盖一个正在播放的波形)
    ws.send(JSON.stringify(
      { type: "error", clientId, targetId, message: "406-channel is empty" }
    ));
    return;
  }
  const target = getClient(targetId);
  if (target) {
    //消息体 默认最少一个消息
    let sendtime = time || punishmentDuration;
    const sendData = { type: "msg", clientId, targetId, message: "pulse-" + message };
    let totalSends = punishmentTime * sendtime;
    const timeSpace = 1000 / punishmentTime;

    if (clientTimers.has(clientId + "-" + channel)) {
      // A通道计时器尚未工作完毕, 清除计时器且发送清除APP队列消息，延迟150ms重新发送新数据
      // 新消息覆盖旧消息逻辑
      console.log(`通道${channel}覆盖消息发送中，总消息数：${totalSends}持续时间：${sendtime}`);
      ws.send(`当前通道${channel}有正在发送的消息，覆盖之前的消息`);

      const timerId = clientTimers.get(clientId + "-" + channel);
      clearInterval(timerId);
      clientTimers.delete(clientId + "-" + channel);

      // 发送APP波形队列清除指令
      const clearData = { clientId, targetId, message: `clear-${channel === "A" ? "1" : "2"}`, type: "msg" };
      target.send(JSON.stringify(clearData));

      setTimeout(() => {
        delaySendMsg(clientId, ws, target, sendData, totalSends, timeSpace, channel);
      }, 150);
    } else {
      // 不存在未发完的消息 直接发送消息
      delaySendMsg(clientId, ws, target, sendData, totalSends, timeSpace, channel);
      console.log(`通道${channel}消息发送中，总消息数：${totalSends}持续时间：${sendtime}`);
    }
  } else {
    console.log(`未找到匹配的客户端，clientId: ${clientId}`);
    ws.send(JSON.stringify(
      { clientId, targetId, message: "404", type: "msg" }
    ));
  }
}

function handleDefaultMessage(data: any, ws: WebSocket) {
  // 未定义的普通消息
  const { clientId, targetId, type, message } = data;
  if (getRelation(clientId) !== targetId) {
    ws.send(JSON.stringify(
      { type: "bind", clientId, targetId, message: "402" }
    ));
    return;
  }
  const client = getClient(clientId);
  if (client) {
    const sendData = { type, clientId, targetId, message };
    client.send(JSON.stringify(sendData));
  } else {
    // 未找到匹配的客户端
    ws.send(JSON.stringify(
      { clientId, targetId, message: "404", type: "msg" }
    ));
  }
}

function delaySendMsg(clientId: string, client: WebSocket, target: WebSocket, sendData: any, totalSends: number, timeSpace: number, channel: string) {
  // 发信计时器 通道会分别发送不同的消息和不同的数量 必须等全部发送完才会取消这个消息 新消息可以覆盖
  target.send(JSON.stringify(sendData)); //立即发送一次通道的消息
  totalSends--;
  if (totalSends > 0) {
    return new Promise<void>((resolve) => {
      // 按频率发送消息给特定的客户端
      const timerId = setInterval(() => {
        if (totalSends > 0) {
          target.send(JSON.stringify(sendData));
          totalSends--;
        }
        // 如果达到发送次数上限，则停止定时器
        if (totalSends <= 0) {
          clearInterval(timerId);
          client.send("发送完毕");
          clientTimers.delete(clientId + "-" + channel); // 删除对应的定时器
          resolve();
        }
      }, timeSpace); // 每隔频率倒数触发一次定时器

      // 存储clientId与其对应的timerId和通道
      clientTimers.set(clientId + "-" + channel, timerId);
    });
  }
}
