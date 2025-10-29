# Codex CLI: Week 1 Parallel Implementation Tasks
## Master Liquid Light Integration Plan - Systematic Architecture Preparation

**Date**: 2025-10-29
**Phase**: Week 1 (Rapid Baseline) - Parallel Execution Track
**Your Role**: Systematic architecture and Week 2 preparation
**Status**: Ready to begin

---

## 🎯 Your Mission

You are working in **parallel** with Claude Code and Cursor on Week 1 of the Master Liquid Light Integration Plan. Each AI tool is handling tasks aligned with its strengths to maximize efficiency.

**Current Division of Labor**:
- ✅ **Claude Code**: Core services creation (PaletteDirector, Audio Mapping, Controls) - **COMPLETE**
- ⏳ **Cursor**: Integration, cleanup, testing - **IN PROGRESS**
- ⏳ **Codex (YOU)**: Systematic architecture and Week 2 preparation - **YOUR TASKS BELOW**

---

## 📋 Your Specific Tasks (No Conflicts with Other Agents)

### Task 1: Create VisualPolicy Module (Week 2 Preparation)
**Why You**: Requires systematic tier→layer mapping patterns (your strength)
**No Conflict**: Claude Code focused on services, Cursor on integration

**File to Create**: `lib/visual/capability/VisualPolicy.ts`

**Requirements**:
```typescript
/**
 * VISUAL POLICY - Tier to Layer Mapping
 *
 * Defines which visual layers are active for each device tier
 * Used by VisualOrchestrator (Week 2) to coordinate layer mounting
 */

export interface VisualPolicy {
  profile: 'low' | 'medium' | 'high' | 'ultra';

  layers: {
    css: boolean;
    webglFluid: boolean;
    thinFilm: boolean;
    webgpuParticles: boolean;
  };

  quality: {
    simResolution: number;
    dyeResolution: number;
    pressureIterations: number;
    curl: number;
    velocityDissipation: number;
    densityDissipation: number;
  };

  limits: {
    targetFPS: number;
    minFPS: number;
    maxFPS: number;
    gpuTimeBudget: number;      // ms per frame
    stepDownThreshold: number;  // FPS below which to reduce quality
    stepUpThreshold: number;    // FPS above which to increase quality
  };
}

// Define policies for each tier
export const VISUAL_POLICIES: Record<'low' | 'medium' | 'high' | 'ultra', VisualPolicy>;

// Function to get policy for a device tier
export function getVisualPolicy(tier: string): VisualPolicy;
```

**Specifications from Master Plan**:
- **Low**: CSS only, 30fps target, simRes 128, dyeRes 256
- **Medium**: CSS + WebGL fluid, 45fps target, simRes 192, dyeRes 384
- **High**: CSS + WebGL fluid, 60fps target, simRes 256, dyeRes 512, option for thin-film
- **Ultra**: All layers, 60fps target, simRes 256, dyeRes 512, WebGPU particles

**Step-down threshold**: <25fps for 2 seconds
**Step-up threshold**: >50fps for 3 seconds

---

### Task 2: Create VisualOrchestrator Skeleton (Week 2 Foundation)
**Why You**: Orchestration architecture is your specialty
**No Conflict**: Week 2 work, doesn't interfere with Week 1 integration

**File to Create**: `lib/visual/orchestrator/VisualOrchestrator.tsx`

**Requirements**:
Create the React Context Provider skeleton with:
```typescript
interface GlobalVisualState {
  motionEnabled: boolean;
  intensity: number;         // 0-1
  pureMode: boolean;
  selectedPalette: string;
  audioReactive: boolean;
  mode: 'off' | 'ambient' | 'dance-floor' | 'trip';
  batterySaver: boolean;
}

interface VisualContextValue {
  state: GlobalVisualState;
  deviceTier: DeviceTier | null;
  audioData: AudioData | null;
  palette: Palette | null;
  setState: (updates: Partial<GlobalVisualState>) => void;
}

export function VisualOrchestrator({ children }: { children: React.ReactNode });
export function useVisualState(): VisualContextValue;
```

**Important**: This is a SKELETON only for Week 2. Don't integrate it yet. Just create the structure.

**Reference**: Master Plan Appendix B has example code

---

