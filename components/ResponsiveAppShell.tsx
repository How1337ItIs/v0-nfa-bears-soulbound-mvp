"use client"

import type React from "react"
import { useLayout } from "@/providers/LayoutProvider"
import { MobileAppShell } from "./mobile/MobileAppShell"
import { DesktopAppShell } from "./desktop/DesktopAppShell"

export function ResponsiveAppShell({ children }: { children: React.ReactNode }) {
  const { isMobile } = useLayout()

  if (isMobile) {
    return <MobileAppShell>{children}</MobileAppShell>
  }

  return <DesktopAppShell>{children}</DesktopAppShell>
}
