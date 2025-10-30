'use client';

/**
 * REFRACTION PASS - Light bending through fluid
 *
 * Simulates refraction as if viewing through liquid.
 * Based on fluid density gradients.
 *
 * Performance: ~2.5ms GPU time
 * Use: Optional enhancement for high tier
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const refractionShader = `
  uniform float uRefractionStrength;
  uniform float uIndexOfRefraction; // IOR (1.0-2.0, typical: 1.33 for water)
  uniform vec2 uResolution;
  uniform float uAudioEnergy;

  // Simple gradient approximation for normal calculation
  vec2 calculateGradient(vec2 uv) {
    vec2 texelSize = 1.0 / uResolution;

    // Sample surrounding pixels
    float right = texture2D(inputBuffer, uv + vec2(texelSize.x, 0.0)).r;
    float left = texture2D(inputBuffer, uv - vec2(texelSize.x, 0.0)).r;
    float top = texture2D(inputBuffer, uv + vec2(0.0, texelSize.y)).r;
    float bottom = texture2D(inputBuffer, uv - vec2(0.0, texelSize.y)).r;

    return vec2(right - left, top - bottom);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate density gradient (proxy for surface normal)
    vec2 gradient = calculateGradient(uv);

    // Refraction offset based on gradient and IOR
    // Snell's law approximation: n1 * sin(θ1) = n2 * sin(θ2)
    float strength = uRefractionStrength * (0.7 + uAudioEnergy * 0.3);
    vec2 refractOffset = gradient * strength * uIndexOfRefraction * 0.01;

    // Sample with refracted coordinates
    vec2 refractedUV = uv + refractOffset;

    // Clamp to valid range
    refractedUV = clamp(refractedUV, 0.0, 1.0);

    vec4 refractedColor = texture2D(inputBuffer, refractedUV);

    // Blend based on gradient magnitude (more refraction where gradient is strong)
    float blendFactor = length(gradient) * 2.0;
    blendFactor = clamp(blendFactor, 0.0, 1.0);

    outputColor = mix(inputColor, refractedColor, blendFactor);
  }
`;

class RefractionEffect extends Effect {
  constructor() {
    super('RefractionEffect', refractionShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uRefractionStrength', new THREE.Uniform(0.5)],
        ['uIndexOfRefraction', new THREE.Uniform(1.33)], // Water
        ['uResolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
        ['uAudioEnergy', new THREE.Uniform(0.5)],
      ])
    });
  }
}

extend({ RefractionEffect });

interface RefractionPassProps {
  audioParams?: AudioReactiveParams;
  strength?: number;
  ior?: number; // Index of refraction
  enabled?: boolean;
}

export function RefractionPass({
  audioParams,
  strength = 0.5,
  ior = 1.33,
  enabled = true
}: RefractionPassProps) {
  const effectRef = useRef<RefractionEffect>();

  const effect = useMemo(() => {
    const refractionEffect = new RefractionEffect();
    effectRef.current = refractionEffect;
    return refractionEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uRefractionStrength')!.value = strength;
    uniforms.get('uIndexOfRefraction')!.value = ior;

    // Update resolution
    const size = state.size;
    uniforms.get('uResolution')!.value = new THREE.Vector2(size.width, size.height);

    // Audio reactivity: stronger refraction with more energy
    if (audioParams) {
      const audioEnergy = (audioParams.splatForce - 8) / 15; // Normalize 8-23 to 0-1
      uniforms.get('uAudioEnergy')!.value = audioEnergy;
    }
  });

  return enabled ? <primitive object={effect} /> : null;
}

/**
 * Material presets (different IOR values)
 */
export const REFRACTION_MATERIALS = {
  air: 1.0,
  water: 1.33,
  glass: 1.5,
  crystal: 1.8,
  diamond: 2.42,
};
