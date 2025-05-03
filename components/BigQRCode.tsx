'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false
});

interface BigQRCodeProps {
  value: string;
}

export function BigQRCode({ value }: BigQRCodeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-[320px] h-[320px] bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="pointer-events-none select-none">
        <QRCodeSVG 
          value={value}
          size={320}
          level="H"
          includeMargin
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-sm text-gray-600 break-all text-center max-w-xs">
        {value}
      </p>
    </div>
  );
} 