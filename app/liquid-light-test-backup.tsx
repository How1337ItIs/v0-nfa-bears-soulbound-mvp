"use client"

import { useState, useEffect } from "react"
import ThermalLiquidLight from "@/components/ThermalLiquidLight"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  // Audio simulation state
  const [audioData, setAudioData] = useState({
    volume: 0.7,
    bass: 0.5,
    mids: 0.6,
    treble: 0.4,
    beatDetected: false,
    tempo: 120,
  })

  // Component settings
  const [songMode, setSongMode] = useState<"darkStar" | "fireOnTheMountain" | "terraPinStation" | "scarletBegonias">(
    "darkStar",
  )
  const [intensity, setIntensity] = useState(0.8)
  const [interactive, setInteractive] = useState(true)
  const [performanceMode, setPerformanceMode] = useState<"high" | "medium" | "low">("high")
  const [showControls, setShowControls] = useState(true)

  // Simulate audio reactivity
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioData((prev) => ({
        ...prev,
        volume: 0.3 + Math.random() * 0.7,
        bass: 0.2 + Math.random() * 0.8,
        mids: 0.3 + Math.random() * 0.7,
        treble: 0.1 + Math.random() * 0.9,
        beatDetected: Math.random() > 0.7,
      }))
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const songModeDescriptions = {
    darkStar: "Deep indigos and purples with mysterious, slow-flowing movement",
    fireOnTheMountain: "Warm golds and oranges with building energy patterns",
    terraPinStation: "Cool greens and blues with flowing, water-like motion",
    scarletBegonias: "Vibrant reds and pinks with blooming, organic patterns",
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Enhanced Multi-Layer Liquid Light Background */}
      <div className="absolute inset-0 z-0">
        <ThermalLiquidLight
          audioData={audioData}
          songMode={songMode}
        />
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10 max-w-sm">
          <Card className="bg-black/80 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-white">Grateful Dead Liquid Light Show</CardTitle>
              <CardDescription className="text-gray-300 text-sm">Authentic 1960s psychedelic visuals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Song Mode Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white">Song Mode</Label>
                <Select value={songMode} onValueChange={setSongMode}>
                  <SelectTrigger className="bg-black/50 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/30">
                    <SelectItem value="darkStar">Dark Star</SelectItem>
                    <SelectItem value="fireOnTheMountain">Fire on the Mountain</SelectItem>
                    <SelectItem value="terraPinStation">Terrapin Station</SelectItem>
                    <SelectItem value="scarletBegonias">Scarlet Begonias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">{songModeDescriptions[songMode]}</p>
              </div>

              {/* Intensity Control */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white">Intensity: {Math.round(intensity * 100)}%</Label>
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Performance Mode */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white">Performance</Label>
                <Select value={performanceMode} onValueChange={setPerformanceMode}>
                  <SelectTrigger className="bg-black/50 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/30">
                    <SelectItem value="high">High Quality</SelectItem>
                    <SelectItem value="medium">Medium Quality</SelectItem>
                    <SelectItem value="low">Low Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interactive Toggle */}
              <div className="flex items-center space-x-2">
                <Switch id="interactive" checked={interactive} onCheckedChange={setInteractive} />
                <Label htmlFor="interactive" className="text-sm text-white">
                  Mouse Interaction
                </Label>
              </div>

              {/* Audio Data Display */}
              <div className="space-y-1 text-xs">
                <div className="text-gray-400">Simulated Audio:</div>
                <div className="grid grid-cols-2 gap-1 text-white/80">
                  <div>Volume: {Math.round(audioData.volume * 100)}%</div>
                  <div>Bass: {Math.round(audioData.bass * 100)}%</div>
                  <div>Mids: {Math.round(audioData.mids * 100)}%</div>
                  <div>Treble: {Math.round(audioData.treble * 100)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toggle Controls Button */}
      <Button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-10 bg-black/80 hover:bg-black/90 text-white border-white/20"
        size="sm"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </Button>

      {/* Cultural Information */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-4">
            <p className="text-sm text-gray-300 text-center">
              Recreating the authentic liquid light projections used behind the Grateful Dead at venues like Fillmore
              East in the 1960s. Move your mouse to interact with the fluid simulation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
