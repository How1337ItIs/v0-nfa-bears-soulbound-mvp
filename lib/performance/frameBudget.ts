/**
 * FRAME BUDGET ANALYZER
 *
 * Tracks time spent in different parts of the render pipeline.
 * Helps identify bottlenecks and ensure we stay within 16.67ms budget (60fps).
 *
 * Features:
 * - Per-operation timing
 * - Budget percentage calculation
 * - Warnings when budget exceeded
 * - Export to JSON for analysis
 *
 * Usage:
 * ```typescript
 * const budget = new FrameBudgetAnalyzer(60); // 60fps target
 *
 * budget.measure('audio-processing', () => {
 *   processAudio();
 * });
 *
 * budget.measure('physics-calc', () => {
 *   calculatePhysics();
 * });
 *
 * const report = budget.getReport();
 * console.log(`Total: ${report.total.toFixed(2)}ms`);
 * console.log(`Remaining: ${report.remaining.toFixed(2)}ms`);
 * ```
 */

export interface FrameBudgetEntry {
  label: string;
  timeMs: number;
  percentage: number; // Percentage of total budget
  timestamp: number;
}

export interface FrameBudgetReport {
  targetFPS: number;
  budgetMs: number;
  entries: FrameBudgetEntry[];
  total: number;
  remaining: number;
  overBudget: boolean;
}

export interface FrameBudgetStats {
  label: string;
  avgMs: number;
  minMs: number;
  maxMs: number;
  p95Ms: number;
  samples: number;
  avgPercentage: number;
}

export class FrameBudgetAnalyzer {
  private targetFPS: number;
  private budget: number;
  private breakdown: Map<string, number> = new Map();
  private history: Map<string, number[]> = new Map();
  private maxHistorySize = 300; // 5 seconds at 60fps

  constructor(targetFPS: number = 60) {
    this.targetFPS = targetFPS;
    this.budget = 1000 / targetFPS; // Convert FPS to ms
  }

  /**
   * Measure time spent executing a function
   * @param label - Label for this operation
   * @param fn - Function to measure
   * @returns Result of the function
   */
  measure<T>(label: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const elapsed = performance.now() - start;

    this.breakdown.set(label, elapsed);

    // Add to history
    if (!this.history.has(label)) {
      this.history.set(label, []);
    }

    const history = this.history.get(label)!;
    history.push(elapsed);

    // Trim history
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    // Warn if operation is expensive
    if (elapsed > this.budget * 0.2) { // >20% of budget
      console.warn(`[FrameBudget] ${label} took ${elapsed.toFixed(2)}ms (${(elapsed / this.budget * 100).toFixed(1)}% of budget)`);
    }

    return result;
  }

  /**
   * Start measuring an operation (for async operations)
   * @param label - Label for this operation
   * @returns End function to call when operation completes
   */
  start(label: string): () => void {
    const start = performance.now();

    return () => {
      const elapsed = performance.now() - start;
      this.breakdown.set(label, elapsed);

      if (!this.history.has(label)) {
        this.history.set(label, []);
      }

      const history = this.history.get(label)!;
      history.push(elapsed);

      if (history.length > this.maxHistorySize) {
        history.shift();
      }
    };
  }

  /**
   * Get current frame budget report
   * @returns Frame budget breakdown
   */
  getReport(): FrameBudgetReport {
    let total = 0;
    const entries: FrameBudgetEntry[] = [];

    for (const [label, time] of this.breakdown) {
      total += time;

      entries.push({
        label,
        timeMs: time,
        percentage: (time / this.budget) * 100,
        timestamp: Date.now(),
      });
    }

    // Sort by time (descending)
    entries.sort((a, b) => b.timeMs - a.timeMs);

    return {
      targetFPS: this.targetFPS,
      budgetMs: this.budget,
      entries,
      total,
      remaining: this.budget - total,
      overBudget: total > this.budget,
    };
  }

  /**
   * Get statistical analysis of all operations
   * @returns Stats for each labeled operation
   */
  getStats(): Map<string, FrameBudgetStats> {
    const stats = new Map<string, FrameBudgetStats>();

    for (const [label, times] of this.history) {
      if (times.length === 0) continue;

      const sorted = [...times].sort((a, b) => a - b);
      const sum = times.reduce((a, b) => a + b, 0);
      const avg = sum / times.length;

      stats.set(label, {
        label,
        avgMs: avg,
        minMs: sorted[0],
        maxMs: sorted[sorted.length - 1],
        p95Ms: sorted[Math.floor(sorted.length * 0.95)],
        samples: times.length,
        avgPercentage: (avg / this.budget) * 100,
      });
    }

    return stats;
  }

