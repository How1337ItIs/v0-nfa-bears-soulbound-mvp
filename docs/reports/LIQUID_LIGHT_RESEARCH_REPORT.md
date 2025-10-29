# Liquid Light Show Aesthetics — Internal Findings, External Research, and First-Principles Plan

Author: Codex CLI
Date: 2025-10-29

## Executive Summary

- Goal: Deliver authentic 1960s liquid light show aesthetics, applied consistently across the product with strong performance on mobile and desktop, plus reliable fallbacks.
- Current state: The repo contains multiple credible implementations (R3F thin-film shader, bespoke WebGL Navier–Stokes engine, WebGPU particles, and a production-oriented `webgl-fluid-enhanced` path) plus a robust starter kit. Each surfaced concrete blockers under real app constraints (mobile perf, context management, browser support, layering costs).
- Direction: Adopt a single “engine of record” for the base aesthetic (webgl-fluid baseline) with progressive enhancement for higher tiers (optional thin-film interference overlay). Centralize audio reactivity, device tiering, and FPS-driven step-up/step-down. Integrate once at the app root, expose lightweight cultural controls, and reuse across key views.
- Outcome: A production-first, testable integration that respects user devices, meets cultural authenticity, and avoids prior pitfalls (memory leaks, overdraw, unsupported features) while keeping a path open for future shader overlays.

---

## What We Tried Internally (Inventory + Observations)

Below summarizes the significant approaches and artifacts in this repo, what worked, and what didn’t in practice.

1) Authentic thin-film shader (React Three Fiber)
- Files: `components/authentic-liquid-light-engine.tsx`
- Essence: Orthographic full-screen plane in R3F; fragment shader implements wavelength-to-RGB + thin-film interference, curl noise, and audio-reactive parameters.
- Strengths:
  - High authenticity: models iridescence and oil thickness dynamics.
  - Easy to compose with R3F post-processing later.
- Pain points observed:
  - Mobile performance overhead from R3F runtime + shader complexity.
  - Overdraw + expensive fragment work on small GPUs; tuning required.
  - Integration friction when combined with other R3F scenes or UI timing.

2) Bespoke Navier–Stokes WebGL engine
- Files: `lib/fluid-simulation/FluidEngine.ts` (~900+ LOC), textures, framebuffers, shaders for advection/pressure/curl, audio mapping.
- Strengths:
  - Full control of physics and palette blending (Deadhead palettes).
  - Authentic pathway for long-term fidelity.
- Pain points observed:
  - Incomplete resource lifecycle in early drafts (FBO/texture management), leading to memory growth and potential context loss.
  - Costly to optimize across device tiers; duplication of effort vs. mature libs.

3) WebGPU particle/compute path
- Files: `components/WebGPUFluidSimulation.tsx`
- Strengths:
  - Massive headroom for particles/compute on supported devices.
- Pain points observed:
  - Limited browser support + feature flags (e.g., shader-f16), unpredictable across iOS/Android.
  - Shader compilation and adapter/device negotiation failures forced frequent fallbacks.

4) Thermal convection using `webgl-fluid-enhanced` (baseline)
- Files: `components/ThermalLiquidLight.tsx`, `components/LiquidLightBackground.tsx`, `lib/fluid/*`, `liquid-light-starter/*`
- Strengths:
  - Pragmatic: production-friendly baseline; simple API (`splat`, `start`, config).
  - Centralized audio reactivity (`lib/audio/useAudioReactive.ts`), device tier detection (`lib/fluid/config.ts`), FPS auto step-up/down, pointer-safe canvas.
  - Clean integration pattern for Next.js App Router.
- Pain points observed:
  - Layered multi-canvas compositions increase overdraw and memory; best used as a single background engine with occasional splats/overlays, not multiple stacked engines.
  - Requires careful canvas sizing at DPR and context loss handling.

Other related assets
- Variants and experiments: `WebGLFluidSimulation.tsx`, `EnhancedWebGLFluidSimulation.tsx`, `UltimateFluidSimulation.tsx`, `ModernFluidBackground.tsx`, etc.
- Logs: `fluid-debug-*.log` confirming API behavior of `webgl-fluid-enhanced` and interactive inputs.
- Plans: `LIQUID_LIGHT_ACTION_PLAN.md` and `cursor_observe_my_codebase.md` sections detail a layering strategy and test-page approach.

Bottom line: The “single engine of record” baseline with `webgl-fluid-enhanced` plus centralized audio/tiering delivered the most predictable, maintainable UX. R3F thin-film interference is visually compelling but should be gated to high tier to avoid mobile drops. WebGPU not suitable as a universal baseline yet.

