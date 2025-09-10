'use client';


import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BERACHAIN_BEPOLIA_ID = 80069;

export default function WalletHeader() {
  const { address, isConnected } = useAccount();
  const { logout, login } = usePrivy();
  const { wallets } = useWallets();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const router = useRouter();

  const handleDisconnect = async () => {
    await disconnect();
    await logout();
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isWrongNetwork = isConnected && chainId !== BERACHAIN_BEPOLIA_ID;

  // Simplified network switching using Privy for all wallet types
  const handleNetworkSwitch = async () => {
    const activeWallet = wallets.find(wallet => wallet.address === address);
    
    if (!activeWallet) {
      toast.error('No active wallet found');
      return;
    }

    try {
      await activeWallet.switchChain(BERACHAIN_BEPOLIA_ID);
      toast.success('✅ Switched to Berachain Bepolia testnet');
    } catch (switchError: any) {      
      if (switchError?.code === 4001) {
        toast.error('🚫 Network switch rejected');
      } else if (switchError?.message?.includes('not configured') || switchError?.message?.includes('not supported')) {
        toast.error('⚠️ Berachain Bepolia not supported by your wallet');
      } else {
        toast.error('⚠️ Unable to switch networks');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 glassmorphic border-b border-white/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors magnetic-button"
          >
            <span className="text-2xl float-animation">🐻</span>
            <span className="font-bold text-lg groovy-font glow-text">NFA Bears</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white/80 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/mint-genesis')}
              className="text-white/80 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              Mint Genesis
            </button>
            <button
              onClick={() => router.push('/scan')}
              className="text-white/80 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              Scan SBT
            </button>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <>
                {/* Network Indicator - clickable to switch */}
                <button
                  onClick={isWrongNetwork ? handleNetworkSwitch : undefined}
                  className={`px-3 py-1 rounded-lg text-xs font-medium glassmorphic border transition-colors ${
                    isWrongNetwork 
                      ? 'border-red-400/30 bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer'
                      : 'border-green-400/30 bg-green-500/20 text-green-300 cursor-default'
                  }`}
                  title={isWrongNetwork ? 'Click to switch to Bepolia' : 'Connected to Bepolia'}
                >
                  {isWrongNetwork ? '⚠️ Wrong Network' : '✅ Bepolia'}
                </button>

                {/* Address Display */}
                <div className="glassmorphic rounded-lg px-3 py-2 border border-white/20">
                  <span className="text-white text-sm font-mono glow-text">
                    {truncateAddress(address as string)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm transition-colors magnetic-button"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => login()}
                className="aurora-gradient text-white px-4 py-2 rounded-lg font-medium magnetic-button transition-all shadow-lg glow-text"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}