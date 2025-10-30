/**
 * IRIDESCENT SHIMMER EFFECT - GLSL Shader
 *
 * Creates subtle shimmer on edges based on viewing angle (Fresnel effect).
 * Simulates the way light catches on soap bubbles and oil slicks at glancing angles.
 *
 * Physics: Fresnel equations describe reflection/transmission at interfaces.
 * Simplified version using Schlick's approximation.
 *
 * Usage: Import into thin-film or as separate pass
 */

// ========================================
// VERTEX SHADER
// ========================================
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vUv = uv;

  // Transform normal to view space
  vNormal = normalize(normalMatrix * normal);

  // Calculate view direction
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPosition.xyz);

  gl_Position = projectionMatrix * mvPosition;
}

// ========================================
// FRAGMENT SHADER
// ========================================
uniform float uTime;
uniform float uShimmerIntensity; // 0-1
uniform float uShimmerFrequency; // Wave frequency
uniform float uFresnelPower; // Edge sharpness (1-5)
uniform vec3 uShimmerColor; // Base shimmer color
uniform float uPaletteRGB[12]; // Palette colors

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

/**
 * Fresnel effect (Schlick's approximation)
 * Returns 0-1, higher at grazing angles
 */
float fresnel(vec3 normal, vec3 viewDir, float power) {
  float dotNV = max(0.0, dot(normal, viewDir));
  return pow(1.0 - dotNV, power);
}

/**
 * Animated shimmer wave
 * Creates flowing shimmer pattern
 */
float shimmerWave(vec2 uv, float time, float frequency) {
  // Diagonal wave pattern
  float wave1 = sin((uv.x + uv.y) * frequency + time * 2.0);
  float wave2 = sin((uv.x - uv.y) * frequency * 1.3 + time * 1.5);

  // Combine waves
  return (wave1 + wave2) * 0.5;
}

void main() {
  // Calculate Fresnel (edge glow)
  float fresnelValue = fresnel(vNormal, vViewDir, uFresnelPower);

  // Animated shimmer wave
  float shimmer = shimmerWave(vUv, uTime, uShimmerFrequency);

  // Combine Fresnel with shimmer animation
  float shimmerMask = fresnelValue * (0.5 + shimmer * 0.5);

  // Get palette color for shimmer tint
  vec3 paletteColor1 = vec3(uPaletteRGB[0], uPaletteRGB[1], uPaletteRGB[2]);
  vec3 paletteColor2 = vec3(uPaletteRGB[3], uPaletteRGB[4], uPaletteRGB[5]);

  // Blend between two palette colors based on position
  vec3 shimmerTint = mix(paletteColor1, paletteColor2, vUv.y);

  // Apply base shimmer color with palette tint
  vec3 finalShimmer = mix(uShimmerColor, shimmerTint, 0.4);

  // Output shimmer with alpha based on mask
  gl_FragColor = vec4(finalShimmer, shimmerMask * uShimmerIntensity);
}
