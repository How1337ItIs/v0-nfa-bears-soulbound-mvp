"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Lazy load QR scanner only when needed
const QRScannerMobile = dynamic(
  () => import("./mobile/QRScannerMobile").then(mod => ({ default: mod.QRScannerMobile })),
  {
    ssr: false,
    loading: () => (
      <div className="glassmorphic rounded-xl p-8 text-center">
        <div className="text-6xl mb-6 spiral-animation">📷</div>
        <h3 className="text-xl font-bold text-white mb-4">Loading Scanner</h3>
        <p className="text-white/80 mb-6">Initializing camera...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    ),
  }
)

interface ClientOnlyQRScannerProps {
  onScanSuccess: (result: string) => void
  onScanError: (error: string) => void
  width?: number
  height?: number
  className?: string
}

export function ClientOnlyQRScanner({ 
  onScanSuccess, 
  onScanError, 
  width = 300, 
  height = 300,
  className 
}: ClientOnlyQRScannerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="glassmorphic rounded-xl p-8 text-center">
        <div className="text-6xl mb-6">📷</div>
        <h3 className="text-xl font-bold text-white mb-4">Loading Scanner</h3>
        <p className="text-white/80 mb-6">Preparing camera access...</p>
        <div className="animate-pulse h-8 w-8 bg-white/20 rounded-full mx-auto"></div>
      </div>
    )
  }

  return (
    <QRScannerMobile
      isOpen={true}
      onClose={() => {}} // No-op since we're always open in this context
      onScanSuccess={onScanSuccess}
    />
  )
}