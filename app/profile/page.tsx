"use client"

export const dynamic = 'force-dynamic';

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Copy } from "lucide-react"

export default function ProfilePage() {
  const { authenticated, ready, user, logout } = usePrivy()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleCopyAddress = async () => {
    if (user?.wallet?.address) {
      try {
        await navigator.clipboard.writeText(user.wallet.address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }

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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 dancing-bear">🐻</div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-white/80">Manage your NFA Bears account</p>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Email</label>
                  <p className="text-white">{user?.email?.address || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Wallet Address</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-mono text-sm break-all flex-1">
                      {user?.wallet?.address || "Not connected"}
                    </p>
                    {user?.wallet?.address && (
                      <button
                        onClick={handleCopyAddress}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                        title="Copy address"
                      >
                        {copied ? <span className="text-green-400 text-sm">✓</span> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Member Since</label>
                  <p className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Status */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Member Status</h3>
              <div className="text-center">
                <div className="text-4xl mb-3">🎪</div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Connected Member</span>
                </div>
                <p className="text-white/70 text-sm">
                  Welcome to the NFA Bears family! You're part of our Grateful Dead-inspired Web3 community.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/scan")}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Scan QR Code
                </button>
                <button
                  onClick={logout}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
