/**
 * Palette Module Exports
 */

export { PaletteDirector, AUTHENTIC_PALETTES, wavelengthToRGB } from './PaletteDirector';
export type { Palette } from './PaletteDirector';

// Oklab color space
export {
  sRGBToOklab,
  oklabToSRGB,
  mixOklab,
  adjustLightness,
  adjustChroma,
  rotateHue,
  perceptualDistance,
} from './colorSpaces/oklab';

// Color harmonies
export {
  generateComplementary,
  generateTriadic,
  generateAnalogous,
  generateSplitComplementary,
  generateTetradic,
  generateMonochromatic,
  generateHarmony,
  generatePaletteWithOklab,
} from './colorHarmony';

// Palette interpolation
export {
  interpolatePalettesLinear,
  interpolatePalettesOklab,
  interpolatePalettesWithEasing,
  PaletteAnimator,
  createPaletteAnimator,
  Easing,
} from './paletteInterpolation';

// Palette generation
export {
  generateRandomPalette,
  generateBestRandomPalette,
  generatePaletteFromSeed,
} from './paletteRandomizer';
export type { PaletteConstraints } from './paletteRandomizer';

// Palette mood analysis
export {
  analyzePaletteMood,
  findPalettesByMood,
  getMoodDescription,
} from './paletteMoodAnalyzer';
export type { PaletteMoodAnalysis } from './paletteMoodAnalyzer';
