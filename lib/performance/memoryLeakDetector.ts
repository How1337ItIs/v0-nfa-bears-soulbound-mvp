/**
 * MEMORY LEAK DETECTOR
 *
 * Tracks WebGL resource allocation and deallocation.
 * Detects memory leaks by identifying un-disposed resources.
 *
 * Features:
 * - Track textures, buffers, programs, framebuffers
 * - Automatic leak detection
 * - Stack traces for allocation (dev mode)
 * - Export leak report
 *
 * Usage:
 * ```typescript
 * const detector = new MemoryLeakDetector();
 *
 * const texture = gl.createTexture();
 * detector.track('texture', texture, 'myTexture');
 *
 * // ... use texture ...
 *
 * gl.deleteTexture(texture);
 * detector.untrack('texture', texture);
 *
 * // Check for leaks
 * detector.checkLeaks(); // Logs any un-disposed resources
 * ```
 */

export type ResourceType = 'texture' | 'buffer' | 'program' | 'framebuffer' | 'renderbuffer' | 'shader';

export interface TrackedResource {
  type: ResourceType;
  resource: any;
  label: string;
  timestamp: number;
  stackTrace?: string;
}

export interface LeakReport {
  totalLeaks: number;
  leaksByType: Map<ResourceType, number>;
  details: TrackedResource[];
}

export class MemoryLeakDetector {
  private resources: Map<string, TrackedResource> = new Map();
  private captureStackTraces: boolean;

  constructor(captureStackTraces: boolean = process.env.NODE_ENV === 'development') {
    this.captureStackTraces = captureStackTraces;
  }

  /**
   * Track a WebGL resource
   * @param type - Resource type
   * @param resource - WebGL resource object
   * @param label - Human-readable label
   */
  track(type: ResourceType, resource: any, label: string = 'unknown'): void {
    const key = this.getResourceKey(resource);

    const tracked: TrackedResource = {
      type,
      resource,
      label,
      timestamp: Date.now(),
    };

    if (this.captureStackTraces) {
      tracked.stackTrace = new Error().stack;
    }

    this.resources.set(key, tracked);
  }

  /**
   * Untrack a resource (mark as disposed)
   * @param type - Resource type
   * @param resource - WebGL resource object
   */
  untrack(type: ResourceType, resource: any): void {
    const key = this.getResourceKey(resource);
    this.resources.delete(key);
  }

  /**
   * Check for memory leaks
   * @returns Leak report
   */
  checkLeaks(): LeakReport {
    const leaksByType = new Map<ResourceType, number>();
    const details: TrackedResource[] = [];

    for (const tracked of this.resources.values()) {
      const count = leaksByType.get(tracked.type) || 0;
      leaksByType.set(tracked.type, count + 1);
      details.push(tracked);
    }

    const totalLeaks = this.resources.size;

    if (totalLeaks > 0) {
      console.warn(`[MemoryLeakDetector] Found ${totalLeaks} un-disposed resources:`);
      for (const [type, count] of leaksByType) {
        console.warn(`  ${type}: ${count}`);
      }
    }

    return {
      totalLeaks,
      leaksByType,
      details,
    };
  }

  /**
   * Get leak count by type
   * @param type - Resource type
   * @returns Number of leaked resources of this type
   */
  getLeakCount(type: ResourceType): number {
    let count = 0;
    for (const tracked of this.resources.values()) {
      if (tracked.type === type) count++;
    }
    return count;
  }

  /**
   * Get all tracked resources
   * @returns Array of tracked resources
   */
  getAllTracked(): TrackedResource[] {
    return Array.from(this.resources.values());
  }

  /**
   * Get tracked resources by type
   * @param type - Resource type
   * @returns Array of tracked resources of this type
   */
  getTrackedByType(type: ResourceType): TrackedResource[] {
    return this.getAllTracked().filter(r => r.type === type);
  }

  /**
   * Print detailed leak report to console
   */
  printLeakReport(): void {
    const report = this.checkLeaks();

    if (report.totalLeaks === 0) {
      console.log('[MemoryLeakDetector] ✅ No leaks detected');
      return;
    }

    console.group(`[MemoryLeakDetector] ❌ ${report.totalLeaks} Leaks Detected`);

    for (const [type, count] of report.leaksByType) {
      console.group(`${type}: ${count} leaked`);

      const resources = this.getTrackedByType(type);
      for (const resource of resources) {
        console.log(`  Label: ${resource.label}`);
        console.log(`  Age: ${((Date.now() - resource.timestamp) / 1000).toFixed(1)}s`);

        if (resource.stackTrace) {
          console.log(`  Stack trace:`, resource.stackTrace);
        }
      }

      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * Export leak report as JSON
   */
  exportJSON(): string {
    const report = this.checkLeaks();

    return JSON.stringify({
      timestamp: Date.now(),
      totalLeaks: report.totalLeaks,
      leaksByType: Object.fromEntries(report.leaksByType),
      details: report.details.map(d => ({
        type: d.type,
        label: d.label,
        age: Date.now() - d.timestamp,
        stackTrace: d.stackTrace,
      })),
    }, null, 2);
  }

  /**
   * Reset detector (clear all tracked resources)
   */
  reset(): void {
    this.resources.clear();
  }

  /**
   * Get unique key for a resource
   */
  private getResourceKey(resource: any): string {
    // Use WeakMap or object identity
    return `${typeof resource}_${JSON.stringify(resource)}`;
  }
}

/**
 * Global memory leak detector instance (dev mode only)
 */
export const globalMemoryLeakDetector =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? new MemoryLeakDetector(true)
    : null;

/**
 * Expose detector to window for debugging
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__MEMORY_LEAK_DETECTOR__ = globalMemoryLeakDetector;
}
