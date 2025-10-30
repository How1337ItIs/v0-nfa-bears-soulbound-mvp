'use client';

/**
 * KEYBOARD CONTROLS
 *
 * Full keyboard navigation for liquid light controls.
 * Ensures accessibility without mouse/touch input.
 *
 * Key Bindings:
 * - Space: Toggle motion
 * - M: Toggle audio reactivity
 * - Up/Down: Adjust intensity
 * - Left/Right: Change palette
 * - 1-7: Select song modes
 * - H: Toggle help
 * - ?: Show keyboard shortcuts
 *
 * Usage:
 * ```typescript
 * <KeyboardControls
 *   onIntensityChange={(val) => setIntensity(val)}
 *   onPaletteChange={(id) => setPalette(id)}
 *   enabled={true}
 * />
 * ```
 */

import React, { useEffect, useState } from 'react';
import { PaletteDirector } from '@/lib/palette';
import { getAllSongModes } from '@/lib/visual/songModes';

export interface KeyboardControlsProps {
  onIntensityChange?: (intensity: number) => void;
  onPaletteChange?: (paletteId: string) => void;
  onMotionToggle?: (enabled: boolean) => void;
  onAudioToggle?: (enabled: boolean) => void;
  onModeChange?: (mode: string) => void;
  enabled?: boolean;
}

export default function KeyboardControls({
  onIntensityChange,
  onPaletteChange,
  onMotionToggle,
  onAudioToggle,
  onModeChange,
  enabled = true,
}: KeyboardControlsProps) {
  const [intensity, setIntensity] = useState(0.6);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);

  const allPalettes = PaletteDirector.getAvailablePalettes();
  const songModes = getAllSongModes();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere with text input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        // Toggle motion
        case ' ':
          e.preventDefault();
          const newMotion = !motionEnabled;
          setMotionEnabled(newMotion);
          onMotionToggle?.(newMotion);
          break;

        // Toggle audio
        case 'm':
        case 'M':
          e.preventDefault();
          const newAudio = !audioEnabled;
          setAudioEnabled(newAudio);
          onAudioToggle?.(newAudio);
          break;

        // Increase intensity
        case 'ArrowUp':
          e.preventDefault();
          const newIntensityUp = Math.min(1, intensity + 0.1);
          setIntensity(newIntensityUp);
          onIntensityChange?.(newIntensityUp);
          break;

        // Decrease intensity
        case 'ArrowDown':
          e.preventDefault();
          const newIntensityDown = Math.max(0, intensity - 0.1);
          setIntensity(newIntensityDown);
          onIntensityChange?.(newIntensityDown);
          break;

        // Next palette
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = (currentPaletteIndex + 1) % allPalettes.length;
          setCurrentPaletteIndex(nextIndex);
          onPaletteChange?.(allPalettes[nextIndex]);
          break;

        // Previous palette
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = (currentPaletteIndex - 1 + allPalettes.length) % allPalettes.length;
          setCurrentPaletteIndex(prevIndex);
          onPaletteChange?.(allPalettes[prevIndex]);
          break;

        // Song mode shortcuts (1-7)
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          e.preventDefault();
          const modeIndex = parseInt(e.key) - 1;
          if (modeIndex < songModes.length) {
            onModeChange?.(songModes[modeIndex]);
          }
          break;

        // Toggle help
        case 'h':
        case 'H':
        case '?':
          e.preventDefault();
          setShowHelp(!showHelp);
          break;

        // Escape to close help
        case 'Escape':
          setShowHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled, intensity, motionEnabled, audioEnabled, showHelp, currentPaletteIndex]);

  return (
    <>
      {/* Keyboard shortcuts help overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-black/95 border border-white/20 rounded-lg p-8 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">⌨️ Keyboard Shortcuts</h2>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Basic Controls</h3>
                <KeyboardShortcut keys={['Space']} description="Toggle motion" />
                <KeyboardShortcut keys={['M']} description="Toggle audio reactivity" />
                <KeyboardShortcut keys={['↑']} description="Increase intensity" />
                <KeyboardShortcut keys={['↓']} description="Decrease intensity" />
                <KeyboardShortcut keys={['→']} description="Next palette" />
                <KeyboardShortcut keys={['←']} description="Previous palette" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Song Modes</h3>
                <KeyboardShortcut keys={['1']} description="Dark Star" />
                <KeyboardShortcut keys={['2']} description="Fire on the Mountain" />
                <KeyboardShortcut keys={['3']} description="China Cat Sunflower" />
                <KeyboardShortcut keys={['4']} description="Terrapin Station" />
                <KeyboardShortcut keys={['5']} description="Scarlet Begonias" />
                <KeyboardShortcut keys={['6']} description="Ambient Mode" />
                <KeyboardShortcut keys={['7']} description="Dance Floor Mode" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <KeyboardShortcut keys={['H', '?']} description="Toggle this help" />
              <KeyboardShortcut keys={['Esc']} description="Close help" />
            </div>

            <p className="mt-4 text-xs text-white/60 text-center">
              Press Escape or click outside to close
            </p>
          </div>
        </div>
      )}

      {/* Hidden skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
    </>
  );
}

/**
 * Keyboard shortcut display component
 */
function KeyboardShortcut({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex gap-1">
        {keys.map(key => (
          <kbd
            key={key}
            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs font-mono min-w-[32px] text-center"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span className="text-white/80">{description}</span>
    </div>
  );
}

/**
 * Hook for custom keyboard shortcuts
 * @param key - Key to listen for
 * @param callback - Function to call when key pressed
 * @param enabled - Whether listening is enabled
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === key || e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, callback, enabled]);
}
