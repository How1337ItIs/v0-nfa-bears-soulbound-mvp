/**
 * AUDIO-TO-PHYSICS MAPPING
 *
 * Unified mapping specification - single source of truth
 * Maps audio analysis data to visual physics parameters
 *
 * Based on Master Liquid Light Integration Plan (Week 1 Day 3-4)
 *
 * Author: Claude Code
 * Date: 2025-10-29
 */

/**
 * Audio-to-Physics Parameter Ranges
 * All audio inputs normalized to 0-1 range
 */
export const AUDIO_PHYSICS_MAPPING = {
  /**
   * Splat Force - Impact energy of dye injections
   * Driven by bass frequencies (20-250Hz)
   */
  SPLAT_FORCE: {
    MIN: 8,      // Minimum splat intensity
    MAX: 23,     // Maximum splat intensity
    BASE: 5,     // Base force when no audio
  },

  /**
   * Thermal Rate - Frequency of thermal convection events
   * Driven by mid frequencies (250-2000Hz)
   */
  THERMAL_RATE: {
    MIN: 2,      // Minimum thermal events per 10 seconds
    MAX: 8,      // Maximum thermal events per 10 seconds
    BASE: 3,     // Base rate when no audio
  },

  /**
   * Color Phase - Hue rotation through palette
   * Driven by treble frequencies (2000-20000Hz)
   */
  COLOR_PHASE: {
    MIN: 0,            // Minimum color phase shift
    MAX: Math.PI * 2,  // Maximum color phase shift (full rotation)
    BASE: 0,           // Base phase when no audio
  },

  /**
   * Global Intensity - Overall visual brightness/strength
   * Driven by overall volume
   */
  GLOBAL_INTENSITY: {
    MIN: 0.4,    // Minimum overall intensity (prevents invisible effects)
    MAX: 1.0,    // Maximum overall intensity
    BASE: 0.6,   // Base intensity when no audio
  },

  /**
   * Curl Strength - Swirl/vorticity intensity
   * Driven by mid frequencies (enhances flow complexity)
   */
  CURL_STRENGTH: {
    MIN: 15,     // Minimum curl (gentle swirl)
    MAX: 30,     // Maximum curl (intense vortex)
    BASE: 20,    // Base curl when no audio
  },

  /**
   * Viscosity Modulation - Fluid thickness feeling
   * Inverse relationship with bass (low bass = thicker flow)
   */
  VISCOSITY: {
    MIN: 0.3,    // Minimum viscosity (water-like)
    MAX: 0.6,    // Maximum viscosity (oil-like)
    BASE: 0.4,   // Base viscosity (lava lamp feel)
  },
} as const;

/**
 * Apply audio value to physics range (basic linear mapping)
 *
 * @param audioValue - Normalized audio input (0-1)
 * @param range - Parameter range definition
 * @returns Mapped physics value
 */
export function mapAudioToPhysics(
  audioValue: number,
  range: { MIN: number; MAX: number; BASE: number }
): number {
  // Clamp audio value to 0-1
  const clamped = Math.max(0, Math.min(1, audioValue));

  // Linear interpolation
  return range.MIN + clamped * (range.MAX - range.MIN);
}

/**
 * ADVANCED CURVE UTILITIES - Piecewise linear with soft knee
 */

/**
 * Apply soft-knee compression curve to audio value
 * Provides smooth transition at threshold with adjustable knee width
 *
 * @param value - Input value (0-1)
 * @param threshold - Knee center point (0-1)
 * @param kneeWidth - Width of soft knee (0-1)
 * @returns Compressed value (0-1)
 */
export function softKnee(
  value: number,
  threshold: number = 0.5,
  kneeWidth: number = 0.2
): number {
  const halfKnee = kneeWidth / 2;
  const lowerBound = threshold - halfKnee;
  const upperBound = threshold + halfKnee;

  if (value < lowerBound) {
    // Below knee: linear
    return value;
  } else if (value > upperBound) {
    // Above knee: compressed
    const excess = value - upperBound;
    const compressionRatio = 0.5; // 2:1 compression
    return upperBound + excess * compressionRatio;
  } else {
    // Inside knee: smooth cubic interpolation
    const t = (value - lowerBound) / kneeWidth;
    const smoothT = t * t * (3 - 2 * t); // Smoothstep
    const linearValue = value;
    const compressedValue = upperBound + (value - upperBound) * 0.5;
    return linearValue * (1 - smoothT) + compressedValue * smoothT;
  }
}

/**
 * Apply power curve (exponential response)
 * Values < 1.0 = expansion, > 1.0 = compression
 *
 * @param value - Input value (0-1)
 * @param exponent - Curve exponent (0.5-2.0 typical)
 * @returns Curved value (0-1)
 */
export function powerCurve(value: number, exponent: number = 1.5): number {
  return Math.pow(Math.max(0, Math.min(1, value)), exponent);
}

/**
 * Apply S-curve (sigmoid) for smooth start/end
 *
 * @param value - Input value (0-1)
 * @param steepness - Curve steepness (higher = more pronounced)
 * @returns S-curved value (0-1)
 */
