# CLAUDE CODE MEGA WORKLOAD: Weeks 3-6

**Created**: 2025-10-29
**Target Completion**: 2025-12-17 (6 weeks)
**Scope**: 120 tasks across 11 workstreams
**Status**: Following Master Liquid Light Integration Plan
**My Role**: Physics, GLSL, audio, color science, performance optimization

---

## 🎯 MISSION STATEMENT

Complete the **advanced visual layers, performance optimization, and cultural authenticity** features from the Master Implementation Plan. Focus on areas where I excel: **GLSL shaders, physics simulations, audio processing, color science, and mathematical implementations**.

**What I've Already Completed** (Weeks 1-2):
- ✅ Thin-film shader with palette integration
- ✅ Beat detector with BPM estimation
- ✅ Enhanced audio processor (curves, smoothing, beat gating)
- ✅ Performance HUD + thin-film debug controls
- ✅ PaletteDirector service (8 palettes)
- ✅ Comprehensive documentation (7,500+ words)

**What Remains** (This Workload):
- Advanced shader optimizations
- Additional visual effects
- Cultural authenticity features
- Performance profiling and tuning
- Advanced audio analysis
- Extended palette system
- Testing infrastructure
- Educational content
- Accessibility features
- Documentation completion
- Final polish

---

## 📋 WORKSTREAM OVERVIEW

| ID | Workstream | Tasks | Priority | Weeks |
|----|-----------|-------|----------|-------|
| **A** | Advanced Shader Effects | 15 | 🔥 HIGH | 3-4 |
| **B** | Performance Profiling & Optimization | 12 | ⚡ CRITICAL | 3-4 |
| **C** | Audio Analysis Extensions | 10 | 🔥 HIGH | 3-4 |
| **D** | Color Science & Palette Extensions | 12 | 📝 MEDIUM | 4-5 |
| **E** | Cultural Authenticity Features | 10 | 🎨 MEDIUM | 4-5 |
| **F** | Accessibility & Inclusion | 8 | ♿ MEDIUM | 5 |
| **G** | WebGPU Experimental Layer | 12 | 🧪 LOW | 5-6 |
| **H** | Advanced Testing Infrastructure | 10 | 🧪 MEDIUM | 5-6 |
| **I** | Educational Content & Documentation | 10 | 📚 MEDIUM | 5-6 |
| **J** | Mathematical Utilities & Helpers | 11 | 📝 MEDIUM | 4-6 |
| **K** | Final Polish & Optimization | 10 | ✨ HIGH | 6 |

**Total**: 120 tasks

---

## 🔥 WORKSTREAM A: ADVANCED SHADER EFFECTS (15 TASKS)

### Overview
Extend thin-film shader with additional physically-inspired effects and optimizations. Build on completed thin-film work.

---

#### A1. Implement Multi-Order Interference Variants
**File**: `lib/post/ThinFilmPass.tsx` (or new variants file)
**Action**: Create quality presets with different interference order counts
```typescript
// Current: 2 orders (mobile-optimized)
// Add:
// - 1 order (ultra-low, emergency fallback)
// - 3 orders (desktop high quality)
// - 4 orders (desktop ultra)

const INTERFERENCE_QUALITY_PRESETS = {
  emergency: { orders: 1, dpr: [1, 1] },
  mobile: { orders: 2, dpr: [1, 1.5] },
  desktop: { orders: 3, dpr: [1, 2] },
  ultra: { orders: 4, dpr: [1, 2] },
};
```
**Acceptance**: Quality presets switchable, performance measured

---

#### A2. Add Iridescent Shimmer Effect
**File**: `lib/post/shimmerEffect.glsl`
**Action**: Create subtle shimmer shader based on viewing angle
```glsl
// Fresnel-like shimmer based on angle
float fresnel(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - dot(normal, viewDir), power);
}

// Add shimmer to edges
float shimmer = fresnel(normal, viewDir, 3.0);
color += shimmer * 0.2 * paletteColor;
```
**Acceptance**: Subtle shimmer on edges, no performance hit

---

#### A3. Implement Flow Field Distortion
**File**: `lib/post/flowFieldShader.glsl`
**Action**: Create flow field that distorts thin-film based on audio
```glsl
// Flow field for organic distortion
vec2 flowField(vec2 uv, float time, float audioEnergy) {
  vec2 flow = vec2(
    sin(uv.y * 10.0 + time) * cos(uv.x * 8.0 + time),
    cos(uv.x * 10.0 + time) * sin(uv.y * 8.0 + time)
  );
  return flow * audioEnergy * 0.05;
}

// Apply to UV coordinates
vec2 distortedUV = uv + flowField(uv, uTime, uAudioEnergy);
```
**Acceptance**: Organic flow, audio-reactive, <2ms GPU time

---

#### A4. Add Chromatic Aberration Effect
**File**: `lib/post/chromaticAberration.glsl`
**Action**: Subtle RGB split for psychedelic effect
```glsl
// Sample RGB channels at slightly different UV offsets
float offset = uIntensity * 0.002;
vec2 rOffset = vec2(offset, 0.0);
vec2 bOffset = vec2(-offset, 0.0);

float r = texture2D(tDiffuse, uv + rOffset).r;
float g = texture2D(tDiffuse, uv).g;
float b = texture2D(tDiffuse, uv + bOffset).b;

color = vec3(r, g, b);
```
**Acceptance**: Subtle effect, toggleable, <1ms cost

---

#### A5. Create Kaleidoscope Mode
**File**: `lib/post/kaleidoscopeShader.glsl`
**Action**: Symmetrical reflection for trip mode
```glsl
// Radial symmetry
float angle = atan(uv.y - 0.5, uv.x - 0.5);
float radius = length(uv - 0.5);

// Mirror across N sections
float sections = 6.0;
angle = mod(angle, 2.0 * PI / sections);

vec2 kaleidoUV = vec2(
  0.5 + cos(angle) * radius,
  0.5 + sin(angle) * radius
);
```
**Acceptance**: Trip mode exclusive, high-intensity only

---

#### A6. Implement Bloom Post-Processing
**File**: `lib/post/bloomPass.ts`
**Action**: Gaussian bloom for glowing highlights
```typescript
// Use R3F bloom from pmndrs/postprocessing
import { Bloom } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom
    intensity={audioParams.globalIntensity}
    luminanceThreshold={0.5}
    luminanceSmoothing={0.9}
  />
  <ThinFilmPass {...props} />
</EffectComposer>
```
**Acceptance**: Glow on bright areas, intensity-reactive

---

