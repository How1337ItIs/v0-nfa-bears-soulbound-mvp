"use client"

import { useLayout } from "@/providers/LayoutProvider"
import HomePage from "./HomePage"
import DesktopHomePage from "./DesktopHomePage"

export default function ResponsiveHomePage() {
  const { isMobile } = useLayout()
  
  if (isMobile) {
    return <HomePage />
  }
  
  return <DesktopHomePage />
}