export function sCurve(value: number, steepness: number = 5): number {
  const clamped = Math.max(0, Math.min(1, value));
  const x = (clamped - 0.5) * steepness;
  return 1 / (1 + Math.exp(-x));
}

/**
 * EXPONENTIAL MOVING AVERAGE (EMA) SMOOTHER
 * Smooths audio values over time to prevent jitter
 */
export class EMASmootherBank {
  private smoothedValues: Map<string, number> = new Map();
  private alpha: number;

  /**
   * @param alpha - Smoothing factor (0-1). Lower = more smoothing
   *               0.1 = very smooth, 0.5 = balanced, 0.9 = responsive
   */
  constructor(alpha: number = 0.3) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Smooth a value with exponential moving average
   *
   * @param key - Unique identifier for this value stream
   * @param newValue - New raw value
   * @returns Smoothed value
   */
  smooth(key: string, newValue: number): number {
    const current = this.smoothedValues.get(key) ?? newValue;
    const smoothed = this.alpha * newValue + (1 - this.alpha) * current;
    this.smoothedValues.set(key, smoothed);
    return smoothed;
  }

  /**
   * Set alpha (smoothing factor) dynamically
   */
  setAlpha(alpha: number): void {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Reset all smoothed values
   */
  reset(): void {
    this.smoothedValues.clear();
  }

  /**
   * Get current smoothed value without updating
   */
  get(key: string, defaultValue: number = 0): number {
    return this.smoothedValues.get(key) ?? defaultValue;
  }
}

/**
 * Calculate physics parameters from audio data
 *
 * @param audioData - Audio analysis data
 * @returns Physics parameters object
 */
export interface AudioData {
  bass: number;
  mids: number;
  treble: number;
  volume: number;
  beatDetected: boolean;
  tempo?: number;
}

export interface PhysicsParams {
  splatForce: number;
  thermalRate: number;
  colorPhase: number;
  intensity: number;
  curlStrength: number;
  viscosity: number;
}

export function calculatePhysicsParams(audioData: AudioData | null): PhysicsParams {
  if (!audioData) {
    // Return base values when no audio
    return {
      splatForce: AUDIO_PHYSICS_MAPPING.SPLAT_FORCE.BASE,
      thermalRate: AUDIO_PHYSICS_MAPPING.THERMAL_RATE.BASE,
      colorPhase: AUDIO_PHYSICS_MAPPING.COLOR_PHASE.BASE,
      intensity: AUDIO_PHYSICS_MAPPING.GLOBAL_INTENSITY.BASE,
      curlStrength: AUDIO_PHYSICS_MAPPING.CURL_STRENGTH.BASE,
      viscosity: AUDIO_PHYSICS_MAPPING.VISCOSITY.BASE,
    };
  }

  return {
    splatForce: mapAudioToPhysics(audioData.bass, AUDIO_PHYSICS_MAPPING.SPLAT_FORCE),
    thermalRate: mapAudioToPhysics(audioData.mids, AUDIO_PHYSICS_MAPPING.THERMAL_RATE),
    colorPhase: mapAudioToPhysics(audioData.treble, AUDIO_PHYSICS_MAPPING.COLOR_PHASE),
    intensity: mapAudioToPhysics(audioData.volume, AUDIO_PHYSICS_MAPPING.GLOBAL_INTENSITY),
    curlStrength: mapAudioToPhysics(audioData.mids, AUDIO_PHYSICS_MAPPING.CURL_STRENGTH),
    viscosity: mapAudioToPhysics(1 - audioData.bass, AUDIO_PHYSICS_MAPPING.VISCOSITY), // Inverse for bass
  };
}

/**
 * Mode-specific intensity presets
 */
export const MODE_PRESETS = {
  off: {
    motionEnabled: false,
    intensity: 0,
  },
  ambient: {
    motionEnabled: true,
    intensity: 0.5,
  },
  'dance-floor': {
    motionEnabled: true,
    intensity: 0.8,
  },
  trip: {
    motionEnabled: true,
    intensity: 1.0,
  },
} as const;

export type ModeType = keyof typeof MODE_PRESETS;

/**
 * BEAT GATING - Adds burst energy on beat detection
 */

/**
 * Beat gate configuration
 */
export interface BeatGateConfig {
  burstMultiplier?: number; // Multiplier applied on beat (default: 1.5)
  decayTime?: number; // Decay time in milliseconds (default: 200ms)
  minInterval?: number; // Minimum time between bursts (default: 100ms)
}

/**
 * Beat Gate - Adds transient burst on beat detection
 */
export class BeatGate {
  private lastBeatTime: number = 0;
  private burstEnvelope: number = 0;
  private config: Required<BeatGateConfig>;

  constructor(config: BeatGateConfig = {}) {
    this.config = {
      burstMultiplier: config.burstMultiplier ?? 1.5,
      decayTime: config.decayTime ?? 200,
      minInterval: config.minInterval ?? 100,
    };
  }

