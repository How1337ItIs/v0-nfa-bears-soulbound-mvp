'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useMintSBT } from '@/lib/useMintSBT';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MemberPage() {
  const { user, authenticated } = usePrivy();
  const { mint, isLoading } = useMintSBT();
  const [hasSBT, setHasSBT] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleMint = async () => {
    try {
      const walletAddress = user?.wallet?.address;
      if (!walletAddress) throw new Error('No wallet connected');
      
      const result = await mint(walletAddress);
      if (result.error) {
        setError(result.error || 'Unknown error occurred');
        return;
      }
      
      if (result.txHash) {
        setTxHash(result.txHash);
        setHasSBT(true);
        setShowToast(true);
        setError(null);
      }
    } catch (error) {
      console.error('Minting failed:', error);
      setError(error instanceof Error ? error.message : 'Minting failed');
    }
  };

  if (!authenticated) return null;

  const walletAddress = user?.wallet?.address;
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : 'No wallet connected';

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Wallet Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono">{displayAddress}</p>
              <Image
                src="/bepolia.svg"
                alt="Berachain Bepolia"
                width={24}
                height={24}
                className="inline-block"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">Miracle SBT Status</p>
            {hasSBT ? (
              <div>
                <p className="text-green-600">✓ SBT Owned</p>
                {txHash && (
                  <p className="mt-2 text-sm text-gray-600">
                    Transaction: <span className="font-mono">{txHash}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={handleMint}
                  disabled={isLoading}
                  className="mt-2 bg-black text-white px-4 py-2 rounded-full hover:opacity-80 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Minting...' : 'Mint SBT'}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            SBT minted on Bepolia! tx: {txHash}
          </div>
        )}
      </div>
    </main>
  );
} 