#### A7. Add Vignette Effect
**File**: `lib/post/vignetteShader.glsl`
**Action**: Subtle edge darkening for focus
```glsl
float dist = distance(uv, vec2(0.5));
float vignette = smoothstep(0.8, 0.3, dist);
color *= vignette;
```
**Acceptance**: Subtle, adjustable strength

---

#### A8. Create Oil Paint Effect
**File**: `lib/post/oilPaintShader.glsl`
**Action**: Kuwahara filter for painterly look
```glsl
// Simplified Kuwahara for oil paint effect
vec3 oilPaint(vec2 uv, sampler2D tex, float radius) {
  // Sample 4 quadrants, use lowest variance
  // (Implementation details)
}
```
**Acceptance**: Optional effect, high-tier only

---

#### A9. Implement Particle Overlay System
**File**: `lib/post/particleOverlay.glsl`
**Action**: Subtle floating particles
```glsl
// Hash-based pseudo-random particles
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Floating particle field
float particles(vec2 uv, float time) {
  vec2 grid = floor(uv * 50.0);
  vec2 offset = vec2(hash(grid), hash(grid + 100.0));
  vec2 particlePos = fract(uv * 50.0 - offset - time * 0.1);

  float dist = length(particlePos - 0.5);
  return smoothstep(0.1, 0.0, dist);
}
```
**Acceptance**: Subtle, optional, audio-reactive

---

#### A10. Add Heat Haze Distortion
**File**: `lib/post/heatHazeShader.glsl`
**Action**: Thermal distortion effect
```glsl
// Heat haze distortion
vec2 heatHaze(vec2 uv, float time, float intensity) {
  float noise1 = sin(uv.y * 20.0 + time * 2.0) * 0.005;
  float noise2 = sin(uv.x * 15.0 + time * 1.5) * 0.005;
  return vec2(noise1, noise2) * intensity;
}
```
**Acceptance**: Subtle thermal effect, fire palette exclusive

---

#### A11. Create Normal Map Generation
**File**: `lib/post/normalMapGenerator.ts`
**Action**: Generate normals from fluid velocity for lighting
```typescript
// Convert velocity field to normal map
function velocityToNormals(velocityTexture: Texture): Texture {
  // Sobel operator for gradient
  // Convert to normal vectors
  // Return normal map texture
}
```
**Acceptance**: Improves lighting realism

---

#### A12. Implement Refraction Simulation
**File**: `lib/post/refractionShader.glsl`
**Action**: Refract background based on fluid density
```glsl
// Refraction based on density
vec2 refract = uv + densityGradient * uRefractionStrength;
vec3 refractedColor = texture2D(tDiffuse, refract).rgb;
```
**Acceptance**: Subtle lens effect, optional

---

#### A13. Add Subsurface Scattering
**File**: `lib/post/subsurfaceShader.glsl`
**Action**: Light penetration through fluid
```glsl
// Simple subsurface scattering
vec3 scatter = vec3(0.0);
for (int i = 0; i < 4; i++) {
  float offset = float(i) * 0.01;
  scatter += texture2D(tDiffuse, uv + vec2(offset)).rgb;
}
scatter /= 4.0;
color = mix(color, scatter, uScatterStrength);
```
**Acceptance**: Subtle glow, optional

---

#### A14. Create Shader Preset System
**File**: `lib/post/shaderPresets.ts`
**Action**: Named shader combinations for songs
```typescript
export const SHADER_PRESETS = {
  'dark-star': {
    thinFilm: true,
    bloom: 0.3,
    chromatic: 0.1,
    kaleidoscope: false,
  },
  'fire-on-the-mountain': {
    thinFilm: true,
    bloom: 0.5,
    heatHaze: 0.2,
    particles: true,
  },
  // ... more presets
};
```
**Acceptance**: Easy switching between song modes

---

#### A15. Optimize Shader Compilation
**File**: `lib/post/shaderOptimizer.ts`
**Action**: Precompile shaders, cache programs
```typescript
// Shader program cache
const shaderCache = new Map<string, WebGLProgram>();

function getCachedShader(gl: WebGLContext, key: string, vs: string, fs: string) {
  if (shaderCache.has(key)) {
    return shaderCache.get(key);
  }

  const program = compileShader(gl, vs, fs);
  shaderCache.set(key, program);
  return program;
}
```
**Acceptance**: Faster initial load, no re-compilation

---

## ⚡ WORKSTREAM B: PERFORMANCE PROFILING & OPTIMIZATION (12 TASKS)

### Overview
Deep performance analysis and optimization of entire visual pipeline.

---

#### B1. Create Comprehensive GPU Profiler
**File**: `lib/performance/gpuProfiler.ts`
**Action**: Measure GPU time for all render passes
```typescript
export class GPUProfiler {
  private queries: WebGLQuery[] = [];

  startQuery(label: string) {
    const query = gl.createQuery();
    gl.beginQuery(gl.TIME_ELAPSED_EXT, query);
    this.queries.push({ label, query });
  }

  endQuery() {
    gl.endQuery(gl.TIME_ELAPSED_EXT);
  }

  getResults(): Map<string, number> {
    // Retrieve timing data
    // Return ms per pass
  }
}
```
**Acceptance**: Accurate GPU timing per pass

---

#### B2. Implement Frame Budget Analyzer
**File**: `lib/performance/frameBudget.ts`
**Action**: Track budget consumption
```typescript
export class FrameBudgetAnalyzer {
  private budget = 16.67; // 60fps
  private breakdown = new Map<string, number>();

  measure(label: string, fn: () => void) {
    const start = performance.now();
    fn();
    const elapsed = performance.now() - start;
    this.breakdown.set(label, elapsed);
  }

  getReport() {
    let total = 0;
    const report = [];

    for (const [label, time] of this.breakdown) {
      total += time;
      report.push({
        label,
        time,
        percentage: (time / this.budget) * 100,
      });
    }

    return { report, total, remaining: this.budget - total };
  }
}
```
**Acceptance**: Clear budget breakdown per frame

---

#### B3. Create Memory Leak Detector
**File**: `lib/performance/memoryLeakDetector.ts`
**Action**: Track WebGL resource allocation/deallocation
```typescript
export class MemoryLeakDetector {
  private resources = new Map<string, Set<any>>();

  track(type: 'texture' | 'buffer' | 'program', resource: any) {
    if (!this.resources.has(type)) {
      this.resources.set(type, new Set());
    }
    this.resources.get(type)!.add(resource);
  }

  untrack(type: string, resource: any) {
    this.resources.get(type)?.delete(resource);
  }

  checkLeaks() {
    for (const [type, set] of this.resources) {
      if (set.size > 0) {
        console.warn(`[MemoryLeakDetector] ${type}: ${set.size} un-disposed`);
      }
    }
  }
}
```
**Acceptance**: Detects un-disposed WebGL resources

