"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-ui"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { ready, authenticated, login } = usePrivy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !ready) {
    return (
      <div className="min-h-screen tie-dye-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-8 dancing-bear">🐻</div>
          <div className="animate-pulse text-white">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tie-dye-bg flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="text-8xl mb-8 dancing-bear">🐻</div>
        <h1 className="groovy-font text-6xl md:text-8xl mb-6 glow-text">NFA Bears</h1>
        <p className="script-font text-2xl md:text-3xl text-white/80 mb-4">Fuck crypto, real family shit</p>
        <p className="script-font text-xl md:text-2xl text-white/60 mb-8">NFA Bears what!?!? ✨</p>

        <div className="space-y-6">
          {authenticated ? (
            <Link href="/dashboard">
              <Button className="magnetic-button aurora-gradient text-xl px-8 py-4 rounded-full">
                Enter the Dashboard 🚌
              </Button>
            </Link>
          ) : (
            <Button onClick={login} className="magnetic-button aurora-gradient text-xl px-8 py-4 rounded-full">
              Join the Family 🌈
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
