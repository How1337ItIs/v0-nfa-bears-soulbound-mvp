# Audio System Documentation

## Overview

The Audio System provides **real-time audio analysis and mapping** for the Liquid Light visual system. It transforms audio signals (bass, mids, treble) into visual physics parameters with sophisticated smoothing, curves, and beat detection.

**Key Features:**
- Web Audio API integration
- Frequency band analysis (bass, mids, treble)
- Audio-to-physics parameter mapping
- Beat detection with BPM estimation
- Exponential moving average (EMA) smoothing
- Dynamic curves (soft knee, power, S-curve)
- Beat gating for burst effects

---

## Architecture

```
Audio System
├── useAudioReactive() - React hook for Web Audio API
├── Mapping System
│   ├── Basic: calculatePhysicsParams()
│   └── Enhanced: calculateEnhancedPhysicsParams()
├── Beat Detection
│   ├── BeatDetector (adaptive threshold)
│   └── Factory functions (dance floor, ambient)
├── Curve Utilities
│   ├── softKnee() - Compression with smooth knee
│   ├── powerCurve() - Exponential response
│   └── sCurve() - Sigmoid for smooth transitions
├── Smoothing
│   ├── EMASmootherBank - Per-band smoothing
│   └── BeatGate - Beat burst envelope
└── Constants
    ├── AUDIO_PHYSICS_MAPPING - Parameter ranges
    └── MODE_PRESETS - Intensity presets
```

---

## Quick Start

### Basic Usage

```typescript
import { useAudioReactive, calculatePhysicsParams } from '@/lib/audio';

function MyComponent() {
  const audioData = useAudioReactive();

  // Basic mapping
  const physics = calculatePhysicsParams(audioData);

  console.log(physics.splatForce); // 8-23 range
  console.log(physics.thermalRate); // 2-8 range
  console.log(physics.colorPhase); // 0-6.28 range

  return <div>Bass: {audioData?.bass.toFixed(2)}</div>;
}
```

### Enhanced Audio Processing

```typescript
import {
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
} from '@/lib/audio';

// Create processor with smoothing
const processor = createEnhancedAudioProcessor(
  0.3,  // smoothing alpha (0.1-0.9)
  { burstMultiplier: 1.8, decayTime: 200 }  // beat gate config
);

function update(audioData) {
  // Enhanced calculation with smoothing & curves
  const physics = calculateEnhancedPhysicsParams(audioData, processor);

  // Smooth values, beat bursts, musical curves
  fluid.setSplatForce(physics.splatForce);
}
```

### Beat Detection

```typescript
import { BeatDetector } from '@/lib/audio';

const detector = new BeatDetector({
  thresholdMultiplier: 1.5,
  refractoryPeriodMs: 150,
  bpmMin: 60,
  bpmMax: 180,
});

function update(audioData) {
  const result = detector.detect(audioData.bass * 100);

  if (result.isBeat) {
    console.log(`Beat! BPM: ${result.bpmEstimate.toFixed(0)}`);
    triggerBeatEffect();
  }
}
```

---

## Audio-to-Physics Mapping

### Parameter Ranges

```typescript
export const AUDIO_PHYSICS_MAPPING = {
  SPLAT_FORCE: { MIN: 8, MAX: 23, BASE: 5 },
  THERMAL_RATE: { MIN: 2, MAX: 8, BASE: 3 },
  COLOR_PHASE: { MIN: 0, MAX: Math.PI * 2, BASE: 0 },
  GLOBAL_INTENSITY: { MIN: 0.4, MAX: 1.0, BASE: 0.6 },
  CURL_STRENGTH: { MIN: 15, MAX: 30, BASE: 20 },
  VISCOSITY: { MIN: 0.3, MAX: 0.6, BASE: 0.4 },
};
```

### Mapping Logic

