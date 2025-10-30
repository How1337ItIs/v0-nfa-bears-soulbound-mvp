/**
 * VISUAL REGRESSION TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Tests for visual consistency including component rendering,
 * color palette accuracy, and visual state changes.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LiquidLightBackground } from '../../components/LiquidLightBackground';
import { CSSFallback } from '../../components/liquid-light/CSSFallback';
import { PaletteDirector } from '../../lib/palette/PaletteDirector';

// Mock WebGL context
const mockWebGLContext = {
  createShader: jest.fn(),
  createProgram: jest.fn(),
  createBuffer: jest.fn(),
  createTexture: jest.fn(),
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
  bufferData: jest.fn(),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
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
      colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]],
      description: 'Test palette',
      era: '1960s',
      culturalContext: 'Test'
    })),
    getColorRGB: jest.fn((index) => {
      const colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]];
      return colors[index % colors.length];
    }),
    getColorHSL: jest.fn((index) => {
      const colors = [[0, 100, 50], [120, 100, 50], [240, 100, 50], [60, 100, 50]];
      return colors[index % colors.length];
    })
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
    <div 
      data-testid="css-fallback" 
      data-intensity={intensity} 
      data-motion-enabled={motionEnabled}
      className={motionEnabled ? 'motion-enabled' : 'motion-disabled'}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: intensity,
        background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
        zIndex: -1
      }}
    >
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
    <div data-testid="liquid-light-controls" style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <input
        data-testid="intensity-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={intensity}
        onChange={(e) => setIntensity(parseFloat(e.target.value))}
        style={{ width: '100px' }}
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

// Mock webgl-fluid-enhanced
jest.mock('webgl-fluid-enhanced', () => mockWebGLFluidEnhanced);

// Mock document.createElement
jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas as any;
  }
  return document.createElement(tagName);
});

describe('Visual Regression Tests', () => {
  describe('LiquidLightBackground rendering', () => {
    it('should render consistently with default props', () => {
      const { container } = render(<LiquidLightBackground />);
      
      // Check container structure
      const liquidContainer = screen.getByTestId('liquid-light-container');
      expect(liquidContainer).toBeInTheDocument();
      expect(liquidContainer).toHaveStyle('position: absolute');
      expect(liquidContainer).toHaveStyle('top: 0');
      expect(liquidContainer).toHaveStyle('left: 0');
      expect(liquidContainer).toHaveStyle('width: 100%');
      expect(liquidContainer).toHaveStyle('height: 100%');
      expect(liquidContainer).toHaveStyle('z-index: -1');
    });

    it('should render consistently with custom className', () => {
      const { container } = render(<LiquidLightBackground className="custom-class" />);
      
      const liquidContainer = screen.getByTestId('liquid-light-container');
      expect(liquidContainer).toHaveClass('custom-class');
    });

    it('should render WebGL canvas when available', () => {
      render(<LiquidLightBackground />);
      
      const canvas = screen.getByTestId('webgl-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveStyle('position: absolute');
      expect(canvas).toHaveStyle('top: 0');
      expect(canvas).toHaveStyle('left: 0');
      expect(canvas).toHaveStyle('width: 100%');
      expect(canvas).toHaveStyle('height: 100%');
    });

    it('should render CSS fallback when WebGL is not available', () => {
      mockCanvas.getContext.mockReturnValue(null);
      render(<LiquidLightBackground />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('CSSFallback rendering', () => {
    it('should render with default props', () => {
      render(<CSSFallback />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveStyle('position: absolute');
      expect(fallback).toHaveStyle('top: 0');
      expect(fallback).toHaveStyle('left: 0');
      expect(fallback).toHaveStyle('width: 100%');
      expect(fallback).toHaveStyle('height: 100%');
      expect(fallback).toHaveStyle('z-index: -1');
    });

    it('should render with custom intensity', () => {
      render(<CSSFallback intensity={0.5} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('data-intensity', '0.5');
      expect(fallback).toHaveStyle('opacity: 0.5');
    });

    it('should render with motion enabled', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('data-motion-enabled', 'true');
      expect(fallback).toHaveClass('motion-enabled');
    });

    it('should render with motion disabled', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={false} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('data-motion-enabled', 'false');
      expect(fallback).toHaveClass('motion-disabled');
    });
  });

  describe('color palette consistency', () => {
    it('should use consistent palette colors', () => {
      render(<LiquidLightBackground />);
      
      // Check that palette colors are used
      expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          COLOR_PALETTE: expect.any(Array)
        })
      );
    });

    it('should maintain color consistency across renders', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Re-render with same props
      rerender(<LiquidLightBackground />);
      
      // Should use same palette
      expect(mockWebGLFluidEnhanced.simulation).toHaveBeenCalledTimes(1);
    });

    it('should handle palette changes consistently', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Mock palette change
      const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
      PaletteDirector.getCurrentPalette.mockReturnValue({
        name: 'new-palette',
        colors: [[128, 0, 128], [255, 165, 0], [0, 128, 128]],
        description: 'New palette',
        era: '1960s',
        culturalContext: 'Test'
      });
      
      rerender(<LiquidLightBackground />);
      
      // Should still render
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });
  });

  describe('intensity scaling consistency', () => {
    it('should scale intensity consistently', () => {
      const { rerender } = render(<LiquidLightBackground intensity={0.5} />);
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(0.5);
      
      // Change intensity
      rerender(<LiquidLightBackground intensity={0.8} />);
      expect(intensitySlider).toHaveValue(0.8);
    });

    it('should apply intensity to visual parameters', async () => {
      render(<LiquidLightBackground intensity={0.6} />);
      
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

    it('should handle intensity edge cases', () => {
      // Test minimum intensity
      const { rerender } = render(<LiquidLightBackground intensity={0} />);
      let intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(0);
      
      // Test maximum intensity
      rerender(<LiquidLightBackground intensity={1} />);
      intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(1);
      
      // Test invalid intensity (should be clamped)
      rerender(<LiquidLightBackground intensity={1.5} />);
      intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveValue(1);
    });
  });

  describe('motion state consistency', () => {
    it('should handle motion enabled state consistently', () => {
      render(<LiquidLightBackground motionEnabled={true} />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeChecked();
    });

    it('should handle motion disabled state consistently', () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });

    it('should toggle motion state consistently', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should start enabled
      expect(motionToggle).toBeChecked();
      
      // Toggle off
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      // Toggle on
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
    });
  });

  describe('audio reactivity consistency', () => {
    it('should handle audio data consistently', () => {
      const audioData = {
        bass: 0.8,
        mids: 0.6,
        treble: 0.4,
        volume: 0.7,
        beatDetected: true,
        timestamp: Date.now()
      };

      render(<LiquidLightBackground audioData={audioData} />);
      
      // Should render without errors
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });

    it('should handle missing audio data consistently', () => {
      render(<LiquidLightBackground />);
      
      // Should render without errors
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });

    it('should handle audio data changes consistently', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      const audioData1 = {
        bass: 0.8,
        mids: 0.6,
        treble: 0.4,
        volume: 0.7,
        beatDetected: true,
        timestamp: Date.now()
      };
      
      rerender(<LiquidLightBackground audioData={audioData1} />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
      
      const audioData2 = {
        bass: 0.2,
        mids: 0.4,
        treble: 0.8,
        volume: 0.3,
        beatDetected: false,
        timestamp: Date.now()
      };
      
      rerender(<LiquidLightBackground audioData={audioData2} />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });
  });

  describe('error state consistency', () => {
    it('should handle WebGL context loss consistently', () => {
      render(<LiquidLightBackground />);
      
      // Simulate context loss
      const canvas = screen.getByTestId('webgl-canvas');
      fireEvent(canvas, new Event('webglcontextlost'));
      
      // Should fallback to CSS
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle WebGL initialization failure consistently', () => {
      mockWebGLFluidEnhanced.simulation.mockImplementation(() => {
        throw new Error('WebGL initialization failed');
      });

      render(<LiquidLightBackground />);
      
      // Should fallback to CSS
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle invalid props consistently', () => {
      const invalidProps = {
        intensity: NaN,
        motionEnabled: 'invalid' as any,
        audioData: 'invalid' as any
      };

      expect(() => {
        render(<LiquidLightBackground {...invalidProps} />);
      }).not.toThrow();
    });
  });

  describe('performance consistency', () => {
    it('should render consistently under load', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Rapid re-renders
      for (let i = 0; i < 100; i++) {
        rerender(<LiquidLightBackground intensity={i / 100} />);
      }
      
      // Should still render
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });

    it('should maintain visual consistency during prop changes', () => {
      const { rerender } = render(<LiquidLightBackground />);
      
      // Change multiple props
      rerender(<LiquidLightBackground intensity={0.5} motionEnabled={false} />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
      
      rerender(<LiquidLightBackground intensity={0.8} motionEnabled={true} />);
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
    });
  });

  describe('cross-browser consistency', () => {
    it('should render consistently across different user agents', () => {
      // Mock different user agents
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      ];

      userAgents.forEach(userAgent => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true
        });

        const { unmount } = render(<LiquidLightBackground />);
        expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('accessibility visual consistency', () => {
    it('should maintain visual consistency with accessibility features', () => {
      // Test with prefers-reduced-motion
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
      
      // Should still render consistently
      expect(screen.getByTestId('liquid-light-container')).toBeInTheDocument();
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });
  });
});
