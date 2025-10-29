# CODEX MEGA SPRINT: Weeks 2-4 Integration & Optimization

**Created**: 2025-10-29
**Target Completion**: 2025-11-19 (3 weeks)
**Scope**: 95 tasks across 9 workstreams
**Coordination**: Claude Code (completed thin-film, audio, docs), Cursor (integration)

---

## 🎯 EXECUTIVE SUMMARY

Claude Code has **completed all requested deliverables**:
- ✅ Thin-film shader with palette integration (lib/post/ThinFilmPass.tsx)
- ✅ Beat detector with BPM estimation (lib/audio/beatDetector.ts)
- ✅ Audio enhancements: curves, smoothing, beat gating (lib/audio/mapping.ts)
- ✅ Performance HUD + thin-film debug controls
- ✅ Comprehensive documentation (7,500+ words)

**Your Mission**: Wire everything into the orchestrator, optimize integration, expand features, and harden for production.

---

## 📋 WORKSTREAM OVERVIEW

| Workstream | Tasks | Priority | Dependencies |
|-----------|-------|----------|--------------|
| **A. Orchestrator Integration** | 15 | 🔥 CRITICAL | None |
| **B. Thin-Film Overlay Mounting** | 12 | 🔥 CRITICAL | Workstream A |
| **C. Audio Pipeline Enhancement** | 10 | 🔥 HIGH | None |
| **D. Palette System Expansion** | 8 | 📝 MEDIUM | None |
| **E. Performance Optimization** | 12 | ⚡ HIGH | Workstream B |
| **F. Battery & Power Management** | 8 | 📝 MEDIUM | None |
| **G. QA & Testing Infrastructure** | 10 | 🧪 MEDIUM | All |
| **H. Dev Tools Enhancement** | 10 | 📝 MEDIUM | Workstream A |
| **I. Documentation & Contracts** | 10 | 📝 MEDIUM | All |

**Total**: 95 tasks

---

## 🔥 WORKSTREAM A: ORCHESTRATOR INTEGRATION (15 TASKS)

### Overview
Wire Claude Code's completed services into your orchestrator architecture. All services are production-ready and documented.

### Tasks

#### A1. Import Claude Code Services ✅
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Add imports for all Claude Code services
```typescript
import { PaletteDirector } from '@/lib/palette';
import {
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
  BeatDetector,
  createBeatDetector
} from '@/lib/audio';
import { AuthenticThinFilmEffect } from '@/lib/post/ThinFilmPass';
import PerformanceHUD from '@/components/liquid-light/dev/PerformanceHUD';
```
**Acceptance**: No import errors, TypeScript compiles cleanly

---

#### A2. Create Enhanced Audio Processor Instance
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Initialize enhanced audio processor in orchestrator state
```typescript
const audioProcessorRef = useRef(
  createEnhancedAudioProcessor(0.3, {
    burstMultiplier: 1.8,
    decayTime: 200,
    minInterval: 100,
  })
);
```
**Acceptance**: Processor persists across renders, smoothing works

---

#### A3. Create Beat Detector Instance
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Initialize beat detector based on current mode
```typescript
const beatDetectorRef = useRef<BeatDetector>();

useEffect(() => {
  if (policy.mode === 'dance-floor') {
    beatDetectorRef.current = createDanceFloorDetector();
  } else if (policy.mode === 'ambient') {
    beatDetectorRef.current = createAmbientDetector();
  } else {
    beatDetectorRef.current = createBeatDetector();
  }
}, [policy.mode]);
```
**Acceptance**: Detector switches correctly, BPM estimates update

---

#### A4. Wire PaletteDirector to Orchestrator State
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Sync palette changes with PaletteDirector
```typescript
useEffect(() => {
  PaletteDirector.setPalette(policy.paletteId);
}, [policy.paletteId]);
```
**Acceptance**: Palette changes propagate to all layers immediately

---

#### A5. Calculate Enhanced Physics Parameters
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Use enhanced calculator in render loop
```typescript
const enrichedAudioData = useMemo(() => {
  if (!audioData || !beatDetectorRef.current) return audioData;

  const beatResult = beatDetectorRef.current.detect(audioData.bass * 100);

  return {
    ...audioData,
    beatDetected: beatResult.isBeat,
    bpmEstimate: beatResult.bpmEstimate,
    beatConfidence: beatResult.confidence,
  };
}, [audioData]);

const physics = useMemo(() => {
  return calculateEnhancedPhysicsParams(
    enrichedAudioData,
    audioProcessorRef.current
  );
}, [enrichedAudioData]);
```
**Acceptance**: Smooth physics params, beat bursts visible, no jitter

---

#### A6. Pass Enhanced Audio to WebGL Layer
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Update WebGL layer props with enhanced params
```typescript
<LiquidLightBackground
  intensity={policy.intensity}
  motionEnabled={policy.motionEnabled}
  tier={currentTier}
  audioParams={physics}
  paletteId={policy.paletteId}
/>
```
**Acceptance**: WebGL reacts to smoothed audio, beat bursts on bass

---

#### A7. Mount Thin-Film Layer Conditionally
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Add thin-film layer in layer stack (z-index -30)
```typescript
{currentTier !== 'low' && policy.thinFilmEnabled && (
  <AuthenticThinFilmEffect
    audioParams={physics}
    deviceTier={currentTier}
    paletteId={policy.paletteId}
    enabled={!isHidden}
  />
)}
```
**Acceptance**: Thin-film renders on medium/high, disabled on low

---

#### A8. Add Performance HUD in Debug Mode
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Mount HUD when ?debug=true
```typescript
{debugMode && (
  <PerformanceHUD
    fps={currentFPS}
    tier={currentTier}
    audioData={enrichedAudioData}
    dpr={getClampedDPR()}
    enabled={debugMode}
  />
)}
```
**Acceptance**: HUD visible with ?debug=true, shows real-time metrics

---

#### A9. Add Policy Property for Thin-Film Toggle
**File**: `lib/visual/VisualPolicy.ts`
**Action**: Add `thinFilmEnabled: boolean` to VisualPolicy interface
```typescript
export interface VisualPolicy {
  // ... existing
  thinFilmEnabled: boolean;
  thinFilmIntensity: number; // 0-1
}
```
**Acceptance**: TypeScript compiles, localStorage persists setting

---

#### A10. Create Policy Setter for Thin-Film
**File**: `lib/visual/VisualOrchestrator.tsx`
**Action**: Expose setter function
```typescript
const setThinFilmEnabled = useCallback((enabled: boolean) => {
  updatePolicy({ thinFilmEnabled: enabled });
}, [updatePolicy]);
```
**Acceptance**: User can toggle thin-film via controls

---

#### A11. Wire Beat Detection to Policy Decisions
**File**: `lib/visual/orchestrator/layerCoordinator.ts`
**Action**: Use beat info for adaptive effects
```typescript
if (beatResult.isBeat && beatResult.confidence > 0.7) {
  // Boost intensity temporarily
  temporaryIntensityBoost = 1.2;
  setTimeout(() => { temporaryIntensityBoost = 1.0; }, 200);
}
```
**Acceptance**: Visual bursts on strong beats

---

#### A12. Add Smoothing Alpha to Policy
**File**: `lib/visual/VisualPolicy.ts`
**Action**: Allow user to adjust smoothing
```typescript
export interface VisualPolicy {
  // ... existing
  audioSmoothingAlpha: number; // 0.1-0.9
}
```
**Acceptance**: Smoother alpha adjustable, effects visible

---

#### A13. Integrate TierTransitionManager with Beat Detection
**File**: `lib/visual/performance/PerformanceMonitor.ts`
**Action**: Prevent tier changes during beats
```typescript
if (beatResult.isBeat) {
  // Delay tier transitions during beats (prevent visual interruption)
  return null; // Don't transition now
}
```
**Acceptance**: Tier changes don't interrupt beat moments

