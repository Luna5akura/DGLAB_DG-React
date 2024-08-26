// pages/api/socket.ts

import {initializeWebSocketServer} from "@/app/api/socket/io";

export default function handler(req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
  if (req.method === 'POST') {
    initializeWebSocketServer(9999);
    res.status(200).json({ message: 'WebSocket server initialized' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
