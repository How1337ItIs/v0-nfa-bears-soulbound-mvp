# CURSOR PHASE 2: MEGA WORKLOAD - Integration & Polish

**Created**: 2025-10-29
**Target Completion**: 2025-12-10 (6 weeks)
**Scope**: 110 tasks across 10 workstreams
**Status**: Phase 1 complete (8 workstreams ✅), Phase 2 beginning

---

## 🎉 PHASE 1 ACHIEVEMENTS SUMMARY

**Outstanding work!** You've delivered:
- ✅ 8 complete workstreams
- ✅ Comprehensive testing (80%+ coverage)
- ✅ 12 documentation files
- ✅ Production-ready infrastructure
- ✅ Complete orchestration system
- ✅ Performance optimization framework

**Your strengths demonstrated**:
- Integration excellence
- Testing infrastructure
- Documentation quality
- Code quality tools
- Systematic execution

---

## 🎯 PHASE 2 MISSION

**Integrate and polish** the advanced work from Claude Code and Codex:

**Claude Code delivered** (Weeks 1-2):
- ✅ 6 new shader effects (thin-film variants, shimmer, flow field, chromatic aberration, kaleidoscope, vignette)
- ✅ Beat detector with BPM estimation
- ✅ Enhanced audio processor (curves, smoothing, beat gating)
- ✅ Performance tools (GPU profiler, frame budget analyzer, memory leak detector)
- ✅ Quality presets for thin-film (emergency, mobile, desktop, ultra)

**Codex will deliver** (Weeks 2-4):
- Orchestrator integration
- Thin-film mounting
- Audio pipeline wiring
- Palette expansion (3 new palettes)
- QA infrastructure

**Your Phase 2 Mission**:
- Integrate all new shader effects
- Test performance optimizations
- Build cultural features
- Create educational content
- Enhance accessibility
- Production polish
- Visual regression testing
- Cross-browser compatibility
- Mobile optimization
- Final QA

---

## 📋 WORKSTREAM OVERVIEW

| ID | Workstream | Tasks | Priority | Dependencies |
|----|-----------|-------|----------|--------------|
| **W1** | Shader Effects Integration | 15 | 🔥 CRITICAL | Claude Code |
| **W2** | Performance Integration & Testing | 12 | ⚡ CRITICAL | Claude Code |
| **W3** | Audio System Integration | 10 | 🔥 HIGH | Claude Code |
| **W4** | Visual Regression Testing | 12 | 🧪 HIGH | W1 |
| **W5** | Cultural Features | 12 | 🎨 MEDIUM | Codex |
| **W6** | Accessibility Enhancements | 10 | ♿ MEDIUM | None |
| **W7** | Educational Content | 10 | 📚 MEDIUM | None |
| **W8** | Cross-Browser Testing | 10 | 🧪 MEDIUM | W1, W2 |
| **W9** | Mobile Optimization | 9 | 📱 HIGH | W1, W2 |
| **W10** | Production Polish | 10 | ✨ HIGH | All |

**Total**: 110 tasks

---

## 🔥 WORKSTREAM W1: SHADER EFFECTS INTEGRATION (15 TASKS)

### Overview
Integrate Claude Code's 6 new shader effects into the orchestrator and create comprehensive testing.

---

#### W1.1. Test Thin-Film Quality Presets
**Files to Review**:
- `lib/post/thinFilmQualityPresets.ts` (Claude Code created)
- `lib/post/ThinFilmPass.tsx` (updated with quality support)

**Action**: Create integration test for all 4 quality levels
```typescript
// __tests__/integration/thinFilmQuality.test.tsx
describe('Thin-Film Quality Presets', () => {
  test('emergency quality renders 1 interference order', () => {
    render(<AuthenticThinFilmEffect quality="emergency" />);
    // Verify uniform uInterferenceOrders === 1
  });

  test('mobile quality renders 2 interference orders', () => {
    render(<AuthenticThinFilmEffect quality="mobile" />);
    // Verify uniform === 2
  });

  test('desktop quality renders 3 interference orders', () => {
    render(<AuthenticThinFilmEffect quality="desktop" />);
    // Verify uniform === 3
  });

  test('ultra quality renders 4 interference orders', () => {
    render(<AuthenticThinFilmEffect quality="ultra" />);
    // Verify uniform === 4
  });

  test('quality auto-selects based on tier', () => {
    // tier='medium' → quality='mobile'
    // tier='high' → quality='desktop'
    // tier='ultra' → quality='ultra'
  });
});
```
**Acceptance**: All quality levels tested, presets work correctly

