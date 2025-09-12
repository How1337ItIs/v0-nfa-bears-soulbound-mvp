'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const GENESIS_BEARS_ADDRESS = process.env.NEXT_PUBLIC_GENESIS_BEARS_CONTRACT as `0x${string}`;
const BERACHAIN_TESTNET_ID = 80069; // Berachain Bepolia testnet

const GENESIS_BEARS_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}],
    "name": "publicMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export default function MintGenesisPage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { login } = usePrivy();
  const { wallets } = useWallets();
  const [quantity, setQuantity] = useState(1);
  const [isMintingLocal, setIsMintingLocal] = useState(false);
  const { writeContractAsync, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  // wagmi v2 pattern: Atomic chain switching + transaction
  const mintWithChainSwitch = async () => {
    try {
      // Step 1: Check if we need to switch chains
      if (chain?.id !== BERACHAIN_TESTNET_ID) {
        console.log(`Switching from chain ${chain?.id} to Bepolia (${BERACHAIN_TESTNET_ID})`);
        toast('Switching to Berachain Bepolia testnet...');
        
        await switchChainAsync({ chainId: BERACHAIN_TESTNET_ID });
        toast.success('✅ Switched to Berachain Bepolia testnet');
      }

      // Step 2: Execute the transaction atomically
      console.log('Executing mint transaction on Bepolia...');
      const result = await writeContractAsync({
        address: GENESIS_BEARS_ADDRESS,
        abi: GENESIS_BEARS_ABI,
        functionName: 'publicMint',
        args: [BigInt(quantity)],
        // Let wagmi handle gas estimation automatically
      });
      
      toast.success('Genesis Bears mint transaction submitted!');
      return result;
      
    } catch (error: any) {
      console.error('Mint with chain switch failed:', error);
      
      // Handle specific error types
      if (error?.code === 4001) {
        toast.error('🚫 Looks like you changed your mind - that\'s cool, we\'ll get everything just exactly perfect when you\'re ready');
      } else if (error?.message?.includes('Chain not configured')) {
        toast.error('⚠️ Our crack equipment team needs Berachain Bepolia to get everything just exactly perfect!');
      } else if (error?.message?.includes('User rejected')) {
        toast.error('🚫 Come on, Bear, get it together! Network switch rejected.');
      } else {
        toast.error(`Things are really weird up here: ${error.message || 'Beyond the pale, man'}`);
      }
      throw error;
    }
  };

  // Only display network status, don't auto-switch on connection (2025 UX best practice)

  const mintGenesisBears = async () => {
    if (!isConnected || !address) {
      toast.error('Alright, alright... you don\'t have to scream at us - connect your wallet first!');
      return;
    }

    if (!GENESIS_BEARS_ADDRESS) {
      toast.error('We lost the keys to the wardrobe - Genesis Bears contract not configured');
      return;
    }

    if (isMintingLocal) {
      return; // Prevent multiple clicks
    }

    setIsMintingLocal(true);
    try {
      // Use the new atomic chain switching + transaction pattern
      await mintWithChainSwitch();
    } catch (error) {
      // Error already handled in mintWithChainSwitch
    } finally {
      setIsMintingLocal(false);
    }
  };

  // Show network warning if on wrong chain
  const isWrongNetwork = isConnected && chainId !== BERACHAIN_TESTNET_ID;

  return (
    <div className="min-h-screen tie-dye-bg p-4 relative overflow-hidden">
      {/* 60s Liquid Light Show Background */}
      <div className="absolute inset-0 liquid-light-flow opacity-25"></div>
      
      {/* Floating Lava Lamp Blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 psychedelic-gradient-1 oil-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 psychedelic-gradient-2 oil-blob-2" style={{ animationDelay: "5s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 psychedelic-gradient-3 oil-blob-3" style={{ animationDelay: "10s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 psychedelic-gradient-1 oil-blob" style={{ animationDelay: "15s" }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Network Warning - Oil Slick Style */}
        {isWrongNetwork && (
          <div className="mb-6 p-4 psychedelic-gradient-2 oil-blob-2 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold liquid-chrome">⚠️ Wrong Network</p>
                <p className="text-white/80 text-sm">Please switch to Berachain testnet to mint Genesis Bears</p>
              </div>
              <button
                onClick={() => switchChainAsync({ chainId: BERACHAIN_TESTNET_ID }).catch(console.error)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors syrupy-button"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        {/* Main Mint Card - Lava Lamp Style */}
        <div className="oil-glassmorphic oil-blob-2 shadow-lg p-8 relative overflow-hidden">
          {/* Kaleidoscope Background */}
          <div className="absolute inset-0 kaleidoscope opacity-10"></div>
          
          <h1 className="text-3xl font-bold text-white mb-6 psychedelic-text relative z-10">🐻 Genesis Bears Mint</h1>
          
          <div className="space-y-6 relative z-10">
            {/* Wallet Address - Oil Blob Style */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 liquid-chrome">
                Wallet Address
              </label>
              <div className="psychedelic-gradient-1 oil-blob-3 p-3">
                <p className="font-mono text-sm text-white">
                  {address || 'Not connected'}
                </p>
              </div>
            </div>

            {/* Contract Address - Oil Blob Style */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 liquid-chrome">
                Genesis Bears Contract (Berachain Testnet)
              </label>
              <div className="psychedelic-gradient-2 oil-blob p-3">
                <p className="font-mono text-sm text-white">
                  {GENESIS_BEARS_ADDRESS || 'Not configured'}
                </p>
              </div>
            </div>

            {/* Quantity Selector - Melting Style */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 liquid-chrome">
                Quantity (max 3 per transaction, 5 per wallet)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white syrupy-button"
                />
                {/* Floating Oil Droplets around input */}
                <div className="absolute -top-2 -right-2 w-3 h-3 psychedelic-gradient-3 oil-blob-2 opacity-60"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 psychedelic-gradient-1 oil-blob-3 opacity-50"></div>
              </div>
            </div>

            {/* Mint Button - Psychedelic Style */}
            <button
              onClick={mintGenesisBears}
              disabled={isMintingLocal || isPending || isConfirming || !address || isWrongNetwork}
              className="w-full psychedelic-gradient-1 oil-blob text-white font-bold py-3 px-6 syrupy-button disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isMintingLocal || isPending || isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="liquid-chrome">
                    {isMintingLocal ? 'Preparing mint...' : isPending ? 'Confirming...' : 'Waiting for confirmation...'}
                  </span>
                </div>
              ) : (
                <span className="liquid-chrome">
                  `Mint ${quantity} Genesis Bear${quantity !== 1 ? 's' : ''} (FREE on Testnet)`
                </span>
              )}
            </button>

            {/* Error State - Trippy Morphing Style */}
            {error && (
              <div className="p-4 psychedelic-gradient-2 oil-blob-2 border border-white/20">
                <p className="text-white font-semibold liquid-chrome">Transaction Failed</p>
                <p className="text-white/80 text-sm">{error.message}</p>
              </div>
            )}

            {/* Success State - Psychedelic Style */}
            {hash && (
              <div className="p-4 psychedelic-gradient-1 oil-blob-3 border border-white/20">
                <p className="text-white font-semibold liquid-chrome">Transaction Submitted!</p>
                <p className="text-white/80 text-sm">
                  Hash: <span className="font-mono break-all">{hash}</span>
                </p>
                <p className="text-white/80 text-sm mt-2">
                  Check <a href={`https://bepolia.beratrail.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white liquid-chrome">Berachain Explorer</a>
                </p>
              </div>
            )}
          </div>

          {/* Instructions - Oil Slick Style */}
          <div className="mt-8 p-4 psychedelic-gradient-3 oil-blob border border-white/20 relative z-10">
            <h3 className="font-semibold text-white mb-2 liquid-chrome">📋 Instructions:</h3>
            <ol className="text-white/80 text-sm space-y-1 list-decimal list-inside">
              <li>Connect your wallet</li>
              <li>Switch to Berachain testnet (will auto-prompt)</li>
              <li>Get testnet BERA from <a href="https://bepolia.faucet.berachain.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/80 liquid-chrome">Bepolia Faucet</a></li>
              <li>Choose quantity (1-3 bears per transaction)</li>
              <li>Click "Mint Genesis Bears" and approve transaction</li>
              <li>Wait for confirmation - you'll become a Genesis holder!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
