/**
 * @file ShaderPresets.tsx
 * @description Shader effect preset system for liquid light
 */

import React from 'react';

export interface ShaderPreset {
  thinFilm: boolean;
  shimmer: boolean;
  flowField: boolean;
  chromatic: boolean;
  kaleidoscope: boolean;
  vignette: boolean;
}

export interface ShaderPresetConfig extends ShaderPreset {
  name: string;
  description: string;
  performance: 'low' | 'medium' | 'high' | 'ultra';
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  estimatedGPUTime: number; // milliseconds
  estimatedMemory: number; // MB
}

export const SHADER_PRESETS: Record<string, ShaderPresetConfig> = {
  minimal: {
    name: 'Minimal',
    description: 'Essential effects only - maximum performance',
    performance: 'low',
    deviceTier: 'low',
    estimatedGPUTime: 2.0,
    estimatedMemory: 4,
    thinFilm: true,
    shimmer: false,
    flowField: false,
    chromatic: false,
    kaleidoscope: false,
    vignette: false,
  },
  classic: {
    name: 'Classic',
    description: 'Traditional liquid light with subtle enhancements',
    performance: 'medium',
    deviceTier: 'medium',
    estimatedGPUTime: 6.0,
    estimatedMemory: 8,
    thinFilm: true,
    shimmer: true,
    flowField: false,
    chromatic: true,
    kaleidoscope: false,
    vignette: true,
  },
  intense: {
    name: 'Intense',
    description: 'High-energy effects for powerful visuals',
    performance: 'high',
    deviceTier: 'high',
    estimatedGPUTime: 12.0,
    estimatedMemory: 16,
    thinFilm: true,
    shimmer: true,
    flowField: true,
    chromatic: true,
    kaleidoscope: false,
    vignette: true,
  },
  trip: {
    name: 'Trip Mode',
    description: 'Full psychedelic experience with all effects',
    performance: 'ultra',
    deviceTier: 'ultra',
    estimatedGPUTime: 16.0,
    estimatedMemory: 32,
    thinFilm: true,
    shimmer: true,
    flowField: true,
    chromatic: true,
    kaleidoscope: true,
    vignette: false, // Vignette disabled in trip mode for full immersion
  },
  custom: {
    name: 'Custom',
    description: 'User-defined effect combination',
    performance: 'medium',
    deviceTier: 'medium',
    estimatedGPUTime: 8.0,
    estimatedMemory: 12,
    thinFilm: false,
    shimmer: false,
    flowField: false,
    chromatic: false,
    kaleidoscope: false,
    vignette: false,
  },
};

export interface ShaderPresetSelectorProps {
  currentPreset: string;
  onPresetChange: (presetId: string) => void;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  disabled?: boolean;
  className?: string;
}

