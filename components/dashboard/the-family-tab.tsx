"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function TheFamilyTab() {
  const [votes, setVotes] = useState<{ [key: number]: string }>({})
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })

  // Mock user data
  const userMembership = {
    type: "genesis", // "genesis" | "miracle" | "unverified"
    votingPower: 3,
    canCreateProposals: true,
  }

  const proposals = [
    {
      id: 1,
      title: "Summer Tour 2024 Locations",
      description: "Vote on which cities we should visit this summer",
      progress: 67,
      type: "Binding",
      timeLeft: "5 days left",
      votesFor: 234,
      votesAgainst: 89,
      timelockHours: 48,
      creator: "Jerry Garcia",
      createdAt: "2 days ago",
    },
    {
      id: 2,
      title: "New Merchandise Design",
      description: "Choose the next t-shirt design for the community",
      progress: 43,
      type: "Sentiment",
      timeLeft: "12 days left",
      votesFor: 156,
      votesAgainst: 67,
      timelockHours: 0,
      creator: "Bob Weir",
      createdAt: "1 week ago",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Jerry Garcia", miracles: 247, avatar: "🎸", votingPower: 5 },
    { rank: 2, name: "Bob Weir", miracles: 198, avatar: "🎵", votingPower: 4 },
    { rank: 3, name: "Phil Lesh", miracles: 156, avatar: "🎶", votingPower: 3 },
    { rank: 4, name: "You", miracles: 89, avatar: "🐻", isUser: true, votingPower: userMembership.votingPower },
    { rank: 5, name: "Mickey Hart", miracles: 78, avatar: "🥁", votingPower: 2 },
  ]

  const treasuryData = {
    totalFunds: 45678,
    allocations: [
      { category: "Vendor Reimbursements", amount: 15234, percentage: 33 },
      { category: "Event Funding", amount: 12456, percentage: 27 },
      { category: "Development", amount: 9876, percentage: 22 },
      { category: "Community Rewards", amount: 8112, percentage: 18 },
    ],
  }

  const stats = [
    { label: "Total Members", value: "2,847", icon: "👥" },
    { label: "Active Proposals", value: "12", icon: "🗳️" },
    { label: "Treasury (HONEY)", value: `${treasuryData.totalFunds.toLocaleString()}`, icon: "🍯" },
  ]

  const castVote = (proposalId: number, vote: string) => {
    setVotes((prev) => ({ ...prev, [proposalId]: vote }))
  }

  const createProposal = () => {
    if (newProposal.title && newProposal.description) {
      // In real app, this would submit to blockchain
      setShowCreateProposal(false)
      setNewProposal({ title: "", description: "" })
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text text-white">The Family</h2>
        <p className="script-font text-xl text-white/80">Together we make the magic happen ✨</p>

        {/* Voting Power Display */}
        <div className="mt-4">
          {userMembership.type === "genesis" ? (
            <Badge className="bg-yellow-500/20 text-yellow-400 text-lg px-4 py-2">
              Voting Power: {userMembership.votingPower} votes
            </Badge>
          ) : userMembership.type === "miracle" ? (
            <Badge className="bg-blue-500/20 text-blue-400 text-lg px-4 py-2">Sentiment Polls Only</Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-400 text-lg px-4 py-2">No Voting Rights</Badge>
          )}
        </div>
      </div>

      {/* Stats */}
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

      {/* Treasury Transparency */}
      <Card className="glassmorphic rounded-3xl p-6 mb-8">
        <h3 className="groovy-font text-3xl mb-4 text-center text-blue-400">Treasury Transparency</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl text-white mb-4">Fund Allocation</h4>
            <div className="space-y-3">
              {treasuryData.allocations.map((allocation, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">{allocation.category}</span>
                    <span className="text-white font-semibold">{allocation.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full aurora-gradient rounded-full"
                      style={{ width: `${allocation.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">{allocation.amount.toLocaleString()} HONEY</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl groovy-font aurora-gradient bg-clip-text text-transparent mb-4">
              {treasuryData.totalFunds.toLocaleString()}
            </div>
            <p className="text-white/80 text-xl mb-4">HONEY in Treasury</p>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-2">Live on Berachain</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Real-time updates</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Create Proposal Button */}
      {userMembership.canCreateProposals && (
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowCreateProposal(!showCreateProposal)}
            className="magnetic-button aurora-gradient text-lg px-8 py-3"
          >
            Create Proposal ✨
          </Button>
        </div>
      )}

      {/* Create Proposal Form */}
      {showCreateProposal && (
        <Card className="glassmorphic rounded-3xl p-6 mb-8">
          <h3 className="groovy-font text-2xl mb-4 text-red-400">Create New Proposal</h3>
          <div className="space-y-4">
            <Input
              placeholder="Proposal title..."
              value={newProposal.title}
              onChange={(e) => setNewProposal((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Textarea
              placeholder="Describe your proposal..."
              value={newProposal.description}
              onChange={(e) => setNewProposal((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
            />
            <div className="flex gap-4">
              <Button onClick={createProposal} className="magnetic-button aurora-gradient">
                Submit Proposal
              </Button>
              <Button
                onClick={() => setShowCreateProposal(false)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Proposals */}
      <div className="mb-8">
        <h3 className="groovy-font text-3xl mb-6 text-center text-red-400">Active Proposals</h3>
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="glassmorphic rounded-3xl float-animation">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{proposal.title}</h4>
                    <p className="text-white/80 mb-2">{proposal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>By {proposal.creator}</span>
                      <span>•</span>
                      <span>{proposal.createdAt}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`mb-2 ${
                        proposal.type === "Binding" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {proposal.type} Vote
                    </Badge>
                    <p className="text-white/60 text-sm">{proposal.timeLeft}</p>
                    {proposal.timelockHours > 0 && (
                      <p className="text-yellow-400 text-xs mt-1">{proposal.timelockHours}h timelock</p>
                    )}
                  </div>
                </div>

                {/* Vote Counts */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-green-500/10 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold">{proposal.votesFor}</div>
                    <div className="text-white/60">For</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3 text-center">
                    <div className="text-red-400 font-bold">{proposal.votesAgainst}</div>
                    <div className="text-white/60">Against</div>
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
                    <p className="text-white/60 text-sm">Voting power used: {userMembership.votingPower} votes</p>
                  </div>
                ) : userMembership.type === "genesis" ? (
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => castVote(proposal.id, "Yes")}
                      className="flex-1 magnetic-button bg-green-600 hover:bg-green-700"
                    >
                      Yes 👍 ({userMembership.votingPower} votes)
                    </Button>
                    <Button
                      onClick={() => castVote(proposal.id, "No")}
                      className="flex-1 magnetic-button bg-red-600 hover:bg-red-700"
                    >
                      No 👎 ({userMembership.votingPower} votes)
                    </Button>
                  </div>
                ) : userMembership.type === "miracle" && proposal.type === "Sentiment" ? (
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => castVote(proposal.id, "Yes")}
                      className="flex-1 magnetic-button bg-blue-600 hover:bg-blue-700"
                    >
                      Yes 👍 (Sentiment)
                    </Button>
                    <Button
                      onClick={() => castVote(proposal.id, "No")}
                      className="flex-1 magnetic-button bg-blue-600 hover:bg-blue-700"
                    >
                      No 👎 (Sentiment)
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-white/60">
                      {userMembership.type === "miracle"
                        ? "Binding votes require Genesis Bear ownership"
                        : "Voting requires membership verification"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Street Team Leaderboard */}
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
                    <div className="text-xs text-blue-400 mt-1">{member.votingPower} voting power</div>
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