---

#### W1.2. Test Shimmer Effect
**Files to Review**:
- `lib/post/ShimmerPass.tsx` (Claude Code created)

**Action**: Create tests and performance benchmarks
```typescript
test('shimmer effect renders on edges', () => {
  render(<ShimmerPass enabled={true} />);
  // Verify Fresnel glow visible at edges
});

test('shimmer responds to palette changes', () => {
  const { rerender } = render(<ShimmerPass paletteId="dark-star" />);
  // Change palette
  rerender(<ShimmerPass paletteId="fire-on-the-mountain" />);
  // Verify shimmer colors updated
});

test('shimmer performance <2ms GPU time', async () => {
  const gpuTime = await measureGPUTime(<ShimmerPass />);
  expect(gpuTime).toBeLessThan(2);
});
```
**Acceptance**: Shimmer tested, performance validated

---

#### W1.3. Test Flow Field Distortion
**Files to Review**:
- `lib/post/FlowFieldPass.tsx` (Claude Code created)

**Action**: Test organic distortion behavior
```typescript
test('flow field distorts based on audio energy', () => {
  const lowEnergy = { splatForce: 8, thermalRate: 2 };
  const highEnergy = { splatForce: 23, thermalRate: 8 };

  const { rerender } = render(<FlowFieldPass audioParams={lowEnergy} />);
  const lowDistortion = getUVDistortion();

  rerender(<FlowFieldPass audioParams={highEnergy} />);
  const highDistortion = getUVDistortion();

  expect(highDistortion).toBeGreaterThan(lowDistortion);
});
```
**Acceptance**: Flow field audio-reactive, distortion visible

---

#### W1.4. Test Chromatic Aberration
**Files to Review**:
- `lib/post/ChromaticAberrationPass.tsx` (Claude Code created)

**Action**: Test RGB channel split
```typescript
test('chromatic aberration splits RGB channels', () => {
  render(<ChromaticAberrationPass offset={0.005} />);
  // Verify red/blue channels offset
});

test('aberration responsive to audio', () => {
  const audio = { globalIntensity: 1.0 };
  render(<ChromaticAberrationPass audioParams={audio} />);
  // Verify offset increases with intensity
});
```
**Acceptance**: Aberration tested, audio reactivity works

---

#### W1.5. Test Kaleidoscope Mode
**Files to Review**:
- `lib/post/KaleidoscopePass.tsx` (Claude Code created)

**Action**: Test symmetry and trip mode integration
```typescript
test('kaleidoscope creates 6-way symmetry', () => {
  render(<KaleidoscopePass sections={6} />);
  // Verify mirroring across 6 sections
});

test('kaleidoscope only enabled in trip mode', () => {
  const { rerender } = render(<LiquidLightBackground mode="ambient" />);
  expect(screen.queryByTestId('kaleidoscope')).not.toBeInTheDocument();

  rerender(<LiquidLightBackground mode="trip" />);
  expect(screen.getByTestId('kaleidoscope')).toBeInTheDocument();
});
```
**Acceptance**: Kaleidoscope tested, trip mode exclusive

---

#### W1.6. Test Vignette Effect
**Files to Review**:
- `lib/post/VignettePass.tsx` (Claude Code created)

**Action**: Test edge darkening
```typescript
test('vignette darkens edges', () => {
  render(<VignettePass intensity={0.8} />);
  // Verify edges darker than center
});

test('vignette intensity adjustable', () => {
  const { rerender } = render(<VignettePass intensity={0.5} />);
  const lowVignette = getEdgeBrightness();

  rerender(<VignettePass intensity={0.9} />);
  const highVignette = getEdgeBrightness();

  expect(highVignette).toBeLessThan(lowVignette);
});
```
**Acceptance**: Vignette tested, adjustable

---