---

## What Worked vs. What Failed (Synthesis)

What worked well
- Single background canvas with `pointer-events:none` keeps UI responsive.
- Device capability probe + FPS-driven auto tier switching.
- Central audio analyzer feeding all visuals with beat/magnitude mapping.
- “Thermal” and “slow rotation” splats create organic, always-moving feel without heavy math.
- Clear fallback chain: WebGL → CSS gradient.

What failed or caused friction
- R3F thin-film everywhere: performance dips on mobile, especially when combined with other 3D or post FX.
- Bespoke engine lifecycle: subtle GL resource leaks and incomplete framebuffer reuse.
- Multi-engine layering: overdraw and memory costs scale quickly; complexity snowballs.
- WebGPU availability and compile errors make it unreliable for broad audiences today.
- Canvas sizing/DPR mismatches caused soft blurs or excessive GPU cost if not clamped.

---

## External Research (Targeted Validation)

Notes below reflect established patterns and current ecosystem status. Key references are included for follow-up.

- Baseline fluid engine
  - Pavel Dobryakov’s WebGL Fluid Simulation (widely adopted) demonstrates a performant, visually rich baseline for dye/velocity advection and serves as a proven reference for parameters and optimizations.
  - Reference: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

- WebGPU adoption
  - Support is growing but not universal across mobile (iOS especially) and often gated by flags/capabilities. Not reliable as a baseline for an event-grade experience.
  - Reference: https://caniuse.com/webgpu

- Thin-film interference shaders
  - Common patterns on ShaderToy and graphics forums use wavelength sampling and optical path differences; visually compelling but fragment-costly. Use sparingly or at reduced resolution.
  - Reference example: https://www.shadertoy.com/ (search: thin film, iridescence)

- R3F performance considerations
  - Prefer orthographic full-screen plane, disable unnecessary passes, clamp DPR, avoid frequent material rebuilds; conditionally mount only on high tiers.
  - Reference: https://github.com/pmndrs/react-three-fiber

- OffscreenCanvas and perf hygiene
  - OffscreenCanvas + workers help CPU-side work but WebGL-in-worker isn’t universally supported; still beneficial to minimize main-thread work, coalesce RAF loops, and pause on `visibilitychange`.
  - Reference: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

- Debugging GPU pipelines
  - Spector.js helps surface FBO/texture leaks and expensive draw calls.
  - Reference: https://github.com/gre/spector.js

Practical takeaways
- Keep the baseline on mature WebGL fluid; layer advanced effects only on capable devices.
- Concentrate all animation through a single RAF loop per engine; avoid parallel loops.
- Aggressively handle context loss and resource cleanup.
- Use visual authenticity via palette, thermal motion, and subtle overlays instead of stacking heavy engines.

---

## First-Principles Plan (Production-First, Culturally Authentic)

North Star
- A single, reliable background engine that evokes authentic oil-on-water liquid light shows everywhere it meaningfully enhances the experience, with opt-in overlays for high-tier devices and tasteful cultural controls.

Principles
- Single engine of record for base motion (webgl-fluid baseline).
- Progressive enhancement for high-tier devices (R3F thin-film overlay, reduced resolution, gated by FPS and capability).
- Central audio analyzer with stable mappings (one source of truth).
- Strict resource hygiene: create once, reuse, dispose deterministically, handle context loss.
- Predictable fallbacks (CSS gradient) and user controls to disable animations, respecting reduced-motion.

Architecture
- App-level integration
  - Mount one full-viewport canvas in `app/layout.tsx` via `components/LiquidLightBackground.tsx` (already present and aligned with the starter pattern).
  - `pointer-events:none`, mixed blend mode (e.g., `screen`), tuned opacity for legibility.
- Capability + tiering
  - Use `lib/fluid/config.ts` detection and tier presets; clamp DPR; start from device tier.
  - Monitor FPS, step-down <25 FPS, step-up >50 FPS toward device max.
- Audio reactivity
  - `lib/audio/useAudioReactive.ts` as the sole analyzer; stable mapping to splat force, thermal rate, color phase, intensity.
  - Beat-triggered splats are short, sparse, and bounded.
- Organic motion
  - Thermal convection via timed upward splats near bottom; slow rotation path via tangential splats; occasional random perturbations.
- High-tier overlay (optional)
  - Mount `AuthenticLiquidLightEngine` at reduced resolution or lower opacity only on `tier==='high'` and when FPS is healthy.
  - Ensure overlay shares the same audio params; allow quick disable via settings.
