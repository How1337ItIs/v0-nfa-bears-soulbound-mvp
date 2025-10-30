# Liquid Light System Documentation

## Overview

The Liquid Light System is a comprehensive WebGL-based fluid simulation engine designed to create authentic 60s liquid light show experiences. It combines real-time fluid dynamics with audio reactivity, cultural authenticity, and performance optimization.

## Architecture

### Core Components

#### 1. LiquidLightBackground.tsx
The main component that orchestrates the entire liquid light experience.

**Key Features:**
- WebGL fluid simulation using `webgl-fluid-enhanced`
- Audio-reactive physics parameters
- Palette management integration
- Performance monitoring
- Accessibility support (`prefers-reduced-motion`)

**Props:**
```typescript
interface LiquidLightBackgroundProps {
  audioData?: AudioData;
  intensity?: number;
  motionEnabled?: boolean;
  className?: string;
}
```

#### 2. PaletteDirector
Centralized color palette management system.

**Features:**
- Authentic 60s color palettes
- Wavelength-to-RGB conversion
- Intensity scaling
- Dynamic palette switching

**Usage:**
```typescript
// Get current palette
const palette = PaletteDirector.getCurrentPalette();

// Get specific color
const color = PaletteDirector.getColorRGB(0);

// Set palette
PaletteDirector.setPalette('psychedelic');
```

#### 3. AudioBus
Centralized audio analysis and distribution system.

**Features:**
- Real-time audio analysis
- Beat detection
- Frequency band analysis (bass, mids, treble)
- Volume normalization

**Usage:**
```typescript
// Start audio analysis
AudioBus.startAnalysis();

// Get current audio data
const audioData = AudioBus.getCurrentData();

// Subscribe to updates
AudioBus.subscribe((data) => {
  // Handle audio data
});
```

#### 4. CapabilityDetector
Device capability detection and performance tier assignment.

**Features:**
- WebGL capability detection
- Performance tier assignment (low, medium, high, ultra)
- Memory estimation
- Mobile device detection

**Usage:**
```typescript
const capabilities = CapabilityDetector.detect();
const tier = CapabilityDetector.getDeviceTier(capabilities);
```

### Performance System

#### WebGL2Optimizer
Advanced WebGL2 optimizations for liquid light rendering.

**Optimizations:**
- Instanced rendering for particles
- Transform feedback for GPU simulation
- Compute shaders for physics
- Texture arrays for palettes
- Uniform buffer objects
- Vertex array objects

#### GPUMemoryManager
Efficient GPU memory management with pooling.

**Features:**
- Texture pooling
- Buffer pooling
- Memory monitoring
- Automatic cleanup
- Memory usage tracking

#### AdaptiveQualityManager
Dynamic quality adjustment based on performance.

**Features:**
- FPS-based scaling
- Memory-aware optimization
- Device-specific profiles
- Real-time adjustment

#### PerformanceProfiler
Comprehensive performance monitoring.

**Metrics:**
- FPS tracking
- Frame time analysis
- Draw call counting
- Memory usage
- GPU/CPU time
- Performance alerts

#### ThermalThrottlingDetector
Thermal throttling detection and mitigation.

**Features:**
- Performance degradation detection
- Battery level monitoring
- Temperature estimation
- Automatic quality reduction

## Audio Integration

### Audio Analysis Pipeline

1. **Audio Capture**: Microphone or audio file input
2. **Frequency Analysis**: FFT analysis for frequency bands
3. **Beat Detection**: Real-time beat detection algorithm
4. **Parameter Mapping**: Audio data to visual parameters
5. **Physics Integration**: Applied to fluid simulation

### Audio Parameters

```typescript
interface AudioData {
  bass: number;        // 0-1, low frequencies
  mids: number;        // 0-1, mid frequencies  
  treble: number;      // 0-1, high frequencies
  volume: number;      // 0-1, overall volume
  beatDetected: boolean; // Beat detection flag
  timestamp: number;   // Analysis timestamp
}
```

### Physics Mapping

```typescript
interface PhysicsParams {
  splatForce: number;      // Force of fluid splats
  thermalRate: number;     // Heat dissipation rate
  colorPhase: number;      // Color phase shift
  globalIntensity: number; // Overall intensity
  curlStrength: number;    // Fluid curl strength
  viscosity: number;       // Fluid viscosity
}
```

## Visual Effects

### Fluid Simulation

The core fluid simulation uses WebGL shaders to create realistic fluid dynamics:

- **Density Field**: Tracks fluid density
- **Velocity Field**: Tracks fluid velocity
- **Pressure Solver**: Solves Navier-Stokes equations
- **Advection**: Moves fluid properties
- **Diffusion**: Spreads fluid properties
- **Force Application**: Applies external forces

### Post-Processing Effects

#### ThinFilmPass
Creates thin-film interference effects for authentic 60s look.

**Features:**
- Wavelength-based color shifting
- Interference patterns
- Dynamic color mixing
- Intensity scaling

#### VintageFilters
Applies vintage visual filters.

**Filters:**
- Color grading
- Film grain
- Vignetting
- Chromatic aberration
- Scan lines

### CSS Fallback

For devices without WebGL support or context loss:

- Gradient backgrounds
- CSS animations
- Palette-based colors
- Motion reduction support

## Performance Optimization

### Quality Tiers

#### Low Tier
- Resolution: 0.6x
- Particles: 2,000
- Texture Quality: Low
- Effects: Basic
- Update Rate: 30fps

