import {useState, useEffect, useCallback, useRef} from 'react';
import { useToast } from "@/components/ui/use-toast";
import { feedBackMsg } from '@/utils/websocket-utils';

export function useWebSocket(url: string, onConnectionIdReceived: (id: string) => void) {

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionId, setConnectionIdState] = useState('');
  const [targetWSId, setTargetWSId] = useState('');
  const [channelA, setChannelA] = useState({ channel: 1, strength: 0, softLimit: 0 });
  const [channelB, setChannelB] = useState({ channel: 2, strength: 0, softLimit: 0 });
  const lastHeartbeatRef = useRef<Date | null>(null);
  const [followAStrength, setFollowAStrength] = useState(false);
  const [followBStrength, setFollowBStrength] = useState(false);
  const { toast } = useToast();
  const connectionIdRef = useRef('');

  const setConnectionId = (id: string) => {
    connectionIdRef.current = id;
    setConnectionIdState(id);
  };

  const sendMessage = useCallback((messageObj: any) => {
    console.log("Attempting to send message:", messageObj);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const fullMessage = JSON.stringify({
        ...messageObj,
        clientId: connectionId,
        targetId: targetWSId,
        type: messageObj.type || "msg"
      });
      console.log("Sending message:", fullMessage);
      wsRef.current.send(fullMessage);
    } else {
      console.error("WebSocket is not open. Current state:", wsRef.current?.readyState);
    }
  }, [connectionId, targetWSId]);


  const handleMessage = useCallback((event: MessageEvent) => {
    console.log("Received message:", event.data);
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'bind':
        if (!message.targetId) {
          setConnectionId(message.clientId);
          console.log("收到clientId：" + message.clientId);
          onConnectionIdReceived(message.clientId);
        } else {
          if (message.clientId !== connectionIdRef.current) {
          console.log("Expected clientId:", connectionIdRef.current, "Received clientId:", message.clientId);
            toast({
              title: "错误",
              description: '收到不正确的target消息' + message.message,
              variant: "destructive",
            });
            return;
          }
          setTargetWSId(message.targetId);
          setConnected(true);
          toast({
            title: "连接成功",
            description: "已连接到目标设备",
          });
          console.log("收到targetId: " + message.targetId + "msg: " + message.message);
        }
        break;
      case 'break':
        if (message.targetId !== targetWSId) return;
        toast({
          title: "连接断开",
          description: "对方已断开，code:" + message.message,
          variant: "destructive",
        });
        setConnected(false);
        setTargetWSId('');
        break;
      case 'error':
        if (message.targetId !== targetWSId) return;
        console.log(message);
        toast({
          title: "错误",
          description: message.message,
          variant: "destructive",
        });
        break;
      case 'msg':
        if (message.message.includes("strength")) {
          const numbers = message.message.match(/\d+/g).map(Number);
          setChannelA(prev => ({ ...prev, strength: numbers[0], softLimit: numbers[2] }));
          setChannelB(prev => ({ ...prev, strength: numbers[1], softLimit: numbers[3] }));

          if (followAStrength && numbers[2] !== channelA.strength) {
            sendMessage({
              type: 4,
              message: `strength-1+2+${numbers[2]}`,
            });
          }
          if (followBStrength && numbers[3] !== channelB.strength) {
            sendMessage({
              type: 4,
              message: `strength-2+2+${numbers[3]}`,
            });
          }
        } else if (message.message.includes("feedback")) {
          toast({
            title: "反馈",
            description: feedBackMsg[message.message as keyof typeof feedBackMsg],
          });
        }
        break;
      case 'heartbeat':
        console.log("收到心跳");
        lastHeartbeatRef.current = new Date();
        break;
      default:
        console.log("收到其他消息：" + JSON.stringify(message));
        break;
    }
  }, [targetWSId, toast, onConnectionIdReceived, sendMessage, followAStrength, followBStrength, channelA.strength, channelB.strength]);

  const connectWs = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) return;
    const newWs = new WebSocket(url);

    newWs.onopen = () => {
      setConnected(true);
      toast({
        title: "WebSocket Connected",
        description: "Connection established successfully.",
      });
    };

    newWs.onmessage = handleMessage;

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "WebSocket Error",
        description: "An error occurred with the WebSocket connection.",
        variant: "destructive",
      });
    };

    newWs.onclose = () => {
      setConnected(false);
      toast({
        title: "WebSocket Disconnected",
        description: "The WebSocket connection has been closed.",
        variant: "destructive",
      });
    };

    wsRef.current = newWs;
  }, [url, toast, handleMessage]);

  const disconnectWs = useCallback(() => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnected(false);
      setTargetWSId('');
      setConnectionId('');
      // 重置其他相关状态
      setChannelA({ channel: 1, strength: 0, softLimit: 0 });
      setChannelB({ channel: 2, strength: 0, softLimit: 0 });
      lastHeartbeatRef.current = null;
      setFollowAStrength(false);
      setFollowBStrength(false);

      toast({
        title: "WebSocket Disconnected",
        description: "The WebSocket connection has been closed.",
      });
    }, [toast]);


  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    connected,
    connectionId,
    targetWSId,
    channelA,
    channelB,
    lastHeartbeat: lastHeartbeatRef.current,
    followAStrength,
    followBStrength,
    setFollowAStrength,
    setFollowBStrength,
    sendMessage,
    connectWs,
    disconnectWs,
  };
}