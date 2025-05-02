'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/member');
    }
  }, [authenticated, router]);

  if (authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome to NFA Bears</h1>
        <p className="text-gray-600 mb-8">
          Connect your wallet to get started with your Miracle SBT journey.
        </p>
      </div>
    </main>
  );
}
