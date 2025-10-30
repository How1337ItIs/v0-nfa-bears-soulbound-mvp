'use client';

/**
 * HEAT HAZE DISTORTION EFFECT
 *
 * Simulates heat distortion (like air above hot pavement).
 * Creates organic wavering effect, perfect for "Fire on the Mountain" palette.
 *
 * Performance: ~2ms GPU time
 * Use: Fire-themed palettes, high intensity modes
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const heatHazeShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform float uScale;
  uniform vec2 uDirection; // Heat rise direction (typically upward)

  // Simple hash-based noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise
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

  // Heat haze distortion
  vec2 heatDistortion(vec2 uv, float time, float intensity) {
    // Multiple layers of noise for organic effect
    float n1 = noise(uv * uScale + vec2(0.0, time * uSpeed));
    float n2 = noise(uv * uScale * 2.0 + vec2(0.0, time * uSpeed * 1.3));
    float n3 = noise(uv * uScale * 4.0 + vec2(0.0, time * uSpeed * 0.7));

    // Combine octaves
    float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // More distortion at bottom (where heat rises from)
    float verticalGradient = 1.0 - uv.y;

    // Apply distortion in heat rise direction
    vec2 distortion = uDirection * (combined - 0.5) * intensity * verticalGradient * 0.02;

    return distortion;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate heat distortion
    vec2 distortion = heatDistortion(uv, uTime, uIntensity);

    // Apply distortion to UV
    vec2 distortedUV = uv + distortion;

    // Sample with distorted coordinates
    vec4 distortedColor = texture2D(inputBuffer, distortedUV);

    outputColor = distortedColor;
  }
`;

class HeatHazeEffect extends Effect {
  constructor() {
    super('HeatHazeEffect', heatHazeShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uIntensity', new THREE.Uniform(0.3)],
        ['uSpeed', new THREE.Uniform(1.0)],
        ['uScale', new THREE.Uniform(20.0)],
        ['uDirection', new THREE.Uniform(new THREE.Vector2(0, 1))], // Upward
      ])
    });
  }
}

extend({ HeatHazeEffect });

interface HeatHazePassProps {
  audioParams?: AudioReactiveParams;
  intensity?: number;
  speed?: number;
  scale?: number;
  direction?: [number, number];
  enabled?: boolean;
}

export function HeatHazePass({
  audioParams,
  intensity = 0.3,
  speed = 1.0,
  scale = 20.0,
  direction = [0, 1],
  enabled = true
}: HeatHazePassProps) {
  const effectRef = useRef<HeatHazeEffect>();

  const effect = useMemo(() => {
    const hazeEffect = new HeatHazeEffect();
    effectRef.current = hazeEffect;
    return hazeEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uTime')!.value = state.clock.elapsedTime;
    uniforms.get('uSpeed')!.value = speed;
    uniforms.get('uScale')!.value = scale;
    uniforms.get('uDirection')!.value = new THREE.Vector2(direction[0], direction[1]);

    // Audio reactivity: intensity increases with thermal rate
    if (audioParams) {
      const audioIntensity = (audioParams.thermalRate - 2) / 6; // Normalize 2-8 to 0-1
      uniforms.get('uIntensity')!.value = intensity * (0.5 + audioIntensity * 0.5);
    } else {
      uniforms.get('uIntensity')!.value = intensity;
    }
  });

  return enabled ? <primitive object={effect} /> : null;
}

/**
 * Heat haze presets for different intensities
 */
export const HEAT_HAZE_PRESETS = {
  subtle: {
    intensity: 0.2,
    speed: 0.8,
    scale: 25.0,
  },
  moderate: {
    intensity: 0.4,
    speed: 1.2,
    scale: 20.0,
  },
  intense: {
    intensity: 0.6,
    speed: 1.8,
    scale: 15.0,
  },
};
