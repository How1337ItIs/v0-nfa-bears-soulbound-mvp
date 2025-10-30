'use client';

/**
 * BLOOM POST-PROCESSING EFFECT
 *
 * Creates glowing highlights on bright areas.
 * Classic post-processing technique using Gaussian blur on bright regions.
 *
 * Performance: ~4-6ms GPU time (resolution-dependent)
 * Use: Medium+ tiers
 *
 * Note: Uses R3F's built-in Bloom from pmndrs/postprocessing
 */

import React from 'react';
import { Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

export interface BloomPassProps {
  audioParams?: AudioReactiveParams;
  intensity?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  quality?: 'low' | 'medium' | 'high';
  enabled?: boolean;
}

export function BloomPass({
  audioParams,
  intensity = 0.5,
  luminanceThreshold = 0.5,
  luminanceSmoothing = 0.9,
  quality = 'medium',
  enabled = true
}: BloomPassProps) {
  if (!enabled) return null;

  // Map quality to kernel size
  const kernelSize = {
    low: KernelSize.SMALL,
    medium: KernelSize.MEDIUM,
    high: KernelSize.LARGE,
  }[quality];

  // Audio-reactive intensity
  const effectiveIntensity = audioParams
    ? intensity * audioParams.globalIntensity
    : intensity;

  return (
    <Bloom
      intensity={effectiveIntensity}
      luminanceThreshold={luminanceThreshold}
      luminanceSmoothing={luminanceSmoothing}
      kernelSize={kernelSize}
      mipmapBlur
    />
  );
}

/**
 * Audio-reactive bloom presets
 */
export const BLOOM_PRESETS = {
  subtle: {
    intensity: 0.3,
    luminanceThreshold: 0.7,
    luminanceSmoothing: 0.95,
  },
  standard: {
    intensity: 0.5,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 0.9,
  },
  intense: {
    intensity: 0.8,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.85,
  },
  psychedelic: {
    intensity: 1.2,
    luminanceThreshold: 0.2,
    luminanceSmoothing: 0.8,
  },
};

/**
 * Get recommended bloom settings based on device tier
 */
export function getRecommendedBloomSettings(
  deviceTier: 'low' | 'medium' | 'high' | 'ultra'
): { quality: 'low' | 'medium' | 'high'; preset: keyof typeof BLOOM_PRESETS } {
  switch (deviceTier) {
    case 'ultra':
      return { quality: 'high', preset: 'psychedelic' };
    case 'high':
      return { quality: 'high', preset: 'intense' };
    case 'medium':
      return { quality: 'medium', preset: 'standard' };
    case 'low':
    default:
      return { quality: 'low', preset: 'subtle' };
  }
}
