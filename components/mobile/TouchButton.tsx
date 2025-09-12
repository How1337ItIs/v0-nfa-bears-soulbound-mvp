"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function TouchButton({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: TouchButtonProps) {
  const baseClasses =
    "touch-manipulation transition-all duration-200 font-medium rounded-xl flex items-center justify-center"

  const variants = {
    primary: "modern-psychedelic-button bg-gradient-to-r from-[#1a1aff] to-[#8000ff] text-white shadow-lg active:scale-95 psychedelic-optimized",
    secondary: "glassmorphic-flow bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95 psychedelic-optimized",
    ghost: "text-white hover:glassmorphic-flow hover:bg-white/10 active:scale-95 transition-all duration-300",
    destructive: "modern-psychedelic-button bg-gradient-to-r from-[#ff3366] to-[#ff0080] text-white hover:shadow-[#ff3366]/40 active:scale-95 psychedelic-optimized",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]",
  }

  const disabledClasses = "opacity-50 cursor-not-allowed"

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], disabled && disabledClasses, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
