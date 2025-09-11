"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User, Monitor, Smartphone, Coins } from "lucide-react"
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
      
      {/* Psychedelic Oil Projection Background */}
      <div className="absolute inset-0 oil-projection-bg opacity-40"></div>

      {/* Lava Lamp Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/6 left-1/6 w-80 h-80 psychedelic-gradient-1 oil-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 psychedelic-gradient-2 oil-blob-2" style={{ animationDelay: "5s" }}></div>
        <div className="absolute top-1/2 right-1/6 w-64 h-64 psychedelic-gradient-3 oil-blob-3" style={{ animationDelay: "10s" }}></div>
        <div className="absolute bottom-1/6 left-1/3 w-72 h-72 psychedelic-gradient-1 oil-blob" style={{ animationDelay: "15s" }}></div>
        <div className="absolute top-1/3 left-1/2 w-56 h-56 psychedelic-gradient-2 oil-blob-2" style={{ animationDelay: "20s" }}></div>
      </div>

      {/* Floating Oil Droplets */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(24)].map((_, i) => (
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

      {/* Desktop Header - Melting Liquid Style */}
      <header className="sticky top-0 z-50 oil-glassmorphic border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 psychedelic-gradient-1 oil-blob flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🐻</span>
                </div>
                <div className="absolute inset-0 psychedelic-gradient-2 oil-blob-2 blur-sm opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl psychedelic-text">NFA Bears</h1>
                <p className="text-white/60 text-sm liquid-chrome">Not Fade Away</p>
              </div>
            </div>

            {/* Navigation - Syrupy Buttons */}
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
                    className={`flex items-center space-x-2 px-4 py-2 syrupy-button ${
                      isActive
                        ? "psychedelic-gradient-1 oil-blob text-white shadow-lg"
                        : isDisabled
                          ? "text-white/30"
                          : "text-white/70 hover:text-white hover:psychedelic-gradient-2 oil-blob-2"
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium liquid-chrome">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right Side - Auth & Layout Toggle */}
            <div className="flex items-center space-x-4">
              {/* Layout Toggle - Oil Blob Style */}
              <div className="flex items-center space-x-2 oil-glassmorphic oil-blob-2 p-1">
                <button
                  onClick={() => setMode("desktop")}
                  className={`p-2 syrupy-button ${
                    mode === "desktop" ? "psychedelic-gradient-1 oil-blob text-white" : "text-white/60 hover:text-white hover:psychedelic-gradient-2 oil-blob-2"
                  }`}
                  title="Desktop Mode"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMode("auto")}
                  className={`p-2 syrupy-button ${
                    mode === "auto" ? "psychedelic-gradient-1 oil-blob text-white" : "text-white/60 hover:text-white hover:psychedelic-gradient-2 oil-blob-2"
                  }`}
                  title="Auto Detect"
                >
                  <span className="liquid-chrome">Auto</span>
                </button>
                <button
                  onClick={() => setMode("mobile")}
                  className={`p-2 syrupy-button ${
                    mode === "mobile" ? "psychedelic-gradient-1 oil-blob text-white" : "text-white/60 hover:text-white hover:psychedelic-gradient-2 oil-blob-2"
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
                      className={`w-3 h-3 oil-blob-3 ${
                        authenticated ? "psychedelic-gradient-1 animate-pulse" : "psychedelic-gradient-2"
                      }`}
                    ></div>
                    {!authenticated ? (
                      <button
                        onClick={handleConnect}
                        className="px-4 py-2 psychedelic-gradient-1 oil-blob text-white text-sm syrupy-button"
                      >
                        <span className="liquid-chrome">Connect Wallet</span>
                      </button>
                    ) : (
                      <span className="text-white/80 text-sm liquid-chrome">Connected</span>
                    )}
                  </>
                )}
                {!ready && <span className="text-white/60 text-sm liquid-chrome">Loading...</span>}
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