  /**
   * Check if specific operation is within budget
   * @param label - Operation label
   * @param maxPercentage - Maximum allowed percentage of budget (default: 20%)
   * @returns Whether operation is within budget
   */
  isWithinBudget(label: string, maxPercentage: number = 20): boolean {
    const time = this.breakdown.get(label);
    if (time === undefined) return true;

    const percentage = (time / this.budget) * 100;
    return percentage <= maxPercentage;
  }

  /**
   * Get top N most expensive operations
   * @param n - Number of operations to return
   * @returns Array of top operations
   */
  getTopExpensive(n: number = 5): FrameBudgetEntry[] {
    const report = this.getReport();
    return report.entries.slice(0, n);
  }

  /**
   * Export data as JSON
   */
  exportJSON(): string {
    const report = this.getReport();
    const stats = this.getStats();

    const statsObj: any = {};
    for (const [label, stat] of stats) {
      statsObj[label] = stat;
    }

    return JSON.stringify({
      timestamp: Date.now(),
      report,
      stats: statsObj,
    }, null, 2);
  }

  /**
   * Reset current frame breakdown (call at start of each frame)
   */
  resetFrame(): void {
    this.breakdown.clear();
  }

  /**
   * Reset all data including history
   */
  resetAll(): void {
    this.breakdown.clear();
    this.history.clear();
    this.results = [];
  }

  /**
   * Print budget report to console
   */
  printReport(): void {
    const report = this.getReport();

    console.group('[Frame Budget Report]');
    console.log(`Target: ${this.targetFPS} FPS (${this.budget.toFixed(2)}ms budget)`);
    console.log(`Total: ${report.total.toFixed(2)}ms`);
    console.log(`Remaining: ${report.remaining.toFixed(2)}ms`);
    console.log(`Status: ${report.overBudget ? '❌ OVER BUDGET' : '✅ Within budget'}`);
    console.log('\nBreakdown:');

    for (const entry of report.entries) {
      const icon = entry.percentage > 20 ? '⚠️' : '';
      console.log(`  ${icon} ${entry.label}: ${entry.timeMs.toFixed(2)}ms (${entry.percentage.toFixed(1)}%)`);
    }

    console.groupEnd();
  }

  /**
   * Print statistics to console
   */
  printStats(): void {
    const stats = this.getStats();

    console.group('[Frame Budget Statistics]');

    for (const [label, stat] of stats) {
      console.group(label);
      console.log(`  Avg: ${stat.avgMs.toFixed(2)}ms (${stat.avgPercentage.toFixed(1)}%)`);
      console.log(`  Min: ${stat.minMs.toFixed(2)}ms`);
      console.log(`  Max: ${stat.maxMs.toFixed(2)}ms`);
      console.log(`  P95: ${stat.p95Ms.toFixed(2)}ms`);
      console.log(`  Samples: ${stat.samples}`);
      console.groupEnd();
    }

    console.groupEnd();
  }
}

/**
 * Helper function to gate expensive operations by frame budget
 * Only executes if budget allows
 *
 * @param fn - Function to potentially execute
 * @param budgetMs - Maximum time budget in ms
 * @returns Result of function or null if skipped
 */
export function withFrameBudget<T>(
  fn: () => T,
  budgetMs: number
): T | null {
  const start = performance.now();

  // Check if we have budget
  const frameStart = (window as any).__FRAME_START__ || start;
  const elapsed = start - frameStart;

  if (elapsed + budgetMs > 16.67) {
    // Not enough budget, skip
    console.log(`[withFrameBudget] Skipping operation (${elapsed.toFixed(2)}ms already used)`);
    return null;
  }

  const result = fn();
  const actualTime = performance.now() - start;

  if (actualTime > budgetMs) {
    console.warn(`[withFrameBudget] Operation exceeded budget: ${actualTime.toFixed(2)}ms > ${budgetMs}ms`);
  }

  return result;
}

/**
 * Mark frame start for budget tracking
 * Call this at the beginning of your render loop
 */
export function markFrameStart(): void {
  (window as any).__FRAME_START__ = performance.now();
}
