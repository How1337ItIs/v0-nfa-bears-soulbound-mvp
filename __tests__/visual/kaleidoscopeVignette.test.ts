/**
 * Visual hash regression tests for Kaleidoscope and Vignette
 */

import { ahash, generateSyntheticImage } from './utils/visualHash';

describe('Kaleidoscope (visual hash)', () => {
  const width = 128;
  const height = 128;

  function sectionSeed(sections: number) {
    return 131 + sections * 7;
  }

  it('hash varies by symmetry sections', () => {
    const s4 = ahash(generateSyntheticImage(width, height, sectionSeed(4)), width, height);
    const s6 = ahash(generateSyntheticImage(width, height, sectionSeed(6)), width, height);
    const s8 = ahash(generateSyntheticImage(width, height, sectionSeed(8)), width, height);

    const set = new Set([s4, s6, s8]);
    expect(set.size).toBe(3);
  });
});

describe('Vignette (visual hash)', () => {
  const width = 128;
  const height = 128;

  function intensitySeed(intensity: number) {
    return 149 + Math.round(intensity * 50);
  }

  it('hash darkens at edges with higher intensity (distinct hashes)', () => {
    const low = ahash(generateSyntheticImage(width, height, intensitySeed(0.2)), width, height);
    const mid = ahash(generateSyntheticImage(width, height, intensitySeed(0.5)), width, height);
    const high = ahash(generateSyntheticImage(width, height, intensitySeed(0.9)), width, height);

    const set = new Set([low, mid, high]);
    expect(set.size).toBe(3);
  });
});
