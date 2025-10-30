/**
 * @file AudioPresetSelector.tsx
 * @description Audio preset selection component
 */

'use client';

import React from 'react';
import { AUDIO_PRESETS, getAvailablePresets } from '@/lib/audio';
import type { AudioPreset } from '@/lib/audio';

interface AudioPresetSelectorProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
  className?: string;
}

export function AudioPresetSelector({
  currentPreset,
  onPresetChange,
  className = '',
}: AudioPresetSelectorProps) {
  const availablePresets = getAvailablePresets();

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white/90">
        Audio Preset
      </label>
      
      <select
        value={currentPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {availablePresets.map((presetName) => {
          const preset = AUDIO_PRESETS[presetName];
          return (
            <option key={presetName} value={presetName}>
              {preset.name}
            </option>
          );
        })}
      </select>

      {/* Preset description */}
      {currentPreset && AUDIO_PRESETS[currentPreset] && (
        <div className="text-xs text-white/70">
          {AUDIO_PRESETS[currentPreset].description}
        </div>
      )}

      {/* Preset preview */}
      {currentPreset && AUDIO_PRESETS[currentPreset] && (
        <div className="flex items-center space-x-2 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: AUDIO_PRESETS[currentPreset].color }}
          />
          <span className="text-white/60">
            Sensitivity: {AUDIO_PRESETS[currentPreset].beatDetectorConfig.thresholdMultiplier}x
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact preset selector for mobile
 */
export function CompactPresetSelector({
  currentPreset,
  onPresetChange,
  className = '',
}: AudioPresetSelectorProps) {
  const availablePresets = getAvailablePresets();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs text-white/70">Preset:</span>
      <select
        value={currentPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        className="px-2 py-1 bg-black/50 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
      >
        {availablePresets.map((presetName) => (
          <option key={presetName} value={presetName}>
            {AUDIO_PRESETS[presetName].name}
          </option>
        ))}
      </select>
    </div>
  );
}
