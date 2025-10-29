"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Home, Scan, LayoutDashboard, User, Monitor, Smartphone, Coins } from "lucide-react"
import { useLayout } from "@/providers/LayoutProvider"
import FloatingMusicPlayer from "../FloatingMusicPlayer"
import AuthenticLiquidLightEngine from "../authentic-liquid-light-engine"
import { AudioData } from "../../lib/audio-reactive"

interface DesktopAppShellProps {
  children: React.ReactNode
}

export function DesktopAppShell({ children }: DesktopAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, ready, login } = usePrivy()
  const { mode, detected, setMode } = useLayout()
  const [activeTab, setActiveTab] = useState("home")
  const [audioData, setAudioData] = useState<AudioData | null>(null)

  useEffect(() => {
    if (pathname === "/") setActiveTab("home")
    else if (pathname === "/scan") setActiveTab("scan")
    else if (pathname === "/dashboard") setActiveTab("dashboard")
    else if (pathname === "/profile") setActiveTab("profile")
    else if (pathname === "/mint-genesis") setActiveTab("mint")
  }, [pathname])

  // Audio-reactive CSS modifications for authentic liquid light show response
  useEffect(() => {
    if (!audioData) return

    // Apply audio-reactive data attributes to CSS layers
    const oilFilmLayer = document.querySelector('.oil-film-base')
    const dropletLayer = document.querySelector('.oil-droplet-layer') 
    const waterLayer = document.querySelector('.water-dye-layer')

    if (oilFilmLayer) {
      // Beat detection causes scale pulse
      oilFilmLayer.setAttribute('data-beat', audioData.beatDetected ? 'true' : 'false')
    }

    if (dropletLayer) {
      // Bass affects droplet movement intensity
      if (audioData.bass > 0.6) {
        dropletLayer.setAttribute('data-bass', 'high')
      } else {
        dropletLayer.removeAttribute('data-bass')
      }
      
      // Treble affects visual clarity
      if (audioData.treble > 0.6) {
        dropletLayer.setAttribute('data-treble', 'high')
      } else {
        dropletLayer.removeAttribute('data-treble')
      }
    }

    if (waterLayer) {
      // Mids affect water dye diffusion
      if (audioData.mids > 0.6) {
        waterLayer.setAttribute('data-mids', 'high')
      } else {
        waterLayer.removeAttribute('data-mids')
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

  const handleConnect = () => {
    if (authenticated) {
      router.push("/dashboard")
    } else {
      login()
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#000011] relative overflow-hidden">
      {/* AUTHENTIC LIQUID LIGHT ENGINE - React Three Fiber with Real Physics */}
      <AuthenticLiquidLightEngine
        audioData={audioData}
        songMode="darkStar"
        intensity={1.0}
        interactive={true}
        performanceMode="auto"
        culturalAccuracy="strict"
        className="fixed inset-0 z-0"
      />
        <div 
          className={`absolute inset-0 oil-film-base z-1 ${audioData?.volume > 0.7 ? 'high-intensity' : audioData?.volume > 0.3 ? 'medium-intensity' : 'low-intensity'}`}
          style={{
            background: `
              conic-gradient(from ${audioData?.treble ? audioData.treble * 360 : 45}deg at 40% 60%, 
                hsla(280, 95%, 15%, 0.95) 0deg,     /* Dark Star - Deep Indigo Purple */
                hsla(260, 88%, 25%, 0.85) 30deg,    /* Ripple - Royal Purple */
                hsla(240, 82%, 35%, 0.75) 60deg,    /* Uncle John - Electric Blue */
                hsla(200, 90%, 45%, 0.7) 90deg,     /* Estimated Prophet - Cyan */
                hsla(180, 85%, 40%, 0.75) 120deg,   /* Bertha - Turquoise */
                hsla(150, 80%, 35%, 0.8) 150deg,    /* Box of Rain - Jade Green */
                hsla(120, 85%, 30%, 0.85) 180deg,   /* Green River - Forest */
                hsla(80, 90%, 45%, 0.75) 210deg,    /* Golden Road - Lime */
                hsla(60, 95%, 50%, 0.7) 240deg,     /* Fire Mountain - Electric Gold */
                hsla(30, 92%, 45%, 0.8) 270deg,     /* Truckin' - Orange Fire */
                hsla(15, 95%, 40%, 0.85) 300deg,    /* Scarlet Begonias - Red */
                hsla(340, 90%, 35%, 0.9) 330deg,    /* Sugaree - Magenta */
                hsla(280, 95%, 15%, 0.95) 360deg    /* Return to Dark Star */
              )
            `,
            backgroundSize: `${audioData?.bass ? 200 + (audioData.bass * 200) : 300}% ${audioData?.mids ? 200 + (audioData.mids * 200) : 300}%`,
            filter: `hue-rotate(${audioData?.treble ? audioData.treble * 60 : 0}deg) saturate(${audioData?.volume ? 1.2 + (audioData.volume * 0.8) : 1.2}) brightness(${audioData?.volume ? 0.9 + (audioData.volume * 0.4) : 1.0})`,
            transform: audioData?.beatDetected ? 'scale(1.02)' : 'scale(1.0)',
          }}
        />
        
        {/* Layer 3: Secondary Interference Patterns - Oil Droplets */}
        <div 
          className="absolute inset-0 oil-droplet-layer z-2"
          style={{
            background: `
              radial-gradient(ellipse 1400px 700px at 20% 80%, 
                hsla(300, 100%, 40%, ${audioData?.bass ? 0.1 + (audioData.bass * 0.2) : 0.15}) 0%, 
                transparent 65%),
              radial-gradient(ellipse 900px 1200px at 80% 20%, 
                hsla(180, 100%, 50%, ${audioData?.treble ? 0.08 + (audioData.treble * 0.15) : 0.12}) 0%, 
                transparent 70%),
              radial-gradient(ellipse 700px 900px at 50% 30%, 
                hsla(60, 100%, 55%, ${audioData?.mids ? 0.06 + (audioData.mids * 0.12) : 0.08}) 0%, 
                transparent 60%),
              radial-gradient(ellipse 1100px 500px at 70% 70%, 
                hsla(0, 100%, 45%, ${audioData?.volume ? 0.05 + (audioData.volume * 0.1) : 0.07}) 0%, 
                transparent 55%)
            `,
            backgroundSize: '180% 180%, 150% 150%, 200% 200%, 160% 160%',
            mixBlendMode: 'screen',
          }}
        />
        
        {/* Layer 4: Water Dye Diffusion - Flowing color bleeds */}
        <div 
          className="absolute inset-0 water-dye-layer z-3"
          style={{
            background: `
              linear-gradient(135deg, 
                hsla(280, 70%, 20%, 0.3) 0%,
                transparent 20%,
                hsla(200, 80%, 40%, 0.2) 40%,
                transparent 60%,
                hsla(60, 90%, 50%, 0.25) 80%,
                transparent 100%
              ),
              linear-gradient(-45deg,
                transparent 0%,
                hsla(320, 85%, 35%, 0.2) 30%,
                transparent 50%,
                hsla(120, 75%, 30%, 0.15) 70%,
                transparent 100%
              )
            `,
            backgroundSize: '400% 400%, 350% 350%',
            mixBlendMode: 'color-dodge',
            opacity: audioData?.volume ? 0.4 + (audioData.volume * 0.4) : 0.6,
          }}
        />
        
        {/* Layer 5: Overhead Projector Glass Texture */}
        <div 
          className="absolute inset-0 projector-glass-layer z-4"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, 
                rgba(255, 255, 255, 0.02) 0%, 
                rgba(255, 255, 255, 0.005) 30%,
                transparent 60%),
              radial-gradient(circle at 70% 60%, 
                rgba(255, 255, 255, 0.015) 0%, 
                rgba(255, 255, 255, 0.003) 40%,
                transparent 70%)
            `,
            backgroundSize: '800px 800px, 1200px 1200px',
            mixBlendMode: 'soft-light',
            filter: 'blur(1px)',
          }}
        />
      </div>
      
      <style jsx>{`
        /* LIQUID LIGHT ORCHESTRA - CSS Foundation Styles */
        .liquid-light-orchestra {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          will-change: transform, filter;
          transform: translateZ(0); /* GPU acceleration */
        }
        
        /* Layer 2: Primary Conic Gradient - Thin-Film Interference */
        .oil-film-base {
          animation: liquid-light-primary-rotation 30s linear infinite;
          transition: all 0.3s ease-out;
          will-change: transform, filter, background-size;
        }
        
        .oil-film-base.low-intensity {
          animation-duration: 35s;
        }
        
        .oil-film-base.medium-intensity {
          animation-duration: 25s;
          filter: saturate(1.4) brightness(1.1) !important;
        }
        
        .oil-film-base.high-intensity {
          animation-duration: 18s;
          filter: saturate(1.8) brightness(1.25) !important;
        }
        
        /* Layer 3: Oil Droplet Interference Patterns */
        .oil-droplet-layer {
          animation: 
            oil-droplet-flow-primary 40s ease-in-out infinite,
            oil-droplet-flow-secondary 35s ease-in-out infinite reverse;
          will-change: background-position, opacity;
        }
        
        /* Layer 4: Water Dye Diffusion */
        .water-dye-layer {
          animation: water-dye-diffusion 45s ease-in-out infinite;
          will-change: background-position, opacity;
        }
        
        /* Layer 5: Projector Glass Texture */
        .projector-glass-layer {
          animation: projector-glass-subtle 50s ease-in-out infinite;
        }
        
        /* Primary Rotation - Main conic gradient movement */
        @keyframes liquid-light-primary-rotation {
          0% { 
            background-position: 0% 50%;
            transform: rotate(0deg) scale(1.0);
          }
          25% { 
            background-position: 50% 100%;
            transform: rotate(2deg) scale(1.01);
          }
          50% { 
            background-position: 100% 50%;
            transform: rotate(0deg) scale(0.99);
          }
          75% { 
            background-position: 50% 0%;
            transform: rotate(-1deg) scale(1.005);
          }
          100% { 
            background-position: 0% 50%;
            transform: rotate(0deg) scale(1.0);
          }
        }
        
        /* Oil Droplet Flow Patterns - Organic movement simulation */
        @keyframes oil-droplet-flow-primary {
          0%, 100% { 
            background-position: 20% 80%, 80% 20%, 50% 30%, 70% 70%;
            opacity: 1.0;
          }
          20% { 
            background-position: 30% 70%, 75% 25%, 40% 50%, 60% 80%;
            opacity: 0.9;
          }
          40% { 
            background-position: 60% 40%, 60% 60%, 20% 70%, 80% 30%;
            opacity: 0.95;
          }
          60% { 
            background-position: 80% 20%, 30% 80%, 70% 10%, 40% 90%;
            opacity: 0.85;
          }
          80% { 
            background-position: 40% 90%, 90% 10%, 60% 40%, 20% 60%;
            opacity: 0.92;
          }
        }
        
        @keyframes oil-droplet-flow-secondary {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) scale(1.0);
            filter: blur(0px);
          }
          25% { 
            transform: translateX(3px) translateY(-2px) scale(1.01);
            filter: blur(0.3px);
          }
          50% { 
            transform: translateX(-1px) translateY(3px) scale(0.99);
            filter: blur(0.5px);
          }
          75% { 
            transform: translateX(2px) translateY(1px) scale(1.005);
            filter: blur(0.2px);
          }
        }
        
        /* Water Dye Diffusion - Color bleeding simulation */
        @keyframes water-dye-diffusion {
          0%, 100% { 
            background-position: 0% 50%, 100% 50%;
            opacity: 0.6;
            transform: scale(1.0);
          }
          16.67% { 
            background-position: 16.67% 83.33%, 83.33% 16.67%;
            opacity: 0.7;
            transform: scale(1.01);
          }
          33.33% { 
            background-position: 33.33% 66.67%, 66.67% 33.33%;
            opacity: 0.5;
            transform: scale(0.99);
          }
          50% { 
            background-position: 50% 50%, 50% 50%;
            opacity: 0.8;
            transform: scale(1.005);
          }
          66.67% { 
            background-position: 66.67% 33.33%, 33.33% 66.67%;
            opacity: 0.65;
            transform: scale(1.0);
          }
          83.33% { 
            background-position: 83.33% 16.67%, 16.67% 83.33%;
            opacity: 0.75;
            transform: scale(0.995);
          }
        }
        
        /* Projector Glass Subtle Movement */
        @keyframes projector-glass-subtle {
          0%, 100% { 
            background-position: 30% 40%, 70% 60%;
          }
          50% { 
            background-position: 35% 45%, 65% 55%;
          }
        }
        
        /* Audio Reactive Modifiers - Applied via JavaScript */
        .oil-film-base[data-beat="true"] {
          animation-duration: 15s !important;
          transform: scale(1.03) !important;
          transition: transform 0.1s ease-out !important;
        }
        
        .oil-droplet-layer[data-bass="high"] {
          animation-duration: 30s, 25s;
          opacity: 1.0 !important;
          filter: saturate(1.6) brightness(1.1);
        }
        
        .oil-droplet-layer[data-treble="high"] {
          animation-duration: 50s, 45s;
          filter: saturate(1.3) brightness(1.05) blur(0.3px);
        }
        
        .water-dye-layer[data-mids="high"] {
          animation-duration: 35s;
          filter: saturate(1.4) brightness(1.08);
        }
        
        /* Accessibility: Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .liquid-light-orchestra * {
            animation: none !important;
            transition: none !important;
          }
          
          .oil-film-base {
            background: linear-gradient(135deg, 
              hsla(280, 70%, 20%, 0.9) 0%,
              hsla(240, 75%, 30%, 0.8) 25%,
              hsla(180, 70%, 35%, 0.7) 50%,
              hsla(120, 75%, 25%, 0.8) 75%,
              hsla(280, 70%, 20%, 0.9) 100%) !important;
            background-size: 100% 100% !important;
            filter: saturate(1.1) brightness(1.0) !important;
          }
          
          .oil-droplet-layer,
          .water-dye-layer {
            opacity: 0.5 !important;
            background-size: 100% 100% !important;
          }
        }
        
        /* Mobile Performance Optimizations */
        @media (max-width: 768px) {
          .oil-film-base {
            animation-duration: 40s;
            background-size: 250% 250% !important;
          }
          
          .oil-droplet-layer {
            animation-duration: 45s, 40s;
            background-size: 150% 150%, 130% 130%, 170% 170%, 140% 140%;
            filter: saturate(1.2) brightness(1.0); /* Reduce intensity for mobile */
          }
          
          .water-dye-layer {
            animation-duration: 50s;
            background-size: 300% 300%, 280% 280%;
            opacity: 0.4 !important; /* Lower opacity for mobile performance */
          }
          
          .projector-glass-layer {
            display: none; /* Remove subtle effects on mobile for performance */
          }
        }
        
        /* High-performance devices can handle more complex animations */
        @media (min-width: 1920px) and (min-height: 1080px) {
          .oil-film-base {
            animation-duration: 25s;
          }
          
          .oil-droplet-layer {
            animation-duration: 35s, 30s;
          }
          
          .water-dye-layer {
            animation-duration: 40s;
          }
        }
      `}</style>
      
      {/* Fallback gradient for non-WebGL browsers */}
      <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000022] to-[#000011] -z-20"></div>

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

      {/* Floating Music Player */}
      <FloatingMusicPlayer onAudioDataChange={setAudioData} />
      </div>
    </>
  )
}