"use client"

import { Button } from "@/components/ui/button"

interface NavigationTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  const tabs = [
    { id: "shows", label: "Shows", icon: "🎵" },
    { id: "shakedown", label: "Shakedown Street", icon: "🛍️" },
    { id: "family", label: "The Family", icon: "👥" },
    { id: "miracle", label: "Miracle Someone", icon: "✨" },
  ]

  return (
    <div className="sticky top-20 z-40 mb-8">
      <div className="glassmorphic rounded-2xl p-2 flex flex-wrap gap-2 liquid-morph">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`magnetic-button flex-1 min-w-fit px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "aurora-gradient text-white shadow-lg"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <span className="mr-2 text-xl">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
