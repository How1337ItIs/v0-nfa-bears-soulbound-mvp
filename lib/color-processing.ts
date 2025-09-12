// Multi-space color processing system for enhanced psychedelic effects

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

export interface LAB {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface EnhancedColorSystem {
  rgb: RGB;
  hsv: HSV;
  lab: LAB;
  circadianShift: number;    // 0-1, time-based color temperature
  musicHarmony: number[];    // Music theory intervals
  culturalPalette: GratefulDeadColors;
}

export interface GratefulDeadColors {
  fireOnTheMountain: RGB[];
  darkStar: RGB[];
  chinaCatSunflower: RGB[];
  ripple: RGB[];
  terrapinStation: RGB[];
}

// Grateful Dead authentic color palettes
export const GRATEFUL_DEAD_PALETTES: GratefulDeadColors = {
  fireOnTheMountain: [
    { r: 1.0, g: 0.3, b: 0.1 }, // Deep red
    { r: 1.0, g: 0.5, b: 0.0 }, // Orange
    { r: 1.0, g: 0.8, b: 0.2 }, // Gold
    { r: 0.9, g: 0.2, b: 0.0 }, // Crimson
  ],
  darkStar: [
    { r: 0.2, g: 0.1, b: 0.5 }, // Deep purple
    { r: 0.1, g: 0.0, b: 0.3 }, // Midnight blue
    { r: 0.8, g: 0.8, b: 1.0 }, // Silver
    { r: 0.4, g: 0.2, b: 0.8 }, // Cosmic purple
  ],
  chinaCatSunflower: [
    { r: 1.0, g: 1.0, b: 0.2 }, // Bright yellow
    { r: 0.8, g: 1.0, b: 0.2 }, // Yellow-green
    { r: 0.3, g: 0.8, b: 0.2 }, // Green
    { r: 1.0, g: 0.8, b: 0.0 }, // Sunflower
  ],
  ripple: [
    { r: 0.1, g: 0.3, b: 1.0 }, // Deep blue
    { r: 0.2, g: 0.6, b: 1.0 }, // Sky blue
    { r: 0.9, g: 0.9, b: 1.0 }, // White
    { r: 0.0, g: 0.2, b: 0.6 }, // Ocean blue
  ],
  terrapinStation: [
    { r: 0.6, g: 0.4, b: 0.2 }, // Earth brown
    { r: 0.4, g: 0.6, b: 0.3 }, // Forest green
    { r: 0.8, g: 0.2, b: 1.0 }, // Cosmic purple
    { r: 0.7, g: 0.5, b: 0.1 }, // Desert tan
  ],
};

// Color space conversion functions

export function rgbToHsv(rgb: RGB): HSV {
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;

  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, v };
}

