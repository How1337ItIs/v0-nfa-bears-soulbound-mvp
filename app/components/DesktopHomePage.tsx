"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { TouchButton } from "@/components/mobile/TouchButton"
import { MobileCard } from "@/components/mobile/MobileCard"
import { Users, Zap, Gift, Music, Heart, Star } from "lucide-react"

export default function DesktopHomePage() {
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
    { icon: Users, label: "Bears", value: "1,337", color: "text-[#1a1aff]" },
    { icon: Music, label: "Shows", value: "247", color: "text-[#ffff00]" },
    { icon: Heart, label: "Love", value: "∞", color: "text-[#ff3366]" },
    { icon: Gift, label: "Saved", value: "$143", color: "text-[#00ff88]" },
  ]

  const features = [
    {
      icon: "🎫",
      title: "Miracle SBTs",
      description: "Get verified through community or donation - soulbound tokens that prove your connection to the family.",
      color: "border-[#1a1aff]/30 bg-[#1a1aff]/10"
    },
    {
      icon: "🛍️", 
      title: "Vendor Discounts",
      description: "Save money at community businesses with member-only pricing and exclusive family deals.",
      color: "border-[#00ff88]/30 bg-[#00ff88]/10"
    },
    {
      icon: "🎪",
      title: "Live Events", 
      description: "Connect at shows and gatherings with GPS-verified venue access and real-world meetups.",
      color: "border-[#ffff00]/30 bg-[#ffff00]/10"
    },
    {
      icon: "🌈",
      title: "Family Network",
      description: "Anti-speculation community focused on authentic connections and Deadhead values.",
      color: "border-[#ff3366]/30 bg-[#ff3366]/10"
    }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            {/* Animated Bear */}
            <div className="text-6xl dancing-bear">🐻</div>
            
            {/* Main Heading */}
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight psychedelic-text-advanced glow-text">
              NFA Bears
            </h1>
            
            {/* Taglines */}
            <div className="space-y-2">
              <p className="text-2xl text-white/80">Not Fade Away</p>
              <p className="text-xl text-[#ff3366] font-semibold">Fuck crypto, real family shit</p>
              <p className="text-lg text-white/60">NFA Bears what!?!?</p>
            </div>
            
            {/* Description */}
            <p className="text-lg text-white/70 leading-relaxed max-w-lg">
              A Grateful Dead-inspired Web3 community preserving authentic connections through live music and real-world gatherings. Where the parking lot meets the blockchain.
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <TouchButton
                onClick={handleGetStarted}
                size="lg"
                variant="primary"
                className="px-8 py-4 text-lg"
                disabled={!ready}
              >
                {!ready ? "Loading..." : authenticated ? "Enter Dashboard 🚌" : "Join the Family 🌈"}
              </TouchButton>
              
              {!authenticated && (
                <p className="text-white/50 text-sm mt-3">Connect your wallet to get started</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="relative">
          {/* Fish Pair Orbital Dance - Larger for Desktop */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="animate-orbital">
              <svg width="400" height="400" viewBox="0 0 400 400" className="text-[#1a1aff] opacity-60">
                <path
                  d="M100 200c0-40 20-60 60-60s60 20 60 60-20 60-60 60-60-20-60-60zm140 0c0 40 20 60 60 60s60-20 60-60-20-60-60-60-60 20-60 40z"
                  fill="currentColor"
                />
                <path d="M80 200l30-15v30l-30-15z" fill="currentColor" opacity="0.4" />
                <path d="M340 200l-30 15v-30l30 15z" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <MobileCard key={index} variant="glassmorphic" className="text-center p-6">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </MobileCard>
          )
        })}
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 psychedelic-text-advanced glow-text">
          What Awaits You in the Family
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <MobileCard key={index} variant="glassmorphic" className={`p-8 border ${feature.color}`}>
              <div className="flex items-start space-x-4">
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center py-12 border-t border-white/10">
        {/* Terrapin Parade */}
        <div className="relative overflow-hidden h-20 mb-6 opacity-20">
          <div className="absolute inset-0 flex items-center animate-parade">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-shrink-0 mx-8">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#1a1aff]">
                  <path
                    d="M20 5C13.4 5 8 10.4 8 17s5.4 12 12 12 12-5.4 12-12S26.6 5 20 5zm0 5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 15c-3.4 0-6.4-1.8-8-4.5 1.6-2.7 4.6-4.5 8-4.5s6.4 1.8 8 4.5c-1.6 2.7-4.6 4.5-8 4.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/50">
            Not Fade Away • Not Financial Advice • Non-Fungible Acid Bears
          </p>
          <p className="text-white/40 text-sm">Built on Berachain with ❤️ for the family</p>
        </div>
      </div>
    </div>
  )
}