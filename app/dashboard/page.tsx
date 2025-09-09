"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react"
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NavigationTabs } from "@/components/dashboard/navigation-tabs"

// Dynamic imports for heavy tab components
const ShowsTab = dynamic(() => import("@/components/dashboard/shows-tab").then(mod => ({ default: mod.ShowsTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading shows...</div>
});

const ShakedownStreetTab = dynamic(() => import("@/components/dashboard/shakedown-street-tab").then(mod => ({ default: mod.ShakedownStreetTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading shakedown street...</div>
});

const TheFamilyTab = dynamic(() => import("@/components/dashboard/the-family-tab").then(mod => ({ default: mod.TheFamilyTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading family...</div>
});

const MiracleSomeoneTab = dynamic(() => import("@/components/dashboard/miracle-someone-tab").then(mod => ({ default: mod.MiracleSomeoneTab })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-64 flex items-center justify-center text-white/60">Loading miracle...</div>
});

const POATCollection = dynamic(() => import("@/components/dashboard/poat-collection").then(mod => ({ default: mod.POATCollection })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/10 rounded-xl h-32 flex items-center justify-center text-white/60">Loading collection...</div>
});

export default function DashboardPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("shows")
  const [daysOnBus, setDaysOnBus] = useState(0)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [authenticated, ready, mounted, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysOnBus((prev) => (prev < 247 ? prev + 1 : 247))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  if (!mounted || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!authenticated) return null;

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader daysOnBus={daysOnBus} />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-8">
          {activeTab === "shows" && <ShowsTab />}
          {activeTab === "shakedown" && <ShakedownStreetTab />}
          {activeTab === "family" && <TheFamilyTab />}
          {activeTab === "miracle" && <MiracleSomeoneTab />}
        </div>
      </div>

      <POATCollection />
    </div>
  )
}