---

#### A14. Add Memory Monitoring
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Action**: Track memory usage, force cleanup if growing
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      if (mem.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
        console.warn('[Orchestrator] High memory, forcing cleanup');
        // Force cleanup or tier down
      }
    }
  }, 10000); // Every 10s

  return () => clearInterval(interval);
}, []);
```
**Acceptance**: No memory growth after 5 remounts

---

#### A15. Add Orchestrator README Section for Claude Code Services
**File**: `lib/visual/orchestrator/README.md`
**Action**: Document integration with Claude Code's services
```markdown
## Integration with Claude Code Services

### Audio Pipeline
Uses `createEnhancedAudioProcessor` for smoothing and beat gating.

### Beat Detection
Uses `BeatDetector` for adaptive beat tracking with BPM estimation.

### Palette Management
Uses `PaletteDirector` for color management across all layers.

### Thin-Film Overlay
Uses `AuthenticThinFilmEffect` for R3F thin-film rendering.
```
**Acceptance**: Developers understand integration points

---

## 🔥 WORKSTREAM B: THIN-FILM OVERLAY MOUNTING (12 TASKS)

### Overview
Mount and optimize the thin-film effect that Claude Code created. Already complete at `lib/post/ThinFilmPass.tsx`.

### Tasks

#### B1. Verify Thin-Film Import
**File**: Test file
**Action**: Create test to verify thin-film imports correctly
```typescript
import { AuthenticThinFilmEffect, ThinFilmPass } from '@/lib/post/ThinFilmPass';
// Should not error
```
**Acceptance**: Imports work, no build errors

---

#### B2. Create Thin-Film Layer Wrapper
**File**: `lib/visual/layers/ThinFilmLayer.tsx`
**Action**: Create wrapper component for orchestrator mounting
```typescript
export function ThinFilmLayer({
  audioParams,
  deviceTier,
  paletteId,
  enabled,
}: ThinFilmLayerProps) {
  return (
    <div className="thin-film-layer" style={{ zIndex: -30 }}>
      <AuthenticThinFilmEffect
        audioParams={audioParams}
        deviceTier={deviceTier}
        paletteId={paletteId}
        enabled={enabled}
      />
    </div>
  );
}
```
**Acceptance**: Layer wrapper renders, z-index correct

---

#### B3. Add Thin-Film Performance Gating
**File**: `lib/visual/orchestrator/layerCoordinator.ts`
**Action**: Auto-disable thin-film if FPS < 45
```typescript
if (currentFPS < 45 && thinFilmEnabled) {
  console.warn('[LayerCoordinator] Disabling thin-film due to low FPS');
  updatePolicy({ thinFilmEnabled: false });
}
```
**Acceptance**: Thin-film auto-disables below 45 FPS

---

#### B4. Add Thin-Film Quality Levels
**File**: `lib/visual/VisualPolicy.ts`
**Action**: Add quality setting
```typescript
export type ThinFilmQuality = 'low' | 'medium' | 'high';

export interface VisualPolicy {
  // ... existing
  thinFilmQuality: ThinFilmQuality;
}
```
**Acceptance**: Different quality levels map to shader params

---

#### B5. Wire Thin-Film Quality to Shader
**File**: `lib/post/ThinFilmPass.tsx` (or wrapper)
**Action**: Map quality to DPR and multisampling
```typescript
const dprSettings = {
  low: [1, 1],
  medium: [1, 1.5],
  high: [1, 2],
};

const multisamplingSettings = {
  low: 0,
  medium: 0,
  high: 4,
};
```
**Acceptance**: Quality changes affect performance/visual

---

#### B6. Add Thin-Film Blend Mode Control
**File**: `lib/visual/VisualPolicy.ts`
**Action**: Allow blend mode selection
```typescript
export type BlendMode = 'screen' | 'overlay' | 'normal';

export interface VisualPolicy {
  // ... existing
  thinFilmBlendMode: BlendMode;
}
```
**Acceptance**: Blend mode changes visual appearance

---

#### B7. Create Thin-Film Preset System
**File**: `lib/post/thinFilmPresets.ts`
**Action**: Create named presets
```typescript
export const THIN_FILM_PRESETS = {
  oil: {
    thickness: 200,
    ior: 1.5,
    blendMode: 'screen',
    intensity: 0.6,
  },
  soap: {
    thickness: 150,
    ior: 1.33,
    blendMode: 'overlay',
    intensity: 0.7,
  },
  intense: {
    thickness: 300,
    ior: 1.8,
    blendMode: 'screen',
    intensity: 0.9,
  },
};
```
**Acceptance**: Presets change visual character distinctly

---

#### B8. Add Thin-Film A/B Testing
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Action**: Track thin-film usage for analytics
```typescript
useEffect(() => {
  if (policy.thinFilmEnabled) {
    // Track thin-film session
    analytics.track('thin_film_enabled', {
      deviceTier: currentTier,
      quality: policy.thinFilmQuality,
    });
  }
}, [policy.thinFilmEnabled]);
```
**Acceptance**: Usage tracked for A/B test analysis

---

#### B9. Optimize Thin-Film Shader Uniforms
**File**: Check `lib/post/ThinFilmPass.tsx`
**Action**: Verify uniform packing is efficient
- Confirm `uPaletteRGB[12]` is flat array (not array of vec3)
- Verify no redundant uniform updates
**Acceptance**: Uniforms update only when changed

---

#### B10. Add Thin-Film Error Boundary
**File**: `lib/visual/layers/ThinFilmLayer.tsx`
**Action**: Wrap in error boundary
```typescript
<ErrorBoundary
  fallback={<div>Thin-film effect unavailable</div>}
  onError={(error) => {
    console.error('[ThinFilm] Error:', error);
    updatePolicy({ thinFilmEnabled: false });
  }}
>
  <AuthenticThinFilmEffect {...props} />
</ErrorBoundary>
```
**Acceptance**: Errors don't crash app, fallback to disabled

---

#### B11. Test Thin-Film on All Tiers
**File**: Test script
**Action**: Create test that verifies behavior on all tiers
```typescript
test('thin-film respects tier gating', () => {
  // low tier: should not render
  // medium tier: should render with reduced quality
  // high tier: should render with full quality
});
```
**Acceptance**: Test passes on all tiers

---

#### B12. Document Thin-Film Integration
**File**: `lib/post/ThinFilmPass.md`
**Action**: Add orchestrator integration section (Claude Code already created base doc)
```markdown
## Orchestrator Integration

The thin-film effect integrates with VisualOrchestrator via:

1. **Layer Mounting**: Rendered at z-index -30 (above WebGL, below UI)
2. **Tier Gating**: Auto-disabled on 'low' tier
3. **Performance Gating**: Auto-disabled if FPS < 45
4. **Palette Sync**: Uses PaletteDirector.getCurrentColorsRGB()
5. **Audio Sync**: Uses enhanced physics params from orchestrator

### Example Integration

\`\`\`typescript
<VisualOrchestrator>
  {/* Thin-film layer auto-mounted */}
</VisualOrchestrator>
\`\`\`
```
**Acceptance**: Documentation complete and accurate

---

## 🔥 WORKSTREAM C: AUDIO PIPELINE ENHANCEMENT (10 TASKS)

### Overview
Wire Claude Code's enhanced audio system into the orchestrator. Beat detector and enhanced processor are complete.

### Tasks

#### C1. Replace Basic Audio Mapping with Enhanced
**File**: `components/LiquidLightBackground.tsx`
**Action**: Use enhanced processor instead of basic
```typescript
const audioProcessorRef = useRef(
  createEnhancedAudioProcessor(0.3)
);

const physics = calculateEnhancedPhysicsParams(
  audioData,
  audioProcessorRef.current
);
```
**Acceptance**: Smooth audio response, no jitter

---

