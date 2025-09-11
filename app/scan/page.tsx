"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { toast } from "react-hot-toast"
import { ClientOnlyQRScanner } from "@/components/ClientOnlyQRScanner"

export default function ScanPage() {
  const router = useRouter()
  const { authenticated, ready } = usePrivy()
  const [currentStep, setCurrentStep] = useState<"scan" | "location" | "minting" | "success">("scan")
  const [scannedCode, setScannedCode] = useState<string | null>(null)

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleScanSuccess = async (decodedText: string) => {
    setScannedCode(decodedText)
    toast.success(`QR Code scanned: ${decodedText.substring(0, 20)}...`)

    // Simulate the minting process
    setCurrentStep("minting")

    setTimeout(() => {
      setCurrentStep("success")
      toast.success("Miracle SBT minted successfully!")
    }, 3000)
  }

  const handleScanError = (error: string) => {
    toast.error("Scanner error - please try again")
  }

  const resetScan = () => {
    setCurrentStep("scan")
    setScannedCode(null)
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">60-Second Miracle</h1>
          <p className="text-white/80">Scan your invite QR code to join the NFA Bears family</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6 px-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div
              className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === "scan"
                  ? "bg-white text-purple-600"
                  : ["location", "minting", "success"].includes(currentStep)
                    ? "bg-green-400 text-white"
                    : "bg-white/20 text-white/60"
              }`}
            >
              1
            </div>
            <div className="w-4 sm:w-8 h-1 bg-white/20">
              <div
                className={`h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ${
                  ["location", "minting", "success"].includes(currentStep) ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === "location"
                  ? "bg-white text-purple-600"
                  : ["minting", "success"].includes(currentStep)
                    ? "bg-green-400 text-white"
                    : "bg-white/20 text-white/60"
              }`}
            >
              2
            </div>
            <div className="w-4 sm:w-8 h-1 bg-white/20">
              <div
                className={`h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ${
                  ["minting", "success"].includes(currentStep) ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === "minting"
                  ? "bg-white text-purple-600"
                  : currentStep === "success"
                    ? "bg-green-400 text-white"
                    : "bg-white/20 text-white/60"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {currentStep === "scan" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <ClientOnlyQRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              width={300}
              height={300}
              className="max-w-full"
            />
          </div>
        )}

        {currentStep === "minting" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6 breathe-animation">🎪</div>
            <h3 className="text-xl font-bold text-white mb-4">Minting Your Miracle SBT</h3>
            <p className="text-white/80 mb-6">Creating your soulbound token on the blockchain...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {currentStep === "success" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6 dancing-bear">🐻✨</div>
            <h3 className="text-2xl font-bold text-white mb-4">Welcome to the Family!</h3>
            <p className="text-white/80 mb-6">
              Your Miracle SBT has been minted successfully. You're now part of the NFA Bears community!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={resetScan}
                className="w-full py-2 px-6 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-all"
              >
                Scan Another Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
