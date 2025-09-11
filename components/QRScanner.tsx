"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"
import { toast } from "react-hot-toast"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
  width?: number
  height?: number
  fps?: number
  className?: string
}

export default function QRScanner({
  onScanSuccess,
  onScanError,
  width = 300,
  height = 300,
  fps = 10,
  className = "",
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: width },
          height: { ideal: height },
        },
      })

      stream.getTracks().forEach((track) => track.stop())
      setHasPermission(true)
      setError(null)
      return true
    } catch (err) {
      console.error("Camera permission denied:", err)
      setHasPermission(false)
      setError("Camera access is required to scan QR codes. Please allow camera permission and try again.")
      return false
    }
  }, [width, height])

  // Initialize scanner
  const initializeScanner = useCallback(async () => {
    if (!elementRef.current || scannerRef.current) return

    const config = {
      fps,
      qrbox: {
        width: Math.min(250, width * 0.8),
        height: Math.min(250, height * 0.8),
      },
      aspectRatio: 1.0,
      disableFlip: false,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 1,
      useBarCodeDetectorIfSupported: true,
      rememberLastUsedCamera: true,
      videoConstraints: {
        facingMode: "environment",
      },
    }

    try {
      const scanner = new Html5QrcodeScanner(elementRef.current.id, config, false)

      const handleScanSuccess = (decodedText: string) => {
        console.log("🔍 QR Code scanned:", decodedText)
        setIsScanning(false)
        onScanSuccess(decodedText)
        toast.success("QR code scanned successfully!")
      }

      const handleScanError = (errorMessage: string) => {
        if (!errorMessage.includes("NotFoundException") && !errorMessage.includes("No MultiFormat Readers were able")) {
          console.warn("QR Scanner error:", errorMessage)
        }
      }

      scanner.render(handleScanSuccess, handleScanError)
      scannerRef.current = scanner
      setIsScanning(true)
      setError(null)
    } catch (err) {
      console.error("Failed to initialize QR scanner:", err)
      setError("Failed to initialize camera scanner. Please check your camera settings.")
      onScanError?.("Scanner initialization failed")
    }
  }, [fps, width, height, onScanSuccess, onScanError])

  // Cleanup scanner
  const cleanupScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
        scannerRef.current = null
        setIsScanning(false)
      } catch (err) {
        console.warn("Error cleaning up scanner:", err)
      }
    }
  }, [])

  // Start scanning
  const startScanning = useCallback(async () => {
    setError(null)

    if (hasPermission === null) {
      const permitted = await requestCameraPermission()
      if (!permitted) return
    }

    if (hasPermission === false) {
      await requestCameraPermission()
      return
    }

    await initializeScanner()
  }, [hasPermission, requestCameraPermission, initializeScanner])

  // Initialize on mount
  useEffect(() => {
    if (!elementRef.current) return

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera not supported on this device")
      return
    }

    if (hasPermission) {
      initializeScanner()
    }

    return () => {
      cleanupScanner()
    }
  }, [hasPermission, initializeScanner, cleanupScanner])

  return (
    <div className={`text-center ${className}`}>
      <div className="text-6xl mb-6 spiral-animation">📷</div>
      <h3 className="text-xl font-bold text-white mb-4">Scan Miracle Invite</h3>
      <p className="text-white/80 mb-6">Point your camera at the QR code to join the NFA Bears family</p>

      {error ? (
        <div className="space-y-4">
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={startScanning}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {hasPermission === false ? "Grant Camera Permission" : "Try Again"}
          </button>
        </div>
      ) : hasPermission === null ? (
        <div className="space-y-4">
          <p className="text-white/80">We need camera access to scan QR codes for your Miracle SBT</p>
          <button
            onClick={requestCameraPermission}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Enable Camera
          </button>
        </div>
      ) : (
        <div>
          <div id="qr-scanner" ref={elementRef} className="w-full mb-4" style={{ minHeight: 250 }} />

          {isScanning ? (
            <div className="space-y-2">
              <p className="text-white/80 text-sm">Looking for QR code...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            </div>
          ) : (
            <button
              onClick={startScanning}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Start Scanning
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 border border-white/20 rounded-lg bg-white/5">
        <h4 className="text-white font-medium mb-2 text-sm">How to scan:</h4>
        <ul className="text-white/70 text-xs space-y-1 text-left">
          <li>• Hold your device steady</li>
          <li>• Ensure good lighting</li>
          <li>• Point camera at the QR code</li>
          <li>• Wait for automatic detection</li>
        </ul>
      </div>
    </div>
  )
}
