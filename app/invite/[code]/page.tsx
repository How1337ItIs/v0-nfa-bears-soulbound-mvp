'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createHmac } from 'crypto';
import { redis } from '@/lib/redis';
import { getVenue } from '@/lib/venues';

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

export default function InvitePage({ params }: { params: { code: string } }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyInvite() {
      try {
        const timestamp = searchParams.get('t');
        const signature = searchParams.get('s');

        if (!timestamp || !signature) {
          throw new Error('Invalid invite URL');
        }

        // Verify HMAC
        const hmac = createHmac('sha256', process.env.SECRET_KEY || '');
        hmac.update(`${params.code}|${timestamp}`);
        const expectedSignature = hmac.digest('hex');

        if (signature !== expectedSignature) {
          throw new Error('Invalid signature');
        }

        // Check timestamp drift (60 seconds max)
        const now = Math.floor(Date.now() / 1000);
        const drift = Math.abs(now - parseInt(timestamp));
        if (drift > 60) {
          throw new Error('Invite expired');
        }

        // Delete from Redis first
        const key = `invite:${params.code}`;
        const exists = await redis.del(key);
        if (!exists) {
          throw new Error('Invite already used or expired');
        }

        // Extract venue ID and verify
        const [venueId] = params.code.split(':');
        const venue = getVenue(venueId);
        if (!venue) {
          throw new Error('Invalid venue');
        }

        // Skip GPS check in dev if enabled
        if (process.env.DEV_SKIP_GPS !== 'true') {
          const position = await new Promise<Location>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
              reject,
              { enableHighAccuracy: true }
            );
          });

          if (!isWithinRadius(position, venue, venue.radius)) {
            throw new Error('You must be at the venue to use this invite');
          }
        }

        setStatus('success');
        // Proceed with Privy login + Miracle SBT mint flow
        // ... existing logic ...

      } catch (error) {
        console.error('Error verifying invite:', error);
        setError(error instanceof Error ? error.message : 'Failed to verify invite');
        setStatus('error');
      }
    }

    verifyInvite();
  }, [params.code, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying invite...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Success!</h1>
        <p className="text-gray-600">Proceeding with login...</p>
      </div>
    </div>
  );
} 