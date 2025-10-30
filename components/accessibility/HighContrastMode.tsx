'use client';

/**
 * HIGH CONTRAST MODE
 *
 * Provides high-contrast visual alternative for users with low vision.
 * Increases color separation and edge definition.
 *
 * Features:
 * - Automatic detection of system preference
 * - Manual toggle
 * - High-contrast palette variants
 * - Increased edge definition
 *
 * Usage:
 * ```typescript
 * <HighContrastMode enabled={true}>
 *   <LiquidLightBackground />
 * </HighContrastMode>
 * ```
 */

import React, { useEffect, useState } from 'react';
import { PaletteDirector } from '@/lib/palette';

export interface HighContrastModeProps {
  enabled?: boolean; // Manual override
  children: React.ReactNode;
}

export default function HighContrastMode({
  enabled,
  children,
}: HighContrastModeProps) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Detect system preference
  useEffect(() => {
    if (enabled !== undefined) {
      setIsHighContrast(enabled);
      return;
    }

    // Check for forced-colors mode (Windows High Contrast)
    const forcedColors = window.matchMedia('(forced-colors: active)').matches;

    // Check for prefers-contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

    setIsHighContrast(forcedColors || prefersHighContrast);

    // Listen for changes
    const forcedColorsMedia = window.matchMedia('(forced-colors: active)');
    const contrastMedia = window.matchMedia('(prefers-contrast: more)');

    const handler = () => {
      setIsHighContrast(forcedColorsMedia.matches || contrastMedia.matches);
    };

    forcedColorsMedia.addEventListener('change', handler);
    contrastMedia.addEventListener('change', handler);

    return () => {
      forcedColorsMedia.removeEventListener('change', handler);
      contrastMedia.removeEventListener('change', handler);
    };
  }, [enabled]);

  // Apply high contrast mode
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [isHighContrast]);

  return (
    <>
      {children}

      {/* High contrast styles */}
      {isHighContrast && (
        <style jsx global>{`
          .high-contrast-mode {
            /* Increase color separation */
            --color-boost: 1.3;

            /* Add borders for definition */
            --border-width: 2px;
            --border-color: #ffffff;
          }

          .high-contrast-mode button,
          .high-contrast-mode input,
          .high-contrast-mode select {
            border: 2px solid currentColor !important;
            font-weight: 600 !important;
          }

          .high-contrast-mode .liquid-light-controls {
            background: #000000 !important;
            border: 3px solid #ffffff !important;
          }

          /* Disable transparency */
          .high-contrast-mode * {
            backdrop-filter: none !important;
          }

          /* Higher contrast text */
          .high-contrast-mode {
            color: #ffffff !important;
            background: #000000 !important;
          }
        `}</style>
      )}
    </>
  );
}

/**
 * Get high-contrast version of palette
 * Increases saturation and lightness separation
 * @param paletteId - Original palette ID
 * @returns High-contrast palette
 */
export function getHighContrastPalette(paletteId: string): any {
  const palette = PaletteDirector.getPalette(paletteId);

  // Increase saturation and separate lightness
  const highContrastColors = palette.colors.map((color, i) => {
    const [r, g, b] = color;

    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const delta = max - min;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Boost saturation
    const newS = Math.min(1, s * 1.3);

    // Separate lightness (alternate light/dark)
    const newL = i % 2 === 0 ? Math.min(0.9, l + 0.2) : Math.max(0.2, l - 0.2);

    // Convert back to RGB
    const c = (1 - Math.abs(2 * newL - 1)) * newS;
    const x = c * (1 - Math.abs((((r > g ? (r > b ? 0 : 4) : (g > b ? 2 : 4)) / 2) % 2) - 1));
    const m = newL - c / 2;

    return [
      Math.min(1, (c + m) * 1.2),
      Math.min(1, (x + m) * 1.2),
      Math.min(1, m * 1.2),
    ];
  });

  return {
    ...palette,
    id: `${palette.id}-high-contrast`,
    name: `${palette.name} (High Contrast)`,
    colors: highContrastColors,
  };
}

/**
 * Check if high contrast mode is active
 * @returns Whether high contrast mode is active
 */
export function isHighContrastActive(): boolean {
  const forcedColors = window.matchMedia('(forced-colors: active)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

  return forcedColors || prefersHighContrast;
}
