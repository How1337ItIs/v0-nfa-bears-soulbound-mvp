// Jest-style unit tests for enforceThinFilmPerformanceGate helper

import { enforceThinFilmPerformanceGate } from '../../lib/visual/orchestrator/layerCoordinator';

describe('enforceThinFilmPerformanceGate', () => {
  it('disables thin-film when FPS < 45 and thin-film is enabled', () => {
    const updates: any[] = [];
    const updatePolicy = (u: any) => updates.push(u);

    enforceThinFilmPerformanceGate(30, { thinFilmEnabled: true }, updatePolicy);

    expect(updates).toHaveLength(1);
    expect(updates[0]).toEqual({ thinFilmEnabled: false });
  });

  it('does nothing when FPS >= 45', () => {
    const updates: any[] = [];
    const updatePolicy = (u: any) => updates.push(u);

    enforceThinFilmPerformanceGate(50, { thinFilmEnabled: true }, updatePolicy);

    expect(updates).toHaveLength(0);
  });

  it('does nothing when thin-film already disabled', () => {
    const updates: any[] = [];
    const updatePolicy = (u: any) => updates.push(u);

    enforceThinFilmPerformanceGate(30, { thinFilmEnabled: false }, updatePolicy);

    expect(updates).toHaveLength(0);
  });
});

