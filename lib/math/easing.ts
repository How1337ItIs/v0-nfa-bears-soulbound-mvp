/**
 * ADVANCED EASING FUNCTIONS
 *
 * Comprehensive collection of easing functions for smooth animations.
 * Based on Robert Penner's easing equations and modern web animation standards.
 *
 * Categories:
 * - Linear: No easing
 * - Quad, Cubic, Quart, Quint: Polynomial easings
 * - Sine: Trigonometric easing
 * - Expo: Exponential easing
 * - Circ: Circular easing
 * - Back: Overshooting easing
 * - Elastic: Spring-like easing
 * - Bounce: Bouncing easing
 *
 * Each has In, Out, InOut variants
 *
 * Usage:
 * ```typescript
 * const t = 0.5; // Progress 0-1
 * const eased = Easing.easeInOutCubic(t);
 * ```
 */

export const Easing = {
  // ========== LINEAR ==========
  linear: (t: number) => t,

  // ========== QUAD (t^2) ==========
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

  // ========== CUBIC (t^3) ==========
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // ========== QUART (t^4) ==========
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number) => t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2,

  // ========== QUINT (t^5) ==========
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  easeInOutQuint: (t: number) => t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2,

  // ========== SINE ==========
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

  // ========== EXPO ==========
  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2,

  // ========== CIRC ==========
  easeInCirc: (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  easeOutCirc: (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2)),
  easeInOutCirc: (t: number) => t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  // ========== BACK (overshoot) ==========
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // ========== ELASTIC (spring) ==========
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (t: number) => {
    const c5 = (2 * Math.PI) / 4.5;

    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },

  // ========== BOUNCE ==========
  easeInBounce: (t: number) => 1 - Easing.easeOutBounce(1 - t),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t: number) => t < 0.5
    ? (1 - Easing.easeOutBounce(1 - 2 * t)) / 2
    : (1 + Easing.easeOutBounce(2 * t - 1)) / 2,

  // ========== SMOOTHSTEP ==========
  smoothstep: (t: number) => t * t * (3 - 2 * t),
  smootherstep: (t: number) => t * t * t * (t * (6 * t - 15) + 10),

  // ========== CUSTOM ==========

  /**
   * Parametric easing (adjustable power)
   * @param power - Easing power (1 = linear, 2 = quad, 3 = cubic, etc.)
   */
  parametric: (power: number) => (t: number) => Math.pow(t, power),

  /**
   * Step easing (discrete steps)
   * @param steps - Number of steps
   */
  steps: (steps: number) => (t: number) => Math.floor(t * steps) / steps,

  /**
   * Bezier easing (cubic bezier curve)
   * @param x1, y1, x2, y2 - Control points
   */
  cubicBezier: (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
    // Simplified cubic bezier (numerical approximation)
    // For production, use proper bezier solver
    const u = 1 - t;
    return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
  },
};

/**
 * Ease value with specified easing function
 * @param t - Progress (0-1)
 * @param easingName - Name of easing function
 * @returns Eased value
 */
export function ease(t: number, easingName: keyof typeof Easing): number {
  const easingFn = Easing[easingName];
  if (typeof easingFn === 'function') {
    return (easingFn as (t: number) => number)(t);
  }
  return t; // Fallback to linear
}

/**
 * Create custom easing from array of points
 * @param points - Array of [x, y] control points
 * @returns Easing function
 */
export function createCustomEasing(points: [number, number][]): (t: number) => number {
  return (t: number) => {
    // Find surrounding points
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];

      if (t >= x1 && t <= x2) {
        const localT = (t - x1) / (x2 - x1);
        return y1 + (y2 - y1) * localT;
      }
    }

    return t; // Fallback
  };
}
