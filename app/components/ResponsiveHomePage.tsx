"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ResponsiveHomePage() {
  const { ready, authenticated, login } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐻</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Dancing Bear */}
        <div className="text-8xl mb-8 animate-bounce">🐻</div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          NFA Bears
        </h1>
        <p className="text-xl text-white/80 mb-2">Not Fade Away</p>
        <p className="text-white/60 mb-8 max-w-lg mx-auto">
          A Grateful Dead-inspired Web3 community preserving authentic connections through soulbound tokens
        </p>

        {/* Login Button */}
        <button
          onClick={login}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Connect & Enter
        </button>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-2xl animate-pulse opacity-60">🌟</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce opacity-40">⚡</div>
        <div className="absolute bottom-40 left-20 text-2xl animate-spin opacity-50">🎪</div>
        <div className="absolute bottom-20 right-10 text-2xl animate-pulse opacity-60">🎵</div>
      </div>
    </div>
  )
}
