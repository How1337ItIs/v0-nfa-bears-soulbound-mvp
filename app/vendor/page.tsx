'use client';

import { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';
import { usePublicClient } from 'wagmi';
import { toast } from 'react-hot-toast';
import { membershipAbi } from '@/contracts/membershipAbi';

// QR Scanner wrapper component
const QRScanner = dynamicImport(
  () => import('@/components/QRScanner'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading scanner...</p>
      </div>
    )
  }
);

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function VendorPage() {
  const [result, setResult] = useState<string | null>(null);
  const [hasSBT, setHasSBT] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!result || !publicClient || !CONTRACT_ADDRESS) return;

    const checkSBT = async () => {
      setIsChecking(true);
      try {
        // Check if the scanned text looks like an Ethereum address
        if (!/^0x[a-fA-F0-9]{40}$/.test(result)) {
          throw new Error('Invalid Ethereum address format');
        }

        const hasMembership = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: membershipAbi,
          functionName: 'hasMinted',
          args: [result as `0x${string}`]
        }) as boolean;
        setHasSBT(hasMembership);
        
        if (hasMembership) {
          toast.success('Valid membership found!');
        } else {
          toast.error('No membership found');
        }
      } catch (error) {
        console.error('Error checking SBT:', error);
        setHasSBT(false);
        toast.error('Failed to verify membership');
      } finally {
        setIsChecking(false);
      }
    };

    checkSBT();
  }, [result, publicClient]);

  const handleScan = (decodedText: string) => {
    console.log('QR scan result:', decodedText);
    setResult(decodedText);
    setHasSBT(null);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Vendor Scanner</h1>
        
        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4">
            Scan a member's wallet QR code to verify their Miracle SBT
          </p>
          <QRScanner onScan={handleScan} />
        </div>
        
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
            <p className="text-sm text-gray-600 mb-2">Scanned Address:</p>
            <p className="font-mono text-sm break-all mb-3 p-2 bg-white rounded border">
              {result}
            </p>
            
            {isChecking ? (
              <div className="flex items-center justify-center p-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600">Verifying membership...</span>
              </div>
            ) : hasSBT !== null ? (
              <div className={`p-3 rounded-lg font-medium text-center ${
                hasSBT 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {hasSBT ? (
                  <>
                    <div className="text-2xl mb-1">✅</div>
                    <div>Valid NFA Bears Membership</div>
                    <div className="text-sm opacity-75 mt-1">Member eligible for discounts</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-1">❌</div>
                    <div>No Membership Found</div>
                    <div className="text-sm opacity-75 mt-1">No discounts available</div>
                  </>
                )}
              </div>
            ) : null}
            
            <button
              onClick={() => {
                setResult(null);
                setHasSBT(null);
              }}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Scan Another
            </button>
          </div>
        )}
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>For vendors:</strong> Members with valid NFTs are eligible for community discounts.
          </p>
        </div>
      </div>
    </div>
  );
} 