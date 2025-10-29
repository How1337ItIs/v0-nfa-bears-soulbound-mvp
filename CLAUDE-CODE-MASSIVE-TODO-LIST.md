# CLAUDE CODE: MASSIVE WEEK 2–4 IMPLEMENTATION BACKLOG
## Parallel with Codex CLI (orchestration) and Cursor (integration)

Created: 2025-10-29
Scope: Weeks 2–4 of Master Liquid Light Integration Plan (thin-film + audio/color science + performance + docs)
Goal: Deliver culturally authentic, performant liquid light visuals with zero-crash reliability

---

## Coordination & Guardrails

- Ownership: You focus on physics/math/GLSL/audio/color science and high-tier overlays.
- Avoid overlaps: Do not modify `lib/visual/orchestrator/*`, `lib/visual/VisualPolicy.ts`, or integration glue in `components/LiquidLightBackground.tsx` unless asked. Cursor and Codex own those.
- Shared modules: You own `lib/palette/*`, `lib/audio/*` (mappings/analysis), `lib/post/ThinFilmPass.tsx`, and new `components/liquid-light/*` overlays/dev tools.
- Commit prefix: `[Claude Code] <concise change>`
- Reference docs: `CURSOR-MASSIVE-TODO-LIST.md`, `CODEX-MASSIVE-IMPLEMENTATION-SPRINT.md`, `docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md`.

---

## Workstream A — Thin-Film Interference Overlay (R3F) [Week 2 Core]

- Shader upgrade: Refine thin-film fragment shader in `lib/post/ThinFilmPass.tsx`.
  - Add physically-inspired phase shift from thickness and incident angle.
  - Inputs: `thickness`, `ior`, `lightDir`, `viewDir`, `paletteRGB[4]`.
  - Optimize for mobile: branchless math, reduce texture lookups, uniform arrays.
  - Acceptance: ≥55 FPS on desktop tier high, auto-disable <45 FPS.

- New component: `components/liquid-light/AuthenticThinFilm.tsx`.
  - Wrap the pass for easy mount by orchestrator.
  - Props: `enabled`, `intensity`, `phase`, `paletteRGB`, `performanceHint`.
  - Style: `mixBlendMode: 'screen' | 'overlay'` param; default to `screen`.
  - Acceptance: Renders over WebGL fluid with adjustable opacity and blend.

- Quality tiers for thin-film:
  - Low: disabled.
  - Medium: disabled by default; user opt-in only.
  - High: 512×512 max internal quad, single octave interference.
  - Ultra: 1024×512 or dual-octave; only when deviceTier==='ultra'.
  - Acceptance: Policy-check methods return expected enablement per tier.

- Gating and safety:
  - Respect `pureMode`: always off.
  - Auto-disable if `fps<45` for 3 seconds; re-enable >50 for 5 seconds.
  - Hook into `window.visibilitychange`: pause when hidden.
  - Acceptance: Manual QA script demonstrating enable/disable transitions.

- Audio reactivity mapping (overlay):
  - Bass→thickness jitter, Mids→phase sweep, Treble→highlight sparkle.
  - Clamp and smooth via exponential moving average.
  - Acceptance: Visual change tracks band energy without flicker.

- Palette integration:
  - Use `PaletteDirector.getCurrentColorsRGB()` as shader uniform array.
  - Interpolate between two adjacent palette colors based on tempo phase.
  - Acceptance: Measurably uses palette indices (unit test on uniform packing).

- Dev controls (development only):
  - Add `?debug-thinfilm=true` to render a compact control panel (thickness, ior, blend mode, intensity).
  - Acceptance: Panel appears only in dev or with URL param; no prod bundle bloat (>+6KB limit).

- Visual tests and snapshots:
  - Export a headless render path for 3–5 deterministic frames with fixed uniforms; save PNGs to `artifacts/thinfilm/`.
  - Acceptance: Golden image diff ≤2% per frame.

---

## Workstream B — Audio Analysis & Physics Mapping [Week 2 Core]

