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
 * Apply audio value to physics range
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
