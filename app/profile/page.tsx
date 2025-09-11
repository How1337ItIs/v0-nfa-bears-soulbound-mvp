"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MobileCard } from "@/components/mobile/MobileCard"
import { TouchButton } from "@/components/mobile/TouchButton"
import { User, Wallet, Shield, LogOut, Copy, ExternalLink } from "lucide-react"
import { useLayout } from "@/providers/LayoutProvider"

export default function ProfilePage() {
  const { authenticated, ready, user, logout } = usePrivy()
  const router = useRouter()
  const { isMobile } = useLayout()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  const handleCopyAddress = async () => {
    if (user?.wallet?.address) {
      try {
        await navigator.clipboard.writeText(user.wallet.address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
      }
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐻</div>
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  const profileInfo = [
    {
      icon: User,
      label: "Email",
      value: user?.email?.address || "Not connected",
      color: "text-[#1a1aff]"
    },
    {
      icon: Wallet,
      label: "Wallet",
      value: user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : "Not connected",
      fullValue: user?.wallet?.address,
      color: "text-[#00ff88]",
      copyable: true
    },
    {
      icon: Shield,
      label: "Chain",
      value: "Berachain Bepolia",
      color: "text-[#ffff00]"
    }
  ]

  return (
    <div className={`min-h-screen ${isMobile ? 'p-4 pb-20' : 'max-w-4xl mx-auto px-6 py-8'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 dancing-bear">🐻</div>
        <h1 className="text-3xl font-bold text-white glow-text mb-2">Your Profile</h1>
        <p className="text-white/70">Manage your NFA Bears identity</p>
      </div>

      {/* Profile Info */}
      <div className="space-y-4 mb-8">
        {profileInfo.map((info, index) => {
          const Icon = info.icon
          return (
            <MobileCard key={index} variant="glassmorphic" className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${info.color}`} />
                </div>
                <div>
                  <div className="text-white/60 text-sm">{info.label}</div>
                  <div className="text-white font-medium">
                    {info.value}
                  </div>
                </div>
              </div>
              
              {info.copyable && info.fullValue && (
                <button
                  onClick={handleCopyAddress}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Copy full address"
                >
                  {copied ? (
                    <span className="text-green-400 text-sm">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </MobileCard>
          )
        })}
      </div>

      {/* Member Status */}
      <MobileCard variant="glassmorphic" className="mb-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🎪</div>
          <h3 className="text-lg font-semibold text-white mb-2">Member Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
              <span className="text-[#00ff88] text-sm font-medium">Connected Member</span>
            </div>
            <p className="text-white/70 text-sm">
              Welcome to the NFA Bears family! You're part of our Grateful Dead-inspired Web3 community.
            </p>
          </div>
        </div>
      </MobileCard>

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        
        <div className="grid gap-4">
          <MobileCard variant="glassmorphic" onClick={() => router.push("/dashboard")}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎪</div>
              <div>
                <div className="text-white font-medium">Dashboard</div>
                <div className="text-white/60 text-sm">View your member hub</div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 ml-auto" />
            </div>
          </MobileCard>

          <MobileCard variant="glassmorphic" onClick={() => router.push("/scan")}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <div className="text-white font-medium">Scan QR</div>
                <div className="text-white/60 text-sm">Scan invite codes</div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 ml-auto" />
            </div>
          </MobileCard>
        </div>
      </div>

      {/* Logout Button */}
      <div className="space-y-4">
        <TouchButton
          onClick={handleLogout}
          variant="destructive"
          size="lg"
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect Wallet</span>
        </TouchButton>
        
        <p className="text-center text-white/50 text-sm">
          Disconnecting will log you out of the app
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 py-6 border-t border-white/10">
        <p className="text-white/40 text-sm">
          Not Fade Away • NFA Bears Family
        </p>
      </div>
    </div>
  )
}