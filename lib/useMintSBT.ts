import { useState } from 'react';
import { membershipAbi } from '@/contracts/membershipAbi';
import { createPublicClient, http } from 'viem';
import { bepolia } from '@/lib/viemProvider';

interface MintResult {
  txHash?: string;
  error?: string;
}

const contract = { 
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: membershipAbi 
} as const;

const publicClient = createPublicClient({
  chain: bepolia,
  transport: http('https://bepolia.rpc.berachain.com')
});

export function useMintSBT() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState<boolean | null>(null);

  const checkHasMinted = async (walletAddress: `0x${string}`) => {
    console.log('Checking mint status for:', walletAddress);
    try {
      const result = await publicClient.readContract({
        ...contract,
        functionName: 'hasMinted',
        args: [walletAddress]
      }) as boolean;
      console.log('Mint status result:', result);
      setHasMinted(result);
      return result;
    } catch (error) {
      console.error('Error checking mint status:', error);
      return false;
    }
  };

  const mint = async (walletAddress: `0x${string}`): Promise<MintResult> => {
    setIsLoading(true);
    try {
      const alreadyMinted = await checkHasMinted(walletAddress);
      if (alreadyMinted) {
        return { error: 'Wallet already has an SBT' };
      }

      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Minting failed');
      }

      const { txHash } = await response.json();
      setHasMinted(true);
      return { txHash };
    } catch (error) {
      console.error('Minting failed:', error);
      return { error: error instanceof Error ? error.message : 'Minting failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return { mint, isLoading, hasMinted, checkHasMinted };
} 