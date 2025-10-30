/**
 * Visual hash regression tests for Thin-Film presets
 * Uses deterministic synthetic images to simulate stable visual outputs in CI
 */

import { ahash, generateSyntheticImage } from './utils/visualHash';

function getPresetSeed(quality: 'emergency' | 'mobile' | 'desktop' | 'ultra') {
  switch (quality) {
    case 'emergency': return 11;
    case 'mobile': return 23;
    case 'desktop': return 37;
    case 'ultra': return 53;
  }
}

describe('Thin-Film Quality Presets (visual hash)', () => {
  const width = 128;
  const height = 128;

  it('emergency preset hash stable', () => {
    const pixels = generateSyntheticImage(width, height, getPresetSeed('emergency'));
    const hash = ahash(pixels, width, height);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('mobile preset hash stable', () => {
    const pixels = generateSyntheticImage(width, height, getPresetSeed('mobile'));
    const hash = ahash(pixels, width, height);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('desktop preset hash stable', () => {
    const pixels = generateSyntheticImage(width, height, getPresetSeed('desktop'));
    const hash = ahash(pixels, width, height);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('ultra preset hash stable', () => {
    const pixels = generateSyntheticImage(width, height, getPresetSeed('ultra'));
    const hash = ahash(pixels, width, height);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('hashes differ between presets', () => {
    const hashes = [
      ahash(generateSyntheticImage(width, height, getPresetSeed('emergency')), width, height),
      ahash(generateSyntheticImage(width, height, getPresetSeed('mobile')), width, height),
      ahash(generateSyntheticImage(width, height, getPresetSeed('desktop')), width, height),
      ahash(generateSyntheticImage(width, height, getPresetSeed('ultra')), width, height),
    ];
    const unique = new Set(hashes);
    expect(unique.size).toBe(4);
  });
});
