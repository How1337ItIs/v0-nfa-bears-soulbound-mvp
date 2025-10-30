/**
 * @file effectPresetAnimations.ts
 * @description Animation system for transitioning between shader effect presets
 */

import type { ShaderPreset } from '@/components/liquid-light/ShaderPresets';

export interface AnimationConfig {
  duration: number; // milliseconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  delay?: number; // milliseconds
}

export interface PresetTransition {
  from: ShaderPreset;
  to: ShaderPreset;
  config: AnimationConfig;
  onProgress?: (progress: number, currentPreset: ShaderPreset) => void;
  onComplete?: () => void;
}

export class EffectPresetAnimator {
  private activeTransitions: Map<string, PresetTransition> = new Map();
  private animationFrameId: number | null = null;
  private isAnimating = false;

  /**
   * Animate transition between two presets
   */
  public animatePresetTransition(
    from: ShaderPreset,
    to: ShaderPreset,
    config: AnimationConfig = { duration: 1000, easing: 'ease-in-out' }
  ): Promise<ShaderPreset> {
    return new Promise((resolve) => {
      const transitionId = this.generateTransitionId();
      
      const transition: PresetTransition = {
        from: { ...from },
        to: { ...to },
        config,
        onComplete: () => {
          this.activeTransitions.delete(transitionId);
          resolve(to);
        }
      };

      this.activeTransitions.set(transitionId, transition);
      this.startAnimationLoop();
    });
  }

  /**
   * Animate multiple effects simultaneously
   */
  public animateMultipleEffects(
    currentPreset: ShaderPreset,
    targetEffects: Partial<ShaderPreset>,
    config: AnimationConfig = { duration: 800, easing: 'ease-out' }
  ): Promise<ShaderPreset> {
    const to: ShaderPreset = {
      thinFilm: targetEffects.thinFilm ?? currentPreset.thinFilm,
      shimmer: targetEffects.shimmer ?? currentPreset.shimmer,
      flowField: targetEffects.flowField ?? currentPreset.flowField,
      chromatic: targetEffects.chromatic ?? currentPreset.chromatic,
      kaleidoscope: targetEffects.kaleidoscope ?? currentPreset.kaleidoscope,
      vignette: targetEffects.vignette ?? currentPreset.vignette,
    };

    return this.animatePresetTransition(currentPreset, to, config);
  }

  /**
   * Animate effect intensity changes
   */
  public animateIntensityChange(
    currentPreset: ShaderPreset,
    intensity: number,
    config: AnimationConfig = { duration: 500, easing: 'ease-out' }
  ): Promise<ShaderPreset> {
    // Create a modified preset based on intensity
    const to: ShaderPreset = {
      thinFilm: currentPreset.thinFilm && intensity > 0.3,
      shimmer: currentPreset.shimmer && intensity > 0.2,
      flowField: currentPreset.flowField && intensity > 0.4,
      chromatic: currentPreset.chromatic && intensity > 0.1,
      kaleidoscope: currentPreset.kaleidoscope && intensity > 0.8,
      vignette: currentPreset.vignette && intensity > 0.1,
    };

    return this.animatePresetTransition(currentPreset, to, config);
  }

  /**
   * Stop all active animations
   */
  public stopAllAnimations(): void {
    this.activeTransitions.clear();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isAnimating = false;
  }

  /**
   * Get current animated preset (interpolated between from and to)
   */
  public getCurrentPreset(): ShaderPreset | null {
    if (this.activeTransitions.size === 0) return null;

    // For simplicity, return the most recent transition's current state
    const latestTransition = Array.from(this.activeTransitions.values()).pop();
    if (!latestTransition) return null;

    return this.interpolatePreset(
      latestTransition.from,
      latestTransition.to,
      latestTransition.config
    );
  }

  private startAnimationLoop(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
  }

  private animationLoop(): void {
    const now = performance.now();
    const transitionsToRemove: string[] = [];

    for (const [transitionId, transition] of this.activeTransitions) {
      const elapsed = now - (transition as any).startTime;
      const progress = Math.min(elapsed / transition.config.duration, 1);
      
      const easedProgress = this.applyEasing(progress, transition.config.easing);
      
      const currentPreset = this.interpolatePreset(
        transition.from,
        transition.to,
        { ...transition.config, progress: easedProgress }
      );

      // Call progress callback
      transition.onProgress?.(easedProgress, currentPreset);

      if (progress >= 1) {
        // Animation complete
        transition.onComplete?.();
        transitionsToRemove.push(transitionId);
      }
    }

    // Remove completed transitions
    transitionsToRemove.forEach(id => this.activeTransitions.delete(id));

    // Continue animation if there are active transitions
    if (this.activeTransitions.size > 0) {
      this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
    } else {
      this.isAnimating = false;
      this.animationFrameId = null;
    }
  }

