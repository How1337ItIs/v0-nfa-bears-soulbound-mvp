"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-ui"
import NavigationTabs from "@/components/dashboard/navigation-tabs"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ShowsTab from "@/components/dashboard/shows-tab"
import TheFamilyTab from "@/components/dashboard/the-family-tab"
import ShakedownStreetTab from "@/components/dashboard/shakedown-street-tab"
import MiracleSomeoneTab from "@/components/dashboard/miracle-someone-tab"
import POATCollection from "@/components/dashboard/poat-collection"
import GetStartedTab from "@/components/dashboard/get-started-tab"
import MyJourneyTab from "@/components/dashboard/my-journey-tab"

export default function DashboardPage() {
  const { ready, authenticated } = usePrivy()
  const [activeTab, setActiveTab] = useState("getstarted")

  // Mock user type - in real app, this would come from blockchain/context
  const [userType] = useState<"unverified" | "miracle" | "genesis" | "admin" | "ambassador">("unverified")

  // Set default tab based on user type
  useState(() => {
    if (userType === "unverified") {
      setActiveTab("getstarted")
    } else if (userType === "miracle" || userType === "genesis") {
      setActiveTab("shows")
    }
  })

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen tie-dye-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8 dancing-bear">🐻</div>
          <div className="animate-pulse text-white text-xl">Loading your cosmic dashboard...</div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "getstarted":
        return <GetStartedTab />
      case "shows":
        return <ShowsTab />
      case "family":
        return <TheFamilyTab />
      case "shakedown":
        return <ShakedownStreetTab />
      case "miracle":
        return <MiracleSomeoneTab />
      case "journey":
        return <MyJourneyTab />
      case "poats":
        return <POATCollection />
      default:
        return <GetStartedTab />
    }
  }

  return (
    <div className="min-h-screen tie-dye-bg">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader userType={userType} />

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} userType={userType} />

        <div className="max-w-6xl mx-auto">{renderTabContent()}</div>
      </div>
    </div>
  )
}
