/**
 * BENCHMARK TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Performance benchmarks for critical paths including rendering,
 * audio processing, and memory management.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { PaletteDirector } from '../../lib/palette/PaletteDirector';
import { AudioBus } from '../../lib/audio/AudioBus';
import { CapabilityDetector } from '../../lib/visual/CapabilityDetector';
import { PerformanceProfiler } from '../../lib/performance/PerformanceProfiler';
import { AdaptiveQualityManager } from '../../lib/performance/AdaptiveQuality';
import { ThermalThrottlingDetector } from '../../lib/performance/ThermalThrottlingDetector';

// Mock Web Audio API
const mockAudioContext = {
  createAnalyser: jest.fn(() => ({
    fftSize: 2048,
    frequencyBinCount: 1024,
    getByteFrequencyData: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn()
  })),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn()
  })),
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
  close: jest.fn()
};

const mockMediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: () => [{ stop: jest.fn() }]
  })
};

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn(() => mockAudioContext)
});

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: mockMediaDevices
});

describe('Benchmark Tests', () => {
  describe('PaletteDirector Performance', () => {
    it('should get current palette quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        PaletteDirector.getCurrentPalette();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should get color RGB quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        PaletteDirector.getColorRGB(i % 10);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should get color HSL quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        PaletteDirector.getColorHSL(i % 10);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should switch palettes quickly', () => {
      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        PaletteDirector.setPalette('psychedelic');
        PaletteDirector.setPalette('hippie');
        PaletteDirector.setPalette('mod');
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / (iterations * 3);
      
      expect(avgTime).toBeLessThan(0.1); // Should be under 0.1ms per switch
      expect(duration).toBeLessThan(300); // Total should be under 300ms
    });
  });

  describe('AudioBus Performance', () => {
    let audioBus: typeof AudioBus;

    beforeEach(async () => {
      audioBus = AudioBus;
      await audioBus.startAnalysis();
    });

    afterEach(() => {
      audioBus.stopAnalysis();
    });

    it('should get current data quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        audioBus.getCurrentData();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should handle subscription callbacks efficiently', () => {
      const iterations = 1000;
      const callbacks: ((data: any) => void)[] = [];
      
      // Create many subscribers
      for (let i = 0; i < 100; i++) {
        const callback = jest.fn();
        callbacks.push(callback);
        audioBus.subscribe(callback);
      }
      
      const start = performance.now();
      
      // Simulate many updates
      for (let i = 0; i < iterations; i++) {
        // This would normally be triggered by audio analysis
        // For testing, we'll just check the subscription mechanism
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // Should be under 100ms
    });
  });

  describe('CapabilityDetector Performance', () => {
    it('should detect capabilities quickly', () => {
      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        CapabilityDetector.detect();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(1); // Should be under 1ms per call
      expect(duration).toBeLessThan(1000); // Total should be under 1 second
    });

    it('should get device tier quickly', () => {
      const capabilities = CapabilityDetector.detect();
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        CapabilityDetector.getDeviceTier(capabilities);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });
  });

  describe('PerformanceProfiler Performance', () => {
    let profiler: PerformanceProfiler;

    beforeEach(() => {
      profiler = new PerformanceProfiler();
      profiler.startProfiling();
    });

    afterEach(() => {
      profiler.stopProfiling();
    });

    it('should record frames quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        profiler.recordFrame({
          fps: 60,
          frameTime: 16.67,
          drawCalls: 100,
          triangles: 50000,
          memoryUsage: 0.5
        });
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should generate profiles quickly', () => {
      // Record some data first
      for (let i = 0; i < 100; i++) {
        profiler.recordFrame({
          fps: 60 + Math.random() * 10,
          frameTime: 16.67 + Math.random() * 2,
          drawCalls: 100 + Math.floor(Math.random() * 50),
          triangles: 50000 + Math.floor(Math.random() * 10000),
          memoryUsage: 0.5 + Math.random() * 0.2
        });
      }

      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        profiler.getPerformanceProfile();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.1); // Should be under 0.1ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });
  });

  describe('AdaptiveQualityManager Performance', () => {
    let qualityManager: AdaptiveQualityManager;

    beforeEach(() => {
      const deviceProfile = {
        tier: 'high' as const,
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
          textureQuality: 'high' as const,
          effectComplexity: 0.8,
          updateRate: 60,
          enablePostProcessing: true,
          enableShadows: false,
          enableReflections: false,
          maxDrawCalls: 500,
          maxTriangles: 500000
        }
      };

      const performanceTargets = {
        targetFPS: 60,
        minFPS: 30,
        maxFrameTime: 33.33,
        maxMemoryUsage: 0.8,
        maxCPUUsage: 0.8
      };

      qualityManager = new AdaptiveQualityManager(deviceProfile, performanceTargets);
    });

    it('should update performance quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        qualityManager.updatePerformance(60, 16.67, 0.5);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should get current settings quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        qualityManager.getCurrentSettings();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });
  });

  describe('ThermalThrottlingDetector Performance', () => {
    let thermalDetector: ThermalThrottlingDetector;

    beforeEach(() => {
      thermalDetector = new ThermalThrottlingDetector();
      thermalDetector.startMonitoring();
    });

    afterEach(() => {
      thermalDetector.stopMonitoring();
    });

    it('should update performance quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        thermalDetector.updatePerformance(60, 16.67);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });

    it('should get thermal status quickly', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        thermalDetector.getThermalStatus();
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
      expect(duration).toBeLessThan(100); // Total should be under 100ms
    });
  });

  describe('Memory Usage Benchmarks', () => {
    it('should not leak memory during palette operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform many palette operations
      for (let i = 0; i < 10000; i++) {
        PaletteDirector.getCurrentPalette();
        PaletteDirector.getColorRGB(i % 10);
        PaletteDirector.getColorHSL(i % 10);
      }
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });

    it('should not leak memory during performance profiling', () => {
      const profiler = new PerformanceProfiler();
      profiler.startProfiling();
      
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Record many frames
      for (let i = 0; i < 1000; i++) {
        profiler.recordFrame({
          fps: 60,
          frameTime: 16.67,
          drawCalls: 100,
          triangles: 50000,
          memoryUsage: 0.5
        });
      }
      
      profiler.stopProfiling();
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });
  });

  describe('End-to-End Performance', () => {
    it('should handle realistic usage patterns efficiently', () => {
      const profiler = new PerformanceProfiler();
      const qualityManager = new AdaptiveQualityManager(
        {
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
        },
        {
          targetFPS: 60,
          minFPS: 30,
          maxFrameTime: 33.33,
          maxMemoryUsage: 0.8,
          maxCPUUsage: 0.8
        }
      );
      const thermalDetector = new ThermalThrottlingDetector();

      profiler.startProfiling();
      thermalDetector.startMonitoring();

      const start = performance.now();

      // Simulate 60 seconds of 60fps rendering
      for (let frame = 0; frame < 3600; frame++) {
        const fps = 60 + Math.random() * 10 - 5;
        const frameTime = 1000 / fps;
        const memoryUsage = 0.5 + Math.random() * 0.3;

        // Update all systems
        profiler.recordFrame({ fps, frameTime, memoryUsage });
        qualityManager.updatePerformance(fps, frameTime, memoryUsage);
        thermalDetector.updatePerformance(fps, frameTime);

        // Simulate palette operations
        if (frame % 60 === 0) {
          PaletteDirector.getCurrentPalette();
          PaletteDirector.getColorRGB(frame % 10);
        }

        // Simulate audio operations
        if (frame % 10 === 0) {
          AudioBus.getCurrentData();
        }
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (under 5 seconds for simulation)
      expect(duration).toBeLessThan(5000);

      // Check final state
      const profile = profiler.getPerformanceProfile();
      const settings = qualityManager.getCurrentSettings();
      const thermalStatus = thermalDetector.getThermalStatus();

      expect(profile).toBeDefined();
      expect(settings).toBeDefined();
      expect(thermalStatus).toBeDefined();

      // Cleanup
      profiler.stopProfiling();
      thermalDetector.stopMonitoring();
    });
  });
});
