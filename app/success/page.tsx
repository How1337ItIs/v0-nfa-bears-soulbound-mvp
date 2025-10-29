'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const { user } = usePrivy()
  const [mounted, setMounted] = useState(false)

  // Get ambassador info from URL params (passed from invite flow)
  const ambassadorName = searchParams?.get('ambassador') || 'a family member'
  const venueId = searchParams?.get('venue') || 'the lot'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Celebratory Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-6 animate-bounce">⚡</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            You're on the bus!
          </h1>
          <p className="text-2xl text-purple-200 mb-2">
            Welcome to the NFA Bears family 🐻
          </p>
          <p className="text-white/60 text-lg">
            You just got miracled into the community
          </p>
        </div>

        {/* Who Welcomed You */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🙏</span>
            <div>
              <h3 className="text-white font-bold text-lg">You Were Miracled By:</h3>
              <p className="text-purple-200 text-xl">{ambassadorName}</p>
            </div>
          </div>
          <p className="text-white/80 text-sm italic">
            "In Deadhead tradition, getting 'miracled' means receiving a free ticket from a stranger.
            You just experienced that in the digital age. Pay it forward when you can."
          </p>
        </div>

        {/* What You Received */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 mb-6">
          <h2 className="text-white font-bold text-2xl mb-4 flex items-center gap-3">
            <span>🎫</span>
            Your Miracle Membership
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-white/90">
            <div>
              <p className="font-semibold mb-1">✓ Soulbound Token (SBT)</p>
              <p className="text-sm text-white/70">Permanent, non-transferable proof of membership</p>
            </div>
            <div>
              <p className="font-semibold mb-1">✓ Vendor Discounts (10%)</p>
              <p className="text-sm text-white/70">At participating lot vendors and merchants</p>
            </div>
            <div>
              <p className="font-semibold mb-1">✓ Community Access</p>
              <p className="text-sm text-white/70">Discord, events, vibes checks, proposals</p>
            </div>
            <div>
              <p className="font-semibold mb-1">✓ POAT Collection</p>
              <p className="text-sm text-white/70">Collect proof-of-attendance from shows</p>
            </div>
          </div>
        </div>

        {/* Immediate Next Steps */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-white font-bold text-2xl mb-4">Your First Steps on the Bus</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="text-3xl">1️⃣</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Join the Discord Community</h3>
                <p className="text-white/80 mb-3">
                  Real conversations happen here. Introduce yourself, share your Dead story, connect with other Heads.
                </p>
                <a
                  href="https://discord.gg/nfabears"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Join Discord →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="text-3xl">2️⃣</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Use Your First Discount</h3>
                <p className="text-white/80 mb-3">
                  Your member QR code is ready. Show it to any NFA Bears vendor for 10% off.
                </p>
                <Link
                  href="/member"
                  className="inline-block bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
                >
                  Get My QR Code →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="text-3xl">3️⃣</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Explore Your Dashboard</h3>
                <p className="text-white/80 mb-3">
                  Check your membership, collect POATs from events, see what's happening in the community.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
                >
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* The Gift Economy */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30 mb-6">
          <h2 className="text-white font-bold text-xl mb-3">🎁 The Gift Economy</h2>
          <p className="text-white/90 mb-4">
            You received this membership for free, following the Deadhead tradition of miracles.
            When you're ready, you can pay it forward:
          </p>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <span>Bring a friend to the next show</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <span>Share your story and welcome newcomers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <span>Support vendors, contribute to the community</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <span>Consider becoming an ambassador (welcome others like you were welcomed)</span>
            </li>
          </ul>
        </div>

        {/* What This Is Really About */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
          <p className="text-white/70 text-sm mb-2">
            "Fuck crypto, real family shit"
          </p>
          <p className="text-white/80 text-base">
            This isn't about buying and selling. It's about preserving the parking lot economy,
            the mutual aid, the authentic connections that made the Dead scene special.
          </p>
          <p className="text-purple-300 font-semibold mt-3 text-lg">
            Not Fade Away. 🚌💀🌹
          </p>
        </div>

        {/* Legal/Info Footer */}
        <div className="mt-8 text-center text-white/50 text-xs">
          <p>Your Miracle SBT is soulbound (non-transferable) and lives on Berachain Bepolia testnet.</p>
          <p>Wallet: {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'Loading...'}</p>
        </div>
      </div>
    </div>
  )
}
