/**
 * ONSET DETECTOR - Sudden energy increase detection
 *
 * Detects musical onsets (attacks, transients) which are different from beats.
 * Useful for triggering visual effects on drums, synth stabs, etc.
 *
 * Features:
 * - Energy-based onset detection
 * - Adaptive threshold with history
 * - Configurable sensitivity
 * - Onset strength measurement
 *
 * Usage:
 * ```typescript
 * const detector = new OnsetDetector();
 * const result = detector.detect(currentEnergy);
 * if (result.isOnset) {
 *   triggerVisualBurst(result.strength);
 * }
 * ```
 */

export interface OnsetDetectionResult {
  isOnset: boolean;
  strength: number; // 0-1, how strong the onset is
  energy: number; // Current energy level
  threshold: number; // Adaptive threshold
  timestamp: number;
}

export interface OnsetDetectorConfig {
  historySize?: number; // Number of samples to track (default: 10)
  thresholdMultiplier?: number; // Threshold = average * multiplier (default: 1.8)
  minOnsetInterval?: number; // Minimum time between onsets (ms, default: 50)
  attackTime?: number; // How fast onset must rise (ms, default: 20)
}

export class OnsetDetector {
  private config: Required<OnsetDetectorConfig>;
  private energyHistory: number[] = [];
  private lastOnsetTime = 0;
  private previousEnergy = 0;
  private attackStartTime: number | null = null;
  private attackStartEnergy = 0;

  constructor(config: OnsetDetectorConfig = {}) {
    this.config = {
      historySize: config.historySize ?? 10,
      thresholdMultiplier: config.thresholdMultiplier ?? 1.8,
      minOnsetInterval: config.minOnsetInterval ?? 50,
      attackTime: config.attackTime ?? 20,
    };
  }

  /**
   * Detect onset in current energy
   * @param currentEnergy - Current audio energy level (0-1 typical)
   * @returns Onset detection result
   */
  detect(currentEnergy: number): OnsetDetectionResult {
    const now = performance.now();

    // Add to history
    this.energyHistory.push(currentEnergy);
    if (this.energyHistory.length > this.config.historySize) {
      this.energyHistory.shift();
    }

    // Calculate adaptive threshold
    const average = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const threshold = average * this.config.thresholdMultiplier;

    // Check for rapid energy increase
    const energyIncrease = currentEnergy - this.previousEnergy;
    const isRisingQuickly = energyIncrease > 0 && currentEnergy > threshold;

    // Track attack phase
    if (isRisingQuickly && this.attackStartTime === null) {
      this.attackStartTime = now;
      this.attackStartEnergy = this.previousEnergy;
    }

    // Detect onset if:
    // 1. Energy above threshold
    // 2. Rising quickly
    // 3. Attack time within limit
    // 4. Not within refractory period
    const timeSinceAttackStart = this.attackStartTime !== null
      ? now - this.attackStartTime
      : Infinity;

    const timeSinceLastOnset = now - this.lastOnsetTime;

    const isOnset =
      isRisingQuickly &&
      timeSinceAttackStart <= this.config.attackTime &&
      timeSinceLastOnset >= this.config.minOnsetInterval;

    // Calculate onset strength (0-1)
    let strength = 0;
    if (isOnset) {
      const energyDelta = currentEnergy - this.attackStartEnergy;
      const thresholdExcess = currentEnergy - threshold;
      strength = Math.min(1, (energyDelta + thresholdExcess) / 2);

      this.lastOnsetTime = now;
    }

    // Reset attack tracking if energy drops
    if (energyIncrease <= 0) {
      this.attackStartTime = null;
    }

    // Update previous energy
    this.previousEnergy = currentEnergy;

    return {
      isOnset,
      strength,
      energy: currentEnergy,
      threshold,
      timestamp: now,
    };
  }

  /**
   * Reset detector state
   */
  reset(): void {
    this.energyHistory = [];
    this.lastOnsetTime = 0;
    this.previousEnergy = 0;
    this.attackStartTime = null;
  }

  /**
   * Get detector statistics
   */
  getStats() {
    const average = this.energyHistory.length > 0
      ? this.energyHistory.reduce((a, b) => a + b) / this.energyHistory.length
      : 0;

    return {
      averageEnergy: average,
      threshold: average * this.config.thresholdMultiplier,
      historySize: this.energyHistory.length,
      lastOnsetTime: this.lastOnsetTime,
    };
  }
}

/**
 * Create onset detector with recommended defaults
 */
export function createOnsetDetector(config?: OnsetDetectorConfig): OnsetDetector {
  return new OnsetDetector(config);
}

/**
 * Create onset detector optimized for drums/percussion
 */
export function createPercussiveOnsetDetector(): OnsetDetector {
  return new OnsetDetector({
    thresholdMultiplier: 1.5, // More sensitive
    minOnsetInterval: 30, // Faster attacks allowed
    attackTime: 15, // Very fast attack
  });
}

/**
 * Create onset detector for melodic content
 */
export function createMelodicOnsetDetector(): OnsetDetector {
  return new OnsetDetector({
    thresholdMultiplier: 2.0, // Less sensitive
    minOnsetInterval: 100, // Slower attacks
    attackTime: 50, // Longer attack allowed
  });
}