- Enhance `lib/audio/mapping.ts` functions:
  - Curves: piecewise linear with soft knee; expose `alpha` for EMAs per band.
  - Add beat gating for splat force burst; debounced by tempo.
  - Acceptance: Unit tests cover high/low inputs and null audio.

- Tempo/beat utilities:
  - File: `lib/audio/beatDetector.ts`.
  - Adaptive threshold with refractory period; export `{ isBeat, bpmEstimate }`.
  - Acceptance: Synthetic test signals produce expected beat sequences.

- AudioBus hygiene:
  - Ensure singleton analyzer; expose `AudioLevels` typed object; add `dispose()`.
  - Acceptance: No analyzer duplication across layers; memory stable in profiler.

- Simulated audio fallback:
  - Deterministic pseudo-audio generator when mic denied; param via URL `?audioSim`.
  - Acceptance: Visuals animate without microphone; no errors.

---

## Workstream C — Color Science & Tone Normalization [Week 3]

- PaletteDirector refinements (`lib/palette/PaletteDirector.ts`):
  - Add `getNormalizedSRGB()` to unify output gamma for CSS/WebGL/R3F.
  - Add `palette transitions` with perceptual ramp (Oklab/Lch approximation via constants to avoid heavy deps) – optional if light.
  - Acceptance: CSS gradients and shader colors visually match within tolerance.

- Palette expansion:
  - Add palettes: `st-stephen`, `help-on-the-way`, `eyes-of-the-world`.
  - Each with `colors`, `wavelengths`, `culturalContext`, `energy`, `viscosity`.
  - Acceptance: `getSongPalettes()` returns >=8 entries; tests assert ids.

- Cross-layer color contract:
  - Add `lib/palette/index.ts` export helpers: `getPaletteUniformRGB4()` for shaders, `getCSSGradientStops()` for fallback.
  - Acceptance: LiquidLightBackground, CSSFallback, ThinFilm use same helpers.

---

## Workstream D — Capability & Policy Helpers [Week 2]

- DPR clamp utility: `lib/visual/utils/dprClamp.ts`.
  - `getClampedDPR()` with 1.5 (mobile) / 2.0 (desktop) caps and UA heuristic.
  - `applyDPRToCanvas(canvas)`; acceptance: 4K desktop clamps at 2.0, iPhone clamps at 1.5.

- Battery saver policy: `lib/visual/capability/batterySaverPolicy.ts`.
  - Rules: <20% and not charging → Force LOW; <50% and mobile → MEDIUM; power saver → LOW; user override supported.
  - Acceptance: Unit tests for rule table; mock Battery API paths.

- Tier hysteresis logic helper: `lib/visual/performance/tierTransitionManager.ts`.
  - Step-down after 2s <25 FPS; step-up after 3s >50 FPS; 5s cooldown.
  - Export pure functions for easy testing.
  - Acceptance: Deterministic tests for transitions and cooldown.

Note: Codex will wire these into orchestrator; you supply clean, pure utilities with tests.

---

## Workstream E — Performance Profiling & Hardening [Week 4]

- GLSL micro-optimizations:
  - Replace pow with polynomial approximations where feasible.
  - Precompute invariant terms; pack uniforms; remove dynamic branches.
  - Acceptance: ≥10% GPU time improvement in thin-film on desktop.

- Memory audits:
  - Ensure all buffers/textures are disposed on unmount; add `cleanup()` pathways for overlays.
  - Acceptance: Chrome heap snapshot shows no growth after 5 hot remounts.

- RAF budgeting helpers:
  - Export `withFrameBudget(fn, budgetMs)` to early-exit heavy math when over budget.
  - Acceptance: Under stress, visual quality gracefully degrades without jank.

- Context loss handling:
  - Listen for `webglcontextlost`/`restored` on canvases; auto-fallback to CSS without white flash.
  - Acceptance: Manual DevTools context loss test passes; UX uninterrupted.

---

## Workstream F — Cultural Features & Presets [Week 3]

- Mode-to-parameter maps:
  - Extend `MODE_PRESETS` with nuanced ranges per song palette (e.g., `dark-star` lower velocity, higher curl; `fire-on-the-mountain` higher splat cadence).
  - Acceptance: Visuals noticeably differ across song presets, documented.

