"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react"
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/lib/useUserType';
import { useMintSBT } from '@/lib/useMintSBT';
import dynamicImport from 'next/dynamic';

// Dynamic imports for heavy components
const POATCollection = dynamicImport(() => import("@/components/dashboard/poat-collection").then(mod => ({ default: mod.POATCollection })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-32 flex items-center justify-center text-white/60">Loading collection...</div>
});

const CommunityParticipation = dynamicImport(() => import("@/components/dashboard/community-participation").then(mod => ({ default: mod.CommunityParticipation })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-48 flex items-center justify-center text-white/60">Loading community...</div>
});

const ShowsTab = dynamicImport(() => import("@/components/dashboard/shows-tab").then(mod => ({ default: mod.ShowsTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading shows...</div>
});

const TheFamilyTab = dynamicImport(() => import("@/components/dashboard/the-family-tab").then(mod => ({ default: mod.TheFamilyTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading family...</div>
});

export default function SBTDashboard() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const { userType, loading: userTypeLoading, isSBTHolder, address } = useUserType();
  const { hasMinted, transactionHash } = useMintSBT();
  const [activeTab, setActiveTab] = useState("welcome");
  const [daysOnBus, setDaysOnBus] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [authenticated, ready, mounted, router]);

  // Redirect if not SBT holder
  useEffect(() => {
    if (mounted && ready && authenticated && !userTypeLoading && !isSBTHolder) {
      router.push('/dashboard');
    }
  }, [mounted, ready, authenticated, userTypeLoading, isSBTHolder, router]);

  // Animate days on bus counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysOnBus((prev) => (prev < 30 ? prev + 1 : 30))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  if (!mounted || !ready || userTypeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tie-dye-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white/80">Loading your Miracle journey...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !isSBTHolder) return null;

  const tabs = [
    { id: "welcome", label: "Welcome", icon: "🎪" },
    { id: "shows", label: "Shows", icon: "🎵" },
    { id: "family", label: "Family", icon: "🐻" },
    { id: "collect", label: "Collect", icon: "🎟️" },
  ];

  return (
    <div className="min-h-screen tie-dye-bg relative overflow-hidden">
      {/* Floating musical notes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400/20 text-2xl float-animation"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SBT Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl mr-4">⚡</div>
            <div>
              <h1 className="text-4xl font-bold text-green-400 mb-2">
                Miracle Journey
              </h1>
              <p className="text-white/80">
                You've been miraculously onboarded! • {daysOnBus} days on the bus
              </p>
            </div>
          </div>
          <div className="bg-green-400/20 border border-green-400/40 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-green-100 text-sm">
              <strong>SBT Holder Benefits:</strong> POAT collection • Community participation • Event access • Upgrade to Genesis available
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-2 max-w-2xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 m-1 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-400 text-black shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "welcome" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Welcome Message */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🎉</span>
                  Welcome to the Family!
                </h3>
                <p className="text-white/80 mb-6">
                  You've successfully minted your Miracle SBT and joined the NFA Bears community. 
                  This non-transferable token represents your authentic membership in our family.
                </p>
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-white/60 mb-1">Your Miracle SBT</p>
                  <p className="font-mono text-xs text-green-400 break-all">{address}</p>
                  {transactionHash && (
                    <p className="font-mono text-xs text-blue-400 break-all mt-2">
                      Tx: {transactionHash}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab("shows")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Explore Shows & Events
                </button>
              </div>

              {/* Next Steps */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🗺️</span>
                  Your Journey Continues
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl mr-3">🎵</div>
                    <div>
                      <p className="text-white font-medium">Attend Shows</p>
                      <p className="text-white/60 text-sm">Find local events and connect with the community</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl mr-3">🎟️</div>
                    <div>
                      <p className="text-white font-medium">Collect POATs</p>
                      <p className="text-white/60 text-sm">Prove your attendance and build your collection</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl mr-3">👥</div>
                    <div>
                      <p className="text-white font-medium">Join the Family</p>
                      <p className="text-white/60 text-sm">Connect with other Bears in the community</p>
                    </div>
                  </div>
                </div>
                
                {/* Upgrade Option */}
                <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">Ready to Lead?</h4>
                  <p className="text-white/80 text-sm mb-3">
                    Upgrade to a Genesis Bear for governance rights and the ability to onboard new members.
                  </p>
                  <button 
                    onClick={() => router.push('/mint-genesis')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    Upgrade to Genesis ($333)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shows" && <ShowsTab />}
          {activeTab === "family" && <TheFamilyTab />}
          {activeTab === "collect" && (
            <div>
              <POATCollection />
              <div className="mt-8">
                <CommunityParticipation />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}