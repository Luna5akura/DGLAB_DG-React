import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
  connectionId: string;
  targetWSId: string;
}

export default function ConnectionStatus({ connected, connectionId, targetWSId }: ConnectionStatusProps) {
  return (
    <div className="bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
      <div className="text-lg font-semibold mb-2">Connection Status:
        <span className={`ml-2 ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="text-sm opacity-80">Connection ID: {connectionId}</div>
      <div className="text-sm opacity-80">Target WS ID: {targetWSId}</div>
    </div>
  );
}
