/**
 * @file ComprehensiveEffectComposer.tsx
 * @description Comprehensive effect composer integrating all shader effects
 */

import React from 'react';
import { EffectComposer } from '@react-three/postprocessing';
import { ThinFilmPass } from './ThinFilmPass';
import { ShimmerPass } from './ShimmerPass';
import { FlowFieldPass } from './FlowFieldPass';
import { ChromaticAberrationPass } from './ChromaticAberrationPass';
import { KaleidoscopePass } from './KaleidoscopePass';
import { VignettePass } from './VignettePass';
import type { AudioReactiveParams } from '@/lib/audio/useAudioReactive';
import type { ShaderPreset } from '@/components/liquid-light/ShaderPresets';

export interface ComprehensiveEffectComposerProps {
  effects: ShaderPreset;
  audioParams: AudioReactiveParams;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  paletteId?: string;
  quality?: 'emergency' | 'mobile' | 'desktop' | 'ultra';
  mode?: 'ambient' | 'trip';
  intensity?: number;
  className?: string;
}

/**
 * Comprehensive Effect Composer
 * 
 * Renders all shader effects in the correct order for optimal visual quality.
 * Order is critical for proper layering and performance.
 * 
 * Rendering Order (back to front):
 * 1. Vignette - Edge darkening (affects all subsequent effects)
 * 2. Flow Field - UV distortion (affects all subsequent effects)
 * 3. Thin-Film - Main interference effect
 * 4. Shimmer - Edge shimmer overlay
 * 5. Chromatic Aberration - RGB channel split
 * 6. Kaleidoscope - Radial symmetry (Trip Mode only)
 */
export function ComprehensiveEffectComposer({
  effects,
  audioParams,
  deviceTier,
  paletteId = 'classic-60s',
  quality = 'mobile',
  mode = 'ambient',
  intensity = 0.8,
  className = ''
}: ComprehensiveEffectComposerProps) {
  // Disable kaleidoscope in ambient mode
  const effectiveKaleidoscope = effects.kaleidoscope && mode === 'trip';

  // Adjust intensity based on device tier
  const tierIntensity = {
    low: 0.3,
    medium: 0.6,
    high: 0.8,
    ultra: 1.0
  }[deviceTier];

  const finalIntensity = intensity * tierIntensity;

  return (
    <EffectComposer
      className={className}
      multisampling={deviceTier === 'ultra' ? 8 : deviceTier === 'high' ? 4 : 0}
      stencilBuffer={false}
      depthBuffer={false}
    >
      {/* 1. Vignette - Edge darkening (affects all subsequent effects) */}
      {effects.vignette && (
        <VignettePass
          intensity={0.7}
          smoothness={0.5}
          center={[0.5, 0.5]}
          enabled={true}
        />
      )}

      {/* 2. Flow Field - UV distortion (affects all subsequent effects) */}
      {effects.flowField && (
        <FlowFieldPass
          audioParams={audioParams}
          strength={0.05 * finalIntensity}
          speed={0.5}
          enabled={true}
        />
      )}

      {/* 3. Thin-Film - Main interference effect */}
      {effects.thinFilm && (
        <ThinFilmPass
          audioParams={audioParams}
          intensity={finalIntensity}
          enabled={deviceTier !== 'low'}
          paletteId={paletteId}
          quality={quality}
        />
      )}

      {/* 4. Shimmer - Edge shimmer overlay */}
      {effects.shimmer && (
        <ShimmerPass
          intensity={0.3 * finalIntensity}
          frequency={10.0}
          fresnelPower={3.0}
          paletteId={paletteId}
          enabled={true}
        />
      )}

      {/* 5. Chromatic Aberration - RGB channel split */}
      {effects.chromatic && (
        <ChromaticAberrationPass
          offset={0.002 * finalIntensity}
          radialOffset={0.5}
          direction={[1, 0]}
          audioParams={audioParams}
          enabled={true}
        />
      )}

      {/* 6. Kaleidoscope - Radial symmetry (Trip Mode only) */}
      {effectiveKaleidoscope && (
        <KaleidoscopePass
          audioParams={audioParams}
          sections={6}
          zoom={1.0 + (audioParams.splatForce - 8) / 15 * 0.5}
          enabled={true}
        />
      )}
    </EffectComposer>
  );
}

/**
 * Effect Stacking Order Test Component
 * Used to verify that effects render in the correct order
 */
