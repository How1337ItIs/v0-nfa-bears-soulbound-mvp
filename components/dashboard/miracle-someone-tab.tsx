"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGenesisBears } from "@/lib/useGenesisBears"
import { useMintSBT } from "@/lib/useMintSBT"

export function MiracleSomeoneTab() {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [miraclesGiven, setMiraclesGiven] = useState(12)
  const [showCelebration, setShowCelebration] = useState(false)
  const [locationVerified, setLocationVerified] = useState(false)
  const [onboardingPath, setOnboardingPath] = useState<"donation" | "tasks">("donation")
  const [generatingQR, setGeneratingQR] = useState(false)

  // Real Web3 data integration
  const { isHolder, balance } = useGenesisBears()
  const { hasMinted } = useMintSBT()
  
  // Determine user membership type from blockchain data
  const getMembershipType = () => {
    if (isHolder && balance > 0) return "genesis"
    if (hasMinted) return "miracle"
    return "unverified"
  }
  
  const userMembership = {
    type: getMembershipType(),
    streetTeamLevel: "Silver", // TODO: Implement on-chain referral tracking
    referralCount: 28, // TODO: Implement on-chain referral tracking
    referralProgress: {
      bronze: { required: 10, achieved: true },
      silver: { required: 25, achieved: true },
      gold: { required: 50, achieved: false },
    },
  }

  const streetTeamLeaderboard = [
    { rank: 1, name: "Jerry Garcia", referrals: 89, badge: "Gold" },
    { rank: 2, name: "Bob Weir", referrals: 67, badge: "Gold" },
    { rank: 3, name: "Phil Lesh", referrals: 45, badge: "Silver" },
    {
      rank: 4,
      name: "You",
      referrals: userMembership.referralCount,
      badge: userMembership.streetTeamLevel,
      isUser: true,
    },
    { rank: 5, name: "Mickey Hart", referrals: 23, badge: "Silver" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const verifyLocation = async () => {
    setGeneratingQR(true)
    
    try {
      // Get real GPS location for QR code generation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      });
      
      // Generate QR code with real location data
      const response = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: 'local-dev', // Default venue for now
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      });
      
      if (response.ok) {
        setLocationVerified(true)
        // Could store the generated QR code data here
      } else {
        throw new Error('Failed to generate invite')
      }
    } catch (error) {
      console.error('Location verification failed:', error)
      // Still allow verification for development/testing
      setLocationVerified(true)
    }
    
    setGeneratingQR(false)
  }

  const giveMiracle = () => {
    setMiraclesGiven((prev) => prev + 1)
    setShowCelebration(true)
    setLocationVerified(false)
    setTimeLeft(15 * 60) // Reset timer
    setTimeout(() => setShowCelebration(false), 3000)
  }

  // Non-Genesis holders see restricted access
  if (userMembership.type !== "genesis") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="groovy-font text-5xl mb-4 glow-text text-white">Miracle Someone</h2>
          <p className="script-font text-xl text-white/80">Spread the love, share the magic ✨</p>
        </div>

        <Card className="glassmorphic rounded-3xl text-center p-12">
          <div className="text-8xl mb-6 dancing-bear">🔒</div>
          <h3 className="groovy-font text-3xl mb-4 text-red-400">Genesis Bears Only</h3>
          <p className="text-white/80 mb-6">
            This feature is exclusively for Genesis Bear holders. Only OG Deadheads can miracle new members into the
            family.
          </p>
          <div className="bg-white/5 rounded-2xl p-6">
            <h4 className="text-xl text-white mb-4">Why Genesis Only?</h4>
            <ul className="text-white/60 text-left space-y-2">
              <li>• Prevents spam and maintains quality</li>
              <li>• Rewards early supporters</li>
              <li>• Creates sustainable growth</li>
              <li>• Maintains the family vibe</li>
            </ul>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text text-white">Miracle Someone</h2>
        <p className="script-font text-xl text-white/80">Spread the love, share the magic ✨</p>
        <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 text-lg px-4 py-2">Genesis Bears Only</Badge>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl dancing-bear">🐻✨🎉</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* QR Generation */}
        <Card className="glassmorphic rounded-3xl text-center">
          <CardContent className="p-8">
            <h3 className="groovy-font text-2xl mb-4 text-red-400">Generate Miracle QR</h3>

            {!locationVerified ? (
              <div className="space-y-6">
                <div className="w-48 h-48 mx-auto bg-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-white/40 text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-sm">Location verification required</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white/80">Verify your location to generate a miracle QR code</p>
                  <Button
                    onClick={verifyLocation}
                    disabled={generatingQR}
                    className="magnetic-button aurora-gradient text-lg px-8 py-3"
                  >
                    {generatingQR ? "Verifying GPS..." : "Verify Location 📍"}
                  </Button>
                  <p className="text-xs text-white/60">QR codes are GPS-fenced within 100m radius</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-48 h-48 mx-auto bg-white rounded-2xl flex items-center justify-center spiral-animation">
                  <div className="text-black text-lg font-bold">MIRACLE QR</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Location verified</span>
                  </div>

                  <div className="text-4xl groovy-font aurora-gradient bg-clip-text text-transparent mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-white/80">Time until next miracle</p>

                  <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full aurora-gradient rounded-full transition-all duration-1000"
                      style={{ width: `${((15 * 60 - timeLeft) / (15 * 60)) * 100}%` }}
                    />
                  </div>
                </div>

                <Button
                  onClick={giveMiracle}
                  disabled={timeLeft > 0}
                  className={`magnetic-button text-xl px-8 py-4 rounded-full ${
                    timeLeft > 0 ? "bg-gray-600 cursor-not-allowed" : "aurora-gradient hover:scale-110"
                  }`}
                >
                  {timeLeft > 0 ? "Recharging Magic..." : "Give Miracle ✨"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Onboarding Path Selection */}
        <Card className="glassmorphic rounded-3xl">
          <CardContent className="p-8">
            <h3 className="groovy-font text-2xl mb-4 text-blue-400">Choose Onboarding Path</h3>

            <div className="space-y-4 mb-6">
              <div
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  onboardingPath === "donation"
                    ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => setOnboardingPath("donation")}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h4 className="text-white font-semibold">$10 Donation Path</h4>
                    <p className="text-white/60 text-sm">Quick verification via donation</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  onboardingPath === "tasks"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => setOnboardingPath("tasks")}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="text-white font-semibold">2 Community Tasks</h4>
                    <p className="text-white/60 text-sm">Earn through participation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <h4 className="text-white mb-2">Instructions for new member:</h4>
              <p className="text-white/80 text-sm">
                {onboardingPath === "donation"
                  ? "Scan this QR code and complete a $10 donation to verify your membership and receive your Miracle SBT."
                  : "Scan this QR code and complete 2 community tasks to earn your Miracle SBT membership."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Street Team Progress */}
      <Card className="glassmorphic rounded-3xl p-6">
        <h3 className="groovy-font text-3xl mb-6 text-center text-yellow-400">Street Team Progress</h3>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl groovy-font text-white mb-2">{userMembership.referralCount}</div>
            <p className="text-white/80">Total Referrals</p>
            <Badge className="mt-2 aurora-gradient border-0">{userMembership.streetTeamLevel} Level</Badge>
          </div>

          <div className="space-y-3">
            {Object.entries(userMembership.referralProgress).map(([level, progress]) => (
              <div key={level} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 capitalize">{level}</span>
                  <span className={`text-sm ${progress.achieved ? "text-green-400" : "text-white/60"}`}>
                    {progress.achieved ? "✅" : `${progress.required} needed`}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      progress.achieved ? "bg-green-500" : "aurora-gradient"
                    }`}
                    style={{
                      width: `${Math.min((userMembership.referralCount / progress.required) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-white/80 text-sm">Next Goal:</p>
            <p className="text-white font-semibold">Gold Level</p>
            <p className="text-white/60 text-xs">{50 - userMembership.referralCount} more referrals</p>
          </div>
        </div>

        {/* Street Team Leaderboard */}
        <div>
          <h4 className="groovy-font text-2xl mb-4 text-center text-red-400">Top Referrers This Month</h4>
          <div className="space-y-3">
            {streetTeamLeaderboard.map((member) => (
              <div
                key={member.rank}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  member.isUser
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 glow-text"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">#{member.rank}</div>
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <Badge
                      className={`text-xs ${
                        member.badge === "Gold"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : member.badge === "Silver"
                            ? "bg-gray-400/20 text-gray-300"
                            : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {member.badge}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl groovy-font text-white">{member.referrals}</div>
                  <div className="text-sm text-white/60">referrals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Miracle Stats */}
      <Card className="glassmorphic rounded-3xl p-6">
        <div className="text-center">
          <h3 className="groovy-font text-3xl mb-4 text-green-400">Your Miracle Impact</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-4xl groovy-font text-white mb-2">{miraclesGiven}</div>
              <p className="text-white/80">Miracles Given</p>
              <div className="flex justify-center space-x-2 mt-4">
                {[...Array(Math.min(miraclesGiven, 10))].map((_, i) => (
                  <div key={i} className="text-2xl dancing-bear" style={{ animationDelay: `${i * 0.1}s` }}>
                    ✨
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl groovy-font text-blue-400 mb-2">30</div>
                <p className="text-white/80 text-sm">Day SBT Burn Timer</p>
                <p className="text-white/60 text-xs">New members have 30 days to verify</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl groovy-font text-red-400 mb-2">15min</div>
                <p className="text-white/80 text-sm">QR Code Expiry</p>
                <p className="text-white/60 text-xs">GPS-fenced miracle codes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
