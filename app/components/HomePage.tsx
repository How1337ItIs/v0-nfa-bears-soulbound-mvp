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
    { icon: Users, label: "Members", value: "1,247", color: "text-pink-400" },
    { icon: Music, label: "Shows", value: "89", color: "text-purple-400" },
    { icon: Gift, label: "Discounts", value: "23", color: "text-blue-400" },
    { icon: Zap, label: "POATs", value: "156", color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center text-center py-12">
        {/* Animated Bear */}
        <div className="text-8xl mb-6 animate-bounce">🐻</div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            NFA Bears
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/80 mb-2 font-medium">Fuck crypto, real family shit</p>

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
            className="w-full max-w-sm mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-2xl shadow-pink-500/25"
            disabled={!ready}
          >
            {!ready ? "Loading..." : authenticated ? "Enter Dashboard 🚌" : "Join the Family 🌈"}
          </TouchButton>

          {!authenticated && <p className="text-white/50 text-sm">Connect your wallet to get started</p>}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">What Awaits You</h2>

        <div className="grid gap-4">
          <MobileCard variant="gradient" interactive>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Miracle SBTs</h3>
                <p className="text-white/70 text-sm">Get verified through community or donation</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard variant="gradient" interactive>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛍️</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Vendor Discounts</h3>
                <p className="text-white/70 text-sm">Save money at community businesses</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard variant="gradient" interactive>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
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

      {/* Footer */}
      <div className="text-center py-6 mt-8">
        <p className="text-white/50 text-sm">Not Fade Away • Not Financial Advice • Non-Fungible Acid Bears</p>
        <p className="text-white/40 text-xs mt-2">Built on Berachain with ❤️</p>
      </div>
    </div>
  )
}
