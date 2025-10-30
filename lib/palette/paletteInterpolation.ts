/**
 * PALETTE INTERPOLATION
 *
 * Smooth transitions between color palettes using perceptually uniform blending.
 * Uses Oklab color space for natural-looking interpolation.
 *
 * Features:
 * - Linear RGB interpolation (fast, less accurate)
 * - Oklab interpolation (slower, perceptually uniform)
 * - Easing functions for smooth transitions
 * - Palette animation support
 *
 * Usage:
 * ```typescript
 * const interpolated = interpolatePalettesOklab(
 *   palette1,
 *   palette2,
 *   0.5 // 50% mix
 * );
 * ```
 */

import { sRGBToOklab, oklabToSRGB, mixOklab } from './colorSpaces/oklab';
import type { Palette } from './PaletteDirector';

/**
 * Interpolate palettes using linear RGB
 * Fast but may produce muddy intermediate colors
 *
 * @param p1 - First palette
 * @param p2 - Second palette
 * @param t - Interpolation amount (0-1)
 * @returns Interpolated palette
 */
export function interpolatePalettesLinear(
  p1: Palette,
  p2: Palette,
  t: number
): Palette {
  const colors = p1.colors.map((c1, i) => {
    const c2 = p2.colors[i] || c1; // Fallback if lengths differ

    return [
      c1[0] * (1 - t) + c2[0] * t,
      c1[1] * (1 - t) + c2[1] * t,
      c1[2] * (1 - t) + c2[2] * t,
    ] as [number, number, number];
  });

  const wavelengths = p1.wavelengths.map((w1, i) => {
    const w2 = p2.wavelengths[i] || w1;
    return w1 * (1 - t) + w2 * t;
  });

  return {
    id: `${p1.id}-to-${p2.id}-${t.toFixed(2)}`,
    name: `${p1.name} → ${p2.name}`,
    colors,
    wavelengths,
    culturalContext: `Interpolation between ${p1.name} and ${p2.name}`,
    energy: t < 0.5 ? p1.energy : p2.energy,
    viscosity: p1.viscosity * (1 - t) + p2.viscosity * t,
  };
}

/**
 * Interpolate palettes using Oklab (perceptually uniform)
 * Slower but produces natural-looking intermediate colors
 *
 * @param p1 - First palette
 * @param p2 - Second palette
 * @param t - Interpolation amount (0-1)
 * @returns Interpolated palette
 */
export function interpolatePalettesOklab(
  p1: Palette,
  p2: Palette,
  t: number
): Palette {
  const colors = p1.colors.map((c1, i) => {
    const c2 = p2.colors[i] || c1;

    return mixOklab(c1, c2, t);
  });

  const wavelengths = p1.wavelengths.map((w1, i) => {
    const w2 = p2.wavelengths[i] || w1;
    return w1 * (1 - t) + w2 * t;
  });

  return {
    id: `${p1.id}-to-${p2.id}-oklab-${t.toFixed(2)}`,
    name: `${p1.name} → ${p2.name}`,
    colors,
    wavelengths,
    culturalContext: `Perceptual interpolation between ${p1.name} and ${p2.name}`,
    energy: t < 0.5 ? p1.energy : p2.energy,
    viscosity: p1.viscosity * (1 - t) + p2.viscosity * t,
  };
}

/**
 * Easing functions for smooth transitions
 */
export const Easing = {
  linear: (t: number) => t,

  easeInOut: (t: number) => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2,

  easeInOutCubic: (t: number) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2,

  smoothstep: (t: number) => t * t * (3 - 2 * t),

  smootherstep: (t: number) => t * t * t * (t * (6 * t - 15) + 10),
};

/**
 * Interpolate palettes with easing
 * @param p1 - First palette
 * @param p2 - Second palette
 * @param t - Progress (0-1)
 * @param easing - Easing function
 * @param useOklab - Use Oklab interpolation (default: true)
 * @returns Interpolated palette
 */
export function interpolatePalettesWithEasing(
  p1: Palette,
  p2: Palette,
  t: number,
  easing: (t: number) => number = Easing.smoothstep,
  useOklab: boolean = true
): Palette {
  const easedT = easing(Math.max(0, Math.min(1, t)));

  return useOklab
    ? interpolatePalettesOklab(p1, p2, easedT)
    : interpolatePalettesLinear(p1, p2, easedT);
}

/**
 * Palette Animator - Manages smooth palette transitions
 */
export class PaletteAnimator {
  private currentPalette: Palette;
  private targetPalette: Palette | null = null;
  private progress = 0;
  private duration = 2000; // ms
  private startTime = 0;
  private easing: (t: number) => number = Easing.smootherstep;

  constructor(initialPalette: Palette) {
    this.currentPalette = initialPalette;
  }

  /**
   * Start transition to new palette
   * @param newPalette - Target palette
   * @param duration - Transition duration (ms)
   * @param easing - Easing function
   */
  transitionTo(
    newPalette: Palette,
    duration: number = 2000,
    easing: (t: number) => number = Easing.smootherstep
  ): void {
    this.targetPalette = newPalette;
    this.progress = 0;
    this.duration = duration;
    this.startTime = performance.now();
    this.easing = easing;
  }

  /**
   * Update animation (call each frame)
   * @returns Current palette state
   */
  update(): Palette {
    if (!this.targetPalette) {
      return this.currentPalette;
    }

    const elapsed = performance.now() - this.startTime;
    this.progress = Math.min(1, elapsed / this.duration);

    if (this.progress >= 1) {
      // Transition complete
      this.currentPalette = this.targetPalette;
      this.targetPalette = null;
      this.progress = 0;
      return this.currentPalette;
    }

    // Return interpolated palette
    return interpolatePalettesWithEasing(
      this.currentPalette,
      this.targetPalette,
      this.progress,
      this.easing,
      true // Use Oklab
    );
  }

  /**
   * Check if currently animating
   * @returns Whether animation is in progress
   */
  isAnimating(): boolean {
    return this.targetPalette !== null;
  }

  /**
   * Get current palette
   * @returns Current palette
   */
  getCurrentPalette(): Palette {
    return this.currentPalette;
  }

  /**
   * Cancel current animation
   */
  cancel(): void {
    this.targetPalette = null;
    this.progress = 0;
  }

  /**
   * Skip to end of animation
   */
  skipToEnd(): void {
    if (this.targetPalette) {
      this.currentPalette = this.targetPalette;
      this.targetPalette = null;
      this.progress = 0;
    }
  }
}

/**
 * Create palette animator
 * @param initialPalette - Starting palette
 * @returns PaletteAnimator instance
 */
export function createPaletteAnimator(initialPalette: Palette): PaletteAnimator {
  return new PaletteAnimator(initialPalette);
}
