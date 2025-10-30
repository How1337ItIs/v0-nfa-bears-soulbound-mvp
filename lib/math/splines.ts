/**
 * SPLINE INTERPOLATION
 *
 * Smooth curve interpolation through points.
 * Used for animation paths, parameter curves, and smooth transitions.
 *
 * Types:
 * - Linear: Straight lines between points
 * - Catmull-Rom: Smooth curves through all points
 * - Cubic Hermite: Smooth curves with tangent control
 *
 * Usage:
 * ```typescript
 * const points = [[0, 0], [1, 2], [2, 1], [3, 3]];
 * const spline = createCatmullRomSpline(points);
 *
 * const value = spline(0.5); // Get value at t=0.5
 * ```
 */

export type Point2D = [number, number];
export type Point3D = [number, number, number];

/**
 * Linear interpolation between two points
 */
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/**
 * Catmull-Rom spline interpolation
 * Creates smooth curve through all points
 *
 * @param p0, p1, p2, p3 - Four control points
 * @param t - Interpolation parameter (0-1)
 * @returns Interpolated value
 */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;

  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Create Catmull-Rom spline interpolator for 1D curve
 * @param points - Array of [x, y] points
 * @returns Spline function
 */
export function createCatmullRomSpline(points: Point2D[]): (x: number) => number {
  if (points.length < 2) {
    throw new Error('Need at least 2 points for spline');
  }

  return (x: number) => {
    // Find surrounding points
    let i = 0;
    for (i = 0; i < points.length - 1; i++) {
      if (x >= points[i][0] && x <= points[i + 1][0]) {
        break;
      }
    }

    // Clamp to valid range
    if (i >= points.length - 1) {
      return points[points.length - 1][1];
    }

    // Get 4 points for Catmull-Rom
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Calculate local t
    const localT = (x - p1[0]) / (p2[0] - p1[0]);

    return catmullRom(p0[1], p1[1], p2[1], p3[1], localT);
  };
}

/**
 * Create linear spline (piecewise linear interpolation)
 * @param points - Array of [x, y] points
 * @returns Linear interpolation function
 */
export function createLinearSpline(points: Point2D[]): (x: number) => number {
  if (points.length < 2) {
    throw new Error('Need at least 2 points for spline');
  }

  return (x: number) => {
    // Find surrounding points
    for (let i = 0; i < points.length - 1; i++) {
      if (x >= points[i][0] && x <= points[i + 1][0]) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];

        const t = (x - x1) / (x2 - x1);
        return lerp(y1, y2, t);
      }
    }

    // Outside range - clamp
    if (x < points[0][0]) return points[0][1];
    return points[points.length - 1][1];
  };
}

/**
 * Cubic Hermite spline
 * @param p0, p1 - End points
 * @param m0, m1 - Tangents at end points
 * @param t - Interpolation parameter (0-1)
 * @returns Interpolated value
 */
function cubicHermite(p0: number, p1: number, m0: number, m1: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1;
}

/**
 * Create cubic Hermite spline with automatic tangent calculation
 * @param points - Array of [x, y] points
 * @param tension - Curve tension (0-1, default: 0)
 * @returns Spline function
 */
export function createHermiteSpline(points: Point2D[], tension: number = 0): (x: number) => number {
  if (points.length < 2) {
    throw new Error('Need at least 2 points for spline');
  }

  // Calculate tangents
  const tangents: number[] = [];

  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      // First point: forward difference
      tangents.push((points[i + 1][1] - points[i][1]) * (1 - tension));
    } else if (i === points.length - 1) {
      // Last point: backward difference
      tangents.push((points[i][1] - points[i - 1][1]) * (1 - tension));
    } else {
      // Middle points: central difference
      tangents.push(((points[i + 1][1] - points[i - 1][1]) / 2) * (1 - tension));
    }
  }

  return (x: number) => {
    // Find surrounding points
    for (let i = 0; i < points.length - 1; i++) {
      if (x >= points[i][0] && x <= points[i + 1][0]) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];

        const t = (x - x1) / (x2 - x1);

        return cubicHermite(y1, y2, tangents[i], tangents[i + 1], t);
      }
    }

    // Outside range - clamp
    if (x < points[0][0]) return points[0][1];
    return points[points.length - 1][1];
  };
}

/**
 * Sample spline at regular intervals
 * @param splineFn - Spline function
 * @param start - Start x value
 * @param end - End x value
 * @param samples - Number of samples
 * @returns Array of [x, y] sample points
 */
export function sampleSpline(
  splineFn: (x: number) => number,
  start: number,
  end: number,
  samples: number
): Point2D[] {
  const result: Point2D[] = [];
  const step = (end - start) / (samples - 1);

  for (let i = 0; i < samples; i++) {
    const x = start + i * step;
    const y = splineFn(x);
    result.push([x, y]);
  }

  return result;
}

/**
 * 2D Catmull-Rom spline for vector paths
 * @param points - Array of [x, y] positions
 * @param t - Interpolation parameter (0-1, across entire path)
 * @returns Interpolated [x, y] position
 */
export function catmullRomPath2D(points: Point2D[], t: number): Point2D {
  if (points.length < 2) return points[0] || [0, 0];

  // Map t to segment
  const segmentT = t * (points.length - 1);
  const segment = Math.floor(segmentT);
  const localT = segmentT - segment;

  // Clamp segment
  const i = Math.min(segment, points.length - 2);

  // Get 4 points
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(points.length - 1, i + 2)];

  return [
    catmullRom(p0[0], p1[0], p2[0], p3[0], localT),
    catmullRom(p0[1], p1[1], p2[1], p3[1], localT),
  ];
}
