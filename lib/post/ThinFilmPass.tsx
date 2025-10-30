'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { extend, useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';
import { PaletteDirector } from '@/lib/palette';
import { THIN_FILM_QUALITY_PRESETS, getRecommendedQuality, type ThinFilmQuality } from './thinFilmQualityPresets';

// AUTHENTIC THIN-FILM INTERFERENCE POST-PROCESSING
// Recreates oil-on-water iridescence using real physics calculations

class ThinFilmInterferenceEffect extends Effect {
  constructor() {
    super('ThinFilmInterferenceEffect', fragmentShader, {
      blendFunction: BlendFunction.SCREEN,
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uColorPhase', new THREE.Uniform(0)],
        ['uIntensity', new THREE.Uniform(0.6)],
        ['uFilmThickness', new THREE.Uniform(200.0)],
        ['uViewingAngle', new THREE.Uniform(0.5)],
        ['uInterferenceStrength', new THREE.Uniform(0.8)],
        // Palette RGB colors (4 colors from PaletteDirector)
        ['uPaletteRGB', new THREE.Uniform(new THREE.Vector4Array([
          0.8, 0.2, 0.3,  // Color 1 (default magenta-ish)
          0.2, 0.7, 0.8,  // Color 2 (default cyan-ish)
          0.9, 0.8, 0.3,  // Color 3 (default yellow-ish)
          0.9, 0.4, 0.2   // Color 4 (default orange-ish)
        ]))],
        // Light direction for physically accurate phase shifts
        ['uLightDir', new THREE.Uniform(new THREE.Vector3(0.5, 0.8, 0.3))],
        // Index of refraction
        ['uIOR', new THREE.Uniform(1.5)],
        // Quality control: interference orders (1-4)
        ['uInterferenceOrders', new THREE.Uniform(2)]
      ])
    });
  }
}

