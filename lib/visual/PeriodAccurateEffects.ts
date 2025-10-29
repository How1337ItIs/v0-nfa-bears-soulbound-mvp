/**
 * PERIOD-ACCURATE VISUAL EFFECTS
 * 
 * Authentic 60s visual effects based on historical research
 * Includes light show techniques, psychedelic art methods, and period-accurate filters
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface PeriodEffect {
  id: string;
  name: string;
  description: string;
  year: number;
  technique: string;
  parameters: {
    intensity: number;
    speed: number;
    complexity: number;
    authenticity: number;
  };
  culturalContext: string;
  usage: string[];
}

export interface LightShowEffect {
  id: string;
  name: string;
  description: string;
  technique: 'oil-projector' | 'slide-projector' | 'overhead-projector' | 'lava-lamp' | 'strobe' | 'blacklight';
  parameters: {
    colorShift: number;
    speed: number;
    intensity: number;
    blendMode: string;
  };
  historicalAccuracy: number;
  culturalSignificance: string;
}

export interface PsychedelicArtEffect {
  id: string;
  name: string;
  description: string;
  technique: 'morphing' | 'kaleidoscope' | 'mandala' | 'fractal' | 'op-art' | 'moiré';
  parameters: {
    symmetry: number;
    rotation: number;
    scale: number;
    complexity: number;
  };
  artisticMovement: string;
  associatedArtists: string[];
}

export const PERIOD_ACCURATE_EFFECTS: PeriodEffect[] = [
  {
    id: 'oil-projector-waves',
    name: 'Oil Projector Waves',
    description: 'Classic liquid light show technique using colored oil and water',
    year: 1966,
    technique: 'oil-projector',
    parameters: {
      intensity: 0.8,
      speed: 0.6,
      complexity: 0.7,
      authenticity: 0.9,
    },
    culturalContext: 'Used in Fillmore West and Avalon Ballroom light shows',
    usage: ['Liquid light shows', 'Psychedelic experiences', 'Concert visuals'],
  },
  {
    id: 'slide-projector-morphing',
    name: 'Slide Projector Morphing',
    description: 'Morphing between multiple slides for fluid transitions',
    year: 1967,
    technique: 'slide-projector',
    parameters: {
      intensity: 0.7,
      speed: 0.8,
      complexity: 0.6,
      authenticity: 0.85,
    },
    culturalContext: 'Pioneered by Joshua White and the Joshua Light Show',
    usage: ['Concert visuals', 'Art installations', 'Psychedelic experiences'],
  },
  {
    id: 'overhead-projector-shadows',
    name: 'Overhead Projector Shadows',
    description: 'Creating moving shadows and silhouettes with overhead projectors',
    year: 1965,
    technique: 'overhead-projector',
    parameters: {
      intensity: 0.6,
      speed: 0.5,
      complexity: 0.8,
      authenticity: 0.9,
    },
    culturalContext: 'Used in early psychedelic light shows and art installations',
    usage: ['Art installations', 'Theater', 'Psychedelic experiences'],
  },
  {
    id: 'lava-lamp-flow',
    name: 'Lava Lamp Flow',
    description: 'Slow, organic movement inspired by lava lamps',
    year: 1963,
    technique: 'lava-lamp',
    parameters: {
      intensity: 0.5,
      speed: 0.3,
      complexity: 0.4,
      authenticity: 0.95,
    },
    culturalContext: 'Iconic 60s decorative element and visual inspiration',
    usage: ['Ambient visuals', 'Decorative effects', 'Psychedelic experiences'],
  },
  {
    id: 'strobe-flash',
    name: 'Strobe Flash',
    description: 'Rapid flashing effects for intense visual impact',
    year: 1968,
    technique: 'strobe',
    parameters: {
      intensity: 1.0,
      speed: 0.9,
      complexity: 0.3,
      authenticity: 0.8,
    },
    culturalContext: 'Used in psychedelic rock concerts and experimental films',
    usage: ['Concert visuals', 'Experimental films', 'Psychedelic experiences'],
  },
  {
    id: 'blacklight-fluorescence',
    name: 'Blacklight Fluorescence',
    description: 'UV-reactive colors that glow under blacklight',
    year: 1967,
    technique: 'blacklight',
    parameters: {
      intensity: 0.9,
      speed: 0.4,
      complexity: 0.6,
      authenticity: 0.85,
    },
    culturalContext: 'Popular in psychedelic clubs and light shows',
    usage: ['Club visuals', 'Psychedelic experiences', 'Art installations'],
  },
];

export const LIGHT_SHOW_EFFECTS: LightShowEffect[] = [
  {
    id: 'oil-projector-classic',
    name: 'Oil Projector Classic',
    description: 'Traditional oil and water projection with color mixing',
    technique: 'oil-projector',
    parameters: {
      colorShift: 0.7,
      speed: 0.6,
      intensity: 0.8,
      blendMode: 'multiply',
    },
    historicalAccuracy: 0.95,
    culturalSignificance: 'Core technique of 60s liquid light shows',
  },
  {
    id: 'slide-dissolve',
    name: 'Slide Dissolve',
    description: 'Gradual transition between multiple slides',
    technique: 'slide-projector',
    parameters: {
      colorShift: 0.5,
      speed: 0.8,
      intensity: 0.7,
      blendMode: 'screen',
    },
    historicalAccuracy: 0.9,
    culturalSignificance: 'Pioneered by Joshua White for Fillmore East',
  },
  {
    id: 'overhead-silhouette',
    name: 'Overhead Silhouette',
    description: 'Moving shadow projections with colored gels',
    technique: 'overhead-projector',
    parameters: {
      colorShift: 0.6,
      speed: 0.4,
      intensity: 0.6,
      blendMode: 'overlay',
    },
    historicalAccuracy: 0.85,
    culturalSignificance: 'Used in early psychedelic art installations',
  },
  {
    id: 'lava-lamp-organic',
    name: 'Lava Lamp Organic',
    description: 'Slow, organic movement with color blending',
    technique: 'lava-lamp',
    parameters: {
      colorShift: 0.3,
      speed: 0.2,
      intensity: 0.5,
      blendMode: 'soft-light',
    },
    historicalAccuracy: 0.98,
    culturalSignificance: 'Iconic 60s visual element',
  },
  {
    id: 'strobe-intense',
    name: 'Strobe Intense',
    description: 'High-frequency flashing for intense visual impact',
    technique: 'strobe',
    parameters: {
      colorShift: 0.8,
      speed: 0.95,
      intensity: 1.0,
      blendMode: 'normal',
    },
    historicalAccuracy: 0.8,
    culturalSignificance: 'Used in psychedelic rock concerts',
  },
  {
    id: 'blacklight-glow',
    name: 'Blacklight Glow',
    description: 'UV-reactive colors with fluorescent glow',
    technique: 'blacklight',
    parameters: {
      colorShift: 0.9,
      speed: 0.3,
      intensity: 0.9,
      blendMode: 'screen',
    },
    historicalAccuracy: 0.9,
    culturalSignificance: 'Popular in psychedelic clubs and light shows',
  },
];

export const PSYCHEDELIC_ART_EFFECTS: PsychedelicArtEffect[] = [
  {
    id: 'morphing-organic',
    name: 'Morphing Organic',
    description: 'Smooth transformation between organic shapes',
    technique: 'morphing',
    parameters: {
      symmetry: 0.6,
      rotation: 0.7,
      scale: 0.8,
      complexity: 0.7,
    },
    artisticMovement: 'Psychedelic Art',
    associatedArtists: ['Wes Wilson', 'Victor Moscoso', 'Stanley Mouse'],
  },
  {
    id: 'kaleidoscope-mandala',
    name: 'Kaleidoscope Mandala',
    description: 'Symmetrical patterns with rotating elements',
    technique: 'kaleidoscope',
    parameters: {
      symmetry: 0.95,
      rotation: 0.8,
      scale: 0.6,
      complexity: 0.8,
    },
    artisticMovement: 'Psychedelic Art',
    associatedArtists: ['Alex Grey', 'Martina Hoffmann', 'Robert Venosa'],
  },
  {
    id: 'mandala-radial',
    name: 'Mandala Radial',
    description: 'Radial symmetry with spiritual significance',
    technique: 'mandala',
    parameters: {
      symmetry: 1.0,
      rotation: 0.5,
      scale: 0.7,
      complexity: 0.9,
    },
    artisticMovement: 'Psychedelic Art',
    associatedArtists: ['Alex Grey', 'Martina Hoffmann'],
  },
  {
    id: 'fractal-infinite',
    name: 'Fractal Infinite',
    description: 'Self-similar patterns with infinite detail',
    technique: 'fractal',
    parameters: {
      symmetry: 0.8,
      rotation: 0.6,
      scale: 0.9,
      complexity: 1.0,
    },
    artisticMovement: 'Psychedelic Art',
    associatedArtists: ['Benoit Mandelbrot', 'Fractal Art Movement'],
  },
  {
    id: 'op-art-illusion',
    name: 'Op Art Illusion',
    description: 'Optical illusions with geometric patterns',
    technique: 'op-art',
    parameters: {
      symmetry: 0.9,
      rotation: 0.4,
      scale: 0.5,
      complexity: 0.8,
    },
    artisticMovement: 'Op Art',
    associatedArtists: ['Bridget Riley', 'Victor Vasarely', 'Josef Albers'],
  },
  {
    id: 'moire-interference',
    name: 'Moiré Interference',
    description: 'Interference patterns from overlapping elements',
    technique: 'moiré',
    parameters: {
      symmetry: 0.7,
      rotation: 0.9,
      scale: 0.6,
      complexity: 0.7,
    },
    artisticMovement: 'Op Art',
    associatedArtists: ['Bridget Riley', 'Victor Vasarely'],
  },
];

export interface EffectPreset {
  id: string;
  name: string;
  description: string;
  effects: string[];
  culturalContext: string;
  usage: string[];
  authenticity: number;
}

export const EFFECT_PRESETS: EffectPreset[] = [
  {
    id: 'fillmore-west',
    name: 'Fillmore West',
    description: 'Classic Fillmore West light show combination',
    effects: ['oil-projector-waves', 'slide-projector-morphing', 'blacklight-fluorescence'],
    culturalContext: 'Authentic Fillmore West light show experience',
    usage: ['Concert visuals', 'Psychedelic experiences', 'Historical recreation'],
    authenticity: 0.95,
  },
  {
    id: 'avalon-ballroom',
    name: 'Avalon Ballroom',
    description: 'Avalon Ballroom psychedelic light show',
    effects: ['overhead-projector-shadows', 'lava-lamp-flow', 'strobe-flash'],
    culturalContext: 'Avalon Ballroom light show techniques',
    usage: ['Concert visuals', 'Psychedelic experiences', 'Art installations'],
    authenticity: 0.9,
  },
  {
    id: 'joshua-light-show',
    name: 'Joshua Light Show',
    description: 'Joshua White light show techniques',
    effects: ['slide-projector-morphing', 'overhead-projector-shadows', 'strobe-flash'],
    culturalContext: 'Pioneered by Joshua White for Fillmore East',
    usage: ['Concert visuals', 'Art installations', 'Historical recreation'],
    authenticity: 0.92,
  },
  {
    id: 'acid-test-party',
    name: 'Acid Test Party',
    description: 'Ken Kesey Acid Test party visuals',
    effects: ['oil-projector-waves', 'blacklight-fluorescence', 'strobe-flash'],
    culturalContext: 'Merry Pranksters Acid Test parties',
    usage: ['Experimental experiences', 'Historical recreation', 'Art installations'],
    authenticity: 0.88,
  },
  {
    id: 'summer-of-love',
    name: 'Summer of Love',
    description: '1967 Summer of Love visual experience',
    effects: ['lava-lamp-flow', 'overhead-projector-shadows', 'blacklight-fluorescence'],
    culturalContext: 'San Francisco Summer of Love 1967',
    usage: ['Psychedelic experiences', 'Historical recreation', 'Cultural celebration'],
    authenticity: 0.9,
  },
];

export function getPeriodEffect(effectId: string): PeriodEffect | undefined {
  return PERIOD_ACCURATE_EFFECTS.find(effect => effect.id === effectId);
}

export function getLightShowEffect(effectId: string): LightShowEffect | undefined {
  return LIGHT_SHOW_EFFECTS.find(effect => effect.id === effectId);
}

export function getPsychedelicArtEffect(effectId: string): PsychedelicArtEffect | undefined {
  return PSYCHEDELIC_ART_EFFECTS.find(effect => effect.id === effectId);
}

export function getEffectPreset(presetId: string): EffectPreset | undefined {
  return EFFECT_PRESETS.find(preset => preset.id === presetId);
}

export function getEffectsByTechnique(technique: string): PeriodEffect[] {
  return PERIOD_ACCURATE_EFFECTS.filter(effect => 
    effect.technique.toLowerCase().includes(technique.toLowerCase())
  );
}

export function getEffectsByYear(year: number): PeriodEffect[] {
  return PERIOD_ACCURATE_EFFECTS.filter(effect => effect.year === year);
}

export function getEffectsByAuthenticity(minAuthenticity: number): PeriodEffect[] {
  return PERIOD_ACCURATE_EFFECTS.filter(effect => 
    effect.parameters.authenticity >= minAuthenticity
  );
}

export function getPresetsByAuthenticity(minAuthenticity: number): EffectPreset[] {
  return EFFECT_PRESETS.filter(preset => preset.authenticity >= minAuthenticity);
}
