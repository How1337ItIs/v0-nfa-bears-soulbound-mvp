"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface MobileCardProps {
  children: React.ReactNode
  variant?: "default" | "glassmorphic" | "hero"
  className?: string
  onClick?: () => void
}

export function MobileCard({ children, variant = "default", className, onClick }: MobileCardProps) {
  const baseClasses = "rounded-2xl p-6 transition-all duration-300"

  const variants = {
    default: "bg-white/5 border border-white/10",
    glassmorphic: "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg",
    hero: "bg-gradient-to-br from-[#1a1aff]/20 to-[#ff3366]/10 border border-[#1a1aff]/30 shadow-xl shadow-[#1a1aff]/20",
  }

  const interactiveClasses = onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""

  return (
    <div className={cn(baseClasses, variants[variant], interactiveClasses, className)} onClick={onClick}>
      {children}
    </div>
  )
}
