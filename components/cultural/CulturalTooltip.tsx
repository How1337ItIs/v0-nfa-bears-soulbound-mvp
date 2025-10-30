'use client';

/**
 * CULTURAL CONTEXT TOOLTIP
 *
 * Educational tooltips explaining cultural significance of palettes and songs.
 * Helps users understand the Joshua Light Show and Grateful Dead heritage.
 *
 * Features:
 * - Palette cultural context
 * - Song historical information
 * - Era and tempo details
 * - Links to learn more
 *
 * Usage:
 * ```typescript
 * <CulturalTooltip paletteId="dark-star">
 *   <button>Dark Star</button>
 * </CulturalTooltip>
 * ```
 */

import React, { useState } from 'react';
import { PaletteDirector } from '@/lib/palette';
import { getSongMode } from '@/lib/visual/songModes';

export interface CulturalTooltipProps {
  paletteId?: string;
  songMode?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function CulturalTooltip({
  paletteId,
  songMode,
  children,
  position = 'top',
}: CulturalTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Get cultural context
  const palette = paletteId ? PaletteDirector.getPalette(paletteId) : null;
  const song = songMode ? getSongMode(songMode) : null;

  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (palette || song) && (
        <div
          className={`absolute ${positionStyles[position]} z-50 w-80 pointer-events-none`}
        >
          <div className="bg-black/95 border border-white/20 rounded-lg p-4 shadow-xl backdrop-blur-sm">
            {/* Palette Info */}
            {palette && (
              <>
                <h4 className="text-white font-bold text-sm mb-2">
                  {palette.name}
                </h4>
                <p className="text-white/80 text-xs mb-3">
                  {palette.culturalContext}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-white/50">Energy:</span>
                    <span className="ml-1 text-white/90 capitalize">{palette.energy}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Viscosity:</span>
                    <span className="ml-1 text-white/90">{palette.viscosity.toFixed(2)}</span>
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex gap-1 mb-2">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded"
                      style={{
                        backgroundColor: `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`,
                      }}
                      title={`${palette.wavelengths[i]}nm`}
                    />
                  ))}
                </div>

                {/* Wavelengths */}
                <div className="text-xs text-white/60">
                  Wavelengths: {palette.wavelengths.join('nm, ')}nm
                </div>
              </>
            )}

            {/* Song Mode Info */}
            {song && (
              <>
                <h4 className="text-white font-bold text-sm mb-2">
                  {song.songTitle}
                </h4>
                <p className="text-white/70 text-xs mb-2">
                  {song.artist} • {song.era}
                </p>
                <p className="text-white/80 text-xs mb-3">
                  {song.culturalNotes}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/50">Tempo:</span>
                    <span className="ml-1 text-white/90">{song.typicalTempo} BPM</span>
                  </div>
                  <div>
                    <span className="text-white/50">Duration:</span>
                    <span className="ml-1 text-white/90 capitalize">{song.jamDuration}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Intensity:</span>
                    <span className="ml-1 text-white/90">{(song.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-white/50">Style:</span>
                    <span className="ml-1 text-white/90 capitalize">{song.transitionStyle}</span>
                  </div>
                </div>
              </>
            )}

            {/* Learn more link */}
            <div className="mt-3 pt-2 border-t border-white/10">
              <a
                href={`/learn/${paletteId || songMode}`}
                className="text-xs text-purple-400 hover:text-purple-300"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more about this {palette ? 'palette' : 'song'} →
              </a>
            </div>
          </div>

          {/* Arrow indicator */}
          <div
            className={`absolute w-3 h-3 bg-black/95 border-white/20 transform rotate-45
              ${position === 'top' ? 'bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 border-b border-r' : ''}
              ${position === 'bottom' ? 'top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 border-t border-l' : ''}
              ${position === 'left' ? 'right-0 translate-x-1/2 top-1/2 -translate-y-1/2 border-t border-r' : ''}
              ${position === 'right' ? 'left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 border-b border-l' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Simple cultural info badge (no tooltip, inline display)
 */
export function CulturalBadge({ paletteId }: { paletteId: string }) {
  const palette = PaletteDirector.getPalette(paletteId);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 rounded-full border border-purple-500/30">
      <span className="text-xs text-purple-300">ℹ</span>
      <span className="text-xs text-white/90">{palette.name}</span>
      <span className="text-xs text-white/60">{palette.energy} energy</span>
    </div>
  );
}
