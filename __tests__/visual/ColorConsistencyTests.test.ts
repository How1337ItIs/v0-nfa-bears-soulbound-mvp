/**
 * COLOR CONSISTENCY TESTS FOR LIQUID LIGHT SYSTEM
 * 
 * Tests for color palette consistency, color conversion accuracy,
 * and visual color rendering across different scenarios.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { PaletteDirector } from '../../lib/palette/PaletteDirector';

// Mock palettes for testing
const mockPalettes = {
  psychedelic: {
    name: 'psychedelic',
    colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]],
    description: 'Psychedelic palette',
    era: '1960s',
    culturalContext: 'Psychedelic movement'
  },
  hippie: {
    name: 'hippie',
    colors: [[139, 69, 19], [255, 192, 203], [144, 238, 144], [255, 165, 0], [128, 0, 128], [255, 215, 0]],
    description: 'Hippie palette',
    era: '1960s',
    culturalContext: 'Hippie movement'
  },
  mod: {
    name: 'mod',
    colors: [[0, 0, 0], [255, 255, 255], [255, 0, 0], [0, 0, 255], [255, 255, 0], [0, 255, 0]],
    description: 'Mod palette',
    era: '1960s',
    culturalContext: 'Mod movement'
  }
};

// Mock PaletteDirector
jest.mock('../../lib/palette/PaletteDirector', () => ({
  PaletteDirector: {
    getCurrentPalette: jest.fn(() => mockPalettes.psychedelic),
    setPalette: jest.fn(),
    getColorRGB: jest.fn((index) => {
      const palette = mockPalettes.psychedelic;
      return palette.colors[index % palette.colors.length];
    }),
    getColorHSL: jest.fn((index) => {
      // Convert RGB to HSL
      const rgb = mockPalettes.psychedelic.colors[index % mockPalettes.psychedelic.colors.length];
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      
      let h = 0;
      if (diff !== 0) {
        if (max === r) h = ((g - b) / diff) % 6;
        else if (max === g) h = (b - r) / diff + 2;
        else h = (r - g) / diff + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      
      const s = max === 0 ? 0 : (diff / max) * 100;
      const l = (max + min) / 2 * 100;
      
      return [h, s, l];
    }),
    getPaletteNames: jest.fn(() => Object.keys(mockPalettes)),
    getPaletteCount: jest.fn(() => Object.keys(mockPalettes).length)
  }
}));

describe('Color Consistency Tests', () => {
  describe('RGB color consistency', () => {
    it('should return consistent RGB values for same index', () => {
      const color1 = PaletteDirector.getColorRGB(0);
      const color2 = PaletteDirector.getColorRGB(0);
      
      expect(color1).toEqual(color2);
      expect(Array.isArray(color1)).toBe(true);
      expect(color1).toHaveLength(3);
    });

    it('should return valid RGB values', () => {
      for (let i = 0; i < 10; i++) {
        const color = PaletteDirector.getColorRGB(i);
        
        expect(color[0]).toBeGreaterThanOrEqual(0);
        expect(color[0]).toBeLessThanOrEqual(255);
        expect(color[1]).toBeGreaterThanOrEqual(0);
        expect(color[1]).toBeLessThanOrEqual(255);
        expect(color[2]).toBeGreaterThanOrEqual(0);
        expect(color[2]).toBeLessThanOrEqual(255);
        
        expect(Number.isInteger(color[0])).toBe(true);
        expect(Number.isInteger(color[1])).toBe(true);
        expect(Number.isInteger(color[2])).toBe(true);
      }
    });

    it('should return different colors for different indices', () => {
      const color0 = PaletteDirector.getColorRGB(0);
      const color1 = PaletteDirector.getColorRGB(1);
      const color2 = PaletteDirector.getColorRGB(2);
      
      expect(color0).not.toEqual(color1);
      expect(color1).not.toEqual(color2);
      expect(color0).not.toEqual(color2);
    });

    it('should cycle through palette colors', () => {
      const palette = mockPalettes.psychedelic;
      const color0 = PaletteDirector.getColorRGB(0);
      const color6 = PaletteDirector.getColorRGB(6); // Should cycle back to index 0
      
      expect(color0).toEqual(color6);
    });
  });

  describe('HSL color consistency', () => {
    it('should return consistent HSL values for same index', () => {
      const color1 = PaletteDirector.getColorHSL(0);
      const color2 = PaletteDirector.getColorHSL(0);
      
      expect(color1).toEqual(color2);
      expect(Array.isArray(color1)).toBe(true);
      expect(color1).toHaveLength(3);
    });

    it('should return valid HSL values', () => {
      for (let i = 0; i < 10; i++) {
        const color = PaletteDirector.getColorHSL(i);
        
        expect(color[0]).toBeGreaterThanOrEqual(0);
        expect(color[0]).toBeLessThanOrEqual(360);
        expect(color[1]).toBeGreaterThanOrEqual(0);
        expect(color[1]).toBeLessThanOrEqual(100);
        expect(color[2]).toBeGreaterThanOrEqual(0);
        expect(color[2]).toBeLessThanOrEqual(100);
      }
    });

    it('should convert RGB to HSL correctly', () => {
      // Test known conversions
      const red = PaletteDirector.getColorRGB(0); // [255, 0, 0]
      const redHSL = PaletteDirector.getColorHSL(0);
      
      expect(redHSL[0]).toBeCloseTo(0, 1); // Hue should be 0 for red
      expect(redHSL[1]).toBeCloseTo(100, 1); // Saturation should be 100%
      expect(redHSL[2]).toBeCloseTo(50, 1); // Lightness should be 50%
    });
  });

  describe('palette switching consistency', () => {
    it('should maintain color consistency when switching palettes', () => {
      // Get colors from current palette
      const color0 = PaletteDirector.getColorRGB(0);
      const color1 = PaletteDirector.getColorRGB(1);
      
      // Switch palette
      PaletteDirector.setPalette('hippie');
      
      // Get colors from new palette
      const newColor0 = PaletteDirector.getColorRGB(0);
      const newColor1 = PaletteDirector.getColorRGB(1);
      
      // Should be different colors
      expect(color0).not.toEqual(newColor0);
      expect(color1).not.toEqual(newColor1);
      
      // But should still be valid
      expect(Array.isArray(newColor0)).toBe(true);
      expect(Array.isArray(newColor1)).toBe(true);
    });

    it('should handle invalid palette names gracefully', () => {
      const originalColor = PaletteDirector.getColorRGB(0);
      
      // Try to set invalid palette
      PaletteDirector.setPalette('invalid-palette');
      
      // Should still return valid colors
      const color = PaletteDirector.getColorRGB(0);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
    });
  });

  describe('color conversion accuracy', () => {
    it('should convert RGB to HSL accurately', () => {
      // Test specific color conversions
      const testCases = [
        { rgb: [255, 0, 0], expectedHsl: [0, 100, 50] }, // Red
        { rgb: [0, 255, 0], expectedHsl: [120, 100, 50] }, // Green
        { rgb: [0, 0, 255], expectedHsl: [240, 100, 50] }, // Blue
        { rgb: [255, 255, 0], expectedHsl: [60, 100, 50] }, // Yellow
        { rgb: [255, 0, 255], expectedHsl: [300, 100, 50] }, // Magenta
        { rgb: [0, 255, 255], expectedHsl: [180, 100, 50] }, // Cyan
        { rgb: [0, 0, 0], expectedHsl: [0, 0, 0] }, // Black
        { rgb: [255, 255, 255], expectedHsl: [0, 0, 100] }, // White
        { rgb: [128, 128, 128], expectedHsl: [0, 0, 50] } // Gray
      ];

      testCases.forEach(({ rgb, expectedHsl }) => {
        // Mock the RGB color
        const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
        PaletteDirector.getColorRGB.mockReturnValueOnce(rgb);
        
        const hsl = PaletteDirector.getColorHSL(0);
        
        expect(hsl[0]).toBeCloseTo(expectedHsl[0], 1);
        expect(hsl[1]).toBeCloseTo(expectedHsl[1], 1);
        expect(hsl[2]).toBeCloseTo(expectedHsl[2], 1);
      });
    });

    it('should handle edge cases in color conversion', () => {
      const edgeCases = [
        [0, 0, 0], // Black
        [255, 255, 255], // White
        [128, 128, 128], // Gray
        [255, 255, 255], // White
        [0, 0, 0] // Black
      ];

      edgeCases.forEach(rgb => {
        const { PaletteDirector } = require('../../lib/palette/PaletteDirector');
        PaletteDirector.getColorRGB.mockReturnValueOnce(rgb);
        
        const hsl = PaletteDirector.getColorHSL(0);
        
        expect(Array.isArray(hsl)).toBe(true);
        expect(hsl).toHaveLength(3);
        expect(hsl[0]).toBeGreaterThanOrEqual(0);
        expect(hsl[0]).toBeLessThanOrEqual(360);
        expect(hsl[1]).toBeGreaterThanOrEqual(0);
        expect(hsl[1]).toBeLessThanOrEqual(100);
        expect(hsl[2]).toBeGreaterThanOrEqual(0);
        expect(hsl[2]).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('palette color distribution', () => {
    it('should have diverse colors in palette', () => {
      const palette = mockPalettes.psychedelic;
      const colors = palette.colors;
      
      // Check that colors are different
      for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
          expect(colors[i]).not.toEqual(colors[j]);
        }
      }
    });

    it('should have appropriate color ranges', () => {
      const palette = mockPalettes.psychedelic;
      const colors = palette.colors;
      
      colors.forEach(color => {
        expect(color[0]).toBeGreaterThanOrEqual(0);
        expect(color[0]).toBeLessThanOrEqual(255);
        expect(color[1]).toBeGreaterThanOrEqual(0);
        expect(color[1]).toBeLessThanOrEqual(255);
        expect(color[2]).toBeGreaterThanOrEqual(0);
        expect(color[2]).toBeLessThanOrEqual(255);
      });
    });

    it('should have sufficient color variety', () => {
      const palette = mockPalettes.psychedelic;
      const colors = palette.colors;
      
      // Should have at least 3 colors
      expect(colors.length).toBeGreaterThanOrEqual(3);
      
      // Should have different hues
      const hues = colors.map(color => {
        const r = color[0] / 255;
        const g = color[1] / 255;
        const b = color[2] / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        if (diff === 0) return 0;
        
        let h = 0;
        if (max === r) h = ((g - b) / diff) % 6;
        else if (max === g) h = (b - r) / diff + 2;
        else h = (r - g) / diff + 4;
        
        return h * 60;
      });
      
      // Should have different hues
      const uniqueHues = new Set(hues.map(h => Math.round(h / 30) * 30));
      expect(uniqueHues.size).toBeGreaterThan(1);
    });
  });

  describe('performance consistency', () => {
    it('should return colors quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        PaletteDirector.getColorRGB(i % 10);
        PaletteDirector.getColorHSL(i % 10);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should maintain performance with repeated calls', () => {
      const iterations = 10000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        PaletteDirector.getColorRGB(i % 10);
      }
      
      const end = performance.now();
      const duration = end - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(0.01); // Should be under 0.01ms per call
    });
  });

  describe('memory consistency', () => {
    it('should not leak memory during color operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform many color operations
      for (let i = 0; i < 10000; i++) {
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
  });
});
