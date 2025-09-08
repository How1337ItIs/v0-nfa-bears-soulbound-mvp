"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TheFamilyTab() {
  const [votes, setVotes] = useState<{ [key: number]: string }>({})

  const proposals = [
    {
      id: 1,
      title: "Summer Tour 2024 Locations",
      description: "Vote on which cities we should visit this summer",
      progress: 67,
      type: "Sentiment",
      timeLeft: "5 days left",
    },
    {
      id: 2,
      title: "New Merchandise Design",
      description: "Choose the next t-shirt design for the community",
      progress: 43,
      type: "Binding",
      timeLeft: "12 days left",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Jerry Garcia", miracles: 247, avatar: "🎸" },
    { rank: 2, name: "Bob Weir", miracles: 198, avatar: "🎵" },
    { rank: 3, name: "Phil Lesh", miracles: 156, avatar: "🎶" },
    { rank: 4, name: "You", miracles: 89, avatar: "🐻", isUser: true },
    { rank: 5, name: "Mickey Hart", miracles: 78, avatar: "🥁" },
  ]

  const stats = [
    { label: "Total Members", value: "2,847", icon: "👥" },
    { label: "Shows Hosted", value: "156", icon: "🎵" },
    { label: "Miracles Given", value: "12,847", icon: "✨" },
  ]

  const castVote = (proposalId: number, vote: string) => {
    setVotes((prev) => ({ ...prev, [proposalId]: vote }))
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text text-white">The Family</h2>
        <p className="script-font text-xl text-white/80">Together we make the magic happen ✨</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glassmorphic rounded-3xl text-center breathe-animation">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl groovy-font aurora-gradient bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-white/80">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="groovy-font text-3xl mb-6 text-center text-red-400">Active Proposals</h3>
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="glassmorphic rounded-3xl float-animation">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{proposal.title}</h4>
                    <p className="text-white/80 mb-2">{proposal.description}</p>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          proposal.type === "Binding" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {proposal.type} Vote
                      </span>
                      <span className="text-white/60">{proposal.timeLeft}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/80 mb-2">
                    <span>Progress</span>
                    <span>{proposal.progress}%</span>
                  </div>
                  <div className="melting-progress h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full aurora-gradient transition-all duration-1000"
                      style={{ width: `${proposal.progress}%` }}
                    />
                  </div>
                </div>

                {votes[proposal.id] ? (
                  <div className="text-center py-4">
                    <div className="text-white text-lg mb-2">✅ Vote Cast!</div>
                    <p className="text-white/60">You voted: {votes[proposal.id]}</p>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => castVote(proposal.id, "Yes")}
                      className="flex-1 magnetic-button bg-blue-600 hover:bg-blue-700"
                    >
                      Yes 👍
                    </Button>
                    <Button
                      onClick={() => castVote(proposal.id, "No")}
                      className="flex-1 magnetic-button bg-red-600 hover:bg-red-700"
                    >
                      No 👎
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="groovy-font text-3xl mb-6 text-center text-red-400">Street Team Leaderboard</h3>
        <Card className="glassmorphic rounded-3xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {leaderboard.map((member) => (
                <div
                  key={member.rank}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    member.isUser
                      ? "bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30 glow-text"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl ${member.isUser ? "dancing-bear" : ""}`}>{member.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{member.name}</div>
                      <div className="text-sm text-white/60">Rank #{member.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl groovy-font text-red-400">{member.miracles}</div>
                    <div className="text-sm text-white/60">miracles</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
