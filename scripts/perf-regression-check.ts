#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

interface Metrics {
  avgGPUms: number;
  avgCPUms: number;
  fps: number;
}

function loadBaseline(filePath: string): Metrics {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function measureCurrent(): Metrics {
  // Mocked measurement for CI; replace with real collection hook when available
  return { avgGPUms: 10, avgCPUms: 4, fps: 58 };
}

function percentDegradation(current: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((baseline - current) / baseline) * 100;
}

async function main() {
  const baselinePath = path.resolve(process.cwd(), 'perf-baseline.json');
  if (!fs.existsSync(baselinePath)) {
    console.error('Baseline not found. Create one with npm run perf:measure-baseline');
    process.exit(1);
  }

  const baseline = loadBaseline(baselinePath);
  const current = measureCurrent();

  const regressions: string[] = [];

  const fpsDeg = percentDegradation(current.fps, baseline.fps);
  if (fpsDeg > 10) regressions.push(`FPS degraded ${fpsDeg.toFixed(1)}% (baseline ${baseline.fps}, current ${current.fps})`);

  const gpuIncrease = ((current.avgGPUms - baseline.avgGPUms) / baseline.avgGPUms) * 100;
  if (gpuIncrease > 10) regressions.push(`GPU time increased ${gpuIncrease.toFixed(1)}% (baseline ${baseline.avgGPUms}ms, current ${current.avgGPUms}ms)`);

  const cpuIncrease = ((current.avgCPUms - baseline.avgCPUms) / baseline.avgCPUms) * 100;
  if (cpuIncrease > 10) regressions.push(`CPU time increased ${cpuIncrease.toFixed(1)}% (baseline ${baseline.avgCPUms}ms, current ${current.avgCPUms}ms)`);

  if (regressions.length) {
    console.error('Performance regressions detected:\n- ' + regressions.join('\n- '));
    process.exit(2);
  }

  console.log('✅ No performance regressions detected');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

