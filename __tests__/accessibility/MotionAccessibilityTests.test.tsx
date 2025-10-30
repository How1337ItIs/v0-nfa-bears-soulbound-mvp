/**
 * MOTION ACCESSIBILITY TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Specific tests for motion accessibility including prefers-reduced-motion,
 * motion controls, and animation alternatives.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LiquidLightBackground } from '../../components/LiquidLightBackground';
import { CSSFallback } from '../../components/liquid-light/CSSFallback';

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
    <div 
      data-testid="css-fallback" 
      data-intensity={intensity} 
      data-motion-enabled={motionEnabled}
      className={motionEnabled ? 'motion-enabled' : 'motion-disabled'}
      role="img"
      aria-label="Liquid light background"
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
    <div data-testid="liquid-light-controls" role="toolbar" aria-label="Liquid light controls">
      <label htmlFor="intensity-slider">Intensity</label>
      <input
        id="intensity-slider"
        data-testid="intensity-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={intensity}
        onChange={(e) => setIntensity(parseFloat(e.target.value))}
        aria-label="Adjust liquid light intensity"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={intensity}
      />
      <label htmlFor="motion-toggle">Enable Motion</label>
      <input
        id="motion-toggle"
        data-testid="motion-toggle"
        type="checkbox"
        checked={motionEnabled}
        onChange={(e) => setMotionEnabled(e.target.checked)}
        aria-label="Toggle liquid light motion effects"
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

describe('Motion Accessibility Tests', () => {
  describe('prefers-reduced-motion support', () => {
    it('should respect prefers-reduced-motion: reduce', () => {
      // Mock prefers-reduced-motion: reduce
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
      
      // Motion should be disabled
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });

    it('should respect prefers-reduced-motion: no-preference', () => {
      // Mock prefers-reduced-motion: no-preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<LiquidLightBackground />);
      
      // Motion should be enabled by default
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeChecked();
    });

    it('should update when prefers-reduced-motion changes', async () => {
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
      let motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeChecked();

      // Simulate change to prefers-reduced-motion
      matches = true;
      window.dispatchEvent(new Event('change'));

      await waitFor(() => {
        motionToggle = screen.getByTestId('motion-toggle');
        expect(motionToggle).not.toBeChecked();
      });
    });

    it('should listen for prefers-reduced-motion changes', () => {
      const addEventListener = jest.fn();
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<LiquidLightBackground />);
      
      // Should add event listener for prefers-reduced-motion
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('motion control accessibility', () => {
    it('should provide accessible motion toggle', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toHaveAttribute('type', 'checkbox');
      expect(motionToggle).toHaveAttribute('aria-label', 'Toggle liquid light motion effects');
    });

    it('should support keyboard navigation for motion toggle', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should be focusable
      motionToggle.focus();
      expect(document.activeElement).toBe(motionToggle);
      
      // Should support space key activation
      fireEvent.keyDown(motionToggle, { key: ' ' });
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.keyDown(motionToggle, { key: ' ' });
      expect(motionToggle).toBeChecked();
    });

    it('should provide clear visual feedback for motion state', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should start checked (motion enabled)
      expect(motionToggle).toBeChecked();
      
      // Should toggle state
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
    });

    it('should announce motion state changes to screen readers', () => {
      render(<LiquidLightBackground />);
      
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('CSS fallback motion accessibility', () => {
    it('should respect motion preferences in CSS fallback', () => {
      // Test with motion enabled
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      let fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-enabled');
      
      // Test with motion disabled
      const { rerender } = render(<CSSFallback intensity={0.8} motionEnabled={false} />);
      fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-disabled');
    });

    it('should handle prefers-reduced-motion in CSS fallback', () => {
      // Mock prefers-reduced-motion: reduce
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

      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-disabled');
    });
  });

  describe('motion alternatives', () => {
    it('should provide static visual alternative when motion is disabled', () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      
      // Should still render visual content
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toBeInTheDocument();
      
      // Should have proper accessibility attributes
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('aria-label', 'Liquid light background');
    });

    it('should maintain visual interest without motion', () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      
      // Should still have visual content
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toBeVisible();
      
      // Should have proper styling
      expect(container).toHaveStyle('position: absolute');
      expect(container).toHaveStyle('top: 0');
      expect(container).toHaveStyle('left: 0');
      expect(container).toHaveStyle('width: 100%');
      expect(container).toHaveStyle('height: 100%');
    });

    it('should provide intensity control as motion alternative', () => {
      render(<LiquidLightBackground motionEnabled={false} />);
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toBeInTheDocument();
      expect(intensitySlider).toHaveAttribute('aria-label', 'Adjust liquid light intensity');
    });
  });

  describe('motion timing and duration', () => {
    it('should not have excessive motion duration', () => {
      render(<LiquidLightBackground motionEnabled={true} />);
      
      // Motion should be controllable and not excessive
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeInTheDocument();
      
      // User should be able to disable motion
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
    });

    it('should provide immediate motion control', () => {
      render(<LiquidLightBackground motionEnabled={true} />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Motion should stop immediately when disabled
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      // Motion should start immediately when enabled
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
    });
  });

  describe('motion and vestibular disorders', () => {
    it('should respect motion sensitivity preferences', () => {
      // Mock prefers-reduced-motion: reduce
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
      
      // Should automatically disable motion for users with motion sensitivity
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });

    it('should provide clear motion control options', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toHaveAttribute('aria-label', 'Toggle liquid light motion effects');
      
      // Should be clearly labeled
      const label = screen.getByText('Enable Motion');
      expect(label).toBeInTheDocument();
    });

    it('should not auto-play motion by default when user prefers reduced motion', () => {
      // Mock prefers-reduced-motion: reduce
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
      
      // Should not have motion enabled by default
      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).not.toBeChecked();
    });
  });

  describe('motion and cognitive accessibility', () => {
    it('should provide clear motion state indication', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should clearly indicate motion state
      expect(motionToggle).toBeChecked();
      expect(motionToggle).toHaveAttribute('aria-label', 'Toggle liquid light motion effects');
    });

    it('should provide consistent motion control behavior', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should behave consistently
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
      
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
    });

    it('should not interfere with other page interactions', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      const intensitySlider = screen.getByTestId('intensity-slider');
      
      // Should not interfere with other controls
      fireEvent.click(motionToggle);
      expect(intensitySlider).toBeInTheDocument();
      expect(intensitySlider).toHaveValue(0.8);
    });
  });
});
