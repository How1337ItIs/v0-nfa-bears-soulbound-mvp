# Visual Orchestrator

Central provider and coordination layer for the liquid light system. It unifies device capability policy, global state (intensity, motion, mode), audio/palette services, and mounts visual layers conditionally.

## Files

- `lib/visual/VisualOrchestrator.tsx` — Main provider and layer renderer
- `lib/visual/VisualPolicy.ts` — Capability + preference policy, persistence
- `lib/visual/PerformanceMonitor.ts` — Performance metrics and utilities
- `lib/visual/performance/tierTransitionManager.ts` — Hysteresis tiering
- `lib/visual/capability/batterySaverPolicy.ts` — Battery saver enforcement
- `components/LiquidLightBackground.tsx` — WebGL fluid baseline (enhanced)
- `components/liquid-light/CSSFallback.tsx` — CSS fallback

## Usage

Wrap your app layout with the orchestrator (root-level):

```tsx
// app/layout.tsx
import VisualOrchestrator from '@/lib/visual/VisualOrchestrator';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VisualOrchestrator>
          {children}
        </VisualOrchestrator>
      </body>
    </html>
  );
}
```

## Dev Toggles

- `?debug=true` — Shows performance HUD and tier-change toasts
- `?pureMode=true` — Forces baseline-only visuals (CSS + WebGL fluid), disables thin-film and clamps target quality to MEDIUM

## Behavior

- Capability detection sets initial tier and quality presets
- Prefers-reduced-motion auto-disables motion by default
- Battery saver policy can force LOW or MEDIUM tiers on mobile/low battery
- Hysteresis tiering adjusts `quality.target` based on FPS with cooldowns
- Visibility optimization pauses motion when the tab is hidden
- Policy preferences persist in `localStorage` (`nfa-liquid-light-policy-prefs`)

## Passing State to Layers

Layers should accept orchestrator-provided props when available, but remain backwards compatible:

```tsx
<LiquidLightBackground
  intensity={policy.intensity}
  motionEnabled={policy.motionEnabled}
  tier={policy.performanceTier as 'low' | 'medium' | 'high'}
  audioData={audioData}
  palette={palette}
  className="fixed inset-0 -z-10"
/> 
```

## Notes

- Thin-film and other high-tier overlays should respect Pure Mode and performance gates.
- Keep heavy work behind dev toggles; avoid shipping debug-only code in prod bundles.

