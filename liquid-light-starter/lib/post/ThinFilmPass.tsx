'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector2 } from 'three';
import React from 'react';

type Props = {
  enabled?: boolean;
  intensity?: number; // 0..1
  phase?: number;     // 0..2π
};

/**
 * Lightweight thin-film interference overlay that adds iridescent hue shifts.
 * Renders in its own R3F Canvas above the fluid canvas and blends additively.
 * Does not sample the fluid texture (DOM layering keeps them visually combined).
 */
const frag = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uPhase;

/* Convert wavelength (nm) to RGB roughly; simplified approximation */
vec3 wavelengthToRGB(float lambda) {
  float r=0.0, g=0.0, b=0.0;
  if (lambda >= 380.0 && lambda < 440.0) { r = -(lambda - 440.0) / (440.0 - 380.0); b = 1.0; }
  else if (lambda < 490.0) { g = (lambda - 440.0) / (490.0 - 440.0); b = 1.0; }
  else if (lambda < 510.0) { g = 1.0; b = -(lambda - 510.0) / (510.0 - 490.0); }
  else if (lambda < 580.0) { r = (lambda - 510.0) / (580.0 - 510.0); g = 1.0; }
  else if (lambda < 645.0) { r = 1.0; g = -(lambda - 645.0) / (645.0 - 580.0); }
  else if (lambda <= 780.0) { r = 1.0; }
  float s = 1.0;
  if (lambda > 700.0) s = 0.3 + 0.7 * (780.0 - lambda) / (80.0);
  else if (lambda < 420.0) s = 0.3 + 0.7 * (lambda - 380.0) / (40.0);
  return clamp(vec3(r,g,b) * s, 0.0, 1.0);
}

/* Interference pattern: phase varies by position & time */
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.y = 1.0 - uv.y; // top-left origin handling

  // Subtle flowing height map from sin/cos; avoids heavy noise
  float h = 0.0;
  h += 0.5 * sin(uv.x * 6.283 + uTime * 0.12);
  h += 0.5 * cos(uv.y * 6.283 + uTime * 0.10);
  h += 0.25 * sin((uv.x+uv.y) * 6.283 + uTime * 0.07);

  float phase = uPhase + h * 2.0;
  // Map phase to wavelength sweep around visible spectrum
  float lambda = 540.0 + 140.0 * sin(phase);
  vec3 irid = wavelengthToRGB(lambda);

  // Additive iridescent veil with gentle vignette
  float vignette = smoothstep(0.8, 0.2, length(uv - 0.5));
  vec3 color = irid * uIntensity * 0.6 * vignette;
  gl_FragColor = vec4(color, 0.8 * uIntensity);
}
`;

function ThinFilmPlane({ intensity = 0.5, phase = 0, enabled = true }: Props) {
  const matRef = useRef<ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({
    uResolution: { value: new Vector2(1,1) },
    uTime: { value: 0 },
    uIntensity: { value: intensity },
    uPhase: { value: phase },
  }), [intensity, phase]);

  useFrame(({ size, clock }) => {
    if (!enabled) return;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uTime.value = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.needsUpdate = true;
    }
  });

  if (!enabled) return null;

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry />
      <shaderMaterial ref={matRef} uniforms={uniforms} fragmentShader={frag} transparent />
    </mesh>
  );
}

export function ThinFilmOverlay({ intensity=0.5, phase=0, enabled=true }: Props) {
  if (!enabled) return null;
  return (
    <Canvas
      className="pointer-events-none fixed inset-0 -z-5"
      orthographic
      camera={{ position: [0,0,1], near: 0.1, far: 10 }}
    >
      <ThinFilmPlane intensity={intensity} phase={phase} enabled={enabled} />
    </Canvas>
  );
}
