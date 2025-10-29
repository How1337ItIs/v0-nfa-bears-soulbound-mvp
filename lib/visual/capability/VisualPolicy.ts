/**
 * VISUAL POLICY - Tier to Layer Mapping
 *
 * Defines which visual layers are active for each device tier and the
 * corresponding quality and performance guardrails. Consumed by the
 * VisualOrchestrator (Week 2) to coordinate layer mounting.
 *
 * Reference: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md
 */

export type VisualTier = 'low' | 'medium' | 'high' | 'ultra';

export interface VisualPolicy {
  profile: VisualTier;
  layers: {
    css: boolean;
    webglFluid: boolean;
    thinFilm: boolean;
    webgpuParticles: boolean;
  };
  quality: {
    simResolution: number;
    dyeResolution: number;
    pressureIterations: number;
    curl: number;
    velocityDissipation: number;
    densityDissipation: number;
  };
  limits: {
    targetFPS: number;
    minFPS: number;
    maxFPS: number;
    gpuTimeBudget: number; // ms per frame
    stepDownThreshold: number; // FPS threshold to reduce quality
    stepUpThreshold: number; // FPS threshold to increase quality
  };
}

export const VISUAL_POLICIES: Record<VisualTier, VisualPolicy> = {
  low: {
    profile: 'low',
    layers: {
      css: true,
      webglFluid: false,
      thinFilm: false,
      webgpuParticles: false,
    },
    quality: {
      simResolution: 128,
      dyeResolution: 256,
      pressureIterations: 15,
      curl: 15,
      velocityDissipation: 0.5,
      densityDissipation: 0.9,
    },
    limits: {
      targetFPS: 30,
      minFPS: 20,
      maxFPS: 60,
      gpuTimeBudget: 8,
      stepDownThreshold: 25,
      stepUpThreshold: 50,
    },
  },
  medium: {
    profile: 'medium',
    layers: {
      css: true,
      webglFluid: true,
      thinFilm: false,
      webgpuParticles: false,
    },
    quality: {
      simResolution: 192,
      dyeResolution: 384,
      pressureIterations: 20,
      curl: 20,
      velocityDissipation: 0.4,
      densityDissipation: 0.92,
    },
    limits: {
      targetFPS: 45,
      minFPS: 25,
      maxFPS: 60,
      gpuTimeBudget: 10,
      stepDownThreshold: 25,
      stepUpThreshold: 50,
    },
  },
  high: {
    profile: 'high',
    layers: {
      css: true,
      webglFluid: true,
      thinFilm: true, // gated at runtime by policy and FPS
      webgpuParticles: false,
    },
    quality: {
      simResolution: 256,
      dyeResolution: 512,
      pressureIterations: 25,
      curl: 20,
      velocityDissipation: 0.4,
      densityDissipation: 0.92,
    },
    limits: {
      targetFPS: 60,
      minFPS: 30,
      maxFPS: 60,
      gpuTimeBudget: 12,
      stepDownThreshold: 25,
      stepUpThreshold: 50,
    },
  },
  ultra: {
    profile: 'ultra',
    layers: {
      css: true,
      webglFluid: true,
      thinFilm: true,
      webgpuParticles: true, // strictly gated by capability + battery saver
    },
    quality: {
      simResolution: 256,
      dyeResolution: 512,
      pressureIterations: 25,
      curl: 20,
      velocityDissipation: 0.4,
      densityDissipation: 0.92,
    },
    limits: {
      targetFPS: 60,
      minFPS: 30,
      maxFPS: 60,
      gpuTimeBudget: 14,
      stepDownThreshold: 25,
      stepUpThreshold: 50,
    },
  },
};

export function getVisualPolicy(tier: string): VisualPolicy {
  switch (tier) {
    case 'low':
    case 'medium':
    case 'high':
    case 'ultra':
      return VISUAL_POLICIES[tier as VisualTier];
    default:
      return VISUAL_POLICIES.low;
  }
}

