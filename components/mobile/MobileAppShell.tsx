"use client"

import type React from "react"
import { usePrivy } from "@privy-io/react-auth"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Scan, User, Settings } from "lucide-react"

export function MobileAppShell({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy()
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/scan", icon: Scan, label: "Scan", requiresAuth: true },
    { href: "/profile", icon: User, label: "Profile", requiresAuth: true },
    { href: "/dashboard", icon: Settings, label: "Dashboard", requiresAuth: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Psychedelic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-orange-400/20 to-transparent rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-green-400/20 to-transparent rounded-full animate-float-delayed" />
      </div>

      <main className="relative z-10 pb-16">{children}</main>

      {/* Bottom Navigation */}
      {authenticated && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10 z-50">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isDisabled = item.requiresAuth && !authenticated

              if (isDisabled) {
                return (
                  <div key={item.href} className="flex flex-col items-center py-2 px-3 opacity-50">
                    <Icon className="w-5 h-5 text-white/50" />
                    <span className="text-xs text-white/50 mt-1">{item.label}</span>
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-3 transition-colors ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