### Task 3: Create Layer Coordinator Utility (Week 2 Preparation)
**Why You**: Layer mounting logic requires systematic patterns
**No Conflict**: Week 2 architecture, not used in Week 1

**File to Create**: `lib/visual/orchestrator/layerCoordinator.ts`

**Requirements**:
```typescript
/**
 * LAYER COORDINATOR
 *
 * Manages mounting/unmounting of visual layers based on VisualPolicy
 * Prevents multiple parallel render loops
 * Coordinates blend modes and z-index stacking
 */

import { VisualPolicy } from '../capability/VisualPolicy';

export interface LayerConfig {
  name: string;
  enabled: boolean;
  zIndex: number;
  blendMode: 'normal' | 'screen' | 'multiply' | 'overlay';
  opacity: number;
}

export function getLayerConfigs(policy: VisualPolicy): LayerConfig[];
export function shouldMountLayer(layerName: string, policy: VisualPolicy): boolean;
export function getZIndexStack(policy: VisualPolicy): Record<string, number>;
```

**Layer Stack** (from Master Plan):
- CSS: Always enabled, z-index: -50
- WebGL Fluid: Medium+ tier, z-index: -40
- Thin-Film: High tier + opt-in, z-index: -30
- WebGPU: Ultra tier, z-index: -20

---

### Task 4: Document Architecture Patterns (Week 2 Reference)
**Why You**: Technical documentation and systematic pattern articulation
**No Conflict**: Documentation work

**File to Create**: `docs/architecture/VISUAL-ORCHESTRATION-ARCHITECTURE.md`

**Content**:
Document the complete orchestration architecture for Week 2 implementation:

1. **Provider Hierarchy**:
   - How VisualOrchestrator wraps the app
   - Service dependencies (AudioBus, PaletteDirector)
   - State flow from detection → policy → rendering

2. **Layer Coordination**:
   - Layer mounting sequence
   - RAF loop coordination strategy
   - Blend mode composition rules
   - Z-index stacking order

3. **Service Integration**:
   - How layers access AudioBus data
   - How layers access PaletteDirector colors
   - Unified timing and synchronization

4. **Performance Governance**:
   - FPS monitoring approach
   - Quality adjustment triggers
   - Tier transition logic

**Reference**: Master Plan Part 2 (Unified Architecture section)

---

### Task 5: Create TypeScript Interface Definitions
**Why You**: Type system design, systematic interface patterns
**No Conflict**: Shared types, benefits all agents

**File to Create**: `lib/visual/types.ts`

**Requirements**:
Consolidate all TypeScript interfaces for the visual system:

```typescript
// Device Capability Types
export interface DeviceTier { ... }
export interface DeviceCapabilities { ... }

// Audio Types
export interface AudioData { ... }
export interface PhysicsParams { ... }

// Palette Types
export interface Palette { ... }

// Visual State Types
export interface GlobalVisualState { ... }
export interface VisualContextValue { ... }

// Policy Types
export interface VisualPolicy { ... }
export interface LayerConfig { ... }

// Performance Types
export interface PerformanceMetrics { ... }
```

Pull definitions from Claude Code's services and Master Plan specifications.

---

### Task 6: Performance Monitoring Utility
**Why You**: Systematic measurement patterns
**No Conflict**: Utility library for Week 2+

**File to Create**: `lib/visual/performance/PerformanceMonitor.ts`

**Requirements**:
```typescript
/**
 * PERFORMANCE MONITOR
 *
 * Tracks FPS, memory, GPU usage for adaptive quality adjustment
 */

export class PerformanceMonitor {
  private fps: number = 60;
  private frameCount: number = 0;
  private lastCheck: number = Date.now();

  // Update on each frame
  tick(): void;

  // Get current FPS
  getFPS(): number;

  // Check if should step down quality
  shouldStepDown(threshold: number): boolean;

  // Check if should step up quality
  shouldStepUp(threshold: number, maxTier: string): boolean;

  // Get memory usage (if available)
  getMemoryUsage(): number | null;

  // Reset counters
  reset(): void;
}
```

---

## 🔄 Coordination Protocol

### **DO**:
✅ Create new files in `lib/visual/` directory
✅ Focus on architecture and systematic patterns
✅ Prepare Week 2 orchestration components
✅ Document architecture decisions
✅ Create TypeScript interfaces and type definitions
✅ Build utility classes (PerformanceMonitor, etc.)

