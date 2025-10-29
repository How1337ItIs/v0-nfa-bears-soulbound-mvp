/**
 * TierTransitionManager
 *
 * Applies hysteresis and cooldown to automatic performance tier transitions
 * based on measured FPS. Prevents rapid oscillation.
 */

export type Tier = 'low' | 'medium' | 'high' | 'ultra';

export class TierTransitionManager {
  private stepDownDuration = 2000; // ms below threshold before action
  private stepUpDuration = 3000; // ms above threshold before action
  private cooldownPeriod = 5000; // ms between step-downs

  private lastStepDown = 0;
  private belowStart: number | null = null;
  private aboveStart: number | null = null;

  constructor(config?: Partial<{
    stepDownDuration: number;
    stepUpDuration: number;
    cooldownPeriod: number;
  }>) {
    if (config?.stepDownDuration != null) this.stepDownDuration = config.stepDownDuration;
    if (config?.stepUpDuration != null) this.stepUpDuration = config.stepUpDuration;
    if (config?.cooldownPeriod != null) this.cooldownPeriod = config.cooldownPeriod;
  }

  /**
   * Check current FPS and decide if a tier transition should occur.
   * Returns new tier if transition needed; null otherwise.
   */
  checkAndTransition(currentFPS: number, currentTier: Tier, maxTier: Tier): Tier | null {
    const now = Date.now();

    // Track sustained below/above thresholds
    if (currentFPS < 25) {
      if (this.belowStart == null) this.belowStart = now;
    } else {
      this.belowStart = null;
    }

    if (currentFPS > 50) {
      if (this.aboveStart == null) this.aboveStart = now;
    } else {
      this.aboveStart = null;
    }

    // Step down logic
    if (this.shouldStepDown(currentFPS) && this.canStepDown()) {
      const next = this.stepDownTier(currentTier);
      if (next !== currentTier) {
        this.lastStepDown = now;
        return next;
      }
    }

    // Step up logic (never exceed device max tier)
    if (this.shouldStepUp(currentFPS)) {
      const up = this.stepUpTier(currentTier);
      if (this.rank(up) <= this.rank(maxTier) && up !== currentTier) {
        return up;
      }
    }

    return null;
  }

  private rank(t: Tier): number {
    switch (t) {
      case 'low': return 0;
      case 'medium': return 1;
      case 'high': return 2;
      case 'ultra': return 3;
    }
  }

  private stepDownTier(t: Tier): Tier {
    switch (t) {
      case 'ultra': return 'high';
      case 'high': return 'medium';
      case 'medium': return 'low';
      case 'low':
      default:
        return 'low';
    }
  }

  private stepUpTier(t: Tier): Tier {
    switch (t) {
      case 'low': return 'medium';
      case 'medium': return 'high';
      case 'high': return 'ultra';
      case 'ultra':
      default:
        return 'ultra';
    }
  }

  private canStepDown(): boolean {
    return Date.now() - this.lastStepDown > this.cooldownPeriod;
  }

  private shouldStepDown(fps: number): boolean {
    if (fps >= 25) return false;
    if (this.belowStart == null) return false;
    return Date.now() - this.belowStart >= this.stepDownDuration;
  }

  private shouldStepUp(fps: number): boolean {
    if (fps <= 50) return false;
    if (this.aboveStart == null) return false;
    return Date.now() - this.aboveStart >= this.stepUpDuration;
  }
}

