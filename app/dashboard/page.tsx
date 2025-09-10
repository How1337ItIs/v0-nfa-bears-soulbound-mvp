"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { MobileDashboard } from "@/components/mobile/MobileDashboard"

export default function DashboardPage() {
  const { authenticated, ready } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐻</div>
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <MobileDashboard />
}
