'use client';

/**
 * ARIA LABELS SYSTEM
 *
 * Provides semantic ARIA labels for all interactive elements.
 * Ensures screen readers can properly navigate and understand controls.
 *
 * Features:
 * - Pre-built label templates
 * - Dynamic state descriptions
 * - Live region announcements
 * - Role definitions
 *
 * Usage:
 * ```typescript
 * import { getAriaLabel, withAriaLabel } from '@/components/accessibility/AriaLabels';
 *
 * <button {...getAriaLabel('intensity-slider', { value: 80 })}>
 *   Intensity
 * </button>
 * ```
 */

import React from 'react';

/**
 * ARIA label templates
 */
export const ARIA_LABELS = {
  // Controls
  'intensity-slider': (state: { value: number }) =>
    `Intensity slider, current value ${state.value} percent`,

  'palette-selector': (state: { paletteName: string }) =>
    `Color palette selector, current palette is ${state.paletteName}`,

  'motion-toggle': (state: { enabled: boolean }) =>
    `Motion effects ${state.enabled ? 'enabled' : 'disabled'}, toggle to ${state.enabled ? 'disable' : 'enable'}`,

  'audio-toggle': (state: { enabled: boolean }) =>
    `Audio reactivity ${state.enabled ? 'enabled' : 'disabled'}, toggle to ${state.enabled ? 'disable' : 'enable'}`,

  'mode-selector': (state: { mode: string }) =>
    `Visual mode selector, current mode is ${state.mode}`,

  'song-mode-selector': (state: { song: string }) =>
    `Song visual mode, currently ${state.song}`,

  // Effects
  'thin-film-toggle': (state: { enabled: boolean }) =>
    `Thin-film interference effect ${state.enabled ? 'enabled' : 'disabled'}`,

  'kaleidoscope-toggle': (state: { enabled: boolean }) =>
    `Kaleidoscope effect ${state.enabled ? 'enabled' : 'disabled'}`,

  // Performance
  'fps-display': (state: { fps: number }) =>
    `Frame rate: ${state.fps} frames per second`,

  'tier-display': (state: { tier: string }) =>
    `Performance tier: ${state.tier}`,

  // Info
  'cultural-context': (state: { context: string }) =>
    `Cultural context: ${state.context}`,
};

/**
 * Get ARIA label attributes
 * @param labelKey - Label template key
 * @param state - State values for template
 * @returns ARIA attributes object
 */
export function getAriaLabel(labelKey: keyof typeof ARIA_LABELS, state: any = {}): {
  'aria-label': string;
} {
  const template = ARIA_LABELS[labelKey];

  if (!template) {
    console.warn(`[AriaLabels] Unknown label key: ${labelKey}`);
    return { 'aria-label': '' };
  }

  return {
    'aria-label': template(state),
  };
}

/**
 * HOC to add ARIA labels to component
 * @param Component - React component
 * @param labelKey - Label template key
 * @returns Wrapped component with ARIA labels
 */
export function withAriaLabel<P extends object>(
  Component: React.ComponentType<P>,
  labelKey: keyof typeof ARIA_LABELS
) {
  return function AriaLabeledComponent(props: P & { ariaState?: any }) {
    const { ariaState, ...restProps } = props as any;
    const ariaProps = getAriaLabel(labelKey, ariaState || {});

    return <Component {...(restProps as P)} {...ariaProps} />;
  };
}

/**
 * ARIA live region for announcements
 */
export function AriaLiveRegion({
  message,
  priority = 'polite',
}: {
  message: string;
  priority?: 'polite' | 'assertive';
}) {
  return (
    <div
      role={priority === 'assertive' ? 'alert' : 'status'}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Accessible slider with ARIA
 */
export function AccessibleSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '',
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  unit?: string;
}) {
  return (
    <div className="accessible-slider">
      <label
        htmlFor={`slider-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className="block text-sm font-medium mb-2"
      >
        {label}
      </label>
      <input
        type="range"
        id={`slider-${label.toLowerCase().replace(/\s+/g, '-')}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        aria-label={`${label}, current value ${value}${unit}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-white/60 mt-1">
        <span>{min}{unit}</span>
        <span aria-live="polite">{value}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

/**
 * Accessible toggle button
 */
export function AccessibleToggle({
  label,
  enabled,
  onChange,
  description,
}: {
  label: string;
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label}, currently ${enabled ? 'enabled' : 'disabled'}`}
      aria-describedby={description ? `${label}-description` : undefined}
      onClick={() => onChange?.(!enabled)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${enabled ? 'bg-purple-600' : 'bg-gray-600'}
      `}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
      {description && (
        <span id={`${label}-description`} className="sr-only">
          {description}
        </span>
      )}
    </button>
  );
}
