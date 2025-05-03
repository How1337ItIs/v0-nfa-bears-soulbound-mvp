import { useCallback, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { toast } from 'react-hot-toast';
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
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState<boolean | null>(null);

  const waitForTransaction = useCallback(async (hash: `0x${string}`) => {
    let receipt = null;
    while (!receipt) {
      receipt = await publicClient.getTransactionReceipt({ hash });
      await new Promise(r => setTimeout(r, 3000));
    }
    return receipt.status === 'success';
  }, [publicClient]);

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

  const mint = useCallback(async (code: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, code })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to mint');
      }

      toast.promise(
        waitForTransaction(data.hash),
        {
          loading: 'Minting...',
          success: 'Minted successfully!',
          error: 'Mint failed'
        }
      );
    } catch (error) {
      console.error('Mint error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to mint');
    } finally {
      setIsLoading(false);
    }
  }, [address, waitForTransaction]);

  return { mint, isLoading, hasMinted, checkHasMinted };
} 