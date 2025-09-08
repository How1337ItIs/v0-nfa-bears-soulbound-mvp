"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ShakedownStreetTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [revealedCodes, setRevealedCodes] = useState<number[]>([])

  const vendors = [
    {
      id: 1,
      name: "Cosmic Threads",
      category: "Merch",
      discount: 25,
      logo: "👕",
      code: "COSMIC25",
    },
    {
      id: 2,
      name: "Psychedelic Prints",
      category: "Art",
      discount: 15,
      logo: "🎨",
      code: "TRIPPY15",
    },
    {
      id: 3,
      name: "Grateful Grub",
      category: "Food",
      discount: 20,
      logo: "🍕",
      code: "MUNCHIES20",
    },
    {
      id: 4,
      name: "Miracle Tickets",
      category: "Tickets",
      discount: 10,
      logo: "🎫",
      code: "MIRACLE10",
    },
  ]

  const categories = ["all", "Merch", "Art", "Food", "Tickets"]

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const revealCode = (vendorId: number) => {
    setRevealedCodes((prev) => [...prev, vendorId])
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text">Shakedown Street</h2>
        <p className="script-font text-xl text-white/80">Find your miracle deals, beautiful soul ✨</p>
      </div>

      <div className="glassmorphic rounded-2xl p-6 space-y-4">
        <Input
          placeholder="Find your miracle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`magnetic-button ${
                selectedCategory === category
                  ? "aurora-gradient"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="glassmorphic rounded-3xl overflow-hidden float-animation hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 breathe-animation">{vendor.logo}</div>
              <h3 className="groovy-font text-2xl mb-2 text-pink-400">{vendor.name}</h3>
              <Badge className="mb-4 aurora-gradient border-0">{vendor.category}</Badge>
              <div className="text-3xl groovy-font text-green-400 mb-4">{vendor.discount}% OFF</div>

              {revealedCodes.includes(vendor.id) ? (
                <div className="space-y-2">
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-lg text-green-400 glow-text">
                    {vendor.code}
                  </div>
                  <p className="text-sm text-white/60">Code revealed! ✨</p>
                </div>
              ) : (
                <Button onClick={() => revealCode(vendor.id)} className="w-full magnetic-button aurora-gradient">
                  Reveal Code 🔮
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
