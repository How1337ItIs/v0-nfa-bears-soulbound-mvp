"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react"
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/lib/useUserType';
import dynamicImport from 'next/dynamic';

// Dynamic imports for heavy tab components
const ShowsTab = dynamicImport(() => import("@/components/dashboard/shows-tab").then(mod => ({ default: mod.ShowsTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading shows...</div>
});

const ShakedownStreetTab = dynamicImport(() => import("@/components/dashboard/shakedown-street-tab").then(mod => ({ default: mod.ShakedownStreetTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading shakedown street...</div>
});

const TheFamilyTab = dynamicImport(() => import("@/components/dashboard/the-family-tab").then(mod => ({ default: mod.TheFamilyTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading family...</div>
});

const MiracleSomeoneTab = dynamicImport(() => import("@/components/dashboard/miracle-someone-tab").then(mod => ({ default: mod.MiracleSomeoneTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading miracle...</div>
});

const POATCollection = dynamicImport(() => import("@/components/dashboard/poat-collection").then(mod => ({ default: mod.POATCollection })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-32 flex items-center justify-center text-white/60">Loading collection...</div>
});

export default function DashboardPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const { userType, loading: userTypeLoading, isConnected } = useUserType();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect based on authentication
  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [authenticated, ready, mounted, router]);

  // Conditional routing based on user type - only redirect when data is fully loaded
  useEffect(() => {
    if (mounted && ready && authenticated && isConnected && !userTypeLoading) {
      switch (userType) {
        case 'GENESIS_HOLDER':
          router.push('/dashboard/genesis');
          break;
        case 'SBT_HOLDER':
          router.push('/dashboard/sbt');
          break;
        case 'NEW_USER':
          // Keep new users on main dashboard to show onboarding options
          break;
        default:
          break;
      }
    }
  }, [mounted, ready, authenticated, isConnected, userType, userTypeLoading, router]);

  if (!mounted || !ready || userTypeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tie-dye-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white/80">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  // Landing page for new users - show onboarding options
  return (
    <div className="min-h-screen tie-dye-bg relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-2xl float-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ♪
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to the NFA Bears
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Choose your path into the family
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Genesis Option */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">🐻</div>
            <h2 className="text-2xl font-bold text-white mb-4">Genesis Bears</h2>
            <p className="text-white/80 mb-6">
              Own a founding member NFT with governance rights and premium benefits.
            </p>
            <div className="text-3xl font-bold text-yellow-400 mb-6">$333</div>
            <button 
              onClick={() => router.push('/mint-genesis')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Mint Genesis Bear
            </button>
          </div>

          {/* SBT Option */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold text-white mb-4">Miracle SBT</h2>
            <p className="text-white/80 mb-6">
              Get onboarded by scanning a QR code from an existing member.
            </p>
            <div className="text-lg text-green-400 mb-6">Invitation Required</div>
            <button 
              onClick={() => router.push('/scan')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Scan QR Code
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60">
            Already have an NFT? Your dashboard will automatically detect your membership tier.
          </p>
        </div>
      </div>
    </div>
  )
}