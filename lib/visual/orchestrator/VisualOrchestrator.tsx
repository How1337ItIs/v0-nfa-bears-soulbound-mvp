/**
 * VisualOrchestrator (Skeleton)
 *
 * Central React context/provider to coordinate visual layers using
 * capability-driven VisualPolicy and shared services (AudioBus, PaletteDirector).
 *
 * Week 2 foundation only — do not integrate or mount in the app yet.
 * Reference: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md (Orchestration section)
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { DeviceTier, AudioData, Palette, GlobalVisualState, VisualContextValue } from '../../types';

const defaultState: GlobalVisualState = {
  motionEnabled: true,
  intensity: 0.7,
  pureMode: false,
  selectedPalette: 'classic-60s',
  audioReactive: true,
  mode: 'ambient',
  batterySaver: false,
};

const VisualContext = createContext<VisualContextValue | null>(null);

export function VisualOrchestrator({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<GlobalVisualState>(defaultState);

  const setState = (updates: Partial<GlobalVisualState>) => {
    setStateInternal((prev) => ({ ...prev, ...updates }));
  };

  const value: VisualContextValue = useMemo(
    () => ({
      state,
      deviceTier: null, // populated by CapabilityDetector in Week 2
      audioData: null, // populated by AudioBus in Week 2
      palette: null, // populated by PaletteDirector in Week 2
      setState,
    }),
    [state]
  );

  return <VisualContext.Provider value={value}>{children}</VisualContext.Provider>;
}

export function useVisualState(): VisualContextValue {
  const ctx = useContext(VisualContext);
  if (!ctx) {
    throw new Error('useVisualState must be used within VisualOrchestrator');
    }
  return ctx;
}

