'use client';

import { useState } from 'react';
import { BigQRCode } from '@/components/BigQRCode';

export default function AmbassadorPage() {
  const [code, setCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvite = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Generating invite...');
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invite');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data.code || !data.secret) {
        throw new Error('Invalid response from server');
      }
      
      setCode(data.code);
      setSecret(data.secret);
    } catch (error) {
      console.error('Failed to generate invite:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate invite');
    } finally {
      setIsLoading(false);
    }
  };

  const inviteUrl = code && secret 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${code}?secret=${secret}` 
    : null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ambassador Portal</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={generateInvite}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate New Invite'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {inviteUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Invite QR Code</h2>
              <BigQRCode value={inviteUrl} />
              <p className="mt-4 text-sm text-gray-600">
                Code: {code}<br />
                Secret: {secret}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 