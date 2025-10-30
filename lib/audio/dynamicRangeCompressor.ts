/**
 * DYNAMIC RANGE COMPRESSOR
 *
 * Reduces the dynamic range of audio to prevent jarring volume changes.
 * Similar to audio production compressors.
 *
 * Features:
 * - Threshold-based compression
 * - Adjustable ratio (2:1, 4:1, etc.)
 * - Attack and release times
 * - Makeup gain
 * - Smooth envelope following
 *
 * Usage:
 * ```typescript
 * const compressor = new DynamicRangeCompressor({
 *   threshold: 0.6,
 *   ratio: 3.0,
 *   attack: 0.01,
 *   release: 0.1,
 * });
 *
 * const compressed = compressor.process(audioLevel, deltaTime);
 * ```
 */

export interface DRCConfig {
  threshold?: number; // Level above which compression starts (0-1, default: 0.6)
  ratio?: number; // Compression ratio (1-20, default: 3.0)
  attack?: number; // Attack time in seconds (default: 0.01)
  release?: number; // Release time in seconds (default: 0.1)
  knee?: number; // Soft knee width (0-1, default: 0.1)
  makeupGain?: number; // Gain compensation (dB, default: 0)
}

export class DynamicRangeCompressor {
  private config: Required<DRCConfig>;
  private gain = 1.0; // Current gain reduction
  private envelope = 0; // Envelope follower

  constructor(config: DRCConfig = {}) {
    this.config = {
      threshold: config.threshold ?? 0.6,
      ratio: config.ratio ?? 3.0,
      attack: config.attack ?? 0.01,
      release: config.release ?? 0.1,
      knee: config.knee ?? 0.1,
      makeupGain: config.makeupGain ?? 0,
    };
  }

  /**
   * Process audio sample
   * @param input - Input audio level (0-1)
   * @param deltaTime - Time since last sample (seconds)
   * @returns Compressed audio level
   */
  process(input: number, deltaTime: number): number {
    // Envelope follower (track input level)
    const absInput = Math.abs(input);

    if (absInput > this.envelope) {
      // Attack (fast rise)
      const attackCoef = Math.exp(-deltaTime / this.config.attack);
      this.envelope = attackCoef * this.envelope + (1 - attackCoef) * absInput;
    } else {
      // Release (slower fall)
      const releaseCoef = Math.exp(-deltaTime / this.config.release);
      this.envelope = releaseCoef * this.envelope + (1 - releaseCoef) * absInput;
    }

    // Calculate gain reduction
    let gainReduction = 1.0;

    if (this.envelope > this.config.threshold) {
      const excess = this.envelope - this.config.threshold;

      // Soft knee
      if (excess < this.config.knee) {
        // Within knee: smooth transition
        const kneeT = excess / this.config.knee;
        const smoothT = kneeT * kneeT * (3 - 2 * kneeT); // Smoothstep
        const compressed = excess / this.config.ratio;
        const kneeCompressed = excess * (1 - smoothT) + compressed * smoothT;

        const targetLevel = this.config.threshold + kneeCompressed;
        gainReduction = targetLevel / this.envelope;
      } else {
        // Above knee: full compression
        const compressed = excess / this.config.ratio;
        const targetLevel = this.config.threshold + compressed;
        gainReduction = targetLevel / this.envelope;
      }
    }

    // Apply makeup gain (convert dB to linear)
    const makeupGainLinear = Math.pow(10, this.config.makeupGain / 20);

    // Apply gain reduction
    return input * gainReduction * makeupGainLinear;
  }

  /**
   * Get current gain reduction in dB
   * @returns Gain reduction in dB (negative values)
   */
  getGainReductionDB(): number {
    return 20 * Math.log10(this.gain);
  }

  /**
   * Get current envelope level
   * @returns Envelope level (0-1)
   */
  getEnvelope(): number {
    return this.envelope;
  }

  /**
   * Reset compressor state
   */
  reset(): void {
    this.gain = 1.0;
    this.envelope = 0;
  }

  /**
   * Set threshold
   * @param threshold - New threshold (0-1)
   */
  setThreshold(threshold: number): void {
    this.config.threshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Set ratio
   * @param ratio - New compression ratio (1-20)
   */
  setRatio(ratio: number): void {
    this.config.ratio = Math.max(1, Math.min(20, ratio));
  }
}

/**
 * Create compressor with default settings
 */
export function createCompressor(config?: DRCConfig): DynamicRangeCompressor {
  return new DynamicRangeCompressor(config);
}

/**
 * Create gentle compressor (subtle compression)
 */
export function createGentleCompressor(): DynamicRangeCompressor {
  return new DynamicRangeCompressor({
    threshold: 0.7,
    ratio: 2.0,
    attack: 0.02,
    release: 0.15,
    knee: 0.2,
  });
}

/**
 * Create aggressive compressor (heavy compression)
 */
export function createAggressiveCompressor(): DynamicRangeCompressor {
  return new DynamicRangeCompressor({
    threshold: 0.5,
    ratio: 6.0,
    attack: 0.005,
    release: 0.05,
    knee: 0.05,
  });
}
