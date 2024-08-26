import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { waveData } from "@/utils/websocket-utils";

interface CustomMessageSenderProps {
  sendMessage: (message: any) => void;
}

export default function CustomMessageSender({ sendMessage }: CustomMessageSenderProps) {
  const [timeA, setTimeA] = useState(1);
  const [timeB, setTimeB] = useState(1);
  const [waveA, setWaveA] = useState(1);
  const [waveB, setWaveB] = useState(1);

  const handleSendCustomMsgA = () => {
    const msg = `A:${waveData[waveA]}`;
    sendMessage({ type: "clientMsg", message: msg, time: timeA, channel: "A" });
  };

  const handleSendCustomMsgB = () => {
    const msg = `B:${waveData[waveB]}`;
    sendMessage({ type: "clientMsg", message: msg, time: timeB, channel: "B" });
  };

  return (
    <div className="flex space-x-8">
      <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Channel A</h3>
        <div className="space-y-4 mb-4">
          <div>
            <label htmlFor="timeA" className="block text-sm font-medium mb-1">Time A:</label>
            <Select onValueChange={(value) => setTimeA(Number(value))} defaultValue={timeA.toString()}>
              <SelectTrigger className="bg-custom-black border-custom-gold">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent className="bg-custom-black border-custom-gold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                  <SelectItem key={t} value={t.toString()} className="text-custom-gold">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="waveA" className="block text-sm font-medium mb-1">Wave A:</label>
            <Select onValueChange={(value) => setWaveA(Number(value))} defaultValue={waveA.toString()}>
              <SelectTrigger className="bg-custom-black border-custom-gold">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent className="bg-custom-black border-custom-gold">
                {[1, 2, 3].map((w) => (
                  <SelectItem key={w} value={w.toString()} className="text-custom-gold">{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSendCustomMsgA}
                className="w-full bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">Send Custom
          Message A</Button>
      </div>

      <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Channel B</h3>
        <div className="space-y-4 mb-4">
          <div>
            <label htmlFor="timeB" className="block text-sm font-medium mb-1">Time B:</label>
            <Select onValueChange={(value) => setTimeB(Number(value))} defaultValue={timeB.toString()}>
              <SelectTrigger className="bg-custom-black border-custom-gold">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent className="bg-custom-black border-custom-gold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                  <SelectItem key={t} value={t.toString()} className="text-custom-gold">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="waveB" className="block text-sm font-medium mb-1">Wave B:</label>
            <Select onValueChange={(value) => setWaveB(Number(value))} defaultValue={waveB.toString()}>
              <SelectTrigger className="bg-custom-black border-custom-gold">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent className="bg-custom-black border-custom-gold">
                {[1, 2, 3].map((w) => (
                  <SelectItem key={w} value={w.toString()} className="text-custom-gold">{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSendCustomMsgB}
                className="w-full bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">Send Custom
          Message B</Button>
      </div>
    </div>
  );
}