#### Medium Tier
- Resolution: 0.8x
- Particles: 5,000
- Texture Quality: Medium
- Effects: Moderate
- Update Rate: 45fps

#### High Tier
- Resolution: 0.9x
- Particles: 10,000
- Texture Quality: High
- Effects: Full
- Update Rate: 60fps

#### Ultra Tier
- Resolution: 1.0x
- Particles: 20,000
- Texture Quality: Ultra
- Effects: All
- Update Rate: 120fps

### Optimization Strategies

1. **Adaptive Quality**: Real-time quality adjustment
2. **Memory Pooling**: Reuse GPU resources
3. **LOD System**: Level-of-detail for particles
4. **Culling**: Skip off-screen rendering
5. **Batching**: Combine draw calls
6. **Thermal Management**: Prevent overheating

## Accessibility

### Motion Reduction

The system respects `prefers-reduced-motion` settings:

```typescript
// Automatically detected
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Disables motion when true
if (prefersReducedMotion) {
  // Use static visual effects
}
```

### User Controls

- **Intensity Slider**: Adjust overall intensity
- **Motion Toggle**: Enable/disable motion
- **Palette Selector**: Choose color palette
- **Mode Selector**: Select visual mode

## Cultural Authenticity

### 60s Color Palettes

Authentic color palettes based on historical research:

- **Psychedelic**: Bright, saturated colors
- **Hippie**: Earth tones and pastels
- **Mod**: Black, white, and primary colors
- **Pop Art**: Bold, contrasting colors

### Period-Accurate Effects

- Thin-film interference
- Chromatic aberration
- Film grain
- Scan lines
- Vignetting

## Troubleshooting

### Common Issues

1. **WebGL Context Lost**
   - Solution: Automatic fallback to CSS
   - Prevention: Memory management

2. **Low Performance**
   - Solution: Adaptive quality reduction
   - Check: Device capabilities

3. **Audio Not Working**
   - Solution: Check microphone permissions
   - Fallback: Use audio file input

4. **Memory Issues**
   - Solution: Enable memory pooling
   - Monitor: GPU memory usage

### Debug Tools

- Performance profiler
- Memory monitor
- Thermal detector
- Audio analyzer
- Quality adjuster

## API Reference

### Core Classes

#### LiquidLightBackground
```typescript
class LiquidLightBackground extends React.Component<LiquidLightBackgroundProps> {
  // Main component
}
```

#### PaletteDirector
```typescript
class PaletteDirector {
  static getCurrentPalette(): Palette;
  static setPalette(name: string): void;
  static getColorRGB(index: number): [number, number, number];
}
```

#### AudioBus
```typescript
class AudioBus {
  static startAnalysis(): void;
  static stopAnalysis(): void;
  static getCurrentData(): AudioData;
  static subscribe(callback: (data: AudioData) => void): void;
}
```

#### CapabilityDetector
```typescript
class CapabilityDetector {
  static detect(): DeviceCapabilities;
  static getDeviceTier(capabilities: DeviceCapabilities): DeviceTier;
}
```

### Performance Classes

#### WebGL2Optimizer
```typescript
class WebGL2Optimizer {
  constructor(gl: WebGL2RenderingContext);
  enableOptimization(id: string): boolean;
  getPerformanceGain(): number;
}
```

#### GPUMemoryManager
```typescript
class GPUMemoryManager {
  constructor(gl: WebGL2RenderingContext);
  createTexturePool(id: string, width: number, height: number): TexturePool;
  getTexture(poolId: string): WebGLTexture | null;
  releaseTexture(poolId: string, texture: WebGLTexture): void;
}
```

#### AdaptiveQualityManager
```typescript
class AdaptiveQualityManager {
  constructor(deviceProfile: DeviceProfile, targets: PerformanceTargets);
  updatePerformance(fps: number, frameTime: number, memoryUsage: number): void;
  getCurrentSettings(): QualitySettings;
}
```

## Examples

### Basic Usage

```typescript
import { LiquidLightBackground } from './components/LiquidLightBackground';

function App() {
  return (
    <LiquidLightBackground
      intensity={0.8}
      motionEnabled={true}
      className="liquid-light-bg"
    />
  );
}
```

### With Audio

```typescript
import { LiquidLightBackground } from './components/LiquidLightBackground';
import { AudioBus } from './lib/audio/AudioBus';

function App() {
  const [audioData, setAudioData] = useState(null);

  useEffect(() => {
    AudioBus.startAnalysis();
    AudioBus.subscribe(setAudioData);
  }, []);

  return (
    <LiquidLightBackground
      audioData={audioData}
      intensity={0.8}
      motionEnabled={true}
    />
  );
}
```

### Performance Monitoring

```typescript
import { PerformanceProfiler } from './lib/performance/PerformanceProfiler';

const profiler = new PerformanceProfiler();

// Start profiling
profiler.startProfiling();

// Record frame
profiler.recordFrame({
  drawCalls: 150,
  triangles: 50000,
  memoryUsage: 0.6
});

// Get profile
const profile = profiler.getPerformanceProfile();
console.log(profile);
```

## Contributing

### Development Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to `http://localhost:3000`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Write comprehensive tests
- Document all public APIs
- Use meaningful variable names

### Testing

- Unit tests for utilities
- Integration tests for components
- Performance tests for optimization
- Accessibility tests for compliance

## License

MIT License - see LICENSE file for details.