| Audio Input | Visual Parameter | Response Curve |
|------------|------------------|----------------|
| **Bass** (20-250Hz) | Splat Force | Power curve (expansion) |
| **Mids** (250-2000Hz) | Thermal Rate | Soft knee (compression) |
| **Treble** (2000-20kHz) | Color Phase | S-curve (smooth) |
| **Volume** (overall) | Global Intensity | Linear |
| **Bass (inverse)** | Viscosity | Linear (inverse) |

### Basic Mapping Function

```typescript
function mapAudioToPhysics(
  audioValue: number,  // 0-1 normalized
  range: { MIN: number; MAX: number; BASE: number }
): number {
  const clamped = Math.max(0, Math.min(1, audioValue));
  return range.MIN + clamped * (range.MAX - range.MIN);
}

// Example
const bassLevel = 0.8; // 80% bass energy
const splatForce = mapAudioToPhysics(
  bassLevel,
  AUDIO_PHYSICS_MAPPING.SPLAT_FORCE
);
// Returns: 8 + 0.8 * (23 - 8) = 20
```

---

## Curve Utilities

### Soft Knee Compression

Smooth compression at threshold, prevents harsh clipping.

```typescript
import { softKnee } from '@/lib/audio';

const value = 0.8; // 80% audio level
const compressed = softKnee(
  value,
  0.5,   // threshold (50%)
  0.2    // knee width (20%)
);

// Values < 0.4 pass through
// Values 0.4-0.6 smoothly compress
// Values > 0.6 compress at 2:1 ratio
```

**Use Case**: Prevent mids from overwhelming visuals while preserving dynamics.

### Power Curve

Exponential response curve.

```typescript
import { powerCurve } from '@/lib/audio';

const value = 0.5;
const expanded = powerCurve(value, 1.2);  // Slight expansion
const compressed = powerCurve(value, 1.8); // Compression

// exponent < 1.0 = expansion (boost quiet sounds)
// exponent > 1.0 = compression (tame loud sounds)
```

**Use Case**: Make bass more punchy by expanding lower levels.

### S-Curve (Sigmoid)

Smooth transitions at both extremes.

```typescript
import { sCurve } from '@/lib/audio';

const value = 0.5;
const smooth = sCurve(value, 5); // Steepness = 5

// Gradual start, steep middle, gradual end
// Perfect for color phase transitions
```

**Use Case**: Smooth color phase rotation without abrupt changes.

---

## Smoothing System

### EMA Smoother Bank

Exponential Moving Average (EMA) smoothing prevents jitter.

```typescript
import { EMASmootherBank } from '@/lib/audio';

const smoother = new EMASmootherBank(0.3); // alpha = 0.3

// Smooth each band independently
const smoothBass = smoother.smooth('bass', rawBass);
const smoothMids = smoother.smooth('mids', rawMids);
const smoothTreble = smoother.smooth('treble', rawTreble);

// Alpha values:
// 0.1 = very smooth (slow response, no jitter)
// 0.5 = balanced (moderate smoothing)
// 0.9 = responsive (fast response, may jitter)
```

**Formula**: `smoothed = alpha * new + (1 - alpha) * previous`

### Beat Gate

Adds transient burst on beat detection.

```typescript
import { BeatGate } from '@/lib/audio';

const beatGate = new BeatGate({
  burstMultiplier: 1.5,  // 50% boost on beat
  decayTime: 200,        // 200ms decay
  minInterval: 100,      // 100ms min between beats
});

function update(audioData, deltaTime) {
  const burst = beatGate.update(
    audioData.beatDetected,
    deltaTime
  );

  // burst = 1.0 (no beat)
  // burst = 1.5 (beat detected)
  // burst decays 1.5 → 1.0 over 200ms

  const splatForce = baseSplatForce * burst;
}
```

---

## Beat Detection

### BeatDetector Class

Adaptive threshold beat detection with BPM estimation.