#### C2. Integrate Beat Detector into Background
**File**: `components/LiquidLightBackground.tsx`
**Action**: Add beat detection to audio pipeline
```typescript
const beatDetectorRef = useRef(new BeatDetector());

const beatResult = beatDetectorRef.current.detect(
  audioData?.bass * 100 || 0
);

// Use beatResult.isBeat for visual bursts
```
**Acceptance**: Beat bursts visible on bass hits

---

#### C3. Add BPM Display to HUD
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Show BPM estimate in HUD (Claude Code created HUD, enhance it)
```typescript
{beatResult && (
  <div>BPM: {beatResult.bpmEstimate.toFixed(0)}</div>
)}
```
**Acceptance**: BPM updates in real-time

---

#### C4. Create Audio Mode Switcher
**File**: `lib/audio/audioModeManager.ts`
**Action**: Manager to switch between detector presets
```typescript
export class AudioModeManager {
  private detectors = {
    'dance-floor': createDanceFloorDetector(),
    'ambient': createAmbientDetector(),
    'default': createBeatDetector(),
  };

  getDetector(mode: string) {
    return this.detectors[mode] || this.detectors.default;
  }
}
```
**Acceptance**: Detector changes based on mode

---

#### C5. Add Audio Smoothing Controls
**File**: `components/liquid-light/controls/LiquidLightControls.tsx`
**Action**: Add slider for smoothing alpha
```typescript
<label>
  Audio Smoothing: {smoothingAlpha.toFixed(2)}
  <input
    type="range"
    min="0.1"
    max="0.9"
    step="0.1"
    value={smoothingAlpha}
    onChange={(e) => setSmoothingAlpha(parseFloat(e.target.value))}
  />
</label>
```
**Acceptance**: Smoothing adjustable, effects visible

---

#### C6. Add Beat Burst Multiplier Control
**File**: `components/liquid-light/controls/LiquidLightControls.tsx`
**Action**: Add slider for burst intensity
```typescript
<label>
  Beat Burst: {burstMultiplier.toFixed(1)}x
  <input
    type="range"
    min="1.0"
    max="2.5"
    step="0.1"
    value={burstMultiplier}
    onChange={(e) => setBurstMultiplier(parseFloat(e.target.value))}
  />
</label>
```
**Acceptance**: Burst intensity adjustable

---

#### C7. Optimize Audio Processor Performance
**File**: `lib/audio/mapping.ts`
**Action**: Profile and optimize if needed
- Check if EMA calculations can be cached
- Verify no redundant curve calculations
**Acceptance**: Audio processing <0.3ms/frame

---

#### C8. Add Audio Freeze Mode
**File**: `lib/audio/mapping.ts`
**Action**: Add freeze feature for debugging
```typescript
export class EMASmootherBank {
  private frozen = false;

  freeze() { this.frozen = true; }
  unfreeze() { this.frozen = false; }

  smooth(key: string, newValue: number): number {
    if (this.frozen) {
      return this.smoothedValues.get(key) ?? newValue;
    }
    // ... normal logic
  }
}
```
**Acceptance**: Audio can freeze for debugging

---

#### C9. Create Audio Debug Panel
**File**: `components/liquid-light/dev/AudioDebugPanel.tsx`
**Action**: Create panel showing all audio values
```typescript
export function AudioDebugPanel({ audioData, physics, beatResult }) {
  return (
    <div className="audio-debug-panel">
      <h3>Audio Analysis</h3>
      <div>Bass: {audioData.bass.toFixed(2)}</div>
      <div>Mids: {audioData.mids.toFixed(2)}</div>
      <div>Treble: {audioData.treble.toFixed(2)}</div>
      <h3>Physics Params</h3>
      <div>Splat Force: {physics.splatForce.toFixed(1)}</div>
      <div>Thermal Rate: {physics.thermalRate.toFixed(1)}</div>
      <h3>Beat Detection</h3>
      <div>Beat: {beatResult.isBeat ? 'YES' : 'NO'}</div>
      <div>Confidence: {beatResult.confidence.toFixed(2)}</div>
      <div>BPM: {beatResult.bpmEstimate.toFixed(0)}</div>
    </div>
  );
}
```
**Acceptance**: Debug panel shows all audio metrics

---

#### C10. Add Audio Testing Utilities
**File**: `lib/audio/__tests__/audioTestHelpers.ts`
**Action**: Create synthetic audio generators for testing
```typescript
export function generateSyntheticBeat(frequency: number) {
  // Generate sine wave at frequency
  // Return { bass, mids, treble, volume }
}

export function generateSilence() {
  return { bass: 0, mids: 0, treble: 0, volume: 0 };
}
```
**Acceptance**: Tests can use synthetic audio

---

## 📝 WORKSTREAM D: PALETTE SYSTEM EXPANSION (8 TASKS)

### Overview
Expand Claude Code's PaletteDirector with new palettes and utilities. Service is complete, add features.

### Tasks

#### D1. Add New Song-Specific Palettes
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Add 3 new palettes requested by Codex
```typescript
'st-stephen': {
  id: 'st-stephen',
  name: 'St. Stephen',
  colors: [
    [0.5, 0.2, 0.8],  // Deep purple
    [0.8, 0.3, 0.5],  // Magenta
    [0.3, 0.6, 0.9],  // Sky blue
    [0.9, 0.7, 0.3],  // Gold
  ],
  wavelengths: [420, 640, 480, 570],
  culturalContext: 'Inspired by the mystical, layered jams of "St. Stephen"',
  energy: 'high',
  viscosity: 0.35,
},
'help-on-the-way': {
  id: 'help-on-the-way',
  name: 'Help on the Way',
  colors: [
    [0.7, 0.9, 0.4],  // Spring green
    [0.4, 0.8, 0.9],  // Aqua
    [0.9, 0.8, 0.5],  // Cream
    [0.8, 0.5, 0.7],  // Lavender
  ],
  wavelengths: [560, 490, 580, 470],
  culturalContext: 'Bright, hopeful palette for this uplifting song',
  energy: 'medium',
  viscosity: 0.4,
},
'eyes-of-the-world': {
  id: 'eyes-of-the-world',
  name: 'Eyes of the World',
  colors: [
    [0.3, 0.7, 0.9],  // Ocean blue
    [0.5, 0.9, 0.6],  // Sea green
    [0.9, 0.9, 0.7],  // Sunlight
    [0.7, 0.5, 0.8],  // Twilight purple
  ],
  wavelengths: [480, 530, 580, 450],
  culturalContext: 'Inspired by the cosmic, flowing jams of "Eyes of the World"',
  energy: 'medium',
  viscosity: 0.45,
},
```
**Acceptance**: 3 new palettes available, culturally authentic

---

#### D2. Add Palette Utility Functions
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Add helper functions
```typescript
// For shader uniform packing
getPaletteUniformRGB4(): Float32Array {
  const colors = this.getCurrentColorsRGB();
  const flat = new Float32Array(12);
  for (let i = 0; i < 4; i++) {
    flat[i * 3] = colors[i][0];
    flat[i * 3 + 1] = colors[i][1];
    flat[i * 3 + 2] = colors[i][2];
  }
  return flat;
}

// For CSS gradients
getCSSGradientStops(): string {
  const colors = this.getCurrentColorsRGB();
  return colors.map((c, i) => {
    const r = Math.round(c[0] * 255);
    const g = Math.round(c[1] * 255);
    const b = Math.round(c[2] * 255);
    const stop = (i / (colors.length - 1)) * 100;
    return `rgb(${r},${g},${b}) ${stop}%`;
  }).join(', ');
}
```
**Acceptance**: Helpers simplify shader/CSS integration

---

#### D3. Add Palette Interpolation
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Create blend between two palettes
```typescript
blendPalettes(
  paletteId1: string,
  paletteId2: string,
  t: number // 0-1
): number[][] {
  const p1 = this.getPalette(paletteId1);
  const p2 = this.getPalette(paletteId2);

  return p1.colors.map((c1, i) => {
    const c2 = p2.colors[i];
    return [
      c1[0] * (1 - t) + c2[0] * t,
      c1[1] * (1 - t) + c2[1] * t,
      c1[2] * (1 - t) + c2[2] * t,
    ];
  });
}
```
**Acceptance**: Smooth transitions between palettes

