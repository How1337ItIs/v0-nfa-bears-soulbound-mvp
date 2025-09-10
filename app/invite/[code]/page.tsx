'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useMintSBT } from '@/lib/useMintSBT';
import { getVenue } from '@/lib/venues';
import { toast } from 'react-hot-toast';

interface Location {
  latitude: number;
  longitude: number;
}

function isWithinRadius(
  userLocation: Location,
  venueLocation: { lat: number; lng: number },
  radius: number
): boolean {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (userLocation.latitude * Math.PI) / 180;
  const φ2 = (venueLocation.lat * Math.PI) / 180;
  const Δφ = ((venueLocation.lat - userLocation.latitude) * Math.PI) / 180;
  const Δλ = ((venueLocation.lng - userLocation.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radius;
}

type FlowStatus = 'verifying' | 'needs-auth' | 'needs-location' | 'minting' | 'success' | 'error';

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  // URL decode the invite code since Next.js encodes URL parameters
  const decodedCode = decodeURIComponent(resolvedParams.code);
  return <InvitePageClient code={decodedCode} />;
}

function InvitePageClient({ code }: { code: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, authenticated, ready } = usePrivy();
  const { address } = useAccount();
  const { mintWithCode, isLoading: isMinting, hasMinted, checkHasMinted, isSuccess, isMinting: isMintingState } = useMintSBT();

  // Debug logging
  console.log('🎪 InvitePageClient received code:', code);
  console.log('🎪 Code length:', code.length);
  console.log('🎪 Code parts:', code.split(':').length);
  
  const [status, setStatus] = useState<FlowStatus>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  
  // Verify invite code and extract venue info
  const verifyInvite = useCallback(async () => {
    try {
      console.log('Verifying invite code:', code);

      // Verify invite with backend
      const response = await fetch(`/api/invite?code=${code}`);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', response.status, errorData);
        throw new Error('Invalid or expired invite code');
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      if (!data.success) {
        throw new Error('Invite code verification failed');
      }

      // Get venue info
      const venueData = getVenue(data.venueId);
      if (!venueData) {
        throw new Error('Invalid venue');
      }
      
      setVenue(venueData);
      
      // GPS verification is required unless explicitly disabled in development
      // Production environments should never skip GPS verification
      const shouldSkipGPS = process.env.NODE_ENV === 'development' && 
                           process.env.NEXT_PUBLIC_DEV_SKIP_GPS === 'true' &&
                           process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
      
      if (shouldSkipGPS) {
        console.warn('⚠️ GPS verification bypassed in development mode');
        console.log('✅ Bypassing GPS, setting status to needs-auth');
        setStatus('needs-auth');
      } else {
        console.log('📍 GPS verification required, setting status to needs-location');
        setStatus('needs-location');
      }
    } catch (error) {
      console.error('Invite verification failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify invite');
      setStatus('error');
    }
  }, [code, searchParams]);

  // Get user location
  const getUserLocation = useCallback(async () => {
    try {
      const position = await new Promise<Location>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
          (error) => reject(new Error('Location access denied. Please enable location services.')),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      setUserLocation(position);
      
      // Verify location if venue requires it
      if (venue && !isWithinRadius(position, venue, venue.radius)) {
        throw new Error(`You must be within ${venue.radius}m of ${venue.name} to use this invite`);
      }
      
      setStatus('needs-auth');
    } catch (error) {
      console.error('Location error:', error);
      setError(error instanceof Error ? error.message : 'Location verification failed');
      setStatus('error');
    }
  }, [venue]);

  // Complete the minting process
  const completeMint = useCallback(async () => {
    if (!address) return;
    
    try {
      setStatus('minting');
      
      // Check if already minted
      const alreadyMinted = await checkHasMinted(address);
      if (alreadyMinted) {
        toast.success('Welcome back! You already have a Miracle SBT.');
        setStatus('success');
        return;
      }

      // Mint the SBT
      await mintWithCode(code);
      // Success and redirect handled by transaction confirmation useEffect
    } catch (error) {
      console.error('Minting failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to mint membership');
      setStatus('error');
    }
  }, [address, checkHasMinted, mintWithCode, code, router]);

  // Flow control effects
  useEffect(() => {
    if (status === 'verifying') {
      verifyInvite();
    }
  }, [status, verifyInvite]);

  useEffect(() => {
    if (status === 'needs-location') {
      getUserLocation();
    }
  }, [status, getUserLocation]);

  useEffect(() => {
    console.log('🎪 Auth flow check:', { status, ready, authenticated, address: !!address });
    if (status === 'needs-auth' && ready && authenticated && address) {
      console.log('🚀 All conditions met, calling completeMint...');
      completeMint();
    }
  }, [status, ready, authenticated, address, completeMint]);

  // Handle successful minting and redirect
  useEffect(() => {
    console.log('🎪 Minting status check:', { isSuccess, hasMinted, status, isMintingState });
    
    // Redirect if transaction succeeded OR if user already has SBT
    if ((isSuccess && hasMinted) || (hasMinted && status === 'success' && !isMintingState)) {
      console.log('🎉 Minting complete (or already minted)! Redirecting...');
      
      // Redirect after success to Dead Easy Guide
      setTimeout(() => {
        console.log('🔄 Redirecting to /dead-easy-guide');
        router.push('/dead-easy-guide');
      }, 3000);
    }
  }, [isSuccess, hasMinted, status, isMintingState, router]);

  // Render based on current status
  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Verifying invite...</p>
        </div>
      </div>
    );
  }

  if (status === 'needs-location') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Location Required</h1>
            <p className="text-gray-600">We need to verify you're at <strong>{venue?.name}</strong> to continue.</p>
          </div>
          <button
            onClick={getUserLocation}
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Share Location
          </button>
        </div>
      </div>
    );
  }

  if (status === 'needs-auth' && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to NFA Bears!</h1>
            <p className="text-gray-600 mb-6">You're verified at <strong>{venue?.name}</strong>. Let's create your account to claim your Miracle SBT.</p>
          </div>
          <button
            onClick={login}
            className="w-full py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Account & Claim NFT
          </button>
        </div>
      </div>
    );
  }

  if (status === 'minting' || isMinting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Minting Your NFT</h1>
          <p className="text-gray-600">Creating your Miracle SBT membership token...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Family!</h1>
            <p className="text-gray-600 mb-6">Your Miracle SBT has been minted successfully. You're now part of the NFA Bears community.</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Redirecting to your onboarding guide...</p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return null;
} 