"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User } from "lucide-react"

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
  }, [pathname])

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/", emoji: "🏠" },
    { id: "scan", label: "Scan", icon: Scan, path: "/scan", emoji: "📱", requiresAuth: true },
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

      {/* Layer 2: Caustic Water Light */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1aff]/20 via-transparent to-[#1a1aff]/10 animate-caustic"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-[#1a1aff]/15 to-transparent rounded-full animate-drift-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-radial from-[#1a1aff]/10 to-transparent rounded-full animate-drift-reverse"></div>
      </div>

      {/* Layer 3: Oil Film Morphing Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/6 left-1/6 w-80 h-80 bg-gradient-radial from-[#1a1aff]/20 via-[#ff3366]/10 to-transparent rounded-full liquid-morph"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#1a1aff]/15 via-transparent to-[#ff3366]/5 rounded-full liquid-morph"
            style={{ animationDelay: "10s" }}
          ></div>
        </div>
      </div>

      {/* Layer 4: Micro Particles */}
      <div className="absolute inset-0 opacity-8">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-particle"
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

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Fish Pair Logo */}
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-[#1a1aff]">
                <path
                  d="M8 16c0-4 2-6 6-6s6 2 6 6-2 6-6 6-6-2-6-6zm10 0c0 4 2 6 6 6s6-2 6-6-2-6-6-6-6 2-6 6z"
                  fill="currentColor"
                  opacity="0.7"
                />
              </svg>
              <div className="absolute inset-0 bg-[#1a1aff] rounded-full blur-sm opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg glow-text">NFA Bears</h1>
              <p className="text-white/60 text-xs">Not Fade Away</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {ready && (
              <div
                className={`w-2 h-2 rounded-full ${authenticated ? "bg-[#00ff88] animate-pulse" : "bg-[#ff3366]"}`}
              ></div>
            )}
            <span className="text-white/80 text-sm">
              {!ready ? "Loading..." : authenticated ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 relative z-10">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
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
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[60px] ${
                  isActive
                    ? "bg-[#1a1aff]/30 text-white shadow-lg shadow-[#1a1aff]/25 scale-105"
                    : isDisabled
                      ? "text-white/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="relative">
                  <span className="text-xl mb-1 block">{item.emoji}</span>
                  {isActive && (
                    <div className="absolute -inset-1 bg-[#1a1aff] rounded-full blur opacity-50 animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#1a1aff] rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
