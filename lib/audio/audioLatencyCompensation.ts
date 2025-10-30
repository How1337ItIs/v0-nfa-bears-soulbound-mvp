/**
 * @file audioLatencyCompensation.ts
 * @description Audio latency compensation for synchronized visual effects
 */

export interface LatencyCompensationConfig {
  // Audio system latency (ms)
  audioLatency: number;
  // Visual processing latency (ms)
  visualLatency: number;
  // Network latency (ms) - for streaming audio
  networkLatency: number;
  // Safety margin (ms)
  safetyMargin: number;
}

export class AudioLatencyCompensator {
  private config: Required<LatencyCompensationConfig>;
  private audioBuffer: Array<{ timestamp: number; data: any }> = [];
  private maxBufferSize: number = 100;

  constructor(config: Partial<LatencyCompensationConfig> = {}) {
    this.config = {
      audioLatency: config.audioLatency ?? 50,
      visualLatency: config.visualLatency ?? 16, // ~1 frame at 60fps
      networkLatency: config.networkLatency ?? 0,
      safetyMargin: config.safetyMargin ?? 20,
    };
  }

  /**
   * Add audio data with timestamp for compensation
   */
  addAudioData(data: any, timestamp: number = performance.now()): void {
    this.audioBuffer.push({ timestamp, data });

    // Keep buffer size manageable
    if (this.audioBuffer.length > this.maxBufferSize) {
      this.audioBuffer.shift();
    }
  }

  /**
   * Get compensated audio data for current visual frame
   */
  getCompensatedData(): any | null {
    const now = performance.now();
    const totalLatency = this.config.audioLatency + 
                        this.config.visualLatency + 
                        this.config.networkLatency + 
                        this.config.safetyMargin;

    // Find audio data that should be playing now
    const targetTime = now - totalLatency;

    // Find closest audio data
    let closest = null;
    let closestDiff = Infinity;

    for (const entry of this.audioBuffer) {
      const diff = Math.abs(entry.timestamp - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = entry.data;
      }
    }

    return closest;
  }

  /**
   * Update latency configuration
   */
  updateConfig(newConfig: Partial<LatencyCompensationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear audio buffer
   */
  clear(): void {
    this.audioBuffer = [];
  }

  /**
   * Get current latency statistics
   */
  getLatencyStats() {
    return {
      totalLatency: this.config.audioLatency + 
                   this.config.visualLatency + 
                   this.config.networkLatency + 
                   this.config.safetyMargin,
      bufferSize: this.audioBuffer.length,
      config: this.config,
    };
  }
}

/**
 * Auto-detect audio latency using beat detection
 */
export class LatencyAutoDetector {
  private beatTimes: number[] = [];
  private visualBeatTimes: number[] = [];
  private maxSamples: number = 20;

  /**
   * Record audio beat timestamp
   */
  recordAudioBeat(timestamp: number = performance.now()): void {
    this.beatTimes.push(timestamp);
    if (this.beatTimes.length > this.maxSamples) {
      this.beatTimes.shift();
    }
  }

  /**
   * Record visual beat timestamp (when we see the beat effect)
   */
  recordVisualBeat(timestamp: number = performance.now()): void {
    this.visualBeatTimes.push(timestamp);
    if (this.visualBeatTimes.length > this.maxSamples) {
      this.visualBeatTimes.shift();
    }
  }

  /**
   * Calculate detected latency
   */
  calculateLatency(): number | null {
    if (this.beatTimes.length < 3 || this.visualBeatTimes.length < 3) {
      return null;
    }

    // Calculate average interval between beats
    const audioIntervals = this.calculateIntervals(this.beatTimes);
    const visualIntervals = this.calculateIntervals(this.visualBeatTimes);

    if (audioIntervals.length === 0 || visualIntervals.length === 0) {
      return null;
    }

    // Find best alignment
    let bestLatency = 0;
    let bestScore = Infinity;

    for (let offset = 0; offset < 200; offset += 5) {
      const score = this.calculateAlignmentScore(audioIntervals, visualIntervals, offset);
      if (score < bestScore) {
        bestScore = score;
        bestLatency = offset;
      }
    }

    return bestLatency;
  }

  private calculateIntervals(times: number[]): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }
    return intervals;
  }

  private calculateAlignmentScore(audioIntervals: number[], visualIntervals: number[], offset: number): number {
    let score = 0;
    const minLength = Math.min(audioIntervals.length, visualIntervals.length);

    for (let i = 0; i < minLength; i++) {
      const diff = Math.abs(audioIntervals[i] - visualIntervals[i]);
      score += diff;
    }

    return score / minLength;
  }

  /**
   * Reset detection data
   */
  reset(): void {
    this.beatTimes = [];
    this.visualBeatTimes = [];
  }
}

/**
 * Create latency compensator with auto-detection
 */
export function createSmartLatencyCompensator(): {
  compensator: AudioLatencyCompensator;
  detector: LatencyAutoDetector;
} {
  const compensator = new AudioLatencyCompensator();
  const detector = new LatencyAutoDetector();

  return { compensator, detector };
}
