'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { ready, authenticated, login } = usePrivy();
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-center">Loading...</p>
        </div>
      </main>
    );
  }

  if (authenticated) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Login to NFA Bears</h1>
        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded-full hover:opacity-80 transition-all duration-200"
        >
          Sign in with email
        </button>
      </div>
    </main>
  );
}
