'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import QR code with no SSR to avoid HTMLElement issues
const QRCodeComponent = dynamic(
  () => import('qrcode.react').then(mod => ({ default: mod.QRCodeSVG })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading QR...</div>
      </div>
    )
  }
);

interface BigQRCodeProps {
  url: string;
}

export function BigQRCode({ url }: BigQRCodeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Double-check client-side mounting to prevent hydration issues
  if (typeof window === 'undefined' || !mounted) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading QR...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <QRCodeComponent
        value={url}
        size={256}
        level="H"
        includeMargin={true}
        className="w-64 h-64"
      />
    </div>
  );
}
