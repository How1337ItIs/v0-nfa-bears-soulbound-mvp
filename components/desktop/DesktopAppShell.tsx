"use client"

import type React from "react"
import { usePrivy } from "@privy-io/react-auth"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Scan, User, Settings, LogOut } from "lucide-react"

export function DesktopAppShell({ children }: { children: React.ReactNode }) {
  const { authenticated, logout } = usePrivy()
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/scan", icon: Scan, label: "Scan QR", requiresAuth: true },
    { href: "/profile", icon: User, label: "Profile", requiresAuth: true },
    { href: "/dashboard", icon: Settings, label: "Dashboard", requiresAuth: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      {/* Psychedelic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-orange-400/20 to-transparent rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-green-400/20 to-transparent rounded-full animate-float-delayed" />
      </div>

      {/* Sidebar */}
      {authenticated && (
        <aside className="w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 relative z-10">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="text-2xl">🐻</div>
              <div>
                <h1 className="text-white font-bold text-lg">NFA Bears</h1>
                <p className="text-white/60 text-sm">Not Fade Away</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isDisabled = item.requiresAuth && !authenticated

                if (isDisabled) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-white/30 cursor-not-allowed"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {authenticated && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  )
}
