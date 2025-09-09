"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ShakedownStreetTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeQR, setActiveQR] = useState<number | null>(null)
  const [qrTimer, setQrTimer] = useState(0)
  const [verifyingVendor, setVerifyingVendor] = useState<number | null>(null)

  // Mock user membership data
  const userMembership = {
    type: "genesis", // "genesis" | "miracle" | "unverified"
    discountTier: 20, // 20% for genesis, 10% for miracle
    totalSaved: 143,
    monthlySupport: 143,
  }

  const vendors = [
    {
      id: 1,
      name: "Cosmic Threads",
      category: "Merch",
      discount: 25,
      logo: "👕",
      code: "COSMIC25",
      verified: true,
    },
    {
      id: 2,
      name: "Electric Prints",
      category: "Art",
      discount: 15,
      logo: "🎨",
      code: "ELECTRIC15",
      verified: true,
    },
    {
      id: 3,
      name: "Grateful Grub",
      category: "Food",
      discount: 20,
      logo: "🍕",
      code: "MUNCHIES20",
      verified: false,
    },
    {
      id: 4,
      name: "Miracle Tickets",
      category: "Tickets",
      discount: 10,
      logo: "🎫",
      code: "MIRACLE10",
      verified: true,
    },
  ]

  const categories = ["all", "Merch", "Art", "Food", "Tickets"]

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // QR Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeQR && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer((prev) => {
          if (prev <= 1) {
            setActiveQR(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeQR, qrTimer])

  const generateQR = (vendorId: number) => {
    setActiveQR(vendorId)
    setQrTimer(30) // 30 second expiry
  }

  const verifyVendor = async (vendorId: number) => {
    setVerifyingVendor(vendorId)
    // Mock 2-second verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setVerifyingVendor(null)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="groovy-font text-5xl mb-4 glow-text text-white">Shakedown Street</h2>
        <p className="script-font text-xl text-white/80">Find your miracle deals, beautiful soul ✨</p>
      </div>

      {/* User Discount Status */}
      <Card className="glassmorphic rounded-3xl p-6 breathe-animation">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl groovy-font aurora-gradient bg-clip-text text-transparent mb-2">
              {userMembership.discountTier}%
            </div>
            <p className="text-white/80">Your Discount Tier</p>
            <Badge className="mt-2 aurora-gradient border-0">
              {userMembership.type === "genesis" ? "Genesis" : "Miracle"} Member
            </Badge>
          </div>
          <div>
            <div className="text-3xl groovy-font text-green-400 mb-2">${userMembership.totalSaved}</div>
            <p className="text-white/80">Total Saved</p>
            <p className="text-xs text-white/60 mt-1">All time discounts</p>
          </div>
          <div>
            <div className="text-3xl groovy-font text-blue-400 mb-2">${userMembership.monthlySupport}</div>
            <p className="text-white/80">Vendor Support</p>
            <p className="text-xs text-white/60 mt-1">You've saved vendors this month</p>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
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

      {/* Vendor Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="glassmorphic rounded-3xl overflow-hidden float-animation hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-6xl breathe-animation">{vendor.logo}</div>
                {vendor.verified && <div className="text-green-400 text-xl">✅</div>}
              </div>

              <h3 className="groovy-font text-2xl mb-2 text-red-400">{vendor.name}</h3>
              <Badge className="mb-4 aurora-gradient border-0">{vendor.category}</Badge>
              <div className="text-3xl groovy-font text-white mb-4">{vendor.discount}% OFF</div>

              {activeQR === vendor.id ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center spiral-animation">
                    <div className="text-black text-xs font-bold">QR CODE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl groovy-font text-red-400 mb-2">{qrTimer}s</div>
                    <p className="text-xs text-white/60">Code expires in {qrTimer} seconds</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-400">
                      {userMembership.discountTier}% Discount Active
                    </Badge>
                  </div>
                </div>
              ) : verifyingVendor === vendor.id ? (
                <div className="space-y-2">
                  <div className="text-blue-400 text-lg">🔄</div>
                  <p className="text-white/80">Verifying on Berachain...</p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full aurora-gradient w-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => generateQR(vendor.id)} className="w-full magnetic-button aurora-gradient">
                    Generate QR Code 🔮
                  </Button>
                  {!vendor.verified && (
                    <Button
                      onClick={() => verifyVendor(vendor.id)}
                      variant="outline"
                      className="w-full text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Verify Vendor ⚡
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reimbursement Info for Genesis Holders */}
      {userMembership.type === "genesis" && (
        <Card className="glassmorphic rounded-3xl p-6">
          <div className="text-center">
            <h3 className="groovy-font text-2xl mb-4 text-yellow-400">Genesis Holder Perks</h3>
            <p className="text-white/80 mb-4">
              As a Genesis Bear holder, your discounts help support our vendor community. The DAO reimburses vendors for
              the extra discount you receive.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-2xl groovy-font text-green-400 mb-2">10%</div>
                <p className="text-white/80 text-sm">Extra discount vs Miracle holders</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-2xl groovy-font text-blue-400 mb-2">${userMembership.monthlySupport}</div>
                <p className="text-white/80 text-sm">Vendor support this month</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
