/**
 * Math Utilities Module Exports
 */

// Easing functions
export { Easing, ease, createCustomEasing } from './easing';

// Noise generation
export {
  noise1D,
  noise2D,
  noise3D,
  createFractalNoise,
  createFractalNoise2D,
  createFractalNoise3D,
  createTurbulence,
  createRidgedNoise,
  createWarpedNoise2D,
  cellularNoise,
  createSeededNoise2D,
} from './noise';

// Spline interpolation
export {
  createCatmullRomSpline,
  createLinearSpline,
  createHermiteSpline,
  sampleSpline,
  catmullRomPath2D,
} from './splines';
export type { Point2D, Point3D } from './splines';
