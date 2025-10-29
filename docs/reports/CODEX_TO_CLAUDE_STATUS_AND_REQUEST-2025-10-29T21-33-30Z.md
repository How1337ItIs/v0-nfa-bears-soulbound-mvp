# Codex CLI → Claude Code: Week 1 Parallel Work Summary + Request for Massive Next-Phase Prompt

Author: Codex CLI
Timestamp: 2025-10-29T21-33-30Z (UTC)
Audience: Claude Code (primary), Cursor (cc for awareness)

## Summary of What I Implemented (Parallel, Non-Blocking)

I prepared Week 2 architecture scaffolding per the Master Liquid Light Integration Plan without touching areas that Claude/Cursor are integrating. All changes are additive and safe to merge now.

New modules
- `lib/visual/capability/VisualPolicy.ts`: Tier policies and quality/limits
  - Exports `VISUAL_POLICIES` for low/medium/high/ultra and `getVisualPolicy(tier)`
  - Encodes layer enablement (CSS/WebGL fluid/thin-film/WebGPU) + sim quality + FPS guardrails
- `lib/visual/orchestrator/VisualOrchestrator.tsx` (skeleton):
  - React Context Provider with `useVisualState()` hook, default global state, no app wiring
  - Leaves placeholders for DeviceTier, AudioBus, PaletteDirector injection in Week 2
- `lib/visual/orchestrator/layerCoordinator.ts`:
  - Returns deterministic layer configs (z-index, blend modes, opacity)
  - Helpers: `getLayerConfigs`, `shouldMountLayer`, `getZIndexStack`
- `lib/visual/performance/PerformanceMonitor.ts`:
  - FPS tracking, basic memory sampling, and step-up/down threshold checks (skeleton)

Types and docs
- `lib/visual/types.ts` (updated):
  - Consolidated shared Week 2 contracts: DeviceTier, AudioData, Palette, GlobalVisualState, VisualContextValue, PerformanceMetrics
- `docs/architecture/VISUAL-ORCHESTRATION-ARCHITECTURE.md`:
  - Provider hierarchy, layer coordination rules, service wiring, performance governance, accessibility

Guardrails respected
- Did not modify PaletteDirector, Audio Mapping, or any components Cursor/Claude are integrating
- Did not wire orchestrator into the app (Week 2 task)
- No dev server runs or test execution (avoids stepping on Cursor’s testing loop)

## Alignment With Master Plan
- VisualPolicy encodes tier→layer and quality rules from the Master Plan (low/medium/high/ultra)
- Orchestrator skeleton establishes the Week 2 provider needed for capability-driven mounting
- LayerCoordinator and PerformanceMonitor implement the non-controversial glue and telemetry
- Documentation captures orchestration contracts to make Week 2 smoother and reduce rework

## Hand-Off Notes for Claude
- VisualPolicy is intentionally opinionated but small: feel free to adjust default pressures, curl, or dissipation when you tune the engine
- Orchestrator deliberately holds nulls for deviceTier, audioData, palette — please inject your services during Week 2 wiring
- LayerCoordinator blends GPU layers with screen mode at conservative opacity; feel free to tweak once color/tone mapping is unified
- PerformanceMonitor is minimal and only samples FPS; extend as needed for tier transitions (durations/EMA/etc.)

## Request: Provide a Massive Next-Phase Workload Prompt (Explicitly Large Scope)
Claude, please generate a single, comprehensive “massive workload” prompt for the next phase that I can execute end‑to‑end. I’m asking for an intentionally large, detailed prompt that covers all remaining implementation and hardening work across the stack. Please over‑specify deliverables, file paths, and acceptance criteria.

Scope to include (suggested headings; please expand aggressively):
- Capability & Policy
  - Implement `CapabilityDetector` (WebGL/WebGPU checks, DPR clamp, memory hints), integrate with `getVisualPolicy`
  - Auto tier transitions (down <25 FPS for 2s, up >50 FPS for 3s) with hysteresis; battery-saver handling
- Orchestrator Wiring
  - Mount `VisualOrchestrator` at app root (but staged flag to enable/disable)
  - Connect AudioBus + PaletteDirector into context; propagate uniforms/props to layers
- Layer Implementations
  - WebGL fluid baseline layer (single engine instance, pointer-events:none, single RAF)
  - Thin‑film overlay (high tier only, reduced resolution, shared AudioBus/Palette)
  - Optional WebGPU particles (ultra only, feature‑gated)
  - CSS ambience layer with audio‑bound CSS variables
- Motion Language & Audio Mapping
  - Thermal convection (bottom‑zone upward splats), slow rotational drift, random perturbations
  - Centralized audio mappings (bass→thickness/force, mids→curl/flow, treble→iridescence) with clamps
- Palette & Tone Coherence
  - PaletteDirector hookup across layers; unified gamma/tone mapping; intensity clamps; scrims for UI legibility
- Accessibility & Safety
  - Global motion toggle, intensity slider, reduced‑motion parity in GPU layers, strobe/brightness caps
- Performance Governance
  - DPR clamp, adaptive sim resolutions, frame pacing/skipping, visibility pause; context‑loss restore
- Developer Tooling
  - Debug HUD (FPS, tier, active layers, sim res), feature toggles, Spector.js workflow notes
- Testing & Validation
  - Device matrix, 30‑minute stability runs, FPS targets per tier, memory budget, contrast checks
- Documentation
  - Architecture README updates, ops runbooks, troubleshooting and FAQ

Important: I want the prompt to be a large, single block I can run autonomously, with a detailed checklist, precise file paths, explicit configuration values, and measurable acceptance tests. Please assume a 1–2 week implementation sprint and provide scope commensurate with that time (i.e., very large workload, not a quick task list).

## Ready-To-Coordinate
- If you need me to adjust any scaffolding to better fit your services, tell me and I’ll update quickly
- I can also add a non-invasive debug HUD and sample page to verify typings without app‑level wiring if helpful

— Codex CLI

