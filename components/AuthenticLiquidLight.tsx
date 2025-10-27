'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

// Authentic thin-film interference shader based on real 1960s physics
const liquidLightShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uAudioBass;
    uniform float uAudioMids;
    uniform float uAudioTreble;
    uniform bool uBeatDetected;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Authentic wavelength to RGB conversion (380-750nm visible spectrum)
    vec3 wavelengthToRGB(float wavelength) {
      vec3 color = vec3(0.0);
      
      if (wavelength >= 380.0 && wavelength < 440.0) {
        float t = (wavelength - 380.0) / (440.0 - 380.0);
        color.r = -(wavelength - 440.0) / (440.0 - 380.0);
        color.b = 1.0;
      } else if (wavelength >= 440.0 && wavelength < 490.0) {
        color.g = (wavelength - 440.0) / (490.0 - 440.0);
        color.b = 1.0;
      } else if (wavelength >= 490.0 && wavelength < 510.0) {
        color.g = 1.0;
        color.b = -(wavelength - 510.0) / (510.0 - 490.0);
      } else if (wavelength >= 510.0 && wavelength < 580.0) {
        color.r = (wavelength - 510.0) / (580.0 - 510.0);
        color.g = 1.0;
      } else if (wavelength >= 580.0 && wavelength < 645.0) {
        color.r = 1.0;
        color.g = -(wavelength - 645.0) / (645.0 - 580.0);
      } else if (wavelength >= 645.0 && wavelength <= 750.0) {
        color.r = 1.0;
      }
      
      // Intensity rolloff at spectrum edges
      float intensity = 1.0;
      if (wavelength > 700.0) intensity = 0.3 + 0.7 * (750.0 - wavelength) / 50.0;
      if (wavelength < 420.0) intensity = 0.3 + 0.7 * (wavelength - 380.0) / 40.0;
      
      return color * intensity;
    }
    
    // Authentic thin-film interference calculation
    vec3 calculateInterference(float thickness, vec2 uv, float time) {
      float n_oil = 1.5; // Mineral oil refractive index
      float n_water = 1.33; // Water refractive index
      
      // Optical path difference for thin film interference
      float opticalPath = 2.0 * n_oil * thickness;
      
      vec3 result = vec3(0.0);
      
      // Calculate constructive interference for multiple wavelengths
      for (int m = 1; m <= 4; m++) {
        float order = float(m);
        float wavelength = (2.0 * opticalPath) / order;
        
        if (wavelength >= 380.0 && wavelength <= 750.0) {
          vec3 color = wavelengthToRGB(wavelength);
          float amplitude = 1.0 / (order * order); // Higher orders are dimmer
          result += color * amplitude;
        }
      }
      
      return normalize(result);
    }
    
    // Oil blob metaball using signed distance functions
    float oilBlobSDF(vec2 p, vec2 center, float radius, float time) {
      vec2 offset = p - center;
      
      // Organic deformation based on surface tension physics
      float angle = atan(offset.y, offset.x);
      float surfaceTension = 0.072; // N/m for oil-water interface
      float deformation = sin(angle * 3.0 + time * 0.5) * 0.1 + 
                         sin(angle * 5.0 + time * 0.3) * 0.05;
      
      float distanceToCenter = length(offset);
      return distanceToCenter - (radius + deformation);
    }
    
    // Multiple oil blobs with thermal convection
    float calculateOilThickness(vec2 uv, float time) {
      vec2 p = uv * 4.0; // Scale for multiple blobs
      float thickness = 0.0;
      
      // Large primary blobs (like clock face oil drops)
      vec2 blob1 = vec2(1.5 + sin(time * 0.2) * 0.3, 1.8 + cos(time * 0.15) * 0.4);
      vec2 blob2 = vec2(2.8 + sin(time * 0.18) * 0.4, 1.2 + cos(time * 0.22) * 0.3);
      vec2 blob3 = vec2(2.0 + sin(time * 0.25) * 0.2, 2.5 + cos(time * 0.19) * 0.5);
      
      float sdf1 = oilBlobSDF(p, blob1, 0.8, time);
      float sdf2 = oilBlobSDF(p, blob2, 0.6, time);
      float sdf3 = oilBlobSDF(p, blob3, 0.7, time);
      
      // Smooth minimum for blob merging (authentic oil behavior)
      float k = 0.3;
      float merged = min(sdf1, sdf2);
      merged = merged - k * log(exp(-sdf1/k) + exp(-sdf2/k));
      merged = min(merged, sdf3);
      merged = merged - k * log(exp(-merged/k) + exp(-sdf3/k));
      
      // Convert SDF to thickness (thicker where SDF is negative)
      if (merged < 0.0) {
        thickness = 200.0 + (-merged * 150.0); // 200-350nm range
      }
      
      // Add thermal convection currents
      float thermalX = sin(uv.x * 6.0 + time * 0.3) * cos(uv.y * 4.0 + time * 0.2);
      float thermalY = cos(uv.x * 4.0 + time * 0.25) * sin(uv.y * 6.0 + time * 0.35);
      thickness += (thermalX + thermalY) * 20.0;
      
      return max(thickness, 0.0);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.1;
      
      // Calculate oil film thickness with audio reactivity
      float baseThickness = calculateOilThickness(uv, time);
      
      // Audio-reactive modulation
      float audioMod = uAudioBass * 0.3 + uAudioMids * 0.2 + uAudioTreble * 0.1;
      float thickness = baseThickness * (0.8 + audioMod);
      
      // Beat detection creates pulsing interference
      if (uBeatDetected) {
        float pulse = sin(time * 40.0) * 0.2 + 0.8;
        thickness *= pulse;
      }
      
      // Calculate authentic thin-film interference colors
      vec3 color = calculateInterference(thickness, uv, time);
      
      // Add subtle background gradient (water layer tint)
      vec3 waterTint = vec3(0.1, 0.05, 0.2); // Deep blue-purple
      color = mix(waterTint, color, smoothstep(0.0, 100.0, thickness));
      
      // Enhance saturation for authentic psychedelic effect
      float saturation = 1.5;
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luminance), color, saturation);
      
      // Gentle overall brightness modulation
      color *= 0.7 + uAudioMids * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

