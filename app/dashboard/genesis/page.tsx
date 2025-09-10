"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react"
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/lib/useUserType';
import { useGenesisBears } from '@/lib/useGenesisBears';
import dynamicImport from 'next/dynamic';

// Dynamic imports for heavy components
const QRInviteGenerator = dynamicImport(() => import("@/components/dashboard/qr-invite-generator").then(mod => ({ default: mod.QRInviteGenerator })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading QR generator...</div>
});

const InviteMetrics = dynamicImport(() => import("@/components/dashboard/invite-metrics").then(mod => ({ default: mod.InviteMetrics })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-32 flex items-center justify-center text-white/60">Loading metrics...</div>
});

const POATCollection = dynamicImport(() => import("@/components/dashboard/poat-collection").then(mod => ({ default: mod.POATCollection })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-32 flex items-center justify-center text-white/60">Loading collection...</div>
});

const CommunityManagement = dynamicImport(() => import("@/components/dashboard/community-management").then(mod => ({ default: mod.CommunityManagement })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-48 flex items-center justify-center text-white/60">Loading community tools...</div>
});

export default function GenesisDashboard() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const { userType, loading: userTypeLoading, isGenesisHolder } = useUserType();
  const { balance: genesisBalance, tokenIds, loading: genesisLoading, error } = useGenesisBears();
  const [activeTab, setActiveTab] = useState("overview");
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

  // Redirect if not Genesis holder - but only after Genesis Bears data is loaded
  useEffect(() => {
    if (mounted && ready && authenticated && !userTypeLoading && !genesisLoading && !isGenesisHolder) {
      router.push('/dashboard');
    }
  }, [mounted, ready, authenticated, userTypeLoading, genesisLoading, isGenesisHolder, router]);

  if (!mounted || !ready || userTypeLoading || genesisLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tie-dye-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white/80">Loading Genesis dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !isGenesisHolder) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "invite", label: "Invite", icon: "📱" },
    { id: "metrics", label: "Metrics", icon: "📊" },
    { id: "community", label: "Community", icon: "👥" },
  ];

  return (
    <div className="min-h-screen tie-dye-bg relative overflow-hidden">
      {/* Floating musical notes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400/20 text-2xl float-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Genesis Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl mr-4">👑</div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                Genesis Dashboard
              </h1>
              <p className="text-white/80">
                You own {genesisBalance} Genesis Bear{genesisBalance !== 1 ? 's' : ''} • Token{tokenIds.length !== 1 ? 's' : ''}: {tokenIds.join(', ')}
              </p>
            </div>
          </div>
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-yellow-100 text-sm">
              <strong>Genesis Holder Benefits:</strong> QR invite generation • Community management tools • Premium POAT access • Governance voting rights
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
                  ? 'bg-yellow-400 text-black shadow-lg'
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
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Your Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Invites Sent</span>
                    <span className="text-yellow-400 font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Members Onboarded</span>
                    <span className="text-green-400 font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">POATs Collected</span>
                    <span className="text-blue-400 font-semibold">0</span>
                  </div>
                </div>
              </div>

              {/* Genesis NFT Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🐻</span>
                  Your Bears
                </h3>
                <div className="space-y-2">
                  {tokenIds.map((id, index) => (
                    <div key={id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Genesis Bear #{id}</span>
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🐻</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab("invite")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Generate QR Invite
                  </button>
                  <button 
                    onClick={() => setActiveTab("metrics")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    View Metrics
                  </button>
                  <button 
                    onClick={() => setActiveTab("community")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Manage Community
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invite" && <QRInviteGenerator />}
          {activeTab === "metrics" && <InviteMetrics />}
          {activeTab === "community" && <CommunityManagement />}
        </div>

        {/* POAT Collection */}
        <div className="mt-12">
          <POATCollection />
        </div>
      </div>
    </div>
  );
}