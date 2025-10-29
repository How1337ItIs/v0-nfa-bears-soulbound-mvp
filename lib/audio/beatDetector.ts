/**
 * BEAT DETECTOR - Adaptive Threshold Beat Detection
 *
 * Detects beats in audio using:
 * - Adaptive threshold (exponential moving average)
 * - Refractory period (prevents double-detection)
 * - BPM estimation (based on beat intervals)
 * - Confidence scoring
 *
 * Based on sound energy tracking and statistical analysis.
 */

export interface BeatDetectionResult {
  isBeat: boolean;
  confidence: number; // 0-1, how confident we are this is a beat
  bpmEstimate: number; // Estimated BPM based on recent beats
  energy: number; // Current energy level
  averageEnergy: number; // Running average energy
  timestamp?: number; // Timestamp of detection (ms)
}

export interface BeatDetectorConfig {
  // Energy averaging
  energyAlpha?: number; // EMA alpha for average energy (default: 0.98)
  varianceAlpha?: number; // EMA alpha for variance (default: 0.98)

  // Beat detection
  thresholdMultiplier?: number; // How much above average to trigger (default: 1.5)
  minConfidence?: number; // Minimum confidence to report beat (default: 0.5)

  // Refractory period
  refractoryPeriodMs?: number; // Minimum time between beats (default: 150ms = 400 BPM max)

  // BPM estimation
  bpmHistorySize?: number; // Number of intervals to track (default: 8)
  bpmMin?: number; // Minimum plausible BPM (default: 60)
  bpmMax?: number; // Maximum plausible BPM (default: 180)
}

/**
 * BeatDetector - Adaptive threshold beat detection with BPM estimation
 *
 * Usage:
 * ```typescript
 * const detector = new BeatDetector();
 * const energy = bassLevel * 100; // 0-100 range
 * const result = detector.detect(energy);
 * if (result.isBeat) {
 *   console.log(`Beat detected! BPM: ${result.bpmEstimate}`);
 * }
 * ```
 */
export class BeatDetector {
  // Configuration
  private config: Required<BeatDetectorConfig>;

  // Energy tracking
  private averageEnergy: number = 0;
  private variance: number = 0;
  private initialized: boolean = false;

  // Beat tracking
  private lastBeatTime: number = 0;
  private beatIntervals: number[] = [];

  // Sample counter (for initialization)
  private sampleCount: number = 0;
  private readonly INIT_SAMPLES = 10; // Number of samples before we start detecting

  constructor(config: BeatDetectorConfig = {}) {
    // Apply defaults
    this.config = {
      energyAlpha: config.energyAlpha ?? 0.98,
      varianceAlpha: config.varianceAlpha ?? 0.98,
      thresholdMultiplier: config.thresholdMultiplier ?? 1.5,
      minConfidence: config.minConfidence ?? 0.5,
      refractoryPeriodMs: config.refractoryPeriodMs ?? 150,
      bpmHistorySize: config.bpmHistorySize ?? 8,
      bpmMin: config.bpmMin ?? 60,
      bpmMax: config.bpmMax ?? 180,
    };
  }

