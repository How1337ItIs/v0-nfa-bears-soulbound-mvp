"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "critical" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
  glow?: boolean
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#1a1aff] text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25",
      secondary: "bg-white/10 backdrop-blur-sm border border-[#1a1aff]/50 text-white hover:bg-[#1a1aff]/20",
      critical: "bg-[#ff3366] text-[#000011] hover:scale-[1.02] active:scale-95 shadow-lg",
      ghost: "text-white hover:bg-white/10 active:bg-white/20",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[36px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[52px]",
      xl: "px-10 py-5 text-xl min-h-[60px]",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 touch-manipulation",
          "focus:outline-none focus:ring-2 focus:ring-[#1a1aff] focus:ring-offset-2 focus:ring-offset-[#000011]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variants[variant],
          sizes[size],
          glow && variant === "primary" && "shadow-[0_0_20px_rgba(26,26,255,0.4)]",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

TouchButton.displayName = "TouchButton"
