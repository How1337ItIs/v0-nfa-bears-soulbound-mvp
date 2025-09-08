"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMockState } from "@/context/mock-state-provider"

export default function HomePage() {
  const { isAuthenticated, login } = useMockState()

  return (
    <div className="min-h-screen tie-dye-bg flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="text-8xl mb-8 dancing-bear">🐻</div>
        <h1 className="groovy-font text-6xl md:text-8xl mb-6 glow-text">NFA Bears</h1>
        <p className="script-font text-2xl md:text-3xl text-white/80 mb-8">Welcome to the cosmic community ✨</p>

        <div className="space-y-6">
          {isAuthenticated ? (
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
