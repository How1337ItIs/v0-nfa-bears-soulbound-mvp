/**
 * FPS HISTOGRAM ANALYZER
 *
 * Tracks FPS distribution over time to understand performance stability.
 * Provides percentile analysis and visualization data.
 *
 * Features:
 * - Bucket-based histogram (0-10, 10-20, ..., 60+)
 * - Percentile calculations (p50, p95, p99)
 * - Statistical analysis
 * - Export for visualization
 *
 * Usage:
 * ```typescript
 * const histogram = new FPSHistogram();
 *
 * // Record FPS each frame
 * histogram.record(currentFPS);
 *
 * // Get statistics
 * const stats = histogram.getReport();
 * console.log('P95 FPS:', stats.p95);
 * console.log('Average:', stats.average);
 * ```
 */

export interface FPSBucket {
  range: string; // e.g., "50-60"
  count: number;
  percentage: number;
}

export interface FPSHistogramReport {
  totalSamples: number;
  buckets: FPSBucket[];
  average: number;
  median: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  stdDev: number;
}

export class FPSHistogram {
  private buckets = new Array(7).fill(0); // 0-10, 10-20, ..., 60+
  private samples: number[] = [];
  private maxSamples: number;

  constructor(maxSamples: number = 1000) {
    this.maxSamples = maxSamples;
  }

  /**
   * Record FPS sample
   * @param fps - Frame rate
   */
  record(fps: number): void {
    // Add to bucket
    const bucketIndex = Math.min(Math.floor(fps / 10), 6);
    this.buckets[bucketIndex]++;

    // Add to samples
    this.samples.push(fps);

    // Trim if exceeds max
    if (this.samples.length > this.maxSamples) {
      // Remove oldest
      const removed = this.samples.shift()!;
      const removedBucket = Math.min(Math.floor(removed / 10), 6);
      this.buckets[removedBucket] = Math.max(0, this.buckets[removedBucket] - 1);
    }
  }

  /**
   * Get histogram report
   * @returns Complete FPS statistics
   */
  getReport(): FPSHistogramReport {
    const totalSamples = this.samples.length;

    if (totalSamples === 0) {
      return {
        totalSamples: 0,
        buckets: [],
        average: 0,
        median: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        min: 0,
        max: 0,
        stdDev: 0,
      };
    }

    // Create bucket report
    const buckets: FPSBucket[] = this.buckets.map((count, i) => ({
      range: i === 6 ? '60+' : `${i * 10}-${(i + 1) * 10}`,
      count,
      percentage: (count / totalSamples) * 100,
    }));

    // Calculate statistics
    const sorted = [...this.samples].sort((a, b) => a - b);
    const sum = this.samples.reduce((a, b) => a + b, 0);
    const average = sum / totalSamples;

    // Median
    const median = sorted[Math.floor(sorted.length / 2)];

    // Percentiles
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    // Min/Max
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Standard deviation
    const variance = this.samples.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / totalSamples;
    const stdDev = Math.sqrt(variance);

    return {
      totalSamples,
      buckets,
      average,
      median,
      p50,
      p95,
      p99,
      min,
      max,
      stdDev,
    };
  }

  /**
   * Get percentile value
   * @param percentile - Percentile (0-1)
   * @returns FPS value at percentile
   */
  getPercentile(percentile: number): number {
    if (this.samples.length === 0) return 0;

    const sorted = [...this.samples].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * percentile);

    return sorted[index];
  }

  /**
   * Check if FPS is stable (low variance)
   * @param threshold - Variance threshold (default: 100)
   * @returns Whether FPS is stable
   */
  isStable(threshold: number = 100): boolean {
    const report = this.getReport();
    return report.stdDev < threshold;
  }

  /**
   * Get percentage of frames above target
   * @param targetFPS - Target frame rate
   * @returns Percentage of frames above target
   */
  getPercentageAboveTarget(targetFPS: number): number {
    if (this.samples.length === 0) return 0;

    const aboveTarget = this.samples.filter(fps => fps >= targetFPS).length;
    return (aboveTarget / this.samples.length) * 100;
  }

  /**
   * Get percentage of frames below threshold
   * @param thresholdFPS - Threshold frame rate
   * @returns Percentage of frames below threshold
   */
  getPercentageBelowThreshold(thresholdFPS: number): number {
    if (this.samples.length === 0) return 0;

    const belowThreshold = this.samples.filter(fps => fps < thresholdFPS).length;
    return (belowThreshold / this.samples.length) * 100;
  }

  /**
   * Export as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      report: this.getReport(),
      raw: this.samples,
    }, null, 2);
  }

  /**
   * Reset histogram
   */
  reset(): void {
    this.buckets = new Array(7).fill(0);
    this.samples = [];
  }

  /**
   * Print report to console
   */
  printReport(): void {
    const report = this.getReport();

    console.group('[FPS Histogram Report]');
    console.log(`Samples: ${report.totalSamples}`);
    console.log(`Average: ${report.average.toFixed(1)} FPS`);
    console.log(`Median: ${report.median.toFixed(1)} FPS`);
    console.log(`P95: ${report.p95.toFixed(1)} FPS`);
    console.log(`P99: ${report.p99.toFixed(1)} FPS`);
    console.log(`Min: ${report.min.toFixed(1)} FPS`);
    console.log(`Max: ${report.max.toFixed(1)} FPS`);
    console.log(`StdDev: ${report.stdDev.toFixed(1)}`);
    console.log('\nDistribution:');

    for (const bucket of report.buckets) {
      const bar = '█'.repeat(Math.floor(bucket.percentage / 2));
      console.log(`  ${bucket.range.padEnd(8)} ${bar} ${bucket.percentage.toFixed(1)}%`);
    }

    console.groupEnd();
  }
}

/**
 * Create FPS histogram
 * @param maxSamples - Maximum samples to track
 * @returns FPSHistogram instance
 */
export function createFPSHistogram(maxSamples: number = 1000): FPSHistogram {
  return new FPSHistogram(maxSamples);
}
