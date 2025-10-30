/**
 * COLOR BLINDNESS SIMULATION
 *
 * Simulates how palettes appear to people with color vision deficiencies.
 * Helps ensure palettes are distinguishable for all users.
 *
 * Types:
 * - Protanopia (red blindness) - ~1% of males
 * - Deuteranopia (green blindness) - ~1% of males
 * - Tritanopia (blue-yellow blindness) - ~0.001% of population
 * - Achromatopsia (total color blindness) - rare
 *
 * Usage:
 * ```typescript
 * const simulated = simulateDeuteranopia([1.0, 0.5, 0.2]);
 * // Returns how this color looks to someone with deuteranopia
 *
 * const isPaletteSafe = validatePaletteForColorBlind(palette);
 * ```
 */

import type { Palette } from './PaletteDirector';

/**
 * Simulate Protanopia (red color blindness)
 * @param rgb - Color [r, g, b] (0-1)
 * @returns Simulated color [r, g, b]
 */
export function simulateProtanopia(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;

  // Protanopia transformation matrix
  return [
    0.567 * r + 0.433 * g,
    0.558 * r + 0.442 * g,
    0.242 * b + 0.758 * b,
  ];
}

/**
 * Simulate Deuteranopia (green color blindness)
 * @param rgb - Color [r, g, b] (0-1)
 * @returns Simulated color [r, g, b]
 */
export function simulateDeuteranopia(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;

  // Deuteranopia transformation matrix
  return [
    0.625 * r + 0.375 * g,
    0.7 * r + 0.3 * g,
    0.3 * r + 0.7 * b,
  ];
}

/**
 * Simulate Tritanopia (blue-yellow color blindness)
 * @param rgb - Color [r, g, b] (0-1)
 * @returns Simulated color [r, g, b]
 */
export function simulateTritanopia(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;

  // Tritanopia transformation matrix
  return [
    0.95 * r + 0.05 * g,
    0.433 * r + 0.567 * g,
    0.475 * r + 0.525 * b,
  ];
}

/**
 * Simulate Achromatopsia (total color blindness / monochromacy)
 * @param rgb - Color [r, g, b] (0-1)
 * @returns Grayscale color [r, g, b]
 */
export function simulateAchromatopsia(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;

  // Luminance calculation (perceived brightness)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return [luminance, luminance, luminance];
}

/**
 * Simulate all color blindness types for a color
 * @param rgb - Color [r, g, b] (0-1)
 * @returns Object with all simulations
 */
export function simulateAllColorBlindness(rgb: [number, number, number]): {
  normal: [number, number, number];
  protanopia: [number, number, number];
  deuteranopia: [number, number, number];
  tritanopia: [number, number, number];
  achromatopsia: [number, number, number];
} {
  return {
    normal: rgb,
    protanopia: simulateProtanopia(rgb),
    deuteranopia: simulateDeuteranopia(rgb),
    tritanopia: simulateTritanopia(rgb),
    achromatopsia: simulateAchromatopsia(rgb),
  };
}

/**
 * Simulate color blindness for entire palette
 * @param palette - Palette to simulate
 * @param type - Color blindness type
 * @returns Simulated palette
 */
export function simulatePalette(
  palette: Palette,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
): Palette {
  const simulators = {
    protanopia: simulateProtanopia,
    deuteranopia: simulateDeuteranopia,
    tritanopia: simulateTritanopia,
    achromatopsia: simulateAchromatopsia,
  };

  const simulator = simulators[type];

  const simulatedColors = palette.colors.map(color => simulator(color));

  return {
    ...palette,
    id: `${palette.id}-${type}`,
    name: `${palette.name} (${type})`,
    colors: simulatedColors,
  };
}

/**
 * Calculate perceptual contrast between colors
 * @param rgb1 - First color
 * @param rgb2 - Second color
 * @returns Contrast ratio (1-21, WCAG standard)
 */
function calculateContrast(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const luminance = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map(c => {
      c = c / 1;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate palette for color blindness accessibility
 * @param palette - Palette to validate
 * @returns Validation results
 */
export function validatePaletteForColorBlind(palette: Palette): {
  isAccessible: boolean;
  issues: string[];
  simulations: {
    protanopia: boolean;
    deuteranopia: boolean;
    tritanopia: boolean;
  };
} {
  const issues: string[] = [];
  const results = {
    protanopia: true,
    deuteranopia: true,
    tritanopia: true,
  };

  // Test each color blindness type
  const types: Array<'protanopia' | 'deuteranopia' | 'tritanopia'> = [
    'protanopia',
    'deuteranopia',
    'tritanopia',
  ];

  for (const type of types) {
    const simulated = simulatePalette(palette, type);

    // Check if colors are still distinguishable
    for (let i = 0; i < simulated.colors.length; i++) {
      for (let j = i + 1; j < simulated.colors.length; j++) {
        const contrast = calculateContrast(simulated.colors[i], simulated.colors[j]);

        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        // For visual effects, we use lower threshold of 1.5:1
        if (contrast < 1.5) {
          issues.push(`${type}: Low contrast between color ${i} and ${j} (${contrast.toFixed(2)}:1)`);
          results[type] = false;
        }
      }
    }
  }

  return {
    isAccessible: issues.length === 0,
    issues,
    simulations: results,
  };
}

/**
 * Get recommended adjustments to improve color blind accessibility
 * @param palette - Palette to analyze
 * @returns Recommendations
 */
export function getColorBlindRecommendations(palette: Palette): string[] {
  const validation = validatePaletteForColorBlind(palette);

  if (validation.isAccessible) {
    return ['✅ Palette is accessible for all color vision types'];
  }

  const recommendations: string[] = [];

  if (!validation.simulations.protanopia) {
    recommendations.push('Increase lightness differences between red and green hues');
  }

  if (!validation.simulations.deuteranopia) {
    recommendations.push('Avoid relying solely on red-green distinctions');
    recommendations.push('Add blue or yellow tones to improve distinction');
  }

  if (!validation.simulations.tritanopia) {
    recommendations.push('Increase contrast between blue and yellow hues');
  }

  recommendations.push('Consider using patterns or textures in addition to color');

  return recommendations;
}
