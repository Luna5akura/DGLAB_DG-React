// app/api/socket/io.ts
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { handleMessage } from './message-handler';
import {addClient, removeClient, getClient, notifyClientsOfError} from './client-manager';
import { startHeartbeat } from './heartbeat';

export function initializeWebSocketServer(port: number) {
  const wss = new WebSocket.Server({ port });
  console.log(`WebSocket server is starting on port ${port}`);  // 添加日志

  wss.on('connection', function connection(ws) {
    console.log('New WebSocket connection established');
    // 生成唯一的标识符
    const clientId = uuidv4();
    console.log('新的 WebSocket 连接已建立，标识符为:', clientId);

    addClient(clientId, ws);

    // 发送标识符给客户端（格式固定，双方都必须获取才可以进行后续通信：比如浏览器和APP）
    ws.send(JSON.stringify(
      { type: 'bind', clientId, message: 'targetId', targetId: '' }
    ));

    // 监听发信
    ws.on('message', function incoming(message) {
      const messageStr = message.toString();
      handleMessage(ws, messageStr);
    });

    ws.on('close', function close() {
      removeClient(clientId);
    });

    ws.on('error', function (error) {
      console.error('WebSocket 异常:', error.message);
      notifyClientsOfError('WebSocket 异常: ' + error.message)
    });
  });

  startHeartbeat();
}
