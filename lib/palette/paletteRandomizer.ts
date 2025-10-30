/**
 * PALETTE RANDOMIZER
 *
 * Generates random color palettes with constraints to ensure aesthetic quality.
 *
 * Features:
 * - Constrained randomization (saturation, lightness, harmony)
 * - Multiple generation strategies
 * - Aesthetic validation
 * - Seeded generation (reproducible)
 *
 * Usage:
 * ```typescript
 * const palette = generateRandomPalette({
 *   minSaturation: 0.5,
 *   maxSaturation: 1.0,
 *   harmonyType: 'triadic',
 * });
 * ```
 */

import type { Palette } from './PaletteDirector';
import { generateHarmony } from './colorHarmony';
import { wavelengthToRGB } from './PaletteDirector';

/**
 * Random number generator with seed support
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  /**
   * Generate random number (0-1)
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate random number in range
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Palette generation constraints
 */
export interface PaletteConstraints {
  minSaturation?: number; // 0-1, default: 0.5
  maxSaturation?: number; // 0-1, default: 1.0
  minLightness?: number; // 0-1, default: 0.3
  maxLightness?: number; // 0-1, default: 0.8
  harmonyType?: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic' | 'random';
  numColors?: number; // 2-8, default: 4
  seed?: number; // For reproducible generation
}

/**
 * HSL to RGB conversion
 */
function hslToRGB(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [r + m, g + m, b + m];
}

/**
 * Estimate wavelength from RGB color
 */
function estimateWavelength(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;

  // Rough wavelength estimation
  if (r > g && r > b) {
    // Red-ish
    return 620 + (1 - r) * 30; // 620-650nm
  } else if (g > r && g > b) {
    // Green-ish
    return 520 + (1 - g) * 60; // 520-580nm
  } else if (b > r && b > g) {
    // Blue-ish
    return 450 + (1 - b) * 35; // 450-485nm
  } else {
    // Mixed
    return 550; // Yellow-green
  }
}

/**
 * Generate random palette with constraints
 * @param constraints - Generation constraints
 * @returns Generated palette
 */
export function generateRandomPalette(constraints: PaletteConstraints = {}): Palette {
  const {
    minSaturation = 0.5,
    maxSaturation = 1.0,
    minLightness = 0.3,
    maxLightness = 0.8,
    harmonyType = 'triadic',
    numColors = 4,
    seed,
  } = constraints;

  const rng = new SeededRandom(seed);

  // Generate base hue
  const baseHue = rng.range(0, 360);
  const baseSaturation = rng.range(minSaturation, maxSaturation);
  const baseLightness = rng.range(minLightness, maxLightness);

  const baseColor = hslToRGB(baseHue, baseSaturation, baseLightness);

  // Generate harmony
  let colors: [number, number, number][];

  if (harmonyType === 'random') {
    // Fully random colors within constraints
    colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = rng.range(0, 360);
      const sat = rng.range(minSaturation, maxSaturation);
      const light = rng.range(minLightness, maxLightness);
      colors.push(hslToRGB(hue, sat, light));
    }
  } else {
    // Use harmony generator
    colors = generateHarmony(baseColor, harmonyType);

    // Vary saturation and lightness slightly
    colors = colors.map(color => {
      const [r, g, b] = color;

      // Convert to HSL, vary S and L slightly
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
      const h = max === r
        ? 60 * (((g - b) / (max - min)) % 6)
        : max === g
        ? 60 * ((b - r) / (max - min) + 2)
        : 60 * ((r - g) / (max - min) + 4);

      // Vary S and L within constraints
      const newS = Math.max(minSaturation, Math.min(maxSaturation, s + rng.range(-0.1, 0.1)));
      const newL = Math.max(minLightness, Math.min(maxLightness, l + rng.range(-0.1, 0.1)));

      return hslToRGB(h, newS, newL);
    });
  }

  // Ensure we have exactly numColors
  while (colors.length < numColors) {
    const hue = rng.range(0, 360);
    const sat = rng.range(minSaturation, maxSaturation);
    const light = rng.range(minLightness, maxLightness);
    colors.push(hslToRGB(hue, sat, light));
  }

  colors = colors.slice(0, numColors);

  // Estimate wavelengths
  const wavelengths = colors.map(estimateWavelength);

  // Generate ID
  const id = seed ? `random-${seed}` : `random-${Date.now()}`;

  return {
    id,
    name: `Random Palette ${harmonyType}`,
    colors,
    wavelengths,
    culturalContext: `Randomly generated ${harmonyType} harmony`,
    energy: 'medium',
    viscosity: 0.4,
  };
}

/**
 * Generate multiple random palettes and pick best
 * @param count - Number of candidates to generate
 * @param constraints - Generation constraints
 * @param validator - Optional validation function
 * @returns Best palette
 */
export function generateBestRandomPalette(
  count: number = 10,
  constraints: PaletteConstraints = {},
  validator?: (palette: Palette) => number // Returns score 0-1
): Palette {
  const candidates = [];

  for (let i = 0; i < count; i++) {
    const palette = generateRandomPalette({
      ...constraints,
      seed: constraints.seed ? constraints.seed + i : undefined,
    });

    const score = validator ? validator(palette) : Math.random();

    candidates.push({ palette, score });
  }

  // Sort by score and return best
  candidates.sort((a, b) => b.score - a.score);

  return candidates[0].palette;
}

/**
 * Generate palette from seed (reproducible)
 * @param seed - Seed number
 * @param constraints - Optional constraints
 * @returns Palette
 */
export function generatePaletteFromSeed(seed: number, constraints?: PaletteConstraints): Palette {
  return generateRandomPalette({ ...constraints, seed });
}
