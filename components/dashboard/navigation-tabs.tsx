"use client"

interface Tab {
  id: string
  label: string
  icon: string
  requiresAuth?: "miracle" | "genesis" | "admin" | "ambassador"
  hideForAuth?: "miracle" | "genesis"
}

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userType: "unverified" | "miracle" | "genesis" | "admin" | "ambassador"
}

export default function NavigationTabs({ activeTab, onTabChange, userType }: NavigationTabsProps) {
  const allTabs: Tab[] = [
    { id: "getstarted", label: "Get Started", icon: "🚀", hideForAuth: "miracle" },
    { id: "shows", label: "Shows", icon: "🎵" },
    { id: "family", label: "The Family", icon: "👥", requiresAuth: "miracle" },
    { id: "shakedown", label: "Shakedown Street", icon: "🛍️", requiresAuth: "miracle" },
    { id: "miracle", label: "Miracle Someone", icon: "✨", requiresAuth: "genesis" },
    { id: "journey", label: "My Journey", icon: "🛤️", requiresAuth: "miracle" },
    { id: "poats", label: "POATs", icon: "🎫", requiresAuth: "miracle" },
  ]

  // Filter tabs based on user type
  const visibleTabs = allTabs.filter((tab) => {
    // Hide tabs that should be hidden for authenticated users
    if (tab.hideForAuth && (userType === "miracle" || userType === "genesis" || userType === "admin")) {
      return false
    }

    // Show tabs that don't require auth
    if (!tab.requiresAuth) {
      return true
    }

    // Check specific auth requirements
    switch (tab.requiresAuth) {
      case "miracle":
        return ["miracle", "genesis", "admin"].includes(userType)
      case "genesis":
        return ["genesis", "admin"].includes(userType)
      case "admin":
        return userType === "admin"
      case "ambassador":
        return ["ambassador", "admin"].includes(userType)
      default:
        return true
    }
  })

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
            activeTab === tab.id
              ? "bg-white/20 text-white border border-white/30 shadow-lg"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
