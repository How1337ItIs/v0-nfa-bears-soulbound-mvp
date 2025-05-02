'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VendorPage() {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  useEffect(() => {
    let html5QrcodeScanner: any;
    
    const initScanner = async () => {
      const Html5QrcodeScanner = (await import('html5-qrcode')).Html5QrcodeScanner;
      
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      html5QrcodeScanner.render(onScanSuccess);
    };

    const onScanSuccess = async (decodedText: string) => {
      setScannedText(decodedText);
      
      if (decodedText.startsWith('nfa-')) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/invite/verify?code=${decodedText}`);
          const data = await response.json();
          setIsValid(data.valid);
        } catch (error) {
          console.error('Verification failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initScanner();

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
      }
    };
  }, []);

  if (!authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Vendor Portal</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div id="reader" className="mb-4"></div>
          
          {scannedText && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Scanned Code</p>
              <pre className="bg-gray-50 p-2 rounded">{scannedText}</pre>
              
              {isLoading ? (
                <p className="mt-2 text-gray-600">Verifying...</p>
              ) : isValid !== null && (
                <p className={`mt-2 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? '✓ Valid invite code' : '✗ Invalid or expired code'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 