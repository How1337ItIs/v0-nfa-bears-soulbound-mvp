#!/usr/bin/env ts-node

import fs from 'fs';

const baseline = {
  avgGPUms: 10,
  avgCPUms: 4,
  fps: 58
};

fs.writeFileSync('perf-baseline.json', JSON.stringify(baseline, null, 2));
console.log('✅ Wrote perf-baseline.json');

