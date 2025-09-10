import { useCallback, useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { membershipAbi } from '@/contracts/membershipAbi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useMintSBT() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, isPending: isWritePending, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const [hasMinted, setHasMinted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'checking' | 'minting' | 'confirming' | 'success' | 'error'>('idle');

  // Check if user already has a minted SBT on account change
  useEffect(() => {
    if (address && isConnected) {
      checkHasMinted(address);
    }
  }, [address, isConnected]);

  // Handle transaction confirmation
  useEffect(() => {
    console.log('🎪 Transaction state:', { isConfirmed, hash, isWritePending, isConfirming });
    if (isConfirmed && hash) {
      console.log('✅ Transaction confirmed! Setting success state...');
      setHasMinted(true);
      setMintStatus('success');
      setIsLoading(false);
      toast.success('🎉 Miracle SBT minted successfully! Welcome to the NFA Bears family!');
    }
  }, [isConfirmed, hash]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setMintStatus('error');
      setIsLoading(false);
      const errorMessage = writeError.message.includes('User rejected') 
        ? 'Transaction rejected by user'
        : 'Failed to mint SBT. Please try again.';
      toast.error(errorMessage);
    }
  }, [writeError]);

  const checkHasMinted = useCallback(async (walletAddress: `0x${string}`) => {
    if (!publicClient || !CONTRACT_ADDRESS) {
      console.error('Missing public client or contract address');
      return false;
    }

    setMintStatus('checking');
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: membershipAbi,
        functionName: 'hasMinted',
        args: [walletAddress]
      }) as boolean;
      
      setHasMinted(result);
      setMintStatus('idle');
      return result;
    } catch (error) {
      console.error('Error checking mint status:', error);
      setHasMinted(false);
      setMintStatus('error');
      return false;
    }
  }, [publicClient]);

  const mintWithCode = useCallback(async (inviteCode: string): Promise<void> => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    if (!CONTRACT_ADDRESS) {
      toast.error('Contract not configured');
      throw new Error('Contract address not set');
    }

    // Check if already minted
    if (hasMinted) {
      toast.error('You already have a Miracle SBT');
      throw new Error('Already minted');
    }

    setIsLoading(true);
    setMintStatus('minting');

    try {
      console.log('🎪 Starting 60-Second Miracle flow for:', address);
      
      // Step 1: Verify invite code and location
      console.log('🔍 Sending verification request:', { code: inviteCode.substring(0, 20) + '...', address });
      
      const verifyResponse = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: inviteCode,
          address: address 
        })
      });

      console.log('🔍 Verification response status:', verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('🔍 Verification error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Invite verification failed');
        } catch {
          throw new Error(`Verification failed: ${verifyResponse.status} - ${errorText}`);
        }
      }

      const verificationData = await verifyResponse.json();
      console.log('✅ Invite verified:', verificationData);

      // Step 2: Mint SBT via smart contract
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: membershipAbi,
        functionName: 'mintMembership',
        args: [address]
      });

    } catch (error) {
      console.error('🚨 Mint error:', error);
      setMintStatus('error');
      setIsLoading(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint SBT';
      toast.error(errorMessage);
      throw error;
    }
  }, [address, isConnected, hasMinted, writeContract]);

  const mintDirectly = useCallback(async (): Promise<void> => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    if (!CONTRACT_ADDRESS) {
      toast.error('Contract not configured');
      throw new Error('Contract address not set');
    }

    // Check if already minted
    if (hasMinted) {
      toast.error('You already have a Miracle SBT');
      throw new Error('Already minted');
    }

    setIsLoading(true);
    setMintStatus('minting');

    try {
      console.log('🎪 Direct minting SBT for:', address);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: membershipAbi,
        functionName: 'mintMembership',
        args: [address]
      });

    } catch (error) {
      console.error('🚨 Direct mint error:', error);
      setMintStatus('error');
      setIsLoading(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint SBT';
      toast.error(errorMessage);
      throw error;
    }
  }, [address, isConnected, hasMinted, writeContract]);

  return { 
    // Main functions
    mintWithCode,
    mintDirectly,
    checkHasMinted,
    
    // State
    isLoading: isLoading || isWritePending || isConfirming,
    hasMinted,
    mintStatus,
    
    // Transaction details
    transactionHash: hash,
    isConfirmed,
    
    // Detailed loading states
    isChecking: mintStatus === 'checking',
    isMinting: mintStatus === 'minting' || isWritePending,
    isConfirming,
    isSuccess: mintStatus === 'success' && isConfirmed,
    isError: mintStatus === 'error' || !!writeError,
  };
}
