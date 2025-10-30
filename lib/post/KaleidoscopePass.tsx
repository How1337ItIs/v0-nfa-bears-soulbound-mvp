'use client';

/**
 * KALEIDOSCOPE MODE - Radial symmetry effect
 *
 * Creates mirrored symmetry for intense psychedelic visuals.
 * Based on real kaleidoscope optics with multiple reflection planes.
 *
 * Performance: ~3ms GPU time
 * Use: TRIP MODE ONLY (high intensity experiences)
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

const kaleidoscopeShader = `
  uniform float uTime;
  uniform int uSections; // Number of symmetry sections (4, 6, 8, 12)
  uniform float uRotation; // Rotation angle (radians)
  uniform float uZoom; // Zoom factor (0.5-2.0)
  uniform float uAudioReactive;

  const float PI = 3.14159265359;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Center coordinates
    vec2 centered = uv - 0.5;

    // Apply zoom (audio-reactive)
    float zoomFactor = uZoom * (0.8 + uAudioReactive * 0.4);
    centered *= zoomFactor;

    // Convert to polar coordinates
    float angle = atan(centered.y, centered.x);
    float radius = length(centered);

    // Apply rotation
    angle += uRotation + uTime * 0.2;

    // Calculate section angle
    float sectionAngle = 2.0 * PI / float(uSections);

    // Mirror across sections
    float mirroredAngle = mod(angle, sectionAngle);

    // Create mirror flip within section for kaleidoscope effect
    if (mod(floor(angle / sectionAngle), 2.0) > 0.5) {
      mirroredAngle = sectionAngle - mirroredAngle;
    }

    // Convert back to Cartesian
    vec2 kaleidoUV = vec2(
      cos(mirroredAngle) * radius,
      sin(mirroredAngle) * radius
    ) + 0.5;

    // Clamp UV to valid range
    kaleidoUV = clamp(kaleidoUV, 0.0, 1.0);

    // Sample with kaleidoscope coordinates
    vec4 kaleidoColor = texture2D(inputBuffer, kaleidoUV);

    // Add subtle color shift based on section
    float sectionIndex = floor(angle / sectionAngle);
    float colorShift = sectionIndex / float(uSections);

    // Apply color shift (hue rotation)
    vec3 shiftedColor = kaleidoColor.rgb;
    // Simple hue shift approximation
    float shift = colorShift * 0.1;
    shiftedColor = vec3(
      kaleidoColor.r * (1.0 - shift) + kaleidoColor.g * shift,
      kaleidoColor.g * (1.0 - shift) + kaleidoColor.b * shift,
      kaleidoColor.b * (1.0 - shift) + kaleidoColor.r * shift
    );

    outputColor = vec4(shiftedColor, kaleidoColor.a);
  }
`;

class KaleidoscopeEffect extends Effect {
  constructor() {
    super('KaleidoscopeEffect', kaleidoscopeShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uSections', new THREE.Uniform(6)],
        ['uRotation', new THREE.Uniform(0)],
        ['uZoom', new THREE.Uniform(1.0)],
        ['uAudioReactive', new THREE.Uniform(0.5)],
      ])
    });
  }
}

extend({ KaleidoscopeEffect });

interface KaleidoscopePassProps {
  audioParams: AudioReactiveParams;
  sections?: number; // 4, 6, 8, 12
  zoom?: number;
  enabled?: boolean;
}

export function KaleidoscopePass({
  audioParams,
  sections = 6,
  zoom = 1.0,
  enabled = true
}: KaleidoscopePassProps) {
  const effectRef = useRef<KaleidoscopeEffect>();

  const effect = useMemo(() => {
    const kaleidoEffect = new KaleidoscopeEffect();
    effectRef.current = kaleidoEffect;
    return kaleidoEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uTime')!.value = state.clock.elapsedTime;
    uniforms.get('uSections')!.value = sections;
    uniforms.get('uZoom')!.value = zoom;

    // Rotation based on color phase (treble-driven)
    uniforms.get('uRotation')!.value = audioParams.colorPhase;

    // Audio reactivity (bass-driven zoom)
    const audioReactive = (audioParams.splatForce - 8) / 15;
    uniforms.get('uAudioReactive')!.value = audioReactive;
  });

  return enabled ? <primitive object={effect} /> : null;
}