- Global rotation & thermal authenticity:
  - Document constants and recommended defaults for thermal convection upward bias and slow rotation; expose to orchestrator.
  - Acceptance: Two reference tweaks with before/after GIFs.

---

## Workstream G — Developer Tooling & HUD [Week 2–3]

- `components/liquid-light/dev/PerformanceHUD.tsx`:
  - Show FPS, tier, audio levels per band, battery, DPR, memory; gated by `?debug=true` or dev env.
  - Acceptance: HUD overlays unobtrusively; costs <1ms/frame.

- Logging helpers:
  - `lib/visual/dev/log.ts`: dev-only structured logs with categories and sampling.
  - Acceptance: No logs in production build; tree-shaken.

---

## Workstream H — Testing & QA [All Weeks]

- Unit tests:
  - `__tests__/audio/mapping.test.ts`: curves, clamping, null safety.
  - `__tests__/palette/director.test.ts`: ids, uniform packing, gamma conversions.
  - `__tests__/visual/tierTransitionManager.test.ts`: hysteresis and cooldown.
  - Acceptance: All pass locally; deterministic snapshots where applicable.

- Integration tests:
  - `__tests__/integration/thinfilm-overlay.test.tsx`: mounts with orchestrator stubs; verifies props, blend, and enablement gates.
  - Acceptance: Mount/unmount 5× without memory error; enable/disable by FPS mock.

- Manual QA scripts:
  - `scripts/qa/run-thinfilm-bench.md`: step-by-step test plan; targets and expected results.
  - Acceptance: Doc exists with screenshots in `artifacts/qa/*`.

---

## Workstream I — Documentation & Guides [Week 2–4]

- Service READMEs:
  - `lib/palette/README.md`: palettes, wavelength rationale, API examples.
  - `lib/audio/README.md`: analyzer lifecycle, mapping philosophy, examples.
  - `lib/visual/performance/README.md`: thresholds, budgets, recipes.
  - Acceptance: Each README ≤1,000 words with code snippets.

- Orchestrator integration notes:
  - `lib/post/ThinFilmPass.md`: props, expected orchestration gates, performance tips.
  - Acceptance: Cursor/Codex can integrate without back-and-forth.

- User guide:
  - Contribute sections to `docs/guides/LIQUID-LIGHT-USER-GUIDE.md`: Pure Mode, battery saver, high-tier overlays explanation.
  - Acceptance: Plain-language explanations, screenshot(s).

---

## Delivery Checklist & Acceptance Criteria

- Performance:
  - Desktop high-tier: 60 FPS sustained; thin-film degrades gracefully above 16.7ms frame time.
  - Mobile mid-tier: 30–45 FPS with overlays disabled; no jank.

- Stability:
  - 30-minute soak with overlays on desktop shows no crashes and <5% memory drift.
  - Context loss handled; CSS fallback instant.

- Consistency:
  - Palette colors consistent across CSS/WebGL/R3F within visible tolerance.
  - Audio-reactive responses are smooth, not twitchy; beat bursts are noticeable yet controlled.

- Tests & Docs:
  - All new unit tests green; integration tests for thin-film pass.
  - READMEs present and actionable; QA scripts with artifacts checked in.

---

## Handoff Notes to Cursor and Codex

- You’ll receive: Thin-film component + helpers with small, composable props and zero global assumptions.
- Your wiring: Orchestrator decides enablement/tier; you call provided props and render overlay.
- Contracts: Palette uniform helpers (`getPaletteUniformRGB4`), DPR clamp, tier hysteresis are pure and testable.

---

## Start Order (Suggest)

1) Thin-film shader pass hardening (BOM, tests) → AuthenticThinFilm wrapper
2) Audio mapping refinements + beat detector → wire to pass
3) DPR clamp + battery saver + hysteresis helpers (pure functions + tests)
4) HUD and logging helpers
5) Palette normalization + expansion
6) Performance tuning and cleanup hooks
7) Docs, QA scripts, artifacts

When blocked by integration, switch to tests/docs or performance tuning.

