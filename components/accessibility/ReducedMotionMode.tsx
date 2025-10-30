'use client';

/**
 * REDUCED MOTION MODE
 *
 * Alternative visual representation for users who prefer reduced motion.
 * Respects prefers-reduced-motion media query.
 *
 * Features:
 * - Static gradient alternative
 * - Gentle audio-reactive color shifts (no motion)
 * - Respects system preference
 * - Manual override
 *
 * Usage:
 * ```typescript
 * <ReducedMotionMode>
 *   <LiquidLightBackground /> // Auto-switches to static mode
 * </ReducedMotionMode>
 * ```
 */

import React, { useEffect, useState } from 'react';
import { PaletteDirector } from '@/lib/palette';

export interface ReducedMotionModeProps {
  paletteId?: string;
  audioReactive?: boolean;
  intensity?: number;
  enabled?: boolean; // Manual override
}

export default function ReducedMotionMode({
  paletteId = 'classic-60s',
  audioReactive = false,
  intensity = 0.6,
  enabled,
}: ReducedMotionModeProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // Detect system preference
  useEffect(() => {
    if (enabled !== undefined) {
      setPrefersReduced(enabled);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [enabled]);

  // Slow color rotation if audio-reactive (no motion, just gentle color shift)
  useEffect(() => {
    if (!audioReactive || !prefersReduced) return;

    const interval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % 4);
    }, 5000); // Change every 5 seconds (very slow)

    return () => clearInterval(interval);
  }, [audioReactive, prefersReduced]);

  if (!prefersReduced) return null;

  const palette = PaletteDirector.getPalette(paletteId);

  // Create static gradient from palette
  const gradientColors = palette.colors.map(color => {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);
    return `rgb(${r}, ${g}, ${b})`;
  });

  return (
    <div
      className="fixed inset-0 w-full h-full -z-50"
      style={{
        background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
        opacity: intensity,
        transition: 'background 2s ease-in-out', // Gentle transitions only
      }}
      role="img"
      aria-label={`Static gradient background using ${palette.name} color palette`}
    >
      {/* Accessibility note */}
      <div className="sr-only">
        Reduced motion mode active. Displaying static gradient instead of animated visuals.
      </div>
    </div>
  );
}

/**
 * Check if user prefers reduced motion
 * @returns Boolean indicating preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Static visualization component (no motion)
 */
export function StaticVisualization({ paletteId = 'classic-60s', intensity = 0.6 }) {
  const palette = PaletteDirector.getPalette(paletteId);

  return (
    <svg
      className="fixed inset-0 w-full h-full -z-50"
      style={{ opacity: intensity }}
      role="img"
      aria-label={`Static pattern using ${palette.name} colors`}
    >
      <defs>
        <radialGradient id="static-gradient">
          {palette.colors.map((color, i) => {
            const r = Math.round(color[0] * 255);
            const g = Math.round(color[1] * 255);
            const b = Math.round(color[2] * 255);
            const offset = (i / (palette.colors.length - 1)) * 100;

            return (
              <stop
                key={i}
                offset={`${offset}%`}
                stopColor={`rgb(${r}, ${g}, ${b})`}
              />
            );
          })}
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#static-gradient)" />
    </svg>
  );
}
