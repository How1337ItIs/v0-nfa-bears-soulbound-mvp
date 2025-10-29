## Liquid Light Show Aesthetics — Cursor Analysis and First-Principles Plan

### Executive summary
- **Goal**: Deliver authentic 1960s liquid light show aesthetics across the product with reliability, accessibility, and strong mobile performance.
- **Finding**: Multiple in-repo implementations exist (WebGL fluid, enhanced variants, thin-film shaders, WebGPU particles, and a full Navier–Stokes engine). They demonstrate authenticity but suffer from fragmentation, performance, stability, and integration gaps.
- **Plan**: Adopt a layered foundation built on battle-tested WebGL fluid (webgl-fluid-enhanced) with device-tiered configuration, unify audio/palette modules, add subtle thermal/optical overlays, and ship progressive fallbacks. Optimize for visual authenticity over physics completeness.

---

### What we already tried (internal inventory synthesis)
- WebGL fluid engines: base and enhanced variants; good visuals; inconsistent config across files; occasional debug overrides present.
- Thin-film interference shader paths (authentic wavelength→RGB, oil film effects); visually rich but costly on mobile.
- Full custom Navier–Stokes engine: comprehensive but complex; memory leaks and mobile instability.
- WebGPU particle system: impressive counts, but wrong abstraction for continuous oil fields and limited support.
- CSS gradient layers and orchestration in shells: reliable fallback and low-cost ambient motion.
- Audio-reactive pipeline and curated palettes: strong, reusable building blocks.

What worked
- Performance tiering and FPS auto-downshift; audio→parameter mapping; curated palettes; layered composition; CSS fallback.

What failed
- Over-investment in bespoke physics; duplicated shader snippets; missing unified capability policy; insufficient reduced-motion parity in GPU paths; uneven color management; integration hot-spots.

---

### Web research distillate (targeted)
- WebGL fluid (Pavel Dobryakov lineage) remains the production baseline for mobile; mobile-friendly settings are well-known (SIM_RES 64–96, DYE_RES 256–384, PRESSURE_ITERATIONS ~8, SHADING off).
- `webgl-fluid-enhanced` documents comprehensive config, class API, and supports custom palettes and feature toggles.
- WebGPU is rising but still uneven for broad distribution, especially on iOS/Safari.
- SDF/metaball overlays excel for blob accentuation but should complement, not replace, grid-based fluid fields.
- Historical references confirm the aesthetic priorities: slow organic motion, layered color mixing, projector artifacts, and thin-film hints rather than maximal physical fidelity.

---

### First-principles stance
- Authentic experience comes from perceived motion, color blending, and analog artifacts—not full physical simulation.
- Optimize for appearance under constraints: choose abstractions that produce the right look at 60/30 fps rather than exact microphysics that drop frames.
- Progressive enhancement beats monoliths: layer capabilities and degrade gracefully.

---

### Architecture: layered “Visual Orchestra”
1) Foundation: WebGL fluid core (webgl-fluid-enhanced)
- Single engine of record across surfaces.
- Device-tiered configuration; feature flags for shading/bloom/hover.

2) Configuration and capability policy
- `CapabilityDetector` gathers GPU/WebGL/rAF throughput, memory hints, `prefers-reduced-motion`, and battery state.
- `VisualPolicy` maps capability to a tier and parameter set; exposed to app shells.

3) Shared modules
- Palettes: canonical Dead-era and analog profiles; single TS source injected into shaders.
- Audio mapping: bass→splat force/radius; mids→curl/velocity dissipation; treble→brightness/color rotate; beat→splat pulse.

4) Overlays (optional per tier)
- Thermal/convection nudge via lightweight curl offset; subtle chromatic aberration; vignette to evoke circular projection; optional kaleidoscope mirrors on high tier only.

5) Fallbacks
- CSS conic/linear gradients with gentle transforms; static gradient for ultra-low power; disable animation under `prefers-reduced-motion`.

---

### Device-tiered baselines (suggested)
- High: SIM_RES 128, DYE_RES 512, PRESSURE_ITERATIONS 20, SHADING on, optional overlays on.
- Medium: SIM_RES 96, DYE_RES 384, PRESSURE_ITERATIONS 12, SHADING off, vignette only.
- Low: SIM_RES 64, DYE_RES 256, PRESSURE_ITERATIONS 8, SHADING off, no overlays.
- Reduced motion: motionEnabled=false → freeze simulation or extremely slow drift; no splats.

---

### Integration plan (incremental, 7 days)
Day 1–2: Foundation integration
- Install/lock `webgl-fluid-enhanced` version; create `VisualEngine` wrapper; implement `CapabilityDetector` and `VisualPolicy` with the tier tables above; wire canvas lifecycle and context loss handling.

Day 3–4: Audio + palettes
- Centralize palettes in `@/visual/palette`; unify audio mapping in `@/visual/audio`; inject into engine; add beat-safe throttling; verify color management (gamma and blending) path.

Day 5: Accessibility + fallbacks
- Implement `prefers-reduced-motion` parity; CSS fallback; FPS HUD behind debug flag; auto-downshift thresholds.

Day 6: Overlays and tuning
- Add thin thermal curl nudge, vignette, minimal chromatic aberration; run device tests and tune per tier.

Day 7: QA + scene profiles
- Author 3–5 scene presets (Dark Star Depth, China Cat Pastel, Terrapin Earth, Ripple Glass, Classic Analog); validate across representative devices for legibility and performance.

---

### Concrete refactors and guardrails
- Unify wavelength→RGB and thin-film constants into one shader include; remove duplicated snippets.
- Remove/gate debug overrides (e.g., solid fills/magenta tests) behind compile-time or environment flags.
- Centralize palette and audio mapping modules; avoid per-component drift.
- Add memory/FPS instrumentation and session runtime watchdogs; test for 30–60 minutes on mobile.
- Treat WebGPU prototypes as R&D behind a hard capability gate; do not block mainline.

---

### Measurement and targets
- Desktop: 60 fps sustained at 1080p, ±10% CPU/GPU headroom.
- Mobile: 30 fps sustained at native resolution; <100 MB stable memory; zero context loss over 30 min.
- Accessibility: honors `prefers-reduced-motion`; sufficient contrast for UI overlays; keyboard focus unaffected.
- Qualitative: “looks analog,” slow organic motion, pleasant color mixing, tasteful artifacts; validated with side-by-side references.

---

### Risks and mitigations
- Library drift: pin versions; fork vendor if needed; add smoke tests.
- Thermal/overlay cost: keep overlays opt-in per tier; measure impact; disable under load.
- Audio latency variance: use Web Audio with smoothing; provide latency offset control; degrade gracefully when no mic/audio.
- Color variance across devices: rely on sRGB path; clamp out-of-gamut; provide brightness ceiling.

---

### Closing
We can achieve authentic, performant liquid light aesthetics by consolidating on a proven WebGL fluid core, enforcing a device-aware policy, unifying audio/palette inputs, and layering subtle analog cues. Prioritize perceived authenticity and stability over full physics, ship incrementally, and validate with both metrics and eyes.


