// app/api/socket/client-manager.ts
import WebSocket from 'ws';

// 储存已连接的用户及其标识
const clients: Map<string, WebSocket> = new Map();

// 存储消息关系
const relations: Map<string, string> = new Map();

export function addClient(clientId: string, ws: WebSocket) {
  clients.set(clientId, ws);
}

export function removeClient(clientId: string) {
  // 连接关闭时，清除对应的 clientId 和 WebSocket 实例
  console.log('WebSocket 连接已关闭');
  // 遍历 clients Map，找到并删除对应的 clientId 条目
  clients.delete(clientId);
  console.log("断开的client id:" + clientId)
  relations.forEach((value, key) => {
    if (key === clientId) {
      // 网页断开，通知app
      let appid = relations.get(key);
      if (!appid) {
        return;
      }
      let appClient = clients.get(appid);
      if (appClient) {
        appClient.send(JSON.stringify(
          { type: "break", clientId, targetId: appid, message: "209" }
        ));
        appClient.close();
      }
      relations.delete(key);
      console.log("对方掉线，关闭" + appid);
    } else if (value === clientId) {
      // app断开，通知网页
      let webClient = clients.get(key);
      if (webClient) {
        webClient.send(JSON.stringify(
          { type: "break", clientId: key, targetId: clientId, message: "209" }
        ));
        webClient.close();
      }
      relations.delete(key);
      console.log("对方掉线，关闭" + clientId);
    }
  });
  console.log("已清除" + clientId + " ,当前size: " + clients.size);
}

export function getClient(clientId: string): WebSocket | undefined {
  return clients.get(clientId);
}

export function addRelation(clientId: string, targetId: string) {
  relations.set(clientId, targetId);
}

export function getRelation(clientId: string): string | undefined {
  return relations.get(clientId);
}

export function getAllClients(): Map<string, WebSocket> {
  return clients;
}

export function getAllRelations(): Map<string, string> {
  return relations;
}

export function findClientIdByWebSocket(ws: WebSocket): string | undefined {
  for (const [clientId, clientWs] of clients.entries()) {
    if (clientWs === ws) {
      return clientId;
    }
  }
  return undefined;
}

export function notifyClientsOfError(errorMessage: string) {
  relations.forEach((targetId, clientId) => {
    // 遍历关系 Map，找到并通知没掉线的那一方
    const clientWs = clients.get(clientId);
    const targetWs = clients.get(targetId);

    if (clientWs) {
      // 通知app
      clientWs.send(JSON.stringify({
        type: "error",
        clientId: clientId,
        targetId: targetId,
        message: errorMessage
      }));
    }

    if (targetWs) {
      // 通知网页
      targetWs.send(JSON.stringify({
        type: "error",
        clientId: targetId,
        targetId: clientId,
        message: errorMessage
      }));
    }
  });
}

export function getClientsCount(): number {
  return clients.size;
}

export function getRelationsCount(): number {
  return relations.size;
}
