'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioData } from '../lib/audio-reactive';
import WebGPUFluidSimulation from './WebGPUFluidSimulation';
import EnhancedWebGLFluidSimulation from './EnhancedWebGLFluidSimulation';
import KaleidoscopeMirrors from './KaleidoscopeMirrors';

interface UltimateFluidConfig {
  preferWebGPU: boolean;
  enableKaleidoscope: boolean;
  particleCount: number;
  audioReactive: boolean;
  gratefulDeadMode: boolean;
  performanceMode: 'ultra' | 'high' | 'medium' | 'low';
}

interface PerformanceProfile {
  webgl: {
    resolution: number;
    density: number;
    velocity: number;
    curlStrength: number;
    turbulence: number;
  };
  webgpu: {
    particleCount: number;
    workgroupSize: number;
  };
  kaleidoscope: {
    enabled: boolean;
    mirrorCount: number;
    opacity: number;
  };
}

export default function UltimateFluidSimulation({
  config = {},
  audioData
}: {
  config?: Partial<UltimateFluidConfig>;
  audioData?: AudioData;
}) {
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null);
  const [performanceProfile, setPerformanceProfile] = useState<PerformanceProfile | null>(null);
  const performanceRef = useRef({ frameCount: 0, lastTime: 0, fps: 60 });

  const defaultConfig: UltimateFluidConfig = {
    preferWebGPU: true,
    enableKaleidoscope: true,
    particleCount: 50000,
    audioReactive: true,
    gratefulDeadMode: true,
    performanceMode: 'high',
    ...config
  };

  // Performance profiles for different hardware capabilities
  const performanceProfiles: Record<string, PerformanceProfile> = {
    ultra: {
      webgl: {
        resolution: 512,
        density: 1.0,
        velocity: 0.8,
        curlStrength: 0.6,
        turbulence: 0.7
      },
      webgpu: {
        particleCount: 200000,
        workgroupSize: 128
      },
      kaleidoscope: {
        enabled: true,
        mirrorCount: 12,
        opacity: 0.4
      }
    },
    high: {
      webgl: {
        resolution: 256,
        density: 3.0,  // EXTREME visibility
        velocity: 2.5,  // Much faster movement
        curlStrength: 2.0,  // Intense curl effects
        turbulence: 2.5  // Maximum turbulence
      },
      webgpu: {
        particleCount: 100000,
        workgroupSize: 64
      },
      kaleidoscope: {
        enabled: true,
        mirrorCount: 8,
        opacity: 0.6
      }
    },
    medium: {
      webgl: {
        resolution: 128,
        density: 2.0,  // Much higher visibility
        velocity: 1.8,  // Faster movement
        curlStrength: 1.5,  // Strong curl effects
        turbulence: 2.0  // High turbulence
      },
      webgpu: {
        particleCount: 50000,
        workgroupSize: 64
      },
      kaleidoscope: {
        enabled: true,
        mirrorCount: 6,
        opacity: 0.2
      }
    },
    low: {
      webgl: {
        resolution: 64,
        density: 0.4,
        velocity: 0.3,
        curlStrength: 0.2,
        turbulence: 0.2
      },
      webgpu: {
        particleCount: 25000,
        workgroupSize: 32
      },
      kaleidoscope: {
        enabled: false,
        mirrorCount: 4,
        opacity: 0.1
      }
    }
  };

  // Detect WebGPU support
  useEffect(() => {
    const checkWebGPUSupport = async () => {
      if (!navigator.gpu) {
        setWebgpuSupported(false);
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter();
        setWebgpuSupported(!!adapter);
      } catch (error) {
        console.warn('WebGPU not available:', error);
        setWebgpuSupported(false);
      }
    };

    checkWebGPUSupport();
  }, []);

  // Set performance profile based on config and hardware
  useEffect(() => {
    if (webgpuSupported === null) return;

    let profile = defaultConfig.performanceMode;

    // Auto-detect performance needs based on hardware
    if (defaultConfig.performanceMode === 'high') {
      // Check if we're on mobile
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        profile = 'medium';
      }

      // Check GPU info if available
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // Basic heuristic for integrated vs dedicated GPU
          if (renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno')) {
            profile = 'medium';
          }
        }
      }
    }

    setPerformanceProfile(performanceProfiles[profile]);
  }, [webgpuSupported, defaultConfig.performanceMode]);

  // Performance monitoring
  useEffect(() => {
    const monitor = () => {
      const now = performance.now();
      performanceRef.current.frameCount++;
      
      if (now - performanceRef.current.lastTime >= 1000) {
        const fps = performanceRef.current.frameCount;
        performanceRef.current.fps = fps;
        performanceRef.current.frameCount = 0;
        performanceRef.current.lastTime = now;
        
        // Auto-adjust performance if FPS drops too low
        if (fps < 30 && performanceProfile && defaultConfig.performanceMode !== 'low') {
          console.warn(`Low FPS detected (${fps}), consider reducing performance settings`);
        }
      }
      
      requestAnimationFrame(monitor);
    };
    
    monitor();
  }, [performanceProfile, defaultConfig.performanceMode]);

  // Show loading state while detecting capabilities
  if (webgpuSupported === null || !performanceProfile) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
    );
  }

  // Choose rendering path based on capabilities and preferences
  const useWebGPU = webgpuSupported && defaultConfig.preferWebGPU;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      {/* Primary fluid simulation - Base layer z-0 */}
      {useWebGPU ? (
        <WebGPUFluidSimulation
          config={{
            particleCount: performanceProfile.webgpu.particleCount,
            workgroupSize: performanceProfile.webgpu.workgroupSize,
            kaleidoscopeMode: defaultConfig.enableKaleidoscope && performanceProfile.kaleidoscope.enabled,
            mirrorCount: performanceProfile.kaleidoscope.mirrorCount,
            colorIntensity: 1.0
          }}
          audioData={defaultConfig.audioReactive ? audioData : undefined}
        />
      ) : (
        <>
          {console.log('🔥 USING ENHANCED WEBGL FLUID SIMULATION with config:', {
            resolution: performanceProfile.webgl.resolution,
            density: performanceProfile.webgl.density,
            velocity: performanceProfile.webgl.velocity,
            curlStrength: performanceProfile.webgl.curlStrength,
            turbulence: performanceProfile.webgl.turbulence,
          })}
          <EnhancedWebGLFluidSimulation
            config={{
              resolution: performanceProfile.webgl.resolution,
              density: performanceProfile.webgl.density,
              velocity: performanceProfile.webgl.velocity,
              pressure: 0.9,
              viscosity: 0.05,
              colorIntensity: 5.0,  // EXTREME color visibility
              curlStrength: performanceProfile.webgl.curlStrength,
              turbulence: performanceProfile.webgl.turbulence,
              oilWaterEffect: 3.0,  // Maximum oil-water effects
              gratefulDeadMode: defaultConfig.gratefulDeadMode,
              audioReactive: defaultConfig.audioReactive,
              microphoneAccess: false
            }}
            audioData={defaultConfig.audioReactive ? audioData : undefined}
          />
        </>
      )}

      {/* Kaleidoscope mirror overlay */}
      {defaultConfig.enableKaleidoscope && performanceProfile.kaleidoscope.enabled && (
        <KaleidoscopeMirrors
          config={{
            mirrorCount: performanceProfile.kaleidoscope.mirrorCount,
            opacity: performanceProfile.kaleidoscope.opacity,
            audioReactive: defaultConfig.audioReactive,
            centerX: 50,
            centerY: 50,
            zoom: 1.0 + (audioData?.bass || 0) * 0.2
          }}
          audioData={defaultConfig.audioReactive ? audioData : undefined}
        >
          {/* The mirrors will reflect the fluid simulation */}
          <div className="absolute inset-0 opacity-50">
            {useWebGPU ? (
              <WebGPUFluidSimulation
                config={{
                  particleCount: Math.floor(performanceProfile.webgpu.particleCount * 0.3),
                  workgroupSize: performanceProfile.webgpu.workgroupSize,
                  kaleidoscopeMode: false, // Don't double-apply kaleidoscope
                  colorIntensity: 0.6
                }}
                audioData={defaultConfig.audioReactive ? audioData : undefined}
              />
            ) : (
              <EnhancedWebGLFluidSimulation
                config={{
                  resolution: Math.floor(performanceProfile.webgl.resolution * 0.5),
                  density: performanceProfile.webgl.density * 0.7,
                  velocity: performanceProfile.webgl.velocity * 0.8,
                  colorIntensity: 0.5,
                  curlStrength: performanceProfile.webgl.curlStrength * 0.6,
                  turbulence: performanceProfile.webgl.turbulence * 0.7,
                  gratefulDeadMode: defaultConfig.gratefulDeadMode,
                  audioReactive: defaultConfig.audioReactive
                }}
                audioData={defaultConfig.audioReactive ? audioData : undefined}
              />
            )}
          </div>
        </KaleidoscopeMirrors>
      )}

      {/* Performance indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/50 text-white text-xs p-2 rounded font-mono">
          <div>Engine: {useWebGPU ? 'WebGPU' : 'WebGL'}</div>
          <div>Profile: {defaultConfig.performanceMode}</div>
          <div>FPS: {performanceRef.current.fps}</div>
          {useWebGPU && <div>Particles: {performanceProfile.webgpu.particleCount.toLocaleString()}</div>}
          {defaultConfig.enableKaleidoscope && <div>Kaleidoscope: {performanceProfile.kaleidoscope.mirrorCount}x</div>}
          {audioData && (
            <div className="mt-2 space-y-1">
              <div>Audio: {audioData.volume > 0 ? '🎵' : '🔇'}</div>
              {audioData.beatDetected && <div>Beat: 🥁</div>}
            </div>
          )}
        </div>
      )}

      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#000011] via-[#000022] to-[#000011] -z-10" />
    </div>
  );
}

// Hook for external components to get performance info
export const useFluidPerformance = () => {
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkSupport = async () => {
      if (!navigator.gpu) {
        setWebgpuSupported(false);
        return;
      }
      
      try {
        const adapter = await navigator.gpu.requestAdapter();
        setWebgpuSupported(!!adapter);
      } catch {
        setWebgpuSupported(false);
      }
    };
    
    checkSupport();
  }, []);
  
  return { webgpuSupported };
};