---

#### B4. Optimize Texture Atlas
**File**: `lib/performance/textureAtlas.ts`
**Action**: Pack multiple textures into single atlas
```typescript
export class TextureAtlas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private positions = new Map<string, {x: number, y: number, w: number, h: number}>();

  add(id: string, image: HTMLImageElement) {
    // Pack into atlas using bin packing
    // Update UV coordinates
  }

  getUVs(id: string): {u0: number, v0: number, u1: number, v1: number} {
    const pos = this.positions.get(id)!;
    return {
      u0: pos.x / this.canvas.width,
      v0: pos.y / this.canvas.height,
      u1: (pos.x + pos.w) / this.canvas.width,
      v1: (pos.y + pos.h) / this.canvas.height,
    };
  }
}
```
**Acceptance**: Reduced texture binds, better performance

---

#### B5. Implement Shader Hot-Swapping
**File**: `lib/performance/shaderHotSwap.ts`
**Action**: Replace shaders without full reload
```typescript
export function hotSwapShader(
  gl: WebGLContext,
  program: WebGLProgram,
  newFragmentShader: string
) {
  // Detach old shaders
  const shaders = gl.getAttachedShaders(program);
  shaders?.forEach(shader => gl.detachShader(program, shader));

  // Compile and attach new shader
  const fs = compileFragmentShader(gl, newFragmentShader);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Verify
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Shader hot-swap failed');
  }
}
```
**Acceptance**: Live shader editing without reload

---

#### B6. Create FPS Histogram Analyzer
**File**: `lib/performance/fpsHistogram.ts`
**Action**: Track FPS distribution over time
```typescript
export class FPSHistogram {
  private buckets = new Array(7).fill(0); // 0-10, 10-20, ..., 60+
  private samples = 0;

  record(fps: number) {
    const bucket = Math.min(Math.floor(fps / 10), 6);
    this.buckets[bucket]++;
    this.samples++;
  }

  getReport() {
    return {
      buckets: this.buckets.map((count, i) => ({
        range: `${i * 10}-${(i + 1) * 10}`,
        count,
        percentage: (count / this.samples) * 100,
      })),
      p50: this.getPercentile(0.5),
      p95: this.getPercentile(0.95),
      p99: this.getPercentile(0.99),
    };
  }
}
```
**Acceptance**: Understand FPS stability

---

#### B7. Implement Draw Call Batching
**File**: `lib/performance/drawCallBatcher.ts`
**Action**: Reduce draw calls via instancing
```typescript
export class DrawCallBatcher {
  private instances: {geometry: any, material: any, matrices: Matrix4[]}[] = [];

  add(geometry: any, material: any, matrix: Matrix4) {
    // Find existing batch or create new
    const batch = this.instances.find(b =>
      b.geometry === geometry && b.material === material
    );

    if (batch) {
      batch.matrices.push(matrix);
    } else {
      this.instances.push({ geometry, material, matrices: [matrix] });
    }
  }

  flush() {
    // Render all batches with instancing
    for (const batch of this.instances) {
      renderInstanced(batch.geometry, batch.material, batch.matrices);
    }
    this.instances = [];
  }
}
```
**Acceptance**: Fewer draw calls, better performance

---

#### B8. Optimize Uniform Updates
**File**: `lib/performance/uniformOptimizer.ts`
**Action**: Only update changed uniforms
```typescript
export class UniformOptimizer {
  private cache = new Map<string, any>();

  setUniform(gl: WebGLContext, location: WebGLUniformLocation, value: any) {
    const key = `${location}`;
    const cached = this.cache.get(key);

    if (cached === value) {
      return; // Skip redundant update
    }

    this.cache.set(key, value);

    // Set uniform based on type
    if (typeof value === 'number') {
      gl.uniform1f(location, value);
    } else if (Array.isArray(value)) {
      gl.uniform3fv(location, value);
    }
    // ... more types
  }
}
```
**Acceptance**: Reduced GL state changes

---

#### B9. Create Perf Regression Test Suite
**File**: `__tests__/performance/regressions.test.ts`
**Action**: Automated performance tests
```typescript
test('thin-film shader stays within budget', async () => {
  const profiler = new GPUProfiler();

  profiler.startQuery('thin-film');
  renderThinFilmPass();
  profiler.endQuery();

  const results = profiler.getResults();
  const thinFilmTime = results.get('thin-film')!;

  expect(thinFilmTime).toBeLessThan(5); // 5ms budget
});

test('memory stable after 10 remounts', async () => {
  const initial = getMemoryUsage();

  for (let i = 0; i < 10; i++) {
    mount();
    await wait(100);
    unmount();
  }

  const final = getMemoryUsage();
  const growth = final - initial;

  expect(growth).toBeLessThan(10 * 1024 * 1024); // 10MB tolerance
});
```
**Acceptance**: CI catches perf regressions

---

#### B10. Implement Adaptive Quality System
**File**: `lib/performance/adaptiveQuality.ts`
**Action**: Auto-adjust quality to maintain FPS
```typescript
export class AdaptiveQualitySystem {
  private targetFPS = 55;
  private currentQuality = 'high';
  private adjustCooldown = 2000; // ms
  private lastAdjust = 0;

  update(currentFPS: number) {
    const now = Date.now();
    if (now - this.lastAdjust < this.adjustCooldown) return;

    if (currentFPS < this.targetFPS - 5) {
      this.stepDown();
      this.lastAdjust = now;
    } else if (currentFPS > this.targetFPS + 10) {
      this.stepUp();
      this.lastAdjust = now;
    }
  }

  private stepDown() {
    const levels = ['ultra', 'high', 'medium', 'low'];
    const current = levels.indexOf(this.currentQuality);
    if (current < levels.length - 1) {
      this.currentQuality = levels[current + 1];
      console.log(`[AdaptiveQuality] Stepped down to ${this.currentQuality}`);
    }
  }

  private stepUp() {
    const levels = ['low', 'medium', 'high', 'ultra'];
    const current = levels.indexOf(this.currentQuality);
    if (current < levels.length - 1) {
      this.currentQuality = levels[current + 1];
      console.log(`[AdaptiveQuality] Stepped up to ${this.currentQuality}`);
    }
  }
}
```
**Acceptance**: Maintains target FPS automatically

---