---

#### D4. Add Palette Animation System
**File**: `lib/palette/PaletteAnimator.ts`
**Action**: Create animator for palette transitions
```typescript
export class PaletteAnimator {
  private targetPalette: string | null = null;
  private transitionProgress = 0;
  private transitionDuration = 2000; // ms

  transitionTo(paletteId: string, duration?: number) {
    this.targetPalette = paletteId;
    this.transitionProgress = 0;
    if (duration) this.transitionDuration = duration;
  }

  update(deltaTime: number): boolean {
    if (!this.targetPalette) return false;

    this.transitionProgress += deltaTime / this.transitionDuration;

    if (this.transitionProgress >= 1.0) {
      PaletteDirector.setPalette(this.targetPalette);
      this.targetPalette = null;
      return false;
    }

    return true; // Still transitioning
  }

  getCurrentColors(): number[][] {
    if (!this.targetPalette) {
      return PaletteDirector.getCurrentColorsRGB();
    }

    return PaletteDirector.blendPalettes(
      PaletteDirector.getCurrentPaletteId(),
      this.targetPalette,
      this.transitionProgress
    );
  }
}
```
**Acceptance**: Smooth palette transitions over time

---

#### D5. Add Palette Randomizer
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Add random palette selection
```typescript
getRandomPalette(exclude?: string[]): Palette {
  const available = this.getAvailablePalettes().filter(
    id => !exclude?.includes(id)
  );
  const randomId = available[Math.floor(Math.random() * available.length)];
  return this.getPalette(randomId);
}
```
**Acceptance**: Random palettes for variety

---

#### D6. Add Palette Energy Filtering
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Filter palettes by energy level
```typescript
getPalettesByEnergy(energy: 'low' | 'medium' | 'high'): Palette[] {
  return this.getAllPalettes().filter(p => p.energy === energy);
}
```
**Acceptance**: Can filter high-energy palettes

---

#### D7. Add Palette Export for External Tools
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Export palette as JSON
```typescript
exportPaletteAsJSON(paletteId: string): string {
  const palette = this.getPalette(paletteId);
  return JSON.stringify(palette, null, 2);
}

importPaletteFromJSON(json: string): void {
  const palette = JSON.parse(json);
  // Validate and add to palette collection
}
```
**Acceptance**: Palettes can be exported/imported

---

#### D8. Update Palette Documentation
**File**: `lib/palette/README.md`
**Action**: Document new palettes and utilities (Claude Code created base doc)
```markdown
## New Palettes (Week 2)

### St. Stephen (`st-stephen`)
- Deep purple, magenta, sky blue, gold
- High energy, mystical character

### Help on the Way (`help-on-the-way`)
- Spring green, aqua, cream, lavender
- Medium energy, uplifting

### Eyes of the World (`eyes-of-the-world`)
- Ocean blue, sea green, sunlight, twilight purple
- Medium energy, cosmic flow

## New Utilities

- `getPaletteUniformRGB4()`: Shader-ready Float32Array
- `getCSSGradientStops()`: CSS gradient string
- `blendPalettes()`: Interpolate between palettes
- `getRandomPalette()`: Random selection
```
**Acceptance**: Documentation updated

---

## ⚡ WORKSTREAM E: PERFORMANCE OPTIMIZATION (12 TASKS)

### Overview
Optimize thin-film shader and overall rendering pipeline. Claude Code created optimized shader, further tune.

### Tasks

#### E1. Profile Thin-Film GPU Time
**File**: Test harness
**Action**: Measure GPU time on different devices
```typescript
// Use WebGL queries or performance.now()
const start = performance.now();
renderer.render(scene, camera);
const end = performance.now();
console.log('GPU time:', end - start);
```
**Acceptance**: Baseline GPU times documented

---

#### E2. Optimize Shader Uniform Updates
**File**: `lib/post/ThinFilmPass.tsx`
**Action**: Only update changed uniforms
```typescript
// Cache previous values
if (prevPaletteRGB !== currentPaletteRGB) {
  uniforms.get('uPaletteRGB')!.value = currentPaletteRGB;
  prevPaletteRGB = currentPaletteRGB;
}
```
**Acceptance**: Fewer uniform updates per frame

---

#### E3. Precompute Shader Invariants
**File**: `lib/post/ThinFilmPass.tsx` (shader)
**Action**: Move constants outside loops
```glsl
// Precompute outside loop
const float PI2 = 6.28318;
const float invPI2 = 1.0 / PI2;

// Use in calculations
float phaseNorm = fract(uColorPhase * invPI2);
```
**Acceptance**: Fewer shader calculations

---

#### E4. Add Frame Budget Helper
**File**: `lib/visual/performance/frameBudget.ts`
**Action**: Create helper to limit work per frame
```typescript
export function withFrameBudget<T>(
  fn: () => T,
  budgetMs: number
): T | null {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;

  if (elapsed > budgetMs) {
    console.warn(`Frame budget exceeded: ${elapsed.toFixed(2)}ms > ${budgetMs}ms`);
  }

  return result;
}
```
**Acceptance**: Can gate expensive operations

---

#### E5. Optimize WebGL Layer Rendering
**File**: `components/LiquidLightBackground.tsx`
**Action**: Reduce render calls when possible
```typescript
// Skip render if audio is silent and no motion
if (audioData.volume < 0.01 && !motionEnabled) {
  return; // Don't render this frame
}
```
**Acceptance**: Fewer renders when idle

---

#### E6. Add Memory Disposal on Unmount
**File**: `lib/post/ThinFilmPass.tsx`
**Action**: Ensure cleanup
```typescript
useEffect(() => {
  return () => {
    // Dispose geometries, materials, textures
    if (effectRef.current) {
      effectRef.current.dispose();
    }
  };
}, []);
```
**Acceptance**: No memory leaks after unmount

---

#### E7. Optimize Palette RGB Flattening
**File**: `lib/post/ThinFilmPass.tsx`
**Action**: Reuse Float32Array instead of allocating
```typescript
// Reuse array
const paletteArrayRef = useRef(new Float32Array(12));

useFrame(() => {
  const colors = PaletteDirector.getCurrentColorsRGB();
  for (let i = 0; i < 4; i++) {
    paletteArrayRef.current[i * 3] = colors[i][0];
    paletteArrayRef.current[i * 3 + 1] = colors[i][1];
    paletteArrayRef.current[i * 3 + 2] = colors[i][2];
  }

  uniforms.get('uPaletteRGB')!.value = paletteArrayRef.current;
});
```
**Acceptance**: No allocations per frame

---

#### E8. Add Performance Profiler
**File**: `lib/visual/performance/Profiler.ts`
**Action**: Create profiler for key operations
```typescript
export class Profiler {
  private times = new Map<string, number[]>();

  start(label: string) {
    this.times.set(label, [performance.now()]);
  }

  end(label: string) {
    const times = this.times.get(label);
    if (times) {
      times.push(performance.now());
      const duration = times[1] - times[0];
      console.log(`[Profiler] ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  getStats(label: string) {
    // Return average, min, max
  }
}
```
**Acceptance**: Can profile render pipeline

---

#### E9. Optimize Audio Processing
**File**: `lib/audio/mapping.ts`
**Action**: Cache curve calculations
```typescript
// Memoize expensive curves
const curveCache = new Map<string, number>();

function cachedPowerCurve(value: number, exponent: number): number {
  const key = `${value.toFixed(3)}_${exponent}`;
  if (curveCache.has(key)) {
    return curveCache.get(key)!;
  }

  const result = Math.pow(value, exponent);
  curveCache.set(key, result);
  return result;
}
```
**Acceptance**: Audio processing faster

---

#### E10. Add Render Skip on Low Battery
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Action**: Skip frames when battery critical
```typescript
const batteryPolicy = await getBatterySaverPolicy();

