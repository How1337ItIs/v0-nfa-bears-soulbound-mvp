"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

// Visual policy and utilities
import {
  createVisualPolicyManager,
  useVisualPolicy,
} from './VisualPolicy';
import { getClampedDPR } from './utils/dprClamp';
import { TierTransitionManager } from './performance/tierTransitionManager';

// Core services
import { PaletteDirector } from '@/lib/palette';
import {
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
  BeatDetector,
  createBeatDetector,
  createAmbientDetector,
  createDanceFloorDetector,
  useAudioReactive,
} from '@/lib/audio';

// Visual layers / components
import LiquidLightBackground from '@/components/LiquidLightBackground';
import { AuthenticThinFilmEffect } from '@/lib/post/ThinFilmPass';
import PerformanceHUD from '@/components/liquid-light/dev/PerformanceHUD';
import { enforceThinFilmPerformanceGate } from './orchestrator/layerCoordinator';

// Local helpers
function useQueryFlag(param: string): boolean {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    setFlag(p.get(param) === 'true');
  }, [param]);
  return flag;
}

function useFPS(): number {
  const [fps, setFps] = useState(60);
  const lastRef = useRef<number | null>(null);
  const framesRef = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = performance.now();
      framesRef.current += 1;
      if (lastRef.current == null) {
        lastRef.current = now;
      } else if (now - lastRef.current >= 1000) {
        setFps(framesRef.current);
        framesRef.current = 0;
        lastRef.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return fps;
}

export default function VisualOrchestrator({ children }: { children?: React.ReactNode }) {
  // Ensure policy singleton exists
  useMemo(() => createVisualPolicyManager(), []);
  const { policy, updatePolicy } = useVisualPolicy();

  const debugMode = useQueryFlag('debug');
  const pureMode = useQueryFlag('pureMode');
  const fps = useFPS();
  const tierMgrRef = useRef(new TierTransitionManager());

  // Audio pipeline (shared)
  const { audioData } = useAudioReactive();
  const detectorRef = useRef<BeatDetector | null>(null);
  const processorRef = useRef(createEnhancedAudioProcessor(policy.audioSmoothingAlpha ?? 0.3, {
    burstMultiplier: policy.beatBurstMultiplier ?? 1.8,
    decayTime: 200,
    minInterval: 100,
  }));

  // Switch beat detector by mode
  useEffect(() => {
    // Backward-compat: some code may set 'dance-floor' string
    const mode: string = (policy as any).mode || 'ambient';
    if (mode === 'reactive' || mode === 'dance-floor') {
      detectorRef.current = createDanceFloorDetector();
    } else if (mode === 'ambient') {
      detectorRef.current = createAmbientDetector();
    } else {
      detectorRef.current = createBeatDetector();
    }
  }, [policy.mode]);

  // Enriched audio with beat info
  const enrichedAudio = useMemo(() => {
    if (!audioData || !detectorRef.current) return audioData as any;
    const energy = Math.max(0, Math.min(100, (audioData.bass || 0) * 100));
    const beat = detectorRef.current.detect(energy);
    return { ...audioData, beatDetected: beat.isBeat, tempo: beat.bpmEstimate } as any;
  }, [audioData]);

  // Physics params for thin-film and other layers
  const physics = useMemo(() => {
    return calculateEnhancedPhysicsParams(enrichedAudio as any, processorRef.current);
  }, [enrichedAudio]);

  // Sync palette selection with PaletteDirector
  useEffect(() => {
    PaletteDirector.setPalette(policy.paletteId);
  }, [policy.paletteId]);

  // Enforce Pure Mode (disable heavy overlays)
  useEffect(() => {
    if (!pureMode) return;
    if (policy.thinFilmEnabled) updatePolicy({ thinFilmEnabled: false });
  }, [pureMode, policy.thinFilmEnabled, updatePolicy]);

  // Auto-disable thin-film on sustained low FPS (centralized helper)
  useEffect(() => {
    enforceThinFilmPerformanceGate(fps, { thinFilmEnabled: policy.thinFilmEnabled }, updatePolicy);
  }, [fps, policy.thinFilmEnabled, updatePolicy]);

  // Adaptive tiering via hysteresis manager (non-destructive)
  useEffect(() => {
    const tm = tierMgrRef.current;
    const next = tm.checkAndTransition(
      fps,
      policy.performanceTier as any,
      policy.capabilities.tier as any
    );
    if (next && next !== policy.performanceTier) {
      updatePolicy({ performanceTier: next });
    }
  }, [fps, policy.performanceTier, policy.capabilities.tier, updatePolicy]);

  // Memory monitoring loop: warn and tier down or disable thin-film on growth
  useEffect(() => {
    const interval = setInterval(() => {
      const anyPerf: any = typeof performance !== 'undefined' ? (performance as any) : null;
      if (!anyPerf || !anyPerf.memory) return;
      const used = anyPerf.memory.usedJSHeapSize as number | undefined;
      if (!used) return;
      // Threshold ~100MB
      if (used > 100 * 1024 * 1024) {
        // eslint-disable-next-line no-console
        console.warn('[Orchestrator] High memory usage detected, applying safeguards');
        // Prefer disabling thin-film first, then step down tier
        if (policy.thinFilmEnabled) {
          updatePolicy({ thinFilmEnabled: false });
        } else if (policy.performanceTier !== 'low') {
          const next = policy.performanceTier === 'high' ? 'medium' : 'low';
          updatePolicy({ performanceTier: next });
        }
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [policy.thinFilmEnabled, policy.performanceTier, updatePolicy]);

  const currentTier = policy.performanceTier;

  return (
    <>
      {/* Base background engine */}
      <LiquidLightBackground
        intensity={policy.intensity}
        motionEnabled={policy.motionEnabled}
        tier={currentTier as 'low' | 'medium' | 'high'}
        audioData={enrichedAudio as any}
        palette={{ id: policy.paletteId, name: policy.paletteId, colors: PaletteDirector.getCurrentPalette().colors }}
        className="fixed inset-0 -z-10"
      />

      {/* Thin-film overlay (z-index -30) */}
      {currentTier !== 'low' && policy.thinFilmEnabled && !pureMode && (
        <AuthenticThinFilmEffect
          audioParams={physics as any}
          deviceTier={currentTier as any}
          paletteId={policy.paletteId}
          enabled={true}
          intensity={policy.thinFilmIntensity ?? 0.6}
          quality={(policy.thinFilmQuality as any) || undefined}
          blendMode={(policy.thinFilmBlendMode as any) || undefined}
          currentFPS={fps}
        />
      )}

      {/* Performance HUD (debug only) */}
      {debugMode && (
        <PerformanceHUD
          fps={fps}
          tier={currentTier as any}
          audioData={enrichedAudio as any}
          dpr={getClampedDPR()}
          enabled
          paletteId={policy.paletteId}
          thinFilmQuality={(policy.thinFilmQuality as any) || undefined}
        />
      )}

      {children}
    </>
  );
}
