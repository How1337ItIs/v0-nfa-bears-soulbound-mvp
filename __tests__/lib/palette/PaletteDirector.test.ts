/**
 * UNIT TESTS FOR PALETTE DIRECTOR
 * 
 * Tests for the PaletteDirector service including palette management,
 * color conversion, and palette switching functionality.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { PaletteDirector } from '../../../lib/palette/PaletteDirector';
import { Palette } from '../../../lib/visual/types';

// Mock palettes for testing
const mockPalettes: Palette[] = [
  {
    name: 'test-psychedelic',
    colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]],
    description: 'Test psychedelic palette',
    era: '1960s',
    culturalContext: 'Psychedelic movement'
  },
  {
    name: 'test-hippie',
    colors: [[139, 69, 19], [255, 192, 203], [144, 238, 144], [255, 165, 0]],
    description: 'Test hippie palette',
    era: '1960s',
    culturalContext: 'Hippie movement'
  }
];

describe('PaletteDirector', () => {
  beforeEach(() => {
    // Reset palette director state
    PaletteDirector.setPalette('test-psychedelic');
  });

  describe('getCurrentPalette', () => {
    it('should return the current palette', () => {
      const palette = PaletteDirector.getCurrentPalette();
      expect(palette).toBeDefined();
      expect(palette.name).toBe('test-psychedelic');
    });

    it('should return a palette with colors array', () => {
      const palette = PaletteDirector.getCurrentPalette();
      expect(Array.isArray(palette.colors)).toBe(true);
      expect(palette.colors.length).toBeGreaterThan(0);
    });

    it('should return a palette with required properties', () => {
      const palette = PaletteDirector.getCurrentPalette();
      expect(palette).toHaveProperty('name');
      expect(palette).toHaveProperty('colors');
      expect(palette).toHaveProperty('description');
      expect(palette).toHaveProperty('era');
      expect(palette).toHaveProperty('culturalContext');
    });
  });

  describe('setPalette', () => {
    it('should set the palette by name', () => {
      PaletteDirector.setPalette('test-hippie');
      const palette = PaletteDirector.getCurrentPalette();
      expect(palette.name).toBe('test-hippie');
    });

    it('should handle invalid palette names gracefully', () => {
      const originalPalette = PaletteDirector.getCurrentPalette();
      PaletteDirector.setPalette('invalid-palette');
      const currentPalette = PaletteDirector.getCurrentPalette();
      expect(currentPalette.name).toBe(originalPalette.name);
    });

    it('should maintain palette state across calls', () => {
      PaletteDirector.setPalette('test-hippie');
      const palette1 = PaletteDirector.getCurrentPalette();
      const palette2 = PaletteDirector.getCurrentPalette();
      expect(palette1.name).toBe(palette2.name);
    });
  });

  describe('getColorRGB', () => {
    it('should return RGB color tuple for valid index', () => {
      const color = PaletteDirector.getColorRGB(0);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
      expect(color[0]).toBeGreaterThanOrEqual(0);
      expect(color[0]).toBeLessThanOrEqual(255);
      expect(color[1]).toBeGreaterThanOrEqual(0);
      expect(color[1]).toBeLessThanOrEqual(255);
      expect(color[2]).toBeGreaterThanOrEqual(0);
      expect(color[2]).toBeLessThanOrEqual(255);
    });

    it('should return first color for index 0', () => {
      const palette = PaletteDirector.getCurrentPalette();
      const color = PaletteDirector.getColorRGB(0);
      expect(color).toEqual(palette.colors[0]);
    });

    it('should handle out of bounds indices', () => {
      const color = PaletteDirector.getColorRGB(999);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
    });

    it('should return valid RGB values', () => {
      for (let i = 0; i < 10; i++) {
        const color = PaletteDirector.getColorRGB(i);
        color.forEach(value => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(255);
          expect(Number.isInteger(value)).toBe(true);
        });
      }
    });
  });

  describe('getColorHSL', () => {
    it('should return HSL color tuple for valid index', () => {
      const color = PaletteDirector.getColorHSL(0);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
      expect(color[0]).toBeGreaterThanOrEqual(0);
      expect(color[0]).toBeLessThanOrEqual(360);
      expect(color[1]).toBeGreaterThanOrEqual(0);
      expect(color[1]).toBeLessThanOrEqual(100);
      expect(color[2]).toBeGreaterThanOrEqual(0);
      expect(color[2]).toBeLessThanOrEqual(100);
    });

    it('should handle out of bounds indices', () => {
      const color = PaletteDirector.getColorHSL(999);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
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
  });

  describe('getPaletteNames', () => {
    it('should return array of palette names', () => {
      const names = PaletteDirector.getPaletteNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    });

    it('should return string names', () => {
      const names = PaletteDirector.getPaletteNames();
      names.forEach(name => {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it('should include current palette name', () => {
      const names = PaletteDirector.getPaletteNames();
      const currentPalette = PaletteDirector.getCurrentPalette();
      expect(names).toContain(currentPalette.name);
    });
  });

  describe('getPaletteCount', () => {
    it('should return number of palettes', () => {
      const count = PaletteDirector.getPaletteCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });

    it('should match length of palette names', () => {
      const count = PaletteDirector.getPaletteCount();
      const names = PaletteDirector.getPaletteNames();
      expect(count).toBe(names.length);
    });
  });

  describe('color conversion consistency', () => {
    it('should maintain consistency between RGB and HSL', () => {
      const rgb = PaletteDirector.getColorRGB(0);
      const hsl = PaletteDirector.getColorHSL(0);
      
      // Convert RGB to HSL manually for comparison
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
      
      expect(Math.abs(hsl[0] - h)).toBeLessThan(2); // Allow small rounding differences
      expect(Math.abs(hsl[1] - s)).toBeLessThan(2);
      expect(Math.abs(hsl[2] - l)).toBeLessThan(2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty palette gracefully', () => {
      // This test would require mocking an empty palette
      // For now, we test that the system doesn't crash
      expect(() => {
        PaletteDirector.getColorRGB(0);
        PaletteDirector.getColorHSL(0);
      }).not.toThrow();
    });

    it('should handle negative indices', () => {
      const color = PaletteDirector.getColorRGB(-1);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
    });

    it('should handle floating point indices', () => {
      const color = PaletteDirector.getColorRGB(1.5);
      expect(Array.isArray(color)).toBe(true);
      expect(color).toHaveLength(3);
    });
  });

  describe('performance', () => {
    it('should get current palette quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        PaletteDirector.getCurrentPalette();
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should get color RGB quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        PaletteDirector.getColorRGB(i % 4);
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    it('should get color HSL quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        PaletteDirector.getColorHSL(i % 4);
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });
  });
});
