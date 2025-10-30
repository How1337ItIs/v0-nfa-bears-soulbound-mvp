'use client';

/**
 * SONG MODE SELECTOR
 *
 * User interface for selecting song-specific visual modes.
 * Provides cultural context and easy switching between Dead songs.
 *
 * Features:
 * - Dropdown selector for all songs
 * - Song metadata display (tempo, era, cultural notes)
 * - Auto-recommendation based on detected tempo
 * - Search by artist
 *
 * Usage:
 * ```typescript
 * <SongModeSelector
 *   currentMode="dark-star"
 *   onModeChange={(mode) => applyVisualMode(mode)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { SONG_MODES, getSongMode, getAllSongModes } from '@/lib/visual/songModes';

export interface SongModeSelectorProps {
  currentMode?: string;
  onModeChange?: (modeKey: string) => void;
  showMetadata?: boolean;
  compact?: boolean;
}

export default function SongModeSelector({
  currentMode = 'ambient',
  onModeChange,
  showMetadata = true,
  compact = false,
}: SongModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState(currentMode);

  const handleChange = (modeKey: string) => {
    setSelectedMode(modeKey);
    if (onModeChange) {
      onModeChange(modeKey);
    }
  };

  const currentSongMode = getSongMode(selectedMode);
  const allModes = getAllSongModes();

  if (!currentSongMode) return null;

  return (
    <div className="song-mode-selector">
      {/* Mode Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Song Visual Mode
        </label>
        <select
          value={selectedMode}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-black/30 text-white border-white/20"
        >
          <optgroup label="Grateful Dead">
            <option value="dark-star">Dark Star ⭐</option>
            <option value="fire-on-the-mountain">Fire on the Mountain 🔥</option>
            <option value="china-cat-sunflower">China Cat Sunflower 🌻</option>
            <option value="terrapin-station">Terrapin Station 🐢</option>
            <option value="scarlet-begonias">Scarlet Begonias 🌺</option>
          </optgroup>
          <optgroup label="Generic">
            <option value="ambient">Ambient 🌙</option>
            <option value="dance-floor">Dance Floor 💃</option>
          </optgroup>
        </select>
      </div>

      {/* Metadata Display */}
      {showMetadata && !compact && (
        <div className="song-metadata space-y-2 text-sm">
          <div className="bg-black/40 p-3 rounded-lg border border-white/10">
            <h4 className="font-bold text-white/90 mb-1">
              {currentSongMode.songTitle}
            </h4>
            <p className="text-white/70 text-xs mb-2">
              {currentSongMode.artist} • {currentSongMode.era}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-white/50">Tempo:</span>
                <span className="ml-1 text-white/90">{currentSongMode.typicalTempo} BPM</span>
              </div>
              <div>
                <span className="text-white/50">Duration:</span>
                <span className="ml-1 text-white/90 capitalize">{currentSongMode.jamDuration}</span>
              </div>
              <div>
                <span className="text-white/50">Intensity:</span>
                <span className="ml-1 text-white/90">{(currentSongMode.intensity * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-white/50">Flow:</span>
                <span className="ml-1 text-white/90 capitalize">{currentSongMode.transitionStyle}</span>
              </div>
            </div>

            <p className="text-white/60 text-xs italic">
              {currentSongMode.culturalNotes}
            </p>
          </div>

          {/* Active Effects */}
          <div className="text-xs">
            <span className="text-white/50">Active Effects:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(currentSongMode.effects).map(([effect, enabled]) =>
                enabled ? (
                  <span
                    key={effect}
                    className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded"
                  >
                    {effect}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compact View */}
      {compact && (
        <div className="text-xs text-white/60">
          {currentSongMode.songTitle} ({currentSongMode.typicalTempo} BPM)
        </div>
      )}
    </div>
  );
}

/**
 * Song Mode Quick Buttons - Alternative compact UI
 */
export function SongModeQuickButtons({ onModeChange }: { onModeChange?: (mode: string) => void }) {
  return (
    <div className="song-mode-buttons flex flex-wrap gap-2">
      <button onClick={() => onModeChange?.('dark-star')} className="px-3 py-1 bg-purple-600/40 hover:bg-purple-600/60 rounded text-xs">
        ⭐ Dark Star
      </button>
      <button onClick={() => onModeChange?.('fire-on-the-mountain')} className="px-3 py-1 bg-orange-600/40 hover:bg-orange-600/60 rounded text-xs">
        🔥 Fire
      </button>
      <button onClick={() => onModeChange?.('china-cat-sunflower')} className="px-3 py-1 bg-yellow-600/40 hover:bg-yellow-600/60 rounded text-xs">
        🌻 China Cat
      </button>
      <button onClick={() => onModeChange?.('terrapin-station')} className="px-3 py-1 bg-green-600/40 hover:bg-green-600/60 rounded text-xs">
        🐢 Terrapin
      </button>
      <button onClick={() => onModeChange?.('scarlet-begonias')} className="px-3 py-1 bg-red-600/40 hover:bg-red-600/60 rounded text-xs">
        🌺 Scarlet
      </button>
    </div>
  );
}
