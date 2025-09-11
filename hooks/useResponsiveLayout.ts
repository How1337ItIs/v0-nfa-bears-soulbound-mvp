"use client"

import { useState, useEffect } from "react"

export type LayoutMode = "mobile" | "desktop" | "auto"
export type DetectedLayout = "mobile" | "desktop"

interface ResponsiveLayoutState {
  mode: LayoutMode
  detected: DetectedLayout
  current: DetectedLayout
  isMobile: boolean
  isDesktop: boolean
  setMode: (mode: LayoutMode) => void
}

export function useResponsiveLayout(): ResponsiveLayoutState {
  const [mode, setMode] = useState<LayoutMode>("auto")
  const [detected, setDetected] = useState<DetectedLayout>("desktop")
  
  useEffect(() => {
    const checkViewport = () => {
      const isMobileViewport = window.innerWidth < 768
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Smart detection: mobile viewport OR touch device with small screen
      const shouldUseMobile = isMobileViewport || (isTouchDevice && window.innerWidth < 1024)
      
      setDetected(shouldUseMobile ? "mobile" : "desktop")
    }
    
    checkViewport()
    window.addEventListener("resize", checkViewport)
    
    return () => window.removeEventListener("resize", checkViewport)
  }, [])
  
  const current = mode === "auto" ? detected : mode as DetectedLayout
  
  return {
    mode,
    detected,
    current,
    isMobile: current === "mobile",
    isDesktop: current === "desktop",
    setMode,
  }
}