  /**
   * Detect beat in current audio energy
   * @param currentEnergy Current audio energy level (typically 0-100)
   * @returns Beat detection result
   */
  detect(currentEnergy: number): BeatDetectionResult {
    const now = performance.now();

    // Initialize with first samples
    if (this.sampleCount < this.INIT_SAMPLES) {
      this.averageEnergy = currentEnergy;
      this.variance = 0;
      this.sampleCount++;

      return {
        isBeat: false,
        confidence: 0,
        bpmEstimate: 0,
        energy: currentEnergy,
        averageEnergy: this.averageEnergy,
        timestamp: now,
      };
    }

    // Update running averages using exponential moving average
    const alpha = this.config.energyAlpha;
    const prevAverage = this.averageEnergy;
    this.averageEnergy = alpha * this.averageEnergy + (1 - alpha) * currentEnergy;

    // Update variance
    const diff = currentEnergy - this.averageEnergy;
    this.variance = this.config.varianceAlpha * this.variance +
                    (1 - this.config.varianceAlpha) * (diff * diff);

    // Calculate adaptive threshold
    const stdDev = Math.sqrt(this.variance);
    const threshold = this.averageEnergy + this.config.thresholdMultiplier * stdDev;

    // Check refractory period
    const timeSinceLastBeat = now - this.lastBeatTime;
    const inRefractoryPeriod = timeSinceLastBeat < this.config.refractoryPeriodMs;

    // Detect beat: energy spike above threshold
    const energyAboveThreshold = currentEnergy > threshold;
    const isBeat = energyAboveThreshold && !inRefractoryPeriod && currentEnergy > prevAverage;

    // Calculate confidence (0-1)
    // Based on: how far above threshold + energy increase rate
    let confidence = 0;
    if (energyAboveThreshold) {
      const excessEnergy = currentEnergy - threshold;
      const normalizedExcess = excessEnergy / (stdDev + 1); // Prevent division by zero
      confidence = Math.min(1.0, normalizedExcess / 2); // Cap at 1.0

      // Boost confidence if energy is increasing rapidly
      const energyIncrease = currentEnergy - prevAverage;
      if (energyIncrease > 0) {
        confidence = Math.min(1.0, confidence * 1.2);
      }
    }

    // Update beat history if beat detected
    if (isBeat && confidence >= this.config.minConfidence) {
      if (this.lastBeatTime > 0) {
        const interval = timeSinceLastBeat;

        // Only add plausible intervals (60-180 BPM = 1000-333ms intervals)
        const minInterval = (60 / this.config.bpmMax) * 1000;
        const maxInterval = (60 / this.config.bpmMin) * 1000;

        if (interval >= minInterval && interval <= maxInterval) {
          this.beatIntervals.push(interval);

          // Keep only recent intervals
          if (this.beatIntervals.length > this.config.bpmHistorySize) {
            this.beatIntervals.shift();
          }
        }
      }

      this.lastBeatTime = now;
    }

    // Estimate BPM from beat intervals
    const bpmEstimate = this.estimateBPM();

    return {
      isBeat: isBeat && confidence >= this.config.minConfidence,
      confidence,
      bpmEstimate,
      energy: currentEnergy,
      averageEnergy: this.averageEnergy,
      timestamp: now,
    };
  }

  /**
   * Estimate BPM from recent beat intervals
   * Uses median interval to be robust to outliers
   */
  private estimateBPM(): number {
    if (this.beatIntervals.length === 0) {
      return 0;
    }

    // Use median interval (more robust than mean)
    const sorted = [...this.beatIntervals].sort((a, b) => a - b);
    const medianInterval = sorted[Math.floor(sorted.length / 2)];

    // Convert interval (ms) to BPM
    const bpm = (60 / medianInterval) * 1000;

    // Clamp to plausible range
    return Math.max(this.config.bpmMin, Math.min(this.config.bpmMax, bpm));
  }

  /**
   * Reset detector state (useful when audio source changes)
   */
  reset(): void {
    this.averageEnergy = 0;
    this.variance = 0;
    this.lastBeatTime = 0;
    this.beatIntervals = [];
    this.sampleCount = 0;
    this.initialized = false;
  }

  /**
   * Get current detection statistics (for debugging/monitoring)
   */
  getStats() {
    return {
      averageEnergy: this.averageEnergy,
      variance: this.variance,
      stdDev: Math.sqrt(this.variance),
      threshold: this.averageEnergy + this.config.thresholdMultiplier * Math.sqrt(this.variance),
      beatCount: this.beatIntervals.length,
      lastBeatTime: this.lastBeatTime,
      bpmEstimate: this.estimateBPM(),
    };
  }
}

/**
 * Create a default beat detector with standard configuration
 */
export function createBeatDetector(config?: BeatDetectorConfig): BeatDetector {
  return new BeatDetector(config);
}

/**
 * Create a beat detector optimized for high-energy dance music
 */
export function createDanceFloorDetector(): BeatDetector {
  return new BeatDetector({
    thresholdMultiplier: 1.3, // More sensitive
    refractoryPeriodMs: 120, // Faster beats allowed
    bpmMin: 100, // Dance music range
    bpmMax: 180,
  });
}

/**
 * Create a beat detector optimized for slower, ambient music
 */
export function createAmbientDetector(): BeatDetector {
  return new BeatDetector({
    thresholdMultiplier: 1.8, // Less sensitive (subtle beats)
    refractoryPeriodMs: 200, // Slower beats
    bpmMin: 60,
    bpmMax: 120,
  });
}
