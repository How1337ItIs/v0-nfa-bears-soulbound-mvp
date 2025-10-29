/**
 * PALETTE DIRECTOR - Central Color Management Service
 *
 * Single source of truth for all color palettes across the application.
 * Ensures visual coherence across CSS, WebGL, and R3F layers.
 *
 * Based on:
 * - Master Liquid Light Integration Plan (Week 1 Day 3-4)
 * - Authentic 1960s Joshua Light Show color science
 * - Wavelength-accurate thin-film interference colors
 *
 * Author: Claude Code
 * Date: 2025-10-29
 */

export interface Palette {
  id: string;
  name: string;
  description: string;
  colors: string[];              // Hex color values
  wavelengths: number[];         // Nanometer values (380-750nm)
  culturalContext: string;       // Song/era context
  viscosity?: number;            // Optional flow characteristic
  energy?: string;               // Energy descriptor
}

/**
 * Wavelength to RGB Conversion
 * Based on authentic visible spectrum physics (380-750nm)
 *
 * @param wavelength - Wavelength in nanometers (380-750)
 * @returns RGB color as [r, g, b] (0-1 range)
 */
export function wavelengthToRGB(wavelength: number): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;

  // Visible spectrum mapping
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1.0;
  }

  // Intensity falloff at spectrum edges
  let factor = 1.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * ((wavelength - 380) / (420 - 380));
  } else if (wavelength >= 700 && wavelength <= 750) {
    factor = 0.3 + 0.7 * ((750 - wavelength) / (750 - 700));
  }

  return [r * factor, g * factor, b * factor];
}

/**
 * Convert RGB array to hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * AUTHENTIC PALETTES
 * Wavelength-accurate colors based on real thin-film interference physics
 */
const AUTHENTIC_PALETTES: Record<string, Palette> = {
  'classic-60s': {
    id: 'classic-60s',
    name: 'Classic 60s Oil-on-Water',
    description: 'Electric magenta, cyan-turquoise, electric yellow, orange-red',
    colors: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    wavelengths: [650, 485, 580, 620],
    culturalContext: 'Classic 1960s Joshua Light Show',
    viscosity: 0.4,
    energy: 'balanced'
  },

  'grateful-dead': {
    id: 'grateful-dead',
    name: 'Grateful Dead Show Colors',
    description: 'Deep red, electric cyan, bright yellow, vivid orange',
    colors: ['#ff1744', '#00e5ff', '#ffea00', '#ff6f00'],
    wavelengths: [645, 480, 575, 615],
    culturalContext: 'Grateful Dead concert aesthetic',
    viscosity: 0.4,
    energy: 'vibrant'
  },

  'joshua-light': {
    id: 'joshua-light',
    name: 'Joshua Light Show Authentic',
    description: 'Pink-magenta, light cyan, amber, red-orange',
    colors: ['#e91e63', '#00bcd4', '#ffc107', '#ff5722'],
    wavelengths: [640, 490, 585, 610],
    culturalContext: 'Fillmore East 1967-1971',
    viscosity: 0.4,
    energy: 'classic'
  },

  'dark-star': {
    id: 'dark-star',
    name: 'Dark Star',
    description: 'Contemplative cosmic purples and deep blues',
    colors: ['#9c27b0', '#673ab7', '#3f51b5', '#2196f3'],
    wavelengths: [420, 450, 480, 510],
    culturalContext: 'Extended jam, spacey, exploratory',
    viscosity: 0.08,
    energy: 'contemplative_cosmic'
  },

  'fire-on-the-mountain': {
    id: 'fire-on-the-mountain',
    name: 'Fire on the Mountain',
    description: 'Accelerating climactic reds and oranges',
    colors: ['#ff6b00', '#ff8c00', '#ff4400', '#ff1100'],
    wavelengths: [580, 605, 630, 650],
    culturalContext: 'High-energy, building intensity',
    viscosity: 0.04,
    energy: 'accelerating_climactic'
  },

  'china-cat-sunflower': {
    id: 'china-cat-sunflower',
    name: 'China Cat Sunflower',
    description: 'Joyful storytelling greens and yellows',
    colors: ['#8bc34a', '#cddc39', '#ffeb3b', '#ffc107'],
    wavelengths: [535, 560, 580, 590],
    culturalContext: 'Upbeat, playful, sunny',
    viscosity: 0.06,
    energy: 'joyful_celebratory'
  },

  'terrapin-station': {
    id: 'terrapin-station',
    name: 'Terrapin Station',
    description: 'Narrative journey cyans and teals',
    colors: ['#00bcd4', '#00acc1', '#0097a7', '#00838f'],
    wavelengths: [485, 495, 505, 515],
    culturalContext: 'Epic storytelling, oceanic',
    viscosity: 0.06,
    energy: 'narrative_storytelling'
  },

  'scarlet-begonias': {
    id: 'scarlet-begonias',
    name: 'Scarlet Begonias',
    description: 'Celebratory magentas and bright reds',
    colors: ['#e91e63', '#f50057', '#ff1744', '#d50000'],
    wavelengths: [640, 650, 680, 700],
    culturalContext: 'Joyful, dance, celebration',
    viscosity: 0.03,
    energy: 'joyful_celebratory'
  },
};