#### B11. Create Performance Dashboard
**File**: `components/liquid-light/dev/PerformanceDashboard.tsx`
**Action**: Comprehensive performance visualization
```typescript
export function PerformanceDashboard() {
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [gpuTimes, setGpuTimes] = useState<Map<string, number>>(new Map());
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);

  return (
    <div className="perf-dashboard">
      <FPSGraph data={fpsHistory} />
      <GPUTimeBreakdown times={gpuTimes} />
      <MemoryGraph data={memoryHistory} />
      <DrawCallCounter />
      <TextureMemoryMonitor />
    </div>
  );
}
```
**Acceptance**: Real-time performance insights

---

#### B12. Document Performance Best Practices
**File**: `docs/performance/BEST_PRACTICES.md`
**Action**: Comprehensive performance guide
```markdown
# Performance Best Practices

## Shader Optimization
- Use `smoothstep` instead of `if` statements
- Precompute constants outside loops
- Minimize texture lookups
- Use lower precision (`mediump` on mobile)

## WebGL State Management
- Batch draw calls with same material
- Sort by material to reduce state changes
- Cache uniform values, only update when changed
- Minimize texture binds via atlasing

## Memory Management
- Dispose geometries, materials, textures on unmount
- Use object pooling for frequently created objects
- Monitor memory growth via Performance HUD
- Set aggressive garbage collection on mobile

## Audio Processing
- Use Web Audio API (hardware accelerated)
- Limit FFT size (2048 max on mobile)
- Cache frequency band calculations
- Throttle analysis updates to 60fps max

## Measurement
- Use GPU queries for accurate timing
- Profile on real devices, not just desktop
- Test with battery saver mode enabled
- Measure over 60s, not just first frame
```
**Acceptance**: Team follows best practices

---

## 🔥 WORKSTREAM C: AUDIO ANALYSIS EXTENSIONS (10 TASKS)

### Overview
Extend audio system with advanced features. Build on completed beat detector and enhanced processor.

---

#### C1. Implement Spectral Centroid Analysis
**File**: `lib/audio/spectralAnalysis.ts`
**Action**: Measure "brightness" of audio
```typescript
export function calculateSpectralCentroid(fftData: Float32Array): number {
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < fftData.length; i++) {
    const magnitude = fftData[i];
    numerator += i * magnitude;
    denominator += magnitude;
  }

  return denominator > 0 ? numerator / denominator : 0;
}

// Maps to color temperature
// High centroid = bright, warm colors
// Low centroid = dark, cool colors
```
**Acceptance**: Color shifts based on spectral content

---

#### C2. Add Onset Detection
**File**: `lib/audio/onsetDetector.ts`
**Action**: Detect sudden energy increases
```typescript
export class OnsetDetector {
  private energyHistory: number[] = [];
  private historySize = 10;

  detect(currentEnergy: number): boolean {
    this.energyHistory.push(currentEnergy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    const average = this.energyHistory.reduce((a, b) => a + b) / this.energyHistory.length;
    const threshold = average * 1.8;

    return currentEnergy > threshold;
  }
}
```
**Acceptance**: Detects music onsets accurately

---

#### C3. Implement Tempo Tracking
**File**: `lib/audio/tempoTracker.ts`
**Action**: Track tempo changes over time
```typescript
export class TempoTracker {
  private beatTimes: number[] = [];
  private windowSize = 8; // beats

  recordBeat(timestamp: number) {
    this.beatTimes.push(timestamp);
    if (this.beatTimes.length > this.windowSize) {
      this.beatTimes.shift();
    }
  }

  getCurrentTempo(): number {
    if (this.beatTimes.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < this.beatTimes.length; i++) {
      intervals.push(this.beatTimes[i] - this.beatTimes[i - 1]);
    }

    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    return (60 / avgInterval) * 1000; // BPM
  }

  getTempoStability(): number {
    if (this.beatTimes.length < 3) return 0;

    const intervals = [];
    for (let i = 1; i < this.beatTimes.length; i++) {
      intervals.push(this.beatTimes[i] - this.beatTimes[i - 1]);
    }

    const avg = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    return 1 - Math.min(1, stdDev / avg); // 0-1, 1 = very stable
  }
}
```
**Acceptance**: Tempo tracked, stability measured

---

#### C4. Add Harmonic Content Analysis
**File**: `lib/audio/harmonicAnalysis.ts`
**Action**: Detect harmonic vs. percussive content
```typescript
export function analyzeHarmonicContent(fftData: Float32Array): {
  harmonic: number;
  percussive: number;
} {
  // Simplified HPS (Harmonic Product Spectrum)
  let harmonicEnergy = 0;
  let percussiveEnergy = 0;

  for (let i = 0; i < fftData.length; i++) {
    const magnitude = fftData[i];

    // Low frequencies with sustained energy = harmonic
    if (i < fftData.length * 0.3 && magnitude > 0.5) {
      harmonicEnergy += magnitude;
    }

    // High frequencies with sharp attack = percussive
    if (i > fftData.length * 0.5 && magnitude > 0.7) {
      percussiveEnergy += magnitude;
    }
  }

  return {
    harmonic: harmonicEnergy / (fftData.length * 0.3),
    percussive: percussiveEnergy / (fftData.length * 0.5),
  };
}
```
**Acceptance**: Harmonic content affects flow style

---

#### C5. Implement Dynamic Range Compression
**File**: `lib/audio/dynamicRangeCompressor.ts`
**Action**: Compress audio dynamic range
```typescript
export class DynamicRangeCompressor {
  private threshold = 0.6;
  private ratio = 3.0; // 3:1 compression
  private attack = 0.01; // seconds
  private release = 0.1; // seconds
  private gain = 0;

  process(input: number, deltaTime: number): number {
    const envelope = Math.abs(input);

    if (envelope > this.threshold) {
      // Attack
      const target = this.threshold + (envelope - this.threshold) / this.ratio;
      const gainReduction = target / envelope;

      const attackCoef = Math.exp(-deltaTime / this.attack);
      this.gain = attackCoef * this.gain + (1 - attackCoef) * gainReduction;
    } else {
      // Release
      const releaseCoef = Math.exp(-deltaTime / this.release);
      this.gain = releaseCoef * this.gain + (1 - releaseCoef) * 1.0;
    }

    return input * this.gain;
  }
}
```
**Acceptance**: Smoother audio levels, less jarring

---

