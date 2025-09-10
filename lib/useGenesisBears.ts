'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { wagmiConfig as config } from '@/app/providers/PrivySetup';

const GENESIS_BEARS_ADDRESS = process.env.NEXT_PUBLIC_GENESIS_BEARS_CONTRACT as `0x${string}`;

const GENESIS_BEARS_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "isGenesisBearHolder",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "tokensOfOwner",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface GenesisBearData {
  isHolder: boolean;
  balance: number;
  tokenIds: string[];
  loading: boolean;
  error: string | null;
}

export function useGenesisBears() {
  const { address } = useAccount();
  const [data, setData] = useState<GenesisBearData>({
    isHolder: false,
    balance: 0,
    tokenIds: [],
    loading: false,
    error: null,
  });

  const checkGenesisBears = useCallback(async (walletAddress: string) => {
    if (!GENESIS_BEARS_ADDRESS || !walletAddress) {
      setData(prev => ({ ...prev, loading: false, error: 'Missing contract address or wallet address' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if holder
      const isHolder = await readContract(config, {
        address: GENESIS_BEARS_ADDRESS,
        abi: GENESIS_BEARS_ABI,
        functionName: 'isGenesisBearHolder',
        args: [walletAddress as `0x${string}`],
      });

      // Get balance
      const balance = await readContract(config, {
        address: GENESIS_BEARS_ADDRESS,
        abi: GENESIS_BEARS_ABI,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      });

      let tokenIds: string[] = [];
      if (isHolder && balance > 0) {
        // Get token IDs
        const tokens = await readContract(config, {
          address: GENESIS_BEARS_ADDRESS,
          abi: GENESIS_BEARS_ABI,
          functionName: 'tokensOfOwner',
          args: [walletAddress as `0x${string}`],
        });
        tokenIds = tokens.map(id => id.toString());
      }

      setData({
        isHolder: Boolean(isHolder),
        balance: Number(balance),
        tokenIds,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error checking Genesis Bears:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check Genesis Bears',
      }));
    }
  }, []);

  // Auto-check when address changes
  useEffect(() => {
    if (address) {
      checkGenesisBears(address);
    } else {
      setData({
        isHolder: false,
        balance: 0,
        tokenIds: [],
        loading: false,
        error: null,
      });
    }
  }, [address, checkGenesisBears]);

  const refresh = useCallback(() => {
    if (address) {
      checkGenesisBears(address);
    }
  }, [address, checkGenesisBears]);

  return {
    ...data,
    refresh,
    contractAddress: GENESIS_BEARS_ADDRESS,
  };
}
