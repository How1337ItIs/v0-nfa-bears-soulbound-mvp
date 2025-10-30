'use client';

/**
 * CHROMATIC ABERRATION PASS
 *
 * Subtle RGB channel split for psychedelic effect.
 * Simulates lens dispersion where different wavelengths refract differently.
 *
 * Performance: <1ms GPU time (very lightweight)
 * Use: Optional effect for all tiers (minimal cost)
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const chromaticAberrationShader = `
  uniform float uOffset;
  uniform float uRadialOffset;
  uniform vec2 uDirection;
  uniform float uAudioReactive;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate radial offset (stronger at edges)
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    float radialFactor = dist * uRadialOffset;

    // Base offset modulated by audio
    float totalOffset = (uOffset + radialFactor) * (0.7 + uAudioReactive * 0.3);

    // Sample RGB channels at different offsets
    vec2 rOffset = uDirection * totalOffset;
    vec2 gOffset = vec2(0.0); // Green stays centered
    vec2 bOffset = -uDirection * totalOffset;

    float r = texture2D(inputBuffer, uv + rOffset).r;
    float g = texture2D(inputBuffer, uv + gOffset).g;
    float b = texture2D(inputBuffer, uv + bOffset).b;

    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

class ChromaticAberrationEffect extends Effect {
  constructor() {
    super('ChromaticAberrationEffect', chromaticAberrationShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uOffset', new THREE.Uniform(0.002)],
        ['uRadialOffset', new THREE.Uniform(0.5)],
        ['uDirection', new THREE.Uniform(new THREE.Vector2(1, 0))],
        ['uAudioReactive', new THREE.Uniform(0.5)],
      ])
    });
  }
}

extend({ ChromaticAberrationEffect });

interface ChromaticAberrationPassProps {
  offset?: number;
  radialOffset?: number;
  direction?: [number, number];
  audioParams?: AudioReactiveParams;
  enabled?: boolean;
}

export function ChromaticAberrationPass({
  offset = 0.002,
  radialOffset = 0.5,
  direction = [1, 0],
  audioParams,
  enabled = true
}: ChromaticAberrationPassProps) {
  const effectRef = useRef<ChromaticAberrationEffect>();

  const effect = useMemo(() => {
    const aberrationEffect = new ChromaticAberrationEffect();
    effectRef.current = aberrationEffect;
    return aberrationEffect;
  }, []);

  useFrame(() => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uOffset')!.value = offset;
    uniforms.get('uRadialOffset')!.value = radialOffset;
    uniforms.get('uDirection')!.value = new THREE.Vector2(direction[0], direction[1]);

    // Audio reactivity
    if (audioParams) {
      const audioReactive = (audioParams.globalIntensity - 0.4) / 0.6; // Normalize 0.4-1.0 to 0-1
      uniforms.get('uAudioReactive')!.value = audioReactive;
    }
  });

  return enabled ? <primitive object={effect} /> : null;
}
