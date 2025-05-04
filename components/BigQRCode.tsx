'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const QRCode = dynamic(
  () => import('qrcode.react').then(mod => mod.QRCodeSVG),
  { ssr: false }
);

interface BigQRCodeProps {
  url: string;
}

export function BigQRCode({ url }: BigQRCodeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <QRCode
        value={url}
        size={256}
        level="H"
        includeMargin
        className="w-64 h-64"
      />
    </div>
  );
} 