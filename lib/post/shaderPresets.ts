/**
 * SHADER EFFECT PRESET SYSTEM
 *
 * Named combinations of shader effects for different songs and moods.
 * Makes it easy to apply consistent effect combinations.
 *
 * Usage:
 * ```typescript
 * const preset = SHADER_PRESETS['dark-star'];
 * applyEffects(preset);
 * ```
 */

export interface ShaderEffectConfig {
  // Core effects
  thinFilm: boolean;
  thinFilmQuality?: 'emergency' | 'mobile' | 'desktop' | 'ultra';
  thinFilmIntensity?: number;

  // Visual effects
  shimmer: boolean;
  shimmerIntensity?: number;

  flowField: boolean;
  flowFieldStrength?: number;

  chromatic: boolean;
  chromaticOffset?: number;

  kaleidoscope: boolean;
  kaleidoscopeSections?: number;

  vignette: boolean;
  vignetteIntensity?: number;

  bloom: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;

  heatHaze: boolean;
  heatHazeIntensity?: number;

  particles: boolean;
  particleDensity?: number;
}

/**
 * Predefined shader effect combinations
 */
export const SHADER_PRESETS: Record<string, ShaderEffectConfig> = {
  /**
   * MINIMAL - Bare bones, maximum performance
   * Use: Emergency fallback, battery saver
   */
  minimal: {
    thinFilm: false,
    shimmer: false,
    flowField: false,
    chromatic: false,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.7,
    bloom: false,
    heatHaze: false,
    particles: false,
  },

  /**
   * CLASSIC - Traditional liquid light aesthetic
   * Use: General purpose, reliable
   */
  classic: {
    thinFilm: true,
    thinFilmQuality: 'mobile',
    thinFilmIntensity: 0.6,
    shimmer: true,
    shimmerIntensity: 0.3,
    flowField: false,
    chromatic: true,
    chromaticOffset: 0.002,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.8,
    bloom: false,
    heatHaze: false,
    particles: false,
  },

  /**
   * INTENSE - Rich, layered effects
   * Use: High-energy songs, capable devices
   */
  intense: {
    thinFilm: true,
    thinFilmQuality: 'desktop',
    thinFilmIntensity: 0.8,
    shimmer: true,
    shimmerIntensity: 0.5,
    flowField: true,
    flowFieldStrength: 0.08,
    chromatic: true,
    chromaticOffset: 0.003,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.7,
    bloom: true,
    bloomIntensity: 0.5,
    bloomThreshold: 0.5,
    heatHaze: false,
    particles: true,
    particleDensity: 40,
  },

  /**
   * TRIP - Maximum psychedelic intensity
   * Use: Trip mode, ultra tier only
   */
  trip: {
    thinFilm: true,
    thinFilmQuality: 'ultra',
    thinFilmIntensity: 0.9,
    shimmer: true,
    shimmerIntensity: 0.6,
    flowField: true,
    flowFieldStrength: 0.1,
    chromatic: true,
    chromaticOffset: 0.004,
    kaleidoscope: true,
    kaleidoscopeSections: 6,
    vignette: false,
    bloom: true,
    bloomIntensity: 0.8,
    bloomThreshold: 0.3,
    heatHaze: false,
    particles: true,
    particleDensity: 60,
  },

  /**
   * FIRE - For "Fire on the Mountain" and similar
   * Use: Fire-themed palettes
   */
  fire: {
    thinFilm: true,
    thinFilmQuality: 'desktop',
    thinFilmIntensity: 0.8,
    shimmer: true,
    shimmerIntensity: 0.5,
    flowField: true,
    flowFieldStrength: 0.12,
    chromatic: false,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.9,
    bloom: true,
    bloomIntensity: 0.7,
    bloomThreshold: 0.4,
    heatHaze: true,
    heatHazeIntensity: 0.4,
    particles: true,
    particleDensity: 30,
  },

  /**
   * COSMIC - For "Dark Star" jams
   * Use: Cosmic, space-rock territory
   */
  cosmic: {
    thinFilm: true,
    thinFilmQuality: 'desktop',
    thinFilmIntensity: 0.85,
    shimmer: true,
    shimmerIntensity: 0.6,
    flowField: true,
    flowFieldStrength: 0.06,
    chromatic: true,
    chromaticOffset: 0.005,
    kaleidoscope: true,
    kaleidoscopeSections: 6,
    vignette: false,
    bloom: true,
    bloomIntensity: 0.6,
    bloomThreshold: 0.4,
    heatHaze: false,
    particles: true,
    particleDensity: 50,
  },

  /**
   * AMBIENT - Gentle, flowing
   * Use: Low-energy songs, background visuals
   */
  ambient: {
    thinFilm: true,
    thinFilmQuality: 'mobile',
    thinFilmIntensity: 0.5,
    shimmer: true,
    shimmerIntensity: 0.3,
    flowField: false,
    chromatic: false,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.8,
    bloom: false,
    heatHaze: false,
    particles: false,
  },

  /**
   * PERFORMANCE - Optimized for weaker devices
   * Use: Medium tier devices, battery saver
   */
  performance: {
    thinFilm: true,
    thinFilmQuality: 'mobile',
    thinFilmIntensity: 0.5,
    shimmer: false,
    flowField: false,
    chromatic: true,
    chromaticOffset: 0.002,
    kaleidoscope: false,
    vignette: true,
    vignetteIntensity: 0.75,
    bloom: false,
    heatHaze: false,
    particles: false,
  },
};