#### W1.7. Create Shader Effect Preset System
**File**: `components/liquid-light/ShaderPresets.tsx`
**Action**: UI to select shader effect combinations
```typescript
export const SHADER_PRESETS = {
  minimal: {
    thinFilm: true,
    shimmer: false,
    flowField: false,
    chromatic: false,
    kaleidoscope: false,
    vignette: false,
  },
  classic: {
    thinFilm: true,
    shimmer: true,
    flowField: false,
    chromatic: true,
    kaleidoscope: false,
    vignette: true,
  },
  intense: {
    thinFilm: true,
    shimmer: true,
    flowField: true,
    chromatic: true,
    kaleidoscope: false,
    vignette: true,
  },
  trip: {
    thinFilm: true,
    shimmer: true,
    flowField: true,
    chromatic: true,
    kaleidoscope: true,
    vignette: false,
  },
};

export function ShaderPresetSelector({ onChange }) {
  return (
    <select onChange={(e) => onChange(SHADER_PRESETS[e.target.value])}>
      <option value="minimal">Minimal</option>
      <option value="classic">Classic</option>
      <option value="intense">Intense</option>
      <option value="trip">Trip Mode</option>
    </select>
  );
}
```
**Acceptance**: Preset selector functional, combinations tested

---

#### W1.8. Integrate All Effects into EffectComposer
**File**: Update `lib/post/ThinFilmPass.tsx` or create new composer
**Action**: Wire all effects together
```typescript
export function ComprehensiveEffectComposer({ effects, audioParams, ...props }) {
  return (
    <EffectComposer>
      {effects.vignette && <VignettePass />}
      {effects.flowField && <FlowFieldPass audioParams={audioParams} />}
      {effects.thinFilm && <ThinFilmPass audioParams={audioParams} />}
      {effects.shimmer && <ShimmerPass />}
      {effects.chromatic && <ChromaticAberrationPass audioParams={audioParams} />}
      {effects.kaleidoscope && <KaleidoscopePass audioParams={audioParams} />}
    </EffectComposer>
  );
}
```
**Acceptance**: All effects render together, no conflicts

---

#### W1.9. Test Effect Stacking Order
**File**: Test file
**Action**: Verify rendering order produces intended result
```typescript
test('effects render in correct order', () => {
  // Order should be: vignette → flow field → thin-film → shimmer → chromatic → kaleidoscope
  const effects = {
    vignette: true,
    flowField: true,
    thinFilm: true,
    shimmer: true,
    chromatic: true,
    kaleidoscope: false,
  };

  render(<ComprehensiveEffectComposer effects={effects} />);

  // Verify order via render tree inspection
});
```
**Acceptance**: Effect order correct

---

#### W1.10. Create Effect Performance Comparison Chart
**File**: `docs/performance/SHADER_EFFECTS_BENCHMARK.md`
**Action**: Document performance of each effect
```markdown
# Shader Effects Performance Benchmark

| Effect | GPU Time (Desktop) | GPU Time (Mobile) | Memory | Tier Recommendation |
|--------|-------------------|-------------------|--------|---------------------|
| Thin-Film (2 orders) | 3.5ms | 6.8ms | 8MB | Medium+ |
| Thin-Film (3 orders) | 5.5ms | N/A | 16MB | High+ |
| Thin-Film (4 orders) | 8.0ms | N/A | 32MB | Ultra only |
| Shimmer | 1.5ms | 2.2ms | 2MB | All tiers |
| Flow Field | 2.0ms | 3.5ms | 4MB | Medium+ |
| Chromatic Aberration | 0.8ms | 1.0ms | <1MB | All tiers |
| Kaleidoscope | 3.0ms | 5.0ms | 2MB | High+ |
| Vignette | 0.5ms | 0.7ms | <1MB | All tiers |

## Recommended Combinations

### Mobile (Medium Tier)
- Thin-Film (2 orders)
- Chromatic Aberration
- Vignette
**Total**: ~8ms

### Desktop (High Tier)
- Thin-Film (3 orders)
- Shimmer
- Flow Field
- Chromatic Aberration
- Vignette
**Total**: ~13ms

### Desktop (Ultra Tier)
- Thin-Film (4 orders)
- Shimmer
- Flow Field
- Chromatic Aberration
- Kaleidoscope
**Total**: ~16ms
```
**Acceptance**: Performance characteristics documented

---

#### W1.11. Add Effect Toggle Controls to UI
**File**: `components/liquid-light/controls/EffectToggles.tsx`
**Action**: Create UI for individual effect toggles
```typescript
export function EffectToggles({ effects, onChange }) {
  return (
    <div className="effect-toggles">
      <h3>Visual Effects</h3>
      <label>
        <input type="checkbox" checked={effects.thinFilm} onChange={() => onChange('thinFilm')} />
        Thin-Film Interference
      </label>
      <label>
        <input type="checkbox" checked={effects.shimmer} onChange={() => onChange('shimmer')} />
        Iridescent Shimmer
      </label>
      <label>
        <input type="checkbox" checked={effects.flowField} onChange={() => onChange('flowField')} />
        Flow Field Distortion
      </label>
      {/* ... more toggles */}
    </div>
  );
}
```
**Acceptance**: Users can toggle effects individually

