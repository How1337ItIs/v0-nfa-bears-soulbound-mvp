#!/usr/bin/env node

/**
 * Psychedelic Asset Generator for NFA Bears
 * Creates custom oil blob patterns, kaleidoscope frames, and psychedelic elements
 */

const fs = require('fs');
const path = require('path');

// Psychedelic color palettes inspired by 60s liquid light shows
const PSYCHEDELIC_PALETTES = {
  oilSlick: [
    '#ff0080', '#8000ff', '#0080ff', '#00ff80', '#ffff00', '#ff8000'
  ],
  lavaLamp: [
    '#ff3366', '#ff6600', '#ffcc00', '#66ff00', '#0066ff', '#cc00ff'
  ],
  tieDye: [
    '#ff1493', '#8a2be2', '#00bfff', '#00ff7f', '#ffd700', '#ff4500'
  ]
};

// Generate SVG oil blob patterns
function generateOilBlobSVG(palette, size = 200, complexity = 3) {
  const colors = palette;
  const points = [];
  
  // Generate organic blob points
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = size * (0.3 + Math.random() * 0.4);
    const x = Math.cos(angle) * radius + size / 2;
    const y = Math.sin(angle) * radius + size / 2;
    points.push(`${x},${y}`);
  }
  
  const pathData = `M ${points[0]} Q ${points[1]} ${points[2]} Q ${points[3]} ${points[4]} Q ${points[5]} ${points[6]} Q ${points[7]} ${points[0]} Z`;
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="oilGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0.4" />
    </radialGradient>
    <filter id="oilSlick">
      <feGaussianBlur stdDeviation="2"/>
      <feColorMatrix values="1.2 0 0 0 0  0 1.2 0 0 0  0 0 1.2 0 0  0 0 0 1 0"/>
    </filter>
  </defs>
  <path d="${pathData}" fill="url(#oilGradient)" filter="url(#oilSlick)" opacity="0.7"/>
</svg>`;
}

// Generate kaleidoscope frame SVG
function generateKaleidoscopeFrame(size = 300) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="kaleidoscopeGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ff0080;stop-opacity:0.8" />
      <stop offset="16.66%" style="stop-color:#8000ff;stop-opacity:0.7" />
      <stop offset="33.33%" style="stop-color:#0080ff;stop-opacity:0.6" />
      <stop offset="50%" style="stop-color:#00ff80;stop-opacity:0.5" />
      <stop offset="66.66%" style="stop-color:#ffff00;stop-opacity:0.6" />
      <stop offset="83.33%" style="stop-color:#ff8000;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#ff0080;stop-opacity:0.8" />
    </radialGradient>
    <filter id="kaleidoscopeBlur">
      <feGaussianBlur stdDeviation="1"/>
    </filter>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="none" stroke="url(#kaleidoscopeGradient)" stroke-width="8" filter="url(#kaleidoscopeBlur)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 20}" fill="none" stroke="url(#kaleidoscopeGradient)" stroke-width="4" filter="url(#kaleidoscopeBlur)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 30}" fill="none" stroke="url(#kaleidoscopeGradient)" stroke-width="2" filter="url(#kaleidoscopeBlur)"/>
</svg>`;
}

// Generate psychedelic background pattern
function generatePsychedelicBackground(width = 800, height = 600) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg1" cx="20%" cy="20%" r="30%">
      <stop offset="0%" style="stop-color:#ff0080;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:transparent" />
    </radialGradient>
    <radialGradient id="bg2" cx="80%" cy="80%" r="25%">
      <stop offset="0%" style="stop-color:#8000ff;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:transparent" />
    </radialGradient>
    <radialGradient id="bg3" cx="40%" cy="60%" r="35%">
      <stop offset="0%" style="stop-color:#0080ff;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:transparent" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#000011"/>
  <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${width * 0.3}" fill="url(#bg1)"/>
  <circle cx="${width * 0.8}" cy="${height * 0.8}" r="${width * 0.25}" fill="url(#bg2)"/>
  <circle cx="${width * 0.4}" cy="${height * 0.6}" r="${width * 0.35}" fill="url(#bg3)"/>
</svg>`;
}

// Create assets directory
const assetsDir = path.join(__dirname, '..', 'public', 'psychedelic-assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate all psychedelic assets
console.log('🎨 Generating psychedelic assets for NFA Bears...');

// Generate oil blob patterns
Object.entries(PSYCHEDELIC_PALETTES).forEach(([name, palette]) => {
  const svg = generateOilBlobSVG(palette, 200);
  fs.writeFileSync(path.join(assetsDir, `oil-blob-${name}.svg`), svg);
  console.log(`✅ Generated oil-blob-${name}.svg`);
});

// Generate kaleidoscope frames
const kaleidoscopeSVG = generateKaleidoscopeFrame(300);
fs.writeFileSync(path.join(assetsDir, 'kaleidoscope-frame.svg'), kaleidoscopeSVG);
console.log('✅ Generated kaleidoscope-frame.svg');

// Generate psychedelic backgrounds
const backgroundSVG = generatePsychedelicBackground(800, 600);
fs.writeFileSync(path.join(assetsDir, 'psychedelic-background.svg'), backgroundSVG);
console.log('✅ Generated psychedelic-background.svg');

// Generate CSS for the assets
const cssContent = `
/* Psychedelic Asset CSS Classes */
.psychedelic-oil-blob-oilslick {
  background-image: url('/psychedelic-assets/oil-blob-oilSlick.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.psychedelic-oil-blob-lavalamp {
  background-image: url('/psychedelic-assets/oil-blob-lavaLamp.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.psychedelic-oil-blob-tiedye {
  background-image: url('/psychedelic-assets/oil-blob-tieDye.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.psychedelic-kaleidoscope-frame {
  background-image: url('/psychedelic-assets/kaleidoscope-frame.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.psychedelic-background {
  background-image: url('/psychedelic-assets/psychedelic-background.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
`;

fs.writeFileSync(path.join(assetsDir, 'psychedelic-assets.css'), cssContent);
console.log('✅ Generated psychedelic-assets.css');

console.log('\n🎉 All psychedelic assets generated successfully!');
console.log(`📁 Assets saved to: ${assetsDir}`);
console.log('\n💡 Usage:');
console.log('1. Import the CSS: @import "/psychedelic-assets/psychedelic-assets.css";');
console.log('2. Use the classes in your components');
console.log('3. Customize the SVG files as needed');
console.log('\n🐻 Ready to make the NFA Bears even more psychedelic! ✨');
