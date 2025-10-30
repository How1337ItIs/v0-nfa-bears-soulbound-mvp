/**
 * LIQUID LIGHT CONTROLS
 *
 * User interface for controlling liquid light aesthetics
 * Week 1 Day 6-7: Basic controls implementation
 *
 * Author: Claude Code
 * Date: 2025-10-29
 */

'use client';

import { useState, useEffect } from 'react';
import { PaletteDirector, AUTHENTIC_PALETTES } from '@/lib/palette';
import { MODE_PRESETS, type ModeType } from '@/lib/audio/mapping';
import { createVisualPolicyManager, getVisualPolicyManager } from '@/lib/visual/VisualPolicy';

interface LiquidLightControlsProps {
  onIntensityChange?: (intensity: number) => void;
  onPaletteChange?: (paletteId: string) => void;
  onModeChange?: (mode: ModeType) => void;
  onMotionToggle?: (enabled: boolean) => void;
}

export default function LiquidLightControls({
  onIntensityChange,
  onPaletteChange,
  onModeChange,
  onMotionToggle,
}: LiquidLightControlsProps) {
  // Try to attach to VisualPolicy if callbacks not provided
  let policyManager: ReturnType<typeof getVisualPolicyManager> | null = null;
  try {
    createVisualPolicyManager();
    policyManager = getVisualPolicyManager();
  } catch {}

  const initialPolicy = policyManager?.getPolicy();
  const [intensity, setIntensity] = useState(Math.round((initialPolicy?.intensity ?? 0.6) * 100)); // 0-100
  const [selectedPalette, setSelectedPalette] = useState(initialPolicy?.paletteId ?? 'classic-60s');
  const [selectedMode, setSelectedMode] = useState<ModeType>('ambient');
  const [motionEnabled, setMotionEnabled] = useState(initialPolicy?.motionEnabled ?? true);
  const [isOpen, setIsOpen] = useState(false);
  const [smoothing, setSmoothing] = useState(Math.round(((initialPolicy?.audioSmoothingAlpha ?? 0.3) * 100)) / 100);
  const [burst, setBurst] = useState(Math.round(((initialPolicy?.beatBurstMultiplier ?? 1.8) * 10)) / 10);
  const [thinFilmEnabled, setThinFilmEnabled] = useState(initialPolicy?.thinFilmEnabled ?? true);
  const [thinFilmIntensity, setThinFilmIntensity] = useState(Math.round(((initialPolicy?.thinFilmIntensity ?? 0.6) * 100)));

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
    const v01 = value / 100;
    if (onIntensityChange) onIntensityChange(v01);
    else policyManager?.setIntensity(v01);
  };

  const handlePaletteChange = (paletteId: string) => {
    setSelectedPalette(paletteId);
    PaletteDirector.setCurrentPalette(paletteId);
    if (onPaletteChange) onPaletteChange(paletteId);
    else policyManager?.setPalette(paletteId);
  };

  const handleModeChange = (mode: ModeType) => {
    setSelectedMode(mode);
    const preset = MODE_PRESETS[mode];

    // Apply mode preset
    setMotionEnabled(preset.motionEnabled);
    setIntensity(preset.intensity * 100);

    if (onModeChange) onModeChange(mode);
    if (onMotionToggle) onMotionToggle(preset.motionEnabled);
    else policyManager?.setMotionEnabled(preset.motionEnabled);
    if (onIntensityChange) onIntensityChange(preset.intensity);
    else policyManager?.setIntensity(preset.intensity);
  };

  const handleMotionToggle = () => {
    const newValue = !motionEnabled;
    setMotionEnabled(newValue);
    if (onMotionToggle) onMotionToggle(newValue);
    else policyManager?.setMotionEnabled(newValue);
  };

  const handleSmoothingChange = (value: number) => {
    const v = Math.max(0.1, Math.min(0.9, value));
    setSmoothing(v);
    policyManager?.updatePolicy({ audioSmoothingAlpha: v });
  };

  const handleBurstChange = (value: number) => {
    const v = Math.max(1.0, Math.min(2.5, value));
    setBurst(v);
    policyManager?.updatePolicy({ beatBurstMultiplier: v });
  };

  const handleThinFilmToggle = () => {
    const next = !thinFilmEnabled;
    setThinFilmEnabled(next);
    policyManager?.updatePolicy({ thinFilmEnabled: next });
  };

  const handleThinFilmIntensity = (value: number) => {
    const v01 = Math.max(0, Math.min(1, value / 100));
    setThinFilmIntensity(Math.round(v01 * 100));
    policyManager?.updatePolicy({ thinFilmIntensity: v01 });
  };

  // Get all palettes
  const allPalettes = PaletteDirector.getAllPalettes();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/70 backdrop-blur text-white px-4 py-2 rounded-full hover:bg-black/90 transition-colors"
        aria-label="Toggle liquid light controls"
      >
        🎨 Turn On the Light
      </button>

      {/* Controls panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur text-white p-4 rounded-lg shadow-lg min-w-[280px] max-w-[320px]">
          <h3 className="text-sm font-semibold mb-3">Liquid Light Controls</h3>

          {/* Mode Selector */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MODE_PRESETS) as ModeType[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    selectedMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {mode === 'dance-floor' ? 'Dance Floor' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">
              Intensity: {intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Palette Selector */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">Color Palette</label>
            <select
              value={selectedPalette}
              onChange={(e) => handlePaletteChange(e.target.value)}
              className="w-full bg-white/10 text-white px-2 py-1.5 rounded text-xs border border-white/20"
            >
              {allPalettes.map((palette) => (
                <option key={palette.id} value={palette.id} className="bg-black">
                  {palette.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-white/60 mt-1">
              {PaletteDirector.getPalette(selectedPalette).description}
            </p>
          </div>

          {/* Audio Smoothing */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">
              Audio Smoothing: {smoothing.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={smoothing}
              onChange={(e) => handleSmoothingChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Beat Burst Multiplier */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">
              Beat Burst: {burst.toFixed(1)}x
            </label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={burst}
              onChange={(e) => handleBurstChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Motion Toggle */}
          <div className="mb-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={motionEnabled}
                onChange={handleMotionToggle}
                className="w-4 h-4"
              />
              <span>Motion Enabled</span>
            </label>
          </div>

          {/* Thin-Film Toggle */}
          <div className="mb-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={thinFilmEnabled}
                onChange={handleThinFilmToggle}
                className="w-4 h-4"
              />
              <span>Thin-Film Overlay</span>
            </label>
          </div>

          {/* Thin-Film Intensity */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block">
              Thin-Film Intensity: {thinFilmIntensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={thinFilmIntensity}
              onChange={(e) => handleThinFilmIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Color preview */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="text-xs text-white/60 mb-1">Current Palette:</div>
            <div className="flex gap-1">
              {PaletteDirector.getPalette(selectedPalette).colors.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color }}
                  title={`${PaletteDirector.getPalette(selectedPalette).wavelengths[i]}nm`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
