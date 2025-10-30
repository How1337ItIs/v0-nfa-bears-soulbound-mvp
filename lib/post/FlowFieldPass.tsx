'use client';

/**
 * FLOW FIELD DISTORTION PASS
 *
 * Creates organic UV distortion based on audio-reactive flow fields.
 * Simulates the way liquid flows and warps light.
 *
 * Performance: ~2ms GPU time
 * Use: Optional effect for medium+ tiers
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const flowFieldShader = `
  uniform float uTime;
  uniform float uFlowStrength;
  uniform float uFlowSpeed;
  uniform float uAudioEnergy;
  uniform vec2 uResolution;

  // Simplex-like noise approximation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Flow field calculation
  vec2 flowField(vec2 uv, float time, float audioEnergy) {
    // Multi-octave noise for organic flow
    float scale1 = 8.0;
    float scale2 = 16.0;

    float n1 = noise(uv * scale1 + time * 0.3);
    float n2 = noise(uv * scale2 + time * 0.5);

    // Flow direction based on noise gradients
    vec2 flow = vec2(
      sin(n1 * 6.28318 + time) * cos(n2 * 3.14159 + time * 0.8),
      cos(n1 * 6.28318 + time * 0.7) * sin(n2 * 3.14159 + time)
    );

    // Audio reactivity: more energy = stronger flow
    float strength = uFlowStrength * (0.5 + audioEnergy * 0.5);

    return flow * strength;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate flow field
    vec2 flow = flowField(uv, uTime * uFlowSpeed, uAudioEnergy);

    // Distort UV coordinates
    vec2 distortedUV = uv + flow;

    // Sample with distorted coordinates
    vec4 distortedColor = texture2D(inputBuffer, distortedUV);

    // Blend between original and distorted
    float blendFactor = length(flow) * 2.0; // More distortion = more blend
    blendFactor = clamp(blendFactor, 0.0, 1.0);

    outputColor = mix(inputColor, distortedColor, blendFactor);
  }
`;

class FlowFieldEffect extends Effect {
  constructor() {
    super('FlowFieldEffect', flowFieldShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uFlowStrength', new THREE.Uniform(0.05)],
        ['uFlowSpeed', new THREE.Uniform(0.5)],
        ['uAudioEnergy', new THREE.Uniform(0.5)],
        ['uResolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
      ])
    });
  }
}

extend({ FlowFieldEffect });

interface FlowFieldPassProps {
  audioParams: AudioReactiveParams;
  strength?: number;
  speed?: number;
  enabled?: boolean;
}

export function FlowFieldPass({
  audioParams,
  strength = 0.05,
  speed = 0.5,
  enabled = true
}: FlowFieldPassProps) {
  const effectRef = useRef<FlowFieldEffect>();

  const effect = useMemo(() => {
    const flowEffect = new FlowFieldEffect();
    effectRef.current = flowEffect;
    return flowEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uTime')!.value = state.clock.elapsedTime;
    uniforms.get('uFlowStrength')!.value = strength;
    uniforms.get('uFlowSpeed')!.value = speed;

    // Audio reactivity: combine bass and mids for flow energy
    const audioEnergy = (audioParams.splatForce - 8) / 15 * 0.5 +
                        (audioParams.thermalRate - 2) / 6 * 0.5;
    uniforms.get('uAudioEnergy')!.value = audioEnergy;
  });

  return enabled ? <primitive object={effect} /> : null;
}
