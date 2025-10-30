/**
 * @file audioDucking.ts
 * @description Audio ducking for UI interactions and notifications
 */

export interface DuckingConfig {
  // Ducking intensity (0-1, where 1 = full duck)
  intensity: number;
  // Attack time (ms) - how fast to duck
  attackTime: number;
  // Release time (ms) - how fast to recover
  releaseTime: number;
  // Frequency range to duck (Hz)
  frequencyRange: {
    low: number;
    high: number;
  };
}

export class AudioDucker {
  private config: Required<DuckingConfig>;
  private isDucking: boolean = false;
  private duckLevel: number = 1.0;
  private targetDuckLevel: number = 1.0;
  private lastUpdateTime: number = 0;

  constructor(config: Partial<DuckingConfig> = {}) {
    this.config = {
      intensity: config.intensity ?? 0.7,
      attackTime: config.attackTime ?? 100,
      releaseTime: config.releaseTime ?? 300,
      frequencyRange: config.frequencyRange ?? { low: 20, high: 20000 },
    };
    this.lastUpdateTime = performance.now();
  }

  /**
   * Start ducking (e.g., when UI interaction begins)
   */
  startDucking(): void {
    this.isDucking = true;
    this.targetDuckLevel = 1.0 - this.config.intensity;
  }

  /**
   * Stop ducking (e.g., when UI interaction ends)
   */
  stopDucking(): void {
    this.isDucking = false;
    this.targetDuckLevel = 1.0;
  }

  /**
   * Update ducking level and return current multiplier
   */
  update(): number {
    const now = performance.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    if (this.isDucking) {
      // Attack phase - duck down
      const attackRate = this.config.intensity / this.config.attackTime;
      this.duckLevel = Math.max(
        this.targetDuckLevel,
        this.duckLevel - attackRate * deltaTime
      );
    } else {
      // Release phase - recover
      const releaseRate = this.config.intensity / this.config.releaseTime;
      this.duckLevel = Math.min(
        this.targetDuckLevel,
        this.duckLevel + releaseRate * deltaTime
      );
    }

    return this.duckLevel;
  }

  /**
   * Apply ducking to audio data
   */
  applyDucking(audioData: any): any {
    if (!audioData || this.duckLevel >= 1.0) {
      return audioData;
    }

    // Apply ducking to frequency bands within range
    const duckedData = { ...audioData };

    // Duck bass frequencies more aggressively
    if (this.config.frequencyRange.low <= 250) {
      duckedData.bass = audioData.bass * this.duckLevel;
    }

    // Duck mids moderately
    if (this.config.frequencyRange.low <= 2000 && this.config.frequencyRange.high >= 250) {
      duckedData.mids = audioData.mids * Math.min(1.0, this.duckLevel + 0.2);
    }

    // Duck treble less
    if (this.config.frequencyRange.high >= 2000) {
      duckedData.treble = audioData.treble * Math.min(1.0, this.duckLevel + 0.4);
    }

    // Duck overall volume
    duckedData.volume = audioData.volume * this.duckLevel;

    return duckedData;
  }

  /**
   * Get current ducking status
   */
  getStatus() {
    return {
      isDucking: this.isDucking,
      duckLevel: this.duckLevel,
      targetLevel: this.targetDuckLevel,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<DuckingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Ducking manager for different UI contexts
 */
export class DuckingManager {
  private duckers: Map<string, AudioDucker> = new Map();
  private activeDuckers: Set<string> = new Set();

  constructor() {
    // Pre-configure common ducking scenarios
    this.duckers.set('ui-interaction', new AudioDucker({
      intensity: 0.6,
      attackTime: 50,
      releaseTime: 200,
    }));

    this.duckers.set('notification', new AudioDucker({
      intensity: 0.8,
      attackTime: 30,
      releaseTime: 500,
    }));

    this.duckers.set('modal', new AudioDucker({
      intensity: 0.4,
      attackTime: 100,
      releaseTime: 300,
    }));

    this.duckers.set('typing', new AudioDucker({
      intensity: 0.3,
      attackTime: 20,
      releaseTime: 100,
    }));
  }

  /**
   * Start ducking for a specific context
   */
  startDucking(context: string): void {
    const ducker = this.duckers.get(context);
    if (ducker) {
      ducker.startDucking();
      this.activeDuckers.add(context);
    }
  }

  /**
   * Stop ducking for a specific context
   */
  stopDucking(context: string): void {
    const ducker = this.duckers.get(context);
    if (ducker) {
      ducker.stopDucking();
      this.activeDuckers.delete(context);
    }
  }

  /**
   * Apply all active ducking to audio data
   */
  applyDucking(audioData: any): any {
    if (!audioData || this.activeDuckers.size === 0) {
      return audioData;
    }

    let duckedData = audioData;

    // Apply ducking from all active contexts
    for (const context of this.activeDuckers) {
      const ducker = this.duckers.get(context);
      if (ducker) {
        ducker.update();
        duckedData = ducker.applyDucking(duckedData);
      }
    }

    return duckedData;
  }

  /**
   * Get status of all duckers
   */
  getStatus() {
    const status: Record<string, any> = {};
    for (const [context, ducker] of this.duckers) {
      status[context] = {
        active: this.activeDuckers.has(context),
        ...ducker.getStatus(),
      };
    }
    return status;
  }
}

/**
 * Global ducking manager instance
 */
export const globalDuckingManager = new DuckingManager();
