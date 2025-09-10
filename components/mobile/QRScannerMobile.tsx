"use client"

import { useState, useEffect, useRef } from "react"
import { X, Flashlight, FlashlightOff, Type } from "lucide-react"
import { TouchButton } from "./TouchButton"
import { MobileCard } from "./MobileCard"

interface QRScannerMobileProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (result: string) => void
}

export function QRScannerMobile({ isOpen, onClose, onScanSuccess }: QRScannerMobileProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setHasPermission(true)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera permission denied:", error)
      setHasPermission(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      if (track && "applyConstraints" in track) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any],
          })
          setFlashEnabled(!flashEnabled)
        } catch (error) {
          console.error("Flash not supported:", error)
        }
      }
    }
  }

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim())
      setManualCode("")
      setShowManualEntry(false)
    }
  }

  const simulateSuccessfulScan = () => {
    // For demo purposes - simulate scanning a QR code
    onScanSuccess("https://nfabears.xyz/invite/demo123")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="safe-area-top bg-black/40 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-white font-semibold text-lg">Scan QR Code</h2>
          <TouchButton variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </TouchButton>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {hasPermission === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MobileCard variant="glassmorphic" className="text-center max-w-sm mx-4">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-white font-semibold mb-2">Camera Access Required</h3>
              <p className="text-white/70 text-sm mb-4">We need camera access to scan QR codes</p>
              <TouchButton onClick={requestCameraPermission} size="sm">
                Grant Permission
              </TouchButton>
            </MobileCard>
          </div>
        )}

        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MobileCard variant="glassmorphic" className="text-center max-w-sm mx-4">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-white font-semibold mb-2">Camera Access Denied</h3>
              <p className="text-white/70 text-sm mb-4">Please enable camera access in your browser settings</p>
              <TouchButton onClick={() => setShowManualEntry(true)} variant="secondary" size="sm">
                Enter Code Manually
              </TouchButton>
            </MobileCard>
          </div>
        )}

        {hasPermission && !showManualEntry && (
          <>
            {/* Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Caustic Light Frame */}
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-2 border-[#1a1aff] rounded-2xl shadow-[0_0_20px_rgba(26,26,255,0.5)]">
                  {/* Corner Decorations */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-[#1a1aff] rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-[#1a1aff] rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-[#1a1aff] rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-[#1a1aff] rounded-br-lg"></div>

                  {/* Scanning Line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#1a1aff] to-transparent animate-scan"></div>
                </div>

                {/* Terrapin Corner Decorations */}
                <div className="absolute -top-8 -left-8 opacity-30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1aff">
                    <path d="M12 2C7.6 2 4 5.6 4 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 10c-2.2 0-4.2-1.2-5.3-3 1.1-1.8 3.1-3 5.3-3s4.2 1.2 5.3 3c-1.1 1.8-3.1 3-5.3 3z" />
                  </svg>
                </div>
                <div className="absolute -top-8 -right-8 opacity-30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1aff">
                    <path d="M12 2C7.6 2 4 5.6 4 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 10c-2.2 0-4.2-1.2-5.3-3 1.1-1.8 3.1-3 5.3-3s4.2 1.2 5.3 3c-1.1 1.8-3.1 3-5.3 3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-32 left-0 right-0 text-center px-4">
              <p className="text-white text-lg font-medium mb-2">Position QR code in the frame</p>
              <p className="text-white/70 text-sm">The code will be scanned automatically</p>
            </div>
          </>
        )}

        {/* Manual Entry Modal */}
        {showManualEntry && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <MobileCard variant="glassmorphic" className="w-full max-w-sm">
              <div className="text-center mb-4">
                <Type className="w-8 h-8 text-[#1a1aff] mx-auto mb-2" />
                <h3 className="text-white font-semibold">Enter Code Manually</h3>
              </div>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Paste or type QR code content"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <TouchButton variant="secondary" size="sm" onClick={() => setShowManualEntry(false)} className="flex-1">
                  Cancel
                </TouchButton>
                <TouchButton onClick={handleManualSubmit} size="sm" className="flex-1" disabled={!manualCode.trim()}>
                  Submit
                </TouchButton>
              </div>
            </MobileCard>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="safe-area-bottom bg-black/40 backdrop-blur-md">
        <div className="flex items-center justify-center space-x-6 p-4">
          <TouchButton variant="secondary" size="lg" onClick={toggleFlash} className="w-16 h-16 rounded-full">
            {flashEnabled ? <FlashlightOff className="w-6 h-6" /> : <Flashlight className="w-6 h-6" />}
          </TouchButton>

          {/* Demo Scan Button */}
          <TouchButton onClick={simulateSuccessfulScan} size="lg" className="px-8">
            Demo Scan
          </TouchButton>

          <TouchButton
            variant="secondary"
            size="lg"
            onClick={() => setShowManualEntry(true)}
            className="w-16 h-16 rounded-full"
          >
            <Type className="w-6 h-6" />
          </TouchButton>
        </div>
      </div>
    </div>
  )
}
