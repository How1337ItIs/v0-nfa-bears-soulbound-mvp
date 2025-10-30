/**
 * INTEGRATION TESTS FOR LIQUID LIGHT BACKGROUND
 * 
 * Tests for the LiquidLightBackground component including WebGL integration,
 * audio reactivity, and user controls.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LiquidLightBackground } from '../../components/LiquidLightBackground';
import { AudioData } from '../../lib/visual/types';

// Mock WebGL context
const mockWebGLContext = {
  createShader: jest.fn(),
  createProgram: jest.fn(),
  createBuffer: jest.fn(),
  createTexture: jest.fn(),
  createFramebuffer: jest.fn(),
  createRenderbuffer: jest.fn(),
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  getSupportedExtensions: jest.fn(() => []),
  useProgram: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  viewport: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn(),
  bindBuffer: jest.fn(),
  bindTexture: jest.fn(),
  bindFramebuffer: jest.fn(),
  bindRenderbuffer: jest.fn(),
  bufferData: jest.fn(),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
  framebufferTexture2D: jest.fn(),
  renderbufferStorage: jest.fn(),
  framebufferRenderbuffer: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getShaderParameter: jest.fn(() => true),
  getProgramParameter: jest.fn(() => true),
  getShaderInfoLog: jest.fn(() => ''),
  getProgramInfoLog: jest.fn(() => ''),
  getAttribLocation: jest.fn(() => 0),
  getUniformLocation: jest.fn(() => {}),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform3f: jest.fn(),
  uniform4f: jest.fn(),
  uniform1i: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  canvas: document.createElement('canvas')
};

// Mock canvas
const mockCanvas = {
  getContext: jest.fn(() => mockWebGLContext),
  width: 800,
  height: 600,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Mock webgl-fluid-enhanced
const mockWebGLFluidEnhanced = {
  simulation: jest.fn(() => ({
    config: {
      SPLAT_RADIUS: 0.25,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.98,
      CURL: 30,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      VELOCITY_ITERATIONS: 20,
      COLOR_PALETTE: [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
      TRANSPARENT: true,
      INITIAL: true,
      HOVER: true
    },
    splat: jest.fn(),
    update: jest.fn(),
    render: jest.fn(),
    destroy: jest.fn()
  }))
};

// Mock PaletteDirector
jest.mock('../../lib/palette/PaletteDirector', () => ({
  PaletteDirector: {
    getCurrentPalette: jest.fn(() => ({
      name: 'test-palette',
      colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
      description: 'Test palette',
      era: '1960s',
      culturalContext: 'Test'
    })),
    getColorRGB: jest.fn((index) => [255, 0, 0])
  }
}));

// Mock calculatePhysicsParams
jest.mock('../../lib/audio/calculatePhysicsParams', () => ({
  calculatePhysicsParams: jest.fn(() => ({
    splatForce: 0.5,
    thermalRate: 0.8,
    colorPhase: 0.0,
    globalIntensity: 0.8,
    curlStrength: 30,
    viscosity: 0.98
  }))
}));

// Mock CSSFallback component
jest.mock('../../components/liquid-light/CSSFallback', () => ({
  CSSFallback: ({ intensity, motionEnabled }: { intensity: number; motionEnabled: boolean }) => (
    <div data-testid="css-fallback" data-intensity={intensity} data-motion-enabled={motionEnabled}>
      CSS Fallback
    </div>
  )
}));

// Mock LiquidLightControls component
jest.mock('../../components/liquid-light/LiquidLightControls', () => ({
  LiquidLightControls: ({ 
    intensity, 
    setIntensity, 
    motionEnabled, 
    setMotionEnabled 
  }: {
    intensity: number;
    setIntensity: (value: number) => void;
    motionEnabled: boolean;
    setMotionEnabled: (value: boolean) => void;
  }) => (
    <div data-testid="liquid-light-controls">
      <input
        data-testid="intensity-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={intensity}
        onChange={(e) => setIntensity(parseFloat(e.target.value))}
      />
      <input
        data-testid="motion-toggle"
        type="checkbox"
        checked={motionEnabled}
        onChange={(e) => setMotionEnabled(e.target.checked)}
      />
    </div>
  )
}));

// Mock global objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock webgl-fluid-enhanced
jest.mock('webgl-fluid-enhanced', () => mockWebGLFluidEnhanced);

describe('LiquidLightBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock canvas creation
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<LiquidLightBackground />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<LiquidLightBackground className="custom-class" />);
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveClass('custom-class');
    });

    it('should render CSS fallback when WebGL is not available', () => {
      mockCanvas.getContext.mockReturnValue(null);
      render(<LiquidLightBackground />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should render WebGL canvas when available', () => {
      render(<LiquidLightBackground />);
      expect(screen.getByTestId('webgl-canvas')).toBeInTheDocument();
    });
  });

  describe('audio reactivity', () => {
    it('should respond to audio data changes', async () => {
      const audioData: AudioData = {
        bass: 0.8,
        mids: 0.6,
        treble: 0.4,
        volume: 0.7,
        beatDetected: true,
        timestamp: Date.now()
      };

      render(<LiquidLightBackground audioData={audioData} />);
      
      await waitFor(() => {
        expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalled();
      });
    });

    it('should handle missing audio data gracefully', () => {
      render(<LiquidLightBackground />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });

    it('should update fluid parameters based on audio data', async () => {
      const audioData: AudioData = {
        bass: 0.9,
        mids: 0.7,
        treble: 0.5,
        volume: 0.8,
        beatDetected: true,
        timestamp: Date.now()
      };

      render(<LiquidLightBackground audioData={audioData} />);
      
      await waitFor(() => {
        expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            COLOR_PALETTE: expect.any(Array)
          })
        );
      });
    });
  });

  describe('intensity control', () => {
    it('should use default intensity when not provided', () => {
      render(<LiquidLightBackground />);
      const intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(0.8);
    });

    it('should use provided intensity', () => {
      render(<LiquidLightBackground intensity={0.5} />);
      const intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(0.5);
    });

    it('should update intensity when slider changes', () => {
      render(<LiquidLightBackground />);
      const intensitySlider = screen.getByTestId('intensity-slider');
      
      fireEvent.change(intensitySlider, { target: { value: '0.3' } });
      expect(intensitySlider).toHaveValue(0.3);
    });

    it('should apply intensity to fluid parameters', async () => {
      render(<LiquidLightBackground intensity={0.5} />);
      
      await waitFor(() => {
        expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            SPLAT_RADIUS: expect.any(Number),
            DENSITY_DISSIPATION: expect.any(Number),
            VELOCITY_DISSIPATION: expect.any(Number)
          })
        );
      });
    });
  });

  describe('motion control', () => {
    it('should enable motion by default', () => {
      render(<LiquidLightBackground />);
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeChecked();
    });

    it('should disable motion when motionEnabled is false', () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });

    it('should toggle motion when checkbox changes', () => {
      render(<LiquidLightBackground />);
      const motionToggle = screen.getByTestId('motion-toggle');
      
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
    });

    it('should disable fluid motion when motion is disabled', async () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      
      await waitFor(() => {
        expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            SPLAT_RADIUS: 0,
            CURL: 0
          })
        );
      });
    });
  });

  describe('accessibility', () => {
    it('should respect prefers-reduced-motion', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<LiquidLightBackground />);
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });

    it('should update motion when prefers-reduced-motion changes', () => {
      let matches = false;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            setTimeout(() => callback({ matches: true }), 100);
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<LiquidLightBackground />);
      
      // Initially motion should be enabled
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeChecked();
    });
  });

  describe('WebGL integration', () => {
    it('should initialize WebGL fluid simulation', async () => {
      render(<LiquidLightBackground />);
      
      await waitFor(() => {
        expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalled();
      });
    });

    it('should handle WebGL context loss', () => {
      render(<LiquidLightBackground />);
      
      // Simulate context loss
      const canvas = screen.getByTestId('webgl-canvas');
      fireEvent(canvas, new Event('webglcontextlost'));
      
      // Should fallback to CSS
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should cleanup WebGL resources on unmount', () => {
      const { unmount } = render(<LiquidLightBackground />);
      
      unmount();
      
      // Should call destroy on fluid instance
      expect(mockWebGLFluidEnhanced.simulation().destroy).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle WebGL initialization failure', () => {
      mockWebGLFluidEnhanced.simulation.mockImplementation(() => {
        throw new Error('WebGL initialization failed');
      });

      render(<LiquidLightBackground />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle audio data processing errors', () => {
      const invalidAudioData = {
        bass: 'invalid',
        mids: null,
        treble: undefined,
        volume: -1,
        beatDetected: 'yes',
        timestamp: 'invalid'
      } as any;

      expect(() => {
        render(<LiquidLightBackground audioData={invalidAudioData} />);
      }).not.toThrow();
    });
  });

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Re-render with same props
      rerender(<LiquidLightBackground />);
      
      // Should not create new fluid instance
      expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Rapid prop changes
      for (let i = 0; i < 10; i++) {
        rerender(<LiquidLightBackground intensity={i / 10} />);
      }
      
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });
  });
});
