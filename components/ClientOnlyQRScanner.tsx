"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const QRScanner = dynamic(() => import("./QRScanner"), {
  ssr: false,
  loading: () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
      <div className="text-6xl mb-6 spiral-animation">📷</div>
      <h3 className="text-xl font-bold text-white mb-4">Loading Scanner</h3>
      <p className="text-white/80 mb-6">Initializing QR code scanner...</p>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
    </div>
  ),
})

interface ClientOnlyQRScannerProps {
  onScanSuccess: (decodedText: string) => void
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
  className = "",
}: ClientOnlyQRScannerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
        <div className="text-6xl mb-6 spiral-animation">📷</div>
        <h3 className="text-xl font-bold text-white mb-4">Loading Scanner</h3>
        <p className="text-white/80 mb-6">Initializing QR code scanner...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    )
  }

  return (
    <QRScanner
      onScanSuccess={onScanSuccess}
      onScanError={onScanError}
      width={width}
      height={height}
      className={className}
    />
  )
}
