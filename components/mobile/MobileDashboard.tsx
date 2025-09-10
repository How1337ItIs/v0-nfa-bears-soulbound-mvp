"use client"

import { useState, useRef } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { MobileCard } from "./MobileCard"
import { TouchButton } from "./TouchButton"
import { QRScannerMobile } from "./QRScannerMobile"
import { Ticket, Gift, Users, Zap, QrCode, TrendingUp } from "lucide-react"

export function MobileDashboard() {
  const { user } = usePrivy()
  const [showScanner, setShowScanner] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sections = [
    {
      id: "sbt",
      title: "Your SBT",
      icon: Ticket,
      emoji: "🎫",
    },
    {
      id: "events",
      title: "Events",
      icon: Users,
      emoji: "🎪",
    },
    {
      id: "discounts",
      title: "Discounts",
      icon: Gift,
      emoji: "💰",
    },
    {
      id: "community",
      title: "Community",
      icon: TrendingUp,
      emoji: "🤝",
    },
  ]

  const handleScanSuccess = (result: string) => {
    console.log("Scanned:", result)
    setShowScanner(false)
    // Handle the scanned result
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <div className="text-6xl mb-4 animate-bounce">🐻</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back, <span className="text-pink-400">Deadhead</span>!
        </h1>
        <p className="text-white/70">Hey there, {user?.email?.address || "Beautiful Soul"} ✨</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <TouchButton
          onClick={() => setShowScanner(true)}
          className="h-20 bg-gradient-to-r from-pink-500 to-purple-500"
          size="lg"
        >
          <QrCode className="w-6 h-6 mr-2" />
          Scan QR
        </TouchButton>

        <TouchButton variant="secondary" className="h-20" size="lg">
          <Zap className="w-6 h-6 mr-2" />
          Generate
        </TouchButton>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(index)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              currentSection === index
                ? "bg-pink-500/30 text-white border border-pink-400/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            <span className="text-lg">{section.emoji}</span>
            <span className="font-medium">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Current Section Content */}
      <div className="space-y-4">
        {currentSection === 0 && <SBTSection />}
        {currentSection === 1 && <EventsSection />}
        {currentSection === 2 && <DiscountsSection />}
        {currentSection === 3 && <CommunitySection />}
      </div>

      {/* QR Scanner Modal */}
      <QRScannerMobile isOpen={showScanner} onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />
    </div>
  )
}

function SBTSection() {
  return (
    <div className="space-y-4">
      <MobileCard variant="gradient" glow>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🎭</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Miracle SBT</h3>
          <p className="text-white/70 mb-4">Community Member since Jan 2024</p>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pink-400">7</div>
              <div className="text-white/60 text-sm">POATs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">$143</div>
              <div className="text-white/60 text-sm">Saved</div>
            </div>
          </div>
        </div>
      </MobileCard>

      <MobileCard variant="glassmorphic">
        <h4 className="text-lg font-semibold text-white mb-3">Member Benefits</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">10% Vendor Discounts</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">Community Access</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">Event Priority</span>
          </div>
        </div>
      </MobileCard>
    </div>
  )
}

function EventsSection() {
  const events = [
    {
      title: "Dead & Company",
      date: "Dec 30, 2024",
      venue: "Madison Square Garden",
      status: "Attending",
    },
    {
      title: "Phil Lesh & Friends",
      date: "Jan 15, 2025",
      venue: "Capitol Theatre",
      status: "Interested",
    },
  ]

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <MobileCard key={index} variant="glassmorphic" interactive>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{event.title}</h4>
              <p className="text-white/70 text-sm">
                {event.date} • {event.venue}
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  event.status === "Attending" ? "bg-green-400/20 text-green-400" : "bg-yellow-400/20 text-yellow-400"
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </MobileCard>
      ))}
    </div>
  )
}

function DiscountsSection() {
  const discounts = [
    {
      vendor: "Shakedown Coffee",
      discount: "15% off",
      category: "Food & Drink",
      expires: "Dec 31",
    },
    {
      vendor: "Tie-Dye Threads",
      discount: "20% off",
      category: "Apparel",
      expires: "Jan 15",
    },
  ]

  return (
    <div className="space-y-4">
      <MobileCard variant="neon">
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-400 mb-2">$143</div>
          <p className="text-white/80">Total Saved This Month</p>
        </div>
      </MobileCard>

      {discounts.map((discount, index) => (
        <MobileCard key={index} variant="glassmorphic" interactive>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">{discount.vendor}</h4>
              <p className="text-white/70 text-sm">{discount.category}</p>
              <p className="text-white/50 text-xs">Expires {discount.expires}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-400">{discount.discount}</div>
              <TouchButton size="sm" className="mt-2">
                Use Now
              </TouchButton>
            </div>
          </div>
        </MobileCard>
      ))}
    </div>
  )
}

function CommunitySection() {
  const activities = [
    {
      user: "Jerry_Garcia_Fan",
      action: "joined the community",
      time: "2 hours ago",
    },
    {
      user: "DeadHead_Dave",
      action: "shared a show review",
      time: "4 hours ago",
    },
    {
      user: "Miracle_Mary",
      action: "earned a new POAT",
      time: "6 hours ago",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <MobileCard variant="glassmorphic" className="text-center">
          <div className="text-2xl font-bold text-pink-400">1,247</div>
          <div className="text-white/60 text-sm">Members</div>
        </MobileCard>
        <MobileCard variant="glassmorphic" className="text-center">
          <div className="text-2xl font-bold text-purple-400">89</div>
          <div className="text-white/60 text-sm">Online</div>
        </MobileCard>
        <MobileCard variant="glassmorphic" className="text-center">
          <div className="text-2xl font-bold text-blue-400">23</div>
          <div className="text-white/60 text-sm">Events</div>
        </MobileCard>
      </div>

      <MobileCard variant="glassmorphic">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-sm">🐻</span>
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm">
                  <span className="font-medium text-pink-400">{activity.user}</span> {activity.action}
                </p>
                <p className="text-white/50 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>
    </div>
  )
}
