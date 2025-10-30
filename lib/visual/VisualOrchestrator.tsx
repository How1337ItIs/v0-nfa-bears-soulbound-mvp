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

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { VisualPolicy, useVisualPolicy, createVisualPolicyManager } from './VisualPolicy';
import { DeviceCapabilities } from './types';
import { PaletteDirector } from '@/lib/palette';
import { useAudioReactive } from '@/lib/audio/useAudioReactive';
import {
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
  BeatDetector,
  createBeatDetector,
  createAmbientDetector,
  createDanceFloorDetector,
  type AudioData as EnhancedAudioData,
} from '@/lib/audio';
import { CSSFallback } from '@/components/liquid-light';
import LiquidLightBackground from '@/components/LiquidLightBackground';
import { TierTransitionManager } from './performance/tierTransitionManager';
import { getBatterySaverPolicy } from './capability/batterySaverPolicy';
import { AuthenticThinFilmEffect } from '@/lib/post/ThinFilmPass';
import PerformanceHUD from '@/components/liquid-light/dev/PerformanceHUD';
import { getClampedDPR } from '@/lib/visual';

// Minimal error boundary
class ErrorBoundary extends React.Component<{
  fallback?: React.ReactNode;
  onError?: (error: any) => void;
  children: React.ReactNode;
}, { hasError: boolean }>{
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    this.props.onError?.(error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

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
  // Ensure policy manager exists
  createVisualPolicyManager();

  const {
    policy,
    updatePolicy,
    shouldRenderWebGL,
    shouldRenderCSSFallback,
    shouldEnableThermal,
    shouldEnableThinFilm,
    getEffectiveIntensity,
    getEffectiveParticleCount,
    getEffectiveResolution,
  } = useVisualPolicy();

  const { audioData } = useAudioReactive();

  // Enhanced audio processor + beat detection
  const audioProcessorRef = useRef(
    createEnhancedAudioProcessor(
      (typeof policy.audioSmoothingAlpha === 'number' ? policy.audioSmoothingAlpha : 0.3) || 0.3,
      {
        burstMultiplier: (typeof policy.beatBurstMultiplier === 'number' ? policy.beatBurstMultiplier : 1.8) || 1.8,
        decayTime: 200,
        minInterval: 100,
      }
    )
  );

  // Recreate processor when tuning changes
  useEffect(() => {
    audioProcessorRef.current = createEnhancedAudioProcessor(
      (typeof policy.audioSmoothingAlpha === 'number' ? policy.audioSmoothingAlpha : 0.3) || 0.3,
      {
        burstMultiplier: (typeof policy.beatBurstMultiplier === 'number' ? policy.beatBurstMultiplier : 1.8) || 1.8,
        decayTime: 200,
        minInterval: 100,
      }
    );
  }, [policy.audioSmoothingAlpha, policy.beatBurstMultiplier]);

  const beatDetectorRef = useRef<BeatDetector | null>(null);
  useEffect(() => {
    // Map local modes to detectors
    let detector: BeatDetector;
    if (policy.mode === 'ambient') detector = createAmbientDetector();
    else if (policy.mode === 'reactive') detector = createDanceFloorDetector();
    else detector = createBeatDetector();
    beatDetectorRef.current = detector;
  }, [policy.mode]);

  // Enrich audio with beat detection results
  const beatResultRef = useRef<{ isBeat: boolean; confidence: number; bpm: number } | null>(null);
  const enrichedAudioData = useMemo<EnhancedAudioData | null>(() => {
    if (!audioData) return null;
    const energy = Math.max(0, Math.min(100, (audioData.bass || 0) * 100));
    const beatResult = beatDetectorRef.current?.detect(energy);
    if (beatResult) {
      beatResultRef.current = {
        isBeat: beatResult.isBeat,
        confidence: beatResult.confidence,
        bpm: beatResult.bpmEstimate,
      };
    }
    return {
      ...audioData,
      beatDetected: beatResult ? beatResult.isBeat : !!audioData.beatDetected,
      tempo: beatResult?.bpmEstimate ?? audioData.tempo,
    } as EnhancedAudioData;
  }, [audioData]);

  // Enhanced physics from enriched audio
  const physicsParams = useMemo(() => {
    return calculateEnhancedPhysicsParams(enrichedAudioData, audioProcessorRef.current);
  }, [enrichedAudioData]);

  // Tier transition manager (hysteresis)
  const transitionManager = useRef(new TierTransitionManager());
  const [tabHidden, setTabHidden] = useState(false);
  const pureMode = (() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('pureMode') === 'true';
  })();

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
      zIndex: -40,
      opacity: 1.0,
      blendMode: 'screen',
    },
    {
      id: 'css-fallback',
      type: 'css',
      enabled: shouldRenderCSSFallback(),
      priority: 0,
      zIndex: -50,
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
      enabled: pureMode ? false : shouldEnableThinFilm(),
      priority: 4,
      zIndex: -30,
      opacity: policy.thinFilmIntensity ?? 0.6,
      blendMode: 'screen',
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

      // Thin-film performance gating: disable if FPS too low
      if (currentFps < 45 && policy.thinFilmEnabled) {
        console.warn('[LayerCoordinator] Disabling thin-film due to low FPS');
        updatePolicy({ thinFilmEnabled: false });
      }

      // Adaptive quality adjustment
      if (state.quality.adaptive) {
        let newQuality = state.quality.current;

        // Hysteresis-based tier transitions
        const currentTier = state.quality.current as 'low' | 'medium' | 'high' | 'ultra';
        const maxTier = (policy.capabilities?.tier || 'high') as 'low' | 'medium' | 'high' | 'ultra';
        // Prevent tier transitions during strong beats to avoid visual interruption
        if (enrichedAudioData?.beatDetected) {
          performanceRef.current.lastFpsCheck = now;
          return; // skip this check; try next frame
        }
        const suggestedTier = transitionManager.current.checkAndTransition(
          currentFps,
          currentTier,
          maxTier
        );

        if (suggestedTier) {
          // Clamp to medium in Pure Mode
          newQuality = (pureMode && (suggestedTier === 'high' || suggestedTier === 'ultra'))
            ? 'medium'
            : (suggestedTier as typeof newQuality);
        }

        if (newQuality !== state.quality.current) {
          setState(prev => ({
            ...prev,
            quality: {
              ...prev.quality,
              target: newQuality,
            },
          }));
          // Debug notification for tier change
          if (debugEnabled) {
            const msg = `Quality adjusted for performance: ${state.quality.current} → ${newQuality} (FPS ${currentFps})`;
            setDebugToast(msg);
          }
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
  }, [state.quality, state.quality.adaptive, enrichedAudioData, policy.capabilities?.tier, debugEnabled]);

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

  // Sync PaletteDirector with policy palette
  useEffect(() => {
    try {
      PaletteDirector.setCurrentPalette(policy.paletteId);
    } catch {}
  }, [policy.paletteId]);

  useEffect(() => {
    const interval = setInterval(monitorPerformance, 1000 / 60);
    return () => clearInterval(interval);
  }, [monitorPerformance]);

  // Memory guardrail: downshift quality / disable thin-film on high heap usage
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if ('memory' in performance) {
          const mem: any = (performance as any).memory;
          if (mem && mem.usedJSHeapSize && mem.usedJSHeapSize > 100 * 1024 * 1024) {
            console.warn('[Orchestrator] High memory detected; applying safeguards');
            // Reduce resolution and disable thin-film to recover
            updatePolicy({
              resolution: Math.max(0.5, (policy.resolution || 1) * 0.8),
              thinFilmEnabled: false,
            });
          }
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [policy.resolution, updatePolicy]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Battery Saver auto-detection + listeners
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const decision = await getBatterySaverPolicy();
        if (!cancelled && decision.enabled && decision.forcedTier) {
          setState(prev => ({
            ...prev,
            quality: {
              ...prev.quality,
              target: decision.forcedTier,
            },
          }));
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[VisualOrchestrator] Battery saver enforced: ${decision.forcedTier} (${decision.reason})`);
          }
          if (debugEnabled) {
            setDebugToast(`Battery saver enforced: ${decision.forcedTier}`);
          }
        }

        // Attach listeners if Battery API available
        const nav: any = navigator as any;
        if (nav && 'getBattery' in nav) {
          const battery = await nav.getBattery();
          const handler = async () => {
            const d = await getBatterySaverPolicy();
            if (!cancelled && d.enabled && d.forcedTier) {
              setState(prev => ({
                ...prev,
                quality: { ...prev.quality, target: d.forcedTier },
              }));
              if (process.env.NODE_ENV === 'development') {
                console.warn(`[VisualOrchestrator] Battery saver updated: ${d.forcedTier} (${d.reason})`);
              }
              if (debugEnabled) {
                setDebugToast(`Battery saver updated: ${d.forcedTier}`);
              }
            }
          };
          battery.addEventListener('levelchange', handler);
          battery.addEventListener('chargingchange', handler);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Visibility optimization: pause when tab hidden
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Debug HUD URL toggle (in addition to development mode)
  const debugEnabled = (() => {
    if (typeof window === 'undefined') return process.env.NODE_ENV === 'development';
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug');
    return process.env.NODE_ENV === 'development' || debugParam === 'true';
  })();

  // Debug toast state
  const [debugToast, setDebugToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (debugToast) {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setDebugToast(null), 2000);
    }
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [debugToast]);

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
        // Map ultra to high for the fluid tier prop
        const target = state.quality.target as 'low' | 'medium' | 'high' | 'ultra';
        const mappedTier = target === 'ultra' ? 'high' : target;
        // Temporary intensity boost on strong beats
        let tempoBoost = 1.0;
        const br = beatResultRef.current;
        if (br?.isBeat && br.confidence > 0.7) {
          tempoBoost = 1.2;
        }
        return (
          <LiquidLightBackground
            key={layer.id}
            intensity={getEffectiveIntensity() * tempoBoost}
            motionEnabled={policy.motionEnabled && !tabHidden}
            tier={mappedTier as 'low' | 'medium' | 'high'}
            audioData={enrichedAudioData}
            className="visual-layer"
            style={style}
          />
        );

      case 'css':
        return (
          <CSSFallback
            key={layer.id}
            intensity={getEffectiveIntensity()}
            motionEnabled={policy.motionEnabled && !tabHidden}
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

      case 'thin-film': {
        const target = state.quality.target as 'low' | 'medium' | 'high' | 'ultra';
        const deviceTier = (target === 'ultra' ? 'high' : target) as 'low' | 'medium' | 'high';
        // Map physics to AudioReactiveParams expected by thin-film
        const thinFilmAudioParams = {
          splatForce: physicsParams.splatForce,
          thermalRate: physicsParams.thermalRate,
          colorPhase: physicsParams.colorPhase,
          globalIntensity: physicsParams.intensity,
        };
        return (
          <div key={layer.id} className="visual-layer thin-film-layer" style={style}>
            <ErrorBoundary
              fallback={<div style={{ display: 'none' }} />}
              onError={(e) => {
                console.error('[ThinFilm] Error:', e);
                updatePolicy({ thinFilmEnabled: false });
              }}
            >
              <AuthenticThinFilmEffect
                audioParams={thinFilmAudioParams as any}
                deviceTier={deviceTier}
                paletteId={policy.paletteId}
                enabled={!tabHidden}
                intensity={policy.thinFilmIntensity}
              />
            </ErrorBoundary>
          </div>
        );
      }

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

      {/* Performance HUD (development or ?debug=true) */}
      {debugEnabled && (
        <PerformanceHUD
          fps={state.performance.fps}
          tier={state.quality.target}
          audioData={enrichedAudioData}
          dpr={getClampedDPR()}
          enabled={true}
        />
      )}

      {debugEnabled && debugToast && (
        <div className="fixed top-20 right-4 z-50 text-white text-xs bg-emerald-700/80 p-2 rounded shadow">
          {debugToast}
        </div>
      )}
    </div>
  );
};

export default VisualOrchestrator;
