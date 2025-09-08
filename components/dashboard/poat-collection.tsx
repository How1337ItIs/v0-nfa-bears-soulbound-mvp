"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function POATCollection() {
  const [isExpanded, setIsExpanded] = useState(false)

  const poats = [
    { id: 1, event: "Summer Solstice 2024", date: "Jun 21", collected: true },
    { id: 2, event: "Cosmic Convergence", date: "May 15", collected: true },
    { id: 3, event: "Miracle Monday", date: "Apr 8", collected: false },
    { id: 4, event: "Dancing Bear Ball", date: "Mar 20", collected: true },
  ]

  const collectedCount = poats.filter((p) => p.collected).length

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`transition-all duration-500 ${isExpanded ? "w-80" : "w-16"}`}>
        {isExpanded && (
          <Card className="glassmorphic rounded-3xl mb-4 liquid-morph">
            <CardContent className="p-6">
              <h3 className="groovy-font text-2xl mb-4 text-center text-pink-400">POAT Collection</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {poats.map((poat) => (
                  <div
                    key={poat.id}
                    className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      poat.collected
                        ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:scale-105"
                        : "bg-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white text-sm">{poat.event}</div>
                        <div className="text-white/60 text-xs">{poat.date}</div>
                      </div>
                      <div className="text-xl">{poat.collected ? "🎫" : "⭕"}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg groovy-font aurora-gradient bg-clip-text text-transparent">
                  {collectedCount}/{poats.length} Collected
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 rounded-full aurora-gradient magnetic-button shadow-2xl"
        >
          <span className="text-2xl dancing-bear">🎫</span>
        </Button>
      </div>
    </div>
  )
}
