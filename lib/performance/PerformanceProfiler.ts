/**
 * PERFORMANCE PROFILER FOR LIQUID LIGHT
 * 
 * Comprehensive performance profiling and monitoring system
 * Tracks FPS, memory usage, GPU performance, and rendering metrics
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  textures: number;
  memoryUsage: number;
  gpuTime: number;
  cpuTime: number;
  timestamp: number;
}

export interface PerformanceProfile {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  averageFrameTime: number;
  maxFrameTime: number;
  averageDrawCalls: number;
  maxDrawCalls: number;
  averageTriangles: number;
  maxTriangles: number;
  averageMemoryUsage: number;
  maxMemoryUsage: number;
  averageGPUTime: number;
  maxGPUTime: number;
  samples: number;
  duration: number; // in milliseconds
}

export interface PerformanceAlert {
  id: string;
  type: 'fps-low' | 'fps-high' | 'memory-high' | 'gpu-overload' | 'cpu-overload' | 'draw-calls-high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
}

export class PerformanceProfiler {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private isProfiling: boolean = false;
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private maxSamples: number = 300; // 5 seconds at 60fps
  private alertThresholds = {
    fpsLow: 25,
    fpsHigh: 60,
    memoryHigh: 0.8,
    gpuOverload: 16.67, // 60fps = 16.67ms
    cpuOverload: 8.33, // 120fps = 8.33ms
    drawCallsHigh: 1000,
  };

  public startProfiling() {
    this.isProfiling = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frameCount = 0;
    this.metrics = [];
    this.alerts = [];
  }

  public stopProfiling() {
    this.isProfiling = false;
  }

  public recordFrame(metrics: Partial<PerformanceMetrics>) {
    if (!this.isProfiling) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    const fps = 1000 / frameTime;

    const fullMetrics: PerformanceMetrics = {
      fps,
      frameTime,
      drawCalls: 0,
      triangles: 0,
      textures: 0,
      memoryUsage: 0,
      gpuTime: 0,
      cpuTime: 0,
      timestamp: now,
      ...metrics,
    };

    this.metrics.push(fullMetrics);
    this.frameCount++;

    // Keep only recent samples
    if (this.metrics.length > this.maxSamples) {
      this.metrics.shift();
    }

    // Check for alerts
    this.checkAlerts(fullMetrics);

    this.lastFrameTime = now;
  }

  private checkAlerts(metrics: PerformanceMetrics) {
    const timestamp = Date.now();

    // FPS alerts
    if (metrics.fps < this.alertThresholds.fpsLow) {
      this.addAlert({
        id: `fps-low-${timestamp}`,
        type: 'fps-low',
        severity: metrics.fps < 15 ? 'critical' : metrics.fps < 20 ? 'high' : 'medium',
        message: `Low FPS: ${metrics.fps.toFixed(1)}`,
        timestamp,
        value: metrics.fps,
        threshold: this.alertThresholds.fpsLow,
      });
    }

    if (metrics.fps > this.alertThresholds.fpsHigh) {
      this.addAlert({
        id: `fps-high-${timestamp}`,
        type: 'fps-high',
        severity: 'low',
        message: `High FPS: ${metrics.fps.toFixed(1)}`,
        timestamp,
        value: metrics.fps,
        threshold: this.alertThresholds.fpsHigh,
      });
    }

    // Memory alerts
    if (metrics.memoryUsage > this.alertThresholds.memoryHigh) {
      this.addAlert({
        id: `memory-high-${timestamp}`,
        type: 'memory-high',
        severity: metrics.memoryUsage > 0.9 ? 'critical' : 'high',
        message: `High memory usage: ${(metrics.memoryUsage * 100).toFixed(1)}%`,
        timestamp,
        value: metrics.memoryUsage,
        threshold: this.alertThresholds.memoryHigh,
      });
    }

    // GPU overload alerts
    if (metrics.gpuTime > this.alertThresholds.gpuOverload) {
      this.addAlert({
        id: `gpu-overload-${timestamp}`,
        type: 'gpu-overload',
        severity: metrics.gpuTime > 33.33 ? 'critical' : 'high',
        message: `GPU overload: ${metrics.gpuTime.toFixed(2)}ms`,
        timestamp,
        value: metrics.gpuTime,
        threshold: this.alertThresholds.gpuOverload,
      });
    }

    // CPU overload alerts
    if (metrics.cpuTime > this.alertThresholds.cpuOverload) {
      this.addAlert({
        id: `cpu-overload-${timestamp}`,
        type: 'cpu-overload',
        severity: metrics.cpuTime > 16.67 ? 'critical' : 'high',
        message: `CPU overload: ${metrics.cpuTime.toFixed(2)}ms`,
        timestamp,
        value: metrics.cpuTime,
        threshold: this.alertThresholds.cpuOverload,
      });
    }

    // Draw calls alerts
    if (metrics.drawCalls > this.alertThresholds.drawCallsHigh) {
      this.addAlert({
        id: `draw-calls-high-${timestamp}`,
        type: 'draw-calls-high',
        severity: metrics.drawCalls > 2000 ? 'critical' : 'high',
        message: `High draw calls: ${metrics.drawCalls}`,
        timestamp,
        value: metrics.drawCalls,
        threshold: this.alertThresholds.drawCallsHigh,
      });
    }
  }

  private addAlert(alert: PerformanceAlert) {
    this.alerts.push(alert);
    
    // Keep only recent alerts (last 100)
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    // Log critical alerts
    if (alert.severity === 'critical') {
      console.error(`Performance Alert: ${alert.message}`);
    } else if (alert.severity === 'high') {
      console.warn(`Performance Alert: ${alert.message}`);
    }
  }

  public getCurrentMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1];
  }

  public getPerformanceProfile(): PerformanceProfile | null {
    if (this.metrics.length === 0) return null;

    const fpsValues = this.metrics.map(m => m.fps);
    const frameTimeValues = this.metrics.map(m => m.frameTime);
    const drawCallValues = this.metrics.map(m => m.drawCalls);
    const triangleValues = this.metrics.map(m => m.triangles);
    const memoryValues = this.metrics.map(m => m.memoryUsage);
    const gpuTimeValues = this.metrics.map(m => m.gpuTime);

    return {
      averageFPS: this.average(fpsValues),
      minFPS: Math.min(...fpsValues),
      maxFPS: Math.max(...fpsValues),
      averageFrameTime: this.average(frameTimeValues),
      maxFrameTime: Math.max(...frameTimeValues),
      averageDrawCalls: this.average(drawCallValues),
      maxDrawCalls: Math.max(...drawCallValues),
      averageTriangles: this.average(triangleValues),
      maxTriangles: Math.max(...triangleValues),
      averageMemoryUsage: this.average(memoryValues),
      maxMemoryUsage: Math.max(...memoryValues),
      averageGPUTime: this.average(gpuTimeValues),
      maxGPUTime: Math.max(...gpuTimeValues),
      samples: this.metrics.length,
      duration: this.metrics.length > 0 ? this.metrics[this.metrics.length - 1].timestamp - this.metrics[0].timestamp : 0,
    };
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getRecentAlerts(count: number = 10): PerformanceAlert[] {
    return this.alerts.slice(-count);
  }

  public getAlertsBySeverity(severity: PerformanceAlert['severity']): PerformanceAlert[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  public clearAlerts() {
    this.alerts = [];
  }

  public setAlertThresholds(thresholds: Partial<typeof this.alertThresholds>) {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
  }

  public getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getMetricsForTimeRange(startTime: number, endTime: number): PerformanceMetrics[] {
    return this.metrics.filter(m => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  public exportProfile(): string {
    const profile = this.getPerformanceProfile();
    const alerts = this.getAlerts();
    
    return JSON.stringify({
      profile,
      alerts,
      timestamp: Date.now(),
    }, null, 2);
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  public isProfilingActive(): boolean {
    return this.isProfiling;
  }

  public getProfilingDuration(): number {
    if (!this.isProfiling) return 0;
    return performance.now() - this.startTime;
  }

  public getFrameCount(): number {
    return this.frameCount;
  }
}

export function createPerformanceProfiler(): PerformanceProfiler {
  return new PerformanceProfiler();
}

export function formatPerformanceMetrics(metrics: PerformanceMetrics): string {
  return `FPS: ${metrics.fps.toFixed(1)} | Frame: ${metrics.frameTime.toFixed(2)}ms | Draw Calls: ${metrics.drawCalls} | Triangles: ${metrics.triangles.toLocaleString()} | Memory: ${(metrics.memoryUsage * 100).toFixed(1)}% | GPU: ${metrics.gpuTime.toFixed(2)}ms`;
}

export function formatPerformanceProfile(profile: PerformanceProfile): string {
  return `Performance Profile:
  FPS: ${profile.averageFPS.toFixed(1)} (${profile.minFPS}-${profile.maxFPS})
  Frame Time: ${profile.averageFrameTime.toFixed(2)}ms (max: ${profile.maxFrameTime.toFixed(2)}ms)
  Draw Calls: ${profile.averageDrawCalls.toFixed(0)} (max: ${profile.maxDrawCalls})
  Triangles: ${profile.averageTriangles.toLocaleString()} (max: ${profile.maxTriangles.toLocaleString()})
  Memory: ${(profile.averageMemoryUsage * 100).toFixed(1)}% (max: ${(profile.maxMemoryUsage * 100).toFixed(1)}%)
  GPU Time: ${profile.averageGPUTime.toFixed(2)}ms (max: ${profile.maxGPUTime.toFixed(2)}ms)
  Samples: ${profile.samples} | Duration: ${(profile.duration / 1000).toFixed(1)}s`;
}