export function hsvToRgb(hsv: HSV): RGB {
  const { h, s, v } = hsv;
  const hNorm = h / 360;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (hNorm >= 0 && hNorm < 1/6) {
    r = c; g = x; b = 0;
  } else if (hNorm >= 1/6 && hNorm < 2/6) {
    r = x; g = c; b = 0;
  } else if (hNorm >= 2/6 && hNorm < 3/6) {
    r = 0; g = c; b = x;
  } else if (hNorm >= 3/6 && hNorm < 4/6) {
    r = 0; g = x; b = c;
  } else if (hNorm >= 4/6 && hNorm < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return { r: r + m, g: g + m, b: b + m };
}

export function rgbToLab(rgb: RGB): LAB {
  // First convert RGB to XYZ
  let { r, g, b } = rgb;
  
  // Gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // RGB to XYZ matrix (sRGB)
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // Normalize by D65 white point
  const xn = x / 0.95047;
  const yn = y / 1.00000;
  const zn = z / 1.08883;

  // XYZ to LAB
  const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
  const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
  const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  return { l, a, b: bLab };
}

export function labToRgb(lab: LAB): RGB {
  const { l, a, b } = lab;

  // LAB to XYZ
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  const xn = fx3 > 0.008856 ? fx3 : (fx - 16/116) / 7.787;
  const yn = fy3 > 0.008856 ? fy3 : (fy - 16/116) / 7.787;
  const zn = fz3 > 0.008856 ? fz3 : (fz - 16/116) / 7.787;

  // Denormalize by D65 white point
  const x = xn * 0.95047;
  const y = yn * 1.00000;
  const z = zn * 1.08883;

  // XYZ to RGB matrix (sRGB)
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  let bRgb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  bRgb = bRgb > 0.0031308 ? 1.055 * Math.pow(bRgb, 1/2.4) - 0.055 : 12.92 * bRgb;

  // Clamp values
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bRgb = Math.max(0, Math.min(1, bRgb));

  return { r, g, b: bRgb };
}

// Enhanced color processing functions

export function createEnhancedColorSystem(baseRgb: RGB, time: number): EnhancedColorSystem {
  const hsv = rgbToHsv(baseRgb);
  const lab = rgbToLab(baseRgb);
  
  // Circadian rhythm color temperature shift
  const hourOfDay = new Date().getHours();
  const circadianShift = 0.5 + 0.3 * Math.sin((hourOfDay / 24) * 2 * Math.PI - Math.PI / 2);
  
  // Music theory harmonic intervals (based on frequency ratios)
  const musicHarmony = [
    1.0,      // Unison
    1.125,    // Major second
    1.25,     // Major third
    1.333,    // Perfect fourth
    1.5,      // Perfect fifth
    1.667,    // Major sixth
    1.875,    // Major seventh
  ];

  return {
    rgb: baseRgb,
    hsv,
    lab,
    circadianShift,
    musicHarmony,
    culturalPalette: GRATEFUL_DEAD_PALETTES,
  };
}

// Advanced color blending in different spaces
export function blendColorsInHSV(color1: RGB, color2: RGB, ratio: number): RGB {
  const hsv1 = rgbToHsv(color1);
  const hsv2 = rgbToHsv(color2);
  
  // Handle hue wraparound for smooth transitions
  let h1 = hsv1.h;
  let h2 = hsv2.h;
  if (Math.abs(h2 - h1) > 180) {
    if (h2 > h1) {
      h1 += 360;
    } else {
      h2 += 360;
    }
  }
  
  const blendedHsv: HSV = {
    h: (h1 * (1 - ratio) + h2 * ratio) % 360,
    s: hsv1.s * (1 - ratio) + hsv2.s * ratio,
    v: hsv1.v * (1 - ratio) + hsv2.v * ratio,
  };
  
  return hsvToRgb(blendedHsv);
}

export function blendColorsInLAB(color1: RGB, color2: RGB, ratio: number): RGB {
  const lab1 = rgbToLab(color1);
  const lab2 = rgbToLab(color2);
  
  const blendedLab: LAB = {
    l: lab1.l * (1 - ratio) + lab2.l * ratio,
    a: lab1.a * (1 - ratio) + lab2.a * ratio,
    b: lab1.b * (1 - ratio) + lab2.b * ratio,
  };
  
  return labToRgb(blendedLab);
}

// Generate dynamic color palette based on Grateful Dead songs
export function generateGratefulDeadPalette(songName: keyof GratefulDeadColors, time: number): RGB[] {
  const basePalette = GRATEFUL_DEAD_PALETTES[songName];
  const enhancedPalette: RGB[] = [];
  
  for (let i = 0; i < basePalette.length; i++) {
    const baseColor = basePalette[i];
    const colorSystem = createEnhancedColorSystem(baseColor, time);
    
    // Apply circadian shift
    const hsv = colorSystem.hsv;
    hsv.h = (hsv.h + colorSystem.circadianShift * 30) % 360; // Subtle hue shift
    hsv.s = Math.max(0.1, hsv.s * (0.8 + colorSystem.circadianShift * 0.4)); // Vary saturation
    
    // Apply time-based variation
    const timeVariation = Math.sin(time * 0.5 + i) * 0.1;
    hsv.v = Math.max(0.1, Math.min(1.0, hsv.v + timeVariation));
    
    enhancedPalette.push(hsvToRgb(hsv));
  }
  
  return enhancedPalette;
}

// Oil-water color separation effect
export function simulateOilWaterSeparation(baseColor: RGB, separationAmount: number, time: number): RGB {
  const lab = rgbToLab(baseColor);
  
  // Simulate chromatic aberration like oil on water
  const separatedLab: LAB = {
    l: lab.l,
    a: lab.a + separationAmount * Math.sin(time * 3.0) * 20,
    b: lab.b + separationAmount * Math.cos(time * 2.0) * 20,
  };
  
  return labToRgb(separatedLab);
}

// Convert color to CSS string
export function rgbToCss(rgb: RGB, alpha: number = 1): string {
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  
  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function hsvToCss(hsv: HSV, alpha: number = 1): string {
  return rgbToCss(hsvToRgb(hsv), alpha);
}