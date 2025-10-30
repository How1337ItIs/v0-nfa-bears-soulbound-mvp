'use client';

/**
 * MOTION SICKNESS WARNING
 *
 * Displays warnings for users sensitive to motion and flashing lights.
 * Respects prefers-reduced-motion preference.
 *
 * Features:
 * - Photosensitive epilepsy warning
 * - Motion sickness warning
 * - Intensity level warnings
 * - Dismissible with localStorage
 * - Auto-disable for prefers-reduced-motion
 *
 * Usage:
 * ```typescript
 * <MotionWarning
 *   intensity={0.9}
 *   onAccept={() => setWarningAcknowledged(true)}
 *   onReduceMotion={() => setMotionEnabled(false)}
 * />
 * ```
 */

import React, { useEffect, useState } from 'react';

export interface MotionWarningProps {
  intensity?: number; // Current intensity (0-1)
  onAccept?: () => void;
  onReduceMotion?: () => void;
  onDismiss?: () => void;
}

export default function MotionWarning({
  intensity = 0.6,
  onAccept,
  onReduceMotion,
  onDismiss,
}: MotionWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Check if warning was previously dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem('motion-warning-dismissed') === 'true';
    setDismissed(wasDismissed);
  }, []);

  // Show warning if:
  // - High intensity (>0.7)
  // - Not previously dismissed
  // - User doesn't prefer reduced motion (they'll get auto-disabled anyway)
  useEffect(() => {
    const shouldShow = intensity > 0.7 && !dismissed && !prefersReducedMotion;
    setIsVisible(shouldShow);
  }, [intensity, dismissed, prefersReducedMotion]);

  const handleAccept = () => {
    localStorage.setItem('motion-warning-dismissed', 'true');
    setDismissed(true);
    setIsVisible(false);
    onAccept?.();
  };

  const handleReduceMotion = () => {
    localStorage.setItem('motion-warning-dismissed', 'true');
    setDismissed(true);
    setIsVisible(false);
    onReduceMotion?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-yellow-900/95 border-4 border-yellow-500 rounded-lg p-8 max-w-2xl shadow-2xl">
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <span className="text-6xl" role="img" aria-label="Warning">⚠️</span>
        </div>

        <h2 className="text-2xl font-bold text-yellow-100 mb-4 text-center">
          Motion & Photosensitivity Warning
        </h2>

        <div className="space-y-4 text-yellow-100">
          <p className="text-lg font-semibold">
            This experience contains:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Rapidly changing colors and patterns</li>
            <li>Flowing, animated visual effects</li>
            <li>Flashing lights synchronized to audio</li>
            <li>High-intensity psychedelic imagery</li>
          </ul>

          <div className="bg-red-900/50 border-2 border-red-500 rounded p-4 mt-4">
            <p className="font-bold text-red-100">
              ⚕️ Medical Warning
            </p>
            <p className="text-sm text-red-100 mt-2">
              If you have photosensitive epilepsy or are prone to motion sickness,
              consult a physician before use. Discontinue immediately if you experience:
            </p>
            <ul className="list-disc list-inside text-sm text-red-100 mt-2 ml-4">
              <li>Dizziness or nausea</li>
              <li>Disorientation or confusion</li>
              <li>Eye strain or headaches</li>
              <li>Seizures or convulsions</li>
            </ul>
          </div>

          <p className="text-sm text-yellow-200 mt-4">
            You can reduce motion effects at any time using the controls or
            by enabling "Reduce Motion" in your device settings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleAccept}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            I Understand, Continue
          </button>

          <button
            onClick={handleReduceMotion}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Enable Reduced Motion Mode
          </button>

          <button
            onClick={handleDismiss}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Dismiss
          </button>
        </div>

        <p className="text-xs text-yellow-200/60 text-center mt-4">
          This warning won't be shown again once dismissed.
        </p>
      </div>
    </div>
  );
}

/**
 * Check if motion warning should be shown
 * @param intensity - Current intensity level
 * @returns Whether warning should be shown
 */
export function shouldShowMotionWarning(intensity: number): boolean {
  const dismissed = localStorage.getItem('motion-warning-dismissed') === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return intensity > 0.7 && !dismissed && !prefersReduced;
}

/**
 * Reset motion warning (for testing)
 */
export function resetMotionWarning(): void {
  localStorage.removeItem('motion-warning-dismissed');
}
