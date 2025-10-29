/**
 * VISUAL ORCHESTRATION INTEGRATION TESTS
 * 
 * Comprehensive test suite for Week 2 visual orchestration system
 * Tests VisualPolicy, VisualOrchestrator, LayerCoordinator, and PerformanceMonitor
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VisualOrchestrator from '@/lib/visual/VisualOrchestrator';
import { 
  createVisualPolicyManager, 
  getVisualPolicyManager,
  destroyVisualPolicyManager,
  createLayerCoordinator,
  createPerformanceMonitor,
  destroyPerformanceMonitor
} from '@/lib/visual';
import { DeviceCapabilities } from '@/lib/visual/types';

// Mock dependencies
vi.mock('@/lib/audio/useAudioReactive', () => ({
  useAudioReactive: vi.fn(() => ({
    audioData: {
      bass: 0.5,
      mids: 0.3,
      treble: 0.7,
      volume: 0.6,
      beatDetected: false,
      spectralData: new Float32Array(32),
    },
  })),
}));

vi.mock('@/lib/audio', () => ({
  calculatePhysicsParams: vi.fn(() => ({
    splatForce: 10,
    thermalRate: 0.98,
    colorPhase: 0,
    globalIntensity: 1.0,
    curlStrength: 0,
    viscosity: 0.98,
  })),
}));

vi.mock('@/lib/palette', () => ({
  PaletteDirector: {
    getCurrentPalette: vi.fn(() => ({
      id: 'psychedelic',
      name: 'Psychedelic',
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    })),
  },
}));

vi.mock('@/components/liquid-light', () => ({
  CSSFallback: vi.fn(({ className, style }) => (
    <div data-testid="css-fallback" className={className} style={style}>
      CSS Fallback
    </div>
  )),
}));

vi.mock('@/components/LiquidLightBackground', () => ({
  default: vi.fn(({ className, style }) => (
    <canvas data-testid="webgl-canvas" className={className} style={style} />
  )),
}));

describe('Visual Orchestration Integration Tests', () => {
  beforeEach(() => {
    // Clean up singletons
    destroyVisualPolicyManager();
    destroyPerformanceMonitor();
  });

  describe('VisualPolicy Integration', () => {
    it('creates and manages visual policy correctly', () => {
      const manager = createVisualPolicyManager({
        forceCapabilities: {
          webgl: true,
          webgl2: true,
          maxTextureSize: 4096,
          deviceMemory: 8,
          mobile: false,
          tier: 'high',
        },
        forceIntensity: 0.8,
        forceMotionEnabled: true,
      });

      const policy = manager.getPolicy();
      
      expect(policy.webglEnabled).toBe(true);
      expect(policy.intensity).toBe(0.8);
      expect(policy.motionEnabled).toBe(true);
      expect(policy.performanceTier).toBe('high');
    });

    it('handles prefers-reduced-motion correctly', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const manager = createVisualPolicyManager();
      const policy = manager.getPolicy();
      
      expect(policy.prefersReducedMotion).toBe(true);
      expect(policy.motionEnabled).toBe(false);
    });

    it('updates policy and notifies listeners', async () => {
      const manager = createVisualPolicyManager();
      let notifiedPolicy = null;
      
      const unsubscribe = manager.subscribe((policy) => {
        notifiedPolicy = policy;
      });

      manager.setIntensity(0.5);
      
      await waitFor(() => {
        expect(notifiedPolicy?.intensity).toBe(0.5);
      });

      unsubscribe();
    });
  });

  describe('VisualOrchestrator Integration', () => {
    it('renders with all layers when WebGL is available', async () => {
      const mockCapabilities: DeviceCapabilities = {
        webgl: true,
        webgl2: true,
        webgpu: false,
        maxTextureSize: 4096,
        deviceMemory: 8,
        mobile: false,
        tier: 'high',
      };

      render(
        <VisualOrchestrator
          config={{
            forceCapabilities: mockCapabilities,
          }}
        >
          <div data-testid="app-content">App Content</div>
        </VisualOrchestrator>
      );

      await waitFor(() => {
        expect(screen.getByTestId('webgl-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('app-content')).toBeInTheDocument();
      });
    });

    it('falls back to CSS when WebGL is not available', async () => {
      const mockCapabilities: DeviceCapabilities = {
        webgl: false,
        webgl2: false,
        webgpu: false,
        maxTextureSize: 0,
        deviceMemory: 0,
        mobile: true,
        tier: 'low',
      };

      render(
        <VisualOrchestrator
          config={{
            forceCapabilities: mockCapabilities,
          }}
        >
          <div data-testid="app-content">App Content</div>
        </VisualOrchestrator>
      );

      await waitFor(() => {
        expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
        expect(screen.queryByTestId('webgl-canvas')).not.toBeInTheDocument();
      });
    });

    it('handles state changes and errors', async () => {
      const onStateChange = vi.fn();
      const onError = vi.fn();
      const onWarning = vi.fn();

      render(
        <VisualOrchestrator
          onStateChange={onStateChange}
          onError={onError}
          onWarning={onWarning}
        >
          <div data-testid="app-content">App Content</div>
        </VisualOrchestrator>
      );

      await waitFor(() => {
        expect(onStateChange).toHaveBeenCalled();
      });
    });

    it('shows development HUD in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <VisualOrchestrator>
          <div data-testid="app-content">App Content</div>
        </VisualOrchestrator>
      );

      await waitFor(() => {
        expect(screen.getByText(/FPS:/)).toBeInTheDocument();
        expect(screen.getByText(/Quality:/)).toBeInTheDocument();
        expect(screen.getByText(/Layers:/)).toBeInTheDocument();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('LayerCoordinator Integration', () => {
    it('manages layers and detects conflicts', () => {
      const coordinator = createLayerCoordinator();

      // Add layers
      coordinator.addLayer({
        id: 'webgl-layer',
        type: 'webgl',
        enabled: true,
        priority: 1,
        zIndex: 0,
        opacity: 1.0,
        blendMode: 'normal',
      });

      coordinator.addLayer({
        id: 'css-layer',
        type: 'css',
        enabled: true,
        priority: 2,
        zIndex: 0, // Same zIndex as webgl-layer
        opacity: 1.0,
        blendMode: 'normal',
      });

      const composition = coordinator.getComposition();
      expect(composition?.layers).toHaveLength(2);

      const conflicts = coordinator.getConflicts();
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('zIndex');
    });

    it('optimizes layers for device capabilities', () => {
      const coordinator = createLayerCoordinator();
      
      coordinator.addLayer({
        id: 'webgl-layer',
        type: 'webgl',
        enabled: true,
        priority: 1,
        zIndex: 0,
        opacity: 1.0,
        blendMode: 'normal',
      });

      const mockCapabilities: DeviceCapabilities = {
        webgl: true,
        webgl2: true,
        webgpu: false,
        maxTextureSize: 1024,
        deviceMemory: 2,
        mobile: true,
        tier: 'low',
      };

      const mockPolicy = {
        capabilities: mockCapabilities,
        performanceTier: 'low' as const,
        targetFPS: 30,
        maxTextureSize: 1024,
        motionEnabled: true,
        intensity: 0.5,
        prefersReducedMotion: false,
        paletteId: 'psychedelic',
        mode: 'reactive' as const,
        webglEnabled: true,
        audioEnabled: true,
        thermalEnabled: true,
        thinFilmEnabled: false,
        fluidQuality: 'low' as const,
        particleCount: 1000,
        resolution: 0.5,
        highContrast: false,
        colorBlindFriendly: false,
        reducedMotion: false,
      };

      const optimizations = coordinator.optimizeForDevice(mockCapabilities, mockPolicy);
      expect(optimizations).toHaveLength(1);
      expect(optimizations[0].optimizations.culling).toBe(true);
      expect(optimizations[0].optimizations.quality).toBe('low');
    });
  });

  describe('PerformanceMonitor Integration', () => {
    it('tracks performance metrics', async () => {
      const monitor = createPerformanceMonitor();

      // Simulate frame updates
      for (let i = 0; i < 60; i++) {
        monitor['updateFPSMetrics']();
      }

      const metrics = monitor.getMetrics();
      expect(metrics.fps).toBeGreaterThan(0);
      expect(metrics.frameTime).toBeGreaterThan(0);
    });

    it('creates performance alerts', () => {
      const monitor = createPerformanceMonitor({
        fpsLow: 30,
        fpsHigh: 60,
      });

      // Simulate low FPS
      monitor['metrics'].fps = 25;
      monitor['checkPerformanceAlerts']();

      const alerts = monitor.getAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('fps');
      expect(alerts[0].severity).toBe('high');
    });

    it('provides optimization suggestions', () => {
      const monitor = createPerformanceMonitor();
      
      // Simulate poor performance
      monitor['metrics'].fps = 20;
      monitor['metrics'].memoryUsage = 0.9;
      monitor['metrics'].gpuUsage = 0.95;

      const suggestions = monitor.getOptimizationSuggestions();
      expect(suggestions).toContain('Consider reducing particle count');
      expect(suggestions).toContain('Reduce texture quality');
      expect(suggestions).toContain('Disable WebGL effects');
    });

    it('handles adaptive quality recommendations', () => {
      const monitor = createPerformanceMonitor();
      
      // Simulate low performance
      monitor['metrics'].fps = 20;
      monitor['metrics'].memoryUsage = 0.9;
      monitor['metrics'].gpuUsage = 0.95;

      expect(monitor.shouldReduceQuality()).toBe(true);
      expect(monitor.shouldIncreaseQuality()).toBe(false);
    });
  });

  describe('End-to-End Integration', () => {
    it('integrates all components seamlessly', async () => {
      const mockCapabilities: DeviceCapabilities = {
        webgl: true,
        webgl2: true,
        webgpu: false,
        maxTextureSize: 4096,
        deviceMemory: 8,
        mobile: false,
        tier: 'high',
      };

      render(
        <VisualOrchestrator
          config={{
            forceCapabilities: mockCapabilities,
            forceIntensity: 0.8,
            forceMotionEnabled: true,
          }}
        >
          <div data-testid="app-content">App Content</div>
        </VisualOrchestrator>
      );

      await waitFor(() => {
        // All major components should be present
        expect(screen.getByTestId('webgl-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('app-content')).toBeInTheDocument();
      });
    });

    it('handles device capability changes', async () => {
      const manager = createVisualPolicyManager();
      const coordinator = createLayerCoordinator();

      // Initial high-end device
      const highEndCapabilities: DeviceCapabilities = {
        webgl: true,
        webgl2: true,
        webgpu: false,
        maxTextureSize: 4096,
        deviceMemory: 8,
        mobile: false,
        tier: 'high',
      };

      manager.updateCapabilities(highEndCapabilities);
      expect(manager.getPolicy().performanceTier).toBe('high');

      // Simulate device downgrade
      const lowEndCapabilities: DeviceCapabilities = {
        webgl: true,
        webgl2: false,
        webgpu: false,
        maxTextureSize: 1024,
        deviceMemory: 2,
        mobile: true,
        tier: 'low',
      };

      manager.updateCapabilities(lowEndCapabilities);
      expect(manager.getPolicy().performanceTier).toBe('low');
    });
  });

  describe('Error Handling', () => {
    it('handles VisualPolicy errors gracefully', () => {
      expect(() => {
        getVisualPolicyManager();
      }).toThrow('VisualPolicyManager not initialized');
    });

    it('handles PerformanceMonitor cleanup', () => {
      const monitor = createPerformanceMonitor();
      expect(() => {
        monitor.destroy();
      }).not.toThrow();
    });

    it('handles LayerCoordinator cleanup', () => {
      const coordinator = createLayerCoordinator();
      coordinator.addLayer({
        id: 'test-layer',
        type: 'webgl',
        enabled: true,
        priority: 1,
        zIndex: 0,
        opacity: 1.0,
        blendMode: 'normal',
      });

      expect(coordinator.getAllLayers()).toHaveLength(1);
      
      coordinator.clear();
      expect(coordinator.getAllLayers()).toHaveLength(0);
    });
  });
});
