'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AUTHENTIC_CONFIGS, detectDeviceCapabilities, DeviceCapabilities, Tier } from '../lib/fluid/config';
import { addThermalSplat, addSlowRotation, FluidInstance } from '../lib/fluid/thermal';
import { useAudioReactive } from '../lib/audio/useAudioReactive';

type FluidModule = {
  default: {
    simulation: (canvas: HTMLCanvasElement, config: any) => FluidInstance
  }
};

export default function LiquidLightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<FluidInstance | null>(null);
  const [cap, setCap] = useState<DeviceCapabilities | null>(null);
  const [tier, setTier] = useState<Tier>('high');
  const [fps, setFps] = useState<number>(60);
  const rafTimeRef = useRef({ last: performance.now(), frames: 0, fps: 60 });
  const rotationPhase = useRef(0);
  const [fluidReady, setFluidReady] = useState(false);

  const { physicsParams } = useAudioReactive();

  // Capability probe (client-only)
  useEffect(() => {
    setCap(detectDeviceCapabilities());
  }, []);

  // Resize canvas to viewport
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const resize = () => {
      cvs.width = window.innerWidth * devicePixelRatio;
      cvs.height = window.innerHeight * devicePixelRatio;
      cvs.style.width = '100%';
      cvs.style.height = '100%';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Pointer → splat (while keeping UI interactive)
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || !fluidRef.current?.splat) return;
    let lastX = 0, lastY = 0, hasLast = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = cvs.getBoundingClientRect();
      const x = (e.clientX - rect.left) * devicePixelRatio;
      const y = (e.clientY - rect.top) * devicePixelRatio;
      const dx = hasLast ? (x - lastX) : 0;
      const dy = hasLast ? (y - lastY) : 0;
      hasLast = true; lastX = x; lastY = y;
      // Bass-driven splat force scaling
      const f = physicsParams.splatForce;
      fluidRef.current!.splat!(x, y, dx * 0.35, dy * 0.35, [1,1,1]);
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [physicsParams.splatForce]);

  // Perf monitor + auto quality
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const d = now - rafTimeRef.current.last;
      rafTimeRef.current.frames++;
      if (d >= 1000) {
        const currentFps = Math.round(rafTimeRef.current.frames * 1000 / d);
        rafTimeRef.current.frames = 0;
        rafTimeRef.current.last = now;
        rafTimeRef.current.fps = currentFps;
        setFps(currentFps);

        // Step-down if needed
        if (currentFps < 25 && tier !== 'low') {
          setTier(tier === 'high' ? 'medium' : 'low');
        } else if (currentFps > 50 && cap && tier !== cap.tier) {
          setTier(tier === 'low' ? 'medium' : cap.tier);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cap, tier]);

  // Initialize / re-init fluid when tier changes
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || !cap?.webgl) return;

    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const mod = await import('webgl-fluid-enhanced') as unknown as FluidModule;
        // Dispose previous
        if (fluidRef.current?.dispose) try { fluidRef.current.dispose(); } catch {}

        const config = AUTHENTIC_CONFIGS[tier];
        const instance = mod.default.simulation(cvs, config);
        fluidRef.current = instance;
        setFluidReady(true);

        // Thermal convection timer
        const thermal = setInterval(() => {
          if (!fluidRef.current) return;
          // Convert thermalRate (~2..8 per 10s) to ms interval
          const interval = 10000 / Math.max(2, Math.min(8, physicsParams.thermalRate));
          addThermalSplat(fluidRef.current, cvs);
        }, 3000 + Math.random() * 2000);

        // Slow rotation jiggle
        let rotRaf = 0;
        const spin = () => {
          rotationPhase.current += 0.01;
          addSlowRotation(fluidRef.current!, cvs, rotationPhase.current);
          rotRaf = requestAnimationFrame(spin);
        };
        rotRaf = requestAnimationFrame(spin);

        cleanup = () => {
          clearInterval(thermal);
          cancelAnimationFrame(rotRaf);
          if (fluidRef.current?.dispose) fluidRef.current.dispose();
        };
      } catch (e) {
        console.error('[LiquidLightBackground] init failed; dropping to CSS fallback', e);
        setCap(prev => prev ? { ...prev, webgl: false } : prev);
      }
    })();

    return () => { if (cleanup) cleanup(); };
  }, [cap?.webgl, tier, physicsParams.thermalRate]);

  if (cap && !cap.webgl) {
    // CSS fallback (single) for non-WebGL
    return (
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/35 via-pink-900/30 to-blue-900/35 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-3 right-3 z-50 text-white text-[11px] bg-black/50 px-2 py-1 rounded">
          FPS {fps} · Tier {tier} {cap ? `· Cap ${cap.tier}` : ''}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0.8 }}
      />
    </>
  );
}
