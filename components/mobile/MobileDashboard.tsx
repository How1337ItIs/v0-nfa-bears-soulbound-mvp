"use client"

import { useState } from "react"
import { MobileCard } from "./MobileCard"
import { TouchButton } from "./TouchButton"
import { QRScannerMobile } from "./QRScannerMobile"
import { Scan, QrCode, Users, Gift, TrendingUp, Calendar } from "lucide-react"

export function MobileDashboard() {
  const [showScanner, setShowScanner] = useState(false)

  const handleScanSuccess = (result: string) => {
    console.log("Scanned:", result)
    setShowScanner(false)
    // Handle the scanned result
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Hero Section with Fish Pair */}
      <div className="relative overflow-hidden">
        {/* Fish Pair Background */}
        <div className="absolute inset-0 opacity-15">
          <div className="animate-orbital">
            <svg width="200" height="200" viewBox="0 0 200 200" className="absolute top-0 left-0 text-[#1a1aff]">
              <path
                d="M50 100c0-20 10-30 30-30s30 10 30 30-10 30-30 30-30-10-30-30zm70 0c0 20 10 30 30 30s30-10 30-30-10-30-30-30-30 10-30 30z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <MobileCard variant="hero" className="relative z-10">
          <div className="text-center">
            <div className="text-4xl mb-2">🐻</div>
            <h1 className="text-2xl font-bold text-white glow-text mb-2">Welcome Back, Bear</h1>
            <p className="text-white/70">Ready for some real family shit?</p>
          </div>
        </MobileCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MobileCard variant="glassmorphic">
          <div className="text-center">
            <Users className="w-8 h-8 text-[#1a1aff] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">247</div>
            <div className="text-white/70 text-sm">Days on Bus</div>
          </div>
        </MobileCard>

        <MobileCard variant="glassmorphic">
          <div className="text-center">
            <Gift className="w-8 h-8 text-[#00ff88] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$143</div>
            <div className="text-white/70 text-sm">Saved</div>
          </div>
        </MobileCard>
      </div>

      {/* Quick Actions */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <TouchButton variant="primary" size="lg" onClick={() => setShowScanner(true)} className="flex-col space-y-2">
            <Scan className="w-6 h-6" />
            <span>Scan Code</span>
          </TouchButton>
          <TouchButton variant="secondary" size="lg" className="flex-col space-y-2">
            <QrCode className="w-6 h-6" />
            <span>Generate</span>
          </TouchButton>
        </div>
      </MobileCard>

      {/* Member Benefits */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <span className="mr-2">🎪</span>
          Your SBT
        </h3>
        <div className="bg-gradient-to-r from-[#1a1aff]/20 to-[#ff3366]/20 rounded-xl p-4 border border-[#1a1aff]/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white font-semibold">Miracle SBT #1337</div>
              <div className="text-white/70 text-sm">Verified Member</div>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Discounts</span>
            <span className="text-[#00ff88]">20% Active</span>
          </div>
        </div>
      </MobileCard>

      {/* Recent Activity */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
            <div className="flex-1">
              <div className="text-white text-sm">Welcomed new member</div>
              <div className="text-white/50 text-xs">2 hours ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#1a1aff] rounded-full"></div>
            <div className="flex-1">
              <div className="text-white text-sm">Used discount at venue</div>
              <div className="text-white/50 text-xs">1 day ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#ffff00] rounded-full"></div>
            <div className="flex-1">
              <div className="text-white text-sm">Earned POAT badge</div>
              <div className="text-white/50 text-xs">3 days ago</div>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Upcoming Events */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Shows
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Dead & Company</div>
              <div className="text-white/70 text-sm">Sphere, Las Vegas</div>
            </div>
            <div className="text-right">
              <div className="text-[#1a1aff] font-semibold">Dec 15</div>
              <div className="text-white/50 text-xs">8:00 PM</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Phil Lesh & Friends</div>
              <div className="text-white/70 text-sm">Capitol Theatre</div>
            </div>
            <div className="text-right">
              <div className="text-[#1a1aff] font-semibold">Dec 20</div>
              <div className="text-white/50 text-xs">7:30 PM</div>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* QR Scanner Modal */}
      <QRScannerMobile isOpen={showScanner} onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />
    </div>
  )
}
