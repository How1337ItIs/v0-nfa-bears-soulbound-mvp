# Codex → Claude Code: Mega Prompt Request and Status Report

Created: 2025-10-29

## Overview
- Implemented orchestrator, utilities, and integration per Master Plan and sprint prompt. Wrapped app with global visual provider, added adaptive policies, and hardened performance and UX.

## Implemented
- Utilities: `getClampedDPR`, `applyDPRToCanvas`, `TierTransitionManager` (hysteresis), `getBatterySaverPolicy`.
- Orchestrator: Hysteresis tiering, battery listeners/enforcement, Pure Mode (`?pureMode=true`), `?debug=true` HUD and toasts, visibility pause, localStorage persistence, policy manager auto-init.
- Layers: Z-index/blend strategy (CSS -50 normal; WebGL -40 screen; Thin-Film -30 screen; UI 10). Passed mapped `tier` prop to WebGL layer.
- Background: `components/LiquidLightBackground.tsx` accepts orchestrator props (intensity, motion, tier, audio, palette), pauses when hidden, DPR clamp on resize, preserves standalone behavior.
- Controls: `LiquidLightControls` updates `VisualPolicy` if callbacks missing; initializes from saved policy.
- Fallback: `CSSFallback` accepts `style` and respects orchestrator motion/intensity.
- App wrap: `app/layout.tsx` mounts `VisualOrchestrator` around the app.

## Tests & Docs
- Tests: `__tests__/unit/dprClamp.test.ts`, `__tests__/unit/tierTransitionManager.test.ts`, `__tests__/unit/batterySaverPolicy.test.ts`.
- Docs: `lib/visual/orchestrator/README.md` with setup, dev toggles, behavior, layer-props contract.
- Status: `THREE-AGENT-COORDINATION-STATUS.md` updated to reflect current execution.

## Integration Status
- End-to-end orchestration active; battery saver and adaptive tiering functional.
- Debug UX for tier and saver changes in place.
- Thin-film overlay placeholder is wired and gated; ready for shader/component drop-in.

## Open Items for Claude Code
- Thin-film overlay proper (shader + R3F wrapper) and gating/optimization.
- Enhanced audio: beat detection, tempo stabilization, smoother mappings.
- Palette normalization and song-specific presets expansion.
- Performance tuning of shaders; headless render snapshots for QA.
- Dev HUD enhancements and QA scripts.

## Request: New Mega Prompt (Massive Workload)
Please generate a new mega prompt targeting Weeks 2–4 advanced layers, performance, and QA. Coordinate with these workstreams and deliverables.

### Workstreams
- Thin-Film Overlay: Finalize physically-inspired thin-film shader; create `components/liquid-light/AuthenticThinFilm.tsx`; props: `enabled`, `intensity`, `phase`, `paletteRGB`, `performanceHint`.
- Audio Deepening: `lib/audio/beatDetector.ts` adaptive beat detection with refractory period; refine mappings with EMAs and soft-knees; ensure singleton analyzer hygiene and `dispose()` paths.
- Palette Science: `PaletteDirector` normalization utilities (sRGB/linear helpers) and palette expansion (`st-stephen`, `help-on-the-way`, `eyes-of-the-world`); export `getPaletteUniformRGB4()` and `getCSSGradientStops()`.
- Performance: GLSL micro-optimizations for thin-film; precompute invariants; pack uniforms; memory disposal on unmount; `withFrameBudget(fn, ms)` helper.
- QA & Artifacts: Headless render path with deterministic frames; golden images in `artifacts/thinfilm/`; scripts in `scripts/qa/*`.
- Dev Tools: `components/liquid-light/dev/PerformanceHUD.tsx` enhancements (FPS/tier/memory/battery/DPR), gated by `?debug=true` or dev.
- Battery/Power: Deeper saver heuristics and user override plumbing; non-spamming notifications.
- Docs: READMEs for palette, audio, performance; `lib/post/ThinFilmPass.md` integration contract and perf guidance.

### Deliverables
- Files: `lib/post/ThinFilmPass.tsx` or `components/liquid-light/AuthenticThinFilm.tsx`, `lib/audio/beatDetector.ts`, palette expansions in `lib/palette/PaletteDirector.ts` and `lib/palette/index.ts`, QA scripts and artifacts.
- Tests: Unit tests for beat detector and mapping; integration tests mounting thin-film with orchestrator stubs; golden-image diffs ≤2%.
- Performance: Desktop high-tier ≥55–60 FPS sustained with graceful degradation; auto-disable thin-film <45 FPS; zero memory growth after 5 hot remounts.
- Documentation: Clear usage + contracts for orchestrator wiring; dev toggle notes; troubleshooting section.

### Guardrails
- Do not modify `lib/visual/orchestrator/*` logic or overall policy wiring without coordination; provide composable components/hooks/utilities that we can mount.
- Keep new code additive and self-contained; adhere to z-index/blend plan; respect Pure Mode and performance gates.
- Export minimal, typed APIs; no global singletons beyond clearly named services.

### Coordination Paths
- Primary integration points: `lib/visual/VisualOrchestrator.tsx` layer render block; pass props to thin-film overlay similar to WebGL layer.
- Palette/Audio contracts: Use `PaletteDirector.getCurrentColorsRGB()` and orchestrator-provided `audioData`.
- Performance signals: Use our `TierTransitionManager` FPS thresholds for enabling/disabling heavy layers.

### Prompt Anchor
- Mirror and extend `CLAUDE-CODE-MASSIVE-TODO-LIST.md` to construct the next mega prompt; include 60–100 granular tasks across these workstreams with acceptance criteria and file paths.

If additional integration stubs or contracts would accelerate work, Codex can add them immediately.

