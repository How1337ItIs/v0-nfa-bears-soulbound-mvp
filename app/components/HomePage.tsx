"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { TouchButton } from "@/components/mobile/TouchButton"
import { MobileCard } from "@/components/mobile/MobileCard"
import { Users, Zap, Heart } from "lucide-react"

export default function HomePage() {
  const { login, authenticated, ready } = usePrivy()
  const router = useRouter()

  const handleConnect = async () => {
    if (authenticated) {
      router.push("/dashboard")
    } else {
      await login()
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-8">
      {/* Hero Section with Fish Pair Orbital Dance */}
      <div className="relative overflow-hidden pt-8">
        {/* Fish Pair Background - Large Orbital Dance */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <div className="animate-orbital">
            <svg width="300" height="300" viewBox="0 0 300 300" className="text-[#1a1aff]">
              <path
                d="M75 150c0-30 15-45 45-45s45 15 45 45-15 45-45 45-45-15-45-45zm105 0c0 30 15 45 45 45s45-15 45-45-15-45-45-45-45 15-45 45z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6 dancing-bear">🐻</div>
          <h1 className="text-4xl font-bold text-white glow-text mb-4">NFA Bears</h1>
          <p className="text-xl text-white/80 mb-2">Not Fade Away</p>
          <p className="text-lg text-[#ff3366] font-semibold mb-8">Fuck crypto, real family shit</p>

          <TouchButton size="lg" onClick={handleConnect} disabled={!ready} className="w-full max-w-sm mx-auto">
            {!ready ? "Loading..." : authenticated ? "Enter Dashboard" : "Join the Family"}
          </TouchButton>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4">
        <MobileCard variant="glassmorphic" className="text-center">
          <Users className="w-6 h-6 text-[#1a1aff] mx-auto mb-2" />
          <div className="text-xl font-bold text-white">1,337</div>
          <div className="text-white/70 text-xs">Bears</div>
        </MobileCard>

        <MobileCard variant="glassmorphic" className="text-center">
          <Zap className="w-6 h-6 text-[#ffff00] mx-auto mb-2" />
          <div className="text-xl font-bold text-white">247</div>
          <div className="text-white/70 text-xs">Shows</div>
        </MobileCard>

        <MobileCard variant="glassmorphic" className="text-center">
          <Heart className="w-6 h-6 text-[#ff3366] mx-auto mb-2" />
          <div className="text-xl font-bold text-white">∞</div>
          <div className="text-white/70 text-xs">Love</div>
        </MobileCard>
      </div>

      {/* What is NFA Bears */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <span className="mr-2">🎪</span>
          What is NFA Bears?
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          A Grateful Dead-inspired Web3 community preserving authentic connections through soulbound tokens. Get invited
          by existing members at shows and venues.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-white/70">
            <span className="w-2 h-2 bg-[#1a1aff] rounded-full mr-3"></span>
            Real-world verification at venues
          </div>
          <div className="flex items-center text-white/70">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full mr-3"></span>
            Member discounts and benefits
          </div>
          <div className="flex items-center text-white/70">
            <span className="w-2 h-2 bg-[#ffff00] rounded-full mr-3"></span>
            Anti-speculation, family-first
          </div>
        </div>
      </MobileCard>

      {/* Terrapin Parade at Bottom */}
      <div className="relative overflow-hidden h-16 opacity-20">
        <div className="absolute inset-0 flex items-center animate-parade">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 mx-8">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-[#1a1aff]">
                <path
                  d="M16 4C10.5 4 6 8.5 6 14s4.5 10 10 10 10-4.5 10-10S21.5 4 16 4zm0 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 12c-2.7 0-5.1-1.4-6.4-3.6 1.3-2.2 3.7-3.6 6.4-3.6s5.1 1.4 6.4 3.6C21.1 18.6 18.7 20 16 20z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
