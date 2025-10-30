/**
 * THIN-FILM QUALITY PRESETS
 *
 * Different quality levels for thin-film interference rendering.
 * Balances visual quality with performance.
 *
 * Quality Levels:
 * - Emergency: 1 interference order (absolute minimum)
 * - Mobile: 2 interference orders (current default)
 * - Desktop: 3 interference orders (high quality)
 * - Ultra: 4 interference orders (maximum quality)
 */

export type ThinFilmQuality = 'emergency' | 'mobile' | 'desktop' | 'ultra';

export interface ThinFilmQualityPreset {
  interferenceOrders: number; // Number of interference orders to calculate
  dpr: [number, number]; // [min, max] device pixel ratio
  multisampling: number; // MSAA samples (0, 2, 4, 8)
  updateRate: number; // Updates per second (30, 60)
  textureSize: number; // Render texture size
}

export const THIN_FILM_QUALITY_PRESETS: Record<ThinFilmQuality, ThinFilmQualityPreset> = {
  /**
   * Emergency - Absolute minimum for critical battery/performance
   * Use when: FPS < 30, battery < 10%, or manual fallback
   */
  emergency: {
    interferenceOrders: 1,
    dpr: [1, 1],
    multisampling: 0,
    updateRate: 30,
    textureSize: 256,
  },

  /**
   * Mobile - Optimized for mobile devices
   * Use when: Mobile device detected, or tier === 'medium'
   * Current default for mobile
   */
  mobile: {
    interferenceOrders: 2,
    dpr: [1, 1.5],
    multisampling: 0,
    updateRate: 60,
    textureSize: 512,
  },

  /**
   * Desktop - High quality for capable desktops
   * Use when: Desktop tier === 'high'
   */
  desktop: {
    interferenceOrders: 3,
    dpr: [1, 2],
    multisampling: 4,
    updateRate: 60,
    textureSize: 1024,
  },

  /**
   * Ultra - Maximum quality for high-end hardware
   * Use when: Desktop tier === 'ultra' AND user opted in
   */
  ultra: {
    interferenceOrders: 4,
    dpr: [1, 2],
    multisampling: 8,
    updateRate: 60,
    textureSize: 2048,
  },
};

/**
 * Get recommended quality preset based on device tier and performance
 *
 * @param deviceTier - Device capability tier
 * @param currentFPS - Current frame rate
 * @param batteryLevel - Battery level (0-1), null if unavailable
 * @returns Recommended quality preset
 */
export function getRecommendedQuality(
  deviceTier: 'low' | 'medium' | 'high' | 'ultra',
  currentFPS: number,
  batteryLevel: number | null
): ThinFilmQuality {
  // Emergency fallback
  if (currentFPS < 30 || (batteryLevel !== null && batteryLevel < 0.1)) {
    return 'emergency';
  }

  // Low battery override
  if (batteryLevel !== null && batteryLevel < 0.3) {
    return deviceTier === 'high' || deviceTier === 'ultra' ? 'mobile' : 'emergency';
  }

  // Performance-based degradation
  if (currentFPS < 45) {
    return deviceTier === 'high' || deviceTier === 'ultra' ? 'mobile' : 'emergency';
  }

  // Normal quality mapping
  switch (deviceTier) {
    case 'low':
      return 'emergency'; // Should be disabled, but if forced...
    case 'medium':
      return 'mobile';
    case 'high':
      return currentFPS > 55 ? 'desktop' : 'mobile';
    case 'ultra':
      return currentFPS > 58 ? 'ultra' : 'desktop';
    default:
      return 'mobile';
  }
}

/**
 * Get performance estimate for quality preset
 *
 * @param quality - Quality preset
 * @returns Estimated GPU time (ms) and memory (MB)
 */
export function getQualityPerformanceEstimate(quality: ThinFilmQuality): {
  gpuTimeMs: number;
  memoryMB: number;
} {
  const estimates = {
    emergency: { gpuTimeMs: 1.5, memoryMB: 4 },
    mobile: { gpuTimeMs: 3.5, memoryMB: 8 },
    desktop: { gpuTimeMs: 5.5, memoryMB: 16 },
    ultra: { gpuTimeMs: 8.0, memoryMB: 32 },
  };

  return estimates[quality];
}

/**
 * Check if quality upgrade is safe
 *
 * @param currentQuality - Current quality level
 * @param targetQuality - Desired quality level
 * @param currentFPS - Current frame rate
 * @param availableMemoryMB - Available system memory
 * @returns Whether upgrade is safe
 */
export function canUpgradeQuality(
  currentQuality: ThinFilmQuality,
  targetQuality: ThinFilmQuality,
  currentFPS: number,
  availableMemoryMB: number
): boolean {
  const targetEstimate = getQualityPerformanceEstimate(targetQuality);

  // Need headroom for FPS
  if (currentFPS < 58) {
    return false;
  }

  // Need sufficient memory
  if (availableMemoryMB < targetEstimate.memoryMB * 1.5) {
    return false;
  }

  return true;
}
