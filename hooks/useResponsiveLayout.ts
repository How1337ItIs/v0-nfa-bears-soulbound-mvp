"use client"

import { useState, useEffect } from "react"

export function useResponsiveLayout() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = dimensions.width < 768
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024
  const isDesktop = dimensions.width >= 1024

  return {
    isMobile,
    isTablet,
    isDesktop,
    width: dimensions.width,
    height: dimensions.height,
  }
}
