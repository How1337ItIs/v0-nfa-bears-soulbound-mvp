# Codex CLI — Cross‑AI Liquid Light Synthesis

Author: Codex CLI
Timestamp: 2025-10-29T20:20:44Z

## Executive Summary

- Consensus: All three agents converge on a WebGL fluid baseline with progressive enhancement, centralized audio/palette mapping, device‑tiering, and robust fallbacks.
- Differences: High‑end enhancements diverge (thin‑film overlay vs. post‑processing stack), and timelines vary (aggressive 7‑day sprint vs. phased rollout). Cursor’s export emphasizes broader project context; liquid‑light specifics appear truncated in that file.
- Recommendation: Ship a single‑engine (webgl‑fluid) baseline with unified audio/palette modules and capability‑gated enhancements. Prefer thin‑film overlay for authenticity on high tier, keep optional post‑FX modest, and harden with FPS‑driven auto‑tiering and accessibility.

## Sources Reviewed

- Codex CLI reports: `../reports/codex-cli-liquid-light-visual-orchestra-report-2025-10-29T19-32-37Z.md`, `../reports/LIQUID_LIGHT_RESEARCH_REPORT.md`, `../reports/LIQUID_LIGHT_ACTION_PLAN.md`
- Cursor report: `../reports/liquid-light-show-analysis-cursor.md`
- Claude Code synthesis: `../reports/CROSS_AI_LIQUID_LIGHT_COMPARISON.md`
- Prior internal: `docs/liquid-light-show-report.md` and related artifacts under `nfa-bears-mvp/`

## Where They Align

- **Baseline:** WebGL fluid (Pavel lineage / webgl‑fluid‑enhanced) as the production foundation.
- **Progressive Enhancement:** Device‑tiered profiles; add effects only where capacity allows.
- **Audio Mapping:** Single analyzer source of truth; map bass/mids/treble to physically meaningful parameters (splat force, curl, iridescence/brightness).
- **Palette Coherence:** Central palettes and tone mapping to avoid drift; Dead‑era color sets.
- **Fallbacks:** Clear chain: WebGPU (optional) → WebGL → CSS gradients; full reduced‑motion parity.
- **Performance Governance:** DPR clamp, adaptive resolution, FPS‑driven step‑down/up, pause off‑screen, context‑loss handling.
- **Accessibility:** Respect `prefers-reduced-motion`; provide user controls and intensity caps; avoid strobing.

## Where They Differ

- **High‑Tier Enhancement:**
  - Codex CLI: Optional thin‑film interference overlay (R3F plane) at reduced resolution/opacity; gated by profile and FPS.
  - Claude Code: Optional post‑FX stack (kaleidoscope, chromatic aberration, vignette) with strict gating; thin‑film less emphasized.
  - Cursor: Mentions overlays lightly; primary emphasis on baseline and project integration (export appears truncated for this section).

- **Thermal Aesthetic Implementation:**
  - Codex CLI: Timed upward splats and slow rotational splats for “projector heat + slosh” feel.
  - Claude Code: Lightweight shader overlay for heat bloom plus curl modulation; similar goal via different technique.

- **Timeline/Delivery Style:**
  - Codex CLI: Phased rollout (baseline → orchestration → hardening → presets) with ongoing QA.
  - Claude Code: Aggressive 7‑day sprint with daily themes, heavy research validation.
  - Cursor: Broader project workstream context; specific liquid‑light schedule not fully present in export.

## Combined Plan (Synthesized)

- **Foundation:**
  - Adopt a single full‑viewport WebGL fluid background (one RAF, pointer‑events:none), DPR‑clamped and auto‑tiered.
  - Implement capability detection and VisualPolicy (low/medium/high/ultra), wire reduced‑motion parity.

- **Shared Modules:**
  - AudioBus: analyzer + smoothing + beat throttle; published bands consumed by CSS vars and GPU uniforms.
  - PaletteDirector: era‑inspired palettes, global tone mapping; shared across layers.

- **Motion Language:**
  - Always‑on “thermal” feel via periodic bottom‑zone splats + gentle rotational drift; random low‑energy perturbations.

- **Enhancements (Gated):**
  - High: Thin‑film overlay (reduced res, modest opacity) sharing AudioBus/PaletteDirector.
  - Ultra: Optional WebGPU particles or subtle post‑FX; disable on battery‑saver.

- **Guardrails:**
  - FPS HUD (debug only), auto tiering (<45 fps downshift, >55 fps upshift), context‑loss restore.
  - Accessibility controls (motion toggle, intensity slider), brightness/strobe clamps.

- **Integration Surfaces:**
  - Global background via app layout; event pages expose “Dance Floor Mode”; success states trigger timed pulses; loading uses slow thermal drift.

## Recommended Tiers (Practical Defaults)

- **Low (mobile):** SIM_RES 64–96, DYE_RES 256, PRESSURE_ITERATIONS ~8, shading off, no overlays.
- **Medium (laptops/mobile high‑end):** SIM_RES ~96–128, DYE_RES 384, PRESSURE_ITERATIONS 12–20, minimal vignette.
- **High (desktop dGPU):** SIM_RES 128–256, DYE_RES 512, PRESSURE_ITERATIONS 20–25, thin‑film overlay on, subtle bloom/vignette.
- **Ultra (opt‑in):** Above high plus WebGPU particles or kaleidoscope; disabled on battery‑saver.

## Risks and Mitigations

- **WebGPU Variance:** Strict feature detection; never baseline; hot‑fallback to WebGL/CSS preserving state.
- **Thermal Throttling:** Enforce conservative mobile defaults; auto downshift on sustained FPS drops.
- **Color/Tone Drift:** Centralize gamma/tone mapping; share palettes; add lint/checks for out‑of‑bounds intensity.
- **Resource Leaks:** Use Spector.js in dev; deterministic cleanup; single engine instance.
- **Accessibility:** Reduced‑motion parity; visible controls; clamp pulse frequency.

## Actionable Next Steps

- Implement `CapabilityDetector` + `VisualPolicy` and wire DPR clamp.
- Centralize AudioBus/PaletteDirector and refactor layers to consume them.
- Mount global WebGL fluid background; add thermal/rotation routines; add CSS fallback.
- Gate thin‑film overlay behind high tier + FPS; add debug HUD and auto tiering.
- Add settings (motion, intensity, palette/preset); validate on representative devices.

## Conclusion

All three agents independently converged on the same core blueprint: WebGL fluid as the baseline, progressive enhancement, unified audio/palette, robust fallbacks, and performance/accessibility guardrails. Differences are tactical (overlay technique and schedule), not strategic. The synthesized plan combines Codex’s production pragmatism, Claude’s research depth, and Cursor’s project integration context for a reliable, authentic implementation path.
