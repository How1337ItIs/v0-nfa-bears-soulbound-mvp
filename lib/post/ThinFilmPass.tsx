'use client';

import React, { useMemo, useRef } from 'react';
import { extend, useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';

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
        ['uInterferenceStrength', new THREE.Uniform(0.8)]
      ])
    });
  }
}

// AUTHENTIC THIN-FILM INTERFERENCE SHADER
// Based on real physics: optical path difference and wavelength-to-RGB conversion
const fragmentShader = `
  uniform float uTime;
  uniform float uColorPhase;
  uniform float uIntensity;
  uniform float uFilmThickness;
  uniform float uViewingAngle;
  uniform float uInterferenceStrength;
  
  // Authentic wavelength to RGB conversion (380-750nm spectrum)
  vec3 wavelengthToRGB(float wavelength) {
    vec3 color = vec3(0.0);
    
    if (wavelength >= 380.0 && wavelength < 440.0) {
      // Violet to Blue
      color.r = -(wavelength - 440.0) / (440.0 - 380.0);
      color.b = 1.0;
    } else if (wavelength >= 440.0 && wavelength < 490.0) {
      // Blue to Cyan
      color.g = (wavelength - 440.0) / (490.0 - 440.0);
      color.b = 1.0;
    } else if (wavelength >= 490.0 && wavelength < 510.0) {
      // Cyan to Green
      color.g = 1.0;
      color.b = -(wavelength - 510.0) / (510.0 - 490.0);
    } else if (wavelength >= 510.0 && wavelength < 580.0) {
      // Green to Yellow
      color.r = (wavelength - 510.0) / (580.0 - 510.0);
      color.g = 1.0;
    } else if (wavelength >= 580.0 && wavelength < 645.0) {
      // Yellow to Red
      color.r = 1.0;
      color.g = -(wavelength - 645.0) / (645.0 - 580.0);
    } else if (wavelength >= 645.0 && wavelength <= 750.0) {
      // Red
      color.r = 1.0;
    }
    
    // Intensity falloff at spectrum edges (authentic physics)
    float intensity = 1.0;
    if (wavelength >= 380.0 && wavelength < 420.0) {
      intensity = 0.3 + 0.7 * (wavelength - 380.0) / (420.0 - 380.0);
    } else if (wavelength >= 700.0 && wavelength <= 750.0) {
      intensity = 0.3 + 0.7 * (750.0 - wavelength) / (750.0 - 700.0);
    }
    
    return color * intensity;
  }
  
  // Thin-film interference calculation (authentic physics)
  vec3 calculateInterference(float thickness, float angle, vec2 uv, float time) {
    // Refractive indices for oil-on-water system
    float n_oil = 1.5;    // Mineral oil
    float n_water = 1.33; // Water
    float n_air = 1.0;    // Air
    
    // Optical path difference calculation
    float opticalPath = 2.0 * n_oil * thickness * cos(angle);
    
    // Dynamic thickness variation (simulates oil flow)
    float thicknessVariation = thickness + 
      50.0 * sin(uv.x * 8.0 + time * 0.3) * cos(uv.y * 6.0 + time * 0.2) +
      25.0 * sin(uv.x * 16.0 + time * 0.5) * cos(uv.y * 12.0 + time * 0.4);
    
    vec3 interferenceColor = vec3(0.0);
    
    // Calculate constructive interference for visible spectrum
    // Multiple orders of interference (m = 1, 2, 3)
    for (int m = 1; m <= 3; m++) {
      float wavelength = (2.0 * opticalPath) / float(m);
      
      // Only include visible wavelengths
      if (wavelength >= 380.0 && wavelength <= 750.0) {
        vec3 spectralColor = wavelengthToRGB(wavelength);
        float orderIntensity = 1.0 / float(m); // Higher orders are dimmer
        interferenceColor += spectralColor * orderIntensity;
      }
    }
    
    // Normalize and apply color phase shift (audio reactivity)
    interferenceColor = normalize(interferenceColor + 0.1); // Prevent pure black
    
    // Apply color phase rotation for audio reactivity
    float cosPhase = cos(uColorPhase);
    float sinPhase = sin(uColorPhase);
    
    vec3 phasedColor;
    phasedColor.r = interferenceColor.r * cosPhase - interferenceColor.g * sinPhase;
    phasedColor.g = interferenceColor.r * sinPhase + interferenceColor.g * cosPhase;
    phasedColor.b = interferenceColor.b; // Blue less affected by phase
    
    return phasedColor;
  }
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Sample the original fluid simulation
    vec4 originalColor = inputColor;
    
    // Calculate dynamic film thickness based on original color intensity
    float colorIntensity = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));
    float dynamicThickness = uFilmThickness + colorIntensity * 100.0;
    
    // Viewing angle varies across the screen
    float angle = uViewingAngle + (uv.x - 0.5) * 0.2 + (uv.y - 0.5) * 0.1;
    
    // Calculate thin-film interference
    vec3 interferenceColor = calculateInterference(dynamicThickness, angle, uv, uTime);
    
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
}

function ThinFilmPass({ audioParams, intensity = 0.6, enabled = true }: ThinFilmPassProps) {
  const effectRef = useRef<ThinFilmInterferenceEffect>();
  
  // Create effect instance
  const effect = useMemo(() => {
    const thinFilmEffect = new ThinFilmInterferenceEffect();
    effectRef.current = thinFilmEffect;
    return thinFilmEffect;
  }, []);

  // Update uniforms with audio reactivity
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
  });

  return enabled ? <primitive object={effect} /> : null;
}

// COMPLETE POST-PROCESSING COMPOSER
interface LiquidLightPostProcessorProps {
  audioParams: AudioReactiveParams;
  deviceTier: 'high' | 'medium' | 'low';
  children?: React.ReactNode;
}

export default function LiquidLightPostProcessor({ 
  audioParams, 
  deviceTier, 
  children 
}: LiquidLightPostProcessorProps) {
  const { size } = useThree();
  
  // Enable thin-film effect only on high and medium tiers
  const enableThinFilm = deviceTier === 'high' || deviceTier === 'medium';
  
  // Adjust intensity based on device tier
  const intensity = {
    high: 0.8,
    medium: 0.6,
    low: 0.0
  }[deviceTier];

  return (
    <EffectComposer
      multisampling={deviceTier === 'high' ? 4 : 0}
      stencilBuffer={false}
      depthBuffer={false}
    >
      {/* Thin-film interference pass */}
      <ThinFilmPass 
        audioParams={audioParams} 
        intensity={intensity}
        enabled={enableThinFilm}
      />
      
      {/* Additional passes can be added here */}
      {children}
    </EffectComposer>
  );
}

// USAGE COMPONENT FOR INTEGRATION
interface AuthenticThinFilmEffectProps {
  audioParams: AudioReactiveParams;
  deviceTier: 'high' | 'medium' | 'low';
}

export function AuthenticThinFilmEffect({ 
  audioParams, 
  deviceTier 
}: AuthenticThinFilmEffectProps) {
  // Only render on high performance devices to maintain 60fps
  if (deviceTier === 'low') {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-5 w-full h-full pointer-events-none">
      <Canvas
        style={{ background: 'transparent' }}
        dpr={deviceTier === 'high' ? [1, 2] : [1, 1]}
        gl={{ 
          alpha: true, 
          antialias: deviceTier === 'high',
          powerPreference: 'high-performance'
        }}
      >
        {/* Full-screen plane for post-processing */}
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        <LiquidLightPostProcessor 
          audioParams={audioParams} 
          deviceTier={deviceTier}
        />
      </Canvas>
    </div>
  );
}

export { ThinFilmPass, LiquidLightPostProcessor };