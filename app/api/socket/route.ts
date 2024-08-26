import { NextResponse } from 'next/server';
import { initializeWebSocketServer } from "@/app/api/socket/io";

export async function POST() {
  initializeWebSocketServer(9999);
  return NextResponse.json({ message: 'WebSocket server initialized' });
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
