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
    <div className="min-h-screen tie-dye-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Network Warning */}
        {isWrongNetwork && (
          <div className="mb-6 p-4 bg-red-500/90 border border-red-600 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">⚠️ Wrong Network</p>
                <p className="text-red-100 text-sm">Please switch to Berachain testnet to mint Genesis Bears</p>
              </div>
              <button
                onClick={() => switchChainAsync({ chainId: BERACHAIN_TESTNET_ID }).catch(console.error)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}


        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">🐻 Genesis Bears Mint</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Wallet Address
              </label>
              <p className="font-mono text-sm bg-black/20 text-white p-3 rounded border border-white/20">
                {address || 'Not connected'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Genesis Bears Contract (Berachain Testnet)
              </label>
              <p className="font-mono text-sm bg-black/20 text-white p-3 rounded border border-white/20">
                {GENESIS_BEARS_ADDRESS || 'Not configured'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Quantity (max 3 per transaction, 5 per wallet)
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white"
              />
            </div>

            <button
              onClick={mintGenesisBears}
              disabled={isMintingLocal || isPending || isConfirming || !address || isWrongNetwork}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMintingLocal || isPending || isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isMintingLocal ? 'Preparing mint...' : isPending ? 'Confirming...' : 'Waiting for confirmation...'}
                </div>
              ) : (
                `Mint ${quantity} Genesis Bear${quantity !== 1 ? 's' : ''} (FREE on Testnet)`
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400 rounded-lg">
                <p className="text-red-300 font-semibold">Transaction Failed</p>
                <p className="text-red-200 text-sm">{error.message}</p>
              </div>
            )}

            {hash && (
              <div className="p-4 bg-green-500/20 border border-green-400 rounded-lg">
                <p className="text-green-300 font-semibold">Transaction Submitted!</p>
                <p className="text-green-200 text-sm">
                  Hash: <span className="font-mono break-all">{hash}</span>
                </p>
                <p className="text-green-200 text-sm mt-2">
                  Check <a href={`https://bepolia.beratrail.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-100">Berachain Explorer</a>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
            <h3 className="font-semibold text-blue-200 mb-2">📋 Instructions:</h3>
            <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
              <li>Connect your wallet</li>
              <li>Switch to Berachain testnet (will auto-prompt)</li>
              <li>Get testnet BERA from <a href="https://bepolia.faucet.berachain.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline hover:text-blue-200">Bepolia Faucet</a></li>
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
