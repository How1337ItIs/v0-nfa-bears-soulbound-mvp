/**
 * @file audioPresets.ts
 * @description Audio processing presets for different music styles
 */

import { createBeatDetector, createDanceFloorDetector, createAmbientDetector } from './beatDetector';
import { createEnhancedAudioProcessor } from './mapping';
import type { BeatDetectorConfig } from './beatDetector';
import type { BeatGateConfig } from './mapping';

export interface AudioPreset {
  name: string;
  description: string;
  beatDetectorConfig: BeatDetectorConfig;
  beatGateConfig: BeatGateConfig;
  smoothingAlpha: number;
  color: string;
}

export const AUDIO_PRESETS: Record<string, AudioPreset> = {
  ambient: {
    name: 'Ambient',
    description: 'Gentle, flowing response for ambient music',
    beatDetectorConfig: {
      thresholdMultiplier: 1.8,
      refractoryPeriodMs: 200,
      bpmMin: 60,
      bpmMax: 120,
    },
    beatGateConfig: {
      burstMultiplier: 1.2,
      decayTime: 300,
      minInterval: 150,
    },
    smoothingAlpha: 0.2,
    color: '#8B5CF6',
  },

  electronic: {
    name: 'Electronic',
    description: 'Responsive to electronic and dance music',
    beatDetectorConfig: {
      thresholdMultiplier: 1.4,
      refractoryPeriodMs: 120,
      bpmMin: 100,
      bpmMax: 180,
    },
    beatGateConfig: {
      burstMultiplier: 1.6,
      decayTime: 150,
      minInterval: 80,
    },
    smoothingAlpha: 0.4,
    color: '#10B981',
  },

  rock: {
    name: 'Rock',
    description: 'Aggressive response for rock and metal',
    beatDetectorConfig: {
      thresholdMultiplier: 1.3,
      refractoryPeriodMs: 100,
      bpmMin: 80,
      bpmMax: 160,
    },
    beatGateConfig: {
      burstMultiplier: 1.8,
      decayTime: 100,
      minInterval: 60,
    },
    smoothingAlpha: 0.5,
    color: '#EF4444',
  },

  jazz: {
    name: 'Jazz',
    description: 'Smooth, musical response for jazz',
    beatDetectorConfig: {
      thresholdMultiplier: 1.6,
      refractoryPeriodMs: 180,
      bpmMin: 60,
      bpmMax: 140,
    },
    beatGateConfig: {
      burstMultiplier: 1.3,
      decayTime: 250,
      minInterval: 120,
    },
    smoothingAlpha: 0.3,
    color: '#F59E0B',
  },

  classical: {
    name: 'Classical',
    description: 'Subtle, elegant response for classical music',
    beatDetectorConfig: {
      thresholdMultiplier: 2.0,
      refractoryPeriodMs: 250,
      bpmMin: 40,
      bpmMax: 120,
    },
    beatGateConfig: {
      burstMultiplier: 1.1,
      decayTime: 400,
      minInterval: 200,
    },
    smoothingAlpha: 0.15,
    color: '#6366F1',
  },
};

/**
 * Create audio processor with preset configuration
 */
export function createAudioProcessorWithPreset(presetName: string) {
  const preset = AUDIO_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown audio preset: ${presetName}`);
  }

  const beatDetector = createBeatDetector(preset.beatDetectorConfig);
  const audioProcessor = createEnhancedAudioProcessor(
    preset.smoothingAlpha,
    preset.beatGateConfig
  );

  return {
    beatDetector,
    audioProcessor,
    preset,
  };
}

/**
 * Get all available preset names
 */
export function getAvailablePresets(): string[] {
  return Object.keys(AUDIO_PRESETS);
}

/**
 * Get preset by name
 */
export function getPreset(name: string): AudioPreset | null {
  return AUDIO_PRESETS[name] || null;
}
