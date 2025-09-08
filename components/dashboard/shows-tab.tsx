"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ShowsTab() {
  const upcomingShows = [
    {
      id: 1,
      venue: "The Fillmore",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      status: "RSVP Open",
    },
    {
      id: 2,
      venue: "Red Rocks",
      date: "April 20, 2024",
      location: "Morrison, CO",
      status: "Sold Out",
    },
    {
      id: 3,
      venue: "Madison Square Garden",
      date: "May 8, 2024",
      location: "New York, NY",
      status: "RSVP Open",
    },
  ]

  const pastShows = [
    {
      id: 1,
      venue: "The Greek Theatre",
      date: "February 14, 2024",
      location: "Berkeley, CA",
      recording: "Available",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="groovy-font text-4xl mb-6 text-center glow-text">Upcoming Shows</h2>
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
              </div>
              <CardContent className="p-6">
                <h3 className="groovy-font text-2xl mb-2 text-pink-400">{show.venue}</h3>
                <p className="text-white/80 mb-1">{show.date}</p>
                <p className="text-white/60 mb-4">{show.location}</p>
                <Button
                  className={`w-full magnetic-button ${
                    show.status === "Sold Out" ? "bg-gray-600 cursor-not-allowed" : "aurora-gradient"
                  }`}
                  disabled={show.status === "Sold Out"}
                >
                  {show.status === "Sold Out" ? "Sold Out 😢" : "RSVP ✨"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="groovy-font text-4xl mb-6 text-center glow-text">Past Shows</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastShows.map((show) => (
            <Card key={show.id} className="glassmorphic rounded-3xl overflow-hidden float-animation">
              <div className="h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-4xl">🎵</div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="groovy-font text-2xl mb-2 text-purple-400">{show.venue}</h3>
                <p className="text-white/80 mb-1">{show.date}</p>
                <p className="text-white/60 mb-4">{show.location}</p>
                <Button className="w-full magnetic-button bg-gradient-to-r from-purple-600 to-pink-600">
                  Listen to Recording 🎧
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
