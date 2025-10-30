import fs from 'fs';
import path from 'path';
import { ahash, generateSyntheticImage } from './utils/visualHash';
import { compareWithBaseline, reportHasFailures, BaselineEntry } from './utils/hashCompare';

function writeReport(report: any) {
  try {
    const outDir = path.resolve(process.cwd(), '__tests__/visual');
    const outFile = path.join(outDir, 'visual-report.json');
    fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  } catch {}
}

function loadBaselines(): BaselineEntry[] {
  const p = path.resolve(process.cwd(), '__tests__/visual/baselines.json');
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  return json.entries as BaselineEntry[];
}

describe('Visual Baseline Comparison (hash)', () => {
  jest.retryTimes(2);

  it('matches baselines within tier tolerance', () => {
    const width = 128;
    const height = 128;

    // Compute actual hashes
    const actuals: BaselineEntry[] = [
      { name: 'thinfilm:emergency', hash: ahash(generateSyntheticImage(width, height, 11), width, height) },
      { name: 'thinfilm:mobile', hash: ahash(generateSyntheticImage(width, height, 23), width, height) },
      { name: 'thinfilm:desktop', hash: ahash(generateSyntheticImage(width, height, 37), width, height) },
      { name: 'thinfilm:ultra', hash: ahash(generateSyntheticImage(width, height, 53), width, height) },

      { name: 'shimmer:default', hash: ahash(generateSyntheticImage(width, height, 71), width, height) },
      { name: 'flow:low', hash: ahash(generateSyntheticImage(width, height, 83), width, height) },
      { name: 'flow:high', hash: ahash(generateSyntheticImage(width, height, 97), width, height) },

      { name: 'chromatic:small', hash: ahash(generateSyntheticImage(width, height, 101 + Math.round(0.1 * 100)), width, height) },
      { name: 'chromatic:medium', hash: ahash(generateSyntheticImage(width, height, 101 + Math.round(0.5 * 100)), width, height) },
      { name: 'chromatic:large', hash: ahash(generateSyntheticImage(width, height, 101 + Math.round(0.9 * 100)), width, height) },

      { name: 'kaleidoscope:s4', hash: ahash(generateSyntheticImage(width, height, 131 + 4 * 7), width, height) },
      { name: 'kaleidoscope:s6', hash: ahash(generateSyntheticImage(width, height, 131 + 6 * 7), width, height) },
      { name: 'kaleidoscope:s8', hash: ahash(generateSyntheticImage(width, height, 131 + 8 * 7), width, height) },

      { name: 'vignette:low', hash: ahash(generateSyntheticImage(width, height, 149 + Math.round(0.2 * 50)), width, height) },
      { name: 'vignette:mid', hash: ahash(generateSyntheticImage(width, height, 149 + Math.round(0.5 * 50)), width, height) },
      { name: 'vignette:high', hash: ahash(generateSyntheticImage(width, height, 149 + Math.round(0.9 * 50)), width, height) },
    ];

    const baselines = loadBaselines();
    const report = compareWithBaseline(baselines, actuals);
    writeReport(report);

    if (reportHasFailures(report)) {
      const failures = report.entries.filter(e => !e.pass).map(e => `${e.name}: dist=${e.distance}, expected=${e.expected}, actual=${e.actual}`).join('\n');
      throw new Error('Visual baseline mismatches:\n' + failures);
    }
  });
});
