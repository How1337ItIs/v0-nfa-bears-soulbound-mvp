"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ShowsTab() {
  const [claimedPoats, setClaimedPoats] = useState<number[]>([])

  const upcomingShows = [
    {
      id: 1,
      venue: "The Fillmore",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      status: "RSVP Open",
      poatArt: "🌈",
    },
    {
      id: 2,
      venue: "Red Rocks",
      date: "April 20, 2024",
      location: "Morrison, CO",
      status: "Sold Out",
      poatArt: "🏔️",
    },
    {
      id: 3,
      venue: "Madison Square Garden",
      date: "May 8, 2024",
      location: "New York, NY",
      status: "RSVP Open",
      poatArt: "🗽",
    },
  ]

  const pastShows = [
    {
      id: 1,
      venue: "The Greek Theatre",
      date: "February 14, 2024",
      location: "Berkeley, CA",
      recording: "Available",
      poatArt: "💝",
      poatClaimed: true,
    },
    {
      id: 2,
      venue: "Warfield Theatre",
      date: "January 20, 2024",
      location: "San Francisco, CA",
      recording: "Available",
      poatArt: "⚡",
      poatClaimed: false,
    },
  ]

  // Mock POAT collection data
  const poatCollection = {
    collected: 7,
    total: 12,
    unlockedRoles: ["#general", "#shows"],
    nextUnlock: { role: "#lounge", required: 10 },
    roadWarrior: false,
  }

  const claimPoat = (showId: number) => {
    setClaimedPoats((prev) => [...prev, showId])
  }

  return (
    <div className="space-y-8">
      {/* POAT Collection Status */}
      <Card className="glassmorphic rounded-3xl p-6 breathe-animation">
        <div className="text-center mb-6">
          <h3 className="groovy-font text-3xl mb-2 text-red-400">POAT Collection</h3>
          <p className="text-white/80">Proof of Attendance Tokens</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl groovy-font aurora-gradient bg-clip-text text-transparent">
              {poatCollection.collected}/{poatCollection.total}
            </div>
            <p className="text-white/60 text-sm">Collected</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎫</div>
            <p className="text-white/60 text-sm">Discord Unlocked:</p>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {poatCollection.unlockedRoles.map((role) => (
                <Badge key={role} className="bg-green-500/20 text-green-400 text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-white/60 text-sm">Next Unlock:</p>
            <p className="text-white text-sm">{poatCollection.nextUnlock.role}</p>
            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${(poatCollection.collected / poatCollection.nextUnlock.required) * 100}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">
              {poatCollection.nextUnlock.required - poatCollection.collected} more needed
            </p>
          </div>
        </div>

        {poatCollection.collected >= 10 && (
          <div className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl">
            <div className="text-3xl mb-2 dancing-bear">🏆</div>
            <p className="groovy-font text-xl text-yellow-400">Road Warrior Status!</p>
            <p className="text-white/80 text-sm">You've unlocked exclusive perks</p>
          </div>
        )}
      </Card>

      {/* Upcoming Shows */}
      <div>
        <h2 className="groovy-font text-4xl mb-6 text-center glow-text text-white">Upcoming Shows</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingShows.map((show) => (
            <Card
              key={show.id}
              className="glassmorphic rounded-3xl overflow-hidden float-animation hover:scale-105 transition-transform duration-300"
            >
              <div className="h-32 aurora-gradient relative">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-4xl dancing-bear">🎸</div>
                </div>
                <div className="absolute top-2 right-2 text-2xl">{show.poatArt}</div>
              </div>
              <CardContent className="p-6">
                <h3 className="groovy-font text-2xl mb-2 text-red-400">{show.venue}</h3>
                <p className="text-white/80 mb-1">{show.date}</p>
                <p className="text-white/60 mb-4">{show.location}</p>
                <div className="space-y-2">
                  <Button
                    className={`w-full magnetic-button ${
                      show.status === "Sold Out" ? "bg-gray-600 cursor-not-allowed" : "aurora-gradient"
                    }`}
                    disabled={show.status === "Sold Out"}
                  >
                    {show.status === "Sold Out" ? "Sold Out 😢" : "RSVP ✨"}
                  </Button>
                  <p className="text-xs text-white/60 text-center">Attend to earn {show.poatArt} POAT</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Shows */}
      <div>
        <h2 className="groovy-font text-4xl mb-6 text-center glow-text text-white">Past Shows</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastShows.map((show) => (
            <Card key={show.id} className="glassmorphic rounded-3xl overflow-hidden float-animation">
              <div className="h-32 bg-gradient-to-br from-blue-500/50 to-red-500/50 relative">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-4xl">🎵</div>
                </div>
                <div className="absolute top-2 right-2 text-2xl">{show.poatArt}</div>
              </div>
              <CardContent className="p-6">
                <h3 className="groovy-font text-2xl mb-2 text-blue-400">{show.venue}</h3>
                <p className="text-white/80 mb-1">{show.date}</p>
                <p className="text-white/60 mb-4">{show.location}</p>
                <div className="space-y-2">
                  <Button className="w-full magnetic-button bg-gradient-to-r from-blue-600 to-red-600">
                    Listen to IPFS Recording 🎧
                  </Button>
                  {show.poatClaimed || claimedPoats.includes(show.id) ? (
                    <div className="text-center py-2">
                      <Badge className="bg-green-500/20 text-green-400">POAT Claimed ✅</Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={() => claimPoat(show.id)}
                      className="w-full magnetic-button bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      Claim Your {show.poatArt} POAT
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
