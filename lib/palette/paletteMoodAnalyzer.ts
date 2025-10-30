/**
 * PALETTE MOOD ANALYZER
 *
 * Analyzes emotional and aesthetic character of color palettes.
 * Helps users discover palettes matching desired mood.
 *
 * Metrics:
 * - Energy: How vibrant/active (based on saturation)
 * - Warmth: Cool to warm spectrum (based on hue)
 * - Brightness: Light to dark (based on lightness)
 * - Contrast: Color separation
 * - Mood: Descriptive emotional tag
 *
 * Usage:
 * ```typescript
 * const analysis = analyzePaletteMood(palette);
 * console.log(analysis.mood); // "Energetic & Warm"
 * console.log(analysis.energy); // 0.85
 * ```
 */

import type { Palette } from './PaletteDirector';

/**
 * RGB to HSL conversion
 */
function rgbToHSL(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s, l];
}

/**
 * Calculate relative luminance (perceived brightness)
 */
function calculateLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const lum1 = calculateLuminance(...rgb1);
  const lum2 = calculateLuminance(...rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface PaletteMoodAnalysis {
  energy: number; // 0-1 (low to high)
  warmth: number; // -1 to 1 (cool to warm)
  brightness: number; // 0-1 (dark to light)
  contrast: number; // 0-1 (low to high)
  saturation: number; // 0-1 (muted to vibrant)
  mood: string; // Descriptive tag
  tags: string[]; // Additional descriptive tags
}

/**
 * Analyze palette mood and characteristics
 * @param palette - Palette to analyze
 * @returns Mood analysis
 */
export function analyzePaletteMood(palette: Palette): PaletteMoodAnalysis {
  const hslValues = palette.colors.map(c => rgbToHSL(...c));

  // Calculate averages
  const avgHue = hslValues.reduce((sum, [h]) => sum + h, 0) / hslValues.length;
  const avgSaturation = hslValues.reduce((sum, [, s]) => sum + s, 0) / hslValues.length;
  const avgLightness = hslValues.reduce((sum, [,, l]) => sum + l, 0) / hslValues.length;

  // Energy: Based on saturation (vibrant = high energy)
  const energy = avgSaturation;

  // Warmth: Based on hue
  // Red/Orange (0-60, 300-360) = warm
  // Blue/Cyan (180-240) = cool
  let warmth = 0;
  if (avgHue < 60 || avgHue > 300) {
    warmth = 0.5; // Warm
  } else if (avgHue >= 180 && avgHue <= 240) {
    warmth = -0.5; // Cool
  } else {
    warmth = 0; // Neutral
  }

  // Brightness: Based on lightness
  const brightness = avgLightness;

  // Contrast: Average contrast between all color pairs
  const contrasts: number[] = [];
  for (let i = 0; i < palette.colors.length; i++) {
    for (let j = i + 1; j < palette.colors.length; j++) {
      const ratio = calculateContrastRatio(palette.colors[i], palette.colors[j]);
      contrasts.push(ratio);
    }
  }

  const avgContrast = contrasts.reduce((a, b) => a + b, 0) / contrasts.length;
  const normalizedContrast = Math.min(1, avgContrast / 21); // Normalize to 0-1

  // Determine mood
  let mood = '';
  const tags: string[] = [];

  // Energy tags
  if (energy > 0.7) {
    tags.push('vibrant');
    tags.push('energetic');
  } else if (energy < 0.3) {
    tags.push('muted');
    tags.push('calm');
  }

  // Warmth tags
  if (warmth > 0.3) {
    tags.push('warm');
  } else if (warmth < -0.3) {
    tags.push('cool');
  }

  // Brightness tags
  if (brightness > 0.7) {
    tags.push('bright');
    tags.push('light');
  } else if (brightness < 0.3) {
    tags.push('dark');
    tags.push('moody');
  }

  // Contrast tags
  if (normalizedContrast > 0.6) {
    tags.push('high-contrast');
    tags.push('bold');
  } else if (normalizedContrast < 0.3) {
    tags.push('low-contrast');
    tags.push('subtle');
  }

  // Determine primary mood
  if (energy > 0.7 && warmth > 0) {
    mood = 'Energetic & Warm';
  } else if (energy > 0.7 && warmth < 0) {
    mood = 'Energetic & Cool';
  } else if (energy < 0.3 && warmth > 0) {
    mood = 'Calm & Warm';
  } else if (energy < 0.3 && warmth < 0) {
    mood = 'Calm & Cool';
  } else if (brightness > 0.7) {
    mood = 'Bright & Balanced';
  } else if (brightness < 0.3) {
    mood = 'Dark & Mysterious';
  } else {
    mood = 'Balanced & Neutral';
  }

  return {
    energy,
    warmth,
    brightness,
    contrast: normalizedContrast,
    saturation: avgSaturation,
    mood,
    tags,
  };
}

/**
 * Find palettes matching mood criteria
 * @param palettes - Array of palettes to search
 * @param criteria - Mood criteria
 * @returns Matching palettes sorted by relevance
 */
export function findPalettesByMood(
  palettes: Palette[],
  criteria: {
    minEnergy?: number;
    maxEnergy?: number;
    minWarmth?: number;
    maxWarmth?: number;
    minBrightness?: number;
    maxBrightness?: number;
    tags?: string[];
  }
): Palette[] {
  return palettes
    .map(palette => {
      const analysis = analyzePaletteMood(palette);
      let score = 0;

      // Energy matching
      if (criteria.minEnergy !== undefined && analysis.energy >= criteria.minEnergy) {
        score += 1;
      }
      if (criteria.maxEnergy !== undefined && analysis.energy <= criteria.maxEnergy) {
        score += 1;
      }

      // Warmth matching
      if (criteria.minWarmth !== undefined && analysis.warmth >= criteria.minWarmth) {
        score += 1;
      }
      if (criteria.maxWarmth !== undefined && analysis.warmth <= criteria.maxWarmth) {
        score += 1;
      }

      // Brightness matching
      if (criteria.minBrightness !== undefined && analysis.brightness >= criteria.minBrightness) {
        score += 1;
      }
      if (criteria.maxBrightness !== undefined && analysis.brightness <= criteria.maxBrightness) {
        score += 1;
      }

      // Tag matching
      if (criteria.tags) {
        const matchingTags = criteria.tags.filter(tag => analysis.tags.includes(tag));
        score += matchingTags.length;
      }

      return { palette, score, analysis };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.palette);
}

/**
 * Get mood description for display
 * @param analysis - Mood analysis
 * @returns Human-readable description
 */
export function getMoodDescription(analysis: PaletteMoodAnalysis): string {
  const parts = [];

  if (analysis.energy > 0.7) parts.push('high-energy');
  else if (analysis.energy < 0.3) parts.push('low-energy');

  if (analysis.warmth > 0.3) parts.push('warm-toned');
  else if (analysis.warmth < -0.3) parts.push('cool-toned');

  if (analysis.brightness > 0.7) parts.push('bright');
  else if (analysis.brightness < 0.3) parts.push('dark');

  if (analysis.contrast > 0.6) parts.push('high-contrast');

  return parts.join(', ') || 'balanced';
}
