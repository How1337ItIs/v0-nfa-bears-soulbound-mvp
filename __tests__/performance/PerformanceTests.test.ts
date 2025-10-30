/**
 * PERFORMANCE TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Tests for performance monitoring, optimization, and quality management
 * including FPS testing, memory usage, and thermal throttling detection.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { PerformanceProfiler } from '../../lib/performance/PerformanceProfiler';
import { AdaptiveQualityManager } from '../../lib/performance/AdaptiveQuality';
import { ThermalThrottlingDetector } from '../../lib/performance/ThermalThrottlingDetector';
import { GPUMemoryManager } from '../../lib/performance/GPUMemoryManager';
import { WebGL2Optimizer } from '../../lib/performance/WebGL2Optimizations';
import { DeviceProfile, PerformanceTargets } from '../../lib/visual/types';

// Mock WebGL context
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  createTexture: jest.fn(() => ({})),
  createBuffer: jest.fn(() => ({})),
  deleteTexture: jest.fn(),
  deleteBuffer: jest.fn(),
  bindTexture: jest.fn(),
  bindBuffer: jest.fn(),
  texImage2D: jest.fn(),
  bufferData: jest.fn(),
  texParameteri: jest.fn()
};

describe('Performance Tests', () => {
  describe('PerformanceProfiler', () => {
    let profiler: PerformanceProfiler;

    beforeEach(() => {
      profiler = new PerformanceProfiler();
    });

    afterEach(() => {
      profiler.stopProfiling();
    });

    it('should start and stop profiling', () => {
      expect(profiler.isProfilingActive()).toBe(false);
      
      profiler.startProfiling();
      expect(profiler.isProfilingActive()).toBe(true);
      
      profiler.stopProfiling();
      expect(profiler.isProfilingActive()).toBe(false);
    });

    it('should record frame metrics', () => {
      profiler.startProfiling();
      
      profiler.recordFrame({
        fps: 60,
        frameTime: 16.67,
        drawCalls: 100,
        triangles: 50000,
        memoryUsage: 0.5
      });

      const metrics = profiler.getCurrentMetrics();
      expect(metrics).toBeDefined();
      expect(metrics?.fps).toBe(60);
      expect(metrics?.frameTime).toBe(16.67);
      expect(metrics?.drawCalls).toBe(100);
      expect(metrics?.triangles).toBe(50000);
      expect(metrics?.memoryUsage).toBe(0.5);
    });

    it('should generate performance profile', () => {
      profiler.startProfiling();
      
      // Record multiple frames
      for (let i = 0; i < 60; i++) {
        profiler.recordFrame({
          fps: 60 + Math.random() * 10,
          frameTime: 16.67 + Math.random() * 2,
          drawCalls: 100 + Math.floor(Math.random() * 50),
          triangles: 50000 + Math.floor(Math.random() * 10000),
          memoryUsage: 0.5 + Math.random() * 0.2
        });
      }

      const profile = profiler.getPerformanceProfile();
      expect(profile).toBeDefined();
      expect(profile?.averageFPS).toBeGreaterThan(0);
      expect(profile?.minFPS).toBeGreaterThan(0);
      expect(profile?.maxFPS).toBeGreaterThan(0);
      expect(profile?.samples).toBe(60);
    });

    it('should detect performance alerts', () => {
      profiler.startProfiling();
      
      // Record low FPS
      profiler.recordFrame({
        fps: 15,
        frameTime: 66.67,
        drawCalls: 1000,
        triangles: 50000,
        memoryUsage: 0.9
      });

      const alerts = profiler.getAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(alert => alert.type === 'fps-low')).toBe(true);
      expect(alerts.some(alert => alert.type === 'memory-high')).toBe(true);
    });

    it('should track performance over time', () => {
      profiler.startProfiling();
      
      const startTime = performance.now();
      
      // Record frames over time
      for (let i = 0; i < 100; i++) {
        profiler.recordFrame({
          fps: 60,
          frameTime: 16.67,
          drawCalls: 100,
          triangles: 50000,
          memoryUsage: 0.5
        });
        
        // Small delay to simulate real timing
        if (i % 10 === 0) {
          jest.advanceTimersByTime(16);
        }
      }

      const history = profiler.getMetricsHistory();
      expect(history.length).toBe(100);
      
      const duration = profiler.getProfilingDuration();
      expect(duration).toBeGreaterThan(0);
    });

    it('should export performance data', () => {
      profiler.startProfiling();
      
      profiler.recordFrame({
        fps: 60,
        frameTime: 16.67,
        drawCalls: 100,
        triangles: 50000,
        memoryUsage: 0.5
      });

      const exportData = profiler.exportProfile();
      expect(typeof exportData).toBe('string');
      
      const parsed = JSON.parse(exportData);
      expect(parsed).toHaveProperty('profile');
      expect(parsed).toHaveProperty('alerts');
      expect(parsed).toHaveProperty('timestamp');
    });
  });

  describe('AdaptiveQualityManager', () => {
    let qualityManager: AdaptiveQualityManager;
    let deviceProfile: DeviceProfile;
    let performanceTargets: PerformanceTargets;

    beforeEach(() => {
      deviceProfile = {
        tier: 'high',
        capabilities: {
          maxTextureSize: 4096,
          maxVertexAttribs: 16,
          maxVaryingVectors: 8,
          maxFragmentUniforms: 16,
          maxVertexUniforms: 16,
          maxTextureImageUnits: 8,
          maxVertexTextureImageUnits: 4,
          maxCombinedTextureImageUnits: 16,
          maxRenderBufferSize: 4096,
          maxViewportDims: [4096, 4096],
          aliasedLineWidthRange: [1, 5],
          aliasedPointSizeRange: [1, 5],
          deviceMemory: 8,
          mobile: false
        },
        recommendedSettings: {
          resolution: 0.9,
          particleCount: 10000,
          textureQuality: 'high',
          effectComplexity: 0.8,
          updateRate: 60,
          enablePostProcessing: true,
          enableShadows: false,
          enableReflections: false,
          maxDrawCalls: 500,
          maxTriangles: 500000
        }
      };

      performanceTargets = {
        targetFPS: 60,
        minFPS: 30,
        maxFrameTime: 33.33,
        maxMemoryUsage: 0.8,
        maxCPUUsage: 0.8
      };

      qualityManager = new AdaptiveQualityManager(deviceProfile, performanceTargets);
    });

    it('should initialize with recommended settings', () => {
      const settings = qualityManager.getCurrentSettings();
      expect(settings.resolution).toBe(0.9);
      expect(settings.particleCount).toBe(10000);
      expect(settings.textureQuality).toBe('high');
      expect(settings.effectComplexity).toBe(0.8);
    });

    it('should reduce quality on poor performance', () => {
      // Simulate poor performance
      qualityManager.updatePerformance(25, 40, 0.9);
      
      const settings = qualityManager.getCurrentSettings();
      expect(settings.resolution).toBeLessThan(0.9);
      expect(settings.particleCount).toBeLessThan(10000);
    });

    it('should increase quality on good performance', () => {
      // Simulate good performance
      qualityManager.updatePerformance(70, 14, 0.5);
      
      const settings = qualityManager.getCurrentSettings();
      expect(settings.resolution).toBeGreaterThanOrEqual(0.9);
      expect(settings.particleCount).toBeGreaterThanOrEqual(10000);
    });

    it('should maintain quality within bounds', () => {
      // Simulate extreme performance
      qualityManager.updatePerformance(10, 100, 1.0);
      
      const settings = qualityManager.getCurrentSettings();
      expect(settings.resolution).toBeGreaterThanOrEqual(0.5);
      expect(settings.particleCount).toBeGreaterThanOrEqual(1000);
    });

    it('should track performance history', () => {
      // Update performance multiple times
      for (let i = 0; i < 10; i++) {
        qualityManager.updatePerformance(60 + i, 16.67, 0.5);
      }

      const history = qualityManager.getPerformanceHistory();
      expect(history.fps.length).toBe(10);
      expect(history.memory.length).toBe(10);
    });

    it('should reset to recommended settings', () => {
      // Change settings
      qualityManager.updatePerformance(25, 40, 0.9);
      
      // Reset
      qualityManager.resetToRecommended();
      
      const settings = qualityManager.getCurrentSettings();
      expect(settings.resolution).toBe(0.9);
      expect(settings.particleCount).toBe(10000);
    });
  });

  describe('ThermalThrottlingDetector', () => {
    let thermalDetector: ThermalThrottlingDetector;

    beforeEach(() => {
      thermalDetector = new ThermalThrottlingDetector();
    });

    it('should start and stop monitoring', () => {
      thermalDetector.startMonitoring();
      expect(thermalDetector.isThrottlingDetected()).toBe(false);
      
      thermalDetector.stopMonitoring();
    });

    it('should detect thermal throttling', () => {
      thermalDetector.startMonitoring();
      
      // Simulate performance degradation
      for (let i = 0; i < 50; i++) {
        thermalDetector.updatePerformance(60 - i, 16.67 + i);
      }

      const status = thermalDetector.getThermalStatus();
      expect(status.isThrottled).toBe(true);
      expect(status.throttlingLevel).toBe('moderate');
    });

    it('should provide recommendations', () => {
      thermalDetector.startMonitoring();
      
      // Simulate throttling
      for (let i = 0; i < 50; i++) {
        thermalDetector.updatePerformance(60 - i, 16.67 + i);
      }

      const status = thermalDetector.getThermalStatus();
      expect(status.recommendations.length).toBeGreaterThan(0);
      expect(status.recommendations).toContain('Reduce visual quality settings');
    });

    it('should track throttling duration', () => {
      thermalDetector.startMonitoring();
      
      // Simulate throttling
      for (let i = 0; i < 50; i++) {
        thermalDetector.updatePerformance(60 - i, 16.67 + i);
      }

      const duration = thermalDetector.getThrottlingDuration();
      expect(duration).toBeGreaterThan(0);
    });

    it('should reset throttling state', () => {
      thermalDetector.startMonitoring();
      
      // Simulate throttling
      for (let i = 0; i < 50; i++) {
        thermalDetector.updatePerformance(60 - i, 16.67 + i);
      }

      expect(thermalDetector.isThrottlingDetected()).toBe(true);
      
      thermalDetector.reset();
      expect(thermalDetector.isThrottlingDetected()).toBe(false);
    });
  });

  describe('GPUMemoryManager', () => {
    let memoryManager: GPUMemoryManager;

    beforeEach(() => {
      memoryManager = new GPUMemoryManager(mockWebGLContext as any);
    });

    afterEach(() => {
      memoryManager.cleanup();
    });

    it('should create texture pools', () => {
      const pool = memoryManager.createTexturePool('test', 256, 256);
      expect(pool).toBeDefined();
      expect(pool.id).toBe('test');
      expect(pool.width).toBe(256);
      expect(pool.height).toBe(256);
    });

    it('should manage texture allocation', () => {
      memoryManager.createTexturePool('test', 256, 256, undefined, undefined, 5);
      
      const texture1 = memoryManager.getTexture('test');
      const texture2 = memoryManager.getTexture('test');
      
      expect(texture1).toBeDefined();
      expect(texture2).toBeDefined();
      expect(texture1).not.toBe(texture2);
    });

    it('should track memory usage', () => {
      memoryManager.createTexturePool('test', 256, 256, undefined, undefined, 10);
      
      const info = memoryManager.getMemoryInfo();
      expect(info.textureCount).toBe(10);
      expect(info.memoryUsage).toBeGreaterThan(0);
    });

    it('should detect low memory', () => {
      memoryManager.setMaxMemoryUsage(0.1);
      
      // Create many textures to exceed limit
      memoryManager.createTexturePool('test', 1024, 1024, undefined, undefined, 100);
      
      expect(memoryManager.isMemoryLow()).toBe(true);
    });

    it('should cleanup unused resources', () => {
      memoryManager.createTexturePool('test', 256, 256, undefined, undefined, 10);
      
      const initialInfo = memoryManager.getMemoryInfo();
      expect(initialInfo.textureCount).toBe(10);
      
      memoryManager.cleanupUnusedResources();
      
      const finalInfo = memoryManager.getMemoryInfo();
      expect(finalInfo.textureCount).toBeLessThan(10);
    });
  });

  describe('WebGL2Optimizer', () => {
    let optimizer: WebGL2Optimizer;

    beforeEach(() => {
      optimizer = new WebGL2Optimizer(mockWebGLContext as any);
    });

    it('should enable optimizations', () => {
      const enabled = optimizer.enableOptimization('instanced-fluid-particles');
      expect(enabled).toBeDefined();
    });

    it('should track performance gain', () => {
      optimizer.enableOptimization('instanced-fluid-particles');
      optimizer.enableOptimization('transform-feedback-simulation');
      
      const gain = optimizer.getPerformanceGain();
      expect(gain).toBeGreaterThan(0);
    });

    it('should optimize for device tier', () => {
      optimizer.optimizeForDevice('ultra');
      
      const enabledOpts = optimizer.getEnabledOptimizations();
      expect(enabledOpts.length).toBeGreaterThan(0);
    });

    it('should update performance metrics', () => {
      optimizer.updatePerformanceMetrics({
        fps: 60,
        frameTime: 16.67,
        drawCalls: 100,
        triangles: 50000,
        memoryUsage: 0.5
      });

      const metrics = optimizer.getPerformanceMetrics();
      expect(metrics.fps).toBe(60);
      expect(metrics.frameTime).toBe(16.67);
    });
  });

  describe('Performance Integration', () => {
    it('should work together for comprehensive monitoring', () => {
      const profiler = new PerformanceProfiler();
      const qualityManager = new AdaptiveQualityManager(deviceProfile, performanceTargets);
      const thermalDetector = new ThermalThrottlingDetector();
      const memoryManager = new GPUMemoryManager(mockWebGLContext as any);

      // Start monitoring
      profiler.startProfiling();
      thermalDetector.startMonitoring();

      // Simulate performance updates
      for (let i = 0; i < 60; i++) {
        const fps = 60 + Math.random() * 10;
        const frameTime = 16.67 + Math.random() * 2;
        const memoryUsage = 0.5 + Math.random() * 0.3;

        profiler.recordFrame({ fps, frameTime, memoryUsage });
        qualityManager.updatePerformance(fps, frameTime, memoryUsage);
        thermalDetector.updatePerformance(fps, frameTime);
      }

      // Check results
      const profile = profiler.getPerformanceProfile();
      const settings = qualityManager.getCurrentSettings();
      const thermalStatus = thermalDetector.getThermalStatus();
      const memoryInfo = memoryManager.getMemoryInfo();

      expect(profile).toBeDefined();
      expect(settings).toBeDefined();
      expect(thermalStatus).toBeDefined();
      expect(memoryInfo).toBeDefined();

      // Cleanup
      profiler.stopProfiling();
      thermalDetector.stopMonitoring();
      memoryManager.cleanup();
    });
  });
});
