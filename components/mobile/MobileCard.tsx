"use client"

import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glassmorphic" | "neon" | "gradient"
  interactive?: boolean
  glow?: boolean
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, variant = "default", interactive = false, glow = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-white/5 backdrop-blur-sm border border-white/10",
      glassmorphic: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
      neon: "bg-black/50 border-2 border-pink-400/50 shadow-lg shadow-pink-400/25",
      gradient: "bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-white/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          interactive && "hover:scale-105 active:scale-95 cursor-pointer touch-manipulation",
          glow && "shadow-2xl shadow-pink-400/20",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

MobileCard.displayName = "MobileCard"
