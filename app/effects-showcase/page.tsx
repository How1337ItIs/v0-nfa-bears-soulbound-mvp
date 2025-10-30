/**
 * @file page.tsx
 * @description Effect showcase page for demonstrating all shader effects
 */

'use client';

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ComprehensiveEffectComposer } from '@/lib/post/ComprehensiveEffectComposer';
import { EffectStackingOrderTest } from '@/lib/post/ComprehensiveEffectComposer';
import { ShaderPresetManager } from '@/components/liquid-light/ShaderPresets';
import { EffectToggles } from '@/components/liquid-light/controls/EffectToggles';
import type { ShaderPreset } from '@/components/liquid-light/ShaderPresets';

// Mock audio params for demonstration
const mockAudioParams = {
  splatForce: 15,
  thermalRate: 4,
  colorPhase: 0.5,
  globalIntensity: 0.8,
  curlStrength: 0.3,
  viscosity: 0.95
};

export default function EffectsShowcasePage() {
  const [currentEffect, setCurrentEffect] = useState<string>('all');
  const [currentPreset, setCurrentPreset] = useState<string>('classic');
  const [currentEffects, setCurrentEffects] = useState<ShaderPreset>({
    thinFilm: true,
    shimmer: true,
    flowField: false,
    chromatic: true,
    kaleidoscope: false,
    vignette: true,
  });
  const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [mode, setMode] = useState<'ambient' | 'trip'>('ambient');
  const [showStackingTest, setShowStackingTest] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const effectConfigs = [
    { key: 'all', name: 'All Effects', description: 'Show all effects combined' },
    { key: 'thinFilm', name: 'Thin-Film Interference', description: 'Oil-on-water iridescence' },
    { key: 'shimmer', name: 'Iridescent Shimmer', description: 'Fresnel-based edge shimmer' },
    { key: 'flowField', name: 'Flow Field Distortion', description: 'Organic UV distortion' },
    { key: 'chromatic', name: 'Chromatic Aberration', description: 'RGB channel split' },
    { key: 'kaleidoscope', name: 'Kaleidoscope Mode', description: 'Radial symmetry' },
    { key: 'vignette', name: 'Vignette', description: 'Edge darkening' },
  ];

  const getEffectPreset = (effectKey: string): ShaderPreset => {
    if (effectKey === 'all') {
      return currentEffects;
    }

    const singleEffect: ShaderPreset = {
      thinFilm: false,
      shimmer: false,
      flowField: false,
      chromatic: false,
      kaleidoscope: false,
      vignette: false,
    };

    if (effectKey in singleEffect) {
      singleEffect[effectKey as keyof ShaderPreset] = true;
    }

    return singleEffect;
  };

  const handleEffectChange = (effect: keyof ShaderPreset, enabled: boolean) => {
    setCurrentEffects(prev => ({
      ...prev,
      [effect]: enabled
    }));
  };

  const handlePresetChange = (presetId: string) => {
    setCurrentPreset(presetId);
    
    // Update effects based on preset
    if (presetId === 'minimal') {
      setCurrentEffects({
        thinFilm: true,
        shimmer: false,
        flowField: false,
        chromatic: false,
        kaleidoscope: false,
        vignette: false,
      });
    } else if (presetId === 'classic') {
      setCurrentEffects({
        thinFilm: true,
        shimmer: true,
        flowField: false,
        chromatic: true,
        kaleidoscope: false,
        vignette: true,
      });
    } else if (presetId === 'intense') {
      setCurrentEffects({
        thinFilm: true,
        shimmer: true,
        flowField: true,
        chromatic: true,
        kaleidoscope: false,
        vignette: true,
      });
    } else if (presetId === 'trip') {
      setCurrentEffects({
        thinFilm: true,
        shimmer: true,
        flowField: true,
        chromatic: true,
        kaleidoscope: true,
        vignette: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Shader Effects Showcase</h1>
          <p className="mt-2 text-gray-300">
            Interactive demonstration of all shader effects in the Liquid Light System
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Effect Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Effect Selection</h2>
              <div className="space-y-3">
                {effectConfigs.map((config) => (
                  <button
                    key={config.key}
                    onClick={() => setCurrentEffect(config.key)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentEffect === config.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{config.name}</div>
                    <div className="text-sm opacity-75">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Device Tier Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Device Tier</h2>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'ultra'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setDeviceTier(tier)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      deviceTier === tier
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mode</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode('ambient')}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    mode === 'ambient'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Ambient
                </button>
                <button
                  onClick={() => setMode('trip')}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    mode === 'trip'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Trip Mode
                </button>
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Advanced Controls</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPresetManager(!showPresetManager)}
                  className="w-full p-3 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                >
                  {showPresetManager ? 'Hide' : 'Show'} Preset Manager
                </button>
                <button
                  onClick={() => setShowStackingTest(!showStackingTest)}
                  className="w-full p-3 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                >
                  {showStackingTest ? 'Hide' : 'Show'} Stacking Test
                </button>
              </div>
            </div>

            {/* Preset Manager */}
            {showPresetManager && (
              <div className="bg-gray-800 rounded-lg p-6">
                <ShaderPresetManager
                  currentPreset={currentPreset}
                  currentEffects={currentEffects}
                  onPresetChange={handlePresetChange}
                  onEffectChange={handleEffectChange}
                  deviceTier={deviceTier}
                />
              </div>
            )}

            {/* Effect Toggles */}
            <div className="bg-gray-800 rounded-lg p-6">
              <EffectToggles
                effects={currentEffects}
                onEffectChange={handleEffectChange}
                deviceTier={deviceTier}
                mode={mode}
              />
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {effectConfigs.find(e => e.key === currentEffect)?.name} Preview
              </h2>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <Canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%' }}
                  gl={{ alpha: true, antialias: true }}
                >
                  {showStackingTest ? (
                    <EffectStackingOrderTest
                      effects={getEffectPreset(currentEffect)}
                      audioParams={mockAudioParams}
                      deviceTier={deviceTier}
                      paletteId="classic-60s"
                      quality="desktop"
                      mode={mode}
                    />
                  ) : (
                    <ComprehensiveEffectComposer
                      effects={getEffectPreset(currentEffect)}
                      audioParams={mockAudioParams}
                      deviceTier={deviceTier}
                      paletteId="classic-60s"
                      quality="desktop"
                      mode={mode}
                      intensity={0.8}
                    />
                  )}
                </Canvas>
              </div>

              {/* Effect Description */}
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Effect Description</h3>
                <p className="text-sm text-gray-300">
                  {effectConfigs.find(e => e.key === currentEffect)?.description}
                </p>
              </div>

              {/* Performance Info */}
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Performance Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Device Tier:</div>
                    <div className="font-medium">{deviceTier}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Mode:</div>
                    <div className="font-medium">{mode}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Active Effects:</div>
                    <div className="font-medium">
                      {Object.values(getEffectPreset(currentEffect)).filter(Boolean).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Canvas Size:</div>
                    <div className="font-medium">1920x1080</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            This showcase demonstrates all shader effects available in the Liquid Light System.
            Use the controls to experiment with different combinations and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