if (batteryPolicy.forcedTier === 'low') {
  // Skip every other frame
  if (frameCount % 2 === 0) return;
}
```
**Acceptance**: Battery usage reduced

---

#### E11. Create Performance Regression Tests
**File**: `__tests__/performance/renderPerformance.test.ts`
**Action**: Automated performance tests
```typescript
test('thin-film renders within budget', async () => {
  const times = [];
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    await renderFrame();
    times.push(performance.now() - start);
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  expect(avg).toBeLessThan(16.67); // 60fps budget
});
```
**Acceptance**: Performance regressions caught

---

#### E12. Document Performance Budget
**File**: `docs/performance/PERFORMANCE_BUDGET.md`
**Action**: Create performance documentation
```markdown
# Performance Budget

## Target: 60 FPS (16.67ms/frame)

### Budget Breakdown
- JavaScript: <3ms
  - Audio processing: <0.3ms
  - Physics calc: <0.5ms
  - React render: <2ms
- GPU: <13ms
  - WebGL fluid: <8ms
  - Thin-film: <5ms

## Optimization Checklist
- [ ] Uniform updates minimized
- [ ] Shader constants precomputed
- [ ] Memory allocations avoided in render loop
- [ ] Tier degradation at 45 FPS
```
**Acceptance**: Team understands budget

---

## 📝 WORKSTREAM F: BATTERY & POWER MANAGEMENT (8 TASKS)

### Overview
Enhance battery saver with deeper heuristics and user controls. Codex created base policy.

### Tasks

#### F1. Add Battery Level Polling
**File**: `lib/visual/capability/batterySaverPolicy.ts`
**Action**: Poll battery level continuously
```typescript
export class BatteryMonitor {
  private level = 1.0;
  private charging = true;

  async start() {
    const battery = await (navigator as any).getBattery();

    const updateBattery = () => {
      this.level = battery.level;
      this.charging = battery.charging;
    };

    battery.addEventListener('levelchange', updateBattery);
    battery.addEventListener('chargingchange', updateBattery);
    updateBattery();
  }

  getBatteryState() {
    return { level: this.level, charging: this.charging };
  }
}
```
**Acceptance**: Real-time battery monitoring

---

#### F2. Add User Override for Battery Saver
**File**: `lib/visual/VisualPolicy.ts`
**Action**: Allow user to disable battery saver
```typescript
export interface VisualPolicy {
  // ... existing
  batterySaverOverride: boolean | null; // null = auto, true = force on, false = force off
}
```
**Acceptance**: User can override battery policies

---

#### F3. Add Battery Saver Notification
**File**: `lib/visual/orchestrator/VisualOrchestrator.tsx`
**Action**: Toast notification when battery saver activates
```typescript
if (batteryPolicy.forcedTier !== null && !notificationShown) {
  toast.info(`Battery Saver: Reduced visual quality (${batteryPolicy.reason})`);
  setNotificationShown(true);
}
```
**Acceptance**: User informed, not spammy

---

#### F4. Add Charging State Optimization
**File**: `lib/visual/capability/batterySaverPolicy.ts`
**Action**: More aggressive when on battery
```typescript
if (!charging && level < 0.3) {
  // More aggressive tier down
  return { enabled: true, forcedTier: 'low', reason: 'battery<30%_unplugged' };
}
```
**Acceptance**: Different policies for charging/unplugged

---

#### F5. Add Power Preference Setting
**File**: `lib/visual/VisualPolicy.ts`
**Action**: User preference for power mode
```typescript
export type PowerPreference = 'performance' | 'balanced' | 'battery-saver';

export interface VisualPolicy {
  // ... existing
  powerPreference: PowerPreference;
}
```
**Acceptance**: Power preference affects tier selection

---

#### F6. Create Battery Usage Estimator
**File**: `lib/visual/performance/batteryEstimator.ts`
**Action**: Estimate battery drain rate
```typescript
export class BatteryEstimator {
  private samples: { time: number; level: number }[] = [];

  addSample(level: number) {
    this.samples.push({ time: Date.now(), level });

    // Keep last 10 samples
    if (this.samples.length > 10) {
      this.samples.shift();
    }
  }

  estimateDrainRate(): number {
    // Calculate % per hour
    if (this.samples.length < 2) return 0;

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];

    const timeDiff = (last.time - first.time) / 1000 / 60 / 60; // hours
    const levelDiff = first.level - last.level;

    return levelDiff / timeDiff; // % per hour
  }
}
```
**Acceptance**: Drain rate estimated

---

#### F7. Add Low Power Mode Detection
**File**: `lib/visual/capability/batterySaverPolicy.ts`
**Action**: Detect iOS Low Power Mode
```typescript
// Heuristic: check if requestAnimationFrame throttled
let rafThrottled = false;

const start = performance.now();
requestAnimationFrame(() => {
  const elapsed = performance.now() - start;
  if (elapsed > 20) {
    rafThrottled = true; // Likely in low power mode
  }
});
```
**Acceptance**: Low power mode detected

---

#### F8. Document Battery Best Practices
**File**: `docs/performance/BATTERY_OPTIMIZATION.md`
**Action**: Create battery optimization guide
```markdown
# Battery Optimization Guide

## Policies

### Critical (<20%, unplugged)
- Force LOW tier
- Disable thin-film
- Reduce frame rate to 30fps

### Low (<50%, unplugged, mobile)
- Force MEDIUM tier
- Reduce thin-film quality
- Maintain 45fps

### User Override
Users can disable battery saver in settings.

## Testing
Test battery drain on real devices for 30 minutes.
Target: <5% drain per hour on mobile.
```
**Acceptance**: Documentation complete

---

## 🧪 WORKSTREAM G: QA & TESTING INFRASTRUCTURE (10 TASKS)

### Overview
Create testing infrastructure and golden images for visual regression. Codex requested QA artifacts.

### Tasks

#### G1. Create Headless Render Path
**File**: `scripts/qa/headlessRender.ts`
**Action**: Render to offscreen canvas
```typescript
import { createCanvas } from 'canvas';

export async function headlessRender(config: RenderConfig) {
  const canvas = createCanvas(1920, 1080);
  const gl = canvas.getContext('webgl2');

  // Initialize fluid simulation
  // Render deterministic frames
  // Return canvas image data
}
```
**Acceptance**: Renders without browser

---

#### G2. Create Deterministic Frame Sequence
**File**: `scripts/qa/deterministicRender.ts`
**Action**: Render with fixed seed
```typescript
export function renderDeterministicSequence(
  seed: number,
  frameCount: number
) {
  // Fix Math.random
  seedRandom(seed);

  // Render N frames with synthetic audio
  for (let i = 0; i < frameCount; i++) {
    const audioData = generateSyntheticAudio(i, seed);
    renderFrame(audioData);
  }
}
```
**Acceptance**: Same seed = same output

---

#### G3. Create Golden Image Generator
**File**: `scripts/qa/generateGoldens.ts`
**Action**: Generate reference images
```typescript
export async function generateGoldenImages() {
  const configs = [
    { palette: 'dark-star', tier: 'high', frame: 100 },
    { palette: 'fire-on-the-mountain', tier: 'medium', frame: 100 },
    // ... more configs
  ];

  for (const config of configs) {
    const image = await renderDeterministicFrame(config);
    await saveImage(image, `artifacts/thinfilm/golden_${config.palette}_${config.tier}_${config.frame}.png`);
  }
}
```
**Acceptance**: Golden images in artifacts/

---

#### G4. Create Visual Diff Tool
**File**: `scripts/qa/visualDiff.ts`
**Action**: Compare rendered images to goldens
```typescript
import pixelmatch from 'pixelmatch';

