'use client';

/**
 * VIGNETTE EFFECT - Subtle edge darkening
 *
 * Darkens edges for focus and cinematic feel.
 * Classic post-processing technique.
 *
 * Performance: <0.5ms GPU time (extremely lightweight)
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const vignetteShader = `
  uniform float uIntensity;
  uniform float uSmoothness;
  uniform vec2 uCenter;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float dist = distance(uv, uCenter);

    // Smooth vignette falloff
    float vignette = smoothstep(uIntensity, uIntensity - uSmoothness, dist);

    // Apply to color
    vec3 vignetted = inputColor.rgb * vignette;

    outputColor = vec4(vignetted, inputColor.a);
  }
`;

class VignetteEffect extends Effect {
  constructor() {
    super('VignetteEffect', vignetteShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uIntensity', new THREE.Uniform(0.8)],
        ['uSmoothness', new THREE.Uniform(0.5)],
        ['uCenter', new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
      ])
    });
  }
}

extend({ VignetteEffect });

interface VignettePassProps {
  intensity?: number;
  smoothness?: number;
  center?: [number, number];
  enabled?: boolean;
}

export function VignettePass({
  intensity = 0.8,
  smoothness = 0.5,
  center = [0.5, 0.5],
  enabled = true
}: VignettePassProps) {
  const effectRef = useRef<VignetteEffect>();

  const effect = useMemo(() => {
    const vignetteEffect = new VignetteEffect();
    effectRef.current = vignetteEffect;
    return vignetteEffect;
  }, []);

  useFrame(() => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uIntensity')!.value = intensity;
    uniforms.get('uSmoothness')!.value = smoothness;
    uniforms.get('uCenter')!.value = new THREE.Vector2(center[0], center[1]);
  });

  return enabled ? <primitive object={effect} /> : null;
}
