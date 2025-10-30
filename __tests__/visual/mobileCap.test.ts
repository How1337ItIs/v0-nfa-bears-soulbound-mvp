import { getMobileCanvasCap } from '@/lib/performance/MobileOptimization';

describe('Mobile canvas caps', () => {
  it('reduces DPR on low tier for large surfaces', () => {
    const cap = getMobileCanvasCap(1920, 1080, 2.5, 'low');
    expect(cap.dpr).toBeLessThan(2.5);
    expect(cap.dpr).toBeGreaterThanOrEqual(1);
  });

  it('keeps DPR closer to requested on high tier', () => {
    const cap = getMobileCanvasCap(1280, 720, 2.0, 'high');
    expect(cap.dpr).toBeGreaterThanOrEqual(1.5);
  });
});
