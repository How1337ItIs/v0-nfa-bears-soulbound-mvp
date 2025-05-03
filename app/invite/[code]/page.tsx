'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { verifyCoordinates } from '@/lib/location';

export default function InvitePage({ params }: { params: { code: string } }) {
  const { user, authenticated } = usePrivy();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  const getLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    } catch (error) {
      setError('Location access is required to mint');
    }
  };

  const handleMint = async () => {
    if (!location) {
      setError('Please enable location access');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: user?.wallet?.address,
          code: params.code,
          coordinates: location,
          secret: new URLSearchParams(window.location.search).get('secret')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mint');
      }

      router.push('/success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Mint Your NFA Bears Membership</h1>
      
      {!location ? (
        <button
          onClick={getLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enable Location
        </button>
      ) : (
        <button
          onClick={handleMint}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Minting...' : 'Mint Membership'}
        </button>
      )}

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
} 