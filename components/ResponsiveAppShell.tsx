"use client"

import type React from "react"
import { useLayout } from "@/providers/LayoutProvider"
import { MobileAppShell } from "@/components/mobile/MobileAppShell"
import { DesktopAppShell } from "@/components/desktop/DesktopAppShell"

interface ResponsiveAppShellProps {
  children: React.ReactNode
}

export function ResponsiveAppShell({ children }: ResponsiveAppShellProps) {
  const { isMobile } = useLayout()
  
  if (isMobile) {
    return <MobileAppShell>{children}</MobileAppShell>
  }
  
  return <DesktopAppShell>{children}</DesktopAppShell>
}