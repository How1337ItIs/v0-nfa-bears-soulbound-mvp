/**
 * TEMPO TRACKER - Real-time tempo estimation and tracking
 *
 * Tracks musical tempo (BPM) changes over time with stability analysis.
 * More sophisticated than simple beat interval averaging.
 *
 * Features:
 * - Tempo estimation from beat intervals
 * - Tempo stability measurement
 * - Tempo change detection
 * - Multiple tempo candidates (for complex rhythms)
 *
 * Usage:
 * ```typescript
 * const tracker = new TempoTracker();
 *
 * // Record beats as they're detected
 * tracker.recordBeat(timestamp);
 *
 * // Get current tempo
 * const tempo = tracker.getCurrentTempo(); // BPM
 * const stability = tracker.getTempoStability(); // 0-1
 * ```
 */

export interface TempoEstimate {
  bpm: number; // Estimated tempo in BPM
  confidence: number; // 0-1, confidence in estimate
  stability: number; // 0-1, how stable tempo is
  variance: number; // Beat interval variance
}

export interface TempoTrackerConfig {
  windowSize?: number; // Number of beats to analyze (default: 8)
  minBPM?: number; // Minimum plausible BPM (default: 60)
  maxBPM?: number; // Maximum plausible BPM (default: 180)
  stabilityThreshold?: number; // Variance threshold for "stable" (default: 0.1)
}

export class TempoTracker {
  private config: Required<TempoTrackerConfig>;
  private beatTimes: number[] = [];
  private tempoHistory: number[] = [];
  private maxTempoHistory = 20;

  constructor(config: TempoTrackerConfig = {}) {
    this.config = {
      windowSize: config.windowSize ?? 8,
      minBPM: config.minBPM ?? 60,
      maxBPM: config.maxBPM ?? 180,
      stabilityThreshold: config.stabilityThreshold ?? 0.1,
    };
  }

  /**
   * Record a beat timestamp
   * @param timestamp - Beat timestamp in milliseconds
   */
  recordBeat(timestamp: number): void {
    this.beatTimes.push(timestamp);

    // Keep only recent beats
    if (this.beatTimes.length > this.config.windowSize) {
      this.beatTimes.shift();
    }

    // Update tempo history
    const tempo = this.getCurrentTempo();
    if (tempo > 0) {
      this.tempoHistory.push(tempo);

      if (this.tempoHistory.length > this.maxTempoHistory) {
        this.tempoHistory.shift();
      }
    }
  }

  /**
   * Get current tempo estimate
   * @returns BPM estimate
   */
  getCurrentTempo(): number {
    if (this.beatTimes.length < 2) return 0;

    const intervals = this.calculateIntervals();
    if (intervals.length === 0) return 0;

    // Use median for robustness
    const sortedIntervals = [...intervals].sort((a, b) => a - b);
    const medianInterval = sortedIntervals[Math.floor(sortedIntervals.length / 2)];

    // Convert interval (ms) to BPM
    const bpm = (60 / medianInterval) * 1000;

    // Clamp to plausible range
    return Math.max(this.config.minBPM, Math.min(this.config.maxBPM, bpm));
  }

  /**
   * Get tempo stability (0-1, 1 = very stable)
   * @returns Stability measure
   */
  getTempoStability(): number {
    if (this.beatTimes.length < 3) return 0;

    const intervals = this.calculateIntervals();
    if (intervals.length < 2) return 0;

    // Calculate coefficient of variation (stdDev / mean)
    const mean = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    const coefficientOfVariation = stdDev / mean;

    // Convert to stability score (0-1)
    // Low CV = high stability
    return Math.max(0, 1 - Math.min(1, coefficientOfVariation / this.config.stabilityThreshold));
  }

  /**
   * Get full tempo estimate with confidence
   * @returns Complete tempo estimate
   */
  getTempoEstimate(): TempoEstimate {
    const bpm = this.getCurrentTempo();
    const stability = this.getTempoStability();
    const intervals = this.calculateIntervals();

    // Calculate variance
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;

    // Confidence based on:
    // 1. Number of beats collected
    // 2. Stability of tempo
    const sampleConfidence = Math.min(1, this.beatTimes.length / this.config.windowSize);
    const confidence = sampleConfidence * stability;

    return {
      bpm,
      confidence,
      stability,
      variance,
    };
  }

  /**
   * Detect tempo change
   * @param threshold - BPM change threshold (default: 10)
   * @returns Whether tempo changed significantly
   */
  detectTempoChange(threshold: number = 10): boolean {
    if (this.tempoHistory.length < 5) return false;

    const recent = this.tempoHistory.slice(-3);
    const older = this.tempoHistory.slice(-6, -3);

    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;

    const change = Math.abs(recentAvg - olderAvg);

    return change > threshold;
  }

  /**
   * Get tempo trend (increasing, decreasing, stable)
   * @returns Tempo trend
   */
  getTempoTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.tempoHistory.length < 5) return 'stable';

    const recent = this.tempoHistory.slice(-3);
    const older = this.tempoHistory.slice(-6, -3);

    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;

    const change = recentAvg - olderAvg;

    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  /**
   * Calculate beat intervals
   * @returns Array of intervals in milliseconds
   */
  private calculateIntervals(): number[] {
    const intervals = [];

    for (let i = 1; i < this.beatTimes.length; i++) {
      const interval = this.beatTimes[i] - this.beatTimes[i - 1];

      // Filter out implausible intervals
      const minInterval = (60 / this.config.maxBPM) * 1000;
      const maxInterval = (60 / this.config.minBPM) * 1000;

      if (interval >= minInterval && interval <= maxInterval) {
        intervals.push(interval);
      }
    }

    return intervals;
  }

  /**
   * Reset tracker state
   */
  reset(): void {
    this.beatTimes = [];
    this.tempoHistory = [];
    this.lastOnsetTime = 0;
    this.previousEnergy = 0;
    this.attackStartTime = null;
  }

  /**
   * Get tracker statistics
   */
  getStats() {
    return {
      beatsRecorded: this.beatTimes.length,
      tempoHistory: [...this.tempoHistory],
      currentTempo: this.getCurrentTempo(),
      stability: this.getTempoStability(),
      trend: this.getTempoTrend(),
    };
  }
}

/**
 * Create tempo tracker with standard configuration
 */
export function createTempoTracker(config?: TempoTrackerConfig): TempoTracker {
  return new TempoTracker(config);
}
