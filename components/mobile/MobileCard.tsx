"use client"
import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glassmorphic" | "gradient" | "neon"
  interactive?: boolean
  glow?: boolean
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, variant = "glassmorphic", interactive = false, glow = false, children, ...props }, ref) => {
    const variants = {
      glassmorphic: "bg-white/5 backdrop-blur-md border border-white/10",
      gradient: "bg-gradient-to-br from-[#1a1aff]/20 via-[#ff3366]/10 to-[#1a1aff]/20 border border-[#1a1aff]/30",
      neon: "bg-[#1a1aff]/10 border border-[#1a1aff]/50 shadow-lg shadow-[#1a1aff]/25",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-4 transition-all duration-300",
          variants[variant],
          interactive && "hover:scale-[1.02] hover:shadow-lg cursor-pointer active:scale-[0.98]",
          glow && "shadow-[0_0_20px_rgba(26,26,255,0.3)]",
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
