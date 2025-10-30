// EffectPolicy.ts
// Decide which visual effects should be enabled by device tier and user hints

export type Tier = 'low' | 'medium' | 'high';

export interface EffectPolicy {
  thinFilm: boolean;
  shimmer: boolean;
  flowField: boolean;
  chromatic: boolean;
  kaleidoscope: boolean;
  vignette: boolean;
}

export function getEffectPolicy(tier: Tier, saveData: boolean): EffectPolicy {
  // Base defaults by tier
  const base: Record<Tier, EffectPolicy> = {
    low:      { thinFilm: true, shimmer: false, flowField: false, chromatic: true,  kaleidoscope: false, vignette: true },
    medium:   { thinFilm: true, shimmer: true,  flowField: false, chromatic: true,  kaleidoscope: false, vignette: true },
    high:     { thinFilm: true, shimmer: true,  flowField: true,  chromatic: true,  kaleidoscope: true,  vignette: true },
  };

  const policy = { ...base[tier] };

  // Save-Data hint further disables expensive passes
  if (saveData) {
    policy.shimmer = false;
    policy.flowField = false;
    policy.kaleidoscope = false;
  }

  return policy;
}
