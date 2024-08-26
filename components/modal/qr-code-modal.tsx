import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeContent: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, qrCodeContent }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>扫描二维码连接:{qrCodeContent}!</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center p-4">
          <QRCodeSVG value={qrCodeContent} size={256} />
        </div>
        <p className="text-center text-sm text-gray-500">
          请使用 Dungeon Lab APP 扫描此二维码进行连接
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
