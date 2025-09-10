"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MyJourneyTab() {
  // Mock user data - in real app, this would come from context/API
  const userStats = {
    daysOnBus: 42,
    totalSavings: 143,
    monthlySavings: 67,
    poatsCollected: 8,
    miraclesGiven: 3,
    referralsMade: 5,
    vendorSupport: 89,
    memberSince: "2024-01-15",
    currentLevel: "Miracle Holder",
    nextLevel: "Genesis Bear",
  }

  const milestones = [
    { date: "2024-01-15", title: "Joined the Family", description: "First login to NFA Bears", icon: "🎉" },
    { date: "2024-01-20", title: "First POAT", description: "Collected at Berkeley show", icon: "🎫" },
    { date: "2024-02-01", title: "Miracle Giver", description: "Helped first new member", icon: "✨" },
    { date: "2024-02-15", title: "Vendor Supporter", description: "Used first discount", icon: "🛍️" },
    { date: "2024-03-01", title: "Community Builder", description: "5 successful referrals", icon: "🌟" },
  ]

  const achievements = [
    { name: "Early Adopter", description: "Joined in first month", unlocked: true, icon: "🚀" },
    { name: "POAT Collector", description: "Collected 5+ POATs", unlocked: true, icon: "🎫" },
    { name: "Miracle Worker", description: "Helped 3+ new members", unlocked: true, icon: "✨" },
    { name: "Vendor Friend", description: "Saved $100+ with discounts", unlocked: true, icon: "💰" },
    { name: "Community Leader", description: "5+ referrals made", unlocked: true, icon: "👑" },
    { name: "Genesis Candidate", description: "Ready for Genesis Bear", unlocked: false, icon: "🐻" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="groovy-font text-4xl mb-4 glow-text">My Cosmic Journey 🛤️</h2>
        <p className="text-white/80 text-lg">Your path through the NFA Bears universe</p>
      </div>

      {/* Financial Impact */}
      <Card className="glassmorphic-card cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">💰 Financial Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${userStats.totalSavings}</div>
              <div className="text-white/80">Total Saved</div>
              <div className="text-white/60 text-sm">Since joining</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">${userStats.monthlySavings}</div>
              <div className="text-white/80">This Month</div>
              <div className="text-white/60 text-sm">Member discounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">${userStats.vendorSupport}</div>
              <div className="text-white/80">Vendor Support</div>
              <div className="text-white/60 text-sm">Generated for community</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cosmic Stats */}
      <Card className="glassmorphic-card cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">🌟 Cosmic Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🚌</div>
              <div className="text-2xl font-bold text-white">{userStats.daysOnBus}</div>
              <div className="text-white/80 text-sm">Days on Bus</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🎫</div>
              <div className="text-2xl font-bold text-white">{userStats.poatsCollected}</div>
              <div className="text-white/80 text-sm">POATs Collected</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">✨</div>
              <div className="text-2xl font-bold text-white">{userStats.miraclesGiven}</div>
              <div className="text-white/80 text-sm">Miracles Given</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🌈</div>
              <div className="text-2xl font-bold text-white">{userStats.referralsMade}</div>
              <div className="text-white/80 text-sm">Referrals Made</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Milestones */}
      <Card className="glassmorphic-card cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">🏆 Community Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg">
                <div className="text-2xl">{milestone.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{milestone.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {new Date(milestone.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="glassmorphic-card cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">🏅 Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked
                    ? "bg-yellow-500/10 border-yellow-400/30 hover:scale-105"
                    : "bg-white/5 border-white/20 opacity-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-bold text-white mb-1">{achievement.name}</h4>
                  <p className="text-white/80 text-sm">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-400">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2 text-white/60">
                      Locked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Level Up Preview */}
      <Card className="glassmorphic-card cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">🚀 Level Up Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">✨</div>
                <div className="text-white font-bold">{userStats.currentLevel}</div>
              </div>
              <div className="text-2xl text-white/60">→</div>
              <div className="text-center">
                <div className="text-2xl mb-1">🐻</div>
                <div className="text-red-400 font-bold">{userStats.nextLevel}</div>
              </div>
            </div>

            <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/30">
              <h4 className="font-bold text-white mb-2">Genesis Bear Benefits</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-white/80">
                <div>• 20% discounts (vs 10%)</div>
                <div>• DAO voting rights</div>
                <div>• Ambassador privileges</div>
                <div>• Exclusive events</div>
                <div>• Priority support</div>
                <div>• Genesis holder perks</div>
              </div>
            </div>

            <Button className="bg-red-500 hover:bg-red-600 text-white">Explore Genesis Bears 🐻</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
