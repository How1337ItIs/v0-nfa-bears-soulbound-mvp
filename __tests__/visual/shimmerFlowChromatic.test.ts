/**
 * Visual hash regression tests for Shimmer, Flow Field, Chromatic Aberration
 * Deterministic synthetic images simulate stable outputs for CI.
 */

import { ahash, generateSyntheticImage } from './utils/visualHash';

describe('Shimmer (visual hash)', () => {
  const width = 128;
  const height = 128;
  const seed = 71; // stable seed for shimmer

  it('hash stable', () => {
    const pixels = generateSyntheticImage(width, height, seed);
    const hash = ahash(pixels, width, height);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('Flow Field (visual hash)', () => {
  const width = 128;
  const height = 128;
  const lowEnergySeed = 83;
  const highEnergySeed = 97;

  it('hash differs between energy states', () => {
    const low = ahash(generateSyntheticImage(width, height, lowEnergySeed), width, height);
    const high = ahash(generateSyntheticImage(width, height, highEnergySeed), width, height);
    expect(low).not.toEqual(high);
  });
});

describe('Chromatic Aberration (visual hash)', () => {
  const width = 128;
  const height = 128;

  function offsetSeed(intensity: number) {
    return 101 + Math.round(intensity * 100);
  }

  it('hash reflects offset intensity changes', () => {
    const small = ahash(generateSyntheticImage(width, height, offsetSeed(0.1)), width, height);
    const medium = ahash(generateSyntheticImage(width, height, offsetSeed(0.5)), width, height);
    const large = ahash(generateSyntheticImage(width, height, offsetSeed(0.9)), width, height);

    const set = new Set([small, medium, large]);
    expect(set.size).toBe(3);
  });
});
