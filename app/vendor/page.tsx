'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePublicClient } from 'wagmi';
import { toast } from 'react-hot-toast';
import NFABearsMembership from '@/contracts/NFABearsMembership.json';

const Html5QrcodeScanner = dynamic(
  () => import('html5-qrcode').then(m => m.Html5QrcodeScanner),
  { ssr: false }
);

export default function VendorPage() {
  const [result, setResult] = useState<string | null>(null);
  const [hasSBT, setHasSBT] = useState<boolean | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!result) return;

    const checkSBT = async () => {
      try {
        const hasSBT = await publicClient.readContract({
          address: '0xF0e401E962f2C126A3E44a6708E0884De038E77b',
          abi: NFABearsMembership.abi,
          functionName: 'balanceOf',
          args: [result]
        });
        setHasSBT(Number(hasSBT) > 0);
      } catch (error) {
        console.error('Error checking SBT:', error);
        toast.error('Failed to check membership');
      }
    };

    checkSBT();
  }, [result, publicClient]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render((decodedText) => {
      setResult(decodedText);
      scanner.clear();
    });

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Scanner</h1>
      <div id="reader" className="w-full max-w-md"></div>
      {result && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100">
          <p className="text-sm text-gray-600">Scanned address:</p>
          <p className="font-mono text-sm break-all">{result}</p>
          {hasSBT !== null && (
            <div className={`mt-2 p-2 rounded ${hasSBT ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {hasSBT ? '✅ Valid Membership' : '❌ No Membership Found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 