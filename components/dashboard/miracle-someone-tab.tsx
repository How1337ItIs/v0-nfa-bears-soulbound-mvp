"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MiracleSomeoneTab() {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [miraclesGiven, setMiraclesGiven] = useState(12)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const giveMiracle = () => {
    setMiraclesGiven((prev) => prev + 1)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text">Miracle Someone</h2>
        <p className="script-font text-xl text-white/80">Spread the love, share the magic ✨</p>
        <p className="text-white/60 mt-2">Genesis Bears Only</p>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl dancing-bear">🐻✨🎉</div>
        </div>
      )}

      <Card className="glassmorphic rounded-3xl text-center">
        <CardContent className="p-12">
          <div className="w-64 h-64 mx-auto mb-8 bg-white rounded-2xl flex items-center justify-center spiral-animation">
            <div className="text-black text-lg font-bold">QR CODE</div>
          </div>

          <div className="mb-8">
            <div className="text-6xl groovy-font aurora-gradient bg-clip-text text-transparent mb-2">
              {formatTime(timeLeft)}
            </div>
            <p className="text-white/80">Time until next miracle</p>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${((15 * 60 - timeLeft) / (15 * 60)) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="text-4xl groovy-font text-green-400 mb-2">Miracles Given: {miraclesGiven}</div>
            <div className="flex justify-center space-x-2">
              {[...Array(Math.min(miraclesGiven, 10))].map((_, i) => (
                <div key={i} className="text-2xl dancing-bear" style={{ animationDelay: `${i * 0.1}s` }}>
                  ✨
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <p className="script-font text-lg text-white/80">Show this QR code to someone special</p>
            <p className="text-white/60">{"They'll get a free miracle pass to join our family"}</p>
          </div>

          <Button
            onClick={giveMiracle}
            disabled={timeLeft > 0}
            className={`magnetic-button text-xl px-8 py-4 rounded-full ${
              timeLeft > 0 ? "bg-gray-600 cursor-not-allowed" : "aurora-gradient hover:scale-110"
            }`}
          >
            {timeLeft > 0 ? "Recharging Magic..." : "Give Miracle ✨"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