#### C6. Add Silence Detection
**File**: `lib/audio/silenceDetector.ts`
**Action**: Detect extended silence periods
```typescript
export class SilenceDetector {
  private silenceThreshold = 0.01;
  private silenceDuration = 0;
  private lastNonSilentTime = 0;

  update(audioLevel: number, currentTime: number): boolean {
    if (audioLevel < this.silenceThreshold) {
      if (this.lastNonSilentTime > 0) {
        this.silenceDuration = currentTime - this.lastNonSilentTime;
      }
      return this.silenceDuration > 3000; // 3 seconds
    } else {
      this.lastNonSilentTime = currentTime;
      this.silenceDuration = 0;
      return false;
    }
  }
}
```
**Acceptance**: Detect silence, pause unnecessary processing

---

#### C7. Implement Frequency Band Energy Tracking
**File**: `lib/audio/frequencyBandTracker.ts`
**Action**: Track energy history per band
```typescript
export class FrequencyBandTracker {
  private bassHistory: number[] = [];
  private midsHistory: number[] = [];
  private trebleHistory: number[] = [];
  private historySize = 60; // 1 second at 60fps

  record(bass: number, mids: number, treble: number) {
    this.bassHistory.push(bass);
    this.midsHistory.push(mids);
    this.trebleHistory.push(treble);

    if (this.bassHistory.length > this.historySize) {
      this.bassHistory.shift();
      this.midsHistory.shift();
      this.trebleHistory.shift();
    }
  }

  getAverages() {
    return {
      bass: this.average(this.bassHistory),
      mids: this.average(this.midsHistory),
      treble: this.average(this.trebleHistory),
    };
  }

  getPeaks() {
    return {
      bass: Math.max(...this.bassHistory),
      mids: Math.max(...this.midsHistory),
      treble: Math.max(...this.trebleHistory),
    };
  }

  private average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}
```
**Acceptance**: Historical audio context available

---

#### C8. Add Audio Event System
**File**: `lib/audio/audioEventEmitter.ts`
**Action**: Event system for audio milestones
```typescript
export class AudioEventEmitter extends EventEmitter {
  emit(event: 'beat' | 'onset' | 'drop' | 'buildup' | 'silence', data: any) {
    super.emit(event, data);
  }

  on(event: 'beat' | 'onset' | 'drop' | 'buildup' | 'silence', handler: (data: any) => void) {
    super.on(event, handler);
  }
}

// Usage:
const audioEvents = new AudioEventEmitter();
audioEvents.on('beat', (data) => {
  // Trigger visual burst
});
```
**Acceptance**: Decoupled audio events

---

#### C9. Implement Audio Recording System
**File**: `lib/audio/audioRecorder.ts`
**Action**: Record audio sessions for analysis
```typescript
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  async start(stream: MediaStream) {
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.mediaRecorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        resolve(blob);
      };

      this.mediaRecorder!.stop();
    });
  }
}
```
**Acceptance**: Can record for debugging

---

#### C10. Create Audio Analysis Visualizer
**File**: `components/liquid-light/dev/AudioAnalysisVisualizer.tsx`
**Action**: Real-time audio analysis visualization
```typescript
export function AudioAnalysisVisualizer({ audioData }: Props) {
  return (
    <div className="audio-viz">
      <FrequencySpectrum data={audioData.spectralData} />
      <WaveformDisplay data={audioData.waveform} />
      <BeatIndicator isBeat={audioData.beatDetected} />
      <TempoDisplay bpm={audioData.tempo} />
      <SpectralCentroidMeter value={audioData.spectralCentroid} />
    </div>
  );
}
```
**Acceptance**: Useful debugging tool

---

## 📝 WORKSTREAM D: COLOR SCIENCE & PALETTE EXTENSIONS (12 TASKS)

### Overview
Extend PaletteDirector with advanced color science. Build on 8 completed palettes.

---

#### D1. Add Oklab Color Space Support
**File**: `lib/palette/colorSpaces/oklab.ts`
**Action**: Implement Oklab color space
```typescript
// Oklab: perceptually uniform color space
export function sRGBToOklab(r: number, g: number, b: number): [number, number, number] {
  // Convert sRGB → linear RGB
  const lr = sRGBToLinear(r);
  const lg = sRGBToLinear(g);
  const lb = sRGBToLinear(b);

  // Linear RGB → LMS cone response
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // LMS → Oklab
  const lCube = Math.cbrt(l);
  const mCube = Math.cbrt(m);
  const sCube = Math.cbrt(s);

  return [
    0.2104542553 * lCube + 0.7936177850 * mCube - 0.0040720468 * sCube,
    1.9779984951 * lCube - 2.4285922050 * mCube + 0.4505937099 * sCube,
    0.0259040371 * lCube + 0.7827717662 * mCube - 0.8086757660 * sCube,
  ];
}

export function oklabToSRGB(L: number, a: number, b: number): [number, number, number] {
  // Inverse transform
  // (Implementation details)
}
```
**Acceptance**: Perceptually accurate color blending

---

#### D2. Implement Color Harmony Generator
**File**: `lib/palette/colorHarmony.ts`
**Action**: Generate harmonious color combinations
```typescript
export function generateComplementary(baseHue: number): number[] {
  return [baseHue, (baseHue + 180) % 360];
}

export function generateTriadic(baseHue: number): number[] {
  return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
}

export function generateAnalogous(baseHue: number): number[] {
  return [
    (baseHue - 30) % 360,
    baseHue,
    (baseHue + 30) % 360,
  ];
}

export function generateSplitComplementary(baseHue: number): number[] {
  return [
    baseHue,
    (baseHue + 150) % 360,
    (baseHue + 210) % 360,
  ];
}
```
**Acceptance**: Harmonious palettes generated

---

#### D3. Add Palette Validation
**File**: `lib/palette/paletteValidator.ts`
**Action**: Validate palette accessibility
```typescript
export function validatePalette(palette: Palette): ValidationResult {
  const issues = [];

  // Check contrast ratios
  for (let i = 0; i < palette.colors.length; i++) {
    for (let j = i + 1; j < palette.colors.length; j++) {
      const contrast = calculateContrastRatio(palette.colors[i], palette.colors[j]);
      if (contrast < 1.5) {
        issues.push(`Low contrast between color ${i} and ${j}: ${contrast.toFixed(2)}`);
      }
    }
  }

  // Check color blindness compatibility
  const deuteranopia = simulateDeuteranopia(palette);
  const protanopia = simulateProtanopia(palette);

  return {
    valid: issues.length === 0,
    issues,
    colorBlindSafe: checkColorBlindSafety(deuteranopia, protanopia),
  };
}
```
**Acceptance**: Palettes validated for accessibility

---

