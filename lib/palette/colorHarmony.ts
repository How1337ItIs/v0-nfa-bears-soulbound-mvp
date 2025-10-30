/**
 * COLOR HARMONY GENERATOR
 *
 * Generates harmonious color combinations based on color theory.
 * Uses Oklab for perceptually accurate harmonies.
 *
 * Harmony Types:
 * - Complementary: Opposite on color wheel
 * - Triadic: Three evenly spaced colors
 * - Analogous: Adjacent colors
 * - Split-Complementary: Base + two adjacent to complement
 * - Tetradic: Two complementary pairs
 *
 * Usage:
 * ```typescript
 * const baseColor = [1.0, 0.5, 0.2]; // Orange
 * const harmony = generateComplementary(baseColor);
 * // Returns [orange, blue]
 * ```
 */

import { sRGBToOklab, oklabToSRGB, rotateHue } from './colorSpaces/oklab';

/**
 * Convert RGB to HSL
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
 * Convert HSL to RGB
 */
function hslToRGB(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [r + m, g + m, b + m];
}

/**
 * Generate complementary harmony (2 colors)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @returns Array of 2 colors
 */
export function generateComplementary(
  baseColor: [number, number, number]
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    baseColor,
    hslToRGB((h + 180) % 360, s, l),
  ];
}

/**
 * Generate triadic harmony (3 colors)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @returns Array of 3 colors
 */
export function generateTriadic(
  baseColor: [number, number, number]
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    baseColor,
    hslToRGB((h + 120) % 360, s, l),
    hslToRGB((h + 240) % 360, s, l),
  ];
}

/**
 * Generate analogous harmony (3 colors)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @param angle - Angle between colors (default: 30°)
 * @returns Array of 3 colors
 */
export function generateAnalogous(
  baseColor: [number, number, number],
  angle: number = 30
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    hslToRGB((h - angle + 360) % 360, s, l),
    baseColor,
    hslToRGB((h + angle) % 360, s, l),
  ];
}

/**
 * Generate split-complementary harmony (3 colors)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @returns Array of 3 colors
 */
export function generateSplitComplementary(
  baseColor: [number, number, number]
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    baseColor,
    hslToRGB((h + 150) % 360, s, l),
    hslToRGB((h + 210) % 360, s, l),
  ];
}

/**
 * Generate tetradic harmony (4 colors)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @returns Array of 4 colors
 */
export function generateTetradic(
  baseColor: [number, number, number]
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    baseColor,
    hslToRGB((h + 90) % 360, s, l),
    hslToRGB((h + 180) % 360, s, l),
    hslToRGB((h + 270) % 360, s, l),
  ];
}

/**
 * Generate monochromatic harmony (4 colors with varying lightness)
 * @param baseColor - Base color [r, g, b] in sRGB
 * @returns Array of 4 colors
 */
export function generateMonochromatic(
  baseColor: [number, number, number]
): [number, number, number][] {
  const [h, s, l] = rgbToHSL(...baseColor);

  return [
    hslToRGB(h, s, Math.max(0, l - 0.2)),
    hslToRGB(h, s, Math.max(0, l - 0.1)),
    baseColor,
    hslToRGB(h, s, Math.min(1, l + 0.1)),
  ];
}

/**
 * Generate palette from harmony type
 * @param baseColor - Base color
 * @param harmonyType - Type of harmony
 * @returns Array of harmonious colors
 */
export function generateHarmony(
  baseColor: [number, number, number],
  harmonyType: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic' | 'monochromatic'
): [number, number, number][] {
  switch (harmonyType) {
    case 'complementary':
      return generateComplementary(baseColor);
    case 'triadic':
      return generateTriadic(baseColor);
    case 'analogous':
      return generateAnalogous(baseColor);
    case 'split-complementary':
      return generateSplitComplementary(baseColor);
    case 'tetradic':
      return generateTetradic(baseColor);
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    default:
      return [baseColor];
  }
}

/**
 * Generate palette with Oklab mixing (smoother than RGB)
 * @param baseColor - Starting color
 * @param harmonyType - Harmony type
 * @returns Palette with 4 colors
 */
export function generatePaletteWithOklab(
  baseColor: [number, number, number],
  harmonyType: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic'
): [number, number, number][] {
  const harmony = generateHarmony(baseColor, harmonyType);

  // Ensure we have 4 colors (fill with variations if needed)
  while (harmony.length < 4) {
    const lastColor = harmony[harmony.length - 1];
    const [L, a, b] = sRGBToOklab(...lastColor);
    const variation = oklabToSRGB(L * 0.9, a * 1.1, b * 1.1);
    harmony.push(variation);
  }

  return harmony.slice(0, 4);
}