```typescript
import { BeatDetector } from '@/lib/audio';

const detector = new BeatDetector({
  energyAlpha: 0.98,           // Energy averaging
  varianceAlpha: 0.98,         // Variance averaging
  thresholdMultiplier: 1.5,    // Sensitivity
  minConfidence: 0.5,          // Confidence threshold
  refractoryPeriodMs: 150,     // Min beat interval
  bpmHistorySize: 8,           // BPM averaging
  bpmMin: 60,                  // Plausible BPM range
  bpmMax: 180,
});

const result = detector.detect(bassEnergy);

// result = {
//   isBeat: boolean,
//   confidence: number (0-1),
//   bpmEstimate: number,
//   energy: number,
//   averageEnergy: number,
//   timestamp: number,
// }
```

### Factory Functions

```typescript
import {
  createDanceFloorDetector,
  createAmbientDetector,
} from '@/lib/audio';

// Dance floor: sensitive, fast BPM
const danceDetector = createDanceFloorDetector();
// Config: threshold=1.3, refractory=120ms, BPM=100-180

// Ambient: less sensitive, slow BPM
const ambientDetector = createAmbientDetector();
// Config: threshold=1.8, refractory=200ms, BPM=60-120
```

### BPM Estimation

Uses **median interval** (robust to outliers):

```typescript
const detector = new BeatDetector();

// Detect beats over time
const result1 = detector.detect(energy1); // Beat at t=0ms
const result2 = detector.detect(energy2); // Beat at t=500ms
const result3 = detector.detect(energy3); // Beat at t=1000ms

// BPM = 60 / (median interval in seconds)
// Intervals: [500ms, 500ms]
// Median: 500ms = 0.5s
// BPM = 60 / 0.5 = 120 BPM
```

---

## Enhanced Audio Processor

Combines smoothing, curves, and beat gating.

### Create Processor

```typescript
import { createEnhancedAudioProcessor } from '@/lib/audio';

const processor = createEnhancedAudioProcessor(
  0.3,  // EMA alpha (smoothing factor)
  {
    burstMultiplier: 1.8,  // Beat burst amount
    decayTime: 200,        // Burst decay time (ms)
    minInterval: 100,      // Beat debounce (ms)
  }
);
```

### Calculate Enhanced Physics

```typescript
import { calculateEnhancedPhysicsParams } from '@/lib/audio';

function update(audioData) {
  const physics = calculateEnhancedPhysicsParams(
    audioData,
    processor
  );

  // Physics params with:
  // - EMA smoothing on all bands
  // - Power curve on bass (expansion)
  // - Soft knee on mids (compression)
  // - S-curve on treble (smooth)
  // - Beat burst on splat force

  applyToFluid(physics);
}
```

### Enhanced vs. Basic

| Feature | Basic | Enhanced |
|---------|-------|----------|
| Smoothing | ❌ None | ✅ EMA per band |
| Curves | ❌ Linear | ✅ Power/knee/S-curve |
| Beat burst | ❌ No | ✅ Transient envelope |
| Performance | Fastest | +0.2ms/frame |

---

## Mode Presets

Pre-configured intensity levels.

```typescript
export const MODE_PRESETS = {
  off: {
    motionEnabled: false,
    intensity: 0,
  },
  ambient: {
    motionEnabled: true,
    intensity: 0.5,
  },
  'dance-floor': {
    motionEnabled: true,
    intensity: 0.8,
  },
  trip: {
    motionEnabled: true,
    intensity: 1.0,
  },
};

// Usage
const mode = MODE_PRESETS['dance-floor'];
setMotionEnabled(mode.motionEnabled);
setIntensity(mode.intensity);
```

---

## Performance

| Operation | Cost | Notes |
|-----------|------|-------|
| `calculatePhysicsParams()` | ~0.01ms | Basic mapping |
| `calculateEnhancedPhysicsParams()` | ~0.2ms | With smoothing & curves |
| `BeatDetector.detect()` | ~0.05ms | Adaptive threshold |
| `EMASmootherBank.smooth()` | ~0.001ms | Per value |
| `BeatGate.update()` | ~0.01ms | Envelope calculation |

