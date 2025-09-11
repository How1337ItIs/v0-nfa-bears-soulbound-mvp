"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User, Coins } from "lucide-react"

interface MobileAppShellProps {
  children: React.ReactNode
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, ready } = usePrivy()
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    if (pathname === "/") setActiveTab("home")
    else if (pathname === "/scan") setActiveTab("scan")
    else if (pathname === "/dashboard") setActiveTab("dashboard")
    else if (pathname === "/profile") setActiveTab("profile")
    else if (pathname === "/mint-genesis") setActiveTab("mint")
  }, [pathname])

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/", emoji: "🏠" },
    { id: "scan", label: "Scan", icon: Scan, path: "/scan", emoji: "📱", requiresAuth: true },
    { id: "mint", label: "Mint", icon: Coins, path: "/mint-genesis", emoji: "💎", requiresAuth: true },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", emoji: "🎪", requiresAuth: true },
    { id: "profile", label: "Profile", icon: User, path: "/profile", emoji: "👤", requiresAuth: true },
  ]

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.requiresAuth && !authenticated) return
    setActiveTab(item.id)
    router.push(item.path)
  }

  return (
    <div className="min-h-screen bg-[#000011] relative overflow-hidden">
      {/* Layer 1: Deep Space Base */}
      <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000022] to-[#000011]"></div>

      {/* Layer 2: Psychedelic Oil Projection Background */}
      <div className="absolute inset-0 oil-projection-bg opacity-40"></div>

      {/* Layer 3: Lava Lamp Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/6 left-1/6 w-80 h-80 psychedelic-gradient-1 oil-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 psychedelic-gradient-2 oil-blob-2" style={{ animationDelay: "5s" }}></div>
        <div className="absolute top-1/2 right-1/6 w-64 h-64 psychedelic-gradient-3 oil-blob-3" style={{ animationDelay: "10s" }}></div>
        <div className="absolute bottom-1/6 left-1/3 w-72 h-72 psychedelic-gradient-1 oil-blob" style={{ animationDelay: "15s" }}></div>
      </div>

      {/* Layer 4: Floating Oil Droplets */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 psychedelic-gradient-2 oil-blob-3 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Status Bar Safe Area */}
      <div className="safe-area-top"></div>

      {/* Header - Melting Liquid Style */}
      <header className="sticky top-0 z-50 oil-glassmorphic border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Psychedelic Logo */}
            <div className="relative">
              <div className="w-8 h-8 psychedelic-gradient-1 oil-blob flex items-center justify-center">
                <span className="text-white text-sm font-bold">🐻</span>
              </div>
              <div className="absolute inset-0 psychedelic-gradient-2 oil-blob-2 blur-sm opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg psychedelic-text">NFA Bears</h1>
              <p className="text-white/60 text-xs liquid-chrome">Not Fade Away</p>
            </div>
          </div>

          {/* Connection Status - Oil Blob Style */}
          <div className="flex items-center space-x-2">
            {ready && (
              <div
                className={`w-3 h-3 oil-blob-3 ${authenticated ? "psychedelic-gradient-1 animate-pulse" : "psychedelic-gradient-2"}`}
              ></div>
            )}
            <span className="text-white/80 text-sm liquid-chrome">
              {!ready ? "Loading..." : authenticated ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 relative z-10">{children}</main>

      {/* Bottom Navigation - Melting Liquid Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 oil-glassmorphic border-t border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isDisabled = item.requiresAuth && !authenticated

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                disabled={isDisabled}
                className={`flex flex-col items-center justify-center p-3 syrupy-button min-w-[60px] ${
                  isActive
                    ? "psychedelic-gradient-1 oil-blob text-white shadow-lg scale-105"
                    : isDisabled
                      ? "text-white/30"
                      : "text-white/70 hover:text-white hover:psychedelic-gradient-2 oil-blob-2"
                }`}
              >
                <div className="relative">
                  <span className="text-xl mb-1 block">{item.emoji}</span>
                  {isActive && (
                    <div className="absolute -inset-1 psychedelic-gradient-2 oil-blob-3 blur opacity-50 animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium liquid-chrome">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 psychedelic-gradient-3 oil-blob animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