export function ShaderPresetSelector({
  currentPreset,
  onPresetChange,
  deviceTier,
  disabled = false,
  className = ''
}: ShaderPresetSelectorProps) {
  // Filter presets based on device tier
  const availablePresets = Object.entries(SHADER_PRESETS).filter(([_, preset]) => {
    if (preset.name === 'Custom') return true; // Always show custom
    return preset.deviceTier === deviceTier || 
           (deviceTier === 'ultra' && preset.deviceTier === 'high') ||
           (deviceTier === 'high' && preset.deviceTier === 'medium') ||
           (deviceTier === 'medium' && preset.deviceTier === 'low');
  });

  return (
    <div className={`shader-preset-selector ${className}`}>
      <label htmlFor="preset-select" className="block text-sm font-medium text-gray-700 mb-2">
        Visual Effects Preset
      </label>
      <select
        id="preset-select"
        value={currentPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {availablePresets.map(([presetId, preset]) => (
          <option key={presetId} value={presetId}>
            {preset.name} - {preset.description}
          </option>
        ))}
      </select>
      
      {currentPreset !== 'custom' && (
        <div className="mt-2 text-xs text-gray-500">
          <div>Performance: {SHADER_PRESETS[currentPreset]?.performance}</div>
          <div>GPU Time: ~{SHADER_PRESETS[currentPreset]?.estimatedGPUTime}ms</div>
          <div>Memory: ~{SHADER_PRESETS[currentPreset]?.estimatedMemory}MB</div>
        </div>
      )}
    </div>
  );
}

export interface ShaderEffectTogglesProps {
  effects: ShaderPreset;
  onEffectChange: (effect: keyof ShaderPreset, enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ShaderEffectToggles({
  effects,
  onEffectChange,
  disabled = false,
  className = ''
}: ShaderEffectTogglesProps) {
  const effectConfigs = [
    {
      key: 'thinFilm' as keyof ShaderPreset,
      label: 'Thin-Film Interference',
      description: 'Oil-on-water iridescence effect',
      performance: 'medium'
    },
    {
      key: 'shimmer' as keyof ShaderPreset,
      label: 'Iridescent Shimmer',
      description: 'Fresnel-based edge shimmer',
      performance: 'low'
    },
    {
      key: 'flowField' as keyof ShaderPreset,
      label: 'Flow Field Distortion',
      description: 'Organic UV distortion',
      performance: 'medium'
    },
    {
      key: 'chromatic' as keyof ShaderPreset,
      label: 'Chromatic Aberration',
      description: 'RGB channel split effect',
      performance: 'low'
    },
    {
      key: 'kaleidoscope' as keyof ShaderPreset,
      label: 'Kaleidoscope Mode',
      description: 'Radial symmetry (Trip Mode only)',
      performance: 'high'
    },
    {
      key: 'vignette' as keyof ShaderPreset,
      label: 'Vignette',
      description: 'Edge darkening effect',
      performance: 'low'
    }
  ];

  return (
    <div className={`shader-effect-toggles ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Individual Effects</h3>
      <div className="space-y-3">
        {effectConfigs.map(({ key, label, description, performance }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={effects[key]}
                  onChange={(e) => onEffectChange(key, e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </label>
            </div>
            <div className="text-xs text-gray-400">
              {performance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ShaderPresetManagerProps {
  currentPreset: string;
  currentEffects: ShaderPreset;
  onPresetChange: (presetId: string) => void;
  onEffectChange: (effect: keyof ShaderPreset, enabled: boolean) => void;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  disabled?: boolean;
  className?: string;
}

export function ShaderPresetManager({
  currentPreset,
  currentEffects,
  onPresetChange,
  onEffectChange,
  deviceTier,
  disabled = false,
  className = ''
}: ShaderPresetManagerProps) {
  const [showCustomToggles, setShowCustomToggles] = React.useState(false);

  const handlePresetChange = (presetId: string) => {
    onPresetChange(presetId);
    setShowCustomToggles(presetId === 'custom');
  };

  const handleEffectChange = (effect: keyof ShaderPreset, enabled: boolean) => {
    onEffectChange(effect, enabled);
    // Auto-switch to custom preset when manually changing effects
    if (currentPreset !== 'custom') {
      onPresetChange('custom');
      setShowCustomToggles(true);
    }
  };

  return (
    <div className={`shader-preset-manager ${className}`}>
      <ShaderPresetSelector
        currentPreset={currentPreset}
        onPresetChange={handlePresetChange}
        deviceTier={deviceTier}
        disabled={disabled}
        className="mb-6"
      />

      {(showCustomToggles || currentPreset === 'custom') && (
        <ShaderEffectToggles
          effects={currentEffects}
          onEffectChange={handleEffectChange}
          disabled={disabled}
        />
      )}

      {currentPreset !== 'custom' && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCustomToggles(!showCustomToggles)}
            disabled={disabled}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {showCustomToggles ? 'Hide' : 'Show'} Custom Controls
          </button>
        </div>
      )}
    </div>
  );
}

// Utility functions
export function getPresetForDeviceTier(deviceTier: 'low' | 'medium' | 'high' | 'ultra'): string {
  switch (deviceTier) {
    case 'low':
      return 'minimal';
    case 'medium':
      return 'classic';
    case 'high':
      return 'intense';
    case 'ultra':
      return 'trip';
    default:
      return 'classic';
  }
}

export function getPresetPerformance(presetId: string): {
  gpuTime: number;
  memory: number;
  performance: string;
} {
  const preset = SHADER_PRESETS[presetId];
  if (!preset) {
    return { gpuTime: 0, memory: 0, performance: 'unknown' };
  }

  return {
    gpuTime: preset.estimatedGPUTime,
    memory: preset.estimatedMemory,
    performance: preset.performance
  };
}

export function validatePresetForDevice(
  presetId: string, 
  deviceTier: 'low' | 'medium' | 'high' | 'ultra'
): boolean {
  const preset = SHADER_PRESETS[presetId];
  if (!preset) return false;

  // Check if device tier can handle the preset
  const tierOrder = ['low', 'medium', 'high', 'ultra'];
  const deviceIndex = tierOrder.indexOf(deviceTier);
  const presetIndex = tierOrder.indexOf(preset.deviceTier);

  return deviceIndex >= presetIndex;
}
