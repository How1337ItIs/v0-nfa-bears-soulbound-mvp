# Liquid Light Show Aesthetics — Codex CLI Internal Synthesis, Web Research, and First‑Principles Plan

Author: Codex CLI
Timestamp: 2025-10-29T19:32:37Z

## Executive Summary

- Goal: Infuse authentic liquid light show aesthetics throughout the product with reliability, performance, and cultural fidelity.
- Internal state: Multiple credible implementations exist (WebGL fluid variants, authentic thin‑film interference shader, WebGPU particles, and a full Navier–Stokes engine), plus CSS ambience and audio reactivity. The core gaps are orchestration, device‑tiering, consistency, and fallbacks.
- Direction: Consolidate on a single WebGL fluid baseline as the “engine of record,” layer thin‑film and optional particles as tiered enhancements, centralize audio/palette mapping, and govern everything via a capability policy. Favor perceived authenticity over maximal physics.

---

## Internal Research — What We Tried, What Worked, What Failed

1) WebGL Fluid Engines (baseline and enhanced)
- Essence: Multi‑pass fluid sims (advection, divergence, pressure, curl/vorticity, gradient subtract, display), audio‑reactive splats, Dead‑inspired palettes.
- Worked:
  - Strong look at wide compatibility; parameterized for quality scaling.
  - Audio mapping adds meaningful motion without heavy cost.
- Failed / Needs improvement:
  - Duplicated shader/math across variants; debug/test overrides that flatten visuals if left enabled.
  - Integration inconsistencies (not one source of truth), limited capability negotiation, uneven color/tone mapping.

2) Thin‑Film Interference Shader (R3F)
- Essence: Wavelength→RGB plus thin‑film interference on oil SDF/metaballs; convection cues; audio‑reactive shimmer.
- Worked:
  - Highest authenticity for iridescence; visually compelling centerpiece.
- Failed / Needs improvement:
  - Mobile cost (fragment heavy + R3F runtime); must be gated and possibly downscaled; color/tone consistency with other layers.

3) WebGPU Particles / Compute
- Essence: High‑scale particle visuals with curl noise and kaleidoscopic variants.
- Worked:
  - Impressive on capable desktops; great “Ultra” flourish.
- Failed / Needs improvement:
  - Availability still uneven; shader/device negotiation brittle; aesthetic alignment with oil film needs direction when composed.

4) CSS Ambience and Shell Layers
- Essence: Conic/radial gradient stacks, organic shapes, subtle projector glass textures; prefers‑reduced‑motion support.
- Worked:
  - Zero‑GPU fallback; cheap, reliable ambience; accessibility hooks.
- Failed / Needs improvement:
  - Needs palette/tempo linkage with GPU layers for cohesion; intensity governance.

5) Starters, Audio, and Docs
- Essence: `liquid-light-starter`, audio analyser hooks, curated palettes, multiple write‑ups and action plans.
- Worked:
  - Good scaffolding and repeatable patterns (single canvas, pointer‑safe, FPS step‑down).
- Failed / Needs improvement:
  - Fragmentation across implementations; duplicated constants and mapping tables.

Key recurring pitfalls
- Competing visual layers (over‑bright fills, conflicting palettes, duplicated hue rotations).
- No unified capability policy or motion/intensity switch across all layers.
- Mobile overdraw and DPR mis‑clamps; R3F overlays mounted too broadly.

---

## Targeted Web Research — Filling Gaps and Validating Assumptions

- WebGPU support is improving but remains uneven across platforms; production baselines should retain WebGL/CSS fallbacks.
  - Can I Use (feature JSON): https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/webgpu.json
  - GPUWeb spec and status: https://gpuweb.github.io/gpuweb/ and https://github.com/gpuweb/gpuweb/wiki/Implementation-Status
- Baseline fluid simulation remains Pavel Dobryakov’s WebGL lineage (adopted widely as the pragmatic reference for parameters and structure).
  - README: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Thin‑film interference best practices emphasize spectral or wavelength sampling, optical path difference, and correct gamma/tone mapping; use sparingly at reduced resolution on mobile.
  - General references: ShaderToy searches for “iridescence/thin film”; physics background: https://en.wikipedia.org/wiki/Thin-film_interference
- Audio analysis best practices: leverage Web Audio `AnalyserNode` with small FFT on mobile, smoothing, and simple beat heuristics; throttle beat events.
  - MDN AnalyserNode: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- Accessibility: respect `prefers-reduced-motion`; provide an explicit motion toggle and intensity cap; guard strobe frequencies.
  - MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

Takeaways
- Keep WebGL fluid as the universal baseline; mount advanced overlays only behind capability+FPS gates.
- Centralize gamma/tone mapping and palette use across layers to avoid drift.
- Build one audio/palette bus consumed by CSS variables and GPU uniforms alike.

---

## First‑Principles Plan — The Liquid Light Visual Orchestra

Principle: One orchestrator governs inputs, policies, layers, and fallbacks. Each layer is swappable and quality‑scaled per device profile.

1) Capability Detection → Visual Policy
- Detect: WebGPU → WebGL → CSS; record DPR clamp, max texture size, battery‑saver, and a quick FPS probe.
- Profiles:
  - Low: CSS‑only ambience.
  - Medium: CSS + WebGL fluid (no heavy shading/post).
  - High: CSS + WebGL fluid + thin‑film overlay (reduced resolution, subtle intensity).
  - Ultra: High + WebGPU particles (when stable), disabled on battery‑saver.

