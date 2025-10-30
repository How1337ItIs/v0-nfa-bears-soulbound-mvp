'use client';

/**
 * SUBSURFACE SCATTERING EFFECT
 *
 * Simulates light penetration through translucent materials.
 * Creates soft, glowing effect as if light passes through fluid.
 *
 * Performance: ~3ms GPU time
 * Use: Optional enhancement for high tier
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const subsurfaceScatteringShader = `
  uniform float uScatterStrength;
  uniform float uScatterDistance;
  uniform vec3 uScatterColor;
  uniform vec2 uResolution;

  // Multi-sample blur for light scattering
  vec3 subsurfaceScatter(vec2 uv, float distance) {
    vec2 texelSize = 1.0 / uResolution;
    vec3 scatter = vec3(0.0);
    float totalWeight = 0.0;

    // Sample in multiple directions
    const int samples = 8;
    float angleStep = 6.28318 / float(samples);

    for (int i = 0; i < samples; i++) {
      float angle = float(i) * angleStep;
      vec2 offset = vec2(cos(angle), sin(angle)) * distance * texelSize;

      // Gaussian-like falloff
      float weight = 1.0 / (1.0 + length(offset) * 100.0);

      scatter += texture2D(inputBuffer, uv + offset).rgb * weight;
      totalWeight += weight;
    }

    return scatter / totalWeight;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Original color
    vec3 original = inputColor.rgb;

    // Calculate scattered light
    vec3 scattered = subsurfaceScatter(uv, uScatterDistance);

    // Tint scattered light
    vec3 tintedScatter = scattered * uScatterColor;

    // Blend with original
    vec3 finalColor = mix(original, tintedScatter, uScatterStrength);

    outputColor = vec4(finalColor, inputColor.a);
  }
`;

class SubsurfaceScatteringEffect extends Effect {
  constructor() {
    super('SubsurfaceScatteringEffect', subsurfaceScatteringShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uScatterStrength', new THREE.Uniform(0.3)],
        ['uScatterDistance', new THREE.Uniform(5.0)],
        ['uScatterColor', new THREE.Uniform(new THREE.Color(1.0, 0.9, 0.8))],
        ['uResolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
      ])
    });
  }
}

extend({ SubsurfaceScatteringEffect });

interface SubsurfaceScatteringPassProps {
  strength?: number;
  distance?: number;
  scatterColor?: [number, number, number];
  enabled?: boolean;
}

export function SubsurfaceScatteringPass({
  strength = 0.3,
  distance = 5.0,
  scatterColor = [1.0, 0.9, 0.8],
  enabled = true
}: SubsurfaceScatteringPassProps) {
  const effectRef = useRef<SubsurfaceScatteringEffect>();

  const effect = useMemo(() => {
    const sssEffect = new SubsurfaceScatteringEffect();
    effectRef.current = sssEffect;
    return sssEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uScatterStrength')!.value = strength;
    uniforms.get('uScatterDistance')!.value = distance;
    uniforms.get('uScatterColor')!.value = new THREE.Color(...scatterColor);

    const size = state.size;
    uniforms.get('uResolution')!.value = new THREE.Vector2(size.width, size.height);
  });

  return enabled ? <primitive object={effect} /> : null;
}
