"use client"

import React, { createContext, useContext } from "react"
import { useResponsiveLayout, type LayoutMode, type DetectedLayout } from "@/hooks/useResponsiveLayout"

interface LayoutContextType {
  mode: LayoutMode
  detected: DetectedLayout
  current: DetectedLayout
  isMobile: boolean
  isDesktop: boolean
  setMode: (mode: LayoutMode) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const layout = useResponsiveLayout()
  
  return (
    <LayoutContext.Provider value={layout}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}