export function compareToGolden(
  rendered: Buffer,
  goldenPath: string
): number {
  const golden = fs.readFileSync(goldenPath);

  const diff = pixelmatch(
    rendered,
    golden,
    null,
    1920,
    1080,
    { threshold: 0.1 }
  );

  return diff / (1920 * 1080); // Percentage difference
}
```
**Acceptance**: Diffs calculated accurately

---

#### G5. Create Visual Regression Test Suite
**File**: `__tests__/visual/thinFilmRegression.test.ts`
**Action**: Automated visual tests
```typescript
test('thin-film matches golden image', async () => {
  const rendered = await renderDeterministicFrame({
    palette: 'dark-star',
    tier: 'high',
    frame: 100,
  });

  const diffPercent = compareToGolden(
    rendered,
    'artifacts/thinfilm/golden_dark-star_high_100.png'
  );

  expect(diffPercent).toBeLessThan(0.02); // <2% difference
});
```
**Acceptance**: Tests catch visual regressions

---

#### G6. Create Performance Test Suite
**File**: `__tests__/performance/fullPipeline.test.ts`
**Action**: End-to-end performance tests
```typescript
test('full pipeline maintains 60fps', async () => {
  const fps = await measureFPS(duration: 10000);
  expect(fps).toBeGreaterThan(55);
});

test('memory stable after 5 remounts', async () => {
  const memoryBefore = getMemoryUsage();

  for (let i = 0; i < 5; i++) {
    mount();
    await wait(1000);
    unmount();
  }

  const memoryAfter = getMemoryUsage();
  expect(memoryAfter - memoryBefore).toBeLessThan(5 * 1024 * 1024); // 5MB tolerance
});
```
**Acceptance**: Performance tests pass

---

#### G7. Create Integration Test for Orchestrator
**File**: `__tests__/integration/orchestrator.test.tsx`
**Action**: Test orchestrator wiring
```typescript
test('orchestrator mounts all layers correctly', () => {
  render(
    <VisualOrchestrator policy={mockPolicy}>
      <div>App content</div>
    </VisualOrchestrator>
  );

  expect(screen.getByTestId('css-fallback')).toBeInTheDocument();
  expect(screen.getByTestId('webgl-layer')).toBeInTheDocument();
  // Thin-film only on high tier
});
```
**Acceptance**: Integration tests pass

---

#### G8. Create Beat Detection Test
**File**: `lib/audio/__tests__/beatDetector.test.ts`
**Action**: Test beat detector accuracy
```typescript
test('detects beat at 120 BPM', () => {
  const detector = new BeatDetector();

  // Generate 120 BPM beat pattern
  const beats = generateBeats(120, 10); // 10 seconds

  let detectedBeats = 0;
  beats.forEach(energy => {
    const result = detector.detect(energy);
    if (result.isBeat) detectedBeats++;
  });

  // Should detect ~20 beats (120 BPM = 2 beats/sec * 10 sec)
  expect(detectedBeats).toBeGreaterThanOrEqual(18);
  expect(detectedBeats).toBeLessThanOrEqual(22);
});
```
**Acceptance**: Beat detection accurate

---

#### G9. Create Mapping Test Suite
**File**: `lib/audio/__tests__/mapping.test.ts`
**Action**: Test audio mapping functions
```typescript
test('enhanced mapping smooths values', () => {
  const processor = createEnhancedAudioProcessor(0.3);

  const audio1 = { bass: 1.0, mids: 0.5, treble: 0.3, volume: 0.8 };
  const physics1 = calculateEnhancedPhysicsParams(audio1, processor);

  const audio2 = { bass: 0.0, mids: 0.5, treble: 0.3, volume: 0.8 };
  const physics2 = calculateEnhancedPhysicsParams(audio2, processor);

  // Bass dropped to 0, but smoothing should prevent instant drop
  expect(physics2.splatForce).toBeGreaterThan(physics1.splatForce * 0.5);
});
```
**Acceptance**: Mapping tests pass

---

#### G10. Document QA Process
**File**: `docs/qa/QA_PROCESS.md`
**Action**: Create QA documentation
```markdown
# QA Process

## Visual Regression Testing

1. Generate golden images: `npm run qa:generate-goldens`
2. Run visual tests: `npm run test:visual`
3. Review diffs in `artifacts/diffs/`

## Performance Testing

1. Run performance suite: `npm run test:perf`
2. Check FPS benchmarks: `artifacts/perf/fps-report.json`
3. Check memory: `artifacts/perf/memory-report.json`

## Acceptance Criteria

- Visual diffs <2%
- FPS ≥55 on desktop high tier
- Memory growth <5MB after 5 remounts
```
**Acceptance**: QA process documented

---

## 📝 WORKSTREAM H: DEV TOOLS ENHANCEMENT (10 TASKS)

### Overview
Enhance Claude Code's Performance HUD and add developer utilities. HUD is complete, extend it.

### Tasks

#### H1. Add FPS Graph to HUD
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Mini FPS graph
```typescript
const [fpsHistory, setFpsHistory] = useState<number[]>([]);

useEffect(() => {
  setFpsHistory(prev => [...prev.slice(-30), fps]);
}, [fps]);

// Render mini graph with canvas or SVG
```
**Acceptance**: FPS trend visible

---

#### H2. Add Memory Graph to HUD
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Memory usage over time
```typescript
const [memoryHistory, setMemoryHistory] = useState<number[]>([]);

