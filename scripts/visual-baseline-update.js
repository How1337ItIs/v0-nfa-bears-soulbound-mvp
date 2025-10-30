// Deterministic baseline generator for visual hashes
// Usage: node scripts/visual-baseline-update.js

const fs = require('fs');
const path = require('path');

function mulberry32(a) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generateSyntheticImage(width, height, seed) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  const rand = mulberry32(seed);
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy) / maxR;
      const n = rand();
      const hue = (r * 360 + n * 30) % 360;
      const [R, G, B] = hslToRgb(hue / 360, 0.8, 0.5);
      const idx = (y * width + x) * 4;
      pixels[idx] = R;
      pixels[idx + 1] = G;
      pixels[idx + 2] = B;
      pixels[idx + 3] = 255;
    }
  }
  return pixels;
}

function ahash(pixels, width, height) {
  const targetW = 8;
  const targetH = 8;
  const blockW = Math.max(1, Math.floor(width / targetW));
  const blockH = Math.max(1, Math.floor(height / targetH));
  const gray = [];
  for (let ty = 0; ty < targetH; ty++) {
    for (let tx = 0; tx < targetW; tx++) {
      let sum = 0;
      let count = 0;
      for (let y = ty * blockH; y < Math.min(height, (ty + 1) * blockH); y++) {
        for (let x = tx * blockW; x < Math.min(width, (tx + 1) * blockW); x++) {
          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += lum;
          count++;
        }
      }
      gray.push(count ? sum / count : 0);
    }
  }
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  let bits = '';
  for (const v of gray) bits += v >= avg ? '1' : '0';
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

function main() {
  const width = 128;
  const height = 128;
  const entries = [
    { name: 'thinfilm:emergency', seed: 11 },
    { name: 'thinfilm:mobile', seed: 23 },
    { name: 'thinfilm:desktop', seed: 37 },
    { name: 'thinfilm:ultra', seed: 53 },

    { name: 'shimmer:default', seed: 71 },
    { name: 'flow:low', seed: 83 },
    { name: 'flow:high', seed: 97 },

    { name: 'chromatic:small', seed: 101 + Math.round(0.1 * 100) },
    { name: 'chromatic:medium', seed: 101 + Math.round(0.5 * 100) },
    { name: 'chromatic:large', seed: 101 + Math.round(0.9 * 100) },

    { name: 'kaleidoscope:s4', seed: 131 + 4 * 7 },
    { name: 'kaleidoscope:s6', seed: 131 + 6 * 7 },
    { name: 'kaleidoscope:s8', seed: 131 + 8 * 7 },

    { name: 'vignette:low', seed: 149 + Math.round(0.2 * 50) },
    { name: 'vignette:mid', seed: 149 + Math.round(0.5 * 50) },
    { name: 'vignette:high', seed: 149 + Math.round(0.9 * 50) },
  ];

  const computed = entries.map(e => {
    const hash = ahash(generateSyntheticImage(width, height, e.seed), width, height);
    return { name: e.name, hash };
  });

  const out = { entries: computed };
  const outPath = path.resolve(process.cwd(), '__tests__/visual/baselines.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('✅ Updated baselines at', outPath);
}

main();
