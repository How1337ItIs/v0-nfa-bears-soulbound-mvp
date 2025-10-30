/**
 * FREQUENCY BAND TRACKER
 *
 * Tracks energy history per frequency band over time.
 * Provides statistical analysis (averages, peaks, trends).
 *
 * Features:
 * - Per-band history tracking
 * - Rolling averages
 * - Peak detection
 * - Trend analysis
 * - Export to JSON
 *
 * Usage:
 * ```typescript
 * const tracker = new FrequencyBandTracker(60); // 1 second at 60fps
 *
 * tracker.record(bass, mids, treble);
 *
 * const stats = tracker.getStats();
 * console.log('Average bass:', stats.bass.average);
 * console.log('Peak treble:', stats.treble.peak);
 * ```
 */

export interface BandStats {
  current: number;
  average: number;
  peak: number;
  min: number;
  variance: number;
  trend: 'rising' | 'falling' | 'stable';
}

export interface FrequencyBandStats {
  bass: BandStats;
  mids: BandStats;
  treble: BandStats;
  volume: BandStats;
}

export class FrequencyBandTracker {
  private bassHistory: number[] = [];
  private midsHistory: number[] = [];
  private trebleHistory: number[] = [];
  private volumeHistory: number[] = [];
  private historySize: number;

  constructor(historySize: number = 60) {
    this.historySize = historySize;
  }

  /**
   * Record current frequency band levels
   * @param bass - Bass level (0-1)
   * @param mids - Mids level (0-1)
   * @param treble - Treble level (0-1)
   * @param volume - Overall volume (0-1, optional)
   */
  record(bass: number, mids: number, treble: number, volume?: number): void {
    this.bassHistory.push(bass);
    this.midsHistory.push(mids);
    this.trebleHistory.push(treble);

    if (volume !== undefined) {
      this.volumeHistory.push(volume);
    }

    // Trim to history size
    if (this.bassHistory.length > this.historySize) {
      this.bassHistory.shift();
      this.midsHistory.shift();
      this.trebleHistory.shift();
      if (this.volumeHistory.length > this.historySize) {
        this.volumeHistory.shift();
      }
    }
  }

  /**
   * Get statistics for all bands
   * @returns Complete frequency band statistics
   */
  getStats(): FrequencyBandStats {
    return {
      bass: this.calculateBandStats(this.bassHistory),
      mids: this.calculateBandStats(this.midsHistory),
      treble: this.calculateBandStats(this.trebleHistory),
      volume: this.calculateBandStats(this.volumeHistory),
    };
  }

  /**
   * Get statistics for specific band
   * @param band - Band name
   * @returns Band statistics
   */
  getBandStats(band: 'bass' | 'mids' | 'treble' | 'volume'): BandStats {
    const history = {
      bass: this.bassHistory,
      mids: this.midsHistory,
      treble: this.trebleHistory,
      volume: this.volumeHistory,
    }[band];

    return this.calculateBandStats(history);
  }

  /**
   * Get raw history for band
   * @param band - Band name
   * @returns Array of historical values
   */
  getHistory(band: 'bass' | 'mids' | 'treble' | 'volume'): number[] {
    const history = {
      bass: this.bassHistory,
      mids: this.midsHistory,
      treble: this.trebleHistory,
      volume: this.volumeHistory,
    }[band];

    return [...history];
  }

  /**
   * Calculate statistics for a band
   */
  private calculateBandStats(history: number[]): BandStats {
    if (history.length === 0) {
      return {
        current: 0,
        average: 0,
        peak: 0,
        min: 0,
        variance: 0,
        trend: 'stable',
      };
    }

    const current = history[history.length - 1];
    const sum = history.reduce((a, b) => a + b, 0);
    const average = sum / history.length;
    const peak = Math.max(...history);
    const min = Math.min(...history);

    // Calculate variance
    const variance = history.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / history.length;

    // Determine trend
    let trend: 'rising' | 'falling' | 'stable' = 'stable';

    if (history.length >= 10) {
      const recent = history.slice(-5);
      const older = history.slice(-10, -5);

      const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b) / older.length;

      const change = recentAvg - olderAvg;

      if (change > 0.1) trend = 'rising';
      else if (change < -0.1) trend = 'falling';
    }

    return {
      current,
      average,
      peak,
      min,
      variance,
      trend,
    };
  }

  /**
   * Reset all history
   */
  reset(): void {
    this.bassHistory = [];
    this.midsHistory = [];
    this.trebleHistory = [];
    this.volumeHistory = [];
  }

  /**
   * Export data as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      historySize: this.historySize,
      stats: this.getStats(),
      history: {
        bass: this.bassHistory,
        mids: this.midsHistory,
        treble: this.trebleHistory,
        volume: this.volumeHistory,
      },
    }, null, 2);
  }
}

/**
 * Create frequency band tracker
 * @param historySize - Number of samples to track
 * @returns FrequencyBandTracker instance
 */
export function createFrequencyBandTracker(historySize: number = 60): FrequencyBandTracker {
  return new FrequencyBandTracker(historySize);
}
