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

## Integration with Claude Code Services

### Audio Pipeline
- Uses `createEnhancedAudioProcessor` and `calculateEnhancedPhysicsParams` for smoothing, curves, and beat gating.
- Beat detection via `BeatDetector` (`createAmbientDetector` for ambient mode, `createDanceFloorDetector` for reactive mode).

### Palette Management
- Orchestrator syncs `policy.paletteId` to `PaletteDirector.setCurrentPalette()`.
- Thin-film fetches shader-ready RGB via `PaletteDirector.getCurrentColorsRGB()`.

### Thin-Film Overlay
- Mounted via `AuthenticThinFilmEffect` at z-index -30.
- Enabled on medium/high tiers, auto-disabled under 45 FPS and in Pure Mode.
- Intensity controlled by `policy.thinFilmIntensity` (0–1).
- Quality controlled by `policy.thinFilmQuality` (low=off, medium, high).

### Performance HUD

### Palette Rotation
- Optional auto-rotate via URL params:
  - `?autoPalette=true` enables rotation
  - `&paletteInterval=20` sets rotation interval in seconds (default 20)
  - Uses `PaletteAnimator` to blend between palettes.
- `components/liquid-light/dev/PerformanceHUD` renders when `?debug=true` or in development.
- Shows FPS, tier, DPR, audio levels, and BPM when available.
