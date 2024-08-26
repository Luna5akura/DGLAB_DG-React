'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-websocket";
import QRCodeModal from "@/components/modal/qr-code-modal";
import ConnectionStatus from "@/components/websocket/comp/connection-status";
import ChannelControl from "@/components/websocket/comp/channel-control";
import CustomMessageSender from "@/components/websocket/comp/custom-message-sender";

export default function WebSocketController() {
  const [qrCodeContent, setQRCodeContent] = useState('');
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const onConnectionIdReceived = useCallback((id: string) => {
    const appDownloadUrl = 'https://www.dungeon-lab.com/app-download.php';
    const socketTag = 'DGLAB-SOCKET';
    const socketUrl = `wss://ws.dungeon-lab.cn/${id}`;
    const newQRCodeContent = `${appDownloadUrl}#${socketTag}#${socketUrl}`;
    setQRCodeContent(newQRCodeContent);
    setIsQRCodeModalOpen(true);
  }, []);

  const {
    connected,
    connectionId,
    targetWSId,
    sendMessage,
    connectWs,
    disconnectWs,
    channelA,
    channelB
  } = useWebSocket('wss://ws.dungeon-lab.cn/', onConnectionIdReceived);

  const handleConnectOrDisconnect = useCallback(() => {
    if (!connected) {
      connectWs();
    } else {
      disconnectWs();
      setIsQRCodeModalOpen(false);
      setQRCodeContent('');
    }
  }, [connected, connectWs, disconnectWs]);

  useEffect(() => {
    if (connectionId && !connected) {
      setIsQRCodeModalOpen(true);
    }
  }, [connectionId, connected]);

  return (
    <div className="min-h-screen bg-custom-black text-custom-gold p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-center text-3xl font-bold mb-8">DG-React</h1>

        <ConnectionStatus
          connected={connected}
          connectionId={connectionId}
          targetWSId={targetWSId}
        />

        <div className="mt-4">
          <Button
            onClick={handleConnectOrDisconnect}
            className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors"
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        <ChannelControl
          channelA={channelA}
          channelB={channelB}
          sendMessage={sendMessage}
        />

        <CustomMessageSender sendMessage={sendMessage}/>

        <QRCodeModal
          isOpen={isQRCodeModalOpen}
          onClose={() => setIsQRCodeModalOpen(false)}
          qrCodeContent={qrCodeContent}
        />
      </div>
    </div>
  );
}