#### D4. Implement Palette Interpolation Modes
**File**: `lib/palette/paletteInterpolation.ts`
**Action**: Multiple interpolation methods
```typescript
export function interpolatePalettesLinear(
  p1: Palette,
  p2: Palette,
  t: number
): Palette {
  // Simple linear RGB interpolation
  const colors = p1.colors.map((c1, i) => {
    const c2 = p2.colors[i];
    return [
      c1[0] * (1 - t) + c2[0] * t,
      c1[1] * (1 - t) + c2[1] * t,
      c1[2] * (1 - t) + c2[2] * t,
    ];
  });

  return { ...p1, colors };
}

export function interpolatePalettesOklab(
  p1: Palette,
  p2: Palette,
  t: number
): Palette {
  // Perceptually uniform interpolation
  const colors = p1.colors.map((c1, i) => {
    const c2 = p2.colors[i];

    const lab1 = sRGBToOklab(...c1);
    const lab2 = sRGBToOklab(...c2);

    const labInterp = [
      lab1[0] * (1 - t) + lab2[0] * t,
      lab1[1] * (1 - t) + lab2[1] * t,
      lab1[2] * (1 - t) + lab2[2] * t,
    ];

    return oklabToSRGB(...labInterp);
  });

  return { ...p1, colors };
}
```
**Acceptance**: Smooth palette transitions

---

#### D5. Add Palette Generator from Image
**File**: `lib/palette/imageExtractor.ts`
**Action**: Extract dominant colors from image
```typescript
export async function extractPaletteFromImage(
  imageUrl: string,
  numColors: number = 4
): Promise<Palette> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  // k-means clustering to find dominant colors
  const clusters = kMeansClustering(imageData.data, numColors);

  return {
    id: `extracted-${Date.now()}`,
    name: 'Extracted Palette',
    colors: clusters.map(cluster => cluster.center),
    wavelengths: estimateWavelengths(clusters),
    culturalContext: `Extracted from ${imageUrl}`,
    energy: 'medium',
    viscosity: 0.4,
  };
}
```
**Acceptance**: Palettes from photos

---

#### D6. Implement Palette Randomizer with Constraints
**File**: `lib/palette/paletteRandomizer.ts`
**Action**: Generate random palettes with constraints
```typescript
export function generateRandomPalette(constraints: {
  minSaturation?: number;
  maxSaturation?: number;
  minLightness?: number;
  maxLightness?: number;
  harmonyType?: 'complementary' | 'triadic' | 'analogous';
}): Palette {
  const baseHue = Math.random() * 360;
  const hues = constraints.harmonyType === 'triadic'
    ? generateTriadic(baseHue)
    : generateComplementary(baseHue);

  const colors = hues.map(hue => {
    const saturation = randomInRange(
      constraints.minSaturation ?? 0.5,
      constraints.maxSaturation ?? 1.0
    );
    const lightness = randomInRange(
      constraints.minLightness ?? 0.4,
      constraints.maxLightness ?? 0.8
    );

    return hslToRgb(hue, saturation, lightness);
  });

  return {
    id: `random-${Date.now()}`,
    name: 'Random Palette',
    colors,
    wavelengths: colors.map(c => estimateWavelength(c)),
    culturalContext: 'Randomly generated',
    energy: 'medium',
    viscosity: 0.4,
  };
}
```
**Acceptance**: Aesthetically pleasing random palettes

---

#### D7. Add Palette History & Favorites
**File**: `lib/palette/paletteHistory.ts`
**Action**: Track user palette history
```typescript
export class PaletteHistory {
  private history: string[] = [];
  private favorites: Set<string> = new Set();
  private maxHistory = 20;

  record(paletteId: string) {
    this.history.unshift(paletteId);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    this.save();
  }

  toggleFavorite(paletteId: string) {
    if (this.favorites.has(paletteId)) {
      this.favorites.delete(paletteId);
    } else {
      this.favorites.add(paletteId);
    }

    this.save();
  }

  getHistory(): string[] {
    return this.history;
  }

  getFavorites(): string[] {
    return Array.from(this.favorites);
  }

  private save() {
    localStorage.setItem('paletteHistory', JSON.stringify({
      history: this.history,
      favorites: Array.from(this.favorites),
    }));
  }

  private load() {
    const data = localStorage.getItem('paletteHistory');
    if (data) {
      const parsed = JSON.parse(data);
      this.history = parsed.history;
      this.favorites = new Set(parsed.favorites);
    }
  }
}
```
**Acceptance**: User palette preferences saved

---

#### D8. Implement Color Blindness Simulation
**File**: `lib/palette/colorBlindness.ts`
**Action**: Simulate color blindness
```typescript
export function simulateDeuteranopia(color: [number, number, number]): [number, number, number] {
  // Deuteranopia (red-green blindness)
  const [r, g, b] = color;

  return [
    0.625 * r + 0.375 * g,
    0.7 * g + 0.3 * r,
    b,
  ];
}

export function simulateProtanopia(color: [number, number, number]): [number, number, number] {
  // Protanopia (red blindness)
  const [r, g, b] = color;

  return [
    0.567 * r + 0.433 * g,
    0.558 * g + 0.442 * r,
    b,
  ];
}

export function simulateTritanopia(color: [number, number, number]): [number, number, number] {
  // Tritanopia (blue-yellow blindness)
  const [r, g, b] = color;

  return [
    r,
    g,
    0.95 * g + 0.05 * b,
  ];
}
```
**Acceptance**: Color blind preview mode

---

#### D9. Add Palette Export Formats
**File**: `lib/palette/paletteExporter.ts`
**Action**: Export palettes to various formats
```typescript
export function exportToASE(palette: Palette): Blob {
  // Adobe Swatch Exchange format
  // (Binary format implementation)
}

export function exportToGPL(palette: Palette): string {
  // GIMP Palette format
  let gpl = `GIMP Palette\nName: ${palette.name}\nColumns: ${palette.colors.length}\n#\n`;

  for (const color of palette.colors) {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);
    gpl += `${r.toString().padStart(3)} ${g.toString().padStart(3)} ${b.toString().padStart(3)} Untitled\n`;
  }

  return gpl;
}

export function exportToCSS(palette: Palette): string {
  let css = `:root {\n`;
  palette.colors.forEach((color, i) => {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);
    css += `  --palette-color-${i + 1}: rgb(${r}, ${g}, ${b});\n`;
  });
  css += `}\n`;
  return css;
}
```
**Acceptance**: Palettes usable in external tools

---

#### D10. Implement Palette Animation System
**File**: `lib/palette/paletteAnimator.ts`
**Action**: Animate palette transitions
```typescript
export class PaletteAnimator {
  private currentPalette: Palette;
  private targetPalette: Palette | null = null;
  private progress = 0;
  private duration = 2000; // ms