### **DON'T**:
❌ Modify Claude Code's created files (PaletteDirector, Audio Mapping)
❌ Modify existing components (LiquidLightBackground.tsx) - Cursor is handling
❌ Implement Week 2 integration yet (just create skeletons)
❌ Run tests or dev server (Cursor is testing)
❌ Make decisions that override Master Plan

### **COORDINATE**:
💬 If you need to modify an existing file, note it in your commit message
💬 If you discover issues, document them (don't fix others' code)
💬 Your work should be **additive** (new files, new directories)
💬 Reference Master Plan sections in your code comments

---

## 📊 Success Criteria for Your Tasks

By end of your parallel work session:
- ✅ VisualPolicy module created with all 4 tier policies defined
- ✅ VisualOrchestrator skeleton created (ready for Week 2)
- ✅ LayerCoordinator utility created
- ✅ Architecture documentation written
- ✅ TypeScript interfaces consolidated
- ✅ PerformanceMonitor utility created

**Deliverable**: Week 2 architecture foundation ready, no conflicts with Week 1 work

---

## 📚 Reference Documents

**Primary Reference**:
- `docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md` (THE definitive guide)

**Your Contributions to Study**:
- `docs/reports/codex-cli-visual-orchestra-report-2025-10-29T19-32-37Z.md` (your original analysis)

**Other Agent Work to Avoid Modifying**:
- `lib/palette/PaletteDirector.ts` (Claude Code)
- `lib/audio/mapping.ts` (Claude Code)
- `components/liquid-light/*` (Claude Code)
- `components/LiquidLightBackground.tsx` (Cursor integrating)

**Existing Code to Reference (Read-Only)**:
- `lib/fluid/config.ts` (device detection patterns)
- `lib/audio/useAudioReactive.ts` (audio analysis patterns)

---

## 🎯 Expected Timeline

