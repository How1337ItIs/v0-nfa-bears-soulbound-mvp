"use client"

import { usePrivy } from "@privy-io/react-auth"
import { ResponsiveHomePage } from "./components/ResponsiveHomePage"

export default function HomePage() {
  const { ready } = usePrivy()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐻</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  return <ResponsiveHomePage />
}
