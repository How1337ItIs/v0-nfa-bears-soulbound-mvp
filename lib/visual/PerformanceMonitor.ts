/**
 * PERFORMANCE MONITOR UTILITY
 * 
 * Advanced performance monitoring and optimization for visual effects
 * Tracks FPS, memory usage, GPU load, and provides adaptive quality adjustments
 * 
 * Based on Master Liquid Light Integration Plan (Week 2)
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { PerformanceMetrics, QualitySettings, DeviceCapabilities } from './types';

export interface PerformanceThresholds {
  fpsLow: number;
  fpsHigh: number;
  memoryHigh: number;
  gpuHigh: number;
  cpuHigh: number;
}

export interface PerformanceHistory {
  timestamp: number;
  metrics: PerformanceMetrics;
  quality: QualitySettings['current'];
}

export interface PerformanceAlert {
  type: 'fps' | 'memory' | 'gpu' | 'cpu' | 'thermal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  suggestion?: string;
}

export interface AdaptiveQualityConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  hysteresis: number; // Prevents rapid quality changes
  minQuality: QualitySettings['current'];
  maxQuality: QualitySettings['current'];
  cooldown: number; // Minimum time between quality changes (ms)
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    gpuUsage: 0,
    cpuUsage: 0,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
  };

  private history: PerformanceHistory[] = [];
  private alerts: PerformanceAlert[] = [];
  private thresholds: PerformanceThresholds;
  private adaptiveConfig: AdaptiveQualityConfig;
  private capabilities: DeviceCapabilities | null = null;

  // Performance tracking
  private frameCount = 0;
  private lastFpsCheck = 0;
  private lastQualityChange = 0;
  private performanceObserver: PerformanceObserver | null = null;
  private rafId: number | null = null;

  // Event listeners
  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private alertListeners: Set<(alert: PerformanceAlert) => void> = new Set();

  constructor(
    thresholds: Partial<PerformanceThresholds> = {},
    adaptiveConfig: Partial<AdaptiveQualityConfig> = {}
  ) {
    this.thresholds = {
      fpsLow: 25,
      fpsHigh: 50,
      memoryHigh: 0.8,
      gpuHigh: 0.9,
      cpuHigh: 0.8,
      ...thresholds,
    };

    this.adaptiveConfig = {
      enabled: true,
      sensitivity: 'medium',
      hysteresis: 0.1,
      minQuality: 'low',
      maxQuality: 'ultra',
      cooldown: 2000,
      ...adaptiveConfig,
    };

    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Initialize performance observer for memory monitoring
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.entryType === 'memory') {
              this.updateMemoryMetrics(entry as any);
            }
          }
        });

        this.performanceObserver.observe({ entryTypes: ['memory'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }

    // Start FPS monitoring
    this.startFPSMonitoring();
  }

  private startFPSMonitoring(): void {
    const monitor = () => {
      this.updateFPSMetrics();
      this.rafId = requestAnimationFrame(monitor);
    };
    this.rafId = requestAnimationFrame(monitor);
  }

  private updateFPSMetrics(): void {
    const now = performance.now();
    this.frameCount++;

    if (this.lastFpsCheck === 0) {
      this.lastFpsCheck = now;
      return;
    }

    // Update FPS every 60 frames
    if (this.frameCount % 60 === 0) {
      const elapsed = now - this.lastFpsCheck;
      const fps = Math.round((60 * 1000) / elapsed);
      
      this.metrics.fps = fps;
      this.metrics.frameTime = 1000 / fps;
      
      this.lastFpsCheck = now;
      this.frameCount = 0;

      // Check for performance alerts
      this.checkPerformanceAlerts();
      
      // Notify listeners
      this.notifyListeners();
    }
  }

  private updateMemoryMetrics(entry: any): void {
    if (entry.usedJSHeapSize && entry.jsHeapSizeLimit) {
      this.metrics.memoryUsage = entry.usedJSHeapSize / entry.jsHeapSizeLimit;
    }
  }

  private checkPerformanceAlerts(): void {
    const now = Date.now();

    // FPS alerts
    if (this.metrics.fps < this.thresholds.fpsLow) {
      this.createAlert('fps', 'high', `Low FPS detected: ${this.metrics.fps}`);
    } else if (this.metrics.fps > this.thresholds.fpsHigh) {
      this.createAlert('fps', 'low', `Good FPS: ${this.metrics.fps}`);
    }

    // Memory alerts
    if (this.metrics.memoryUsage > this.thresholds.memoryHigh) {
      this.createAlert('memory', 'high', `High memory usage: ${Math.round(this.metrics.memoryUsage * 100)}%`);
    }

    // GPU alerts (estimated)
    if (this.metrics.gpuUsage > this.thresholds.gpuHigh) {
      this.createAlert('gpu', 'critical', `GPU overload: ${Math.round(this.metrics.gpuUsage * 100)}%`);
    }

    // CPU alerts (estimated)
    if (this.metrics.cpuUsage > this.thresholds.cpuHigh) {
      this.createAlert('cpu', 'high', `High CPU usage: ${Math.round(this.metrics.cpuUsage * 100)}%`);
    }
  }

  private createAlert(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    message: string,
    suggestion?: string
  ): void {
    const alert: PerformanceAlert = {
      type,
      severity,
      message,
      timestamp: Date.now(),
      resolved: false,
      suggestion,
    };

    // Check if similar alert already exists
    const existingAlert = this.alerts.find(
      a => a.type === type && a.severity === severity && !a.resolved
    );

    if (!existingAlert) {
      this.alerts.push(alert);
      this.notifyAlertListeners(alert);
    }
  }

  // Public API
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getHistory(limit?: number): PerformanceHistory[] {
    if (limit) {
      return this.history.slice(-limit);
    }
    return [...this.history];
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.timestamp.toString() === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  // Adaptive quality management
  shouldReduceQuality(): boolean {
    if (!this.adaptiveConfig.enabled) return false;
    if (Date.now() - this.lastQualityChange < this.adaptiveConfig.cooldown) return false;

    const sensitivity = this.adaptiveConfig.sensitivity === 'low' ? 0.8 : 
                      this.adaptiveConfig.sensitivity === 'high' ? 0.6 : 0.7;

    return this.metrics.fps < this.thresholds.fpsLow * sensitivity ||
           this.metrics.memoryUsage > this.thresholds.memoryHigh * sensitivity ||
           this.metrics.gpuUsage > this.thresholds.gpuHigh * sensitivity;
  }

  shouldIncreaseQuality(): boolean {
    if (!this.adaptiveConfig.enabled) return false;
    if (Date.now() - this.lastQualityChange < this.adaptiveConfig.cooldown) return false;

    const sensitivity = this.adaptiveConfig.sensitivity === 'low' ? 1.2 : 
                      this.adaptiveConfig.sensitivity === 'high' ? 1.4 : 1.3;

    return this.metrics.fps > this.thresholds.fpsHigh * sensitivity &&
           this.metrics.memoryUsage < this.thresholds.memoryHigh * sensitivity &&
           this.metrics.gpuUsage < this.thresholds.gpuHigh * sensitivity;
  }

  getRecommendedQuality(): QualitySettings['current'] {
    if (!this.capabilities) return 'medium';

    const currentQuality = this.getCurrentQualityLevel();
    const qualityLevels: QualitySettings['current'][] = ['low', 'medium', 'high', 'ultra'];
    const currentIndex = qualityLevels.indexOf(currentQuality);

    if (this.shouldReduceQuality() && currentIndex > 0) {
      this.lastQualityChange = Date.now();
      return qualityLevels[currentIndex - 1];
    }

    if (this.shouldIncreaseQuality() && currentIndex < qualityLevels.length - 1) {
      this.lastQualityChange = Date.now();
      return qualityLevels[currentIndex + 1];
    }

    return currentQuality;
  }

  private getCurrentQualityLevel(): QualitySettings['current'] {
    // This would typically come from the visual policy
    // For now, return based on device capabilities
    if (!this.capabilities) return 'medium';
    return this.capabilities.tier;
  }

  // Device-specific optimizations
  setCapabilities(capabilities: DeviceCapabilities): void {
    this.capabilities = capabilities;
    
    // Adjust thresholds based on device capabilities
    if (capabilities.mobile) {
      this.thresholds.fpsLow = 20;
      this.thresholds.fpsHigh = 30;
    }

    if (capabilities.tier === 'low') {
      this.thresholds.memoryHigh = 0.6;
      this.thresholds.gpuHigh = 0.7;
    }
  }

  // Performance optimization suggestions
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];

    if (this.metrics.fps < this.thresholds.fpsLow) {
      suggestions.push('Consider reducing particle count');
      suggestions.push('Try lowering resolution scaling');
      suggestions.push('Disable expensive visual effects');
    }

    if (this.metrics.memoryUsage > this.thresholds.memoryHigh) {
      suggestions.push('Reduce texture quality');
      suggestions.push('Enable texture compression');
      suggestions.push('Clear unused resources');
    }

    if (this.metrics.gpuUsage > this.thresholds.gpuHigh) {
      suggestions.push('Disable WebGL effects');
      suggestions.push('Use CSS fallback mode');
      suggestions.push('Reduce shader complexity');
    }

    return suggestions;
  }

  // Event system
  subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeToAlerts(listener: (alert: PerformanceAlert) => void): () => void {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getMetrics()));
  }

  private notifyAlertListeners(alert: PerformanceAlert): void {
    this.alertListeners.forEach(listener => listener(alert));
  }

  // Utility methods
  getAverageFPS(seconds: number = 5): number {
    const cutoff = Date.now() - (seconds * 1000);
    const recentHistory = this.history.filter(h => h.timestamp > cutoff);
    
    if (recentHistory.length === 0) return this.metrics.fps;
    
    const totalFps = recentHistory.reduce((sum, h) => sum + h.metrics.fps, 0);
    return Math.round(totalFps / recentHistory.length);
  }

  getPerformanceScore(): number {
    // Calculate overall performance score (0-100)
    let score = 100;

    // FPS score (40% weight)
    const fpsScore = Math.min(100, (this.metrics.fps / 60) * 100);
    score = score * 0.6 + fpsScore * 0.4;

    // Memory score (30% weight)
    const memoryScore = Math.max(0, 100 - (this.metrics.memoryUsage * 100));
    score = score * 0.7 + memoryScore * 0.3;

    // GPU score (30% weight)
    const gpuScore = Math.max(0, 100 - (this.metrics.gpuUsage * 100));
    score = score * 0.7 + gpuScore * 0.3;

    return Math.round(score);
  }

  // Cleanup
  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    this.listeners.clear();
    this.alertListeners.clear();
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

export function createPerformanceMonitor(
  thresholds?: Partial<PerformanceThresholds>,
  adaptiveConfig?: Partial<AdaptiveQualityConfig>
): PerformanceMonitor {
  performanceMonitor = new PerformanceMonitor(thresholds, adaptiveConfig);
  return performanceMonitor;
}

export function destroyPerformanceMonitor(): void {
  if (performanceMonitor) {
    performanceMonitor.destroy();
    performanceMonitor = null;
  }
}

// React hook for using performance monitor
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor();
  const [metrics, setMetrics] = React.useState(monitor.getMetrics());
  const [alerts, setAlerts] = React.useState(monitor.getAlerts());

  React.useEffect(() => {
    const unsubscribe = monitor.subscribe(setMetrics);
    const unsubscribeAlerts = monitor.subscribeToAlerts((alert) => {
      setAlerts(prev => [...prev, alert]);
    });

    return () => {
      unsubscribe();
      unsubscribeAlerts();
    };
  }, [monitor]);

  return {
    metrics,
    alerts,
    getAverageFPS: monitor.getAverageFPS.bind(monitor),
    getPerformanceScore: monitor.getPerformanceScore.bind(monitor),
    getOptimizationSuggestions: monitor.getOptimizationSuggestions.bind(monitor),
    shouldReduceQuality: monitor.shouldReduceQuality.bind(monitor),
    shouldIncreaseQuality: monitor.shouldIncreaseQuality.bind(monitor),
    getRecommendedQuality: monitor.getRecommendedQuality.bind(monitor),
    resolveAlert: monitor.resolveAlert.bind(monitor),
  };
}

// Import React for the hook
import React from 'react';
