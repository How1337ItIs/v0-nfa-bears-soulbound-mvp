"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGenesisBears } from "@/lib/useGenesisBears"
import { useMintSBT } from "@/lib/useMintSBT"

interface DashboardHeaderProps {
  daysOnBus: number
}

export function DashboardHeader({ daysOnBus }: DashboardHeaderProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { user } = usePrivy()
  const { address } = useAccount()
  const { isHolder, balance, tokenIds } = useGenesisBears()
  const { hasMinted, checkHasMinted } = useMintSBT()

  // Initialize blockchain status checking
  useEffect(() => {
    if (address) {
      checkHasMinted(address);
    }
  }, [address, checkHasMinted])

  // Determine membership type from real blockchain data
  const membershipType = isHolder ? "genesis" : hasMinted ? "miracle" : "unverified"
  const genesisBears = tokenIds.map(id => parseInt(id))
  const votingPower = balance
  
  const mockUserData = {
    membershipType,
    genesisBears,
    votingPower,
    poatCount: 7, // TODO: Implement POAT tracking
    streetTeamRank: "Silver", // TODO: Implement referral tracking  
    referralCount: 28, // TODO: Implement referral tracking
    discountsSaved: 143, // TODO: Implement discount tracking
    verificationDate: "Jan 2024", // TODO: Get from SBT mint date
  }

  const getMembershipDisplay = () => {
    switch (mockUserData.membershipType) {
      case "genesis":
        return {
          title: "Genesis Bear Holder",
          subtitle: `Bears #${mockUserData.genesisBears.join(", #")}`,
          benefits: "20% Vendor Discounts • DAO Voting Power • Can Miracle Others",
          badge: "OG Deadhead",
          theme: "from-yellow-500/20 to-purple-500/20 border-yellow-500/30",
        }
      case "miracle":
        return {
          title: "Miracle SBT Member",
          subtitle: `Verified ${mockUserData.verificationDate}`,
          benefits: "10% Vendor Discounts • Community Access",
          badge: "Verified Member",
          theme: "from-blue-500/20 to-green-500/20 border-blue-500/30",
        }
      default:
        return {
          title: "Unverified Member",
          subtitle: "Choose Your Path",
          benefits: "$10 Donation OR Complete 2 Community Tasks",
          badge: "Pending",
          theme: "from-red-500/20 to-orange-500/20 border-red-500/30",
        }
    }
  }

  const membershipInfo = getMembershipDisplay()

  return (
    <div className="mb-8">
      {/* Core Branding */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <h1 className="groovy-font text-4xl md:text-6xl mb-2 glow-text text-white">Fuck Crypto, Real Family Shit</h1>
          <div className="flex flex-wrap justify-center gap-2 text-sm md:text-base text-white/80">
            <span className="script-font">Not Fade Away</span>
            <span>•</span>
            <span className="script-font">Not Financial Advice</span>
            <span>•</span>
            <span className="script-font">Non-Fungible Acid Bears</span>
          </div>
        </div>
        <p className="text-lg text-white/60 mb-2">710 Genesis Bears • Unlimited Miracle SBTs • Built on Berachain</p>
        <p className="text-xl text-white/80">
          Hey there, <span className="script-font text-red-400">{user?.email?.address || "Beautiful Soul"}</span> ✨
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Days on Bus Counter */}
        <Card className="glassmorphic rounded-3xl p-8 text-center breathe-animation">
          <div className="text-6xl md:text-8xl groovy-font aurora-gradient bg-clip-text text-transparent mb-4">
            {daysOnBus}
          </div>
          <p className="text-2xl text-white/80 mb-4">Days on the Bus</p>

          {/* Membership Status */}
          <div className={`bg-gradient-to-r ${membershipInfo.theme} rounded-2xl p-4 mb-4`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="aurora-gradient border-0 text-white">{membershipInfo.badge}</Badge>
              {mockUserData.membershipType === "genesis" && <div className="text-xl dancing-bear">👑</div>}
            </div>
            <h3 className="groovy-font text-xl text-white mb-1">{membershipInfo.title}</h3>
            <p className="text-white/80 text-sm mb-2">{membershipInfo.subtitle}</p>
            <p className="text-white/60 text-xs">{membershipInfo.benefits}</p>
          </div>

          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-400 rounded-full dancing-bear"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </Card>

        {/* Enhanced Membership Card */}
        <div className="perspective-1000">
          <Card
            className={`glassmorphic rounded-3xl p-8 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`${isFlipped ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
              <div className="text-center">
                <div className="text-6xl mb-4 spiral-animation">🎭</div>
                <h3 className="groovy-font text-2xl mb-2 text-red-400">
                  {mockUserData.membershipType === "genesis" ? "Genesis Bear Token" : "Miracle SBT"}
                </h3>
                <p className="text-white/80 mb-2">
                  {mockUserData.membershipType === "genesis"
                    ? `${mockUserData.genesisBears.length} Bears Owned`
                    : "Community Member"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mb-4">
                  <div>POATs: {mockUserData.poatCount}</div>
                  <div>Rank: {mockUserData.streetTeamRank}</div>
                  <div>Referrals: {mockUserData.referralCount}</div>
                  <div>Saved: ${mockUserData.discountsSaved}</div>
                </div>

                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full aurora-gradient w-3/4 rounded-full"></div>
                </div>
                <p className="text-sm text-white/60 mt-2">Click to flip</p>
              </div>
            </div>

            <div
              className={`absolute inset-0 p-8 ${isFlipped ? "opacity-100" : "opacity-0"} transition-opacity duration-300 rotate-y-180`}
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center spiral-animation">
                  <div className="text-black text-xs font-bold">
                    {mockUserData.membershipType === "genesis" ? "GENESIS QR" : "MEMBER QR"}
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-2">
                  {mockUserData.membershipType === "genesis" ? "20% Discount" : "10% Discount"}
                </p>
                <p className="text-xs text-white/60">Member since: {mockUserData.verificationDate}</p>
                <p className="text-xs text-white/40 mt-2 font-mono">{user?.wallet?.address || "0x1234...5678"}</p>

                {/* Blockchain Status */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60">Berachain Verified</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
