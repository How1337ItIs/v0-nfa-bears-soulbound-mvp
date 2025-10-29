/**
 * AUTHENTIC 60s COLOR PALETTES
 * 
 * Historically accurate color palettes from the 1960s psychedelic era
 * Based on research into period-accurate visual culture, album covers,
 * and psychedelic art movements
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface Authentic60sPalette {
  id: string;
  name: string;
  description: string;
  year: number;
  movement: string;
  colors: string[];
  culturalContext: string;
  usage: string[];
  inspiration: string[];
}

export const AUTHENTIC_60S_PALETTES: Authentic60sPalette[] = [
  {
    id: 'psychedelic-sunset',
    name: 'Psychedelic Sunset',
    description: 'Classic 60s sunset colors from San Francisco psychedelic posters',
    year: 1967,
    movement: 'Psychedelic Art',
    colors: [
      '#FF6B35', // Vibrant Orange
      '#F7931E', // Golden Yellow
      '#FFD23F', // Bright Yellow
      '#06FFA5', // Electric Green
      '#3B82F6', // Electric Blue
      '#8B5CF6', // Purple
      '#EC4899', // Hot Pink
      '#F59E0B', // Amber
    ],
    culturalContext: 'Inspired by the Fillmore West posters and psychedelic light shows',
    usage: ['Liquid light shows', 'Poster art', 'Album covers'],
    inspiration: ['Wes Wilson', 'Victor Moscoso', 'Stanley Mouse'],
  },
  {
    id: 'acid-test',
    name: 'Acid Test',
    description: 'Neon-bright colors from Ken Kesey\'s Acid Tests and Merry Pranksters',
    year: 1966,
    movement: 'Counterculture',
    colors: [
      '#00FFFF', // Cyan
      '#FF00FF', // Magenta
      '#FFFF00', // Yellow
      '#00FF00', // Lime Green
      '#FF0080', // Hot Pink
      '#8000FF', // Electric Purple
      '#FF8000', // Orange
      '#0080FF', // Electric Blue
    ],
    culturalContext: 'Colors used in Ken Kesey\'s Acid Test parties and light shows',
    usage: ['Light shows', 'Neon art', 'Experimental films'],
    inspiration: ['Ken Kesey', 'Merry Pranksters', 'Grateful Dead'],
  },
  {
    id: 'flower-power',
    name: 'Flower Power',
    description: 'Soft, natural colors from the hippie movement and flower children',
    year: 1967,
    movement: 'Hippie Culture',
    colors: [
      '#FFB6C1', // Light Pink
      '#98FB98', // Pale Green
      '#F0E68C', // Khaki
      '#DDA0DD', // Plum
      '#87CEEB', // Sky Blue
      '#F5DEB3', // Wheat
      '#FFA07A', // Light Salmon
      '#D8BFD8', // Thistle
    ],
    culturalContext: 'Gentle colors representing peace, love, and harmony',
    usage: ['Fashion', 'Posters', 'Peace symbols'],
    inspiration: ['Summer of Love', 'Woodstock', 'Beatles'],
  },
  {
    id: 'op-art',
    name: 'Op Art',
    description: 'High-contrast black and white with accent colors from optical art',
    year: 1965,
    movement: 'Op Art',
    colors: [
      '#000000', // Black
      '#FFFFFF', // White
      '#FF0000', // Red
      '#0000FF', // Blue
      '#00FF00', // Green
      '#FFFF00', // Yellow
      '#FF00FF', // Magenta
      '#00FFFF', // Cyan
    ],
    culturalContext: 'Bridget Riley and Victor Vasarely inspired optical illusions',
    usage: ['Art installations', 'Fashion', 'Posters'],
    inspiration: ['Bridget Riley', 'Victor Vasarely', 'Josef Albers'],
  },
  {
    id: 'mod-madness',
    name: 'Mod Madness',
    description: 'Bold, geometric colors from British Mod culture and Carnaby Street',
    year: 1964,
    movement: 'Mod Culture',
    colors: [
      '#DC143C', // Crimson
      '#4169E1', // Royal Blue
      '#32CD32', // Lime Green
      '#FFD700', // Gold
      '#FF1493', // Deep Pink
      '#00CED1', // Dark Turquoise
      '#FF8C00', // Dark Orange
      '#8A2BE2', // Blue Violet
    ],
    culturalContext: 'Carnaby Street fashion and British Mod aesthetics',
    usage: ['Fashion', 'Album covers', 'Posters'],
    inspiration: ['The Who', 'The Kinks', 'Mary Quant'],
  },
  {
    id: 'beat-generation',
    name: 'Beat Generation',
    description: 'Muted, earthy tones from Beat poetry and jazz culture',
    year: 1960,
    movement: 'Beat Generation',
    colors: [
      '#8B4513', // Saddle Brown
      '#A0522D', // Sienna
      '#CD853F', // Peru
      '#D2B48C', // Tan
      '#F4A460', // Sandy Brown
      '#DEB887', // Burlywood
      '#D2691E', // Chocolate
      '#BC8F8F', // Rosy Brown
    ],
    culturalContext: 'Colors reflecting the bohemian lifestyle and jazz clubs',
    usage: ['Poetry readings', 'Jazz clubs', 'Coffee houses'],
    inspiration: ['Jack Kerouac', 'Allen Ginsberg', 'Miles Davis'],
  },
  {
    id: 'space-age',
    name: 'Space Age',
    description: 'Futuristic colors from the space race and atomic age',
    year: 1969,
    movement: 'Space Age',
    colors: [
      '#C0C0C0', // Silver
      '#FFD700', // Gold
      '#00BFFF', // Deep Sky Blue
      '#FF6347', // Tomato
      '#32CD32', // Lime Green
      '#FF1493', // Deep Pink
      '#1E90FF', // Dodger Blue
      '#FFA500', // Orange
    ],
    culturalContext: 'Colors inspired by space exploration and atomic energy',
    usage: ['Space-themed art', 'Futuristic designs', 'Atomic age aesthetics'],
    inspiration: ['Apollo 11', 'Atomic energy', 'Jetsons'],
  },
  {
    id: 'underground-comix',
    name: 'Underground Comix',
    description: 'Raw, vibrant colors from underground comics and counterculture',
    year: 1968,
    movement: 'Underground Comics',
    colors: [
      '#FF4500', // Orange Red
      '#00FF7F', // Spring Green
      '#FF69B4', // Hot Pink
      '#9370DB', // Medium Purple
      '#FFD700', // Gold
      '#00CED1', // Dark Turquoise
      '#FF8C00', // Dark Orange
      '#8B0000', // Dark Red
    ],
    culturalContext: 'Colors from underground comics and counterculture publications',
    usage: ['Comics', 'Zines', 'Counterculture art'],
    inspiration: ['Robert Crumb', 'Gilbert Shelton', 'Zap Comix'],
  },
];

export interface VintageFilter {
  id: string;
  name: string;
  description: string;
  effects: {
    saturation: number;
    contrast: number;
    brightness: number;
    hue: number;
    sepia: number;
    vignette: number;
    grain: number;
  };
  culturalContext: string;
}

export const VINTAGE_60S_FILTERS: VintageFilter[] = [
  {
    id: 'psychedelic-glow',
    name: 'Psychedelic Glow',
    description: 'Enhanced saturation and glow effects from light shows',
    effects: {
      saturation: 1.5,
      contrast: 1.2,
      brightness: 1.1,
      hue: 0,
      sepia: 0,
      vignette: 0.3,
      grain: 0.1,
    },
    culturalContext: 'Recreates the glowing effect of psychedelic light shows',
  },
  {
    id: 'acid-wash',
    name: 'Acid Wash',
    description: 'High contrast with color shifting effects',
    effects: {
      saturation: 2.0,
      contrast: 1.8,
      brightness: 0.9,
      hue: 30,
      sepia: 0,
      vignette: 0.5,
      grain: 0.2,
    },
    culturalContext: 'Simulates the visual effects of psychedelic experiences',
  },
  {
    id: 'flower-child',
    name: 'Flower Child',
    description: 'Soft, dreamy colors with gentle saturation',
    effects: {
      saturation: 0.8,
      contrast: 0.9,
      brightness: 1.2,
      hue: -10,
      sepia: 0.2,
      vignette: 0.1,
      grain: 0.05,
    },
    culturalContext: 'Gentle, peaceful aesthetic of the hippie movement',
  },
  {
    id: 'mod-sharp',
    name: 'Mod Sharp',
    description: 'High contrast, sharp edges with bold colors',
    effects: {
      saturation: 1.3,
      contrast: 1.5,
      brightness: 1.0,
      hue: 0,
      sepia: 0,
      vignette: 0.2,
      grain: 0,
    },
    culturalContext: 'Clean, geometric aesthetic of British Mod culture',
  },
  {
    id: 'beat-worn',
    name: 'Beat Worn',
    description: 'Desaturated, aged look with sepia tones',
    effects: {
      saturation: 0.6,
      contrast: 1.1,
      brightness: 0.8,
      hue: 20,
      sepia: 0.4,
      vignette: 0.4,
      grain: 0.3,
    },
    culturalContext: 'Worn, bohemian aesthetic of the Beat Generation',
  },
];

export interface CulturalContext {
  paletteId: string;
  historicalPeriod: string;
  culturalSignificance: string;
  visualCharacteristics: string[];
  associatedArtists: string[];
  relatedMovements: string[];
  usageGuidelines: string[];
}

export const CULTURAL_CONTEXTS: CulturalContext[] = [
  {
    paletteId: 'psychedelic-sunset',
    historicalPeriod: '1967 Summer of Love',
    culturalSignificance: 'Represented the peak of psychedelic culture in San Francisco',
    visualCharacteristics: [
      'Vibrant, saturated colors',
      'Organic, flowing shapes',
      'High contrast combinations',
      'Electric, neon-like intensity',
    ],
    associatedArtists: ['Wes Wilson', 'Victor Moscoso', 'Stanley Mouse', 'Alton Kelley'],
    relatedMovements: ['Psychedelic Art', 'Fillmore Posters', 'Light Shows'],
    usageGuidelines: [
      'Use for authentic 60s psychedelic experiences',
      'Avoid modern interpretations',
      'Maintain cultural respect',
      'Include historical context',
    ],
  },
  {
    paletteId: 'acid-test',
    historicalPeriod: '1966 Acid Tests',
    culturalSignificance: 'Defined the visual language of psychedelic experimentation',
    visualCharacteristics: [
      'Neon-bright, electric colors',
      'High contrast and intensity',
      'Experimental color combinations',
      'Fluorescent-like appearance',
    ],
    associatedArtists: ['Ken Kesey', 'Merry Pranksters', 'Grateful Dead'],
    relatedMovements: ['Counterculture', 'Acid Tests', 'Experimental Art'],
    usageGuidelines: [
      'Use for experimental, avant-garde experiences',
      'Handle with cultural sensitivity',
      'Provide historical context',
      'Respect the experimental nature',
    ],
  },
  {
    paletteId: 'flower-power',
    historicalPeriod: '1967-1969 Hippie Movement',
    culturalSignificance: 'Symbolized peace, love, and harmony',
    visualCharacteristics: [
      'Soft, pastel colors',
      'Natural, organic tones',
      'Gentle, peaceful aesthetic',
      'Flower-inspired palettes',
    ],
    associatedArtists: ['The Beatles', 'Janis Joplin', 'Jimi Hendrix'],
    relatedMovements: ['Hippie Culture', 'Flower Power', 'Peace Movement'],
    usageGuidelines: [
      'Use for peaceful, harmonious experiences',
      'Maintain gentle, non-aggressive tone',
      'Include peace and love themes',
      'Respect the spiritual aspects',
    ],
  },
];

export function getAuthentic60sPalette(paletteId: string): Authentic60sPalette | undefined {
  return AUTHENTIC_60S_PALETTES.find(palette => palette.id === paletteId);
}

export function getVintageFilter(filterId: string): VintageFilter | undefined {
  return VINTAGE_60S_FILTERS.find(filter => filter.id === filterId);
}

export function getCulturalContext(paletteId: string): CulturalContext | undefined {
  return CULTURAL_CONTEXTS.find(context => context.paletteId === paletteId);
}

export function getAllPalettesByMovement(movement: string): Authentic60sPalette[] {
  return AUTHENTIC_60S_PALETTES.filter(palette => 
    palette.movement.toLowerCase().includes(movement.toLowerCase())
  );
}

export function getAllPalettesByYear(year: number): Authentic60sPalette[] {
  return AUTHENTIC_60S_PALETTES.filter(palette => palette.year === year);
}

export function getPalettesByYearRange(startYear: number, endYear: number): Authentic60sPalette[] {
  return AUTHENTIC_60S_PALETTES.filter(palette => 
    palette.year >= startYear && palette.year <= endYear
  );
}
