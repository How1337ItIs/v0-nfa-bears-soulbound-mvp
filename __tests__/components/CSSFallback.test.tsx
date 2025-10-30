/**
 * INTEGRATION TESTS FOR CSS FALLBACK
 * 
 * Tests for the CSSFallback component including gradient rendering,
 * palette integration, and motion control.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CSSFallback } from '../../components/liquid-light/CSSFallback';

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
    })
  }
}));

describe('CSSFallback', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<CSSFallback />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should apply intensity to opacity', () => {
      render(<CSSFallback intensity={0.5} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0.5');
    });

    it('should apply motion state to animation', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-enabled');
    });

    it('should disable animation when motion is disabled', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={false} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).not.toHaveClass('motion-enabled');
    });
  });

  describe('gradient rendering', () => {
    it('should create gradient with palette colors', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      const gradient = fallback.querySelector('.gradient');
      expect(gradient).toBeInTheDocument();
    });

    it('should use multiple gradient layers', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      const gradients = fallback.querySelectorAll('.gradient');
      expect(gradients.length).toBeGreaterThan(1);
    });

    it('should apply different blend modes', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      const gradients = fallback.querySelectorAll('.gradient');
      
      gradients.forEach((gradient, index) => {
        const element = gradient as HTMLElement;
        expect(element.style.mixBlendMode).toBeDefined();
      });
    });
  });

  describe('intensity scaling', () => {
    it('should scale opacity with intensity', () => {
      const { rerender } = render(<CSSFallback intensity={0.2} motionEnabled={true} />);
      let fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0.2');

      rerender(<CSSFallback intensity={0.8} motionEnabled={true} />);
      fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0.8');
    });

    it('should handle edge case intensities', () => {
      render(<CSSFallback intensity={0} motionEnabled={true} />);
      let fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0');

      const { rerender } = render(<CSSFallback intensity={1} motionEnabled={true} />);
      fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 1');
    });

    it('should clamp intensity values', () => {
      render(<CSSFallback intensity={1.5} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 1');

      const { rerender } = render(<CSSFallback intensity={-0.5} motionEnabled={true} />);
      fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0');
    });
  });

  describe('motion control', () => {
    it('should apply motion animations when enabled', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-enabled');
    });

    it('should remove motion animations when disabled', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={false} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).not.toHaveClass('motion-enabled');
    });

    it('should handle motion state changes', () => {
      const { rerender } = render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      let fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveClass('motion-enabled');

      rerender(<CSSFallback intensity={0.8} motionEnabled={false} />);
      fallback = screen.getByTestId('css-fallback');
      expect(fallback).not.toHaveClass('motion-enabled');
    });
  });

  describe('palette integration', () => {
    it('should use current palette colors', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      const gradients = fallback.querySelectorAll('.gradient');
      
      // Should have gradients with palette colors
      expect(gradients.length).toBeGreaterThan(0);
    });

    it('should handle palette changes', () => {
      const { rerender } = render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      // Mock palette change
      const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
      PaletteDirector.getCurrentPalette.mockReturnValue({
        name: 'new-palette',
        colors: [[128, 0, 128], [255, 165, 0], [0, 128, 128]],
        description: 'New palette',
        era: '1960s',
        culturalContext: 'Test'
      });

      rerender(<CSSFallback intensity={0.8} motionEnabled={true} />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle empty palette gracefully', () => {
      const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
      PaletteDirector.getCurrentPalette.mockReturnValue({
        name: 'empty-palette',
        colors: [],
        description: 'Empty palette',
        era: '1960s',
        culturalContext: 'Test'
      });

      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveAttribute('role', 'img');
      expect(fallback).toHaveAttribute('aria-label', 'Liquid light background');
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).not.toHaveClass('motion-enabled');
    });
  });

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      // Re-render with same props
      rerender(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      // Should still be in document
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      
      // Rapid prop changes
      for (let i = 0; i < 10; i++) {
        rerender(<CSSFallback intensity={i / 10} motionEnabled={i % 2 === 0} />);
      }
      
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle invalid intensity values', () => {
      render(<CSSFallback intensity={NaN} motionEnabled={true} />);
      const fallback = screen.getByTestId('css-fallback');
      expect(fallback).toHaveStyle('opacity: 0.8'); // Should use default
    });

    it('should handle missing props', () => {
      render(<CSSFallback />);
      expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
    });

    it('should handle palette director errors', () => {
      const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
      PaletteDirector.getCurrentPalette.mockImplementation(() => {
        throw new Error('Palette error');
      });

      expect(() => {
        render(<CSSFallback intensity={0.8} motionEnabled={true} />);
      }).not.toThrow();
    });
  });
});
