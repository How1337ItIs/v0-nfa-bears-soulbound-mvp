/**
 * LAYER COORDINATOR
 *
 * Manages mounting/unmounting of visual layers based on VisualPolicy.
 * Prevents multiple parallel render loops. Coordinates blend modes and
 * z-index stacking.
 *
 * Reference: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md
 */

import type { VisualPolicy } from '../capability/VisualPolicy';

export interface LayerConfig {
  name: string;
  enabled: boolean;
  zIndex: number;
  blendMode: 'normal' | 'screen' | 'multiply' | 'overlay';
  opacity: number;
}

export function getLayerConfigs(policy: VisualPolicy): LayerConfig[] {
  const { layers } = policy;
  return [
    {
      name: 'css',
      enabled: true, // always on baseline ambience
      zIndex: -50,
      blendMode: 'normal',
      opacity: 1,
    },
    {
      name: 'webglFluid',
      enabled: !!layers.webglFluid,
      zIndex: -40,
      blendMode: 'screen',
      opacity: 1,
    },
    {
      name: 'thinFilm',
      enabled: !!layers.thinFilm,
      zIndex: -30,
      blendMode: 'screen',
      opacity: 0.85,
    },
    {
      name: 'webgpuParticles',
      enabled: !!layers.webgpuParticles,
      zIndex: -20,
      blendMode: 'screen',
      opacity: 0.7,
    },
  ];
}

export function shouldMountLayer(layerName: string, policy: VisualPolicy): boolean {
  const cfgs = getLayerConfigs(policy);
  return cfgs.some((c) => c.name === layerName && c.enabled);
}

export function getZIndexStack(policy: VisualPolicy): Record<string, number> {
  const stack: Record<string, number> = {};
  for (const cfg of getLayerConfigs(policy)) {
    stack[cfg.name] = cfg.zIndex;
  }
  return stack;
}