// AUTHENTIC THIN-FILM INTERFERENCE SHADER
// Based on real physics: optical path difference and wavelength-to-RGB conversion
// OPTIMIZED FOR MOBILE: Branchless math, reduced texture lookups, efficient calculations
const fragmentShader = `
  uniform float uTime;
  uniform float uColorPhase;
  uniform float uIntensity;
  uniform float uFilmThickness;
  uniform float uViewingAngle;
  uniform float uInterferenceStrength;
  uniform float uPaletteRGB[12]; // 4 colors × 3 channels (flattened)
  uniform vec3 uLightDir;
  uniform float uIOR;
  uniform int uInterferenceOrders; // Quality setting: 1-4 orders
  
  // OPTIMIZED: Branchless wavelength to RGB conversion (380-750nm spectrum)
  // Uses smooth interpolation instead of if-else chains for better mobile performance
  vec3 wavelengthToRGB(float wavelength) {
    // Normalize wavelength to 0-1 range
    float t = clamp((wavelength - 380.0) / 370.0, 0.0, 1.0);

    // Piecewise polynomial approximation (fewer branches)
    vec3 color;
    float t2 = t * 6.0; // Split into 6 regions

    // Use step functions for smooth, branchless transitions
    color.r = smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.4, 0.6, t)) +
              smoothstep(0.6, 0.8, t);
    color.g = smoothstep(0.15, 0.35, t) * (1.0 - smoothstep(0.75, 0.95, t));
    color.b = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.35, 0.5, t));

    // Intensity falloff at spectrum edges (branchless)
    float edgeFalloff = smoothstep(380.0, 420.0, wavelength) *
                        (1.0 - smoothstep(700.0, 750.0, wavelength));
    float intensity = 0.3 + 0.7 * edgeFalloff;

    return color * intensity;
  }
  
  // OPTIMIZED: Thin-film interference with palette integration (authentic physics)
  vec3 calculateInterference(float thickness, float angle, vec2 uv, float time, vec3 viewDir) {
    // Use dynamic IOR from uniform
    float n_film = uIOR;    // Film (oil)
    float n_substrate = 1.33; // Substrate (water)

    // Optical path difference calculation with viewing angle
    float cosTheta = abs(dot(normalize(viewDir), uLightDir));
    float opticalPath = 2.0 * n_film * thickness * cosTheta;

    // Dynamic thickness variation (simulates oil flow) - optimized
    float flowPattern = sin(uv.x * 8.0 + time * 0.3) * cos(uv.y * 6.0 + time * 0.2);
    float thicknessVariation = thickness + 40.0 * flowPattern;

    vec3 interferenceColor = vec3(0.0);

    // VARIABLE QUALITY: Calculate interference for 1-4 orders (quality-dependent)
    // Unrolled loop for compatibility (some GPUs don't support variable loops)

    // Order 1 (always)
    float wavelength1 = (2.0 * opticalPath) / 1.0;
    vec3 spectral1 = wavelengthToRGB(clamp(wavelength1, 380.0, 750.0));
    interferenceColor += spectral1;

    // Order 2 (if quality >= 2)
    if (uInterferenceOrders >= 2) {
      float wavelength2 = (2.0 * opticalPath) / 2.0;
      vec3 spectral2 = wavelengthToRGB(clamp(wavelength2, 380.0, 750.0));
      interferenceColor += spectral2 * 0.5;
    }

    // Order 3 (if quality >= 3)
    if (uInterferenceOrders >= 3) {
      float wavelength3 = (2.0 * opticalPath) / 3.0;
      vec3 spectral3 = wavelengthToRGB(clamp(wavelength3, 380.0, 750.0));
      interferenceColor += spectral3 * 0.33;
    }

    // Order 4 (if quality == 4)
    if (uInterferenceOrders >= 4) {
      float wavelength4 = (2.0 * opticalPath) / 4.0;
      vec3 spectral4 = wavelengthToRGB(clamp(wavelength4, 380.0, 750.0));
      interferenceColor += spectral4 * 0.25;
    }

    // Normalize
    interferenceColor = normalize(interferenceColor + 0.1);

    // PALETTE INTEGRATION: Blend with palette colors based on phase
    vec3 paletteColor1 = vec3(uPaletteRGB[0], uPaletteRGB[1], uPaletteRGB[2]);
    vec3 paletteColor2 = vec3(uPaletteRGB[3], uPaletteRGB[4], uPaletteRGB[5]);
    vec3 paletteColor3 = vec3(uPaletteRGB[6], uPaletteRGB[7], uPaletteRGB[8]);

    // Blend palette colors with interference pattern
    float phaseNorm = fract(uColorPhase / 6.28318); // Normalize to 0-1
    vec3 paletteBlend = mix(
      mix(paletteColor1, paletteColor2, smoothstep(0.0, 0.5, phaseNorm)),
      paletteColor3,
      smoothstep(0.5, 1.0, phaseNorm)
    );

    // Combine interference with palette
    vec3 finalColor = mix(interferenceColor, paletteBlend, 0.3);

    return finalColor;
  }
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Sample the original fluid simulation
    vec4 originalColor = inputColor;

    // Calculate dynamic film thickness based on original color intensity
    float colorIntensity = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));
    float dynamicThickness = uFilmThickness + colorIntensity * 80.0;

    // Calculate view direction from screen-space UV
    // Center of screen looks straight at surface, edges are more oblique
    vec3 viewDir = normalize(vec3(
      (uv.x - 0.5) * 0.4,
      (uv.y - 0.5) * 0.3,
      1.0
    ));

    // Viewing angle parameter
    float angle = uViewingAngle;

    // Calculate thin-film interference with physical light direction
    vec3 interferenceColor = calculateInterference(
      dynamicThickness,
      angle,
      uv,
      uTime,
      viewDir
    );

    // Blend interference with original fluid colors
    vec3 finalColor = mix(
      originalColor.rgb,
      interferenceColor,
      uInterferenceStrength * uIntensity
    );

    // Apply overall intensity (audio reactive)
    finalColor *= (0.5 + uIntensity * 0.5);

    // Preserve original alpha
    outputColor = vec4(finalColor, originalColor.a);
  }
`;

