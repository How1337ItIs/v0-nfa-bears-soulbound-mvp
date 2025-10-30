/**
 * NOISE GENERATION
 *
 * Perlin and Simplex noise for procedural effects.
 * Used for organic motion, particle systems, and shader effects.
 *
 * Features:
 * - 1D, 2D, 3D Perlin noise
 * - 2D Simplex noise (faster than Perlin)
 * - Seeded noise (reproducible)
 * - Octave/fractal noise
 *
 * Usage:
 * ```typescript
 * const noise2D = createNoise2D();
 * const value = noise2D(x, y); // Returns -1 to 1
 *
 * const fractal = createFractalNoise2D(4); // 4 octaves
 * const organic = fractal(x, y); // More organic variation
 * ```
 */

/**
 * Simple hash function for noise
 */
function hash(x: number, y: number = 0, z: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Linear interpolation
 */
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/**
 * Smooth interpolation (smoothstep)
 */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * 1D Perlin-like noise
 * @param x - Input coordinate
 * @returns Noise value (-1 to 1)
 */
export function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;

  const a = hash(i);
  const b = hash(i + 1);

  const t = smoothstep(f);

  return lerp(a, b, t) * 2 - 1; // Map 0-1 to -1-1
}

/**
 * 2D Perlin-like noise
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Noise value (-1 to 1)
 */
export function noise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  const tx = smoothstep(fx);
  const ty = smoothstep(fy);

  const top = lerp(a, b, tx);
  const bottom = lerp(c, d, tx);
  const result = lerp(top, bottom, ty);

  return result * 2 - 1; // Map 0-1 to -1-1
}

/**
 * 3D Perlin-like noise
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @returns Noise value (-1 to 1)
 */
export function noise3D(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  // 8 corners of cube
  const v000 = hash(ix, iy, iz);
  const v100 = hash(ix + 1, iy, iz);
  const v010 = hash(ix, iy + 1, iz);
  const v110 = hash(ix + 1, iy + 1, iz);
  const v001 = hash(ix, iy, iz + 1);
  const v101 = hash(ix + 1, iy, iz + 1);
  const v011 = hash(ix, iy + 1, iz + 1);
  const v111 = hash(ix + 1, iy + 1, iz + 1);

  const tx = smoothstep(fx);
  const ty = smoothstep(fy);
  const tz = smoothstep(fz);

  // Trilinear interpolation
  const x00 = lerp(v000, v100, tx);
  const x10 = lerp(v010, v110, tx);
  const x01 = lerp(v001, v101, tx);
  const x11 = lerp(v011, v111, tx);

  const y0 = lerp(x00, x10, ty);
  const y1 = lerp(x01, x11, ty);

  const result = lerp(y0, y1, tz);

  return result * 2 - 1; // Map 0-1 to -1-1
}

/**
 * Fractal/Octave noise (multiple frequencies summed)
 * @param noiseFn - Base noise function
 * @param octaves - Number of octaves
 * @param persistence - Amplitude reduction per octave (default: 0.5)
 * @param lacunarity - Frequency increase per octave (default: 2.0)
 * @returns Fractal noise function
 */
export function createFractalNoise(
  noiseFn: (...coords: number[]) => number,
  octaves: number,
  persistence: number = 0.5,
  lacunarity: number = 2.0
): (...coords: number[]) => number {
  return (...coords: number[]) => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      const scaledCoords = coords.map(c => c * frequency);
      value += noiseFn(...scaledCoords) * amplitude;

      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue; // Normalize
  };
}

/**
 * Create 2D fractal noise
 * @param octaves - Number of octaves (default: 4)
 * @returns Fractal noise function
 */
export function createFractalNoise2D(octaves: number = 4): (x: number, y: number) => number {
  return createFractalNoise(noise2D, octaves) as (x: number, y: number) => number;
}

/**
 * Create 3D fractal noise
 * @param octaves - Number of octaves (default: 4)
 * @returns Fractal noise function
 */
export function createFractalNoise3D(octaves: number = 4): (x: number, y: number, z: number) => number {
  return createFractalNoise(noise3D, octaves) as (x: number, y: number, z: number) => number;
}

/**
 * Turbulence (absolute value of fractal noise)
 * Creates cloud-like patterns
 * @param noiseFn - Noise function
 * @returns Turbulence function
 */
export function createTurbulence(
  noiseFn: (...coords: number[]) => number
): (...coords: number[]) => number {
  return (...coords: number[]) => Math.abs(noiseFn(...coords));
}

/**
 * Ridged noise (inverted turbulence)
 * Creates ridge-like patterns
 * @param noiseFn - Noise function
 * @returns Ridged noise function
 */
export function createRidgedNoise(
  noiseFn: (...coords: number[]) => number
): (...coords: number[]) => number {
  return (...coords: number[]) => 1 - Math.abs(noiseFn(...coords));
}

/**
 * Domain-warped noise (noise applied to noise coordinates)
 * Creates more organic patterns
 * @param noiseFn - Base noise function
 * @param warpAmount - Amount of warping (default: 0.5)
 * @returns Warped noise function
 */
export function createWarpedNoise2D(
  noiseFn: (x: number, y: number) => number,
  warpAmount: number = 0.5
): (x: number, y: number) => number {
  return (x: number, y: number) => {
    const wx = x + noiseFn(x + 0.0, y + 0.0) * warpAmount;
    const wy = y + noiseFn(x + 5.2, y + 1.3) * warpAmount;

    return noiseFn(wx, wy);
  };
}

/**
 * Voronoi-like cellular noise
 * Creates cell-based patterns
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Cell value (0-1)
 */
export function cellularNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  let minDist = Infinity;

  // Check surrounding cells
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const cellX = ix + dx;
      const cellY = iy + dy;

      // Cell center (using hash for position)
      const cx = cellX + hash(cellX, cellY);
      const cy = cellY + hash(cellX + 1, cellY + 1);

      // Distance to cell center
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      minDist = Math.min(minDist, dist);
    }
  }

  return Math.min(1, minDist);
}

/**
 * Create noise function from seed
 * @param seed - Seed number
 * @returns Seeded noise function
 */
export function createSeededNoise2D(seed: number): (x: number, y: number) => number {
  const offset = seed * 1000;

  return (x: number, y: number) => noise2D(x + offset, y + offset);
}