- Fallbacks and guardrails
  - CSS gradient fallback when WebGL absent or context lost.
  - Pause on `visibilitychange`; resume gracefully.
  - Respect `prefers-reduced-motion` and provide a global toggle in settings.

Integration surfaces
- Global background: `app/layout.tsx`.
- Event/experience pages: enable “Dance Floor Mode” (full-screen intensified overlay) via a button; time-boxed and tier-gated.
- Success/celebration states after user actions (e.g., mint complete): trigger timed beat splats + palette shifts.
- Loading and interstitials: slow thermal-only motion to reduce cognitive load.

Performance & Reliability
- Clamp DPR to [1.0, 1.5] on mobile; auto-tier on load; collect FPS metric.
- Consolidate RAF; no per-effect loops beyond the engine and minimal timers.
- Verify cleanup paths (dispose textures/programs/framebuffers on unmount) for bespoke engines; for `webgl-fluid-enhanced`, call provided `dispose/stop`.
- Add `webglcontextlost`/`webglcontextrestored` handlers to re-init safely.

Accessibility & UX
- Toggle: “Turn On the Light” with modes “Dance Floor” and “Trip Mode” that map to preset intensities and palettes.
- Respect `prefers-reduced-motion`; default to minimal thermal motion.
- Cultural language in UI labels; Deadhead palettes are first-class presets.

Metrics & QA
- Instrument FPS and memory (approximate via texture sizes + counters if available), and record step-down events.
- Test matrix: iOS Safari mid/low devices; Android Chrome mid; Desktop Chrome/Edge/Firefox; high-tier Mac Safari.
- Use Spector.js locally to catch draw call spikes and resource leaks.

---

## Implementation Steps (Concrete and Minimal-Risk)

Phase 1 — Baseline Everywhere (1–2 days)
- Adopt `components/LiquidLightBackground.tsx` as the global background in `app/layout.tsx`.
- Ensure `lib/fluid/config.ts`, `lib/fluid/thermal.ts`, `lib/audio/useAudioReactive.ts` are wired to this instance (they already are in this repo).
- Verify FPS auto-tiering, pointer safety, context loss fallback, SSR guards.
- Add a simple settings toggle to disable or reduce intensity.

Phase 2 — Cultural Controls + Palette (1–2 days)
- Add presets for palettes (Dark Star, Fire on the Mountain, China Cat Sunflower) and expose a small UI to switch.
- Map UI modes (“Dance Floor”, “Trip Mode”) to intensity + thermal parameters.
- Add event-page hooks to temporarily increase intensity (time-boxed), then decay back.

Phase 3 — High-Tier Thin-Film Overlay (2–3 days)
- Gate `AuthenticLiquidLightEngine` to `tier==='high'` and FPS>50, at reduced opacity and resolution.
- Share audio params; clamp fragment work; provide an in-app switch to disable.
- Validate on desktop and flagship phones; default off for production then selectively enable with a feature flag.

Phase 4 — Hardening & QA (ongoing)
- Add `visibilitychange` pause/resume and destroy-on-unmount checks.
- Spector.js pass on desktop to ensure no unintended overdraw or leaks.
- E2E manual pass on target devices; log step-down frequency and adjust thresholds.

---

## Risks and Mitigations
- Mobile GPU headroom: Keep single-engine baseline; conservative defaults; aggressive step-down.
- Context loss and memory growth: Deterministic cleanup; restore handlers; avoid multi-engine stacks.
- Browser variance (iOS WebGL quirks): Clamp texture sizes and DPR; prefer mediump precision; test on iOS early.
- Accessibility: Provide an obvious off switch; respect reduced-motion.

---

## References (For Follow-Up)
- WebGL Fluid Simulation (baseline concepts and parameters):
  - https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- WebGPU support status:
  - https://caniuse.com/webgpu
- R3F (performance, integration patterns):
  - https://github.com/pmndrs/react-three-fiber
- Thin-film interference shaders (reference patterns):
  - https://www.shadertoy.com/ (search: iridescence, thin film)
- OffscreenCanvas (perf hygiene):
  - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- GPU debugging:
  - https://github.com/gre/spector.js

---

## Closing
This plan consolidates on a proven, production-friendly WebGL fluid baseline, layers authenticity through motion, palettes, and optional thin-film overlays, and builds in performance guardrails and fallbacks. It leverages the strong groundwork already present in this repo and aligns with event reliability and cultural goals.
