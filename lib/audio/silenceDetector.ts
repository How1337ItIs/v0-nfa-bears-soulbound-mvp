/**
 * SILENCE DETECTOR
 *
 * Detects extended periods of silence in audio.
 * Useful for pausing expensive processing, showing idle state, or auto-transitioning.
 *
 * Features:
 * - Configurable silence threshold
 * - Duration tracking
 * - Silence/sound transition events
 * - Grace period before declaring silence
 *
 * Usage:
 * ```typescript
 * const detector = new SilenceDetector({ threshold: 0.01, duration: 3000 });
 *
 * const result = detector.update(audioLevel, currentTime);
 * if (result.isSilent) {
 *   pauseVisualProcessing();
 * }
 * ```
 */

export interface SilenceDetectionResult {
  isSilent: boolean;
  silenceDuration: number; // ms of continuous silence
  timeSinceLastSound: number; // ms since last non-silent sample
  audioLevel: number; // Current audio level
  threshold: number; // Silence threshold
}

export interface SilenceDetectorConfig {
  threshold?: number; // Level below which is considered silent (default: 0.01)
  minimumDuration?: number; // Minimum silence duration to report (ms, default: 3000)
  gracePeriod?: number; // Brief sounds don't reset silence (ms, default: 500)
}

export class SilenceDetector {
  private config: Required<SilenceDetectorConfig>;
  private silenceStartTime: number | null = null;
  private lastNonSilentTime = 0;
  private lastSilentState = false;
  private gracePeriodTimer: number | null = null;

  constructor(config: SilenceDetectorConfig = {}) {
    this.config = {
      threshold: config.threshold ?? 0.01,
      minimumDuration: config.minimumDuration ?? 3000,
      gracePeriod: config.gracePeriod ?? 500,
    };
  }

  /**
   * Update with current audio level
   * @param audioLevel - Current audio level (0-1)
   * @param currentTime - Current timestamp (ms)
   * @returns Silence detection result
   */
  update(audioLevel: number, currentTime: number): SilenceDetectionResult {
    const isBelowThreshold = audioLevel < this.config.threshold;

    if (!isBelowThreshold) {
      // Sound detected
      this.lastNonSilentTime = currentTime;

      // Cancel grace period
      if (this.gracePeriodTimer !== null) {
        this.gracePeriodTimer = null;
      }

      // Reset silence tracking
      if (this.lastSilentState) {
        this.silenceStartTime = null;
      }

      this.lastSilentState = false;

      return {
        isSilent: false,
        silenceDuration: 0,
        timeSinceLastSound: 0,
        audioLevel,
        threshold: this.config.threshold,
      };
    }

    // Below threshold - potentially silent
    const timeSinceLastSound = currentTime - this.lastNonSilentTime;

    // Start silence timer if not already started
    if (this.silenceStartTime === null && timeSinceLastSound > this.config.gracePeriod) {
      this.silenceStartTime = currentTime;
    }

    // Calculate silence duration
    const silenceDuration = this.silenceStartTime !== null
      ? currentTime - this.silenceStartTime
      : 0;

    // Determine if we're in confirmed silence
    const isSilent = silenceDuration >= this.config.minimumDuration;

    // Track transition
    if (isSilent && !this.lastSilentState) {
      console.log('[SilenceDetector] Silence detected after', timeSinceLastSound.toFixed(0), 'ms');
    }

    this.lastSilentState = isSilent;

    return {
      isSilent,
      silenceDuration,
      timeSinceLastSound,
      audioLevel,
      threshold: this.config.threshold,
    };
  }

  /**
   * Check if currently silent
   * @returns Whether currently in silence
   */
  isSilent(): boolean {
    return this.lastSilentState;
  }

  /**
   * Get time since last sound
   * @param currentTime - Current timestamp (ms)
   * @returns Milliseconds since last sound
   */
  getTimeSinceLastSound(currentTime: number): number {
    return currentTime - this.lastNonSilentTime;
  }

  /**
   * Reset detector state
   */
  reset(): void {
    this.silenceStartTime = null;
    this.lastNonSilentTime = 0;
    this.lastSilentState = false;
    this.gracePeriodTimer = null;
  }

  /**
   * Set threshold
   * @param threshold - New silence threshold
   */
  setThreshold(threshold: number): void {
    this.config.threshold = Math.max(0, Math.min(1, threshold));
  }
}

/**
 * Create silence detector with standard config
 */
export function createSilenceDetector(config?: SilenceDetectorConfig): SilenceDetector {
  return new SilenceDetector(config);
}
