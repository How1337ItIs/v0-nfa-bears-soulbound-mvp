"use client"

import { useState } from "react"
import { MobileCard } from "./MobileCard"
import { TouchButton } from "./TouchButton"
import { QRScannerMobile } from "./QRScannerMobile"
import { Users, Zap, Gift, Music, QrCode, Plus, TrendingUp, Calendar } from "lucide-react"

export function MobileDashboard() {
  const [showScanner, setShowScanner] = useState(false)

  const handleScanSuccess = (result: string) => {
    console.log("Scanned:", result)
    setShowScanner(false)
    // Handle scan result
  }

  const stats = [
    { icon: Users, label: "Family", value: "1,247", color: "text-[#00ff88]" },
    { icon: Music, label: "Shows", value: "89", color: "text-[#1a1aff]" },
    { icon: Gift, label: "Saved", value: "$143", color: "text-[#ffff00]" },
    { icon: Zap, label: "POATs", value: "7", color: "text-[#ff3366]" },
  ]

  const quickActions = [
    {
      icon: QrCode,
      label: "Scan Code",
      action: () => setShowScanner(true),
      variant: "primary" as const,
    },
    {
      icon: Plus,
      label: "Generate",
      action: () => console.log("Generate invite"),
      variant: "secondary" as const,
    },
  ]

  const upcomingEvents = [
    {
      date: "Dec 15",
      title: "Shakedown Street Jam",
      venue: "The Fillmore",
      distance: "2.3 mi",
    },
    {
      date: "Dec 18",
      title: "Terrapin Station",
      venue: "Golden Gate Park",
      distance: "5.1 mi",
    },
  ]

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Member Status Card */}
      <MobileCard variant="glassmorphic" className="relative overflow-hidden">
        {/* Terrapin watermark */}
        <div className="absolute top-4 right-4 opacity-5">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <path d="M30 5C16.2 5 5 16.2 5 30s11.2 25 25 25 25-11.2 25-25S43.8 5 30 5zm0 8c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm0 30c-6.2 0-11.7-3.2-15-8 3.3-4.8 8.8-8 15-8s11.7 3.2 15 8c-3.3 4.8-8.8 8-15 8z" />
          </svg>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1a1aff]/30 to-[#ff3366]/30 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🎫</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">Miracle SBT Holder</h2>
            <p className="text-white/70 text-sm">Member since Oct 2024</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full mr-2 animate-pulse"></div>
              <span className="text-[#00ff88] text-sm font-medium">Verified</span>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <MobileCard key={index} variant="glassmorphic" className="text-center p-4">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </MobileCard>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <TouchButton
              key={index}
              variant={action.variant}
              size="lg"
              onClick={action.action}
              className="flex-col space-y-2 h-20"
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{action.label}</span>
            </TouchButton>
          )
        })}
      </div>

      {/* Upcoming Events */}
      <MobileCard variant="glassmorphic">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Shows</h3>
          <Calendar className="w-5 h-5 text-[#1a1aff]" />
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-[#ffff00] font-bold text-sm">{event.date}</div>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{event.title}</h4>
                  <p className="text-white/60 text-xs">{event.venue}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#1a1aff] text-xs font-medium">{event.distance}</div>
                <TrendingUp className="w-4 h-4 text-[#00ff88] ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Recent Activity */}
      <MobileCard variant="glassmorphic">
        <h3 className="text-lg font-semibold text-white mb-4">Family Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#1a1aff]/30 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-[#1a1aff]" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">
                <span className="font-medium">Jerry_G</span> joined the family
              </p>
              <p className="text-white/50 text-xs">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#00ff88]/30 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-[#00ff88]" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">
                <span className="font-medium">You</span> saved $12 at Crystal Bay
              </p>
              <p className="text-white/50 text-xs">1 day ago</p>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* QR Scanner Modal */}
      <QRScannerMobile isOpen={showScanner} onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />
    </div>
  )
}