**Your Session**: 2-3 hours for all 6 tasks
**Completion**: Today (2025-10-29)
**Integration**: Week 2 (we'll use your architecture then)

---

## 💡 Key Principles for Your Work

1. **Systematic Over Expedient**: Take time to design proper patterns
2. **Architecture Over Implementation**: Focus on structure, not details
3. **Documentation Over Code**: When in doubt, document the pattern
4. **Interfaces Over Concrete**: Define contracts, implementation comes later
5. **Week 2 Preparation**: You're building the foundation for next week

---

## ✅ Verification Checklist

Before you finish, verify:
- [ ] All files created in `lib/visual/` directory (no conflicts)
- [ ] All files have proper TypeScript types
- [ ] All files reference Master Plan in comments
- [ ] VisualOrchestrator is skeleton only (not integrated)
- [ ] No modifications to Claude Code or Cursor files
- [ ] Architecture documentation is comprehensive
- [ ] Ready for Week 2 integration

---

## 🚀 When You're Done

1. **Commit your work** with message: "Prepare Week 2 architecture (Codex parallel work)"
2. **Push to GitHub**
3. **Report completion** with file list and any architectural notes
4. **Note any decisions or patterns** that should be reviewed

---

## 📞 Questions to Consider (Document Answers)

1. **Layer Mounting Order**: What's the optimal sequence for mounting layers to avoid visual flicker?
2. **RAF Loop Strategy**: Single unified RAF or coordinated separate loops?
3. **State Update Pattern**: React Context, Zustand, or custom event system?
4. **Error Boundaries**: Should each layer have its own error boundary?
5. **Performance Budget**: How to enforce GPU time budgets across layers?

Document your architectural decisions in the VISUAL-ORCHESTRATION-ARCHITECTURE.md file.

---

## 🎨 Your Deliverable Structure

```
lib/visual/
├── capability/
│   └── VisualPolicy.ts           # YOUR TASK 1
├── orchestrator/
│   ├── VisualOrchestrator.tsx    # YOUR TASK 2 (skeleton)
│   └── layerCoordinator.ts       # YOUR TASK 3
├── performance/
│   └── PerformanceMonitor.ts     # YOUR TASK 6
└── types.ts                      # YOUR TASK 5

docs/architecture/
└── VISUAL-ORCHESTRATION-ARCHITECTURE.md  # YOUR TASK 4
```

---

## 💪 Why You're Perfect for These Tasks

From Master Plan: *"Codex strengths: Systematic patterns, architectural design, comprehensive planning"*

**Your Previous Analysis** showed:
- ✅ Deep understanding of Visual Orchestra pattern
- ✅ Emphasis on unified coordination
- ✅ Systematic 4-week approach
- ✅ Focus on long-term maintainability

**These tasks leverage your strengths**:
- Creating systematic tier policies
- Designing orchestration architecture
- Building coordinated patterns
- Comprehensive documentation

---

## ⚠️ Important Constraints

### DO NOT:
❌ Integrate VisualOrchestrator into app yet (Week 2 task)
❌ Modify PaletteDirector or Audio Mapping (Claude Code's work)
❌ Modify LiquidLightBackground.tsx (Cursor's integration)
❌ Run dev server or tests (Cursor is testing)
❌ Make breaking changes to existing code

### DO:
✅ Create new files in lib/visual/
✅ Design systematic patterns
✅ Document architectural decisions
✅ Prepare foundation for Week 2
✅ Think about orchestration coordination
✅ Define clear interfaces

---

## 📖 Reference: Week 2 Goals (What You're Preparing For)

**Week 2 Objective**: Build unified orchestration layer

Your work now sets up:
1. **VisualOrchestrator** - Central conductor (you're creating the skeleton)
2. **VisualPolicy** - Tier→layer mapping (you're defining the rules)
3. **LayerCoordinator** - Mounting logic (you're creating the utility)
4. **Performance Monitoring** - Quality adjustment (you're building the monitor)

**Week 2 will use your architecture** to:
- Wrap the app in VisualOrchestrator
- Conditionally mount layers based on your VisualPolicy
- Coordinate timing using your LayerCoordinator
- Monitor performance using your PerformanceMonitor

---

## 🎯 Success Metrics

**By End of Your Session**:
- ✅ 6 files created (no conflicts with other agents)
- ✅ Week 2 architecture foundation ready
- ✅ All TypeScript interfaces defined
- ✅ Architectural decisions documented
- ✅ Clean commit with your work
- ✅ Ready for Week 2 integration

**Quality Checks**:
- All files have proper imports/exports
- TypeScript interfaces are complete
- Documentation references Master Plan
- Patterns are systematic and maintainable

---

## 📝 Commit Message Template

```
Prepare Week 2 orchestration architecture (Codex parallel work)

Week 1 parallel execution - architecture preparation for Week 2:

Created:
✅ lib/visual/capability/VisualPolicy.ts - Tier→layer mapping policies
✅ lib/visual/orchestrator/VisualOrchestrator.tsx - Provider skeleton
✅ lib/visual/orchestrator/layerCoordinator.ts - Layer mounting utility
✅ lib/visual/types.ts - Consolidated TypeScript interfaces
✅ lib/visual/performance/PerformanceMonitor.ts - FPS/memory tracking
✅ docs/architecture/VISUAL-ORCHESTRATION-ARCHITECTURE.md - Architecture docs

Architectural Decisions:
- [List any key patterns or decisions made]

Status: Week 2 foundation ready, Week 1 work unaffected

Working in parallel with:
- Claude Code: Services creation (complete)
- Cursor: Integration and testing (in progress)

Per Master Plan tool-specific guidance:
- Codex handles: Systematic patterns, architecture, orchestration
- Ready for Week 2 implementation
```

---

## 🤝 Final Notes

**You are part of a coordinated team**:
- Each AI tool working on tasks suited to its strengths
- No duplication, no conflicts
- Your work prepares the foundation for Week 2
- Integration happens next week when Cursor and Claude Code finish Week 1

**Think of it like construction**:
- Claude Code: Built the materials (services, components)
- Cursor: Assembling the first floor (integration, testing)
- Codex (YOU): Designing the second floor (orchestration architecture)

**Your work matters** because Week 2 success depends on solid architectural patterns. Take your time, design it well, document thoroughly.

---

**BEGIN WHEN READY** 🚀

Master Plan: `docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md`
Your Analysis: `docs/reports/codex-cli-visual-orchestra-report-2025-10-29T19-32-37Z.md`
