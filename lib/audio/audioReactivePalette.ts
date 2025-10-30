/**
 * @file audioReactivePalette.ts
 * @description Audio-reactive palette switching system
 */

import { PaletteDirector } from '@/lib/palette';
import type { AudioData } from './mapping';

export interface AudioReactivePaletteConfig {
  // Bass threshold for palette switching
  bassThreshold: number;
  // Mids threshold for palette switching
  midsThreshold: number;
  // Treble threshold for palette switching
  trebleThreshold: number;
  // Volume threshold for palette switching
  volumeThreshold: number;
  // Minimum time between palette switches (ms)
  minSwitchInterval: number;
  // Palette switching mode
  mode: 'automatic' | 'manual' | 'hybrid';
}

export class AudioReactivePalette {
  private config: Required<AudioReactivePaletteConfig>;
  private lastSwitchTime: number = 0;
  private currentPaletteIndex: number = 0;
  private availablePalettes: string[] = [];

  constructor(config: Partial<AudioReactivePaletteConfig> = {}) {
    this.config = {
      bassThreshold: config.bassThreshold ?? 0.7,
      midsThreshold: config.midsThreshold ?? 0.6,
      trebleThreshold: config.trebleThreshold ?? 0.5,
      volumeThreshold: config.volumeThreshold ?? 0.4,
      minSwitchInterval: config.minSwitchInterval ?? 5000,
      mode: config.mode ?? 'automatic',
    };

    this.availablePalettes = PaletteDirector.getAvailablePalettes();
  }

  /**
   * Update palette based on audio data
   */
  updatePalette(audioData: AudioData | null): string | null {
    if (!audioData || this.config.mode === 'manual') {
      return null;
    }

    const now = performance.now();
    const timeSinceLastSwitch = now - this.lastSwitchTime;

    // Check if enough time has passed
    if (timeSinceLastSwitch < this.config.minSwitchInterval) {
      return null;
    }

    // Determine which frequency band is dominant
    const dominantBand = this.getDominantBand(audioData);
    const shouldSwitch = this.shouldSwitchPalette(audioData, dominantBand);

    if (shouldSwitch) {
      const newPalette = this.selectPaletteForBand(dominantBand);
      if (newPalette) {
        this.currentPaletteIndex = this.availablePalettes.indexOf(newPalette);
        this.lastSwitchTime = now;
        PaletteDirector.setPalette(newPalette);
        return newPalette;
      }
    }

    return null;
  }

  /**
   * Manually switch to next palette
   */
  switchToNextPalette(): string {
    this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.availablePalettes.length;
    const palette = this.availablePalettes[this.currentPaletteIndex];
    PaletteDirector.setPalette(palette);
    this.lastSwitchTime = performance.now();
    return palette;
  }

  /**
   * Manually switch to specific palette
   */
  switchToPalette(paletteName: string): boolean {
    if (this.availablePalettes.includes(paletteName)) {
      PaletteDirector.setPalette(paletteName);
      this.currentPaletteIndex = this.availablePalettes.indexOf(paletteName);
      this.lastSwitchTime = performance.now();
      return true;
    }
    return false;
  }

  /**
   * Get current palette
   */
  getCurrentPalette(): string {
    return this.availablePalettes[this.currentPaletteIndex] || this.availablePalettes[0];
  }

  /**
   * Get available palettes
   */
  getAvailablePalettes(): string[] {
    return [...this.availablePalettes];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AudioReactivePaletteConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Determine which frequency band is dominant
   */
  private getDominantBand(audioData: AudioData): 'bass' | 'mids' | 'treble' {
    const { bass, mids, treble } = audioData;

    if (bass > mids && bass > treble) return 'bass';
    if (mids > bass && mids > treble) return 'mids';
    return 'treble';
  }

  /**
   * Check if palette should switch based on audio data
   */
  private shouldSwitchPalette(audioData: AudioData, dominantBand: string): boolean {
    const { bass, mids, treble, volume } = audioData;

    // Check volume threshold
    if (volume < this.config.volumeThreshold) {
      return false;
    }

    // Check dominant band threshold
    switch (dominantBand) {
      case 'bass':
        return bass > this.config.bassThreshold;
      case 'mids':
        return mids > this.config.midsThreshold;
      case 'treble':
        return treble > this.config.trebleThreshold;
      default:
        return false;
    }
  }

  /**
   * Select palette based on dominant frequency band
   */
  private selectPaletteForBand(band: string): string | null {
    const bandPalettes: Record<string, string[]> = {
      bass: ['fire-on-the-mountain', 'dark-star', 'psychedelic'],
      mids: ['electric-kool-aid', 'cosmic-charlie', 'space-odyssey'],
      treble: ['crystal-blue', 'cosmic-charlie', 'space-odyssey'],
    };

    const availableForBand = bandPalettes[band] || [];
    const validPalettes = availableForBand.filter(p => this.availablePalettes.includes(p));
    
    if (validPalettes.length === 0) {
      return null;
    }

    // Select random palette from valid options
    const randomIndex = Math.floor(Math.random() * validPalettes.length);
    return validPalettes[randomIndex];
  }
}

/**
 * Global audio-reactive palette instance
 */
export const globalAudioReactivePalette = new AudioReactivePalette();

/**
 * Create audio-reactive palette with custom configuration
 */
export function createAudioReactivePalette(config?: Partial<AudioReactivePaletteConfig>): AudioReactivePalette {
  return new AudioReactivePalette(config);
}