/**
 * PaletteDirector - Central Palette Management Service
 *
 * Singleton service ensuring all visual layers use consistent colors
 */
class PaletteDirectorClass {
  private currentPaletteId: string = 'classic-60s';
  private customPalettes: Map<string, Palette> = new Map();

  /**
   * Get current active palette
   */
  getCurrentPalette(): Palette {
    return this.getPalette(this.currentPaletteId);
  }

  /**
   * Get palette by ID
   */
  getPalette(id: string): Palette {
    const palette = AUTHENTIC_PALETTES[id] || this.customPalettes.get(id);

    if (!palette) {
      console.warn(`Palette "${id}" not found, falling back to classic-60s`);
      return AUTHENTIC_PALETTES['classic-60s'];
    }

    return palette;
  }

  /**
   * Set active palette
   */
  setCurrentPalette(id: string): void {
    if (AUTHENTIC_PALETTES[id] || this.customPalettes.has(id)) {
      this.currentPaletteId = id;
    } else {
      console.warn(`Palette "${id}" not found, keeping current palette`);
    }
  }

  /**
   * Get all available palettes
   */
  getAllPalettes(): Palette[] {
    const authentic = Object.values(AUTHENTIC_PALETTES);
    const custom = Array.from(this.customPalettes.values());
    return [...authentic, ...custom];
  }

  /**
   * Get song-specific palettes only
   */
  getSongPalettes(): Palette[] {
    return [
      AUTHENTIC_PALETTES['dark-star'],
      AUTHENTIC_PALETTES['fire-on-the-mountain'],
      AUTHENTIC_PALETTES['china-cat-sunflower'],
      AUTHENTIC_PALETTES['terrapin-station'],
      AUTHENTIC_PALETTES['scarlet-begonias'],
    ];
  }

  /**
   * Get color at specific index with optional interpolation
   */
  getColor(index: number, interpolate: boolean = false): string {
    const palette = this.getCurrentPalette();

    if (!interpolate) {
      return palette.colors[index % palette.colors.length];
    }

    // Interpolate between colors for smooth transitions
    const normalizedIndex = index % palette.colors.length;
    const baseIndex = Math.floor(normalizedIndex);
    const nextIndex = (baseIndex + 1) % palette.colors.length;
    const t = normalizedIndex - baseIndex;

    return this.interpolateColors(
      palette.colors[baseIndex],
      palette.colors[nextIndex],
      t
    );
  }

  /**
   * Interpolate between two hex colors
   */
  private interpolateColors(color1: string, color2: string, t: number): string {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Get color as RGB array (0-1 range) for WebGL/shaders
   */
  getColorRGB(index: number): [number, number, number] {
    const hex = this.getColor(index);
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  }

  /**
   * Get all colors as RGB arrays for shader uniform
   */
  getCurrentColorsRGB(): number[][] {
    const palette = this.getCurrentPalette();
    return palette.colors.map(hex => {
      const r = parseInt(hex.substring(1, 3), 16) / 255;
      const g = parseInt(hex.substring(3, 5), 16) / 255;
      const b = parseInt(hex.substring(5, 7), 16) / 255;
      return [r, g, b];
    });
  }

  /**
   * Register custom palette
   */
  registerCustomPalette(palette: Palette): void {
    this.customPalettes.set(palette.id, palette);
  }

  /**
   * Apply sRGB gamma correction
   * For linear to sRGB conversion
   */
  linearToSRGB(linear: number): number {
    if (linear <= 0.0031308) {
      return linear * 12.92;
    }
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
  }

  /**
   * Remove sRGB gamma correction
   * For sRGB to linear conversion
   */
  sRGBToLinear(srgb: number): number {
    if (srgb <= 0.04045) {
      return srgb / 12.92;
    }
    return Math.pow((srgb + 0.055) / 1.055, 2.4);
  }

  /**
   * Get color with specified intensity/brightness multiplier
   */
  getColorWithIntensity(index: number, intensity: number): string {
    const [r, g, b] = this.getColorRGB(index);

    // Clamp intensity
    const clampedIntensity = Math.max(0, Math.min(1, intensity));

    return rgbToHex(
      r * clampedIntensity,
      g * clampedIntensity,
      b * clampedIntensity
    );
  }

  /**
   * Generate wavelength-based color from nanometer value
   */
  generateColorFromWavelength(wavelength: number): string {
    const [r, g, b] = wavelengthToRGB(wavelength);
    return rgbToHex(r, g, b);
  }
}

// Export singleton instance
export const PaletteDirector = new PaletteDirectorClass();

// Export palettes for reference
export { AUTHENTIC_PALETTES };
