"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMockState } from "@/context/mock-state-provider"

export function Navigation() {
  const { isAuthenticated, user, logout } = useMockState()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glassmorphic border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl dancing-bear">🐻</div>
            <span className="groovy-font text-xl glow-text">NFA Bears</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/80 hidden sm:inline">
                  {user?.email || `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}`}
                </span>
                <Button onClick={logout} variant="outline" className="magnetic-button bg-transparent">
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="magnetic-button aurora-gradient">Connect Wallet</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block text-white/80 hover:text-white transition-colors py-2">
              Home
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="block text-white/80 hover:text-white transition-colors py-2">
                Dashboard
              </Link>
            )}
            <Link href="/about" className="block text-white/80 hover:text-white transition-colors py-2">
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
