'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

const GENESIS_BEARS_ADDRESS = process.env.NEXT_PUBLIC_GENESIS_BEARS_CONTRACT as `0x${string}`;

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
  const { address } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const mintGenesisBears = async () => {
    if (!address || !GENESIS_BEARS_ADDRESS) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await writeContract({
        address: GENESIS_BEARS_ADDRESS,
        abi: GENESIS_BEARS_ABI,
        functionName: 'publicMint',
        args: [BigInt(quantity)],
      });
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🐻 Genesis Bears Test Mint</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <p className="font-mono text-sm bg-gray-100 p-3 rounded">
                {address || 'Not connected'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genesis Bears Contract
              </label>
              <p className="font-mono text-sm bg-gray-100 p-3 rounded">
                {GENESIS_BEARS_ADDRESS || 'Not configured'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (max 3 per transaction, 5 per wallet)
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={mintGenesisBears}
              disabled={isPending || isConfirming || !address}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending || isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isPending ? 'Confirming...' : 'Waiting for confirmation...'}
                </div>
              ) : (
                `Mint ${quantity} Genesis Bear${quantity !== 1 ? 's' : ''}`
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">Transaction Failed</p>
                <p className="text-red-600 text-sm">{error.message}</p>
              </div>
            )}

            {hash && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">Transaction Submitted!</p>
                <p className="text-green-600 text-sm">
                  Hash: <span className="font-mono">{hash}</span>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>Connect your wallet</li>
              <li>Choose quantity (1-3 bears per transaction)</li>
              <li>Click "Mint Genesis Bears"</li>
              <li>Approve the transaction in your wallet</li>
              <li>Wait for confirmation</li>
              <li>Go to /member to see your Genesis Bears status</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}