"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User, Coins } from "lucide-react"
import FloatingMusicPlayer from "../FloatingMusicPlayer"
import { AudioData } from "../../lib/audio-reactive"

interface MobileAppShellProps {
  children: React.ReactNode
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, ready } = usePrivy()
  const [activeTab, setActiveTab] = useState("home")
  const [audioData, setAudioData] = useState<AudioData | null>(null)

  useEffect(() => {
    if (pathname === "/") setActiveTab("home")
    else if (pathname === "/scan") setActiveTab("scan")
    else if (pathname === "/dashboard") setActiveTab("dashboard")
    else if (pathname === "/profile") setActiveTab("profile")
    else if (pathname === "/mint-genesis") setActiveTab("mint")
  }, [pathname])

  // Audio-reactive mobile liquid light system (optimized for performance)
  useEffect(() => {
    if (!audioData) return

    // Apply audio-reactive data attributes to mobile CSS layers
    const oilFilmLayer = document.querySelector('.mobile-oil-film')
    const dropletsLayer = document.querySelector('.mobile-oil-droplets') 

    if (oilFilmLayer) {
      // Beat detection causes scale pulse (gentler for mobile)
      oilFilmLayer.setAttribute('data-beat', audioData.beatDetected ? 'true' : 'false')
    }

    if (dropletsLayer) {
      // Bass affects droplet movement intensity (mobile-optimized thresholds)
      if (audioData.bass > 0.5) {
        dropletsLayer.setAttribute('data-bass', 'high')
      } else {
        dropletsLayer.removeAttribute('data-bass')
      }
      
      // Mids affect visual clarity (mobile-optimized)
      if (audioData.mids > 0.5) {
        dropletsLayer.setAttribute('data-mids', 'high')
      } else {
        dropletsLayer.removeAttribute('data-mids')
      }
    }
  }, [audioData])

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
      {/* LIQUID LIGHT ORCHESTRA - Mobile Optimized */}
      <div className="liquid-light-mobile">
        {/* Layer 1: Deep Space Base */}
        <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000033] to-[#000022] z-0" />
        
        {/* Layer 2: Primary Conic Gradient - Mobile Optimized Thin-Film Interference */}
        <div 
          className={`absolute inset-0 mobile-oil-film z-1 ${audioData?.volume > 0.6 ? 'high-intensity' : audioData?.volume > 0.3 ? 'medium-intensity' : 'low-intensity'}`}
          style={{
            background: `
              conic-gradient(from ${audioData?.treble ? audioData.treble * 180 : 60}deg at 45% 55%, 
                hsla(280, 90%, 20%, 0.9) 0deg,      /* Dark Star - Deep Indigo */
                hsla(240, 85%, 30%, 0.8) 60deg,     /* Uncle John - Electric Blue */
                hsla(200, 90%, 40%, 0.7) 120deg,    /* Estimated Prophet - Cyan */
                hsla(150, 80%, 30%, 0.75) 150deg,   /* Box of Rain - Jade */
                hsla(120, 85%, 25%, 0.8) 180deg,    /* Green River - Forest */
                hsla(60, 95%, 45%, 0.7) 240deg,     /* Fire Mountain - Electric Gold */
                hsla(15, 95%, 35%, 0.8) 300deg,     /* Scarlet Begonias - Red */
                hsla(280, 90%, 20%, 0.9) 360deg     /* Return to Dark Star */
              )
            `,
            backgroundSize: `${audioData?.bass ? 180 + (audioData.bass * 120) : 250}% ${audioData?.mids ? 180 + (audioData.mids * 120) : 250}%`,
            filter: `saturate(${audioData?.volume ? 1.3 + (audioData.volume * 0.6) : 1.3}) brightness(${audioData?.volume ? 1.0 + (audioData.volume * 0.3) : 1.1}) hue-rotate(${audioData?.treble ? audioData.treble * 30 : 0}deg)`,
            transform: audioData?.beatDetected ? 'scale(1.015)' : 'scale(1.0)',
          }}
        />
        
        {/* Layer 3: Mobile Oil Droplets - Simplified for performance */}
        <div 
          className="absolute inset-0 mobile-oil-droplets z-2"
          style={{
            background: `
              radial-gradient(ellipse 900px 450px at 25% 75%, 
                hsla(300, 100%, 45%, ${audioData?.bass ? 0.08 + (audioData.bass * 0.12) : 0.12}) 0%, 
                transparent 60%),
              radial-gradient(ellipse 700px 700px at 75% 25%, 
                hsla(180, 100%, 55%, ${audioData?.treble ? 0.06 + (audioData.treble * 0.1) : 0.10}) 0%, 
                transparent 65%),
              radial-gradient(ellipse 600px 800px at 50% 50%, 
                hsla(60, 100%, 60%, ${audioData?.mids ? 0.05 + (audioData.mids * 0.08) : 0.08}) 0%, 
                transparent 55%)
            `,
            backgroundSize: '150% 150%, 130% 130%, 160% 160%',
            mixBlendMode: 'screen',
            opacity: audioData?.volume ? 0.3 + (audioData.volume * 0.4) : 0.5,
          }}
        />
        
        {/* Layer 4: Mobile Water Dye - Ultra lightweight */}
        <div 
          className="absolute inset-0 mobile-water-dye z-3"
          style={{
            background: `
              linear-gradient(120deg, 
                hsla(280, 60%, 25%, 0.2) 0%,
                transparent 30%,
                hsla(180, 70%, 40%, 0.15) 60%,
                transparent 100%
              )
            `,
            backgroundSize: '300% 300%',
            mixBlendMode: 'color-dodge',
            opacity: audioData?.volume ? 0.2 + (audioData.volume * 0.3) : 0.3,
          }}
        />
      </div>
      
      <style jsx>{`
        /* LIQUID LIGHT ORCHESTRA - Mobile Optimized Styles */
        .liquid-light-mobile {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          will-change: transform;
          transform: translateZ(0); /* GPU acceleration for mobile */
        }
        
        /* Mobile Primary Oil Film */
        .mobile-oil-film {
          animation: mobile-liquid-light-rotation 25s linear infinite;
          transition: transform 0.2s ease-out;
          will-change: transform, filter;
        }
        
        .mobile-oil-film.low-intensity {
          animation-duration: 30s;
        }
        
        .mobile-oil-film.medium-intensity {
          animation-duration: 22s;
          filter: saturate(1.4) brightness(1.15) !important;
        }
        
        .mobile-oil-film.high-intensity {
          animation-duration: 18s;
          filter: saturate(1.6) brightness(1.25) !important;
        }
        
        /* Mobile Oil Droplets */
        .mobile-oil-droplets {
          animation: mobile-droplet-flow 35s ease-in-out infinite;
          will-change: background-position, opacity;
        }
        
        /* Mobile Water Dye */
        .mobile-water-dye {
          animation: mobile-water-diffusion 40s ease-in-out infinite;
        }
        
        /* Mobile Primary Rotation - Optimized for battery life */
        @keyframes mobile-liquid-light-rotation {
          0% { 
            background-position: 0% 50%;
            transform: rotate(0deg) scale(1.0);
          }
          50% { 
            background-position: 100% 50%;
            transform: rotate(1deg) scale(0.99);
          }
          100% { 
            background-position: 0% 50%;
            transform: rotate(0deg) scale(1.0);
          }
        }
        
        /* Mobile Droplet Movement - Simplified */
        @keyframes mobile-droplet-flow {
          0%, 100% { 
            background-position: 25% 75%, 75% 25%, 50% 50%;
            opacity: 1.0;
          }
          33% { 
            background-position: 50% 50%, 60% 60%, 30% 70%;
            opacity: 0.9;
          }
          67% { 
            background-position: 75% 25%, 30% 80%, 70% 30%;
            opacity: 0.95;
          }
        }
        
        /* Mobile Water Dye Diffusion - Ultra lightweight */
        @keyframes mobile-water-diffusion {
          0%, 100% { 
            background-position: 0% 50%;
            opacity: 0.3;
          }
          50% { 
            background-position: 100% 50%;
            opacity: 0.5;
          }
        }
        
        /* Audio Reactive Modifiers for Mobile */
        .mobile-oil-film[data-beat="true"] {
          animation-duration: 15s !important;
          transform: scale(1.02) !important;
        }
        
        .mobile-oil-droplets[data-bass="high"] {
          animation-duration: 25s;
          opacity: 0.8 !important;
        }
        
        .mobile-oil-droplets[data-mids="high"] {
          animation-duration: 30s;
          filter: saturate(1.3) brightness(1.05);
        }
        
        /* Accessibility: Reduced motion for mobile */
        @media (prefers-reduced-motion: reduce) {
          .liquid-light-mobile * {
            animation: none !important;
            transition: none !important;
          }
          
          .mobile-oil-film {
            background: linear-gradient(135deg, 
              hsla(280, 70%, 25%, 0.8) 0%,
              hsla(180, 70%, 35%, 0.6) 50%,
              hsla(60, 80%, 40%, 0.7) 100%) !important;
            filter: saturate(1.1) !important;
          }
          
          .mobile-oil-droplets,
          .mobile-water-dye {
            opacity: 0.3 !important;
          }
        }
        
        /* Extra mobile performance optimizations */
        @media (max-width: 480px) {
          .mobile-oil-film {
            animation-duration: 35s;
            background-size: 200% 200% !important;
          }
          
          .mobile-oil-droplets {
            animation-duration: 40s;
            background-size: 120% 120%, 110% 110%, 130% 130%;
            opacity: 0.4 !important;
          }
          
          .mobile-water-dye {
            animation-duration: 45s;
            background-size: 250% 250%;
            opacity: 0.2 !important;
          }
        }
        
        /* Battery saving mode - very slow animations */
        @media (max-width: 320px) {
          .mobile-oil-film {
            animation-duration: 50s !important;
            filter: saturate(1.2) brightness(1.05) !important;
          }
          
          .mobile-oil-droplets {
            animation: none !important;
            opacity: 0.3 !important;
          }
          
          .mobile-water-dye {
            display: none; /* Remove entirely on very small screens */
          }
        }
      `}</style>
      
      {/* Fallback gradient for non-WebGL browsers */}
      <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000022] to-[#000011] -z-10"></div>

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

      {/* Floating Music Player */}
      <FloatingMusicPlayer onAudioDataChange={setAudioData} />
    </div>
  )
}
