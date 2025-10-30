/**
 * VISUAL POLICY MODULE
 * 
 * Centralized policy management for visual orchestration
 * Controls device capabilities, user preferences, and global flags
 * 
 * Based on Master Liquid Light Integration Plan (Week 2)
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { DeviceCapabilities } from './types';
import { detectDeviceCapabilities } from './CapabilityDetector';

export interface VisualPolicy {
  // Device capabilities
  capabilities: DeviceCapabilities;
  
  // Performance settings
  performanceTier: 'low' | 'medium' | 'high' | 'ultra';
  targetFPS: number;
  maxTextureSize: number;
  
  // User preferences
  motionEnabled: boolean;
  intensity: number; // 0-1 range
  prefersReducedMotion: boolean;
  
  // Visual settings
  paletteId: string;
  mode: 'ambient' | 'reactive' | 'performance' | 'accessibility';
  
  // Global flags
  webglEnabled: boolean;
  audioEnabled: boolean;
  thermalEnabled: boolean;
  thinFilmEnabled: boolean;
  thinFilmIntensity?: number; // 0-1 strength for thin-film blending
  audioSmoothingAlpha?: number; // 0.1-0.9 smoothing factor
  beatBurstMultiplier?: number; // 1.0-2.5 beat burst strength
  thinFilmQuality?: 'low' | 'medium' | 'high';
  
  // Quality settings
  fluidQuality: 'low' | 'medium' | 'high';
  particleCount: number;
  resolution: number;
  
  // Accessibility
  highContrast: boolean;
  colorBlindFriendly: boolean;
  reducedMotion: boolean;
}

export interface VisualPolicyConfig {
  // Override device detection
  forceCapabilities?: Partial<DeviceCapabilities>;
  
  // Override user preferences
  forceMotionEnabled?: boolean;
  forceIntensity?: number;
  forcePalette?: string;
  forceMode?: VisualPolicy['mode'];
  
  // Override global flags
  forceWebglEnabled?: boolean;
  forceAudioEnabled?: boolean;
  forceThermalEnabled?: boolean;
  forceThinFilmEnabled?: boolean;
  
  // Override quality settings
  forceFluidQuality?: VisualPolicy['fluidQuality'];
  forceParticleCount?: number;
  forceResolution?: number;
}

class VisualPolicyManager {
  private policy: VisualPolicy;
  private listeners: Set<(policy: VisualPolicy) => void> = new Set();

  constructor(config: VisualPolicyConfig = {}) {
    this.policy = this.createDefaultPolicy(config);
    this.initializePolicy(config);
  }

  private createDefaultPolicy(config: VisualPolicyConfig): VisualPolicy {
    const capabilities = config.forceCapabilities 
      ? { ...detectDeviceCapabilities(), ...config.forceCapabilities }
      : detectDeviceCapabilities();
    // Load saved preferences if available
    let saved: Partial<VisualPolicy> | null = null;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('nfa-liquid-light-policy-prefs');
        if (raw) saved = JSON.parse(raw);
      } catch {}
    }

    return {
      // Device capabilities
      capabilities,
      
      // Performance settings
      performanceTier: capabilities.tier,
      targetFPS: capabilities.mobile ? 30 : 60,
      maxTextureSize: capabilities.maxTextureSize,
      
      // User preferences
      motionEnabled: config.forceMotionEnabled ?? saved?.motionEnabled ?? true,
      intensity: config.forceIntensity ?? saved?.intensity ?? 1.0,
      prefersReducedMotion: false,
      
      // Visual settings
      paletteId: config.forcePalette ?? saved?.paletteId ?? 'psychedelic',
      mode: config.forceMode ?? saved?.mode ?? 'reactive',
      
      // Global flags
      webglEnabled: config.forceWebglEnabled ?? capabilities.webgl,
      audioEnabled: config.forceAudioEnabled ?? true,
      thermalEnabled: config.forceThermalEnabled ?? true,
      thinFilmEnabled: config.forceThinFilmEnabled ?? (capabilities.tier !== 'low'),
      thinFilmIntensity: saved?.thinFilmIntensity ?? 0.6,
      audioSmoothingAlpha: saved?.audioSmoothingAlpha ?? 0.3,
      beatBurstMultiplier: saved?.beatBurstMultiplier ?? 1.8,
      thinFilmQuality: ((): 'low' | 'medium' | 'high' => {
        switch (capabilities.tier) {
          case 'high': return 'high';
          case 'medium': return 'medium';
          default: return 'low';
        }
      })(),
      
      // Quality settings
      fluidQuality: config.forceFluidQuality ?? saved?.fluidQuality ?? this.getQualityForTier(capabilities.tier),
      particleCount: config.forceParticleCount ?? saved?.particleCount ?? this.getParticleCountForTier(capabilities.tier),
      resolution: config.forceResolution ?? saved?.resolution ?? this.getResolutionForTier(capabilities.tier),
      
      // Accessibility
      highContrast: false,
      colorBlindFriendly: false,
      reducedMotion: false,
    };
  }

  private initializePolicy(config: VisualPolicyConfig): void {
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.policy.prefersReducedMotion = mediaQuery.matches;
      this.policy.reducedMotion = mediaQuery.matches;
      
      if (mediaQuery.matches) {
        this.policy.motionEnabled = false;
      }

      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        this.policy.prefersReducedMotion = e.matches;
        this.policy.reducedMotion = e.matches;
        
        if (e.matches) {
          this.policy.motionEnabled = false;
        }
        
        this.notifyListeners();
      });
    }
  }

  private getQualityForTier(tier: string): 'low' | 'medium' | 'high' {
    switch (tier) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  private getParticleCountForTier(tier: string): number {
    switch (tier) {
      case 'high': return 10000;
      case 'medium': return 5000;
      case 'low': return 1000;
      default: return 5000;
    }
  }

  private getResolutionForTier(tier: string): number {
    switch (tier) {
      case 'high': return 1.0;
      case 'medium': return 0.75;
      case 'low': return 0.5;
      default: return 0.75;
    }
  }

  // Public API
  getPolicy(): VisualPolicy {
    return { ...this.policy };
  }

  updatePolicy(updates: Partial<VisualPolicy>): void {
    this.policy = { ...this.policy, ...updates };
    this.persistPrefs();
    this.notifyListeners();
  }

  updateCapabilities(capabilities: DeviceCapabilities): void {
    this.policy.capabilities = capabilities;
    this.policy.performanceTier = capabilities.tier;
    this.policy.targetFPS = capabilities.mobile ? 30 : 60;
    this.policy.maxTextureSize = capabilities.maxTextureSize;
    this.policy.webglEnabled = capabilities.webgl;
    this.policy.thinFilmEnabled = capabilities.tier !== 'low';
    
    // Recalculate quality settings
    this.policy.fluidQuality = this.getQualityForTier(capabilities.tier);
    this.policy.particleCount = this.getParticleCountForTier(capabilities.tier);
    this.policy.resolution = this.getResolutionForTier(capabilities.tier);
    
    this.notifyListeners();
  }

  setMotionEnabled(enabled: boolean): void {
    if (!this.policy.prefersReducedMotion) {
      this.policy.motionEnabled = enabled;
      this.persistPrefs();
      this.notifyListeners();
    }
  }

  setIntensity(intensity: number): void {
    this.policy.intensity = Math.max(0, Math.min(1, intensity));
    this.persistPrefs();
    this.notifyListeners();
  }

  setPalette(paletteId: string): void {
    this.policy.paletteId = paletteId;
    this.persistPrefs();
    this.notifyListeners();
  }

  setMode(mode: VisualPolicy['mode']): void {
    this.policy.mode = mode;
    this.persistPrefs();
    this.notifyListeners();
  }

  setAccessibilitySettings(settings: {
    highContrast?: boolean;
    colorBlindFriendly?: boolean;
    reducedMotion?: boolean;
  }): void {
    if (settings.highContrast !== undefined) {
      this.policy.highContrast = settings.highContrast;
    }
    if (settings.colorBlindFriendly !== undefined) {
      this.policy.colorBlindFriendly = settings.colorBlindFriendly;
    }
    if (settings.reducedMotion !== undefined) {
      this.policy.reducedMotion = settings.reducedMotion;
      if (settings.reducedMotion) {
        this.policy.motionEnabled = false;
      }
    }
    this.persistPrefs();
    this.notifyListeners();
  }

  private persistPrefs(): void {
    if (typeof window === 'undefined') return;
    try {
      const { motionEnabled, intensity, paletteId, mode, fluidQuality, particleCount, resolution, thinFilmIntensity, audioSmoothingAlpha, beatBurstMultiplier, thinFilmQuality } = this.policy;
      localStorage.setItem(
        'nfa-liquid-light-policy-prefs',
        JSON.stringify({ motionEnabled, intensity, paletteId, mode, fluidQuality, particleCount, resolution, thinFilmIntensity, audioSmoothingAlpha, beatBurstMultiplier, thinFilmQuality })
      );
    } catch {}
  }

  // Event system
  subscribe(listener: (policy: VisualPolicy) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getPolicy()));
  }

  // Utility methods
  shouldRenderWebGL(): boolean {
    return this.policy.webglEnabled && this.policy.capabilities.webgl;
  }

  shouldRenderCSSFallback(): boolean {
    return !this.shouldRenderWebGL();
  }

  shouldEnableAudio(): boolean {
    return this.policy.audioEnabled;
  }

  shouldEnableThermal(): boolean {
    return this.policy.thermalEnabled && this.policy.motionEnabled;
  }

  shouldEnableThinFilm(): boolean {
    return this.policy.thinFilmEnabled && this.policy.capabilities.tier !== 'low';
  }

  getEffectiveIntensity(): number {
    if (this.policy.reducedMotion) return 0.1;
    if (this.policy.mode === 'accessibility') return Math.min(0.5, this.policy.intensity);
    return this.policy.intensity;
  }

  getEffectiveParticleCount(): number {
    const base = this.policy.particleCount;
    const intensity = this.getEffectiveIntensity();
    return Math.round(base * intensity);
  }

  getEffectiveResolution(): number {
    const base = this.policy.resolution;
    const intensity = this.getEffectiveIntensity();
    return Math.max(0.25, base * intensity);
  }
}

// Singleton instance
let policyManager: VisualPolicyManager | null = null;

export function createVisualPolicyManager(config?: VisualPolicyConfig): VisualPolicyManager {
  if (!policyManager) {
    policyManager = new VisualPolicyManager(config);
  }
  return policyManager;
}

export function getVisualPolicyManager(): VisualPolicyManager {
  if (!policyManager) {
    throw new Error('VisualPolicyManager not initialized. Call createVisualPolicyManager first.');
  }
  return policyManager;
}

export function destroyVisualPolicyManager(): void {
  policyManager = null;
}

// React hook for using visual policy
export function useVisualPolicy() {
  const manager = getVisualPolicyManager();
  const [policy, setPolicy] = React.useState(manager.getPolicy());

  React.useEffect(() => {
    const unsubscribe = manager.subscribe(setPolicy);
    return unsubscribe;
  }, [manager]);

  return {
    policy,
    updatePolicy: manager.updatePolicy.bind(manager),
    setMotionEnabled: manager.setMotionEnabled.bind(manager),
    setIntensity: manager.setIntensity.bind(manager),
    setPalette: manager.setPalette.bind(manager),
    setMode: manager.setMode.bind(manager),
    setAccessibilitySettings: manager.setAccessibilitySettings.bind(manager),
    shouldRenderWebGL: manager.shouldRenderWebGL.bind(manager),
    shouldRenderCSSFallback: manager.shouldRenderCSSFallback.bind(manager),
    shouldEnableAudio: manager.shouldEnableAudio.bind(manager),
    shouldEnableThermal: manager.shouldEnableThermal.bind(manager),
    shouldEnableThinFilm: manager.shouldEnableThinFilm.bind(manager),
    getEffectiveIntensity: manager.getEffectiveIntensity.bind(manager),
    getEffectiveParticleCount: manager.getEffectiveParticleCount.bind(manager),
    getEffectiveResolution: manager.getEffectiveResolution.bind(manager),
  };
}

// Import React for the hook
import React from 'react';

