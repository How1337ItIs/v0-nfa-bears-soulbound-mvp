'use client';

/**
 * SHIMMER PASS - Iridescent edge shimmer effect
 *
 * Creates subtle Fresnel-based shimmer on edges, like light catching
 * on soap bubbles at glancing angles.
 *
 * Performance: ~1.5ms GPU time (lightweight)
 * Use: Optional overlay for high-tier devices
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { PaletteDirector } from '@/lib/palette';

// Shimmer fragment shader
const shimmerShader = `
  uniform float uTime;
  uniform float uShimmerIntensity;
  uniform float uShimmerFrequency;
  uniform float uFresnelPower;
  uniform vec3 uShimmerColor;
  uniform float uPaletteRGB[12];

  // Fresnel effect (simplified for 2D)
  float fresnel(vec2 uv) {
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    float edgeFactor = smoothstep(0.2, 0.7, dist);
    return pow(edgeFactor, uFresnelPower);
  }

  // Animated shimmer wave
  float shimmerWave(vec2 uv, float time, float frequency) {
    float wave1 = sin((uv.x + uv.y) * frequency + time * 2.0);
    float wave2 = sin((uv.x - uv.y) * frequency * 1.3 + time * 1.5);
    return (wave1 + wave2) * 0.5;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 original = inputColor;

    float fresnelValue = fresnel(uv);
    float shimmer = shimmerWave(uv, uTime, uShimmerFrequency);
    float shimmerMask = fresnelValue * (0.5 + shimmer * 0.5);

    vec3 paletteColor1 = vec3(uPaletteRGB[0], uPaletteRGB[1], uPaletteRGB[2]);
    vec3 paletteColor2 = vec3(uPaletteRGB[3], uPaletteRGB[4], uPaletteRGB[5]);
    vec3 shimmerTint = mix(paletteColor1, paletteColor2, uv.y);
    vec3 finalShimmer = mix(uShimmerColor, shimmerTint, 0.4);

    vec3 finalColor = original.rgb + finalShimmer * shimmerMask * uShimmerIntensity;
    outputColor = vec4(finalColor, original.a);
  }
`;

class ShimmerEffect extends Effect {
  constructor() {
    super('ShimmerEffect', shimmerShader, {
      blendFunction: BlendFunction.ADD,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uShimmerIntensity', new THREE.Uniform(0.3)],
        ['uShimmerFrequency', new THREE.Uniform(10.0)],
        ['uFresnelPower', new THREE.Uniform(3.0)],
        ['uShimmerColor', new THREE.Uniform(new THREE.Color(1.0, 1.0, 1.0))],
        ['uPaletteRGB', new THREE.Uniform(new Float32Array(12))],
      ])
    });
  }
}

extend({ ShimmerEffect });

interface ShimmerPassProps {
  intensity?: number;
  frequency?: number;
  fresnelPower?: number;
  paletteId?: string;
  enabled?: boolean;
}

export function ShimmerPass({
  intensity = 0.3,
  frequency = 10.0,
  fresnelPower = 3.0,
  paletteId = 'classic-60s',
  enabled = true
}: ShimmerPassProps) {
  const effectRef = useRef<ShimmerEffect>();

  const effect = useMemo(() => {
    const shimmerEffect = new ShimmerEffect();
    effectRef.current = shimmerEffect;
    return shimmerEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uTime')!.value = state.clock.elapsedTime;
    uniforms.get('uShimmerIntensity')!.value = intensity;
    uniforms.get('uShimmerFrequency')!.value = frequency;
    uniforms.get('uFresnelPower')!.value = fresnelPower;

    const paletteColorsRGB = PaletteDirector.getCurrentColorsRGB();
    const flattenedColors = new Float32Array(12);

    for (let i = 0; i < 4 && i < paletteColorsRGB.length; i++) {
      flattenedColors[i * 3] = paletteColorsRGB[i][0];
      flattenedColors[i * 3 + 1] = paletteColorsRGB[i][1];
      flattenedColors[i * 3 + 2] = paletteColorsRGB[i][2];
    }

    uniforms.get('uPaletteRGB')!.value = flattenedColors;
  });

  return enabled ? <primitive object={effect} /> : null;
}