2) Unified Audio‑Reactive Core
- Single AudioBus publishing { bass, mids, treble, volume, beat } at a stable cadence.
- Mapping table (centralized):
  - Bass → oil thickness, blob radius, slow convection splats.
  - Mids → flow speed, curl weighting, gentle brightness.
  - Treble → iridescence weight, shimmer, surface tension.
  - Volume → global intensity; Beat → short, throttled pulses.

3) Layer Stack and Composition
- Base CSS ambience (always on): conic/radial gradients, projector‑glass texture; CSS vars bound to AudioBus for hue/intensity (cheap updates).
- WebGL fluid (core motion): lower‑res dye with audio‑modulated splats and slow thermal drift; composited beneath.
- Thin‑film overlay (high tier): SDF oil blobs with iridescence at reduced resolution; share palette and audio uniforms; conservative opacity.
- Optional WebGPU particles (ultra): compute‑driven halo with kaleidoscope gating; restrained by the same palette/tempo.
- Post‑processing: minimal, opt‑in only (subtle vignette/bloom), easily disabled by policy.

4) Palette and Tone Management
- Central PaletteDirector with era‑inspired sets (e.g., Dark Star, Terrapin); enforce luminance/saturation bounds.
- Single gamma/tone mapping path across layers; avoid double sRGB conversions.

5) Accessibility and User Controls
- Global motionEnabled toggle and intensity slider; respect `prefers-reduced-motion` by disabling animations and freezing sims to slow drift or static gradients.
- Safety guardrails: cap brightness and strobe frequency; document defaults.

6) Performance Governance
- Clamp DPR (e.g., mobile 1.0–1.5). Adaptive simulation resolution and frame skipping on low FPS. Pause off‑screen.
- Auto downshift <45 FPS for >2s; auto upshift >55 FPS for >5s within device capability.

7) Orchestration API (contract sketch)
- VisualPolicy: { profile: 'low'|'medium'|'high'|'ultra', motionEnabled: boolean, intensity: 0..1 }
- PaletteDirector: { themeId, getColor(t), setTheme(id) }
- AudioBus: publishes { bass, mids, treble, volume, beat }
- Layers must accept uniforms/props: { uIntensity, uPaletteParams, uBass/Mids/Treble, uBeat, uMotionEnabled }

---

## Implementation Roadmap (Incremental)

Phase 1 — Stabilize and Unify
- Remove/gate test‑only shader overrides that flatten visuals.
- Create shared modules: `@/visual/palette`, `@/visual/audio-mapping` and use in all layers.
- Add `CapabilityDetector` and `VisualPolicy` with profile presets; clamp DPR.

Phase 2 — Orchestration and Consistency
- Build `VisualOrchestra` provider to mount CSS, WebGL fluid, thin‑film, and optional particles per policy.
- Normalize tone mapping and palette usage across layers; set intensity clamps.
- Add `motionEnabled` uniform parity in GPU paths; wire UI controls.

Phase 3 — Performance and Fallback Hardening
- Adaptive sim resolution/frame pacing; FPS HUD (debug‑only); auto tier switching.
- Robust WebGPU checks and hot‑fallback to WebGL/CSS preserving palette/audio state.

Phase 4 — Art Direction and Presets
- Curate 4–5 scene profiles (e.g., Dark Star Depth, China Cat Pastel, Terrapin Earth, Ripple Glass, Classic Analog).
- Validate legibility over UI; add scrims where necessary.

---

## Risks and Mitigations
- WebGPU variance: Feature detect; gate behind policy; never baseline on mobile.
- Mobile thermal throttling: Strict low/medium profiles; intensity caps; auto downshift.
- Accessibility/health: Reduced‑motion parity; brightness/strobe clamps; an “Ambient” preset.
- Visual incoherence: Central palettes and audio mapping; lints for out‑of‑bounds intensity.
- Build drift: Shared shader snippets; tests that parse shader constants; pin dependencies.

---

## Measurement Targets
- Low: ≥55 FPS on mid‑tier mobile; dye ≤256; GPU ≤7 ms/frame.
- Medium: ≥55 FPS on laptops; dye 256–384; no heavy post.
- High: ≥50 FPS on dGPUs; dye 512; thin‑film overlay; subtle post.
- Ultra: ≥50 FPS with 50–100k particles ≤8 ms GPU/frame; disabled on battery‑saver.
- QA gates: UI contrast over visuals; add scrims under animated high‑contrast regions.

---

## Internal Inventory (for reference)
- Docs and analyses: `./reports/liquid-light-show-report.md`, `./reports/liquid-light-show-analysis-cursor.md`, `./reports/LIQUID_LIGHT_RESEARCH_REPORT.md`, `./reports/LIQUID_LIGHT_ACTION_PLAN.md`.
- Starters/engines: `nfa-bears-mvp/liquid-light-starter/*`, `nfa-bears-mvp/liquid-light-engine.zip`.
- Assets: `nfa-bears-mvp/public/psychedelic-assets/*`.
- App comps (subset): thin‑film and fluid variants, CSS fractal/psychedelic backgrounds, and layout shells.

---

## References (Selected)
- Can I Use — WebGPU feature JSON: https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/webgpu.json
- GPUWeb spec and status: https://gpuweb.github.io/gpuweb/ • https://github.com/gpuweb/gpuweb/wiki/Implementation-Status
- PavelDoGreat WebGL Fluid Simulation: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Thin‑film background: https://en.wikipedia.org/wiki/Thin-film_interference
- Web Audio AnalyserNode: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- Prefers‑reduced‑motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
