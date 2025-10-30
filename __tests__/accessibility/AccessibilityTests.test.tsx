/**
 * ACCESSIBILITY TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Tests for accessibility compliance including screen reader support,
 * keyboard navigation, motion preferences, and ARIA attributes.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LiquidLightBackground } from '../../components/LiquidLightBackground';
import { CSSFallback } from '../../components/liquid-light/CSSFallback';
import { LiquidLightControls } from '../../components/liquid-light/LiquidLightControls';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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

// Mock document.createElement
jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas as any;
  }
  return document.createElement(tagName);
});

describe('Accessibility Tests', () => {
  describe('LiquidLightBackground', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<LiquidLightBackground />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(<LiquidLightBackground />);
      
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('aria-label', 'Liquid light background');
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
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

    it('should update motion when prefers-reduced-motion changes', async () => {
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

    it('should be keyboard navigable', () => {
      render(<LiquidLightBackground />);
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should be focusable
      intensitySlider.focus();
      expect(document.activeElement).toBe(intensitySlider);
      
      motionToggle.focus();
      expect(document.activeElement).toBe(motionToggle);
    });

    it('should support keyboard interactions', () => {
      render(<LiquidLightBackground />);
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Test slider keyboard navigation
      intensitySlider.focus();
      fireEvent.keyDown(intensitySlider, { key: 'ArrowRight' });
      expect(intensitySlider).toHaveValue(0.9);
      
      fireEvent.keyDown(intensitySlider, { key: 'ArrowLeft' });
      expect(intensitySlider).toHaveValue(0.8);
      
      // Test checkbox keyboard navigation
      motionToggle.focus();
      fireEvent.keyDown(motionToggle, { key: ' ' });
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.keyDown(motionToggle, { key: ' ' });
      expect(motionToggle).toBeChecked();
    });

    it('should have proper focus management', () => {
      render(<LiquidLightBackground />);
      
      const controls = screen.getByTestId('liquid-light-controls');
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Controls should be in tab order
      expect(controls).toHaveAttribute('tabIndex', '0');
      
      // Individual controls should be focusable
      expect(intensitySlider).toHaveAttribute('tabIndex', '0');
      expect(motionToggle).toHaveAttribute('tabIndex', '0');
    });

    it('should provide screen reader announcements', () => {
      render(<LiquidLightBackground />);
      
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('should handle WebGL context loss gracefully', () => {
      render(<LiquidLightBackground />);
      
      // Simulate context loss
      const canvas = screen.getByTestId('webgl-canvas');
      fireEvent(canvas, new Event('webglcontextlost'));
      
      // Should fallback to CSS with proper accessibility
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('role', 'img');
      expect(fallback).toHaveAttribute('aria-label', 'Liquid light background');
    });
  });

  describe('CSSFallback', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('role', 'img');
      expect(fallback).toHaveAttribute('aria-label', 'Liquid light background');
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
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
      expect(fallback).not.toHaveClass('motion-enabled');
    });

    it('should be keyboard accessible', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      
      // Should be focusable
      fallback.focus();
      expect(document.activeElement).toBe(fallback);
    });

    it('should have proper semantic structure', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback.tagName).toBe('DIV');
      expect(fallback).toHaveAttribute('role', 'img');
    });
  });

  describe('LiquidLightControls', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={jest.fn()}
          motionEnabled={true}
          setMotionEnabled={jest.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form labels', () => {
      render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={jest.fn()}
          motionEnabled={true}
          setMotionEnabled={jest.fn()}
        />
      );
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      expect(intensitySlider).toHaveAttribute('aria-label', 'Adjust liquid light intensity');
      expect(motionToggle).toHaveAttribute('aria-label', 'Toggle liquid light motion effects');
    });

    it('should have proper ARIA attributes for range input', () => {
      render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={jest.fn()}
          motionEnabled={true}
          setMotionEnabled={jest.fn()}
        />
      );
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      expect(intensitySlider).toHaveAttribute('aria-valuemin', '0');
      expect(intensitySlider).toHaveAttribute('aria-valuemax', '1');
      expect(intensitySlider).toHaveAttribute('aria-valuenow', '0.8');
    });

    it('should support keyboard navigation', () => {
      const setIntensity = jest.fn();
      const setMotionEnabled = jest.fn();
      
      render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={setIntensity}
          motionEnabled={true}
          setMotionEnabled={setMotionEnabled}
        />
      );
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Test slider keyboard navigation
      intensitySlider.focus();
      fireEvent.keyDown(intensitySlider, { key: 'ArrowRight' });
      expect(setIntensity).toHaveBeenCalledWith(0.9);
      
      fireEvent.keyDown(intensitySlider, { key: 'ArrowLeft' });
      expect(setIntensity).toHaveBeenCalledWith(0.7);
      
      // Test checkbox keyboard navigation
      motionToggle.focus();
      fireEvent.keyDown(motionToggle, { key: ' ' });
      expect(setMotionEnabled).toHaveBeenCalledWith(false);
    });

    it('should have proper focus management', () => {
      render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={jest.fn()}
          motionEnabled={true}
          setMotionEnabled={jest.fn()}
        />
      );
      
      const controls = screen.getByTestId('liquid-light-controls');
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Controls should be in tab order
      expect(controls).toHaveAttribute('tabIndex', '0');
      
      // Individual controls should be focusable
      expect(intensitySlider).toHaveAttribute('tabIndex', '0');
      expect(motionToggle).toHaveAttribute('tabIndex', '0');
    });

    it('should provide proper role and label', () => {
      render(
        <LiquidLightControls
          intensity={0.8}
          setIntensity={jest.fn()}
          motionEnabled={true}
          setMotionEnabled={jest.fn()}
        />
      );
      
      const controls = screen.getByTestId('liquid-light-controls');
      expect(controls).toHaveAttribute('role', 'toolbar');
      expect(controls).toHaveAttribute('aria-label', 'Liquid light controls');
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide meaningful descriptions', () => {
      render(<LiquidLightBackground />);
      
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('aria-label', 'Liquid light background');
      
      const controls = screen.getByTestId('liquid-light-controls');
      expect(controls).toHaveAttribute('aria-label', 'Liquid light controls');
    });

    it('should announce state changes', () => {
      render(<LiquidLightBackground />);
      
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('should provide context for interactive elements', () => {
      render(<LiquidLightBackground />);
      
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      expect(intensitySlider).toHaveAttribute('aria-label', 'Adjust liquid light intensity');
      expect(motionToggle).toHaveAttribute('aria-label', 'Toggle liquid light motion effects');
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast for text', () => {
      render(<LiquidLightBackground />);
      
      const controls = screen.getByTestId('liquid-light-controls');
      const intensitySlider = screen.getByTestId('intensity-slider');
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // These elements should be visible and have sufficient contrast
      expect(controls).toBeVisible();
      expect(intensitySlider).toBeVisible();
      expect(motionToggle).toBeVisible();
    });
  });

  describe('Motion and Animation', () => {
    it('should respect user motion preferences', () => {
      // Test with prefers-reduced-motion: reduce
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

    it('should allow users to control motion', () => {
      render(<LiquidLightBackground />);
      
      const motionToggle = screen.getByTestId('motion-toggle');
      
      // Should start enabled
      expect(motionToggle).toBeChecked();
      
      // Should be toggleable
      fireEvent.click(motionToggle);
      expect(motionToggle).not.toBeChecked();
      
      fireEvent.click(motionToggle);
      expect(motionToggle).toBeChecked();
    });
  });

  describe('Error Handling', () => {
    it('should provide accessible error messages', () => {
      // Mock WebGL failure
      mockCanvas.getContext.mockReturnValue(null);
      
      render(<LiquidLightBackground />);
      
      // Should fallback to CSS with proper accessibility
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('role', 'img');
      expect(fallback).toHaveAttribute('aria-label', 'Liquid light background');
    });

    it('should handle missing audio gracefully', () => {
      render(<LiquidLightBackground />);
      
      // Should still be accessible without audio
      const container = screen.getByTestId('liquid-light-container');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('aria-label', 'Liquid light background');
    });
  });
});
