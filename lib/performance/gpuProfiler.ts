/**
 * GPU PROFILER - Accurate GPU timing measurements
 *
 * Measures GPU time for individual render passes using WebGL query objects.
 * Essential for identifying performance bottlenecks.
 *
 * Features:
 * - Per-pass GPU timing
 * - Statistical analysis (average, min, max, p95)
 * - Automatic result collection
 * - Export to JSON for analysis
 *
 * Usage:
 * ```typescript
 * const profiler = new GPUProfiler(gl);
 * profiler.startQuery('thin-film');
 * renderThinFilm();
 * profiler.endQuery();
 *
 * const results = profiler.getResults();
 * console.log(results.get('thin-film')); // GPU time in ms
 * ```
 */

export interface GPUQueryResult {
  label: string;
  timeMs: number;
  timestamp: number;
}

export interface GPUProfileStats {
  label: string;
  samples: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
}

export class GPUProfiler {
  private gl: WebGL2RenderingContext;
  private extension: any; // EXT_disjoint_timer_query_webgl2
  private queries: Map<string, WebGLQuery> = new Map();
  private activeQuery: string | null = null;
  private results: GPUQueryResult[] = [];
  private maxResults = 1000; // Keep last 1000 samples

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    // Get timer query extension
    this.extension = gl.getExtension('EXT_disjoint_timer_query_webgl2');

    if (!this.extension) {
      console.warn('[GPUProfiler] EXT_disjoint_timer_query_webgl2 not available');
    }
  }

  /**
   * Start a GPU timing query
   * @param label - Label for this measurement
   */
  startQuery(label: string): void {
    if (!this.extension) return;

    if (this.activeQuery) {
      console.warn(`[GPUProfiler] Query already active: ${this.activeQuery}`);
      return;
    }

    // Get or create query object
    let query = this.queries.get(label);
    if (!query) {
      query = this.gl.createQuery()!;
      this.queries.set(label, query);
    }

    // Begin query
    this.gl.beginQuery(this.extension.TIME_ELAPSED_EXT, query);
    this.activeQuery = label;
  }

  /**
   * End the current GPU timing query
   */
  endQuery(): void {
    if (!this.extension || !this.activeQuery) return;

    this.gl.endQuery(this.extension.TIME_ELAPSED_EXT);
    this.activeQuery = null;
  }

  /**
   * Collect results from completed queries
   * Call this once per frame
   */
  collectResults(): void {
    if (!this.extension) return;

    for (const [label, query] of this.queries) {
      // Check if result is available
      const available = this.gl.getQueryParameter(query, this.gl.QUERY_RESULT_AVAILABLE);

      if (available) {
        // Get result in nanoseconds
        const timeNs = this.gl.getQueryParameter(query, this.gl.QUERY_RESULT);
        const timeMs = timeNs / 1_000_000; // Convert to milliseconds

        this.results.push({
          label,
          timeMs,
          timestamp: Date.now(),
        });

        // Limit results array size
        if (this.results.length > this.maxResults) {
          this.results.shift();
        }
      }
    }
  }

  /**
   * Get latest result for a specific query
   * @param label - Query label
   * @returns Latest GPU time in ms, or null if not available
   */
  getLatestResult(label: string): number | null {
    const labelResults = this.results.filter(r => r.label === label);
    if (labelResults.length === 0) return null;

    return labelResults[labelResults.length - 1].timeMs;
  }

  /**
   * Get statistics for all queries
   * @returns Map of label to stats
   */
  getStats(): Map<string, GPUProfileStats> {
    const statsMap = new Map<string, GPUProfileStats>();

    // Group results by label
    const groupedResults = new Map<string, number[]>();

    for (const result of this.results) {
      if (!groupedResults.has(result.label)) {
        groupedResults.set(result.label, []);
      }
      groupedResults.get(result.label)!.push(result.timeMs);
    }

    // Calculate stats for each label
    for (const [label, times] of groupedResults) {
      if (times.length === 0) continue;

      const sorted = [...times].sort((a, b) => a - b);
      const sum = times.reduce((a, b) => a + b, 0);

      const stats: GPUProfileStats = {
        label,
        samples: times.length,
        avgMs: sum / times.length,
        minMs: sorted[0],
        maxMs: sorted[sorted.length - 1],
        p50Ms: sorted[Math.floor(sorted.length * 0.5)],
        p95Ms: sorted[Math.floor(sorted.length * 0.95)],
        p99Ms: sorted[Math.floor(sorted.length * 0.99)],
      };

      statsMap.set(label, stats);
    }

    return statsMap;
  }

  /**
   * Export results as JSON for analysis
   */
  exportJSON(): string {
    const stats = this.getStats();
    const statsObj: any = {};

    for (const [label, stat] of stats) {
      statsObj[label] = stat;
    }

    return JSON.stringify({
      timestamp: Date.now(),
      stats: statsObj,
      rawResults: this.results.slice(-100), // Last 100 results
    }, null, 2);
  }

  /**
   * Reset all collected results
   */
  reset(): void {
    this.results = [];
  }

  /**
   * Dispose of all query objects
   */
  dispose(): void {
    for (const query of this.queries.values()) {
      this.gl.deleteQuery(query);
    }
    this.queries.clear();
    this.results = [];
  }
}

/**
 * Create GPU profiler instance from WebGL context
 * @param gl - WebGL2 context
 * @returns GPUProfiler instance or null if not supported
 */
export function createGPUProfiler(gl: WebGL2RenderingContext | null): GPUProfiler | null {
  if (!gl) return null;

  return new GPUProfiler(gl);
}
