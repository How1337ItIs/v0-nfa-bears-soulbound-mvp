"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User, Monitor, Smartphone } from "lucide-react"
import { useLayout } from "@/providers/LayoutProvider"

interface DesktopAppShellProps {
  children: React.ReactNode
}

export function DesktopAppShell({ children }: DesktopAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, ready, login } = usePrivy()
  const { mode, detected, setMode } = useLayout()
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

  const handleConnect = () => {
    if (authenticated) {
      router.push("/dashboard")
    } else {
      login()
    }
  }

  return (
    <div className="min-h-screen bg-[#000011] relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000022] to-[#000011]"></div>
      
      {/* Caustic Water Light */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1aff]/20 via-transparent to-[#1a1aff]/10 animate-caustic"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-[#1a1aff]/15 to-transparent rounded-full animate-drift-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-radial from-[#1a1aff]/10 to-transparent rounded-full animate-drift-reverse"></div>
      </div>

      {/* Oil Film Morphing Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/6 left-1/6 w-80 h-80 bg-gradient-radial from-[#1a1aff]/20 via-[#ff3366]/10 to-transparent rounded-full liquid-morph"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#1a1aff]/15 via-transparent to-[#ff3366]/5 rounded-full liquid-morph"
            style={{ animationDelay: "10s" }}
          ></div>
        </div>
      </div>

      {/* Micro Particles */}
      <div className="absolute inset-0 opacity-8">
        {[...Array(16)].map((_, i) => (
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

      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#1a1aff]">
                  <path
                    d="M10 20c0-5 2.5-7.5 7.5-7.5s7.5 2.5 7.5 7.5-2.5 7.5-7.5 7.5S10 25 10 20zm15 0c0 5 2.5 7.5 7.5 7.5s7.5-2.5 7.5-7.5-2.5-7.5-7.5-7.5S25 15 25 20z"
                    fill="currentColor"
                    opacity="0.7"
                  />
                </svg>
                <div className="absolute inset-0 bg-[#1a1aff] rounded-full blur-sm opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl glow-text">NFA Bears</h1>
                <p className="text-white/60 text-sm">Not Fade Away</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                const isDisabled = item.requiresAuth && !authenticated

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    disabled={isDisabled}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#1a1aff]/30 text-white shadow-lg shadow-[#1a1aff]/25"
                        : isDisabled
                          ? "text-white/30"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right Side - Auth & Layout Toggle */}
            <div className="flex items-center space-x-4">
              {/* Layout Toggle */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setMode("desktop")}
                  className={`p-2 rounded transition-all ${
                    mode === "desktop" ? "bg-[#1a1aff]/50 text-white" : "text-white/60 hover:text-white"
                  }`}
                  title="Desktop Mode"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMode("auto")}
                  className={`p-2 rounded transition-all ${
                    mode === "auto" ? "bg-[#1a1aff]/50 text-white" : "text-white/60 hover:text-white"
                  }`}
                  title="Auto Detect"
                >
                  Auto
                </button>
                <button
                  onClick={() => setMode("mobile")}
                  className={`p-2 rounded transition-all ${
                    mode === "mobile" ? "bg-[#1a1aff]/50 text-white" : "text-white/60 hover:text-white"
                  }`}
                  title="Mobile Mode"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Connection Status & Auth */}
              <div className="flex items-center space-x-3">
                {ready && (
                  <>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        authenticated ? "bg-[#00ff88] animate-pulse" : "bg-[#ff3366]"
                      }`}
                    ></div>
                    {!authenticated ? (
                      <button
                        onClick={handleConnect}
                        className="px-4 py-2 bg-[#1a1aff]/30 border border-[#1a1aff]/50 text-white text-sm rounded-lg hover:bg-[#1a1aff]/50 transition-all"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <span className="text-white/80 text-sm">Connected</span>
                    )}
                  </>
                )}
                {!ready && <span className="text-white/60 text-sm">Loading...</span>}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}