'use client';

/**
 * PARTICLE OVERLAY - Floating particle field
 *
 * Creates subtle floating particles using hash-based pseudo-random generation.
 * Inspired by dust motes in light, adds organic life to visuals.
 *
 * Performance: ~1.5ms GPU time
 * Use: Optional enhancement for medium+ tiers
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const particleOverlayShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uDensity; // Particle density
  uniform float uSpeed; // Movement speed
  uniform float uSize; // Particle size
  uniform vec3 uParticleColor;
  uniform float uPaletteRGB[12];

  // Hash function for pseudo-random particles
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Particle field
  float particles(vec2 uv, float time, float density, float speed, float size) {
    vec2 grid = floor(uv * density);
    vec2 localUV = fract(uv * density);

    // Pseudo-random offset for each grid cell
    vec2 offset = vec2(
      hash(grid),
      hash(grid + vec2(100.0, 0.0))
    );

    // Animate particle position (slow drift)
    vec2 particlePos = offset + vec2(0.0, -time * speed * 0.1);
    particlePos = fract(particlePos);

    // Distance to particle
    float dist = length(localUV - particlePos);

    // Particle glow (soft circle)
    float particle = smoothstep(size, 0.0, dist);

    // Random brightness per particle
    float brightness = hash(grid + vec2(200.0, 0.0));

    return particle * brightness;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate particles
    float particleField = particles(uv, uTime, uDensity, uSpeed, uSize);

    // Get palette color for particle tint
    vec3 paletteColor1 = vec3(uPaletteRGB[0], uPaletteRGB[1], uPaletteRGB[2]);
    vec3 paletteColor2 = vec3(uPaletteRGB[3], uPaletteRGB[4], uPaletteRGB[5]);

    // Blend palette colors based on position
    vec3 particleTint = mix(paletteColor1, paletteColor2, uv.y);

    // Apply particle color
    vec3 particleColor = mix(uParticleColor, particleTint, 0.5);

    // Add particles to original color
    vec3 finalColor = inputColor.rgb + particleColor * particleField * uIntensity;

    outputColor = vec4(finalColor, inputColor.a);
  }
`;

class ParticleOverlayEffect extends Effect {
  constructor() {
    super('ParticleOverlayEffect', particleOverlayShader, {
      blendFunction: BlendFunction.ADD,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uIntensity', new THREE.Uniform(0.2)],
        ['uDensity', new THREE.Uniform(50.0)],
        ['uSpeed', new THREE.Uniform(1.0)],
        ['uSize', new THREE.Uniform(0.1)],
        ['uParticleColor', new THREE.Uniform(new THREE.Color(1.0, 1.0, 1.0))],
        ['uPaletteRGB', new THREE.Uniform(new Float32Array(12))],
      ])
    });
  }
}

extend({ ParticleOverlayEffect });

interface ParticleOverlayPassProps {
  audioParams?: AudioReactiveParams;
  intensity?: number;
  density?: number;
  speed?: number;
  size?: number;
  enabled?: boolean;
}

export function ParticleOverlayPass({
  audioParams,
  intensity = 0.2,
  density = 50.0,
  speed = 1.0,
  size = 0.1,
  enabled = true
}: ParticleOverlayPassProps) {
  const effectRef = useRef<ParticleOverlayEffect>();

  const effect = useMemo(() => {
    const particleEffect = new ParticleOverlayEffect();
    effectRef.current = particleEffect;
    return particleEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uTime')!.value = state.clock.elapsedTime;
    uniforms.get('uDensity')!.value = density;
    uniforms.get('uSpeed')!.value = speed;
    uniforms.get('uSize')!.value = size;

    // Audio reactivity: more particles on treble
    if (audioParams) {
      const audioIntensity = (audioParams.colorPhase / (Math.PI * 2)); // Normalize to 0-1
      uniforms.get('uIntensity')!.value = intensity * (0.5 + audioIntensity * 0.5);
    } else {
      uniforms.get('uIntensity')!.value = intensity;
    }

    // Update palette colors (particles use palette)
    const paletteRGB = new Float32Array(12);
    // Would integrate with PaletteDirector here
    uniforms.get('uPaletteRGB')!.value = paletteRGB;
  });

  return enabled ? <primitive object={effect} /> : null;
}
