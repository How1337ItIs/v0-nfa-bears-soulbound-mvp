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
    primary: "bg-[#1a1aff] text-white shadow-lg shadow-[#1a1aff]/25 hover:shadow-[#1a1aff]/40 active:scale-95",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95",
    ghost: "text-white hover:bg-white/10 active:scale-95",
    destructive: "bg-[#ff3366] text-white hover:bg-[#ff3366]/90 active:scale-95",
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
