'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { authenticated, login, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/member');
    }
  }, [authenticated, router]);

  if (!ready) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </main>
    );
  }

  if (authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome to NFA Bears</h1>
        <p className="text-gray-600 mb-8">
          Sign in with your email to begin your Miracle SBT journey. We'll help you create a wallet if you don't have one.
        </p>
        <button
          onClick={() => login()}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Sign In
        </button>
      </div>
    </main>
  );
}
