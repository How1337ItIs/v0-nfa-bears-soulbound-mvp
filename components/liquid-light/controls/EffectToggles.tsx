/**
 * @file EffectToggles.tsx
 * @description UI controls for individual shader effect toggles
 */

import React from 'react';
import { ShaderPreset, ShaderPresetManager } from '../ShaderPresets';

export interface EffectTogglesProps {
  effects: ShaderPreset;
  onEffectChange: (effect: keyof ShaderPreset, enabled: boolean) => void;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  mode: 'ambient' | 'trip';
  disabled?: boolean;
  className?: string;
}

export function EffectToggles({
  effects,
  onEffectChange,
  deviceTier,
  mode,
  disabled = false,
  className = ''
}: EffectTogglesProps) {
  const effectConfigs = [
    {
      key: 'thinFilm' as keyof ShaderPreset,
      label: 'Thin-Film Interference',
      description: 'Oil-on-water iridescence effect',
      icon: '🌈',
      performance: 'medium',
      deviceTier: 'medium' as const,
      enabled: true
    },
    {
      key: 'shimmer' as keyof ShaderPreset,
      label: 'Iridescent Shimmer',
      description: 'Fresnel-based edge shimmer',
      icon: '✨',
      performance: 'low',
      deviceTier: 'low' as const,
      enabled: true
    },
    {
      key: 'flowField' as keyof ShaderPreset,
      label: 'Flow Field Distortion',
      description: 'Organic UV distortion',
      icon: '🌊',
      performance: 'medium',
      deviceTier: 'medium' as const,
      enabled: true
    },
    {
      key: 'chromatic' as keyof ShaderPreset,
      label: 'Chromatic Aberration',
      description: 'RGB channel split effect',
      icon: '🔴',
      performance: 'low',
      deviceTier: 'low' as const,
      enabled: true
    },
    {
      key: 'kaleidoscope' as keyof ShaderPreset,
      label: 'Kaleidoscope Mode',
      description: 'Radial symmetry (Trip Mode only)',
      icon: '🔮',
      performance: 'high',
      deviceTier: 'high' as const,
      enabled: mode === 'trip'
    },
    {
      key: 'vignette' as keyof ShaderPreset,
      label: 'Vignette',
      description: 'Edge darkening effect',
      icon: '🌑',
      performance: 'low',
      deviceTier: 'low' as const,
      enabled: true
    }
  ];

  const isEffectAvailable = (config: typeof effectConfigs[0]) => {
    // Check if device tier can handle the effect
    const tierOrder = ['low', 'medium', 'high', 'ultra'];
    const deviceIndex = tierOrder.indexOf(deviceTier);
    const effectIndex = tierOrder.indexOf(config.deviceTier);
    
    return deviceIndex >= effectIndex && config.enabled;
  };

  return (
    <div className={`effect-toggles ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Effects</h3>
        <p className="text-sm text-gray-600">
          Toggle individual effects on/off. Effects are automatically optimized for your device.
        </p>
      </div>

      <div className="space-y-4">
        {effectConfigs.map((config) => {
          const isAvailable = isEffectAvailable(config);
          const isDisabled = disabled || !isAvailable;
          
          return (
            <div
              key={config.key}
              className={`effect-toggle-item p-4 border rounded-lg transition-all duration-200 ${
                isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{config.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={effects[config.key]}
                          onChange={(e) => onEffectChange(config.key, e.target.checked)}
                          disabled={isDisabled}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {config.label}
                        </span>
                      </label>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {config.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    {config.performance}
                  </div>
                  {!isAvailable && (
                    <div className="text-xs text-red-500">
                      {config.key === 'kaleidoscope' && mode !== 'trip'
                        ? 'Trip Mode Only'
                        : 'Not Available'}
                    </div>
                  )}
                </div>
              </div>

              {/* Performance indicator */}
              {isAvailable && (
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      config.performance === 'low' ? 'bg-green-400' :
                      config.performance === 'medium' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    <span>Performance: {config.performance}</span>
                  </div>
                  <div>Device Tier: {config.deviceTier}+</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Device tier info */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">ℹ️</div>
          <div className="text-sm text-blue-800">
            <strong>Current Device Tier:</strong> {deviceTier}
            {mode === 'trip' && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                Trip Mode
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Effects are automatically optimized for your device's capabilities.
        </div>
      </div>
    </div>
  );
}

export interface EffectPresetControlsProps {
  currentPreset: string;
  currentEffects: ShaderPreset;
  onPresetChange: (presetId: string) => void;
  onEffectChange: (effect: keyof ShaderPreset, enabled: boolean) => void;
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
  mode: 'ambient' | 'trip';
  disabled?: boolean;
  className?: string;
}

export function EffectPresetControls({
  currentPreset,
  currentEffects,
  onPresetChange,
  onEffectChange,
  deviceTier,
  mode,
  disabled = false,
  className = ''
}: EffectPresetControlsProps) {
  return (
    <div className={`effect-preset-controls ${className}`}>
      <ShaderPresetManager
        currentPreset={currentPreset}
        currentEffects={currentEffects}
        onPresetChange={onPresetChange}
        onEffectChange={onEffectChange}
        deviceTier={deviceTier}
        disabled={disabled}
        className="mb-6"
      />

      <EffectToggles
        effects={currentEffects}
        onEffectChange={onEffectChange}
        deviceTier={deviceTier}
        mode={mode}
        disabled={disabled}
      />
    </div>
  );
}

export interface EffectQuickActionsProps {
  onReset: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  disabled?: boolean;
  className?: string;
}

export function EffectQuickActions({
  onReset,
  onMaximize,
  onMinimize,
  disabled = false,
  className = ''
}: EffectQuickActionsProps) {
  return (
    <div className={`effect-quick-actions ${className}`}>
      <div className="flex space-x-2">
        <button
          onClick={onReset}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={onMinimize}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Minimize
        </button>
        <button
          onClick={onMaximize}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Maximize
        </button>
      </div>
    </div>
  );
}