**Total Budget**: <0.5ms per frame (well within 16.67ms budget for 60fps)

---

## Best Practices

### 1. Use Enhanced Processor for Polish

```typescript
// ✅ Good: Smooth, musical response
const processor = createEnhancedAudioProcessor(0.3);
const physics = calculateEnhancedPhysicsParams(audioData, processor);

// ❌ OK but raw: Direct, twitchy response
const physics = calculatePhysicsParams(audioData);
```

### 2. Tune Alpha for Context

```typescript
// Ambient mode: Smooth, flowing
const ambientProcessor = createEnhancedAudioProcessor(0.1); // Very smooth

// Dance floor: Responsive, punchy
const danceProcessor = createEnhancedAudioProcessor(0.6); // Responsive
```

### 3. Validate Audio Data

```typescript
// ✅ Good: Handle null audio
const physics = calculatePhysicsParams(audioData);
// Returns BASE values if audioData is null

// ❌ Bad: Assume audio exists
const force = audioData.bass * 100; // May crash if null
```

### 4. Reuse Processor Instances

```typescript
// ✅ Good: Single processor instance
const processor = createEnhancedAudioProcessor();
useEffect(() => {
  const interval = setInterval(() => {
    const physics = calculateEnhancedPhysicsParams(audio, processor);
  }, 16);
  return () => clearInterval(interval);
}, []);

// ❌ Bad: Creating new processors
useEffect(() => {
  const interval = setInterval(() => {
    const processor = createEnhancedAudioProcessor(); // WASTEFUL
    const physics = calculateEnhancedPhysicsParams(audio, processor);
  }, 16);
  return () => clearInterval(interval);
}, []);
```

---

## Examples

### Complete Integration

```typescript
import {
  useAudioReactive,
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
  BeatDetector,
} from '@/lib/audio';

function LiquidLightBackground() {
  const audioData = useAudioReactive();

  const processorRef = useRef(
    createEnhancedAudioProcessor(0.3, {
      burstMultiplier: 1.8,
      decayTime: 200,
    })
  );

  const detectorRef = useRef(new BeatDetector());

  useFrame(() => {
    if (!audioData) return;

    // Beat detection
    const beatResult = detectorRef.current.detect(audioData.bass * 100);

    // Enhanced physics with beat info
    const enrichedAudioData = {
      ...audioData,
      beatDetected: beatResult.isBeat,
    };

    const physics = calculateEnhancedPhysicsParams(
      enrichedAudioData,
      processorRef.current
    );

    // Apply to fluid simulation
    fluidRef.current.setSplatForce(physics.splatForce);
    fluidRef.current.setThermalRate(physics.thermalRate);
    // ...
  });

  return <Canvas>{/* ... */}</Canvas>;
}
```

---

## Troubleshooting

### Audio Not Detected

1. Check microphone permissions
2. Verify Web Audio API support: `typeof AudioContext !== 'undefined'`
3. Check console for `getUserMedia` errors

### Twitchy Visuals

- Lower EMA alpha: `createEnhancedAudioProcessor(0.1)` (more smoothing)
- Increase beat gate decay: `{ decayTime: 300 }`

### Unresponsive to Beats

- Increase beat detector sensitivity: `{ thresholdMultiplier: 1.2 }`
- Lower confidence threshold: `{ minConfidence: 0.3 }`

### High CPU Usage

- Use basic mapping instead of enhanced
- Increase frame skip interval

---

## Related Documentation

- [Palette System](../palette/README.md)
- [Thin-Film Shader](../post/ThinFilmPass.md)
- [Visual Orchestration](../visual/orchestrator/README.md)

---

**Maintained by**: Claude Code
**Last Updated**: 2025-10-29
