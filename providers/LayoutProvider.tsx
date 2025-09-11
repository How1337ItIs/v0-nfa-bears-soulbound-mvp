"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"

interface LayoutContextType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout()

  return <LayoutContext.Provider value={{ isMobile, isTablet, isDesktop }}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