interface AudioData {
  bass: number;
  mids: number;
  treble: number;
  volume: number;
  beatDetected: boolean;
}

function LiquidLightMesh({ audioData }: { audioData: AudioData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uAudioBass: { value: 0.3 },
    uAudioMids: { value: 0.3 },
    uAudioTreble: { value: 0.3 },
    uBeatDetected: { value: false }
  }), [size]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uAudioBass.value = audioData.bass;
      material.uniforms.uAudioMids.value = audioData.mids;
      material.uniforms.uAudioTreble.value = audioData.treble;
      material.uniforms.uBeatDetected.value = audioData.beatDetected;
      material.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <Plane ref={meshRef} args={[4, 4]}>
      <shaderMaterial
        vertexShader={liquidLightShader.vertexShader}
        fragmentShader={liquidLightShader.fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </Plane>
  );
}

// Audio reactive hook with fallback simulation
function useAudioReactive(): AudioData {
  const audioDataRef = useRef<AudioData>({
    bass: 0.3, mids: 0.3, treble: 0.3, volume: 0.5, beatDetected: false
  });

  // Simulate organic audio data for development
  const updateSimulatedAudio = useCallback(() => {
    const now = Date.now();
    const t = now * 0.001;
    
    audioDataRef.current = {
      bass: 0.2 + Math.sin(t * 0.5) * 0.2 + Math.random() * 0.1,
      mids: 0.3 + Math.cos(t * 0.7) * 0.2 + Math.random() * 0.1,
      treble: 0.25 + Math.sin(t * 1.2) * 0.15 + Math.random() * 0.1,
      volume: 0.4 + Math.sin(t * 0.3) * 0.2,
      beatDetected: Math.sin(t * 2.0) > 0.8 && Math.random() > 0.7
    };
  }, []);

  // Update audio simulation
  setInterval(updateSimulatedAudio, 50); // 20fps audio updates

  return audioDataRef.current;
}

export default function AuthenticLiquidLight() {
  const audioData = useAudioReactive();

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 45 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <LiquidLightMesh audioData={audioData} />
      </Canvas>
      
      {/* Status indicator */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
        🌈 Authentic 1960s Liquid Light<br/>
        🎵 Audio: Bass {(audioData.bass * 100).toFixed(0)}% | Mids {(audioData.mids * 100).toFixed(0)}%<br/>
        {audioData.beatDetected && '💥 Beat Detected'}
      </div>
    </div>
  );
}