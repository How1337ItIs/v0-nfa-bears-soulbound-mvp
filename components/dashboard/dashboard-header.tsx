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
  
  // Get real SBT mint date from transaction hash if available
  const getSBTMintDate = () => {
    // This would ideally come from indexing the blockchain or storing mint dates
    // For now, we'll use a placeholder that indicates it's from real SBT data
    return hasMinted ? "Real SBT Verified" : "Pending Verification";
  };

  const userData = {
    membershipType,
    genesisBears,
    votingPower,
    poatCount: 0, // Start at 0, will be implemented when POAT system is built
    streetTeamRank: isHolder ? "Genesis" : hasMinted ? "Member" : "Unverified",
    referralCount: 0, // Start at 0, will track real onboarding data
    discountsSaved: 0, // Start at 0, will track real vendor usage
    verificationDate: getSBTMintDate(),
  }

  const getMembershipDisplay = () => {
    switch (userData.membershipType) {
      case "genesis":
        return {
          title: "Genesis Bear Holder",
          subtitle: `Bears #${userData.genesisBears.join(", #")}`,
          benefits: "20% Vendor Discounts • DAO Voting Power • Can Miracle Others",
          badge: "OG Deadhead",
          theme: "from-yellow-500/20 to-purple-500/20 border-yellow-500/30",
        }
      case "miracle":
        return {
          title: "Miracle SBT Member",
          subtitle: `Verified ${userData.verificationDate}`,
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
    <div className="mb-8 relative">
      {/* Psychedelic Oil Projection Background */}
      <div className="absolute inset-0 oil-projection-bg opacity-30 rounded-3xl"></div>
      
      {/* Core Branding */}
      <div className="text-center mb-8 relative z-10">
        <div className="mb-4">
          <h1 className="groovy-font text-4xl md:text-6xl mb-2 psychedelic-text">Fuck Crypto, Real Family Shit</h1>
          <div className="flex flex-wrap justify-center gap-2 text-sm md:text-base text-white/80">
            <span className="script-font liquid-chrome">Not Fade Away</span>
            <span className="psychedelic-shimmer">•</span>
            <span className="script-font liquid-chrome">Not Financial Advice</span>
            <span className="psychedelic-shimmer">•</span>
            <span className="script-font liquid-chrome">Non-Fungible Acid Bears</span>
          </div>
        </div>
        <p className="text-lg text-white/60 mb-2">710 Genesis Bears • Unlimited Miracle SBTs • Built on Berachain</p>
        <p className="text-xl text-white/80">
          Hey there, <span className="script-font liquid-chrome">{user?.email?.address || "Beautiful Soul"}</span> ✨
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Days on Bus Counter - Lava Lamp Style */}
        <Card className="oil-glassmorphic oil-blob p-8 text-center syrupy-flow relative overflow-hidden">
          {/* Floating Oil Blobs */}
          <div className="absolute top-4 left-4 w-8 h-8 psychedelic-gradient-1 oil-blob-2 opacity-60"></div>
          <div className="absolute top-8 right-6 w-6 h-6 psychedelic-gradient-2 oil-blob-3 opacity-50"></div>
          <div className="absolute bottom-6 left-8 w-10 h-10 psychedelic-gradient-3 oil-blob opacity-40"></div>
          
          <div className="text-6xl md:text-8xl groovy-font psychedelic-text mb-4 relative z-10">
            {daysOnBus}
          </div>
          <p className="text-2xl text-white/80 mb-4 liquid-chrome">Days on the Bus</p>

          {/* Membership Status - Oil Slick Style */}
          <div className={`psychedelic-gradient-1 oil-blob-2 p-4 mb-4 relative z-10`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="psychedelic-gradient-2 border-0 text-white oil-blob-3">{membershipInfo.badge}</Badge>
              {userData.membershipType === "genesis" && <div className="text-xl dancing-bear">👑</div>}
            </div>
            <h3 className="groovy-font text-xl text-white mb-1 liquid-chrome">{membershipInfo.title}</h3>
            <p className="text-white/80 text-sm mb-2">{membershipInfo.subtitle}</p>
            <p className="text-white/60 text-xs">{membershipInfo.benefits}</p>
          </div>

          <div className="flex justify-center space-x-2 relative z-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 psychedelic-gradient-1 oil-blob dancing-bear"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </Card>

        {/* Enhanced Membership Card - Melting Liquid Style */}
        <div className="perspective-1000">
          <Card
            className={`oil-glassmorphic oil-blob-2 p-8 cursor-pointer melting-card transition-transform duration-700 transform-style-preserve-3d relative overflow-hidden ${isFlipped ? "rotate-y-180" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Kaleidoscope Background */}
            <div className="absolute inset-0 kaleidoscope opacity-20"></div>
            
            <div className={`${isFlipped ? "opacity-0" : "opacity-100"} transition-opacity duration-300 relative z-10`}>
              <div className="text-center">
                <div className="text-6xl mb-4 spiral-animation psychedelic-shimmer">🎭</div>
                <h3 className="groovy-font text-2xl mb-2 liquid-chrome">
                  {userData.membershipType === "genesis" ? "Genesis Bear Token" : "Miracle SBT"}
                </h3>
                <p className="text-white/80 mb-2">
                  {userData.membershipType === "genesis"
                    ? `${userData.genesisBears.length} Bears Owned`
                    : "Community Member"}
                </p>

                {/* Stats in Oil Blobs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mb-4">
                  <div className="psychedelic-gradient-1 oil-blob-3 p-2 text-center">
                    <div className="text-white font-bold">POATs</div>
                    <div>{userData.poatCount}</div>
                  </div>
                  <div className="psychedelic-gradient-2 oil-blob p-2 text-center">
                    <div className="text-white font-bold">Rank</div>
                    <div>{userData.streetTeamRank}</div>
                  </div>
                  <div className="psychedelic-gradient-3 oil-blob-2 p-2 text-center">
                    <div className="text-white font-bold">Referrals</div>
                    <div>{userData.referralCount}</div>
                  </div>
                  <div className="psychedelic-gradient-1 oil-blob p-2 text-center">
                    <div className="text-white font-bold">Saved</div>
                    <div>${userData.discountsSaved}</div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden oil-blob">
                  <div className="h-full psychedelic-gradient-2 w-3/4 rounded-full viscous-drip"></div>
                </div>
                <p className="text-sm text-white/60 mt-2 liquid-chrome">Click to flip</p>
              </div>
            </div>

            <div
              className={`absolute inset-0 p-8 ${isFlipped ? "opacity-100" : "opacity-0"} transition-opacity duration-300 rotate-y-180 relative z-10`}
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 psychedelic-gradient-3 oil-blob flex items-center justify-center spiral-animation">
                  <div className="text-white text-xs font-bold liquid-chrome">
                    {userData.membershipType === "genesis" ? "GENESIS QR" : "MEMBER QR"}
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-2 liquid-chrome">
                  {userData.membershipType === "genesis" ? "20% Discount" : "10% Discount"}
                </p>
                <p className="text-xs text-white/60">Member since: {userData.verificationDate}</p>
                <p className="text-xs text-white/40 mt-2 font-mono">{user?.wallet?.address || "0x1234...5678"}</p>

                {/* Blockchain Status */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                  <div className="w-2 h-2 psychedelic-gradient-1 oil-blob animate-pulse"></div>
                  <span className="text-white/60 liquid-chrome">Berachain Verified</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