// Register the custom effect
extend({ ThinFilmInterferenceEffect });

// THIN FILM POST-PROCESSING COMPONENT
interface ThinFilmPassProps {
  audioParams: AudioReactiveParams;
  intensity?: number;
  enabled?: boolean;
  paletteId?: string;
  quality?: ThinFilmQuality;
  blendMode?: 'screen' | 'overlay' | 'normal';
}

function ThinFilmPass({
  audioParams,
  intensity = 0.6,
  enabled = true,
  paletteId = 'classic-60s',
  quality = 'mobile',
  blendMode = 'screen'
}: ThinFilmPassProps) {
  const effectRef = useRef<ThinFilmInterferenceEffect>();
  const paletteArrayRef = useRef<Float32Array>(new Float32Array(12));
  const lightVecRef = useRef<THREE.Vector3>(new THREE.Vector3(0.5, 0.8, 0.3));

  // Get quality preset
  const qualityPreset = THIN_FILM_QUALITY_PRESETS[quality];

  // Create effect instance
  const effect = useMemo(() => {
    const thinFilmEffect = new ThinFilmInterferenceEffect();
    effectRef.current = thinFilmEffect;
    return thinFilmEffect;
  }, []);

  // Update uniforms with audio reactivity and palette integration
  useFrame((state) => {
    if (!effectRef.current) return;

    const uniforms = effectRef.current.uniforms;

    // Time progression
    uniforms.get('uTime')!.value = state.clock.elapsedTime * 0.1;

    // Audio-reactive parameters
    uniforms.get('uColorPhase')!.value = audioParams.colorPhase;
    uniforms.get('uIntensity')!.value = intensity * audioParams.globalIntensity;

    // Dynamic film thickness (bass-reactive)
    const baseThickness = 200;
    const thicknessVariation = (audioParams.splatForce - 8) / 15 * 100; // 0-100 range
    uniforms.get('uFilmThickness')!.value = baseThickness + thicknessVariation;

    // Viewing angle (mids-reactive)
    const baseAngle = 0.5;
    const angleVariation = (audioParams.thermalRate - 2) / 6 * 0.3; // 0-0.3 range
    uniforms.get('uViewingAngle')!.value = baseAngle + angleVariation;

    // Interference strength remains constant for authenticity
    uniforms.get('uInterferenceStrength')!.value = 0.6;

    // QUALITY CONTROL: Set interference orders based on quality preset
    uniforms.get('uInterferenceOrders')!.value = qualityPreset.interferenceOrders;

    // PALETTE INTEGRATION: Get current palette colors (reuse array)
    const paletteColorsRGB = PaletteDirector.getCurrentColorsRGB();
    const flat = paletteArrayRef.current;
    for (let i = 0; i < 4 && i < paletteColorsRGB.length; i++) {
      const c = paletteColorsRGB[i];
      flat[i * 3] = c[0];
      flat[i * 3 + 1] = c[1];
      flat[i * 3 + 2] = c[2];
    }
    uniforms.get('uPaletteRGB')!.value = flat;

    // Light direction (slowly rotating for dynamic effect)
    const lightRotation = state.clock.elapsedTime * 0.05;
    const v = lightVecRef.current;
    v.set(Math.cos(lightRotation) * 0.5, 0.8, Math.sin(lightRotation) * 0.3);
    uniforms.get('uLightDir')!.value = v;

    // Blend mode mapping
    const bm = {
      screen: BlendFunction.SCREEN,
      overlay: BlendFunction.OVERLAY,
      normal: BlendFunction.NORMAL,
    }[blendMode] ?? BlendFunction.SCREEN;
    // @ts-ignore postprocessing Effect has blendMode property
    if (effectRef.current.blendMode && effectRef.current.blendMode.blendFunction !== bm) {
      // @ts-ignore
      effectRef.current.blendMode.blendFunction = bm;
    }
  });

  return enabled ? <primitive object={effect} /> : null;
}