---

#### W1.12. Create Effect Preset Animations
**File**: `lib/visual/effectPresetAnimations.ts`
**Action**: Animate transitions between presets
```typescript
export function animatePresetTransition(
  from: ShaderPreset,
  to: ShaderPreset,
  duration: number = 1000
): void {
  // Fade out effects not in 'to'
  // Fade in effects in 'to'
  // Use CSS transitions or spring animations
}
```
**Acceptance**: Smooth preset transitions

---

#### W1.13. Test Effect Memory Usage
**File**: `__tests__/performance/effectMemoryUsage.test.ts`
**Action**: Verify no memory leaks when toggling effects
```typescript
test('toggling effects does not leak memory', async () => {
  const initial = getMemoryUsage();

  // Toggle effects 20 times
  for (let i = 0; i < 20; i++) {
    enableEffect('shimmer');
    await wait(100);
    disableEffect('shimmer');
    await wait(100);
  }

  const final = getMemoryUsage();
  expect(final - initial).toBeLessThan(5 * 1024 * 1024); // 5MB tolerance
});
```
**Acceptance**: No memory leaks

---

#### W1.14. Document Effect Integration Patterns
**File**: `docs/development/SHADER_EFFECT_INTEGRATION.md`
**Action**: Create integration guide
```markdown
# Shader Effect Integration Guide

## Adding a New Effect

1. Create effect file: `lib/post/YourEffect.tsx`
2. Extend R3F Effect class
3. Define GLSL shader
4. Create React component wrapper
5. Export from module

## Integration Checklist

- [ ] Effect extends R3F Effect class
- [ ] Shader uniforms documented
- [ ] Performance benchmarked
- [ ] Tests created (render, performance, memory)
- [ ] Added to ComprehensiveEffectComposer
- [ ] Documented in SHADER_EFFECTS_BENCHMARK.md
- [ ] User controls added to UI
- [ ] Preset included in SHADER_PRESETS

## Example

\`\`\`typescript
import { Effect } from '@react-three/postprocessing';

const shader = \`
  uniform float uIntensity;
  void mainImage(...) {
    // Shader logic
  }
\`;

class MyEffect extends Effect {
  constructor() {
    super('MyEffect', shader, {
      uniforms: new Map([['uIntensity', new THREE.Uniform(0.5)]]),
    });
  }
}
\`\`\`
```
**Acceptance**: Integration pattern documented

---

#### W1.15. Create Effect Showcase Page
**File**: `app/effects-showcase/page.tsx`
**Action**: Demo page showing each effect
```typescript
export default function EffectsShowcase() {
  const [currentEffect, setCurrentEffect] = useState('thin-film');

  const effects = {
    'thin-film': <ThinFilmPass />,
    'shimmer': <ShimmerPass />,
    'flow-field': <FlowFieldPass />,
    'chromatic': <ChromaticAberrationPass />,
    'kaleidoscope': <KaleidoscopePass />,
    'vignette': <VignettePass />,
  };

  return (
    <div>
      <h1>Shader Effects Showcase</h1>
      <select onChange={(e) => setCurrentEffect(e.target.value)}>
        {Object.keys(effects).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <Canvas>
        {effects[currentEffect]}
      </Canvas>

      <EffectDescription effect={currentEffect} />
      <PerformanceStats effect={currentEffect} />
    </div>
  );
}
```
**Acceptance**: Interactive showcase page

---

## ⚡ WORKSTREAM W2: PERFORMANCE INTEGRATION & TESTING (12 TASKS)

### Overview
Integrate Claude Code's performance tools and create comprehensive performance test suite.

---

#### W2.1. Integrate GPU Profiler
**Files to Review**:
- `lib/performance/gpuProfiler.ts` (Claude Code created)

