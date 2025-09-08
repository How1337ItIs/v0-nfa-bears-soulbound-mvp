"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface DashboardHeaderProps {
  user: any
  daysOnBus: number
}

export function DashboardHeader({ user, daysOnBus }: DashboardHeaderProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="groovy-font text-6xl md:text-8xl mb-4 glow-text">Welcome to the Bus!</h1>
        <p className="text-2xl text-white/80">
          Hey there, <span className="script-font text-pink-400">{user?.email || "Beautiful Soul"}</span> ✨
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Card className="glassmorphic rounded-3xl p-8 text-center breathe-animation">
          <div className="text-8xl md:text-9xl groovy-font aurora-gradient bg-clip-text text-transparent mb-4">
            {daysOnBus}
          </div>
          <p className="text-2xl text-white/80">Days on the Bus</p>
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-pink-400 rounded-full dancing-bear"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </Card>

        <div className="perspective-1000">
          <Card
            className={`glassmorphic rounded-3xl p-8 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`${isFlipped ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
              <div className="text-center">
                <div className="text-6xl mb-4 spiral-animation">🎭</div>
                <h3 className="groovy-font text-3xl mb-2 text-pink-400">Miracle Token</h3>
                <p className="text-white/80">Genesis Bear #247</p>
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
                <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-black text-xs">QR CODE</div>
                </div>
                <p className="text-sm text-white/80 mb-2">25% Discount</p>
                <p className="text-xs text-white/60">Member since: Jan 2024</p>
                <p className="text-xs text-white/40 mt-2 font-mono">{user?.wallet?.address || "0x1234...5678"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