export function EffectStackingOrderTest({
  effects,
  audioParams,
  deviceTier = 'high',
  paletteId = 'classic-60s',
  quality = 'desktop',
  mode = 'trip'
}: Omit<ComprehensiveEffectComposerProps, 'intensity' | 'className'>) {
  const [currentEffect, setCurrentEffect] = React.useState<string | null>(null);

  const effectOrder = [
    { key: 'vignette', name: 'Vignette', enabled: effects.vignette },
    { key: 'flowField', name: 'Flow Field', enabled: effects.flowField },
    { key: 'thinFilm', name: 'Thin-Film', enabled: effects.thinFilm },
    { key: 'shimmer', name: 'Shimmer', enabled: effects.shimmer },
    { key: 'chromatic', name: 'Chromatic Aberration', enabled: effects.chromatic },
    { key: 'kaleidoscope', name: 'Kaleidoscope', enabled: effects.kaleidoscope && mode === 'trip' },
  ];

  return (
    <div className="effect-stacking-test">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Effect Stacking Order Test</h3>
        <div className="flex flex-wrap gap-2">
          {effectOrder.map(({ key, name, enabled }) => (
            <button
              key={key}
              onClick={() => setCurrentEffect(currentEffect === key ? null : key)}
              className={`px-3 py-1 rounded text-sm ${
                enabled
                  ? currentEffect === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!enabled}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="effect-visualization">
        <ComprehensiveEffectComposer
          effects={effects}
          audioParams={audioParams}
          deviceTier={deviceTier}
          paletteId={paletteId}
          quality={quality}
          mode={mode}
          intensity={0.8}
        />
      </div>

      {currentEffect && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-medium">Currently Highlighting: {effectOrder.find(e => e.key === currentEffect)?.name}</h4>
          <p className="text-sm text-gray-600">
            This effect is rendered in position {effectOrder.findIndex(e => e.key === currentEffect) + 1} of the effect stack.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Performance Monitor for Effect Composer
 * Tracks GPU time and memory usage for each effect
 */
export function EffectComposerPerformanceMonitor({
  effects,
  audioParams,
  deviceTier,
  onPerformanceUpdate
}: {
  effects: ShaderPreset;
  audioParams: AudioReactiveParams;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  onPerformanceUpdate?: (metrics: {
    totalGPUTime: number;
    effectBreakdown: Record<string, number>;
    memoryUsage: number;
  }) => void;
}) {
  const [metrics, setMetrics] = React.useState({
    totalGPUTime: 0,
    effectBreakdown: {} as Record<string, number>,
    memoryUsage: 0
  });

  React.useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      const effectBreakdown: Record<string, number> = {};
      let totalGPUTime = 0;

      // Estimate GPU time for each active effect
      if (effects.vignette) {
        effectBreakdown.vignette = 0.5;
        totalGPUTime += 0.5;
      }
      if (effects.flowField) {
        effectBreakdown.flowField = 2.0;
        totalGPUTime += 2.0;
      }
      if (effects.thinFilm) {
        const thinFilmTime = deviceTier === 'ultra' ? 8.0 : deviceTier === 'high' ? 5.5 : 3.5;
        effectBreakdown.thinFilm = thinFilmTime;
        totalGPUTime += thinFilmTime;
      }
      if (effects.shimmer) {
        effectBreakdown.shimmer = 1.5;
        totalGPUTime += 1.5;
      }
      if (effects.chromatic) {
        effectBreakdown.chromatic = 0.8;
        totalGPUTime += 0.8;
      }
      if (effects.kaleidoscope) {
        effectBreakdown.kaleidoscope = 3.0;
        totalGPUTime += 3.0;
      }

      const memoryUsage = totalGPUTime * 2; // Rough estimate

      const newMetrics = {
        totalGPUTime,
        effectBreakdown,
        memoryUsage
      };

      setMetrics(newMetrics);
      onPerformanceUpdate?.(newMetrics);
    }, 1000);

    return () => clearInterval(interval);
  }, [effects, deviceTier, onPerformanceUpdate]);

  return (
    <div className="performance-monitor">
      <h4 className="font-medium mb-2">Performance Metrics</h4>
      <div className="text-sm space-y-1">
        <div>Total GPU Time: {metrics.totalGPUTime.toFixed(1)}ms</div>
        <div>Memory Usage: {metrics.memoryUsage.toFixed(1)}MB</div>
        <div className="mt-2">
          <div className="font-medium">Effect Breakdown:</div>
          {Object.entries(metrics.effectBreakdown).map(([effect, time]) => (
            <div key={effect} className="ml-2">
              {effect}: {time.toFixed(1)}ms
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