**Action**: Wire into render loop
```typescript
// In LiquidLightBackground.tsx
const gpuProfilerRef = useRef<GPUProfiler | null>(null);

useEffect(() => {
  const gl = getWebGLContext();
  gpuProfilerRef.current = createGPUProfiler(gl);

  return () => {
    gpuProfilerRef.current?.dispose();
  };
}, []);

useFrame(() => {
  if (!gpuProfilerRef.current) return;

  gpuProfilerRef.current.startQuery('webgl-fluid');
  renderFluidSimulation();
  gpuProfilerRef.current.endQuery();

  gpuProfilerRef.current.collectResults();
});
```
**Acceptance**: GPU profiler functional

---

#### W2.2. Integrate Frame Budget Analyzer
**Files to Review**:
- `lib/performance/frameBudget.ts` (Claude Code created)

**Action**: Add budget tracking to render pipeline
```typescript
const budgetRef = useRef(new FrameBudgetAnalyzer(60));

useFrame(() => {
  budgetRef.current.resetFrame();

  budgetRef.current.measure('audio-processing', () => {
    processAudio();
  });

  budgetRef.current.measure('physics-calc', () => {
    calculatePhysics();
  });

  budgetRef.current.measure('webgl-render', () => {
    renderWebGL();
  });

  const report = budgetRef.current.getReport();
  if (report.overBudget) {
    console.warn('[Budget] Over budget:', report.total.toFixed(2), 'ms');
  }
});
```
**Acceptance**: Budget tracking active

---

#### W2.3. Integrate Memory Leak Detector
**Files to Review**:
- `lib/performance/memoryLeakDetector.ts` (Claude Code created)

**Action**: Track WebGL resources
```typescript
import { globalMemoryLeakDetector } from '@/lib/performance/memoryLeakDetector';

// When creating textures
const texture = gl.createTexture();
globalMemoryLeakDetector?.track('texture', texture, 'fluid-dye-texture');

// When disposing
gl.deleteTexture(texture);
globalMemoryLeakDetector?.untrack('texture', texture);

// Periodic leak checks
useEffect(() => {
  const interval = setInterval(() => {
    globalMemoryLeakDetector?.checkLeaks();
  }, 30000); // Every 30s

  return () => clearInterval(interval);
}, []);
```
**Acceptance**: Memory leaks detected

---

#### W2.4. Create Performance Dashboard
**File**: `components/liquid-light/dev/PerformanceDashboard.tsx`
**Action**: Comprehensive performance visualization
```typescript
export function PerformanceDashboard() {
  const [gpuStats, setGpuStats] = useState<Map<string, GPUProfileStats>>(new Map());
  const [budgetReport, setBudgetReport] = useState<FrameBudgetReport | null>(null);
  const [memoryLeaks, setMemoryLeaks] = useState<LeakReport | null>(null);

  return (
    <div className="perf-dashboard">
      <section>
        <h2>GPU Time Breakdown</h2>
        <GPUTimeChart stats={gpuStats} />
      </section>

      <section>
        <h2>Frame Budget</h2>
        <BudgetBreakdown report={budgetReport} />
      </section>

      <section>
        <h2>Memory Leaks</h2>
        <LeakReport leaks={memoryLeaks} />
      </section>
    </div>
  );
}
```
**Acceptance**: Comprehensive dashboard

---

#### W2.5. Create Automated Performance Tests
**File**: `__tests__/performance/automated.test.ts`
**Action**: CI-compatible performance tests
```typescript
test('full pipeline maintains 55+ FPS on desktop-class hardware', async () => {
  const fps = await measureFPS({ duration: 10000, tier: 'high' });
  expect(fps).toBeGreaterThan(55);
});

test('mobile tier maintains 45+ FPS', async () => {
  const fps = await measureFPS({ duration: 10000, tier: 'medium', mobile: true });
  expect(fps).toBeGreaterThan(45);
});

test('emergency quality maintains 30+ FPS', async () => {
  const fps = await measureFPS({ duration: 5000, quality: 'emergency' });
  expect(fps).toBeGreaterThan(30);
});
```
**Acceptance**: Automated perf tests pass

---

#### W2.6. Create Performance Regression Detection
**File**: `scripts/perf-regression-check.ts`
**Action**: Compare performance vs baseline
```typescript
export async function checkPerformanceRegression() {
  const baseline = loadBaselineMetrics();
  const current = await measureCurrentPerformance();

  const regressions = [];

  for (const [metric, baselineValue] of Object.entries(baseline)) {
    const currentValue = current[metric];
    const degradation = ((currentValue - baselineValue) / baselineValue) * 100;

    if (degradation > 10) { // >10% degradation
      regressions.push({ metric, baseline: baselineValue, current: currentValue, degradation });
    }
  }

  return regressions;
}
```
**Acceptance**: Regression detection automated

