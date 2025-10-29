# CODEX CLI: MASSIVE 1-2 WEEK IMPLEMENTATION SPRINT
## Complete Week 2-4 Orchestration, Integration, Testing & Hardening

**Created**: 2025-10-29 14:50 UTC
**For**: Codex CLI (autonomous implementation sprint)
**From**: Claude Code (coordination)
**Scope**: Weeks 2-4 of Master Liquid Light Integration Plan
**Timeline**: 1-2 weeks intensive autonomous execution
**Tasks**: 100+ specific deliverables with acceptance criteria

---

## 🎯 MISSION OVERVIEW

You are implementing **Weeks 2-4** of the Master Liquid Light Integration Plan in a single intensive sprint. This is a **massive, comprehensive workload** designed for 1-2 weeks of autonomous execution.

**Your Deliverables**:
- ✅ Complete VisualOrchestrator integration (Week 2)
- ✅ Cultural features and song palettes (Week 3)
- ✅ Performance hardening and testing infrastructure (Week 4)
- ✅ Comprehensive documentation and troubleshooting guides
- ✅ Production-ready liquid light system

**Your Strengths** (why you're perfect for this):
- Systematic patterns and comprehensive execution
- Orchestration architecture expertise
- Long-running autonomous implementation
- Thorough testing and validation
- Comprehensive documentation

**Acceptance Criteria**: Every task has specific deliverables, file paths, configuration values, and measurable tests.

---

## 📋 PHASE 1: CAPABILITY & POLICY SYSTEM (15 tasks)

### 1.1 CapabilityDetector Enhancement (5 tasks)

**Task 1.1.1**: Enhance lib/visual/capability/CapabilityDetector.ts
**File**: `lib/visual/capability/CapabilityDetector.ts` (may already exist from Cursor)
**Requirements**:
```typescript
export class CapabilityDetector {
  // WebGL Detection
  detectWebGLSupport(): { webgl: boolean; webgl2: boolean; maxTextureSize: number };

  // WebGPU Detection
  async detectWebGPUSupport(): Promise<{ supported: boolean; adapter: GPUAdapter | null }>;

  // Device Metrics
  getDeviceMetrics(): { memory: number; cores: number; mobile: boolean };

  // DPR Clamping
  getClampedDPR(): number; // Max 1.5 mobile, 2.0 desktop

  // Battery Status
  async getBatteryStatus(): Promise<{ level: number; charging: boolean } | null>;

  // Accessibility
  getPrefersReducedMotion(): boolean;

  // Complete Detection
  async detectAll(): Promise<DeviceTier>;
}
```

**Implementation Details**:
- WebGL: Use canvas.getContext('webgl') and getParameter(MAX_TEXTURE_SIZE)
- WebGPU: navigator.gpu.requestAdapter() with try/catch
- Memory: navigator.deviceMemory || (mobile ? 3 : 8)
- Cores: navigator.hardwareConcurrency || (mobile ? 4 : 8)
- DPR: Math.min(window.devicePixelRatio, mobile ? 1.5 : 2.0)
- Battery: navigator.getBattery() with fallback
- Motion: matchMedia('(prefers-reduced-motion: reduce)')

**Tests**:
- Mock various device scenarios (low/mid/high)
- Verify tier assignment matches Master Plan thresholds
- Test DPR clamping on 4K displays
- Validate fallbacks when APIs unavailable

---

**Task 1.1.2**: Implement Auto-Tier Transitions with Hysteresis
**File**: `lib/visual/performance/tierTransitionManager.ts` (new)
**Requirements**:
```typescript
export class TierTransitionManager {
  private stepDownDuration = 2000; // ms below threshold before action
  private stepUpDuration = 3000;   // ms above threshold before action
  private lastStepDown = 0;
  private cooldownPeriod = 5000;   // Prevent rapid oscillation

  checkAndTransition(currentFPS: number, currentTier: string, maxTier: string): string | null;
  // Returns new tier if transition needed, null if stay same

  private canStepDown(): boolean;  // Check cooldown
  private shouldStepDown(fps: number): boolean; // <25fps for 2s
  private shouldStepUp(fps: number): boolean; // >50fps for 3s
}
```

**Logic**:
- Track FPS below 25: If sustained 2 seconds → step down
- Track FPS above 50: If sustained 3 seconds → step up (if not at max)
- Cooldown: Don't step down more than once per 5 seconds
- Hysteresis: Prevent rapid tier flickering

**Tests**:
- Simulate sustained low FPS → verify step-down after 2s
- Simulate FPS recovery → verify step-up after 3s
- Test cooldown prevents rapid oscillation
- Verify max tier respected (won't go above device capability)

---

**Task 1.1.3**: Implement Battery-Saver Mode Enforcement
**File**: `lib/visual/capability/batterySaverPolicy.ts` (new)
**Requirements**:
```typescript
export function getBatterySaverPolicy(): {
  enabled: boolean;
  forcedTier: 'low' | 'medium' | null;
  reason: string;
}

// Rules:
// 1. If battery <20% AND not charging → Force LOW tier
// 2. If battery <50% AND not charging AND mobile → Force MEDIUM tier
// 3. If system power saver mode → Force LOW tier
// 4. User toggle overrides system detection
```

**Implementation**:
- Check Battery Status API
- Check `navigator.getBattery()` level and charging
- Detect mobile vs desktop
- Return policy enforcement decision

**Tests**:
- Mock battery at 15% → verify force LOW
- Mock battery at 40% mobile → verify force MEDIUM
- Mock battery charging → verify no forcing
- Test user override works

---

**Task 1.1.4**: Create Tier Quality Presets
**File**: Already in `lib/visual/capability/VisualPolicy.ts` (you created)
**Enhancement**: Verify and refine quality presets

**Verify These Exact Values** (from Master Plan):

**LOW**:
- simResolution: 128
- dyeResolution: 256
- pressureIterations: 15
- curl: 15
- velocityDissipation: 0.5
- densityDissipation: 0.9
- targetFPS: 30

**MEDIUM**:
- simResolution: 192
- dyeResolution: 384
- pressureIterations: 20
- curl: 20
- velocityDissipation: 0.4
- densityDissipation: 0.92
- targetFPS: 45-60

**HIGH**:
- simResolution: 256
- dyeResolution: 512
- pressureIterations: 25
- curl: 20
- velocityDissipation: 0.4
- densityDissipation: 0.92
- targetFPS: 60

**ULTRA**:
- Same as HIGH + WebGPU particles enabled
- targetFPS: 60

**Tests**:
- Verify getVisualPolicy('low') returns exact values above
- Check layer enablement: low (CSS only), medium (CSS+WebGL), high (CSS+WebGL+option thin-film)

---

**Task 1.1.5**: Implement DPR Clamping Across All Canvases
**File**: `lib/visual/utils/dprClamp.ts` (new)
**Requirements**:
```typescript
export function getClampedDPR(): number {
  const dpr = window.devicePixelRatio;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  if (isMobile) {
    return Math.min(dpr, 1.5);
  } else {
    return Math.min(dpr, 2.0);
  }
}

export function applyDPRToCanvas(canvas: HTMLCanvasElement): void {
  const dpr = getClampedDPR();
  const width = canvas.clientWidth * dpr;
  const height = canvas.clientHeight * dpr;

  canvas.width = width;
  canvas.height = height;
}
```

**Apply to**:
- LiquidLightBackground.tsx canvas
- Any R3F thin-film canvas (if/when implemented)
- WebGPU canvas (if/when implemented)

**Tests**:
- Test on 4K display (3840x2160 @ 2.0 DPR) → verify clamped to 2.0
- Test on iPhone 15 Pro (460 ppi, ~3.0 DPR) → verify clamped to 1.5
- Verify no soft blurs (under-rendering) or excessive GPU cost (over-rendering)

---

## 📋 PHASE 2: ORCHESTRATOR INTEGRATION (25 tasks)

### 2.1 VisualOrchestrator Provider Completion (10 tasks)

**Task 2.1.1**: Complete VisualOrchestrator.tsx Implementation
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Current State**: Skeleton created (by you)
**Requirements**: Full implementation with all services integrated

```typescript
import { detectDeviceCapabilities, DeviceTier } from '../capability';
import { useAudioReactive } from '@/lib/audio';
import { PaletteDirector, Palette } from '@/lib/palette';
import { getVisualPolicy, VisualPolicy } from '../capability/VisualPolicy';

export function VisualOrchestrator({ children }: { children: React.ReactNode }) {
  const [deviceTier, setDeviceTier] = useState<DeviceTier | null>(null);
  const [visualPolicy, setVisualPolicy] = useState<VisualPolicy | null>(null);
  const [state, setState] = useState<GlobalVisualState>({
    motionEnabled: true,
    intensity: 0.6,
    pureMode: false,
    selectedPalette: 'classic-60s',
    audioReactive: true,
    mode: 'ambient',
    batterySaver: false,
  });

  // Device detection on mount
  useEffect(() => {
    const tier = detectDeviceCapabilities();
    setDeviceTier(tier);

    const policy = getVisualPolicy(tier.tier);
    setVisualPolicy(policy);

    // Check prefers-reduced-motion
    if (tier.prefersReducedMotion) {
      setState(prev => ({ ...prev, motionEnabled: false }));
    }

    // Check battery saver
    // ... battery detection logic
  }, []);

  // Audio integration
  const audioData = useAudioReactive({ enabled: state.audioReactive });

  // Palette integration
  const palette = PaletteDirector.getPalette(state.selectedPalette);

  // Context value
  const value: VisualContextValue = {
    state,
    deviceTier,
    visualPolicy,
    audioData,
    palette,
    setState: (updates) => setState(prev => ({ ...prev, ...updates })),
  };

  return <VisualContext.Provider value={value}>{children}</VisualContext.Provider>;
}
```

**Tests**:
- Provider mounts without errors
- useVisualState() returns correct context
- setState() updates propagate to consumers
- Audio/palette data flows correctly

---

**Task 2.1.2**: Implement State Persistence (localStorage)
**File**: Same as above, enhancement
**Requirements**:
```typescript
// Save state to localStorage on changes
useEffect(() => {
  localStorage.setItem('nfa-liquid-light-state', JSON.stringify(state));
}, [state]);

// Load state on mount
useEffect(() => {
  const saved = localStorage.getItem('nfa-liquid-light-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setState(prev => ({ ...prev, ...parsed }));
    } catch (e) {
      console.warn('Failed to load saved state:', e);
    }
  }
}, []);
```

**Tests**:
- Change settings → refresh page → verify settings persist
- Test with corrupted localStorage → verify graceful fallback
- Test with missing localStorage → verify defaults used

---

**Task 2.1.3**: Implement Pure Mode Enforcement
**Requirements**:
```typescript
// In orchestrator, check pureMode
const effectivePolicy = state.pureMode
  ? getForcedMediumPolicy() // CSS + WebGL fluid only
  : visualPolicy;

function getForcedMediumPolicy(): VisualPolicy {
  return {
    profile: 'medium',
    layers: {
      css: true,
      webglFluid: true,
      thinFilm: false,    // Disabled in Pure Mode
      webgpuParticles: false, // Disabled in Pure Mode
    },
    quality: VISUAL_POLICIES.medium.quality,
    limits: VISUAL_POLICIES.medium.limits,
  };
}

// URL Parameter Support
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pureMode') === 'true') {
    setState(prev => ({ ...prev, pureMode: true }));
  }
}, []);
```

**Tests**:
- Enable Pure Mode → verify thin-film disabled even on high-tier device
- Test URL `?pureMode=true` → verify Pure Mode activates
- Test toggle in UI → verify mode switches correctly

---

**Task 2.1.4**: Wire Battery Saver Mode Auto-Detection
**Requirements**:
```typescript
useEffect(() => {
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      const handleBatteryChange = () => {
        const shouldEnableBatterySaver =
          !battery.charging && battery.level < 0.2;

        if (shouldEnableBatterySaver && !state.batterySaver) {
          setState(prev => ({ ...prev, batterySaver: true }));
          // Optionally notify user
        }
      };

      handleBatteryChange();
      battery.addEventListener('levelchange', handleBatteryChange);
      battery.addEventListener('chargingchange', handleBatteryChange);
    });
  }
}, []);

// Apply battery saver to policy
const effectiveTier = state.batterySaver ? 'low' : deviceTier?.tier;
```

**Tests**:
- Mock battery at 15% not charging → verify battery saver activates
- Mock battery charging → verify battery saver deactivates
- Test user can manually enable/disable via toggle

---

**Task 2.1.5**: Implement Performance Tier Transition Integration
**Requirements**:
```typescript
import { TierTransitionManager } from '../performance/tierTransitionManager';

const transitionManager = useRef(new TierTransitionManager());
const [currentTier, setCurrentTier] = useState(deviceTier?.tier || 'medium');

useEffect(() => {
  // Called from PerformanceMonitor updates
  const interval = setInterval(() => {
    const fps = performanceMonitor.getFPS();
    const newTier = transitionManager.current.checkAndTransition(
      fps,
      currentTier,
      deviceTier?.tier || 'high'
    );

    if (newTier && newTier !== currentTier) {
      setCurrentTier(newTier);
      console.log(`[VisualOrchestrator] Tier transition: ${currentTier} → ${newTier} (FPS: ${fps})`);
    }
  }, 1000); // Check every second

  return () => clearInterval(interval);
}, [currentTier, deviceTier]);
```

**Tests**:
- Simulate FPS drop to 20 → verify step-down after 2 seconds
- Simulate FPS recovery to 55 → verify step-up after 3 seconds
- Test cooldown prevents rapid transitions

---

**Task 2.1.6-2.1.10**: Additional orchestrator enhancements (combine into single implementation)
- Add error boundary around provider
- Implement context provider error handling
- Add debug mode toggle (URL param `?debug=true`)
- Implement visibility change optimization (pause when tab hidden)
- Add orchestrator lifecycle logging (mount/unmount/tier changes)

---

### 2.2 Layer Mounting Logic (10 tasks)

**Task 2.2.1**: Implement Conditional Layer Rendering in Orchestrator
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Requirements**:
```typescript
import { getLayerConfigs } from './layerCoordinator';
import LiquidLightBackground from '@/components/LiquidLightBackground';
import CSSFallback from '@/components/liquid-light/CSSFallback';
// Import thin-film and WebGPU when ready

export function VisualOrchestrator({ children }: { children: React.ReactNode }) {
  // ... state setup from previous tasks ...

  const effectivePolicy = state.pureMode
    ? getForcedMediumPolicy()
    : state.batterySaver
    ? getVisualPolicy('low')
    : getVisualPolicy(currentTier);

  const layerConfigs = getLayerConfigs(effectivePolicy);

  return (
    <VisualContext.Provider value={value}>
      {/* Layer rendering based on policy */}
      {effectivePolicy.layers.css && (
        <CSSFallback
          intensity={state.intensity}
          motionEnabled={state.motionEnabled}
          paletteId={state.selectedPalette}
        />
      )}

      {effectivePolicy.layers.webglFluid && (
        <LiquidLightBackground
          intensity={state.intensity}
          motionEnabled={state.motionEnabled}
          tier={currentTier}
          audioData={audioData}
          palette={palette}
        />
      )}

      {/* Thin-film and WebGPU layers for future weeks */}

      {children}
    </VisualContext.Provider>
  );
}
```

**Tests**:
- Low tier → only CSS renders
- Medium tier → CSS + WebGL fluid renders
- High tier → CSS + WebGL fluid (+ thin-film if enabled)
- Pure Mode → only CSS + WebGL fluid (regardless of tier)

---

**Task 2.2.2**: Update LiquidLightBackground to Accept Orchestrator Props
**File**: `components/LiquidLightBackground.tsx`
**Current**: Self-contained with internal state
**Requirements**: Accept props from orchestrator

Add props interface:
```typescript
interface LiquidLightBackgroundProps {
  intensity?: number;        // 0-1 from orchestrator
  motionEnabled?: boolean;   // From orchestrator
  tier?: 'low' | 'medium' | 'high';  // From orchestrator
  audioData?: AudioData | null;  // From orchestrator
  palette?: Palette | null;  // From orchestrator
}

export default function LiquidLightBackground({
  intensity = 0.6,
  motionEnabled = true,
  tier: externalTier,
  audioData: externalAudioData,
  palette: externalPalette,
}: LiquidLightBackgroundProps = {}) {
  // Use external props if provided, otherwise use internal state (backwards compatible)
  const effectiveIntensity = intensity;
  const effectiveMotion = motionEnabled;
  // ... etc
}
```

**Backwards Compatibility**:
- Component works standalone (for testing)
- Component works with orchestrator (production)
- Props are optional (defaults provided)

**Tests**:
- Render standalone → uses internal state
- Render with orchestrator → uses props
- Change orchestrator state → component updates

---

**Task 2.2.3**: Implement Layer Z-Index Management
**File**: Apply z-index from layerCoordinator to each component

**Z-Index Stack** (from Master Plan):
```typescript
const Z_INDEX_STACK = {
  cssFallback: -50,
  webglFluid: -40,
  thinFilm: -30,
  webgpuParticles: -20,
  // UI starts at 0 and above
};
```

**Apply to components**:
- CSSFallback: `style={{ zIndex: -50 }}`
- LiquidLightBackground: `className="... -z-40"` or style
- Future thin-film: -30
- Future WebGPU: -20

**Tests**:
- All layers render in correct order
- UI never covered by liquid light
- Layers blend correctly (later layers on top)

---

**Task 2.2.4**: Implement Blend Mode Strategy
**File**: Update components with blend modes from layerCoordinator

**Blend Modes** (from research):
- CSS Fallback: `mixBlendMode: 'normal'` (base layer)
- WebGL Fluid: `mixBlendMode: 'screen'` (current, keep)
- Thin-Film: `mixBlendMode: 'screen'` OR `'overlay'` (test which looks better)
- WebGPU: `mixBlendMode: 'screen'` with opacity ~0.3

**Implementation**:
Apply via style prop: `style={{ mixBlendMode: 'screen' }}`

**Tests**:
- Visual test: Do layers enhance each other or fight?
- Try different combinations for thin-film (screen vs overlay)
- Document final decision with screenshots

---

**Task 2.2.5-2.2.10**: Additional layer integration tasks
- Implement layer opacity control (global intensity scaling)
- Add per-layer enable/disable toggles (for debugging)
- Implement layer load order (CSS first, then WebGL, then overlays)
- Add layer error boundaries (if one crashes, others continue)
- Test layer hot-swapping (change tier without page refresh)
- Document layer composition rules

---

### 2.3 Global State Management (5 tasks)

**Task 2.3.1**: Implement useVisualState Hook
**File**: `lib/visual/orchestrator/useVisualState.ts`
**Requirements**:
```typescript
import { useContext } from 'react';
import { VisualContext, VisualContextValue } from './VisualOrchestrator';

export function useVisualState(): VisualContextValue {
  const context = useContext(VisualContext);

  if (!context) {
    throw new Error('useVisualState must be used within VisualOrchestrator provider');
  }

  return context;
}

// Convenience hooks for specific state
export function useVisualIntensity(): [number, (v: number) => void] {
  const { state, setState } = useVisualState();
  return [state.intensity, (v) => setState({ intensity: v })];
}

export function useVisualPalette(): [Palette | null, (id: string) => void] {
  const { palette, setState } = useVisualState();
  return [palette, (id) => setState({ selectedPalette: id })];
}

export function useVisualMode(): [ModeType, (mode: ModeType) => void] {
  const { state, setState } = useVisualState();
  return [state.mode, (mode) => setState({ mode })];
}
```

**Tests**:
- Hook throws error outside provider
- Hook returns correct context inside provider
- Convenience hooks work correctly

---

**Task 2.3.2-2.3.5**: State management enhancements
- Add state validation (clamp intensity 0-1, validate palette ID exists)
- Implement state change listeners/subscriptions
- Add state debugging utilities (log all state changes in dev mode)
- Create state reset function (restore defaults)

---

## 📋 PHASE 3: AUDIO & MOTION INTEGRATION (15 tasks)

### 3.1 Thermal Convection Enhancement (5 tasks)

**Task 3.1.1**: Review and Enhance lib/fluid/thermal.ts
**File**: `lib/fluid/thermal.ts` (existing)
**Current**: Basic thermal current implementation
**Enhancement**: Wire to orchestrator-provided audio data

**Update Function Signature**:
```typescript
export function setupThermalCurrents(
  fluidInstance: any,
  canvas: HTMLCanvasElement,
  thermalRate: number,  // From audio mapping (2-8 events per 10s)
  intensity: number      // Global intensity multiplier
): () => void
```

**Implementation**:
- Use thermalRate to calculate interval: `interval = 10000 / thermalRate` ms
- Scale force by intensity: `force = baseForce * intensity`
- Keep existing bottom-zone logic (bottom 20% of canvas)
- Return cleanup function

**Tests**:
- Low thermal rate (2) → events every 5 seconds
- High thermal rate (8) → events every 1.25 seconds
- Intensity 0.5 → force reduced by half
- Verify upward motion from bottom

---

**Task 3.1.2**: Enhance Global Motion (Rotation)
**File**: `lib/fluid/thermal.ts` (existing function)
**Enhancement**: Make rotation speed audio-reactive

**Update**:
```typescript
export function setupGlobalMotion(
  fluidInstance: any,
  canvas: HTMLCanvasElement,
  rotationSpeed: number  // From audio (scaled by mids)
): () => void
```

**Implementation**:
- Base rotation: 0.01 radians/frame
- Audio-reactive: speed = baseSpeed * (1 + mids * 0.5)
- Keep circular path pattern
- Maintain subtle tangential splats

**Tests**:
- No audio → slow rotation (base speed)
- High mids → faster rotation (1.5x base)
- Verify smooth motion, no jarring changes

---

**Task 3.1.3**: Implement Beat-Reactive Splat System
**File**: New or enhance existing
**Requirements**:
```typescript
export function setupBeatReactiveSplats(
  fluidInstance: any,
  canvas: HTMLCanvasElement,
  audioData: AudioData,
  intensity: number,
  palette: Palette
): void {
  if (audioData.beatDetected) {
    const splatCount = Math.floor(1 + intensity * 2); // 1-3 splats per beat

    for (let i = 0; i < splatCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      // Use audio-mapped splat force
      const force = mapAudioToPhysics(audioData.bass, AUDIO_PHYSICS_MAPPING.SPLAT_FORCE);
      const vx = (Math.random() - 0.5) * force;
      const vy = (Math.random() - 0.5) * force;

      // Use palette color
      const colorIndex = Math.floor(Math.random() * palette.colors.length);
      const color = PaletteDirector.getColorRGB(colorIndex);

      fluidInstance.splat(x, y, vx, vy, color);
    }
  }
}
```

**Integration**: Call this in LiquidLightBackground.tsx audio reactivity effect

**Tests**:
- Play music with strong beat → verify splats on beat
- Check splats use palette colors
- Verify splat force scales with bass
- Test intensity affects splat count

---

**Task 3.1.4**: Implement Random Perturbation System
**File**: New utility or add to thermal.ts
**Requirements**:
```typescript
export function setupRandomPerturbations(
  fluidInstance: any,
  canvas: HTMLCanvasElement,
  intensity: number
): () => void {
  const interval = setInterval(() => {
    if (Math.random() < 0.3 * intensity) {  // 30% chance when intensity=1.0
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const force = 5 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * force;
      const vy = Math.sin(angle) * force;
      const color = [0.5, 0.5, 0.5]; // Neutral gray

      fluidInstance.splat(x, y, vx, vy, color);
    }
  }, 2000); // Check every 2 seconds

  return () => clearInterval(interval);
}
```

**Purpose**: Prevents digital stillness, adds organic unpredictability

**Tests**:
- Verify occasional random splats occur
- Check they don't overwhelm other motion
- Test intensity affects frequency

---

**Task 3.1.5**: Integrate All Motion Systems into LiquidLightBackground
**File**: `components/LiquidLightBackground.tsx`
**Requirements**: Use all three motion systems together

```typescript
// In initFluid effect:
const thermalCleanup = setupThermalCurrents(
  fluidInstance,
  canvas,
  physicsParams.thermalRate,
  state.intensity
);

const motionCleanup = setupGlobalMotion(
  fluidInstance,
  canvas,
  physicsParams.rotationSpeed || 0.01
);

const perturbationCleanup = setupRandomPerturbations(
  fluidInstance,
  canvas,
  state.intensity
);

cleanupFunctions.push(thermalCleanup, motionCleanup, perturbationCleanup);

// In audio effect:
setupBeatReactiveSplats(fluidInstance, canvas, audioData, state.intensity, palette);
```

**Tests**:
- All three systems run simultaneously
- No performance degradation
- Combined motion feels organic
- Beat splats add to (not replace) ambient motion

---

### 3.2 Audio Reactivity Refinement (5 tasks)

**Task 3.2.1**: Implement Audio Smoothing (Prevent Jarring Changes)
**File**: `lib/audio/smoothing.ts` (new)
**Requirements**:
```typescript
export class AudioSmoother {
  private history: number[] = [];
  private windowSize = 3; // Smooth over 3 frames

  smooth(value: number): number {
    this.history.push(value);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }
    return this.history.reduce((a, b) => a + b, 0) / this.history.length;
  }

  reset(): void {
    this.history = [];
  }
}

// Apply to audio data
export function smoothAudioData(raw: AudioData, smoothers: Map<string, AudioSmoother>): AudioData {
  return {
    bass: smoothers.get('bass')!.smooth(raw.bass),
    mids: smoothers.get('mids')!.smooth(raw.mids),
    treble: smoothers.get('treble')!.smooth(raw.treble),
    volume: smoothers.get('volume')!.smooth(raw.volume),
    beatDetected: raw.beatDetected,
    tempo: raw.tempo,
  };
}
```

**Integration**: Apply in useAudioReactive or before passing to components

**Tests**:
- Raw audio has spikes → smoothed audio is gradual
- Visual effects transition smoothly (no jarring jumps)
- Beat detection still responsive (not smoothed away)

---

**Task 3.2.2**: Implement Beat Detection Threshold Tuning
**File**: `lib/audio/beatDetector.ts` (may exist in useAudioReactive.ts)
**Enhancement**: Adaptive threshold for better beat detection

**Adaptive Algorithm**:
```typescript
private beatThreshold = 1.5; // Multiplier above average
private energyHistory: number[] = [];

detectBeat(currentEnergy: number): boolean {
  this.energyHistory.push(currentEnergy);
  if (this.energyHistory.length > 60) {  // 1 second window at 60fps
    this.energyHistory.shift();
  }

  const average = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
  const threshold = average * this.beatThreshold;

  return currentEnergy > threshold;
}
```

**Tests**:
- Play music with varying energy → beats still detected
- Quiet music → threshold adapts down
- Loud music → threshold adapts up
- No false positives during silence

---

**Task 3.2.3-3.2.5**: Additional audio enhancements
- Add tempo detection refinement (if not already solid)
- Implement audio latency compensation (delay visual response to match perceived timing)
- Add frequency band customization (user can adjust bass/mids/treble sensitivity)

---

### 3.3 Motion Language Implementation (5 tasks)

**Task 3.3.1**: Document Motion Design Principles
**File**: `docs/architecture/MOTION-LANGUAGE-SPEC.md` (new)
**Requirements**: Document the complete motion system

**Content**:
1. **Thermal Convection**: Heat-driven upward motion (mimics real physics)
2. **Global Rotation**: Circular path splats (mimics projector rotation)
3. **Random Perturbations**: Organic unpredictability (prevents digital stillness)
4. **Beat Reactivity**: Music-synchronized splats (cultural authenticity)
5. **Combined Effect**: How all four systems work together

Include: Timing diagrams, force vectors, visual examples

---

**Task 3.3.2-3.3.5**: Motion system testing and tuning
- Create motion tuning test page (`app/liquid-light-motion-test/page.tsx`)
- Add motion intensity controls (separate from global intensity)
- Test motion feels "organic" vs "digital" (qualitative)
- Document optimal parameter ranges for each system

---

## 📋 PHASE 4: PALETTE & TONE COHERENCE (15 tasks)

### 4.1 Color System Integration (5 tasks)

**Task 4.1.1**: Wire PaletteDirector to All Components
**Files**: Multiple
**Requirements**: Ensure ALL visual components use PaletteDirector

**Components to update**:
1. `components/LiquidLightBackground.tsx` - Use palette.colors for fluid
2. `components/liquid-light/CSSFallback.tsx` - Already done ✅
3. `components/authentic-liquid-light-engine.tsx` - Use palette for thin-film (future)
4. Any CSS gradient components - Use palette colors

**Implementation**:
```typescript
// In each component
import { PaletteDirector } from '@/lib/palette';

const palette = PaletteDirector.getCurrentPalette();
const colorsRGB = PaletteDirector.getCurrentColorsRGB();

// Use in config
fluidConfig.COLOR_PALETTE = colorsRGB;
```

**Tests**:
- Change palette in controls → all layers update
- Colors match exactly across layers (no hue drift)
- Transitions are smooth (no flicker)

---

**Task 4.1.2**: Implement Unified Gamma/Tone Pipeline
**File**: `lib/visual/color/toneMapping.ts` (new)
**Requirements**: Prevent double gamma correction

**Analysis**:
- CSS: Already in sRGB (browser handles)
- WebGL: May output linear or sRGB depending on shaders
- R3F: Usually linear, needs sRGB conversion

**Implementation**:
```typescript
export const COLOR_SPACE_CONFIG = {
  css: 'srgb',           // Browser native
  webglFluid: 'srgb',    // webgl-fluid-enhanced outputs sRGB
  thinFilm: 'linear',    // R3F renders in linear, needs conversion
  webgpuParticles: 'linear',
};

export function ensureSRGBOutput(layer: string, color: [number, number, number]): [number, number, number] {
  if (COLOR_SPACE_CONFIG[layer] === 'linear') {
    return [
      PaletteDirector.linearToSRGB(color[0]),
      PaletteDirector.linearToSRGB(color[1]),
      PaletteDirector.linearToSRGB(color[2]),
    ];
  }
  return color;
}
```

**Tests**:
- Visual comparison: All layers have same brightness
- No over-bright or dim layers
- Colors look consistent

---

**Task 4.1.3**: Implement Intensity Clamping
**File**: `lib/visual/color/intensityClamp.ts` (new)
**Requirements**: Prevent over-saturation

```typescript
export const INTENSITY_LIMITS = {
  MIN: 0.0,    // Completely off
  MAX: 1.0,    // Maximum (but may still be too bright)
  SAFE_MAX: 0.95,  // Recommended maximum to prevent clipping
  DEFAULT: 0.6,
};

export function clampIntensity(value: number, respectSafeMax: boolean = true): number {
  const max = respectSafeMax ? INTENSITY_LIMITS.SAFE_MAX : INTENSITY_LIMITS.MAX;
  return Math.max(INTENSITY_LIMITS.MIN, Math.min(max, value));
}

// Apply to all visual outputs
export function applyIntensityToColor(
  color: [number, number, number],
  intensity: number
): [number, number, number] {
  const clamped = clampIntensity(intensity);
  return [color[0] * clamped, color[1] * clamped, color[2] * clamped];
}
```

**Apply**: In all components before rendering colors

**Tests**:
- Intensity slider at 100% → verify no over-bright colors
- Test on different display types (OLED, LCD)
- Ensure legibility maintained

---

**Task 4.1.4**: Add UI Legibility Scrims/Darkening
**File**: Enhancement to orchestrator or separate component
**Requirements**: Ensure UI text is readable over liquid light

**Options**:
1. Darken background globally (reduce all layer opacities)
2. Add subtle dark vignette at edges
3. Darken behind text specifically (via CSS mask/clip-path)
4. Reduce saturation in areas under UI

**Recommendation**: Option 1 + 2 (global opacity + vignette)

**Implementation**:
```typescript
// In orchestrator, scale layer opacities
const effectiveOpacity = baseOpacity * (1 - readabilityBoost);

// Add vignette component
<div className="fixed inset-0 pointer-events-none -z-[-25]"
     style={{
       background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)'
     }}
/>
```

**Tests**:
- Read text on lightest backgrounds
- Verify readability in all palettes
- Check WCAG contrast ratios if possible

---

**Task 4.1.5**: Palette Transition Animations
**File**: Enhancement to PaletteDirector or components
**Requirements**: Smooth color transitions when palette changes

**Implementation**:
```typescript
// In components, animate color changes
const [currentColors, setCurrentColors] = useState(palette.colors);

useEffect(() => {
  // Gradual transition over 1 second
  const steps = 60; // 60 frames
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const t = step / steps;

    const interpolated = currentColors.map((color, i) => {
      return PaletteDirector.interpolateColors(color, palette.colors[i], t);
    });

    setCurrentColors(interpolated);

    if (step >= steps) clearInterval(interval);
  }, 16.67); // ~60fps

  return () => clearInterval(interval);
}, [palette.id]);
```

**Tests**:
- Change palette → colors transition smoothly
- No flicker or jarring switches
- Transition completes in ~1 second

---

### 4.2 Palette Testing & Validation (5 tasks)

**Task 4.2.1**: Create Palette Preview Page
**File**: `app/liquid-light-palette-test/page.tsx` (new)
**Requirements**: Visual test page for all palettes

**Content**:
- Show all 8 palettes side-by-side
- Render liquid light with each palette
- Display: Palette name, description, wavelength values, cultural context
- Controls: Switch between palettes, adjust intensity

**Purpose**: Visual validation before Week 3 community review

---

**Task 4.2.2**: Validate Wavelength Accuracy
**File**: Test script or documentation
**Requirements**: Verify wavelength-to-RGB conversion is accurate

**Process**:
1. Generate colors from wavelengths (650nm, 485nm, 580nm, 620nm)
2. Compare to known spectral values
3. Verify against physics references (CIE color matching functions)
4. Document any deviations

**Reference**: https://en.wikipedia.org/wiki/CIE_1931_color_space

**Acceptance**: Colors match expected spectral values within 5% tolerance

---

**Task 4.2.3-4.2.5**: Additional palette validation
- Side-by-side comparison with historical Joshua Light Show footage
- Test palettes with different display types (OLED, LCD, HDR)
- Gather preliminary feedback (screenshot sharing)

---

### 4.3 Song-Specific Palette Enhancement (5 tasks)

**Task 4.3.1**: Add Song Context Metadata
**File**: Enhancement to `lib/palette/PaletteDirector.ts`
**Requirements**: Expand palette metadata

```typescript
export interface Palette {
  id: string;
  name: string;
  description: string;
  colors: string[];
  wavelengths: number[];
  culturalContext: string;
  viscosity: number;
  energy: string;

  // NEW ADDITIONS:
  songInfo?: {
    artist: string;          // "Grateful Dead"
    album?: string;          // "Europe '72"
    year?: number;           // 1972
    vibe: string;            // "Spacey exploration" / "High energy dance"
    recommendedMode: ModeType; // 'ambient' | 'dance-floor' | 'trip'
  };

  colorStory?: string;      // Longer cultural narrative
  audioProfile?: {
    bassEmphasis: number;    // 0-1, how much bass drives this palette
    midsEmphasis: number;
    trebleEmphasis: number;
  };
}
```

**Add to Each Song Palette**: Complete metadata

**Example** (Dark Star):
```typescript
songInfo: {
  artist: 'Grateful Dead',
  album: 'Grateful Dead (Skull & Roses)',
  year: 1971,
  vibe: 'Spacey cosmic exploration, extended improvisation',
  recommendedMode: 'trip',
},
colorStory: 'Deep purples and blues evoke the infinite cosmic journey of Dark Star, the Grateful Dead's ultimate space jam. These wavelengths (420-510nm) mirror the contemplative, exploratory nature of their longest and most psychedelic compositions.',
audioProfile: {
  bassEmphasis: 0.3,  // Less bass-driven
  midsEmphasis: 0.7,  // Mids drive flow
  trebleEmphasis: 0.5,
}
```

**Acceptance**: All 5 song palettes have complete metadata

---

**Task 4.3.2**: Create Palette UI with Rich Information
**File**: Enhancement to `components/liquid-light/controls/LiquidLightControls.tsx`
**Requirements**: Show rich palette information in UI

**UI Enhancements**:
- Palette cards instead of dropdown (expandable)
- Show: Song info, color story, recommended mode
- Visual: Larger color swatches with wavelength labels
- Interactive: Click card to select palette
- Responsive: Works on mobile and desktop

**Tests**:
- UI is discoverable and attractive
- Information is helpful (not overwhelming)
- Mobile layout works well

---

**Task 4.3.3-4.3.5**: Additional song palette features
- Add "auto-palette" mode (switches palette based on detected tempo/energy)
- Implement palette favorites (user can save preferred palettes)
- Create palette sharing (URL parameter to load specific palette: `?palette=dark-star`)

---

## 📋 PHASE 5: ACCESSIBILITY & SAFETY (10 tasks)

### 5.1 Motion Safety (5 tasks)

**Task 5.1.1**: Implement Comprehensive prefers-reduced-motion
**File**: All visual components
**Requirements**: Every visual element must respect the preference

**Components to check**:
- LiquidLightBackground.tsx
- CSSFallback.tsx (already done ✅)
- Future thin-film
- Any CSS animations

**Behavior When Reduced Motion Preferred**:
- Fluid: Freeze simulation OR reduce to ultra-slow drift
- CSS: Static gradients (no animation)
- Splats: Disable beat-reactive and random
- Thermal: Disable or reduce to once per minute
- Rotation: Disable

**Implementation**:
```typescript
const prefersReduced = useVisualState().deviceTier?.prefersReducedMotion;

if (prefersReduced) {
  // Override motion settings
  effectiveMotionEnabled = false;
}
```

**Tests**:
- Enable system setting → verify all motion stops
- User can manually override via controls
- Test with real reduced-motion users (accessibility)

---

**Task 5.1.2**: Implement Strobe/Flash Prevention
**File**: `lib/visual/safety/flashPrevention.ts` (new)
**Requirements**: Prevent triggering photosensitivity

**Rules**:
- No more than 3 flashes per second
- Flash defined as: >10% brightness change in <100ms
- Beat splats: Limit to max 2 per second
- Color changes: No rapid oscillation

**Implementation**:
```typescript
export class FlashPreventer {
  private lastFlashTime = 0;
  private minInterval = 333; // ms (3 flashes/second max)

  canFlash(): boolean {
    const now = Date.now();
    if (now - this.lastFlashTime < this.minInterval) {
      return false;
    }
    this.lastFlashTime = now;
    return true;
  }
}

// Apply to beat splats
if (audioData.beatDetected && flashPreventer.canFlash()) {
  // Trigger splat
}
```

**Tests**:
- Rapid beats → verify rate limiting
- No more than 3 flashes/second
- Visual effects still look good (not broken by limiting)

---

**Task 5.1.3**: Add Brightness Ceiling
**File**: Enhancement to intensity control
**Requirements**: Cap maximum brightness

**Implementation**:
```typescript
const BRIGHTNESS_CEILING = 0.95; // Never go full 1.0

// In all components
const safeBrightness = Math.min(intensity, BRIGHTNESS_CEILING);
```

**Rationale**: Prevents potential photosensitivity triggers, ensures comfortable viewing

**Tests**:
- Intensity at 100% → verify actual brightness is 95%
- Compare with and without ceiling (should be barely noticeable)

---

**Task 5.1.4-5.1.5**: Additional safety features
- Add "Safe Mode" preset (minimal motion, low contrast, slow changes)
- Implement usage time warning (after 30 minutes, suggest break)

---

### 5.2 User Controls Accessibility (5 tasks)

**Task 5.2.1**: Add Keyboard Navigation to Controls
**File**: `components/liquid-light/controls/LiquidLightControls.tsx`
**Requirements**: Full keyboard accessibility

**Keyboard Shortcuts**:
- `Tab`: Navigate through controls
- `Enter/Space`: Toggle buttons
- `Arrow keys`: Adjust slider
- `Escape`: Close controls panel
- `1-4`: Quick mode selection
- `L`: Toggle controls panel visibility

**ARIA**:
- Proper labels on all controls
- Live regions for state changes
- Focus management

**Tests**:
- Navigate without mouse
- Screen reader announces changes
- Focus indicators visible

---

**Task 5.2.2**: Add Touch-Optimized Controls for Mobile
**File**: Same as above
**Requirements**: Larger touch targets, mobile-friendly UI

**Enhancements**:
- Touch targets: Minimum 44x44px (Apple guidelines)
- Slider: Larger thumb for easier grabbing
- Palette selector: Touch-friendly cards instead of dropdown
- Panel: Swipe to close gesture

**Tests**:
- Test on actual mobile device (if available)
- Verify touch targets are easy to hit
- Check gestures work smoothly

---

**Task 5.2.3-5.2.5**: Additional control enhancements
- Add control tooltips (explain what each control does)
- Implement settings export/import (share configuration)
- Add "Reset to Defaults" button

---

## 📋 PHASE 6: PERFORMANCE GOVERNANCE (15 tasks)

### 6.1 Adaptive Quality System (5 tasks)

**Task 6.1.1**: Implement Granular Resolution Scaling
**File**: `lib/visual/performance/adaptiveQuality.ts` (new)
**Requirements**: More granular than tier-based step-down

**Algorithm**:
```typescript
export function calculateAdaptiveResolution(
  currentFPS: number,
  currentResolution: number,
  targetFPS: number
): number {
  if (currentFPS < targetFPS * 0.8) {
    // FPS below 80% of target → reduce resolution by 25%
    return Math.floor(currentResolution * 0.75);
  } else if (currentFPS > targetFPS * 1.1) {
    // FPS above 110% of target → increase resolution by 10%
    return Math.floor(currentResolution * 1.1);
  }
  return currentResolution; // No change
}

// Clamp to tier limits
export function clampToTierLimits(
  resolution: number,
  tier: 'low' | 'medium' | 'high'
): number {
  const limits = {
    low: { min: 64, max: 128 },
    medium: { min: 128, max: 256 },
    high: { min: 192, max: 512 },
  };

  return Math.max(limits[tier].min, Math.min(limits[tier].max, resolution));
}
```

**Integration**: Apply in LiquidLightBackground.tsx performance monitoring

**Tests**:
- FPS drops to 40 → resolution scales down
- FPS improves to 65 → resolution scales up
- Resolution stays within tier limits

---

**Task 6.1.2**: Implement Frame Pacing Measurement
**File**: `lib/visual/performance/framePacing.ts` (new)
**Requirements**: Track time budget per frame

```typescript
export class FramePacer {
  private frameStartTime = 0;
  private frameTimes: number[] = [];
  private targetFrameTime = 16.67; // ms for 60fps

  startFrame(): void {
    this.frameStartTime = performance.now();
  }

  endFrame(): void {
    const frameTime = performance.now() - this.frameStartTime;
    this.frameTimes.push(frameTime);

    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
  }

  getAverageFrameTime(): number {
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  isExceedingBudget(): boolean {
    return this.getAverageFrameTime() > this.targetFrameTime * 1.2; // 20% over budget
  }

  setTargetFPS(fps: number): void {
    this.targetFrameTime = 1000 / fps;
  }
}
```

**Integration**: Call startFrame()/endFrame() in RAF loops

**Tests**:
- Measure actual frame times
- Verify budget detection works
- Test target FPS adjustment (30fps vs 60fps)

---

**Task 6.1.3-6.1.5**: Additional performance features
- Implement frame skip logic (if frame time >20ms, skip non-essential updates)
- Add GPU memory estimation (track texture sizes)
- Implement performance telemetry (log metrics for analysis)

---

### 6.2 Context Loss & Recovery (5 tasks)

**Task 6.2.1**: Enhanced WebGL Context Loss Handling
**File**: `lib/visual/webgl/contextManager.ts` (new)
**Requirements**: Robust context loss recovery

```typescript
export class WebGLContextManager {
  private canvas: HTMLCanvasElement;
  private onLoss: () => void;
  private onRestore: () => void;

  constructor(canvas: HTMLCanvasElement, handlers: { onLoss: () => void; onRestore: () => void }) {
    this.canvas = canvas;
    this.onLoss = handlers.onLoss;
    this.onRestore = handlers.onRestore;

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault(); // CRITICAL: Prevent permanent loss
      console.warn('[WebGL] Context lost, attempting recovery');
      this.onLoss();
    });

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('[WebGL] Context restored, re-initializing');
      this.onRestore();
    });
  }

  // Manual recovery trigger
  async attemptRestore(): Promise<boolean> {
    const ext = gl?.getExtension('WEBGL_lose_context');
    if (ext && ext.restoreContext) {
      ext.restoreContext();
      return true;
    }
    return false;
  }

  dispose(): void {
    // Remove event listeners
  }
}
```

**Integration**: Use in LiquidLightBackground.tsx

**Tests**:
- Force context loss (DevTools Rendering panel)
- Verify CSS fallback activates
- Test restoration if available
- Ensure no crashes or blank screens

---

**Task 6.2.2-6.2.5**: Additional context management
- Implement context loss notification to user (toast message)
- Add manual "Retry" button after context loss
- Test context loss during active use (mid-animation)
- Document context loss recovery flow

---

### 6.3 Visibility & Lifecycle (5 tasks)

**Task 6.3.1**: Implement Visibility Change Optimization
**File**: Enhancement to orchestrator
**Requirements**: Pause when tab not visible

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause animations, reduce RAF frequency
      setState(prev => ({ ...prev, isPaused: true }));
    } else {
      // Resume animations
      setState(prev => ({ ...prev, isPaused: false }));
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);

// In components, check isPaused
if (state.isPaused) {
  // Skip RAF updates or run at reduced frequency (e.g., 10fps instead of 60fps)
}
```

**Benefits**: Saves battery, reduces CPU when tab not active

**Tests**:
- Switch tabs → verify RAF slows or stops
- Return to tab → verify smooth resume
- Check battery drain reduced when hidden

---

**Task 6.3.2-6.3.5**: Additional lifecycle management
- Implement component unmount cleanup checklist
- Add memory leak detection tests (30-minute session)
- Document proper cleanup patterns
- Create cleanup verification utility

---

## 📋 PHASE 7: DEVELOPER TOOLING (10 tasks)

### 7.1 Debug HUD Enhancement (5 tasks)

**Task 7.1.1**: Create Comprehensive Performance HUD
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Requirements**: Enhanced debugging display

**Display Metrics**:
```typescript
interface HUDMetrics {
  // Performance
  fps: number;
  frameTime: number; // ms
  frameTimeAvg: number; // ms, rolling average

  // Tier & Policy
  deviceTier: string;
  currentTier: string;
  policy: string; // "high" | "medium-battery-saver" | "low-pure-mode"

  // Layers
  activeLayers: string[];  // ["css", "webgl-fluid"]
  layerCount: number;

  // Audio
  bass: number;
  mids: number;
  treble: number;
  beatDetected: boolean;

  // Device
  webglVersion: string; // "WebGL 2.0"
  maxTextureSize: number;
  deviceMemory: number; // GB
  batteryLevel: number | null; // %

  // Resources
  canvasResolution: string; // "1920x1080"
  simResolution: string;    // "256x256"
  dpr: number;
  memoryUsage: number | null; // MB
}
```

**UI Design**:
- Position: Top-right, draggable
- Visibility: `process.env.NODE_ENV === 'development'` OR `?debug=true`
- Style: Semi-transparent black background, monospace font
- Collapsible: Click to minimize/expand
- Color-coded: Green (good), Yellow (warning), Red (critical)

**Tests**:
- Verify all metrics display correctly
- Test HUD is draggable
- Check collapse/expand works
- Ensure doesn't block UI interactions

---

**Task 7.1.2**: Add Performance Graph Visualization
**File**: Enhancement to PerformanceHUD
**Requirements**: Real-time FPS graph

**Implementation**:
- Mini canvas showing FPS over last 5 seconds
- X-axis: Time, Y-axis: FPS (0-60)
- Color: Green >50fps, Yellow 30-50fps, Red <30fps
- Update: 10 times per second
- Lightweight: <100 LOC

**Visual**: Small line graph (200x60px)

**Tests**:
- Graph updates in real-time
- Colors indicate performance state
- Minimal performance impact (<1% CPU)

---

**Task 7.1.3**: Add Layer Toggle Controls in HUD
**File**: Same as above
**Requirements**: Enable/disable layers for debugging

**UI**:
```
Active Layers:
☑ CSS Fallback
☑ WebGL Fluid
☐ Thin-Film (disabled - tier too low)
☐ WebGPU Particles (disabled - not supported)
```

**Functionality**:
- Click checkbox to force enable/disable layer
- Override policy temporarily
- Reset button to restore policy defaults

**Tests**:
- Disable WebGL fluid → verify CSS fallback shows
- Re-enable → verify WebGL returns
- Test helps with debugging layer issues

---

**Task 7.1.4**: Add Spector.js Integration Notes
**File**: `docs/guides/SPECTOR-JS-DEBUGGING.md` (new)
**Requirements**: Document how to use Spector.js for GPU debugging

**Content**:
1. What is Spector.js (WebGL capture/analysis tool)
2. How to install (browser extension or npm package)
3. How to capture a frame from liquid light
4. What to look for (draw calls, texture sizes, FBO usage, shader performance)
5. Common issues and solutions

**Include**:
- Screenshots of Spector.js analyzing liquid light
- Interpretation guide (what good/bad looks like)
- Performance optimization tips from Spector analysis

**Reference**: https://github.com/BabylonJS/Spector.js

---

**Task 7.1.5**: Create Feature Toggle System
**File**: `lib/visual/dev/featureFlags.ts` (new)
**Requirements**: Enable/disable features for testing

```typescript
export const FEATURE_FLAGS = {
  enableThinFilm: false,        // Thin-film overlay (Week 5-6)
  enableWebGPU: false,           // WebGPU particles (experimental)
  enableAudioReactivity: true,   // Audio-reactive effects
  enableThermalMotion: true,     // Thermal convection
  enableBeatSplats: true,        // Beat-reactive splats
  enableDevelopmentHUD: process.env.NODE_ENV === 'development',
  forceHighQuality: false,       // Ignore tier, force HIGH
  forceLowQuality: false,        // Ignore tier, force LOW
};

// Check flag before enabling feature
if (FEATURE_FLAGS.enableThinFilm && tier === 'high') {
  // Mount thin-film
}
```

**Tests**:
- Toggle flags → features enable/disable
- Verify no conflicts (forceHigh + forceLow both false or error)
- Test helps isolate feature bugs

---

## 📋 PHASE 8: TESTING & VALIDATION INFRASTRUCTURE (20 tasks)

### 8.1 Device Testing Matrix (5 tasks)

**Task 8.1.1**: Create Device Test Suite
**File**: `docs/testing/DEVICE-TEST-MATRIX.md` (new)
**Requirements**: Comprehensive test scenarios

**Test Matrix**:

| Device | Tier | Browser | Tests |
|--------|------|---------|-------|
| Galaxy A52 (2-year old) | LOW | Chrome Android | 30fps, <10% battery/hour, thermal stable |
| iPhone 13 | MEDIUM | Safari iOS | 45fps, <5% battery/hour ambient |
| iPhone 15 Pro | HIGH | Safari iOS | 60fps, <15% battery with thin-film |
| Dell XPS 13 (integrated GPU) | MEDIUM | Chrome/Firefox/Edge | 60fps, <20% CPU |
| Gaming PC (RTX 3060) | HIGH-ULTRA | Chrome | 60fps all layers, <30% GPU |

**For Each Device**:
1. Test baseline (Week 1 delivery)
2. Test tier assignment accuracy
3. Measure FPS stability
4. Measure battery drain (mobile)
5. Monitor memory usage
6. Check thermal throttling (mobile)
7. Verify controls work
8. Test palette switching
9. Test mode presets
10. Extended session (30 min)

**Acceptance**: All devices meet their tier targets

---

**Task 8.1.2**: Implement Automated Performance Benchmarking
**File**: `scripts/benchmark-liquid-light.js` (new)
**Requirements**: Automated performance testing

**Script**:
- Use Puppeteer or Playwright
- Navigate to liquid light page
- Measure FPS for 30 seconds at each tier
- Measure memory usage
- Detect tier transitions
- Generate report

**Output**: CSV or JSON with performance data

**Usage**: `node scripts/benchmark-liquid-light.js`

**Tests**:
- Run on CI/CD (if available)
- Compare before/after optimizations
- Track performance regressions

---

**Task 8.1.3-8.1.5**: Additional device testing
- Create mobile device checklist (iOS vs Android differences)
- Test on various GPUs (Intel, AMD, NVIDIA, ARM)
- Document browser-specific quirks (Safari, Firefox, Chrome differences)

---

### 8.2 Stability Testing (5 tasks)

**Task 8.2.1**: Implement 3-Hour Stress Test
**File**: `scripts/stress-test-liquid-light.js` (new)
**Requirements**: Extended stability validation

**Test Procedure**:
1. Load liquid light page
2. Run for 3 hours (simulated event duration)
3. Monitor every 60 seconds:
   - Current FPS
   - Memory usage (heap size)
   - Any errors logged
   - Context loss events
4. Test user interactions periodically:
   - Change palette
   - Adjust intensity
   - Toggle motion
5. Generate stability report

**Acceptance Criteria**:
- No crashes over 3 hours
- Memory stable (no growth >20MB)
- FPS stable (no sustained degradation)
- Zero context loss OR successful recovery

---

**Task 8.2.2**: Test Rapid State Changes
**File**: Test script or manual procedure
**Requirements**: Ensure system handles rapid user input

**Test Scenarios**:
- Rapidly switch palettes (10 times in 5 seconds)
- Quickly drag intensity slider back and forth
- Rapidly toggle motion on/off
- Switch modes quickly

**Verify**:
- No crashes
- No visual glitches
- System remains responsive
- Final state is correct (no stuck states)

---

**Task 8.2.3-8.2.5**: Additional stability tests
- Test memory leak detection (allocate and release resources repeatedly)
- Test concurrent user interactions (multiple controls at once)
- Test error recovery (simulate errors, verify system recovers)

---

### 8.3 Cross-Browser Testing (5 tasks)

**Task 8.3.1**: Test on All Major Browsers
**Browsers**: Chrome, Firefox, Safari, Edge
**Requirements**: Feature parity across browsers

**Test on Each**:
1. WebGL support and performance
2. Audio API functionality
3. Battery API (may not be available)
4. prefers-reduced-motion respect
5. CSS fallback appearance
6. Control UI rendering
7. Any browser-specific bugs

**Document**: Browser compatibility matrix with known issues

---

**Task 8.3.2**: Test Safari-Specific Issues
**Known Safari Quirks**:
- WebGL context loss more common
- Audio API permissions different
- Battery API not available
- Some CSS properties unsupported

**Specific Tests**:
- Context loss recovery on Safari
- Audio fallback when mic denied
- CSS fallback on older Safari versions
- iOS Safari vs Mac Safari differences

---

**Task 8.3.3-8.3.5**: Additional browser tests
- Test Firefox-specific issues (WebGPU support status)
- Test Edge Chromium compatibility
- Test mobile browser variants (Chrome Android, Safari iOS, Samsung Internet)

---

### 8.4 Automated Testing Setup (5 tasks)

**Task 8.4.1**: Set Up Jest + React Testing Library
**File**: `jest.config.js` (create if not exists)
**Requirements**: Full testing environment

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/visual/**/*.{ts,tsx}',
    'lib/palette/**/*.{ts,tsx}',
    'lib/audio/**/*.{ts,tsx}',
    'components/liquid-light/**/*.{ts,tsx}',
  ],
};
```

**Install**: `npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest`

---

**Task 8.4.2**: Write PaletteDirector Tests
**File**: `lib/palette/__tests__/PaletteDirector.test.ts`
**Requirements**: Comprehensive unit tests

```typescript
describe('PaletteDirector', () => {
  test('getPalette returns correct palette', () => {
    const palette = PaletteDirector.getPalette('classic-60s');
    expect(palette.id).toBe('classic-60s');
    expect(palette.colors).toHaveLength(4);
  });

  test('wavelengthToRGB converts accurately', () => {
    const [r, g, b] = wavelengthToRGB(650); // Red
    expect(r).toBeCloseTo(1.0, 1);
    expect(g).toBeCloseTo(0.0, 1);
    expect(b).toBeCloseTo(0.0, 1);
  });

  test('interpolateColors produces gradient', () => {
    PaletteDirector.setCurrentPalette('classic-60s');
    const color = PaletteDirector.getColor(0.5, true);
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  // Add 10+ more tests covering all methods
});
```

**Coverage Target**: >90% for PaletteDirector

---

**Task 8.4.3**: Write Audio Mapping Tests
**File**: `lib/audio/__tests__/mapping.test.ts`
**Requirements**: Test calculation accuracy

```typescript
describe('Audio Mapping', () => {
  test('mapAudioToPhysics interpolates correctly', () => {
    const result = mapAudioToPhysics(0.5, AUDIO_PHYSICS_MAPPING.SPLAT_FORCE);
    expect(result).toBe(15.5); // Midpoint of 8-23 range
  });

  test('calculatePhysicsParams returns valid values', () => {
    const audioData = { bass: 0.8, mids: 0.5, treble: 0.3, volume: 0.6, beatDetected: false };
    const params = calculatePhysicsParams(audioData);

    expect(params.splatForce).toBeGreaterThan(8);
    expect(params.splatForce).toBeLessThan(23);
    expect(params.thermalRate).toBeGreaterThan(2);
    expect(params.thermalRate).toBeLessThan(8);
  });

  // Add 10+ more tests
});
```

**Coverage Target**: >90% for audio module

---

**Task 8.4.4-8.4.5**: Additional automated testing
- Write VisualOrchestrator tests (provider, hooks, state management)
- Write component tests (CSSFallback, LiquidLightControls)

---

## 📋 PHASE 9: CULTURAL INTEGRATION (10 tasks)

### 9.1 Song Palette Enrichment (5 tasks)

**Task 9.1.1**: Add Detailed Song Descriptions
**File**: `lib/palette/songDescriptions.ts` (new)
**Requirements**: Rich cultural context for each song palette

**Content for Each Song**:
- Song history and significance in Grateful Dead catalog
- Typical jam length and structure
- Visual aesthetic description
- Recommended use cases (events, moods, contexts)
- Links to recordings or performances (optional)

**Example** (Fire on the Mountain):
```markdown
## Fire on the Mountain

**Song History**: A high-energy anthem from the late 1970s, often paired with "Scarlet Begonias" in the legendary "Scarlet → Fire" combo. Known for its driving rhythm and climactic build, it became a staple of second sets.

**Jam Structure**: Usually 10-15 minutes, building intensity with Jerry Garcia's soaring guitar leads. The jam accelerates from a moderate groove to explosive peaks.

**Visual Aesthetic**: Fiery reds and oranges (580-650nm) evoke the song's title and energy. These wavelengths represent heat and intensity, perfect for the building climax of the jam.

**Recommended For**:
- High-energy moments
- Event peaks and celebrations
- Dance floor activation
- When you want maximum intensity

**Viscosity**: 0.04 (fast, energetic flow)
**Energy**: accelerating_climactic
```

**Acceptance**: All 5 song palettes have rich descriptions

---

**Task 9.1.2**: Create Palette Selection UI with Stories
**File**: `components/liquid-light/controls/PaletteCards.tsx` (new)
**Requirements**: Rich UI for palette selection

**Design**:
- Card-based layout (not dropdown)
- Each card shows:
  - Palette name
  - 4 color swatches with wavelength labels
  - Short description
  - "Learn More" expandable section
  - "Select" button
- Selected palette highlighted
- Responsive grid (2 cols mobile, 3-4 cols desktop)

**Interactive**:
- Click card to select palette
- Expand "Learn More" for full song description
- Preview animation on hover (show palette in action)

**Tests**:
- UI is attractive and usable
- Works on mobile and desktop
- Selection updates visual state
- Information is helpful

---

**Task 9.1.3-9.1.5**: Additional cultural features
- Add "Song of the Day" feature (recommend a palette based on date/time)
- Implement palette history (track recently used palettes)
- Create palette sharing (generate shareable link with palette preset)

---

### 9.2 Cultural Terminology Integration (5 tasks)

**Task 9.2.1**: Audit All UI Text for Cultural Authenticity
**File**: Documentation task
**Requirements**: Review all UI text, ensure authentic Deadhead terminology

**Terms to Use** (from CULTURAL_LANGUAGE_GUIDE.md if exists):
- "Turn On the Light" (not "Enable Effects")
- "Dance Floor Mode" (not "High Intensity Mode")
- "Trip Mode" (not "Maximum Effects")
- "Ambient Mode" (not "Low Intensity")
- Reference Joshua Light Show in help text

**Terms to Avoid**:
- Corporate jargon
- Generic tech terms
- Overly formal language

**Acceptance**: All UI feels culturally authentic, not sterile

---

**Task 9.2.2-9.2.5**: Additional cultural integration
- Add tooltips with cultural context (explain why "Turn On the Light")
- Create onboarding tooltip sequence (first-time users)
- Write help text explaining liquid light show history
- Add "About Liquid Light" modal with Joshua Light Show info

---

## 📋 PHASE 10: DOCUMENTATION & GUIDES (15 tasks)

### 10.1 Technical Documentation (5 tasks)

**Task 10.1.1**: Write Complete VisualOrchestrator Guide
**File**: `lib/visual/orchestrator/README.md`
**Requirements**: Comprehensive usage guide

**Sections**:
1. **Overview**: What is VisualOrchestrator and why it exists
2. **Architecture**: Provider pattern, context, services
3. **Usage**: How to wrap app, how to access state
4. **API Reference**: All exported functions and hooks
5. **Examples**: Common use cases with code
6. **Troubleshooting**: Common issues and solutions

**Length**: 2,000+ words, comprehensive

---

**Task 10.1.2**: Document Audio System
**File**: `lib/audio/README.md`
**Content**:
- How audio analysis works (Web Audio API)
- Frequency band definitions
- Beat detection algorithm
- Audio-to-physics mappings
- How to customize sensitivity
- Troubleshooting microphone permissions

**Length**: 1,500+ words

---

**Task 10.1.3**: Document Palette System
**File**: `lib/palette/README.md`
**Content**:
- Wavelength science explained
- All palette descriptions
- How to create custom palettes
- Color space utilities
- sRGB/gamma correction explained
- Cultural context for song palettes

**Length**: 2,000+ words

---

**Task 10.1.4**: Document Performance System
**File**: `lib/visual/performance/README.md`
**Content**:
- How FPS monitoring works
- Tier transition logic
- Performance budgets
- Optimization strategies
- Battery saver mode
- Troubleshooting performance issues

**Length**: 1,500+ words

---

**Task 10.1.5**: Create Architecture Overview
**File**: `docs/architecture/LIQUID-LIGHT-ARCHITECTURE.md`
**Requirements**: High-level architecture document

**Sections**:
1. System overview (4-layer architecture)
2. Service architecture (orchestrator + AudioBus + PaletteDirector)
3. Data flow (user → state → services → layers → visuals)
4. Performance architecture (monitoring, adaptation, fallbacks)
5. Integration points (how to add new features)

**Diagrams**: Include ASCII diagrams or mermaid charts

**Length**: 3,000+ words

---

### 10.2 User-Facing Guides (5 tasks)

**Task 10.2.1**: Create End-User Guide
**File**: `docs/guides/LIQUID-LIGHT-USER-GUIDE.md`
**Requirements**: Non-technical guide for users

**Content**:
1. **What is Liquid Light**: Joshua Light Show history, cultural significance
2. **How to Use Controls**: Step-by-step with screenshots
3. **Palettes Explained**: What each palette represents
4. **Modes Explained**: When to use each mode
5. **Accessibility**: How to disable if motion-sensitive
6. **Troubleshooting**: Common issues for users

**Tone**: Friendly, cultural, non-technical

**Length**: 2,000+ words

---

**Task 10.2.2**: Create Performance Troubleshooting FAQ
**File**: `docs/guides/LIQUID-LIGHT-PERFORMANCE-FAQ.md`
**Requirements**: Common issues and solutions

**Q&A Format**:
- Q: "Why is my phone getting hot?" → A: Enable Pure Mode or Battery Saver
- Q: "FPS is low, what do I do?" → A: [Steps to check/fix]
- Q: "Colors look wrong" → A: [Check palette, check display settings]
- Q: "No audio reactivity" → A: [Check mic permissions, test with sound]
- 20+ Q&A pairs

**Length**: 1,500+ words

---

**Task 10.2.3**: Create Ambassador Field Guide
**File**: `docs/guides/AMBASSADOR-LIQUID-LIGHT-FIELD-GUIDE.md`
**Requirements**: On-site troubleshooting for ambassadors

**Content**:
- How to use debug HUD at events
- Common user issues and quick fixes
- When to recommend Pure Mode
- How to help users adjust settings
- Performance troubleshooting on-site
- Battery management advice

**Format**: Quick reference cards, checklists

**Length**: 1,000+ words

---

**Task 10.2.4-10.2.5**: Additional guides
- Create video tutorial script (for future video creation)
- Write social media sharing guide (how to get best screenshots)

---

### 10.3 API & Reference Documentation (5 tasks)

**Task 10.3.1**: Generate TypeScript API Documentation
**File**: `docs/api/LIQUID-LIGHT-API.md` (new)
**Requirements**: Complete API reference

**Generate from Code**:
- All exported functions
- All interfaces
- All constants
- Parameter types and descriptions
- Return values
- Usage examples

**Tools**: Consider using TypeDoc or manual documentation

**Length**: 3,000+ words (comprehensive reference)

---

**Task 10.3.2-10.3.5**: Additional API documentation
- Create configuration reference (all constants and their meanings)
- Document event hooks and callbacks
- Create migration guide (if upgrading from old implementations)
- Write plugin/extension guide (how to add new visual effects)

---

## 📋 PHASE 11: PRODUCTION HARDENING (10 tasks)

### 11.1 Error Handling (5 tasks)

**Task 11.1.1**: Implement Comprehensive Error Boundaries
**File**: `components/liquid-light/ErrorBoundary.tsx`
**Requirements**: Catch and handle all visual errors

```typescript
export class LiquidLightErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[LiquidLight] Error caught:', error, info);

    // Log to error service (if configured)
    // Show CSS fallback
    // Optionally notify user with toast
  }

  render() {
    if (this.state.hasError) {
      return <CSSFallback intensity={0.5} motionEnabled={true} />;
    }

    return this.props.children;
  }
}
```

**Wrap**: All liquid light components in error boundary

**Tests**:
- Simulate component error → verify fallback shows
- Check error logged correctly
- Verify app doesn't crash

---

**Task 11.1.2**: Implement Graceful Degradation Checklist
**File**: `lib/visual/utils/gracefulDegradation.ts` (new)
**Requirements**: Verify all failure modes have fallbacks

**Checklist**:
- ✅ WebGL unavailable → CSS fallback
- ✅ Audio API denied → Simulated audio
- ✅ Palette ID invalid → Default to classic-60s
- ✅ Service initialization fails → Continue without that service
- ✅ Component renders error → Show CSS fallback
- ✅ Tier detection fails → Default to MEDIUM tier
- ✅ State load fails → Use default state

**Function**:
```typescript
export function handleServiceFailure(serviceName: string, error: Error): void {
  console.warn(`[${serviceName}] Initialization failed, using fallback:`, error);
  // Apply appropriate fallback
  // Continue app execution
}
```

**Tests**: Simulate each failure mode, verify graceful handling

---

**Task 11.1.3-11.1.5**: Additional error handling
- Add error telemetry (log errors to analytics if configured)
- Create error recovery UI (retry buttons, refresh suggestions)
- Document all error scenarios and fallback paths

---

### 11.2 Production Optimization (5 tasks)

**Task 11.2.1**: Optimize Bundle Size
**File**: Analysis and code-splitting task
**Requirements**: Minimize impact on bundle

**Analysis**:
- Run: `npm run build` with bundle analyzer
- Check: Size of liquid light code
- Target: <100KB for all liquid light services + components

**Optimizations**:
- Dynamic imports for heavy components
- Code split WebGPU (only load if supported)
- Tree-shake unused palette utilities
- Minify production builds

**Tests**:
- Compare before/after bundle sizes
- Verify liquid light code <100KB
- Check load time impact (<500ms)

---

**Task 11.2.2**: Implement Resource Cleanup Verification
**File**: `lib/visual/utils/cleanupVerifier.ts` (new)
**Requirements**: Ensure no memory leaks

**Checklist on Unmount**:
- ✅ WebGL context disposed
- ✅ RAF loops cancelled
- ✅ Intervals cleared
- ✅ Event listeners removed
- ✅ Textures/framebuffers released
- ✅ Audio analyzer disconnected

**Implementation**:
```typescript
export class CleanupVerifier {
  private resources: Map<string, boolean> = new Map();

  register(name: string): void {
    this.resources.set(name, false); // Not cleaned up yet
  }

  markCleaned(name: string): void {
    this.resources.set(name, true);
  }

  verify(): boolean {
    const uncleaned = Array.from(this.resources.entries())
      .filter(([_, cleaned]) => !cleaned)
      .map(([name]) => name);

    if (uncleaned.length > 0) {
      console.warn('[CleanupVerifier] Resources not cleaned:', uncleaned);
      return false;
    }

    return true;
  }
}
```

**Tests**: Mount and unmount component 10 times, verify no leaks

---

**Task 11.2.3-11.2.5**: Additional production optimization
- Implement lazy loading for non-critical components
- Add service worker caching for webgl-fluid-enhanced library
- Optimize render performance (reduce unnecessary re-renders)

---

## 📋 PHASE 12: FINAL VALIDATION & HANDOFF (10 tasks)

### 12.1 Acceptance Testing (5 tasks)

**Task 12.1.1**: Run Complete Test Suite
**Requirements**: All tests passing

**Execute**:
- `npm test` (if Jest configured)
- `npm run build` (production build succeeds)
- `npm run lint` (no errors)
- `npm run typecheck` (no type errors)

**Acceptance**: All green, zero failures

---

**Task 12.1.2**: Execute 30-Minute Stability Test
**Requirements**: Per Master Plan Week 1 success criteria

**Procedure**:
1. Start liquid light in browser
2. Run for 30 minutes
3. Monitor: FPS, memory, console errors
4. Test: User interactions throughout
5. Record: Any issues or degradation

**Acceptance**:
- No crashes
- FPS stable (±10% variation)
- Memory stable (<100MB)
- Zero errors logged

---

**Task 12.1.3**: Verify Week 1 Success Criteria
**File**: Checklist validation
**Requirements**: All Week 1 goals met

**Week 1 Success Criteria**:
- ✅ Clean codebase (no test overrides)
- ✅ webgl-fluid-enhanced baseline working
- ✅ Device tiering active
- ✅ Audio-reactive visuals
- ✅ User controls functional
- ✅ CSS fallback tested
- ✅ 60fps desktop, 30fps+ mobile
- ✅ No crashes during 30-minute test

**Acceptance**: All checkboxes checked

---

**Task 12.1.4-12.1.5**: Final validation
- Cross-browser verification (test on all major browsers)
- Mobile device validation (test on iOS and Android)

---

### 12.2 Documentation Handoff (5 tasks)

**Task 12.2.1**: Create Week 2 Kickoff Checklist
**File**: `WEEK-2-KICKOFF.md` (new)
**Requirements**: Ready-to-go tasks for Week 2

**Content**:
- Prerequisites complete (Week 1 delivered)
- Week 2 Day 1 tasks (listed and prioritized)
- Integration points identified
- Known issues to address
- Success criteria for Week 2

---

**Task 12.2.2**: Update WEEK-1-PROGRESS.md to Complete
**File**: `WEEK-1-PROGRESS.md` (existing)
**Requirements**: Mark all tasks complete, add final summary

**Add**:
- Final completion percentage (target: 100%)
- All deliverables checked off
- Performance metrics achieved
- Issues encountered and resolved
- Handoff notes for Week 2

---

**Task 12.2.3**: Create Implementation Lessons Learned
**File**: `docs/reports/WEEK-1-LESSONS-LEARNED.md` (new)
**Requirements**: Document what worked and what didn't

**Content**:
- Successes: What went well
- Challenges: What was difficult
- Surprises: Unexpected discoveries
- Optimizations: Performance improvements found
- Recommendations: For future weeks

---

**Task 12.2.4-12.2.5**: Final documentation
- Update main README with Week 1 completion status
- Create Week 2-4 preview document (what's coming next)

---

## 📊 OVERALL SPRINT METRICS

### Total Deliverables: 100+ Tasks Across 12 Phases

**Phase Breakdown**:
1. Capability & Policy: 15 tasks
2. Orchestrator Integration: 25 tasks
3. Audio & Motion: 15 tasks
4. Palette & Tone: 15 tasks
5. Accessibility & Safety: 10 tasks
6. Performance Governance: 15 tasks
7. Developer Tooling: 10 tasks
8. Testing Infrastructure: 20 tasks
9. Cultural Integration: 10 tasks
10. Documentation: 15 tasks
11. Production Hardening: 10 tasks
12. Final Validation: 10 tasks

**Total**: 150+ specific tasks

**Estimated Time**:
- Sprint Mode: 80 hours (2 weeks full-time)
- Normal Mode: 120 hours (3 weeks)
- Your Efficiency: Probably 60-80 hours given your systematic approach

---

## 🎯 SUCCESS CRITERIA

### Week 2 Complete When:
- ✅ VisualOrchestrator integrated in app
- ✅ All layers coordinated through orchestrator
- ✅ Unified color and audio services working
- ✅ Global controls affect all layers
- ✅ Performance monitoring active
- ✅ 60fps desktop, 45fps mobile maintained

### Week 3 Complete When:
- ✅ Song palettes with rich metadata
- ✅ Cultural UI with stories and context
- ✅ Accessibility fully implemented
- ✅ Community validation session held
- ✅ Ambassador field guide ready

### Week 4 Complete When:
- ✅ All tests passing
- ✅ 3-hour stability test passed
- ✅ Cross-device testing complete
- ✅ All documentation comprehensive
- ✅ Production-ready system delivered

---

## 📋 AUTONOMOUS EXECUTION CHECKLIST

As you work through this sprint:

- [ ] Create all files in specified locations
- [ ] Implement all required functions with exact signatures
- [ ] Test each feature as you build it
- [ ] Document as you go (code comments + README files)
- [ ] Commit frequently (after each completed phase)
- [ ] Push to GitHub regularly
- [ ] Update WEEK-1-PROGRESS.md (or create WEEK-2-PROGRESS.md, etc.)
- [ ] Reference Master Plan in all commit messages
- [ ] Note any deviations from plan (with rationale)
- [ ] Flag any blockers or questions for review

---

## 🚀 FINAL NOTES

**This is YOUR sprint, Codex**. You asked for a massive workload for 1-2 weeks of autonomous implementation. Here it is:

**150+ tasks** spanning:
- Complete orchestration architecture
- Full testing infrastructure
- Comprehensive documentation
- Performance optimization
- Cultural integration
- Production hardening

**Every task has**:
- Specific file path
- Detailed requirements
- Code examples
- Test scenarios
- Acceptance criteria

**You have everything you need**:
- Master Plan reference
- Your previous architecture work
- Claude Code's services (read-only reference)
- Cursor's integration work (read-only reference)
- Complete autonomy to implement

---

## ✅ WHEN YOU'RE DONE

Create final report: `CODEX-SPRINT-COMPLETION-REPORT.md`

**Include**:
- Tasks completed (aim for 100+)
- Files created (should be 30-50 new files)
- Lines of code (should be 3,000-5,000+ lines)
- Tests written (should be 50+ test cases)
- Documentation pages (should be 10+ comprehensive guides)
- Performance metrics achieved
- Known issues remaining
- Recommendations for Weeks 5-6

---

**YOU WANTED A MASSIVE WORKLOAD - HERE IT IS! LET'S BUILD SOMETHING AMAZING! 🔥🚀**

---

*Reference: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md*
*Your Foundation: lib/visual/capability/VisualPolicy.ts + orchestrator skeleton*
*Timeline: 1-2 weeks intensive sprint*
*Expected Output: Production-ready Weeks 2-4 implementation*
