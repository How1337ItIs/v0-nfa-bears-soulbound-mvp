import { describe, it, expect } from 'vitest';
import { createVisualPolicyManager, getVisualPolicyManager, destroyVisualPolicyManager } from '@/lib/visual/VisualPolicy';

describe('VisualPolicy', () => {
  it('initializes with thin-film and audio smoothing defaults', () => {
    destroyVisualPolicyManager();
    const mgr = createVisualPolicyManager();
    const p = mgr.getPolicy();
    expect(typeof p.thinFilmEnabled).toBe('boolean');
    expect(typeof p.intensity).toBe('number');
    expect(typeof p.audioSmoothingAlpha).toBe('number');
    expect(typeof p.beatBurstMultiplier).toBe('number');
    expect(['low', 'medium', 'high']).toContain(p.thinFilmQuality!);
  });

  it('persists updates to localStorage', () => {
    const store: Record<string, string> = {};
    // @ts-ignore
    global.localStorage = {
      getItem: (k: string) => store[k],
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
      key: (i: number) => Object.keys(store)[i] ?? null,
      length: 0,
    };

    destroyVisualPolicyManager();
    const mgr = createVisualPolicyManager();
    mgr.updatePolicy({ thinFilmEnabled: false, audioSmoothingAlpha: 0.5, beatBurstMultiplier: 2.0, thinFilmIntensity: 0.4 });
    const p2 = mgr.getPolicy();
    expect(p2.thinFilmEnabled).toBe(false);
    expect(p2.audioSmoothingAlpha).toBe(0.5);
    expect(p2.beatBurstMultiplier).toBe(2.0);
    expect(p2.thinFilmIntensity).toBe(0.4);
  });

  it('loads saved preferences on re-initialization', () => {
    const store: Record<string, string> = {};
    // @ts-ignore
    global.localStorage = {
      getItem: (k: string) => store[k],
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
      key: (i: number) => Object.keys(store)[i] ?? null,
      length: 0,
    };

    destroyVisualPolicyManager();
    const mgr1 = createVisualPolicyManager();
    mgr1.updatePolicy({
      audioSmoothingAlpha: 0.55,
      thinFilmIntensity: 0.42,
      beatBurstMultiplier: 2.1,
      thinFilmQuality: 'high',
      thinFilmBlendMode: 'overlay',
    });

    // Simulate app restart
    destroyVisualPolicyManager();
    const mgr2 = createVisualPolicyManager();
    const p = mgr2.getPolicy();
    expect(p.audioSmoothingAlpha).toBeCloseTo(0.55, 3);
    expect(p.thinFilmIntensity).toBeCloseTo(0.42, 3);
    expect(p.beatBurstMultiplier).toBeCloseTo(2.1, 3);
    expect(p.thinFilmQuality).toBe('high');
    expect(p.thinFilmBlendMode).toBe('overlay');
  });
});