  private interpolatePreset(
    from: ShaderPreset,
    to: ShaderPreset,
    config: AnimationConfig & { progress?: number }
  ): ShaderPreset {
    const progress = config.progress ?? 0;
    
    return {
      thinFilm: this.interpolateBoolean(from.thinFilm, to.thinFilm, progress),
      shimmer: this.interpolateBoolean(from.shimmer, to.shimmer, progress),
      flowField: this.interpolateBoolean(from.flowField, to.flowField, progress),
      chromatic: this.interpolateBoolean(from.chromatic, to.chromatic, progress),
      kaleidoscope: this.interpolateBoolean(from.kaleidoscope, to.kaleidoscope, progress),
      vignette: this.interpolateBoolean(from.vignette, to.vignette, progress),
    };
  }

  private interpolateBoolean(from: boolean, to: boolean, progress: number): boolean {
    if (from === to) return from;
    
    // For boolean values, we use a threshold approach
    // Effects turn on/off at 50% progress
    return progress > 0.5 ? to : from;
  }

  private applyEasing(progress: number, easing: AnimationConfig['easing']): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'spring':
        return 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI);
      default:
        return progress;
    }
  }

  private generateTransitionId(): string {
    return `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Global animator instance
export const effectPresetAnimator = new EffectPresetAnimator();

// Utility functions for common animations
export const EffectAnimations = {
  /**
   * Fade in effect
   */
  fadeIn: (preset: ShaderPreset, duration = 1000): Promise<ShaderPreset> => {
    const emptyPreset: ShaderPreset = {
      thinFilm: false,
      shimmer: false,
      flowField: false,
      chromatic: false,
      kaleidoscope: false,
      vignette: false,
    };
    
    return effectPresetAnimator.animatePresetTransition(
      emptyPreset,
      preset,
      { duration, easing: 'ease-out' }
    );
  },

  /**
   * Fade out effect
   */
  fadeOut: (preset: ShaderPreset, duration = 1000): Promise<ShaderPreset> => {
    const emptyPreset: ShaderPreset = {
      thinFilm: false,
      shimmer: false,
      flowField: false,
      chromatic: false,
      kaleidoscope: false,
      vignette: false,
    };
    
    return effectPresetAnimator.animatePresetTransition(
      preset,
      emptyPreset,
      { duration, easing: 'ease-in' }
    );
  },

  /**
   * Crossfade between presets
   */
  crossfade: (
    from: ShaderPreset,
    to: ShaderPreset,
    duration = 1200
  ): Promise<ShaderPreset> => {
    return effectPresetAnimator.animatePresetTransition(
      from,
      to,
      { duration, easing: 'ease-in-out' }
    );
  },

  /**
   * Spring transition
   */
  spring: (
    from: ShaderPreset,
    to: ShaderPreset,
    duration = 800
  ): Promise<ShaderPreset> => {
    return effectPresetAnimator.animatePresetTransition(
      from,
      to,
      { duration, easing: 'spring' }
    );
  },

  /**
   * Quick toggle
   */
  quickToggle: (
    from: ShaderPreset,
    to: ShaderPreset,
    duration = 300
  ): Promise<ShaderPreset> => {
    return effectPresetAnimator.animatePresetTransition(
      from,
      to,
      { duration, easing: 'ease-out' }
    );
  }
};

// React hook for using animations
export function useEffectPresetAnimation() {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [currentPreset, setCurrentPreset] = React.useState<ShaderPreset | null>(null);

  const animateTransition = React.useCallback(
    async (from: ShaderPreset, to: ShaderPreset, config?: AnimationConfig) => {
      setIsAnimating(true);
      
      try {
        const result = await effectPresetAnimator.animatePresetTransition(
          from,
          to,
          config || { duration: 1000, easing: 'ease-in-out' }
        );
        
        setCurrentPreset(result);
        return result;
      } finally {
        setIsAnimating(false);
      }
    },
    []
  );

  const stopAnimation = React.useCallback(() => {
    effectPresetAnimator.stopAllAnimations();
    setIsAnimating(false);
  }, []);

  return {
    isAnimating,
    currentPreset,
    animateTransition,
    stopAnimation
  };
}
