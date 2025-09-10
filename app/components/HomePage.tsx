"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { TouchButton } from "@/components/mobile/TouchButton"
import { MobileCard } from "@/components/mobile/MobileCard"
import { Users, Zap, Gift, Music } from "lucide-react"

export default function HomePage() {
  const { login, authenticated, ready } = usePrivy()
  const router = useRouter()

  const handleGetStarted = () => {
    if (authenticated) {
      router.push("/dashboard")
    } else {
      login()
    }
  }

  const stats = [
    { icon: Users, label: "Family", value: "1,247", color: "text-[#00ff88]" },
    { icon: Music, label: "Shows", value: "89", color: "text-[#1a1aff]" },
    { icon: Gift, label: "Saved", value: "$143", color: "text-[#ffff00]" },
    { icon: Zap, label: "POATs", value: "156", color: "text-[#ff3366]" },
  ]

  return (
    <div className="min-h-screen p-4 flex flex-col relative">
      {/* Hero Fish Pair Background */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
        <div className="relative w-80 h-80">
          <svg width="320" height="320" viewBox="0 0 320 320" className="animate-orbital">
            {/* Fish 1 */}
            <path d="M80 160c0-30 20-50 50-50s50 20 50 50-20 50-50 50-50-20-50-50z" fill="#1a1aff" opacity="0.6" />
            <path d="M70 160l20-10v20l-20-10z" fill="#1a1aff" opacity="0.4" />
            {/* Fish 2 */}
            <path d="M190 160c0 30 20 50 50 50s50-20 50-50-20-50-50-50-50 20-50 50z" fill="#1a1aff" opacity="0.6" />
            <path d="M270 160l-20 10v-20l20 10z" fill="#1a1aff" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center text-center py-12 relative z-10">
        {/* Animated Bear */}
        <div className="text-8xl mb-6 animate-bounce">🐻</div>

        {/* Main Heading with Blue Glow */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight glow-text">NFA Bears</h1>

        {/* Tagline - Red text, no glow */}
        <p className="text-xl md:text-2xl text-[#ff3366] mb-2 font-medium">Fuck crypto, real family shit</p>

        <p className="text-lg text-white/60 mb-8">NFA Bears what!?!?</p>

        {/* Description */}
        <div className="max-w-md mx-auto mb-8">
          <p className="text-white/70 leading-relaxed">
            A Grateful Dead-inspired Web3 community preserving authentic connections through live music and real-world
            gatherings.
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <TouchButton
            onClick={handleGetStarted}
            size="xl"
            variant="primary"
            glow
            className="w-full max-w-sm mx-auto"
            disabled={!ready}
          >
            {!ready ? "Loading..." : authenticated ? "Enter Dashboard 🚌" : "Join the Family 🌈"}
          </TouchButton>

          {!authenticated && <p className="text-white/50 text-sm">Connect your wallet to get started</p>}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <MobileCard key={index} variant="glassmorphic" className="text-center p-4">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </MobileCard>
          )
        })}
      </div>

      {/* Features Preview */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-2xl font-bold text-white text-center mb-6 glow-text">What Awaits You</h2>

        <div className="grid gap-4">
          <MobileCard variant="glassmorphic" interactive className="relative overflow-hidden">
            {/* Terrapin watermark */}
            <div className="absolute top-2 right-2 opacity-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" className="text-white">
                <path d="M20 3C11.2 3 4 10.2 4 19s7.2 16 16 16 16-7.2 16-16S28.8 3 20 3zm0 5c3 0 5.5 2.5 5.5 5.5S23 19 20 19s-5.5-2.5-5.5-5.5S17 8 20 8zm0 20c-4.1 0-7.8-2.1-10-5.5 2.2-3.4 5.9-5.5 10-5.5s7.8 2.1 10 5.5c-2.2 3.4-5.9 5.5-10 5.5z" />
              </svg>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#1a1aff]/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Miracle SBTs</h3>
                <p className="text-white/70 text-sm">Get verified through community or donation</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard variant="glassmorphic" interactive>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#00ff88]/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛍️</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Vendor Discounts</h3>
                <p className="text-white/70 text-sm">Save money at community businesses</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard variant="glassmorphic" interactive>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ffff00]/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎪</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Live Events</h3>
                <p className="text-white/70 text-sm">Connect at shows and gatherings</p>
              </div>
            </div>
          </MobileCard>
        </div>
      </div>

      {/* Terrapin Parade at Bottom */}
      <div className="text-center py-6 mt-8 relative">
        <div className="absolute bottom-0 left-0 right-0 opacity-5 overflow-hidden">
          <div className="flex animate-parade">
            {[...Array(8)].map((_, i) => (
              <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white mx-4">
                <path d="M12 2C7.6 2 4 5.6 4 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 10c-2.2 0-4.2-1.2-5.3-3 1.1-1.8 3.1-3 5.3-3s4.2 1.2 5.3 3c-1.1 1.8-3.1 3-5.3 3z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm relative z-10">
          Not Fade Away • Not Financial Advice • Non-Fungible Acid Bears
        </p>
        <p className="text-white/40 text-xs mt-2 relative z-10">Built on Berachain with ❤️</p>
      </div>
    </div>
  )
}