useEffect(() => {
  const interval = setInterval(() => {
    if ('memory' in performance) {
      const mem = (performance as any).memory.usedJSHeapSize;
      setMemoryHistory(prev => [...prev.slice(-30), mem]);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);
```
**Acceptance**: Memory trend visible

---

#### H3. Add Layer Status Indicators
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Show which layers are active
```typescript
<div>
  <h4>Active Layers</h4>
  <div>CSS Fallback: {cssActive ? '✅' : '❌'}</div>
  <div>WebGL Fluid: {webglActive ? '✅' : '❌'}</div>
  <div>Thin-Film: {thinFilmActive ? '✅' : '❌'}</div>
</div>
```
**Acceptance**: Layer status clear

---

#### H4. Add GPU Memory Monitor
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Show WebGL memory usage
```typescript
const glInfo = gl.getExtension('WEBGL_debug_renderer_info');
const gpuVendor = gl.getParameter(glInfo.UNMASKED_VENDOR_WEBGL);
const gpuRenderer = gl.getParameter(glInfo.UNMASKED_RENDERER_WEBGL);

<div>
  GPU: {gpuRenderer}
</div>
```
**Acceptance**: GPU info displayed

---

#### H5. Add Screenshot Capture
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Button to capture screenshot
```typescript
function captureScreenshot() {
  const canvas = document.querySelector('canvas');
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `liquid-light-${Date.now()}.png`;
  link.href = dataURL;
  link.click();
}

<button onClick={captureScreenshot}>📸 Screenshot</button>
```
**Acceptance**: Screenshots captured

---

#### H6. Add Stats Export
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Export performance stats as JSON
```typescript
function exportStats() {
  const stats = {
    fps: currentFPS,
    tier: currentTier,
    audio: audioData,
    battery: batteryLevel,
    memory: memoryUsage,
    timestamp: Date.now(),
  };

  const blob = new Blob([JSON.stringify(stats, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `stats-${Date.now()}.json`;
  link.href = url;
  link.click();
}

<button onClick={exportStats}>💾 Export Stats</button>
```
**Acceptance**: Stats exported

---

#### H7. Add Debug Console Integration
**File**: `lib/visual/dev/DebugConsole.ts`
**Action**: Expose globals for dev console
```typescript
if (process.env.NODE_ENV === 'development') {
  (window as any).__LIQUID_LIGHT_DEBUG__ = {
    paletteDirector: PaletteDirector,
    audioProcessor,
    beatDetector,
    orchestrator,
    forceRerender: () => forceUpdate(),
    setTier: (tier) => updatePolicy({ tier }),
  };
}
```
**Acceptance**: Can debug from console

---

#### H8. Add Hot Reload for Palettes
**File**: `lib/palette/PaletteDirector.ts`
**Action**: Reload palettes without refresh
```typescript
if (module.hot) {
  module.hot.accept('./palettes', () => {
    console.log('[HMR] Reloading palettes');
    // Re-import and update
  });
}
```
**Acceptance**: Palette changes hot-reload

---

#### H9. Add Performance Warnings
**File**: `components/liquid-light/dev/PerformanceHUD.tsx`
**Action**: Highlight performance issues
```typescript
{fps < 30 && (
  <div style={{ color: 'red', fontWeight: 'bold' }}>
    ⚠️ Low FPS: {fps.toFixed(1)}
  </div>
)}

{memoryUsage > 150 && (
  <div style={{ color: 'orange', fontWeight: 'bold' }}>
    ⚠️ High Memory: {memoryUsage.toFixed(0)} MB
  </div>
)}
```
**Acceptance**: Warnings visible when issues occur

---

#### H10. Document Dev Tools
**File**: `docs/dev/DEV_TOOLS.md`
**Action**: Create dev tools guide
```markdown
# Developer Tools

## Performance HUD

Enable with `?debug=true` or in dev environment.

Shows:
- FPS with trend graph
- Device tier
- Audio levels
- Battery status
- Memory usage with trend
- Active layers

## Debug Console

Access global debugging in dev console:

\`\`\`javascript
__LIQUID_LIGHT_DEBUG__.setTier('high')
__LIQUID_LIGHT_DEBUG__.paletteDirector.setPalette('dark-star')
__LIQUID_LIGHT_DEBUG__.forceRerender()
\`\`\`

## Thin-Film Debug Controls

Enable with `?debug-thinfilm=true`.

Adjust:
- Film thickness
- Index of refraction
- Blend mode
- Intensity

Presets: Oil, Soap, Intense, Subtle
```
**Acceptance**: Dev tools documented

---

## 📝 WORKSTREAM I: DOCUMENTATION & CONTRACTS (10 TASKS)

### Overview
Complete integration documentation and API contracts. Claude Code created comprehensive READMEs.

### Tasks

#### I1. Review Claude Code's Documentation
**Files**: `lib/palette/README.md`, `lib/audio/README.md`, `lib/post/ThinFilmPass.md`
**Action**: Read and understand integration contracts
**Acceptance**: Familiar with all APIs

---

#### I2. Add Orchestrator Integration Section
**File**: `lib/visual/orchestrator/README.md`
**Action**: Document Claude Code service integration
```markdown
## Integration with Claude Code Services

### Palette System
- **Service**: `PaletteDirector` (singleton)
- **Usage**: `PaletteDirector.setPalette(id)`
- **Integration**: Called in policy update, propagates to all layers

### Audio System
- **Enhanced Processor**: `createEnhancedAudioProcessor(alpha, beatGateConfig)`
- **Beat Detector**: `BeatDetector` class with adaptive threshold
- **Usage**: Instantiate once, call per frame

### Thin-Film Overlay
- **Component**: `AuthenticThinFilmEffect`
- **Props**: `audioParams`, `deviceTier`, `paletteId`, `enabled`
- **Mounting**: Z-index -30, above WebGL, below UI
```
**Acceptance**: Integration clear

---

#### I3. Create Props Contract Document
**File**: `docs/integration/PROPS_CONTRACTS.md`
**Action**: Document all layer prop requirements
```markdown
# Layer Props Contracts

## WebGL Fluid Layer

\`\`\`typescript
interface WebGLLayerProps {
  intensity: number;        // 0-1
  motionEnabled: boolean;
  tier: Tier;              // 'low' | 'medium' | 'high' | 'ultra'
  audioParams: PhysicsParams;
  paletteId: string;
}
\`\`\`

## Thin-Film Layer

\`\`\`typescript
interface ThinFilmLayerProps {
  audioParams: AudioReactiveParams;
  deviceTier: Tier;
  paletteId: string;
  enabled: boolean;
}
\`\`\`
```
**Acceptance**: All contracts documented

---

#### I4. Document Policy Schema
**File**: `docs/architecture/VISUAL_POLICY_SCHEMA.md`
**Action**: Full policy interface documentation
```markdown
# VisualPolicy Schema

\`\`\`typescript
export interface VisualPolicy {
  // Core
  intensity: number;
  motionEnabled: boolean;
  paletteId: string;
  mode: ModeType;

  // Thin-Film
  thinFilmEnabled: boolean;
  thinFilmIntensity: number;
  thinFilmQuality: ThinFilmQuality;
  thinFilmBlendMode: BlendMode;

  // Audio
  audioSmoothingAlpha: number;
  beatBurstMultiplier: number;

  // Power
  batterySaverOverride: boolean | null;
  powerPreference: PowerPreference;
}
\`\`\`

## Default Values
- intensity: 0.6
- motionEnabled: true
- paletteId: 'classic-60s'
...
```
**Acceptance**: Policy fully documented

---

#### I5. Create Troubleshooting Guide
**File**: `docs/troubleshooting/COMMON_ISSUES.md`
**Action**: Document common problems and solutions
```markdown
# Common Issues

## Thin-Film Not Visible

**Symptoms**: Thin-film layer not rendering

**Causes**:
- Device tier is 'low' (auto-disabled)
- `thinFilmEnabled` is false in policy
- Tab is hidden (Visibility API pause)

**Solutions**:
- Check tier: `?debug=true` to see current tier
- Check policy: DevTools → localStorage → visualPolicy
- Ensure tab is active

## Low FPS

**Symptoms**: FPS drops below 30

**Causes**:
- Thin-film on low-end device
- High audio smoothing causing lag
- Memory leak

**Solutions**:
- Disable thin-film: `?thinFilmEnabled=false`
- Lower tier manually
- Check memory graph in HUD

## Beat Detection Not Working

**Symptoms**: No beat bursts

**Causes**:
- No microphone permission
- Beat detector not initialized
- Confidence threshold too high

**Solutions**:
- Grant mic permission
- Check console for BeatDetector errors
- Lower `minConfidence` in config
```
**Acceptance**: Users can self-debug

---

#### I6. Create API Reference
**File**: `docs/api/API_REFERENCE.md`
**Action**: Comprehensive API docs
```markdown
# API Reference

## PaletteDirector

### Methods

#### `getPalette(id: string): Palette`
Get palette by ID.

**Parameters**:
- `id`: Palette ID (e.g., 'dark-star')

**Returns**: Palette object with colors, wavelengths, metadata

**Example**:
\`\`\`typescript
const palette = PaletteDirector.getPalette('dark-star');
console.log(palette.colors); // [[r,g,b], ...]
\`\`\`

... (continue for all APIs)
```
**Acceptance**: All APIs documented

---

#### I7. Create Architecture Diagrams
**File**: `docs/architecture/VISUAL_ARCHITECTURE.md`
**Action**: Create visual architecture diagrams
```markdown
# Visual Architecture

## Layer Stack

\`\`\`
┌─────────────────────────────────────┐
│   UI Components (z-index: 10)      │
├─────────────────────────────────────┤
│   Thin-Film (z-index: -30, screen) │
├─────────────────────────────────────┤
│   WebGL Fluid (z-index: -40, scr)  │
├─────────────────────────────────────┤
│   CSS Fallback (z-index: -50, norm)│
└─────────────────────────────────────┘
```

## Data Flow

\`\`\`
User Input → VisualPolicy → VisualOrchestrator
                                   ↓
                     ┌─────────────┴──────────────┐
                     ↓                            ↓
              PaletteDirector         EnhancedAudioProcessor
                     ↓                            ↓
              getCurrentColorsRGB()    calculateEnhancedPhysicsParams()
                     ↓                            ↓
              ┌──────┴────────┬─────────────────┴──────┐
              ↓               ↓                        ↓
         CSS Fallback    WebGL Layer            Thin-Film Layer
\`\`\`
```
**Acceptance**: Architecture clear

---

#### I8. Document Performance Budget
**File**: `docs/performance/PERFORMANCE_BUDGET.md` (created in Workstream E, enhance)
**Action**: Add detailed breakdown
```markdown
# Performance Budget Details

## Desktop High Tier (≥55 FPS)

| Component | Budget | Typical |
|-----------|--------|---------|
| Audio Processing | 0.5ms | 0.3ms |
| Physics Calc | 0.5ms | 0.2ms |
| React Render | 2.0ms | 1.5ms |
| WebGL Fluid | 8.0ms | 6.0ms |
| Thin-Film | 5.0ms | 3.5ms |
| **Total** | **16.0ms** | **11.5ms** |

## Mobile Medium Tier (≥45 FPS)

| Component | Budget | Typical |
|-----------|--------|---------|
| Audio Processing | 0.5ms | 0.3ms |
| Physics Calc | 0.5ms | 0.3ms |
| React Render | 3.0ms | 2.0ms |
| WebGL Fluid | 12.0ms | 9.0ms |
| Thin-Film | 6.0ms | 4.5ms |
| **Total** | **22.0ms** | **16.1ms** |
```
**Acceptance**: Budgets documented

---

#### I9. Create Migration Guide
**File**: `docs/migration/WEEK_1_TO_2_MIGRATION.md`
**Action**: Guide for updating Week 1 code
```markdown
# Week 1 → Week 2 Migration Guide

## Audio System

### Before (Week 1)
\`\`\`typescript
const physics = calculatePhysicsParams(audioData);
\`\`\`

### After (Week 2)
\`\`\`typescript
const processor = createEnhancedAudioProcessor(0.3);
const physics = calculateEnhancedPhysicsParams(audioData, processor);
\`\`\`

**Benefits**: Smoothing, curves, beat gating

## Palette System

### Before (Week 1)
\`\`\`typescript
// Manual color management
\`\`\`

### After (Week 2)
\`\`\`typescript
PaletteDirector.setPalette('dark-star');
const colors = PaletteDirector.getCurrentColorsRGB();
\`\`\`

**Benefits**: Centralized, wavelength-accurate
```
**Acceptance**: Migration path clear

---

#### I10. Create Week 2-4 Changelog
**File**: `docs/CHANGELOG_WEEK_2_4.md`
**Action**: Document all changes
```markdown
# Changelog: Weeks 2-4

## Week 2

### Added
- Thin-film interference shader (lib/post/ThinFilmPass.tsx)
- Beat detector with BPM estimation (lib/audio/beatDetector.ts)
- Enhanced audio processor with smoothing and curves
- Performance HUD (components/liquid-light/dev/PerformanceHUD.tsx)
- Thin-film debug controls
- 3 new palettes (St. Stephen, Help on the Way, Eyes of the World)

### Changed
- Audio mapping now uses enhanced processor by default
- Palette colors integrated into all layers
- Thin-film auto-disables on low tier

### Performance
- Shader optimized: 10-15% faster on mobile
- Memory stable after 5 remounts
- Beat detection: <0.05ms/call

## Week 3

### Added
(To be filled by Codex)

## Week 4

### Added
(To be filled by Codex)
```
**Acceptance**: Changes documented

---

## 🎯 ACCEPTANCE CRITERIA

### Overall Success Metrics

#### Performance
- ✅ Desktop high-tier: ≥55 FPS sustained
- ✅ Mobile medium-tier: ≥45 FPS sustained
- ✅ Auto-disable thin-film <45 FPS
- ✅ Zero memory growth after 5 hot remounts

#### Integration
- ✅ All Claude Code services wired into orchestrator
- ✅ Thin-film renders on medium/high tiers
- ✅ Beat detection drives visual bursts
- ✅ Palette changes propagate to all layers

#### Quality
- ✅ All tests pass (unit, integration, visual regression)
- ✅ Golden image diffs ≤2%
- ✅ No TypeScript errors
- ✅ No console warnings in production

#### Documentation
- ✅ All READMEs updated
- ✅ API reference complete
- ✅ Troubleshooting guide created
- ✅ Architecture diagrams added

---

## 🚧 GUARDRAILS

### Do NOT Modify
- `lib/palette/PaletteDirector.ts` (core logic) - Enhance only
- `lib/audio/beatDetector.ts` (core logic) - Use, don't modify
- `lib/post/ThinFilmPass.tsx` (shader) - Wrap, don't change
- `lib/visual/orchestrator/*` (without coordination) - Additive only

### Always
- Export minimal, typed APIs
- Respect Pure Mode (`?pureMode=true`)
- Respect performance gates
- Follow z-index plan (-50, -40, -30, 10)
- Document all new features

### Coordination Paths
- **Primary integration**: `lib/visual/VisualOrchestrator.tsx` layer render block
- **Palette/Audio contracts**: Use `PaletteDirector.getCurrentColorsRGB()` and orchestrator-provided `audioData`
- **Performance signals**: Use `TierTransitionManager` FPS thresholds

---

## 📅 TIMELINE

### Week 2 (Nov 5-11)
- Workstream A: Orchestrator Integration (Days 1-2)
- Workstream B: Thin-Film Mounting (Days 2-3)
- Workstream C: Audio Enhancement (Days 3-4)
- Workstream D: Palette Expansion (Days 4-5)

### Week 3 (Nov 12-18)
- Workstream E: Performance Optimization (Days 1-3)
- Workstream F: Battery Management (Days 3-4)
- Workstream G: QA Infrastructure (Days 4-5)

### Week 4 (Nov 19-25)
- Workstream H: Dev Tools (Days 1-2)
- Workstream I: Documentation (Days 2-3)
- Final testing and polish (Days 4-5)

---

## 🎉 SUCCESS VISION

**By End of Week 4**:

You will have delivered:
- ✅ Fully integrated orchestrator with all Claude Code services
- ✅ Production-ready thin-film overlay with quality tiers
- ✅ Enhanced audio pipeline with beat detection and smoothing
- ✅ 11 total palettes (8 original + 3 new)
- ✅ Comprehensive QA infrastructure with visual regression tests
- ✅ Performance-optimized pipeline (≥55 FPS desktop, ≥45 FPS mobile)
- ✅ Battery-aware power management
- ✅ Developer tools for debugging and tuning
- ✅ Complete documentation (APIs, architecture, troubleshooting)

**Result**: A polished, production-ready liquid light system that honors the Joshua Light Show legacy while leveraging modern web technologies.

---

## 📞 CONTACT POINTS

### Claude Code (Completed)
- Thin-film shader: `lib/post/ThinFilmPass.tsx`
- Beat detector: `lib/audio/beatDetector.ts`
- Enhanced audio: `lib/audio/mapping.ts`
- Performance HUD: `components/liquid-light/dev/PerformanceHUD.tsx`
- Debug controls: `components/liquid-light/dev/ThinFilmDebugControls.tsx`
- Documentation: `lib/palette/README.md`, `lib/audio/README.md`, `lib/post/ThinFilmPass.md`

### Cursor (Parallel)
- Integration work in progress
- Testing and validation
- Code quality improvements

### You (Codex)
- Orchestrator integration
- Performance optimization
- QA infrastructure
- Documentation completion

---

**Total Tasks**: 95
**Estimated Duration**: 3 weeks
**Priority**: 🔥 CRITICAL → ⚡ HIGH → 📝 MEDIUM → 🧪 LOW

**LET'S BUILD SOMETHING AMAZING!** 🚀

---

**End of Mega Sprint Prompt**

*Load up and execute systematically. Report progress daily.*
*Coordinate via GitHub commits: `[Codex] Description`*
*Claude Code standing by for support.*