  transitionTo(newPalette: Palette, duration?: number) {
    this.targetPalette = newPalette;
    this.progress = 0;
    if (duration) this.duration = duration;
  }

  update(deltaTime: number): Palette {
    if (!this.targetPalette) {
      return this.currentPalette;
    }

    this.progress += deltaTime / this.duration;

    if (this.progress >= 1) {
      this.currentPalette = this.targetPalette;
      this.targetPalette = null;
      this.progress = 0;
      return this.currentPalette;
    }

    // Smooth easing
    const t = this.easeInOutCubic(this.progress);

    return interpolatePalettesOklab(this.currentPalette, this.targetPalette, t);
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
```
**Acceptance**: Smooth palette transitions

---

#### D11. Add Palette Mood Analysis
**File**: `lib/palette/paletteMoodAnalyzer.ts`
**Action**: Analyze emotional character of palette
```typescript
export function analyzePaletteMood(palette: Palette): {
  energy: number; // 0-1
  warmth: number; // -1 to 1 (cool to warm)
  brightness: number; // 0-1
  contrast: number; // 0-1
  mood: string;
} {
  const avgHue = palette.colors.reduce((sum, c) => sum + rgbToHue(c), 0) / palette.colors.length;
  const avgSaturation = palette.colors.reduce((sum, c) => sum + rgbToSaturation(c), 0) / palette.colors.length;
  const avgLightness = palette.colors.reduce((sum, c) => sum + rgbToLightness(c), 0) / palette.colors.length;

  const warmth = (avgHue < 60 || avgHue > 300) ? 0.5 : -0.5; // Red/orange = warm, blue/green = cool
  const energy = avgSaturation;
  const brightness = avgLightness;

  // Calculate contrast
  const contrasts = [];
  for (let i = 0; i < palette.colors.length; i++) {
    for (let j = i + 1; j < palette.colors.length; j++) {
      contrasts.push(calculateContrastRatio(palette.colors[i], palette.colors[j]));
    }
  }
  const contrast = contrasts.reduce((a, b) => a + b) / contrasts.length / 21; // Normalize to 0-1

  // Determine mood
  let mood = '';
  if (energy > 0.7 && warmth > 0) mood = 'Energetic & Warm';
  else if (energy > 0.7 && warmth < 0) mood = 'Energetic & Cool';
  else if (energy < 0.3 && warmth > 0) mood = 'Calm & Warm';
  else if (energy < 0.3 && warmth < 0) mood = 'Calm & Cool';
  else mood = 'Balanced';

  return { energy, warmth, brightness, contrast, mood };
}
```
**Acceptance**: Mood tags help users find palettes

---

#### D12. Create Palette Recommendation System
**File**: `lib/palette/paletteRecommender.ts`
**Action**: Recommend palettes based on context
```typescript
export function recommendPalettes(context: {
  time?: 'day' | 'night';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  mood?: 'energetic' | 'calm' | 'mysterious';
  song?: string;
}): Palette[] {
  const allPalettes = PaletteDirector.getAllPalettes();
  const scored = allPalettes.map(palette => {
    let score = 0;

    // Time-based scoring
    if (context.time === 'night') {
      const mood = analyzePaletteMood(palette);
      score += (1 - mood.brightness) * 2; // Prefer darker at night
    }

    // Mood matching
    if (context.mood === 'energetic' && palette.energy === 'high') {
      score += 3;
    }

    // Song matching
    if (context.song && palette.id.includes(context.song.toLowerCase())) {
      score += 5; // Strong preference for song-specific palettes
    }

    return { palette, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.palette);
}
```
**Acceptance**: Contextual recommendations

---

## 🎨 WORKSTREAM E: CULTURAL AUTHENTICITY FEATURES (10 TASKS)

### Overview
Features that honor the Joshua Light Show and Grateful Dead cultural heritage.

---

#### E1. Create Historical Timeline Component
**File**: `components/cultural/HistoricalTimeline.tsx`
**Action**: Interactive timeline of liquid light history
```typescript
export function HistoricalTimeline() {
  const events = [
    { year: 1967, event: 'Joshua Light Show founded', description: '...' },
    { year: 1968, event: 'Fillmore East residency begins', description: '...' },
    { year: 1969, event: 'Woodstock performance', description: '...' },
    // ... more events
  ];

  return (
    <div className="timeline">
      {events.map(e => (
        <TimelineEvent key={e.year} {...e} />
      ))}
    </div>
  );
}
```
**Acceptance**: Educational, culturally accurate

---

#### E2. Implement Song-Specific Visual Modes
**File**: `lib/visual/songModes.ts`
**Action**: Map songs to visual configurations
```typescript
export const SONG_MODES = {
  'dark-star': {
    palette: 'dark-star',
    intensity: 0.9,
    thermalRate: 'high',
    effects: ['thinFilm', 'bloom', 'kaleidoscope'],
    duration: 'extended-jam', // Long transitions
  },
  'fire-on-the-mountain': {
    palette: 'fire-on-the-mountain',
    intensity: 1.0,
    thermalRate: 'ultra',
    effects: ['thinFilm', 'heatHaze', 'particles'],
    duration: 'energetic',
  },
  // ... more songs
};
```
**Acceptance**: Songs have distinct visual character

---

#### E3. Add Cultural Context Tooltips
**File**: `components/cultural/CulturalTooltip.tsx`
**Action**: Educational tooltips explaining cultural significance
```typescript
export function CulturalTooltip({ paletteId }: Props) {
  const palette = PaletteDirector.getPalette(paletteId);

  return (
    <Tooltip>
      <div className="cultural-context">
        <h4>{palette.name}</h4>
        <p>{palette.culturalContext}</p>
        <a href={`/learn/${paletteId}`}>Learn more</a>
      </div>
    </Tooltip>
  );
}
```
**Acceptance**: Users learn cultural significance

---

#### E4. Implement "Authentic 60s Mode"
**File**: `lib/visual/authentic60sMode.ts`
**Action**: Constrain effects to 1960s-era aesthetics
```typescript
export function apply60sConstraints(config: VisualConfig): VisualConfig {
  return {
    ...config,
    // No modern digital effects
    kaleidoscope: false,
    chromaticAberration: false,

    // Enhance analog-style effects
    filmGrain: true,
    colorShift: true,
    flickering: true,

    // Limit color palettes to authentic sources
    palettesAllowed: [
      'classic-60s',
      'grateful-dead',
      'joshua-light-show',
    ],
  };
}
```
**Acceptance**: Historically accurate aesthetic option

---

#### E5. Create Venue-Specific Presets
**File**: `lib/visual/venuePresets.ts`
**Action**: Visual configs matching famous venues
```typescript
export const VENUE_PRESETS = {
  'fillmore-east': {
    palette: 'joshua-light-show',
    aspectRatio: '4:3', // Projection screen
    intensity: 0.8,
    vignette: true,
  },
  'winterland': {
    palette: 'grateful-dead',
    aspectRatio: '16:9',
    intensity: 0.9,
  },
  // ... more venues
};
```
**Acceptance**: Venue context enhances experience

---

#### E6. Implement Dead Show Setlist Integration
**File**: `lib/cultural/setlistIntegration.ts`
**Action**: Auto-switch palettes based on setlist
```typescript
export async function fetchSetlist(showDate: string): Promise<Song[]> {
  // Fetch from archive.org or similar
  const response = await fetch(`https://api.setlist.fm/grateful-dead/${showDate}`);
  return response.json();
}

export function createSetlistVisualSequence(setlist: Song[]): VisualSequence {
  return setlist.map(song => ({
    song: song.title,
    palette: mapSongToPalette(song.title),
    duration: song.duration,
    transition: 'smooth',
  }));
}
```
**Acceptance**: Live show simulation

---

#### E7. Add Deadhead Terminology Glossary
**File**: `components/cultural/Glossary.tsx`
**Action**: In-app glossary of cultural terms
```typescript
export const GLOSSARY = {
  'Dark Star': 'Signature Grateful Dead jam song, known for extended improvisation...',
  'Terrapin Station': 'Epic suite from 1977 album...',
  'Joshua Light Show': 'Pioneering liquid light show collective...',
  // ... more terms
};

export function Glossary() {
  return (
    <div className="glossary">
      {Object.entries(GLOSSARY).map(([term, definition]) => (
        <GlossaryEntry key={term} term={term} definition={definition} />
      ))}
    </div>
  );
}
```
**Acceptance**: Newcomers learn terminology

---

#### E8. Create "Show Me" Educational Mode
**File**: `components/cultural/EducationalMode.tsx`
**Action**: Guided tour of effects
```typescript
export function EducationalMode() {
  const steps = [
    {
      title: 'Wavelength Physics',
      demo: () => showWavelengthSpectrum(),
      explanation: 'Colors in liquid light come from wavelengths...',
    },
    {
      title: 'Thin-Film Interference',
      demo: () => enableThinFilm(),
      explanation: 'Like oil on water, light waves interfere...',
    },
    // ... more steps
  ];

  return <GuidedTour steps={steps} />;
}
```
**Acceptance**: Educational and engaging

---

#### E9. Implement Community Submissions
**File**: `lib/cultural/communityPalettes.ts`
**Action**: System for user-submitted palettes
```typescript
export interface CommunityPalette extends Palette {
  author: string;
  upvotes: number;
  verified: boolean; // Culturally authentic
}

export async function submitPalette(palette: CommunityPalette): Promise<void> {
  // Validate
  // Submit to backend
  // Moderate for cultural appropriateness
}

export async function fetchCommunityPalettes(): Promise<CommunityPalette[]> {
  const response = await fetch('/api/community-palettes');
  return response.json();
}
```
**Acceptance**: Community participation

---

#### E10. Add Attribution System
**File**: `components/cultural/Attribution.tsx`
**Action**: Proper credit to original artists
```typescript
export function Attribution() {
  return (
    <div className="attribution">
      <h3>Cultural Heritage</h3>
      <p>This project honors:</p>
      <ul>
        <li>Joshua Light Show (1967-present)</li>
        <li>Grateful Dead (1965-1995)</li>
        <li>Fillmore East</li>
        <li>Liquid light artists worldwide</li>
      </ul>
      <p>Educational use only. Not affiliated with official organizations.</p>
    </div>
  );
}
```
**Acceptance**: Respectful attribution

---

*(Continuing with remaining workstreams...)*

---

## SUMMARY OF REMAINING WORKSTREAMS

Due to length, I'll summarize the remaining workstreams. Each would have 8-12 detailed tasks:

### **WORKSTREAM F: ACCESSIBILITY & INCLUSION (8 TASKS)**
- Screen reader support for visual controls
- Keyboard navigation for all features
- High contrast mode
- Motion sickness warnings
- Alternative non-visual representations
- Text descriptions of visual states
- ARIA labels
- Accessibility testing suite

### **WORKSTREAM G: WEBGPU EXPERIMENTAL LAYER (12 TASKS)**
- WebGPU capability detection
- Compute shader particle system
- GPU fluid simulation
- Advanced lighting model
- Performance comparison vs WebGL
- Graceful fallback to WebGL
- Feature flagging system
- Documentation

### **WORKSTREAM H: ADVANCED TESTING (10 TASKS)**
- Visual regression tests
- Golden image generation
- Deterministic frame rendering
- Cross-browser testing
- Performance benchmarking
- A/B test infrastructure
- Error tracking
- Analytics integration

### **WORKSTREAM I: EDUCATIONAL CONTENT (10 TASKS)**
- Physics tutorials
- Color science explainers
- Audio reactivity guide
- Cultural history articles
- Video tutorials
- Interactive demos
- API documentation
- Case studies

### **WORKSTREAM J: MATHEMATICAL UTILITIES (11 TASKS)**
- Advanced easing functions
- Noise generation (Perlin, Simplex)
- Spline interpolation
- Matrix operations
- Quaternion math
- Signal processing utilities
- Statistical analysis
- Geometry helpers

### **WORKSTREAM K: FINAL POLISH (10 TASKS)**
- Code cleanup
- Performance final pass
- Documentation review
- User testing
- Bug fixes
- Production optimizations
- Release preparation
- Post-launch monitoring

---

## 📊 SUMMARY

**Total Tasks**: 120
**Duration**: 6 weeks (Weeks 3-6)
**Focus Areas**: Physics, GLSL, audio, color science, performance
**Status**: Ready to execute

**Dependencies**:
- Codex integration (Weeks 2-4)
- Cursor testing (ongoing)
- User feedback (Week 5+)

**Success Metrics**:
- All shader effects operational
- Performance maintained (≥55 FPS)
- Cultural authenticity validated
- Educational content complete
- Production-ready polish

---

**LET'S BUILD THE MOST AUTHENTIC LIQUID LIGHT EXPERIENCE ON THE WEB!** 🚀

---

**End of Claude Code Mega Workload**

*Execution begins immediately after Codex integration.*