  /**
   * Update beat gate and get current burst multiplier
   *
   * @param isBeat - Whether a beat was detected this frame
   * @param deltaTime - Time since last update (ms)
   * @returns Burst multiplier (1.0 = no burst, >1.0 = burst active)
   */
  update(isBeat: boolean, deltaTime: number): number {
    const now = performance.now();

    // Trigger burst on beat (with debounce)
    if (isBeat && now - this.lastBeatTime >= this.config.minInterval) {
      this.burstEnvelope = this.config.burstMultiplier;
      this.lastBeatTime = now;
    }

    // Decay burst envelope
    if (this.burstEnvelope > 1.0) {
      const decayRate = (this.config.burstMultiplier - 1.0) / this.config.decayTime;
      this.burstEnvelope = Math.max(1.0, this.burstEnvelope - decayRate * deltaTime);
    }

    return this.burstEnvelope;
  }

  /**
   * Get current burst multiplier without updating
   */
  getCurrentBurst(): number {
    return this.burstEnvelope;
  }

  /**
   * Reset burst state
   */
  reset(): void {
    this.burstEnvelope = 0;
    this.lastBeatTime = 0;
  }
}

/**
 * ENHANCED PHYSICS PARAMETER CALCULATOR
 * Uses smoothing, curves, and beat gating for polished audio reactivity
 */

export interface EnhancedAudioProcessor {
  smoother: EMASmootherBank;
  beatGate: BeatGate;
  lastUpdateTime: number;
}

/**
 * Create enhanced audio processor with smoothing and beat gating
 *
 * @param smoothingAlpha - EMA alpha (0.1-0.9, lower = smoother)
 * @param beatGateConfig - Beat gate configuration
 * @returns Audio processor instance
 */
export function createEnhancedAudioProcessor(
  smoothingAlpha: number = 0.3,
  beatGateConfig?: BeatGateConfig
): EnhancedAudioProcessor {
  return {
    smoother: new EMASmootherBank(smoothingAlpha),
    beatGate: new BeatGate(beatGateConfig),
    lastUpdateTime: performance.now(),
  };
}

/**
 * Calculate enhanced physics parameters with smoothing and curves
 *
 * @param audioData - Audio analysis data
 * @param processor - Enhanced audio processor (from createEnhancedAudioProcessor)
 * @returns Enhanced physics parameters
 */
export function calculateEnhancedPhysicsParams(
  audioData: AudioData | null,
  processor: EnhancedAudioProcessor
): PhysicsParams {
  const now = performance.now();
  const deltaTime = now - processor.lastUpdateTime;
  processor.lastUpdateTime = now;

  if (!audioData) {
    // Return base values when no audio
    return {
      splatForce: AUDIO_PHYSICS_MAPPING.SPLAT_FORCE.BASE,
      thermalRate: AUDIO_PHYSICS_MAPPING.THERMAL_RATE.BASE,
      colorPhase: AUDIO_PHYSICS_MAPPING.COLOR_PHASE.BASE,
      intensity: AUDIO_PHYSICS_MAPPING.GLOBAL_INTENSITY.BASE,
      curlStrength: AUDIO_PHYSICS_MAPPING.CURL_STRENGTH.BASE,
      viscosity: AUDIO_PHYSICS_MAPPING.VISCOSITY.BASE,
    };
  }

  // Smooth audio values
  const smoothedBass = processor.smoother.smooth('bass', audioData.bass);
  const smoothedMids = processor.smoother.smooth('mids', audioData.mids);
  const smoothedTreble = processor.smoother.smooth('treble', audioData.treble);
  const smoothedVolume = processor.smoother.smooth('volume', audioData.volume);

  // Apply curves for more musical response
  const curvedBass = powerCurve(smoothedBass, 1.2); // Slight expansion
  const curvedMids = softKnee(smoothedMids, 0.5, 0.3); // Soft compression
  const curvedTreble = sCurve(smoothedTreble, 4); // S-curve for smooth transitions

  // Update beat gate
  const beatBurst = processor.beatGate.update(
    audioData.beatDetected || false,
    deltaTime
  );

  // Map to physics parameters
  const baseSplatForce = mapAudioToPhysics(
    curvedBass,
    AUDIO_PHYSICS_MAPPING.SPLAT_FORCE
  );

  return {
    // Splat force with beat burst
    splatForce: baseSplatForce * beatBurst,

    // Thermal rate (curved mids)
    thermalRate: mapAudioToPhysics(
      curvedMids,
      AUDIO_PHYSICS_MAPPING.THERMAL_RATE
    ),

    // Color phase (smooth treble)
    colorPhase: mapAudioToPhysics(
      curvedTreble,
      AUDIO_PHYSICS_MAPPING.COLOR_PHASE
    ),

    // Global intensity (smooth volume)
    intensity: mapAudioToPhysics(
      smoothedVolume,
      AUDIO_PHYSICS_MAPPING.GLOBAL_INTENSITY
    ),

    // Curl strength (curved mids)
    curlStrength: mapAudioToPhysics(
      curvedMids,
      AUDIO_PHYSICS_MAPPING.CURL_STRENGTH
    ),

    // Viscosity (inverse smoothed bass)
    viscosity: mapAudioToPhysics(
      1 - smoothedBass,
      AUDIO_PHYSICS_MAPPING.VISCOSITY
    ),
  };
}
