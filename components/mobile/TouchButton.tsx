"use client"

import type React from "react"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg" | "xl"
  haptic?: boolean
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, variant = "primary", size = "md", haptic = true, children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback for supported devices
      if (haptic && "vibrate" in navigator) {
        navigator.vibrate(10)
      }

      onClick?.(e)
    }

    const variants = {
      primary: "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl active:scale-95",
      secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 active:scale-95",
      ghost: "text-white hover:bg-white/10 active:scale-95",
      danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl active:scale-95",
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
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 touch-manipulation select-none",
          "focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variants[variant],
          sizes[size],
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  },
)

TouchButton.displayName = "TouchButton"