---

#### W2.7. Add Performance Monitoring to CI
**File**: `.github/workflows/performance.yml`
**Action**: CI performance checks
```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:performance
      - run: npm run perf:regression-check
```
**Acceptance**: CI catches regressions

---

#### W2.8. Document Performance Optimization Process
**File**: `docs/performance/OPTIMIZATION_WORKFLOW.md`
**Action**: Create optimization workflow guide
```markdown
# Performance Optimization Workflow

## Step 1: Measure Baseline
\`\`\`bash
npm run perf:measure-baseline
\`\`\`

## Step 2: Identify Bottlenecks
- Use GPU Profiler to find expensive passes
- Use Frame Budget Analyzer to find CPU bottlenecks
- Check Memory Leak Detector for resource leaks

## Step 3: Optimize
- Reduce shader complexity
- Lower quality settings
- Optimize uniforms (cache values)
- Batch draw calls

## Step 4: Validate
\`\`\`bash
npm run test:performance
npm run perf:regression-check
\`\`\`

## Step 5: Document
Update SHADER_EFFECTS_BENCHMARK.md with new metrics
```
**Acceptance**: Workflow documented

---

*(Continuing with remaining workstreams...)*

Due to length constraints, I'll create the remaining workstreams W3-W10 with task summaries:

### **W3: Audio System Integration** (10 tasks)
- Integrate spectral centroid analysis
- Wire tempo tracking
- Add harmonic content detection
- Create audio event system
- Test beat detection accuracy
- Add audio visualization tools
- Create audio debugging panel
- Test microphone permissions
- Document audio pipeline
- Performance test audio processing

### **W4: Visual Regression Testing** (12 tasks)
- Set up visual regression framework
- Generate golden images for each effect
- Create pixel-diff comparison tool
- Test palette rendering accuracy
- Test effect combinations
- Create automated screenshot tests
- Document visual testing process
- Add visual tests to CI
- Create visual diff reports
- Test across browsers
- Mobile visual testing
- Document visual QA process

### **W5: Cultural Features** (12 tasks)
- Implement song-specific visual modes
- Create historical timeline component
- Add cultural context tooltips
- Implement Deadhead terminology
- Create educational mode
- Add venue-specific presets
- Implement setlist integration
- Create community palette submission
- Add attribution system
- Test cultural accuracy
- Get community feedback
- Document cultural features

### **W6: Accessibility Enhancements** (10 tasks)
- Screen reader support
- Keyboard navigation
- High contrast mode
- Motion sickness warnings
- Alternative representations
- ARIA labels
- Focus management
- Accessibility testing
- WCAG compliance audit
- Document accessibility

### **W7: Educational Content** (10 tasks)
- Physics tutorial interactive
- Color science explainer
- Audio reactivity guide
- Cultural history articles
- Video tutorials
- Interactive demos
- Code examples
- API playground
- FAQ expansion
- Glossary completion

### **W8: Cross-Browser Testing** (10 tasks)
- Chrome testing
- Firefox testing
- Safari testing
- Edge testing
- Mobile Safari testing
- Mobile Chrome testing
- WebGL compatibility
- Audio API compatibility
- Browser-specific fixes
- Document compatibility

### **W9: Mobile Optimization** (9 tasks)
- Touch gesture controls
- PWA manifest
- Offline capability
- Battery optimization
- Mobile performance tuning
- Responsive design polish
- Mobile-specific effects
- App install prompt
- Mobile testing

### **W10: Production Polish** (10 tasks)
- Code cleanup
- Bundle optimization
- Error handling polish
- Loading states
- User feedback
- Analytics integration
- SEO optimization
- Security audit
- Pre-launch checklist
- Launch preparation

---

## 📊 SUMMARY

**Total Tasks**: 110
**Duration**: 6 weeks
**Priority**: Integration, testing, polish
**Dependencies**: Claude Code (complete), Codex (in progress)

**Success Metrics**:
- All effects integrated and tested
- Performance validated (≥55 FPS desktop, ≥45 mobile)
- Visual regression suite operational
- Cultural features authentic
- Accessibility WCAG compliant
- Cross-browser compatible
- Production-ready polish

---

**CURSOR, YOU'RE LOADED UP! LET'S FINISH STRONG!** 🚀

*Detailed task breakdowns for W3-W10 available on request.*
