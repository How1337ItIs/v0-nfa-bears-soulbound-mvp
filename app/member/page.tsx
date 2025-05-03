'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useMintSBT } from '@/lib/useMintSBT';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const UncleSamSkeleton = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
    <ellipse cx="36" cy="54" rx="24" ry="12" fill="#1A1AFF"/>
    <ellipse cx="36" cy="36" rx="18" ry="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2"/>
    <ellipse cx="36" cy="36" rx="16" ry="20" fill="#FFF"/>
    <ellipse cx="28" cy="38" rx="2.5" ry="3.5" fill="#111"/>
    <ellipse cx="44" cy="38" rx="2.5" ry="3.5" fill="#111"/>
    <ellipse cx="36" cy="48" rx="6" ry="2" fill="#FF2222"/>
    <rect x="24" y="12" width="24" height="12" rx="4" fill="#FF2222" stroke="#111" strokeWidth="2"/>
    <rect x="28" y="8" width="16" height="8" rx="2" fill="#1A1AFF" stroke="#111" strokeWidth="2"/>
    <rect x="32" y="4" width="8" height="8" rx="1" fill="#FFF" stroke="#111" strokeWidth="2"/>
    <rect x="30" y="20" width="12" height="4" rx="2" fill="#C0C0C0"/>
  </svg>
);

export default function MemberPage() {
  const { user, authenticated, logout } = usePrivy();
  const { mint, isLoading, hasMinted, checkHasMinted } = useMintSBT();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [copied, setCopied] = useState(false);

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

  // Check mint status when wallet is available
  useEffect(() => {
    if (user?.wallet?.address) {
      checkHasMinted(user.wallet.address);
    }
  }, [user?.wallet?.address, checkHasMinted]);

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
        setShowToast(true);
        setError(null);
      }
    } catch (error) {
      console.error('Minting failed:', error);
      setError(error instanceof Error ? error.message : 'Minting failed');
    }
  };

  const walletAddress = user?.wallet?.address;
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : 'No wallet connected';

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <UncleSamSkeleton />
        <h1 className="text-4xl font-groovy text-trip-red mb-6 drop-shadow-lg">Member Dashboard</h1>
        <div className="bg-trip-white/90 p-6 rounded-3xl shadow-lg border-4 border-trip-blue wavy-border">
          <div className="mb-4">
            <p className="text-sm text-trip-blue font-accent">Wallet Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-trip-red">{displayAddress}</p>
              <button
                onClick={handleCopy}
                className="ml-2 px-2 py-1 bg-trip-blue text-trip-white rounded font-accent text-xs hover:bg-trip-red transition-colors"
                title="Copy wallet address"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <Image
                src="/bepolia.svg"
                alt="Berachain Bepolia"
                width={24}
                height={24}
                className="inline-block"
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-trip-blue font-accent">Miracle SBT Status</p>
            {hasMinted === null ? (
              <p className="text-trip-blue">Checking status...</p>
            ) : hasMinted ? (
              <div>
                <p className="text-trip-blue font-bold">✓ SBT Owned</p>
                {txHash && (
                  <p className="mt-2 text-sm text-trip-red font-mono">
                    Transaction: <span>{txHash}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={handleMint}
                  disabled={isLoading}
                  className="mt-2 bg-trip-blue text-trip-white px-6 py-3 rounded-full font-groovy text-lg shadow-md hover:bg-trip-red hover:text-trip-white transition-all duration-200 disabled:opacity-50 border-4 border-trip-red wavy-border"
                >
                  {isLoading ? 'Minting...' : 'Mint SBT'}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-trip-red font-bold">{error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-trip-blue text-trip-white px-4 py-2 rounded-lg shadow-lg font-groovy text-lg border-4 border-trip-red wavy-border">
            SBT minted on Bepolia! tx: {txHash}
          </div>
        )}

        <button
          onClick={logout}
          className="mt-8 bg-trip-red text-trip-white px-6 py-3 rounded-full font-groovy text-lg shadow-md hover:bg-trip-blue hover:text-trip-white transition-all duration-200 border-4 border-trip-blue wavy-border"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}

// Add wavy border style
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `.wavy-border { border-radius: 2rem; border-style: solid; border-width: 4px; box-shadow: 0 0 24px 4px #1A1AFFAA; }
  .wavy-border { border-image: repeating-linear-gradient(135deg, #FF2222 0 10px, #1A1AFF 10px 20px, #FFFFFF 20px 30px, #FF2222 30px 40px, #1A1AFF 40px 50px) 30; }`;
  document.head.appendChild(style);
} 