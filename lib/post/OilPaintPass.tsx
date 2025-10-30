'use client';

/**
 * OIL PAINT EFFECT - Kuwahara Filter
 *
 * Creates painterly, oil-painting-like appearance.
 * Uses Kuwahara filter to preserve edges while smoothing regions.
 *
 * Performance: ~6-8ms GPU time (expensive, high-tier only)
 * Use: Optional artistic effect for ultra tier
 */

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const oilPaintShader = `
  uniform float uRadius;
  uniform float uIntensity;
  uniform vec2 uResolution;

  // Kuwahara filter - finds region with lowest variance
  vec4 kuwahara(vec2 uv, float radius) {
    vec2 texelSize = 1.0 / uResolution;

    // Sample 4 quadrants around pixel
    vec3 meanNW = vec3(0.0);
    vec3 meanNE = vec3(0.0);
    vec3 meanSW = vec3(0.0);
    vec3 meanSE = vec3(0.0);

    vec3 varNW = vec3(0.0);
    vec3 varNE = vec3(0.0);
    vec3 varSW = vec3(0.0);
    vec3 varSE = vec3(0.0);

    int samples = 0;

    // Sample in each quadrant
    for (float x = -radius; x <= 0.0; x += 1.0) {
      for (float y = -radius; y <= 0.0; y += 1.0) {
        vec2 offset = vec2(x, y) * texelSize;
        vec3 color = texture2D(inputBuffer, uv + offset).rgb;

        meanNW += color;
        varNW += color * color;
        samples++;
      }
    }

    meanNW /= float(samples);
    varNW = abs(varNW / float(samples) - meanNW * meanNW);

    samples = 0;
    for (float x = 0.0; x <= radius; x += 1.0) {
      for (float y = -radius; y <= 0.0; y += 1.0) {
        vec2 offset = vec2(x, y) * texelSize;
        vec3 color = texture2D(inputBuffer, uv + offset).rgb;

        meanNE += color;
        varNE += color * color;
        samples++;
      }
    }

    meanNE /= float(samples);
    varNE = abs(varNE / float(samples) - meanNE * meanNE);

    samples = 0;
    for (float x = -radius; x <= 0.0; x += 1.0) {
      for (float y = 0.0; y <= radius; y += 1.0) {
        vec2 offset = vec2(x, y) * texelSize;
        vec3 color = texture2D(inputBuffer, uv + offset).rgb;

        meanSW += color;
        varSW += color * color;
        samples++;
      }
    }

    meanSW /= float(samples);
    varSW = abs(varSW / float(samples) - meanSW * meanSW);

    samples = 0;
    for (float x = 0.0; x <= radius; x += 1.0) {
      for (float y = 0.0; y <= radius; y += 1.0) {
        vec2 offset = vec2(x, y) * texelSize;
        vec3 color = texture2D(inputBuffer, uv + offset).rgb;

        meanSE += color;
        varSE += color * color;
        samples++;
      }
    }

    meanSE /= float(samples);
    varSE = abs(varSE / float(samples) - meanSE * meanSE);

    // Calculate variance (sum of RGB variances)
    float varianceNW = dot(varNW, vec3(1.0));
    float varianceNE = dot(varNE, vec3(1.0));
    float varianceSW = dot(varSW, vec3(1.0));
    float varianceSE = dot(varSE, vec3(1.0));

    // Find quadrant with minimum variance
    float minVar = min(min(varianceNW, varianceNE), min(varianceSW, varianceSE));

    vec3 finalColor = meanNW;
    if (minVar == varianceNE) finalColor = meanNE;
    else if (minVar == varianceSW) finalColor = meanSW;
    else if (minVar == varianceSE) finalColor = meanSE;

    return vec4(finalColor, 1.0);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 oilPainted = kuwahara(uv, uRadius);

    // Blend with original based on intensity
    outputColor = mix(inputColor, oilPainted, uIntensity);
  }
`;

class OilPaintEffect extends Effect {
  constructor() {
    super('OilPaintEffect', oilPaintShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uRadius', new THREE.Uniform(3.0)],
        ['uIntensity', new THREE.Uniform(0.8)],
        ['uResolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
      ])
    });
  }
}

extend({ OilPaintEffect });

interface OilPaintPassProps {
  radius?: number; // Filter radius (2-5, larger = more painterly)
  intensity?: number; // Blend amount (0-1)
  enabled?: boolean;
}

export function OilPaintPass({
  radius = 3.0,
  intensity = 0.8,
  enabled = true
}: OilPaintPassProps) {
  const effectRef = useRef<OilPaintEffect>();

  const effect = useMemo(() => {
    const oilEffect = new OilPaintEffect();
    effectRef.current = oilEffect;
    return oilEffect;
  }, []);

  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    uniforms.get('uRadius')!.value = radius;
    uniforms.get('uIntensity')!.value = intensity;

    // Update resolution
    const size = state.size;
    uniforms.get('uResolution')!.value = new THREE.Vector2(size.width, size.height);
  });

  return enabled ? <primitive object={effect} /> : null;
}

/**
 * Oil paint presets
 */
export const OIL_PAINT_PRESETS = {
  subtle: { radius: 2, intensity: 0.5 },
  moderate: { radius: 3, intensity: 0.7 },
  intense: { radius: 4, intensity: 0.9 },
};
