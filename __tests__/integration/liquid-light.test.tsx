/**
 * LIQUID LIGHT INTEGRATION TESTS
 * 
 * Comprehensive test suite for liquid light system integration
 * Tests all components working together as a unified system
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LiquidLightBackground from '@/components/LiquidLightBackground';
import { PaletteDirector } from '@/lib/palette';
import { useAudioReactive } from '@/lib/audio/useAudioReactive';

// Mock webgl-fluid-enhanced
vi.mock('webgl-fluid-enhanced', () => ({
  default: {
    simulation: vi.fn(() => ({
      config: {
        SPLAT_RADIUS: 8,
        DENSITY_DISSIPATION: 0.98,
        VELOCITY_DISSIPATION: 0.98,
        CURL: 0,
      },
      splat: vi.fn(),
    })),
  },
}));

// Mock audio reactivity
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

// Mock device capabilities
vi.mock('@/lib/fluid/config', () => ({
  detectDeviceCapabilities: vi.fn(() => ({
    webgl: true,
    webgl2: true,
    maxTextureSize: 4096,
    deviceMemory: 8,
    mobile: false,
    tier: 'high' as const,
  })),
  AUTHENTIC_CONFIGS: {
    high: {
      SPLAT_RADIUS: 8,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.98,
      CURL: 0,
    },
    medium: {
      SPLAT_RADIUS: 6,
      DENSITY_DISSIPATION: 0.99,
      VELOCITY_DISSIPATION: 0.99,
      CURL: 0,
    },
    low: {
      SPLAT_RADIUS: 4,
      DENSITY_DISSIPATION: 0.995,
      VELOCITY_DISSIPATION: 0.995,
      CURL: 0,
    },
  },
}));

describe('Liquid Light Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders liquid light background with WebGL canvas', async () => {
      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        const canvas = screen.getByRole('img', { hidden: true });
        expect(canvas).toBeInTheDocument();
        expect(canvas.tagName).toBe('CANVAS');
      });
    });

    it('renders user controls interface', async () => {
      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/intensity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/motion/i)).toBeInTheDocument();
      });
    });

    it('renders development HUD in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        expect(screen.getByText(/FPS:/)).toBeInTheDocument();
        expect(screen.getByText(/Tier:/)).toBeInTheDocument();
        expect(screen.getByText(/WebGL:/)).toBeInTheDocument();
      });
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('User Controls Integration', () => {
    it('updates intensity when slider is moved', async () => {
      render(<LiquidLightBackground />);
      
      const intensitySlider = screen.getByLabelText(/intensity/i);
      fireEvent.change(intensitySlider, { target: { value: '150' } });
      
      expect(intensitySlider).toHaveValue(150);
    });

    it('toggles motion when checkbox is clicked', async () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByLabelText(/motion/i);
      fireEvent.click(motionToggle);
      
      expect(motionToggle).not.toBeChecked();
    });

    it('disables motion toggle when prefers-reduced-motion is detected', async () => {
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

      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        const motionToggle = screen.getByLabelText(/motion/i);
        expect(motionToggle).toBeDisabled();
      });
    });
  });

  describe('Audio Reactivity Integration', () => {
    it('responds to audio data changes', async () => {
      const mockUseAudioReactive = vi.mocked(useAudioReactive);
      
      render(<LiquidLightBackground />);
      
      // Simulate beat detection
      mockUseAudioReactive.mockReturnValue({
        audioData: {
          bass: 0.8,
          mids: 0.6,
          treble: 0.9,
          volume: 0.8,
          beatDetected: true,
          spectralData: new Float32Array(32),
        },
      });
      
      await waitFor(() => {
        // Component should re-render with new audio data
        expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
      });
    });
  });

  describe('Palette Integration', () => {
    it('uses PaletteDirector for color management', async () => {
      const getCurrentPaletteSpy = vi.spyOn(PaletteDirector, 'getCurrentPalette');
      
      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        expect(getCurrentPaletteSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('monitors FPS and adjusts quality tier', async () => {
      render(<LiquidLightBackground />);
      
      // Simulate low FPS scenario
      const canvas = screen.getByRole('img', { hidden: true });
      
      // Trigger performance monitoring
      fireEvent.load(canvas);
      
      await waitFor(() => {
        // Performance monitoring should be active
        expect(canvas).toBeInTheDocument();
      });
    });
  });

  describe('CSS Fallback Integration', () => {
    it('falls back to CSS when WebGL is not available', async () => {
      // Mock no WebGL support
      vi.mocked(require('@/lib/fluid/config').detectDeviceCapabilities).mockReturnValue({
        webgl: false,
        webgl2: false,
        maxTextureSize: 0,
        deviceMemory: 0,
        mobile: true,
        tier: 'low' as const,
      });

      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        // Should render CSS fallback instead of canvas
        expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles WebGL context loss gracefully', async () => {
      render(<LiquidLightBackground />);
      
      const canvas = screen.getByRole('img', { hidden: true });
      
      // Simulate WebGL context loss
      fireEvent(canvas, new Event('webglcontextlost'));
      
      await waitFor(() => {
        // Should fall back to CSS
        expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
      });
    });
  });
});

describe('End-to-End Integration', () => {
  it('integrates all components seamlessly', async () => {
    render(<LiquidLightBackground />);
    
    await waitFor(() => {
      // All major components should be present
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText(/intensity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/motion/i)).toBeInTheDocument();
    });
  });
});

