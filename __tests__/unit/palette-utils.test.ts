import { describe, it, expect } from 'vitest';
import { PaletteDirector } from '@/lib/palette';

describe('PaletteDirector utilities', () => {
  it('returns a flattened Float32Array of length 12 for shader uniforms', () => {
    const arr = PaletteDirector.getPaletteUniformRGB4('classic-60s');
    expect(arr).toBeInstanceOf(Float32Array);
    expect(arr.length).toBe(12);
  });

  it('generates a CSS linear-gradient string', () => {
    const css = PaletteDirector.getCSSGradientStops('classic-60s', 30);
    expect(css).toContain('linear-gradient(');
    expect(css).toContain('%');
  });

  it('blends between two palettes and returns 4 RGB triplets', () => {
    const blended = PaletteDirector.blendPalettes('classic-60s', 'dark-star', 0.5);
    expect(Array.isArray(blended)).toBe(true);
    expect(blended.length).toBe(4);
    blended.forEach((rgb) => {
      expect(rgb.length).toBe(3);
      rgb.forEach((c) => expect(typeof c).toBe('number'));
    });
  });

  it('random palette excludes provided IDs', () => {
    const exclude = ['classic-60s'];
    const p = PaletteDirector.getRandomPalette(exclude);
    expect(exclude).not.toContain(p.id);
  });

  it('export/import palette JSON works', () => {
    const json = PaletteDirector.exportPaletteAsJSON('classic-60s');
    expect(() => JSON.parse(json)).not.toThrow();

    const obj = JSON.parse(json);
    obj.id = 'custom-test';
    PaletteDirector.importPaletteFromJSON(JSON.stringify(obj));
    const loaded = PaletteDirector.getPalette('custom-test');
    expect(loaded.id).toBe('custom-test');
  });
});

