
import { Toaster } from "@/components/ui/toaster";
import WebSocketController from "@/components/websocket/websocket-controller";

export default function TestPage() {
  return (
    <div>
      <WebSocketController/>
      <Toaster/>
    </div>
  );
}