/**
 * Get shader preset by name
 * @param presetName - Preset name
 * @returns Shader effect configuration
 */
export function getShaderPreset(presetName: string): ShaderEffectConfig | null {
  return SHADER_PRESETS[presetName] || null;
}

/**
 * Get all available presets
 * @returns Array of preset names
 */
export function getAllShaderPresets(): string[] {
  return Object.keys(SHADER_PRESETS);
}

/**
 * Get recommended preset based on device tier and mode
 * @param deviceTier - Device capability tier
 * @param mode - User mode
 * @returns Recommended preset name
 */
export function getRecommendedShaderPreset(
  deviceTier: 'low' | 'medium' | 'high' | 'ultra',
  mode: 'off' | 'ambient' | 'dance-floor' | 'trip'
): string {
  // Trip mode
  if (mode === 'trip') {
    return deviceTier === 'ultra' ? 'trip' : 'cosmic';
  }

  // Dance floor
  if (mode === 'dance-floor') {
    return deviceTier === 'high' || deviceTier === 'ultra' ? 'intense' : 'classic';
  }

  // Ambient
  if (mode === 'ambient') {
    return 'ambient';
  }

  // Off
  if (mode === 'off') {
    return 'minimal';
  }

  // Default to performance or classic based on tier
  return deviceTier === 'medium' ? 'performance' : 'classic';
}

/**
 * Estimate GPU time for preset
 * @param presetName - Preset name
 * @returns Estimated GPU time in ms
 */
export function estimatePresetGPUTime(presetName: string): number {
  const preset = SHADER_PRESETS[presetName];
  if (!preset) return 0;

  let total = 0;

  if (preset.thinFilm) {
    const qualityTime = {
      emergency: 1.5,
      mobile: 3.5,
      desktop: 5.5,
      ultra: 8.0,
    }[preset.thinFilmQuality || 'mobile'];
    total += qualityTime;
  }

  if (preset.shimmer) total += 1.5;
  if (preset.flowField) total += 2.0;
  if (preset.chromatic) total += 0.8;
  if (preset.kaleidoscope) total += 3.0;
  if (preset.vignette) total += 0.5;
  if (preset.bloom) total += 5.0;
  if (preset.heatHaze) total += 2.0;
  if (preset.particles) total += 1.5;

  return total;
}
