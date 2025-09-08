"use client"

import { useState, useEffect } from "react"
import { useMockState } from "@/context/mock-state-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NavigationTabs } from "@/components/dashboard/navigation-tabs"
import { ShowsTab } from "@/components/dashboard/shows-tab"
import { ShakedownStreetTab } from "@/components/dashboard/shakedown-street-tab"
import { TheFamilyTab } from "@/components/dashboard/the-family-tab"
import { MiracleSomeoneTab } from "@/components/dashboard/miracle-someone-tab"
import { POATCollection } from "@/components/dashboard/poat-collection"

export default function DashboardPage() {
  const { isAuthenticated, user, login } = useMockState()
  const [activeTab, setActiveTab] = useState("shows")
  const [daysOnBus, setDaysOnBus] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysOnBus((prev) => (prev < 247 ? prev + 1 : 247))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen tie-dye-bg flex items-center justify-center p-4">
        <div className="glassmorphic rounded-3xl p-12 text-center max-w-md liquid-morph">
          <div className="text-6xl mb-6 dancing-bear">🐻</div>
          <h2 className="groovy-font text-4xl mb-4 glow-text">Welcome to the Bus!</h2>
          <p className="text-lg text-white/80 mb-8">Join the family and hop on the cosmic journey</p>
          <button
            onClick={login}
            className="magnetic-button bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full text-xl aurora-gradient"
          >
            All Aboard! 🚌✨
          </button>
        </div>
      </div>
    )
  }

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
        <DashboardHeader user={user} daysOnBus={daysOnBus} />
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
