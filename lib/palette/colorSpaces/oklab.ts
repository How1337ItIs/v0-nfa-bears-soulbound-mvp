/**
 * OKLAB COLOR SPACE
 *
 * Perceptually uniform color space for better color operations.
 * Oklab provides more accurate color mixing, interpolation, and manipulation
 * compared to RGB or HSL.
 *
 * Benefits:
 * - Perceptually uniform (equal distances = equal perceived difference)
 * - Better color mixing (no muddy grays)
 * - Accurate lightness control
 * - Hue linearity
 *
 * References:
 * - https://bottosson.github.io/posts/oklab/
 * - https://en.wikipedia.org/wiki/Oklab_color_space
 *
 * Usage:
 * ```typescript
 * const [L, a, b] = sRGBToOklab(1.0, 0.5, 0.2);
 * const blended = mixOklab(color1, color2, 0.5);
 * const [r, g, b] = oklabToSRGB(L, a, b);
 * ```
 */

/**
 * Convert sRGB to linear RGB (remove gamma)
 * @param srgb - sRGB value (0-1)
 * @returns Linear RGB value (0-1)
 */
function sRGBToLinear(srgb: number): number {
  if (srgb <= 0.04045) {
    return srgb / 12.92;
  } else {
    return Math.pow((srgb + 0.055) / 1.055, 2.4);
  }
}

/**
 * Convert linear RGB to sRGB (apply gamma)
 * @param linear - Linear RGB value (0-1)
 * @returns sRGB value (0-1)
 */
function linearToSRGB(linear: number): number {
  if (linear <= 0.0031308) {
    return 12.92 * linear;
  } else {
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
  }
}

/**
 * Convert sRGB to Oklab color space
 * @param r - Red (0-1, sRGB)
 * @param g - Green (0-1, sRGB)
 * @param b - Blue (0-1, sRGB)
 * @returns [L, a, b] in Oklab space
 */
export function sRGBToOklab(r: number, g: number, b: number): [number, number, number] {
  // Convert sRGB to linear RGB
  const lr = sRGBToLinear(r);
  const lg = sRGBToLinear(g);
  const lb = sRGBToLinear(b);

  // Linear RGB to LMS cone response (approximate human vision)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Apply cube root (nonlinear transform)
  const lCube = Math.cbrt(l);
  const mCube = Math.cbrt(m);
  const sCube = Math.cbrt(s);

  // LMS to Oklab
  return [
    0.2104542553 * lCube + 0.7936177850 * mCube - 0.0040720468 * sCube, // L
    1.9779984951 * lCube - 2.4285922050 * mCube + 0.4505937099 * sCube, // a
    0.0259040371 * lCube + 0.7827717662 * mCube - 0.8086757660 * sCube,  // b
  ];
}

/**
 * Convert Oklab to sRGB color space
 * @param L - Lightness (0-1)
 * @param a - Green-red axis (-0.5 to 0.5 typical)
 * @param b - Blue-yellow axis (-0.5 to 0.5 typical)
 * @returns [r, g, b] in sRGB (0-1)
 */
export function oklabToSRGB(L: number, a: number, b: number): [number, number, number] {
  // Oklab to LMS
  const lCube = L + 0.3963377774 * a + 0.2158037573 * b;
  const mCube = L - 0.1055613458 * a - 0.0638541728 * b;
  const sCube = L - 0.0894841775 * a - 1.2914855480 * b;

  // Cube to get LMS
  const l = lCube * lCube * lCube;
  const m = mCube * mCube * mCube;
  const s = sCube * sCube * sCube;

  // LMS to linear RGB
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp to valid range
  const clampedLR = Math.max(0, Math.min(1, lr));
  const clampedLG = Math.max(0, Math.min(1, lg));
  const clampedLB = Math.max(0, Math.min(1, lb));

  // Convert linear RGB to sRGB
  return [
    linearToSRGB(clampedLR),
    linearToSRGB(clampedLG),
    linearToSRGB(clampedLB),
  ];
}

/**
 * Mix two colors in Oklab space (perceptually uniform)
 * @param rgb1 - First color [r, g, b] in sRGB
 * @param rgb2 - Second color [r, g, b] in sRGB
 * @param t - Mix amount (0-1, 0=rgb1, 1=rgb2)
 * @returns Mixed color [r, g, b] in sRGB
 */
export function mixOklab(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  t: number
): [number, number, number] {
  // Convert to Oklab
  const lab1 = sRGBToOklab(...rgb1);
  const lab2 = sRGBToOklab(...rgb2);

  // Linear interpolation in Oklab space
  const labMixed: [number, number, number] = [
    lab1[0] * (1 - t) + lab2[0] * t,
    lab1[1] * (1 - t) + lab2[1] * t,
    lab1[2] * (1 - t) + lab2[2] * t,
  ];

  // Convert back to sRGB
  return oklabToSRGB(...labMixed);
}

/**
 * Adjust lightness in Oklab space
 * @param rgb - Color [r, g, b] in sRGB
 * @param lightnessAdjust - Amount to adjust lightness (-1 to 1)
 * @returns Adjusted color [r, g, b] in sRGB
 */
export function adjustLightness(
  rgb: [number, number, number],
  lightnessAdjust: number
): [number, number, number] {
  const [L, a, b] = sRGBToOklab(...rgb);

  // Adjust lightness
  const newL = Math.max(0, Math.min(1, L + lightnessAdjust));

  return oklabToSRGB(newL, a, b);
}

/**
 * Adjust chroma (saturation) in Oklab space
 * @param rgb - Color [r, g, b] in sRGB
 * @param chromaScale - Chroma multiplier (0-2, 1=unchanged)
 * @returns Adjusted color [r, g, b] in sRGB
 */
export function adjustChroma(
  rgb: [number, number, number],
  chromaScale: number
): [number, number, number] {
  const [L, a, b] = sRGBToOklab(...rgb);

  // Scale chroma (a and b components)
  return oklabToSRGB(L, a * chromaScale, b * chromaScale);
}

/**
 * Rotate hue in Oklab space
 * @param rgb - Color [r, g, b] in sRGB
 * @param angle - Rotation angle in radians
 * @returns Rotated color [r, g, b] in sRGB
 */
export function rotateHue(
  rgb: [number, number, number],
  angle: number
): [number, number, number] {
  const [L, a, b] = sRGBToOklab(...rgb);

  // Rotate a/b plane
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const aRotated = a * cos - b * sin;
  const bRotated = a * sin + b * cos;

  return oklabToSRGB(L, aRotated, bRotated);
}

/**
 * Calculate perceptual distance between two colors
 * @param rgb1 - First color
 * @param rgb2 - Second color
 * @returns Perceptual distance (0+, lower = more similar)
 */
export function perceptualDistance(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const lab1 = sRGBToOklab(...rgb1);
  const lab2 = sRGBToOklab(...rgb2);

  const dL = lab2[0] - lab1[0];
  const da = lab2[1] - lab1[1];
  const db = lab2[2] - lab1[2];

  return Math.sqrt(dL * dL + da * da + db * db);
}
