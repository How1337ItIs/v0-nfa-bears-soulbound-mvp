export type DeviceTier = 'low' | 'medium' | 'high' | 'ultra';

export function getTier(): DeviceTier {
  const t = (process.env.DEVICE_TIER || '').toLowerCase();
  if (t === 'low' || t === 'medium' || t === 'high' || t === 'ultra') return t as DeviceTier;
  return 'high';
}

export function hammingDistanceHex(a: string, b: string): number {
  const aNum = BigInt('0x' + a);
  const bNum = BigInt('0x' + b);
  let x = aNum ^ bNum;
  let count = 0;
  while (x) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}

export function tierToleranceBits(tier: DeviceTier): number {
  switch (tier) {
    case 'low': return 8;     // allow up to 8-bit difference
    case 'medium': return 4;  // up to 4 bits
    case 'high': return 2;    // up to 2 bits
    case 'ultra': return 0;   // exact match
  }
}

export interface BaselineEntry {
  name: string;
  hash: string; // 16-hex (64 bits)
}

export interface VisualReport {
  tier: DeviceTier;
  entries: Array<{ name: string; expected: string; actual: string; distance: number; pass: boolean }>;
}

export function compareWithBaseline(baselines: BaselineEntry[], actuals: BaselineEntry[]): VisualReport {
  const tier = getTier();
  const tol = tierToleranceBits(tier);
  const map = new Map(baselines.map(e => [e.name, e.hash]));

  const entries = actuals.map(a => {
    const expected = map.get(a.name) || '';
    const distance = expected ? hammingDistanceHex(expected, a.hash) : 64; // max if missing
    const pass = expected ? distance <= tol : false;
    return { name: a.name, expected, actual: a.hash, distance, pass };
  });

  return { tier, entries };
}

export function reportHasFailures(r: VisualReport): boolean {
  return r.entries.some(e => !e.pass);
}