// COMPLETE POST-PROCESSING COMPOSER
interface LiquidLightPostProcessorProps {
  audioParams: AudioReactiveParams;
  deviceTier: 'high' | 'medium' | 'low' | 'ultra';
  paletteId?: string;
  quality?: ThinFilmQuality;
  blendMode?: 'screen' | 'overlay' | 'normal';
  children?: React.ReactNode;
}

export default function LiquidLightPostProcessor({
  audioParams,
  deviceTier,
  paletteId = 'classic-60s',
  quality,
  blendMode,
  children
}: LiquidLightPostProcessorProps) {
  const { size } = useThree();

  // Auto-determine quality from device tier if not specified
  const effectiveQuality = quality || (
    deviceTier === 'ultra' ? 'ultra' :
    deviceTier === 'high' ? 'desktop' :
    deviceTier === 'medium' ? 'mobile' : 'emergency'
  );

  const qualityPreset = THIN_FILM_QUALITY_PRESETS[effectiveQuality];

  // Enable thin-film effect only on high and medium tiers
  const enableThinFilm = deviceTier !== 'low';

  // Adjust intensity based on device tier
  const intensity = {
    ultra: 0.9,
    high: 0.8,
    medium: 0.6,
    low: 0.0
  }[deviceTier];

  return (
    <EffectComposer
      multisampling={qualityPreset.multisampling}
      stencilBuffer={false}
      depthBuffer={false}
    >
      {/* Thin-film interference pass */}
      <ThinFilmPass
        audioParams={audioParams}
        intensity={intensity}
        enabled={enableThinFilm}
        paletteId={paletteId}
        quality={effectiveQuality}
        blendMode={blendMode}
      />

      {/* Additional passes can be added here */}
      {children}
    </EffectComposer>
  );
}

// USAGE COMPONENT FOR INTEGRATION
// Wrapper component ready for orchestrator mounting
interface AuthenticThinFilmEffectProps {
  audioParams: AudioReactiveParams;
  deviceTier: 'high' | 'medium' | 'low' | 'ultra';
  paletteId?: string;
  enabled?: boolean;
  intensity?: number;
  quality?: ThinFilmQuality;
  currentFPS?: number; // For adaptive quality
  batteryLevel?: number | null; // For performance scaling
  blendMode?: 'screen' | 'overlay' | 'normal';
}

export function AuthenticThinFilmEffect({
  audioParams,
  deviceTier,
  paletteId = 'classic-60s',
  enabled = true,
  intensity,
  quality,
  currentFPS = 60,
  batteryLevel = null,
  blendMode
}: AuthenticThinFilmEffectProps) {
  // SAFETY: Auto-pause when tab is hidden (visibility API)
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ADAPTIVE QUALITY: Determine quality based on performance
  const effectiveQuality = quality || getRecommendedQuality(
    deviceTier,
    currentFPS,
    batteryLevel
  );

  const qualityPreset = THIN_FILM_QUALITY_PRESETS[effectiveQuality];

  // Only render on high performance devices and when tab is visible
  if (deviceTier === 'low' || !enabled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-5 w-full h-full pointer-events-none" data-testid="thin-film-effect">
      <Canvas
        style={{ background: 'transparent' }}
        dpr={qualityPreset.dpr}
        gl={{
          alpha: true,
          antialias: qualityPreset.multisampling > 0,
          powerPreference: 'high-performance'
        }}
        frameloop={qualityPreset.updateRate === 30 ? 'demand' : 'always'}
      >
        {/* Full-screen plane for post-processing */}
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        <LiquidLightPostProcessor
          audioParams={audioParams}
          deviceTier={deviceTier}
          paletteId={paletteId}
          quality={effectiveQuality}
          blendMode={blendMode}
        />
      </Canvas>
    </div>
  );
}

export { ThinFilmPass, LiquidLightPostProcessor };
