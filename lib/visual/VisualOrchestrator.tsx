/**
 * VISUAL ORCHESTRATOR
 * 
 * Central coordination system for all visual layers
 * Manages WebGL fluid, CSS fallback, thin-film effects, and thermal currents
 * 
 * Based on Master Liquid Light Integration Plan (Week 2)
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VisualPolicy, useVisualPolicy } from './VisualPolicy';
import { DeviceCapabilities } from './types';
import { PaletteDirector } from '@/lib/palette';
import { useAudioReactive } from '@/lib/audio/useAudioReactive';
import { calculatePhysicsParams } from '@/lib/audio';
import { CSSFallback } from '@/components/liquid-light';
import LiquidLightBackground from '@/components/LiquidLightBackground';

export interface VisualLayer {
  id: string;
  type: 'webgl' | 'css' | 'thin-film' | 'thermal' | 'overlay';
  enabled: boolean;
  priority: number;
  zIndex: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
}

export interface VisualOrchestratorState {
  layers: VisualLayer[];
  activeLayers: VisualLayer[];
  performance: {
    fps: number;
    memoryUsage: number;
    gpuUsage: number;
    cpuUsage: number;
  };
  quality: {
    current: 'low' | 'medium' | 'high' | 'ultra';
    target: 'low' | 'medium' | 'high' | 'ultra';
    adaptive: boolean;
  };
  errors: string[];
  warnings: string[];
}

export interface VisualOrchestratorProps {
  className?: string;
  children?: React.ReactNode;
  onStateChange?: (state: VisualOrchestratorState) => void;
  onError?: (error: string) => void;
  onWarning?: (warning: string) => void;
}

const VisualOrchestrator: React.FC<VisualOrchestratorProps> = ({
  className = '',
  children,
  onStateChange,
  onError,
  onWarning,
}) => {
  const {
    policy,
    shouldRenderWebGL,
    shouldRenderCSSFallback,
    shouldEnableThermal,
    shouldEnableThinFilm,
    getEffectiveIntensity,
    getEffectiveParticleCount,
    getEffectiveResolution,
  } = useVisualPolicy();

  const { audioData } = useAudioReactive();
  const physicsParams = calculatePhysicsParams(audioData);

  // State management
  const [state, setState] = useState<VisualOrchestratorState>({
    layers: [],
    activeLayers: [],
    performance: {
      fps: 60,
      memoryUsage: 0,
      gpuUsage: 0,
      cpuUsage: 0,
    },
    quality: {
      current: policy.fluidQuality,
      target: policy.fluidQuality,
      adaptive: true,
    },
    errors: [],
    warnings: [],
  });

  // Refs for performance monitoring
  const performanceRef = useRef({
    frameCount: 0,
    lastFpsCheck: Date.now(),
    memoryCheck: 0,
  });

  // Layer management
  const layers: VisualLayer[] = [
    {
      id: 'webgl-fluid',
      type: 'webgl',
      enabled: shouldRenderWebGL(),
      priority: 1,
      zIndex: 0,
      opacity: 1.0,
      blendMode: 'normal',
    },
    {
      id: 'css-fallback',
      type: 'css',
      enabled: shouldRenderCSSFallback(),
      priority: 2,
      zIndex: 0,
      opacity: 1.0,
      blendMode: 'normal',
    },
    {
      id: 'thermal-currents',
      type: 'thermal',
      enabled: shouldEnableThermal(),
      priority: 3,
      zIndex: 1,
      opacity: 0.8,
      blendMode: 'overlay',
    },
    {
      id: 'thin-film',
      type: 'thin-film',
      enabled: shouldEnableThinFilm(),
      priority: 4,
      zIndex: 2,
      opacity: 0.6,
      blendMode: 'soft-light',
    },
    {
      id: 'ui-overlay',
      type: 'overlay',
      enabled: true,
      priority: 5,
      zIndex: 10,
      opacity: 1.0,
      blendMode: 'normal',
    },
  ];

  // Update active layers based on policy
  const activeLayers = layers.filter(layer => layer.enabled);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    const now = Date.now();
    performanceRef.current.frameCount++;

    // FPS monitoring
    if (performanceRef.current.frameCount % 60 === 0) {
      const elapsed = now - performanceRef.current.lastFpsCheck;
      const currentFps = Math.round(60000 / elapsed);
      
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          fps: currentFps,
        },
      }));

      // Adaptive quality adjustment
      if (state.quality.adaptive) {
        let newQuality = state.quality.current;
        
        if (currentFps < 25 && state.quality.current !== 'low') {
          newQuality = state.quality.current === 'high' ? 'medium' : 'low';
        } else if (currentFps > 50 && state.quality.current !== 'ultra') {
          newQuality = state.quality.current === 'low' ? 'medium' : 
                      state.quality.current === 'medium' ? 'high' : 'ultra';
        }

        if (newQuality !== state.quality.current) {
          setState(prev => ({
            ...prev,
            quality: {
              ...prev.quality,
              target: newQuality,
            },
          }));
        }
      }

      performanceRef.current.lastFpsCheck = now;
    }

    // Memory monitoring (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        setState(prev => ({
          ...prev,
          performance: {
            ...prev.performance,
            memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
          },
        }));
      }
    }
  }, [state.quality, state.quality.adaptive]);

  // Error handling
  const handleError = useCallback((error: string) => {
    console.error('VisualOrchestrator Error:', error);
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, error],
    }));
    onError?.(error);
  }, [onError]);

  const handleWarning = useCallback((warning: string) => {
    console.warn('VisualOrchestrator Warning:', warning);
    setState(prev => ({
      ...prev,
      warnings: [...prev.warnings, warning],
    }));
    onWarning?.(warning);
  }, [onWarning]);

  // Layer coordination
  const coordinateLayers = useCallback(() => {
    // Sort layers by priority and zIndex
    const sortedLayers = [...activeLayers].sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.zIndex - b.zIndex;
    });

    setState(prev => ({
      ...prev,
      layers: sortedLayers,
      activeLayers: sortedLayers,
    }));
  }, [activeLayers]);

  // Effects
  useEffect(() => {
    coordinateLayers();
  }, [coordinateLayers]);

  useEffect(() => {
    const interval = setInterval(monitorPerformance, 1000 / 60);
    return () => clearInterval(interval);
  }, [monitorPerformance]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Render layers
  const renderLayer = (layer: VisualLayer) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: layer.zIndex,
      opacity: layer.opacity,
      mixBlendMode: layer.blendMode,
      pointerEvents: 'none',
    };

    switch (layer.type) {
      case 'webgl':
        return (
          <LiquidLightBackground
            key={layer.id}
            className="visual-layer"
            style={style}
          />
        );

      case 'css':
        return (
          <CSSFallback
            key={layer.id}
            intensity={getEffectiveIntensity()}
            motionEnabled={policy.motionEnabled}
            className="visual-layer"
            style={style}
          />
        );

      case 'thermal':
        // Thermal currents layer (placeholder)
        return (
          <div
            key={layer.id}
            className="visual-layer thermal-layer"
            style={style}
          >
            {/* Thermal currents implementation */}
          </div>
        );

      case 'thin-film':
        // Thin-film interference layer (placeholder)
        return (
          <div
            key={layer.id}
            className="visual-layer thin-film-layer"
            style={style}
          >
            {/* Thin-film interference implementation */}
          </div>
        );

      case 'overlay':
        return (
          <div
            key={layer.id}
            className="visual-layer overlay-layer"
            style={style}
          >
            {children}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`visual-orchestrator ${className}`}>
      {activeLayers.map(renderLayer)}
      
      {/* Performance HUD (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 text-white text-xs bg-black/70 p-3 rounded backdrop-blur">
          <div>FPS: {state.performance.fps}</div>
          <div>Quality: {state.quality.current} → {state.quality.target}</div>
          <div>Layers: {activeLayers.length}</div>
          <div>Memory: {Math.round(state.performance.memoryUsage * 100)}%</div>
          <div>Intensity: {Math.round(getEffectiveIntensity() * 100)}%</div>
          <div>Particles: {getEffectiveParticleCount()}</div>
          <div>Resolution: {Math.round(getEffectiveResolution() * 100)}%</div>
        </div>
      )}
    </div>
  );
};

export default VisualOrchestrator;