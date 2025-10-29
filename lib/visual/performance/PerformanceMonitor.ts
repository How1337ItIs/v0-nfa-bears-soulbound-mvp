/**
 * PERFORMANCE MONITOR
 *
 * Tracks FPS and basic memory info to support adaptive quality adjustment.
 *
 * Reference: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md (Performance governance)
 */

export class PerformanceMonitor {
  private fps = 60;
  private frameCount = 0;
  private lastCheck = typeof performance !== 'undefined' ? performance.now() : Date.now();

  tick(): void {
    this.frameCount += 1;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const delta = now - this.lastCheck;
    // Update FPS every ~1000ms
    if (delta >= 1000) {
      this.fps = (this.frameCount / delta) * 1000;
      this.frameCount = 0;
      this.lastCheck = now;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  shouldStepDown(threshold: number): boolean {
    return this.fps > 0 && this.fps < threshold;
  }

  // maxTier is not used in skeleton; kept for API compatibility
  shouldStepUp(threshold: number, _maxTier: string): boolean {
    return this.fps >= threshold;
  }

  getMemoryUsage(): number | null {
    // Browser-only: Chrome exposes performance.memory in non-secure contexts gated by flags
    const anyPerf: any = typeof performance !== 'undefined' ? (performance as any) : null;
    if (anyPerf && anyPerf.memory && typeof anyPerf.memory.usedJSHeapSize === 'number') {
      return anyPerf.memory.usedJSHeapSize;
    }
    return null;
  }

  reset(): void {
    this.fps = 60;
    this.frameCount = 0;
    this.lastCheck = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }
}

