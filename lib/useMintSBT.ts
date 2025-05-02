import { useState } from 'react';
import { walletClient } from './ethersProvider';
import { membershipAbi } from '@/contracts/membershipAbi';

interface MintResult {
  txHash?: string;
  error?: string;
}

const contract = { 
  address: '0xDeaDbeefDeaDbeefDeaDbeefDeaDbeefDeaDbeeF' as const,
  abi: membershipAbi 
} as const;

export function useMintSBT() {
  const [isLoading, setIsLoading] = useState(false);

  const mint = async (walletAddress: string): Promise<MintResult> => {
    setIsLoading(true);
    try {
      const txHash = await walletClient.writeContract({
        ...contract,
        functionName: 'mintMembership',
        account: '0xRelayer',
        args: [walletAddress]
      });
      
      return { txHash };
    } catch (error) {
      console.error('Minting failed:', error);
      return { error: error instanceof Error ? error.message : 'Minting failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return { mint, isLoading };
} 