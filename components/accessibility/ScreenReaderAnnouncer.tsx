'use client';

/**
 * SCREEN READER ANNOUNCER
 *
 * Provides auditory descriptions of visual changes for screen reader users.
 * Announces palette changes, intensity adjustments, and audio reactivity.
 *
 * Features:
 * - ARIA live regions
 * - Polite vs assertive announcements
 * - Visual state descriptions
 * - Customizable verbosity
 *
 * Usage:
 * ```typescript
 * <ScreenReaderAnnouncer
 *   paletteId="dark-star"
 *   intensity={0.8}
 *   motionEnabled={true}
 *   audioReactive={true}
 * />
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { PaletteDirector } from '@/lib/palette';

export interface ScreenReaderAnnouncerProps {
  paletteId?: string;
  intensity?: number;
  motionEnabled?: boolean;
  audioReactive?: boolean;
  currentFPS?: number;
  deviceTier?: string;
  verbosity?: 'minimal' | 'standard' | 'detailed';
}

export default function ScreenReaderAnnouncer({
  paletteId,
  intensity = 0.6,
  motionEnabled = true,
  audioReactive = false,
  currentFPS,
  deviceTier,
  verbosity = 'standard',
}: ScreenReaderAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');
  const previousPalette = useRef(paletteId);
  const previousIntensity = useRef(intensity);
  const previousMotion = useRef(motionEnabled);
  const previousAudio = useRef(audioReactive);

  // Announce palette changes
  useEffect(() => {
    if (paletteId && paletteId !== previousPalette.current) {
      const palette = PaletteDirector.getPalette(paletteId);

      let message = `Color palette changed to ${palette.name}.`;

      if (verbosity === 'detailed') {
        message += ` ${palette.culturalContext}`;
        message += ` Energy level: ${palette.energy}.`;
      }

      setAnnouncement(message);
      previousPalette.current = paletteId;
    }
  }, [paletteId, verbosity]);

  // Announce intensity changes
  useEffect(() => {
    const diff = Math.abs(intensity - previousIntensity.current);

    if (diff > 0.2) { // Significant change
      const level =
        intensity > 0.8 ? 'very high' :
        intensity > 0.6 ? 'high' :
        intensity > 0.4 ? 'medium' :
        'low';

      setAnnouncement(`Visual intensity set to ${level} (${(intensity * 100).toFixed(0)}%).`);
      previousIntensity.current = intensity;
    }
  }, [intensity]);

  // Announce motion changes
  useEffect(() => {
    if (motionEnabled !== previousMotion.current) {
      setAnnouncement(
        motionEnabled
          ? 'Motion effects enabled. Animated liquid light visuals are now active.'
          : 'Motion effects disabled. Visuals are now static.'
      );
      previousMotion.current = motionEnabled;
    }
  }, [motionEnabled]);

  // Announce audio reactivity changes
  useEffect(() => {
    if (audioReactive !== previousAudio.current) {
      setAnnouncement(
        audioReactive
          ? 'Audio reactivity enabled. Visuals will respond to music.'
          : 'Audio reactivity disabled. Visuals are independent of audio.'
      );
      previousAudio.current = audioReactive;
    }
  }, [audioReactive]);

  // Announce performance issues
  useEffect(() => {
    if (currentFPS !== undefined && currentFPS < 30) {
      setAnnouncement(`Performance warning: Frame rate is low (${currentFPS.toFixed(0)} FPS). Consider reducing visual quality.`);
    }
  }, [currentFPS]);

  return (
    <>
      {/* Polite announcements (non-interrupting) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Screen reader only description of current state */}
      <div className="sr-only" aria-label="Visual state description">
        <p>
          Current liquid light visualization settings:
          Palette: {paletteId ? PaletteDirector.getPalette(paletteId).name : 'unknown'},
          Intensity: {(intensity * 100).toFixed(0)}%,
          Motion: {motionEnabled ? 'enabled' : 'disabled'},
          Audio reactive: {audioReactive ? 'yes' : 'no'}
          {deviceTier && `, Device tier: ${deviceTier}`}
          {currentFPS && `, Frame rate: ${currentFPS.toFixed(0)} FPS`}
        </p>
      </div>
    </>
  );
}

/**
 * Announce custom message to screen readers
 * @param message - Message to announce
 * @param priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  // Create temporary announcement element
  const announcer = document.createElement('div');
  announcer.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;

  document.body.appendChild(announcer);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}
