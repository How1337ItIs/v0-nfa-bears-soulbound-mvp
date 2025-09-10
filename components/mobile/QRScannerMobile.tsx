"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, X, FishOff as FlashOff, SlashIcon as FlashOn, RotateCcw } from "lucide-react"
import { TouchButton } from "./TouchButton"

interface QRScannerMobileProps {
  onScanSuccess: (result: string) => void
  onClose: () => void
  isOpen: boolean
}

export function QRScannerMobile({ onScanSuccess, onClose, isOpen }: QRScannerMobileProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Request camera permission and start stream
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
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasPermission(true)
      setIsScanning(true)
      setError(null)
    } catch (err) {
      setHasPermission(false)
      setError("Camera access denied. Please enable camera permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
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
        } catch (err) {
          console.log("Flash not supported")
        }
      }
    }
  }

  const handleManualEntry = () => {
    const code = prompt("Enter QR code manually:")
    if (code) {
      onScanSuccess(code)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <TouchButton
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </TouchButton>

          <div className="text-center">
            <h2 className="text-white font-bold text-lg">Scan QR Code</h2>
            <p className="text-white/70 text-sm">Point camera at invite code</p>
          </div>

          <TouchButton
            onClick={toggleFlash}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            {flashEnabled ? (
              <FlashOn className="w-6 h-6 text-yellow-400" />
            ) : (
              <FlashOff className="w-6 h-6 text-white" />
            )}
          </TouchButton>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {hasPermission === null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">Requesting camera access...</p>
            </div>
          </div>
        )}

        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black p-8">
            <div className="text-center">
              <Camera className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Camera Access Required</h3>
              <p className="text-white/70 mb-6">{error}</p>
              <div className="space-y-3">
                <TouchButton
                  onClick={requestCameraPermission}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </TouchButton>
                <TouchButton
                  onClick={handleManualEntry}
                  className="w-full bg-white/10 text-white py-4 rounded-xl font-semibold"
                >
                  Enter Code Manually
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {hasPermission && (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning Frame */}
                <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                  {/* Corner Indicators */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-400 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-pink-400 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-400 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-400 rounded-br-2xl"></div>

                  {/* Scanning Line */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-scan"></div>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-white text-center mt-6 font-medium">Position QR code within the frame</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 safe-area-bottom">
        <div className="flex justify-center space-x-4">
          <TouchButton
            onClick={handleManualEntry}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium"
          >
            Manual Entry
          </TouchButton>
        </div>
      </div>
    </div>
  )
}
