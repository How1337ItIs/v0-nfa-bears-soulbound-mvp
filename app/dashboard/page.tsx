"use client"

export const dynamic = 'force-dynamic';

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { authenticated, ready, user } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 dancing-bear">🐻</div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to the Family!</h1>
            <p className="text-white/80">Your NFA Bears Dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Profile
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80">
                  Email: <span className="text-white">{user?.email?.address || "Not provided"}</span>
                </p>
                <p className="text-white/80">
                  Wallet:{" "}
                  <span className="text-white font-mono text-xs">
                    {user?.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : "Not connected"}
                  </span>
                </p>
              </div>
            </div>

            {/* SBT Status */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="mr-2">🎫</span>
                Miracle SBT
              </h3>
              <div className="text-center">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-white/80 text-sm">Not minted yet</p>
                <p className="text-white/60 text-xs mt-2">Scan QR at events to claim</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/scan")}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  Scan QR Code
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Community Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* My Story */}
            <button
              onClick={() => router.push("/my-story")}
              className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📖</span>
                <h3 className="text-white font-bold text-lg">Share Your Story</h3>
              </div>
              <p className="text-white/80 text-sm">
                Tell the family about your Dead journey and connection to the scene
              </p>
            </button>

            {/* Proposals */}
            <button
              onClick={() => router.push("/proposals")}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🗳️</span>
                <h3 className="text-white font-bold text-lg">Community Proposals</h3>
              </div>
              <p className="text-white/80 text-sm">
                Vote on shows, events, and collective decisions
              </p>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="mr-2">📈</span>
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-4 opacity-50">🌟</div>
              <p className="text-white/60">No activity yet</p>
              <p className="text-white/40 text-sm mt-2">Your journey begins when you mint your first Miracle SBT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
