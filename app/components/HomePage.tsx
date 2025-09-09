'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { authenticated, login, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/dashboard');
    }
  }, [authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NFA Bears...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing Web3 connection...</p>
        </div>
      </div>
    );
  }

  if (authenticated) return null;

  return (
    <div className="min-h-screen tie-dye-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="text-6xl mb-6">🐻✨</div>
            <h1 className="text-5xl font-bold text-white glow-text groovy-font mb-6 dancing-bear">
              NFA Bears
            </h1>
            <p className="text-xl text-white mb-4">
              <strong className="aurora-gradient bg-clip-text text-transparent">Not Fade Away</strong> • <strong className="aurora-gradient bg-clip-text text-transparent">Not Financial Advice</strong> • <strong className="aurora-gradient bg-clip-text text-transparent">Non-Fungible Acid Bears</strong>
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Where the Grateful Dead parking lot meets the blockchain. Real family shit, not crypto hype.
            </p>
            
            <div className="p-6 glassmorphic rounded-xl liquid-morph mb-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-white mb-4">Get Your Miracle SBT</h2>
              <p className="text-white/80 mb-6 text-sm">
                Connect to access the member dashboard. Your Miracle SBT can only be claimed in-person at events.
              </p>
              <button
                onClick={() => login()}
                className="w-full py-3 px-6 aurora-gradient text-white font-medium rounded-lg magnetic-button transition-all shadow-lg"
              >
                Connect Wallet
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glassmorphic rounded-xl p-6 float-animation">
              <div className="text-3xl mb-4 spiral-animation">🎵</div>
              <h3 className="text-lg font-bold text-white mb-2">Live Music</h3>
              <p className="text-white/80 text-sm">
                Intimate shows in backyards, bars, and micro-venues. Music first, always.
              </p>
            </div>
            
            <div className="glassmorphic rounded-xl p-6 float-animation" style={{animationDelay: '0.5s'}}>
              <div className="text-3xl mb-4 breathe-animation">🛒</div>
              <h3 className="text-lg font-bold text-white mb-2">Vendor Support</h3>
              <p className="text-white/80 text-sm">
                Support underground lot vendors with blockchain-powered discounts.
              </p>
            </div>
            
            <div className="glassmorphic rounded-xl p-6 float-animation" style={{animationDelay: '1s'}}>
              <div className="text-3xl mb-4 spiral-animation" style={{animationDelay: '2s'}}>🎆</div>
              <h3 className="text-lg font-bold text-white mb-2">Community</h3>
              <p className="text-white/80 text-sm">
                Real connections, not speculation. Built for Deadheads, by Deadheads.
              </p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/ambassador')}
              className="px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
            >
              Ambassador Portal
            </button>
            <button
              onClick={() => router.push('/vendor')}
              className="px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
            >
              Vendor Scanner
            </button>
          </div>
          
          {/* Quote */}
          <div className="mt-12 p-6 glassmorphic rounded-xl border-l-4 aurora-gradient">
            <blockquote className="text-white/90 italic script-font text-lg">
              "Once in a while you get shown the light in the strangest of places if you look at it right."
            </blockquote>
            <p className="text-white/70 text-sm mt-2">— Grateful Dead, "Scarlet Begonias"</p>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-sm text-white/60">
            <p className="mb-2">
              Built on <strong className="text-white/80">Berachain</strong> • Powered by <strong className="text-white/80">community</strong>
            </p>
            <p className="glow-text text-white/80">"Fuck crypto, real family shit" — The NFA Bears way</p>
          </div>
        </div>
      </div>
    </div>
  );
}