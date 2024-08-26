// app/api/socket/heartbeat.ts
import { getAllClients, getRelation } from './client-manager';

let heartbeatInterval: NodeJS.Timeout | null = null;
let currentIntervalMs: number = 60000; // 默认间隔为60秒

// 定义心跳消息
const heartbeatMsg = {
  type: "heartbeat",
  clientId: "",
  targetId: "",
  message: "200"
};

export function startHeartbeat(intervalMs: number = 60000) {
  if (heartbeatInterval) {
    console.log('心跳已经在运行中');
    return;
  }

  currentIntervalMs = intervalMs;
  // 启动心跳定时器（如果尚未启动）
  heartbeatInterval = setInterval(() => {
    const clients = getAllClients();
    // 遍历 clients Map（大于0个链接），向每个客户端发送心跳消息
    if (clients.size > 0) {
      console.log(`发送心跳消息：${new Date().toLocaleString()}, 客户端数量: ${clients.size}`);
      clients.forEach((client, clientId) => {
        const targetId = getRelation(clientId) || '';
        const message = { ...heartbeatMsg, clientId, targetId };
        client.send(JSON.stringify(message));
      });
    } else {
      console.log('没有连接的客户端，跳过心跳');
    }
  }, intervalMs);  // 每分钟发送一次心跳消息

  console.log(`心跳机制已启动，间隔: ${intervalMs}ms`);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log('心跳机制已停止');
  } else {
    console.log('心跳机制未运行');
  }
}

export function isHeartbeatRunning(): boolean {
  return heartbeatInterval !== null;
}

export function getHeartbeatStatus(): string {
  return heartbeatInterval
    ? `心跳机制运行中，间隔: ${currentIntervalMs}ms`
    : '心跳机制未运行';
}

export function restartHeartbeat(intervalMs: number = 60000) {
  stopHeartbeat();
  startHeartbeat(intervalMs);
  console.log(`心跳机制已重启，新间隔: ${intervalMs}ms`);
}

