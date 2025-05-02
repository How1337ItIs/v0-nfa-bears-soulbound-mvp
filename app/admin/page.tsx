'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function AdminPage() {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  const generateInvite = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invite', { method: 'POST' });
      const { code } = await response.json();
      setInviteCode(code);
      
      // Generate QR code
      const qr = await QRCode.toDataURL(code);
      setQrCode(qr);
    } catch (error) {
      console.error('Failed to generate invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={generateInvite}
            disabled={isLoading}
            className="mb-4 bg-black text-white px-4 py-2 rounded-full hover:opacity-80 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Invite Code'}
          </button>

          {inviteCode && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Invite Code</p>
              <p className="font-mono mb-4">{inviteCode}</p>
              
              {qrCode && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">QR Code</p>
                  <img src={qrCode} alt="Invite QR Code" className="w-48 h-48" />
                  <a
                    href={qrCode}
                    download={`${inviteCode}.png`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    Download QR
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 