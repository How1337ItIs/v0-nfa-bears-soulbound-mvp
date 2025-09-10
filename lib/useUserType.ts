'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useGenesisBears } from './useGenesisBears';
import { useMintSBT } from './useMintSBT';

export type UserType = 'GENESIS_HOLDER' | 'SBT_HOLDER' | 'NEW_USER';

interface UserTypeData {
  userType: UserType;
  loading: boolean;
  error: string | null;
  // Additional data for context
  genesisBalance: number;
  hasGenesis: boolean;
  hasSBT: boolean;
  genesisTokenIds: string[];
}

export function useUserType() {
  const { address, isConnected } = useAccount();
  const { isHolder: hasGenesis, balance: genesisBalance, tokenIds: genesisTokenIds, loading: genesisLoading, error: genesisError } = useGenesisBears();
  const { hasMinted: hasSBT, isChecking: sbtLoading, mintStatus } = useMintSBT();
  
  const [data, setData] = useState<UserTypeData>({
    userType: 'NEW_USER',
    loading: false,
    error: null,
    genesisBalance: 0,
    hasGenesis: false,
    hasSBT: false,
    genesisTokenIds: [],
  });

  // Determine user type based on NFT holdings
  const determineUserType = useCallback((): UserType => {
    // Genesis holders are Tier 1 - highest priority
    if (hasGenesis && genesisBalance > 0) {
      return 'GENESIS_HOLDER';
    }
    
    // SBT holders are Tier 2 
    if (hasSBT) {
      return 'SBT_HOLDER';
    }
    
    // No NFTs found = new user
    return 'NEW_USER';
  }, [hasGenesis, genesisBalance, hasSBT]);

  // Update data when NFT holdings change
  useEffect(() => {
    const loading = genesisLoading || sbtLoading || mintStatus === 'checking';
    const error = genesisError || null;
    const userType = determineUserType();

    setData({
      userType,
      loading,
      error,
      genesisBalance,
      hasGenesis,
      hasSBT: hasSBT ?? false,
      genesisTokenIds,
    });
  }, [
    hasGenesis,
    genesisBalance,
    genesisTokenIds,
    hasSBT,
    genesisLoading,
    sbtLoading,
    genesisError,
    mintStatus,
    determineUserType
  ]);

  // Reset when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      setData({
        userType: 'NEW_USER',
        loading: false,
        error: null,
        genesisBalance: 0,
        hasGenesis: false,
        hasSBT: false,
        genesisTokenIds: [],
      });
    }
  }, [isConnected, address]);

  const refresh = useCallback(() => {
    // The underlying hooks will refresh automatically when called
    // This is mainly for manual refresh if needed
    setData(prev => ({ ...prev, loading: true, error: null }));
  }, []);

  return {
    ...data,
    refresh,
    // Helper booleans for easy access
    isGenesisHolder: data.userType === 'GENESIS_HOLDER',
    isSBTHolder: data.userType === 'SBT_HOLDER', 
    isNewUser: data.userType === 'NEW_USER',
    // Connection state
    isConnected,
    address,
  };
}
