import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface ChannelControlProps {
  channelA: { strength: number };
  channelB: { strength: number };
  sendMessage: (message: any) => void;
}

export default function ChannelControl({ channelA, channelB, sendMessage }: ChannelControlProps) {
  const [selectedStrength, setSelectedStrength] = useState<number>(1);
  const [increaseA, setIncreaseA] = useState<number>(1);
  const [decreaseA, setDecreaseA] = useState<number>(1);
  const [increaseB, setIncreaseB] = useState<number>(1);
  const [decreaseB, setDecreaseB] = useState<number>(1);

  const handleAddOrIncrease = (type: number, channelIndex: number, strength: number) => {
    let currentValue = channelIndex === 1 ? channelA.strength : channelB.strength;

    if (type === 3) {
      currentValue = 0;
    } else if (type === 1) {
      currentValue = Math.max(currentValue - strength, 0);
    } else if (type === 2) {
      currentValue = Math.min(currentValue + strength, 200);
    } else if (type === 4) {
      currentValue = strength;
    }

    sendMessage({
      type,
      strength: currentValue,
      message: "set channel",
      channel: channelIndex
    });
    // sendMessage({
    //   type:'msg',
    //   message: 'strength-'+channelIndex.toString()+'+'+(type-1).toString()+'+'+currentValue.toString()
    // })
  };

  const strengthOptions = Array.from({ length: 200 }, (_, i) => i + 1);
  const strengthChangeOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex space-x-8">
      <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
        <Label className="text-lg font-semibold mb-2">Channel A: {channelA.strength}</Label>
        <div className="flex space-x-2 mt-2">
          <Button onClick={() => handleAddOrIncrease(1, 1, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">-</Button>
          <Button onClick={() => handleAddOrIncrease(2, 1, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">+</Button>
          <Button onClick={() => handleAddOrIncrease(3, 1, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">R</Button>
          <Button onClick={() => handleAddOrIncrease(4, 1, selectedStrength)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">S</Button>

          <Select onValueChange={(value) => setSelectedStrength(Number(value))} defaultValue="1">
            <SelectTrigger className="bg-custom-black border-custom-gold">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
              {strengthOptions.map((strength) => (
                <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                  {strength}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4 mt-2">
          <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleAddOrIncrease(1, 1, decreaseA)}
                className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors"
              >
                -
              </Button>
              <Select
                value={decreaseA.toString()}
                onValueChange={(value) => setDecreaseA(Number(value))}
              >
                <SelectTrigger className="bg-custom-black border-custom-gold">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
                  {strengthChangeOptions.map((strength) => (
                    <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                      {strength}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleAddOrIncrease(2, 1, increaseA)}
                className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors"
              >
                +
              </Button>
              <Select
                value={increaseA.toString()}
                onValueChange={(value) => setIncreaseA(Number(value))}
              >
                <SelectTrigger className="bg-custom-black border-custom-gold">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
                  {strengthChangeOptions.map((strength) => (
                    <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                      {strength}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
        <Label className="text-lg font-semibold mb-2">Channel B: {channelB.strength}</Label>
        <div className="flex space-x-2 mt-2">
          <Button onClick={() => handleAddOrIncrease(1, 2, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">-</Button>
          <Button onClick={() => handleAddOrIncrease(2, 2, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">+</Button>
          <Button onClick={() => handleAddOrIncrease(3, 2, 1)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">R</Button>
          <Button onClick={() => handleAddOrIncrease(4, 2, selectedStrength)}
                  className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors">S</Button>

          <Select onValueChange={(value) => setSelectedStrength(Number(value))} defaultValue="1">
            <SelectTrigger className="bg-custom-black border-custom-gold">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
              {strengthOptions.map((strength) => (
                <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                  {strength}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4 mt-2">
          <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleAddOrIncrease(2, 1, decreaseB)}
                className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors"
              >
                -
              </Button>
              <Select
                value={decreaseB.toString()}
                onValueChange={(value) => setDecreaseB(Number(value))}
              >
                <SelectTrigger className="bg-custom-black border-custom-gold">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
                  {strengthChangeOptions.map((strength) => (
                    <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                      {strength}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 bg-custom-black bg-opacity-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleAddOrIncrease(2, 1, increaseB)}
                className="bg-custom-gold text-custom-black hover:bg-yellow-400 transition-colors"
              >
                +
              </Button>
              <Select
                value={increaseB.toString()}
                onValueChange={(value) => setIncreaseB(Number(value))}
              >
                <SelectTrigger className="bg-custom-black border-custom-gold">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className="bg-custom-black border-custom-gold max-h-60 overflow-y-auto">
                  {strengthChangeOptions.map((strength) => (
                    <SelectItem key={strength} value={strength.toString()} className="text-custom-gold">
                      {strength}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
