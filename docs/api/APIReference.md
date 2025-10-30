# Liquid Light System API Reference

## Overview

This document provides a comprehensive API reference for the Liquid Light System. It covers all public classes, interfaces, methods, and properties.

## Core Components

### LiquidLightBackground

The main React component for rendering liquid light effects.

```typescript
interface LiquidLightBackgroundProps {
  audioData?: AudioData;
  intensity?: number;
  motionEnabled?: boolean;
  className?: string;
}

class LiquidLightBackground extends React.Component<LiquidLightBackgroundProps> {
  // Component implementation
}
```

**Props:**
- `audioData?: AudioData` - Audio analysis data for reactivity
- `intensity?: number` - Overall intensity (0-1, default: 0.8)
- `motionEnabled?: boolean` - Enable/disable motion effects (default: true)
- `className?: string` - CSS class name for styling

**Example:**
```typescript
<LiquidLightBackground
  audioData={audioData}
  intensity={0.8}
  motionEnabled={true}
  className="liquid-light-bg"
/>
```

### PaletteDirector

Centralized color palette management system.

```typescript
class PaletteDirector {
  static getCurrentPalette(): Palette;
  static setPalette(name: string): void;
  static getColorRGB(index: number): [number, number, number];
  static getColorHSL(index: number): [number, number, number];
  static getPaletteNames(): string[];
  static getPaletteCount(): number;
}
```

**Methods:**
- `getCurrentPalette(): Palette` - Get the currently active palette
- `setPalette(name: string): void` - Set the active palette by name
- `getColorRGB(index: number): [number, number, number]` - Get color as RGB tuple
- `getColorHSL(index: number): [number, number, number]` - Get color as HSL tuple
- `getPaletteNames(): string[]` - Get list of available palette names
- `getPaletteCount(): number` - Get total number of palettes

**Example:**
```typescript
// Set palette
PaletteDirector.setPalette('psychedelic');

// Get current palette
const palette = PaletteDirector.getCurrentPalette();

// Get specific color
const color = PaletteDirector.getColorRGB(0); // [255, 0, 0]
```

### AudioBus

Centralized audio analysis and distribution system.

```typescript
class AudioBus {
  static startAnalysis(): void;
  static stopAnalysis(): void;
  static getCurrentData(): AudioData | null;
  static subscribe(callback: (data: AudioData) => void): () => void;
  static isAnalyzing(): boolean;
  static getAnalysisState(): 'idle' | 'starting' | 'analyzing' | 'stopping';
}
```

**Methods:**
- `startAnalysis(): void` - Start audio analysis
- `stopAnalysis(): void` - Stop audio analysis
- `getCurrentData(): AudioData | null` - Get current audio data
- `subscribe(callback: (data: AudioData) => void): () => void` - Subscribe to audio updates
- `isAnalyzing(): boolean` - Check if analysis is running
- `getAnalysisState(): string` - Get current analysis state

**Example:**
```typescript
// Start analysis
AudioBus.startAnalysis();

// Subscribe to updates
const unsubscribe = AudioBus.subscribe((audioData) => {
  console.log('Audio data:', audioData);
});

// Get current data
const currentData = AudioBus.getCurrentData();

// Stop analysis
AudioBus.stopAnalysis();
unsubscribe();
```

### CapabilityDetector

Device capability detection and performance tier assignment.

```typescript
class CapabilityDetector {
  static detect(): DeviceCapabilities;
  static getDeviceTier(capabilities: DeviceCapabilities): DeviceTier;
  static isWebGL2Supported(): boolean;
  static isMobile(): boolean;
  static getMemoryEstimate(): number;
}
```

**Methods:**
- `detect(): DeviceCapabilities` - Detect device capabilities
- `getDeviceTier(capabilities: DeviceCapabilities): DeviceTier` - Get performance tier
- `isWebGL2Supported(): boolean` - Check WebGL2 support
- `isMobile(): boolean` - Check if device is mobile
- `getMemoryEstimate(): number` - Estimate available memory

**Example:**
```typescript
// Detect capabilities
const capabilities = CapabilityDetector.detect();

// Get device tier
const tier = CapabilityDetector.getDeviceTier(capabilities);

// Check WebGL2 support
if (CapabilityDetector.isWebGL2Supported()) {
  console.log('WebGL2 supported');
}
```

## Performance System

### WebGL2Optimizer

Advanced WebGL2 optimizations for liquid light rendering.

```typescript
class WebGL2Optimizer {
  constructor(gl: WebGL2RenderingContext);
  enableOptimization(id: string): boolean;
  disableOptimization(id: string): void;
  isOptimizationEnabled(id: string): boolean;
  getEnabledOptimizations(): WebGL2Optimization[];
  getPerformanceGain(): number;
  updatePerformanceMetrics(metrics: Partial<PerformanceMetrics>): void;
  getPerformanceMetrics(): PerformanceMetrics;
  optimizeForDevice(deviceTier: DeviceTier): void;
}
```

**Methods:**
- `constructor(gl: WebGL2RenderingContext)` - Initialize optimizer
- `enableOptimization(id: string): boolean` - Enable specific optimization
- `disableOptimization(id: string): void` - Disable specific optimization
- `isOptimizationEnabled(id: string): boolean` - Check if optimization is enabled
- `getEnabledOptimizations(): WebGL2Optimization[]` - Get list of enabled optimizations
- `getPerformanceGain(): number` - Get total performance gain (0-1)
- `updatePerformanceMetrics(metrics: Partial<PerformanceMetrics>): void` - Update metrics
- `getPerformanceMetrics(): PerformanceMetrics` - Get current metrics
- `optimizeForDevice(deviceTier: DeviceTier): void` - Optimize for device tier

**Example:**
```typescript
const optimizer = new WebGL2Optimizer(gl);

// Enable optimizations
optimizer.enableOptimization('instanced-fluid-particles');
optimizer.enableOptimization('transform-feedback-simulation');

// Get performance gain
const gain = optimizer.getPerformanceGain();
console.log('Performance gain:', gain);
```

### GPUMemoryManager

Efficient GPU memory management with pooling.

```typescript
class GPUMemoryManager {
  constructor(gl: WebGL2RenderingContext);
  createTexturePool(id: string, width: number, height: number, format?: number, type?: number, initialCount?: number): TexturePool;
  getTexture(poolId: string): WebGLTexture | null;
  releaseTexture(poolId: string, texture: WebGLTexture): void;
  createBufferPool(id: string, size: number, usage?: number, initialCount?: number): BufferPool;
  getBuffer(poolId: string): WebGLBuffer | null;
  releaseBuffer(poolId: string, buffer: WebGLBuffer): void;
  getMemoryInfo(): GPUMemoryInfo;
  isMemoryLow(): boolean;
  setMaxMemoryUsage(usage: number): void;
  cleanupUnusedResources(): void;
  cleanup(): void;
}
```

**Methods:**
- `constructor(gl: WebGL2RenderingContext)` - Initialize memory manager
- `createTexturePool(...): TexturePool` - Create texture pool
- `getTexture(poolId: string): WebGLTexture | null` - Get texture from pool
- `releaseTexture(poolId: string, texture: WebGLTexture): void` - Release texture to pool
- `createBufferPool(...): BufferPool` - Create buffer pool
- `getBuffer(poolId: string): WebGLBuffer | null` - Get buffer from pool
- `releaseBuffer(poolId: string, buffer: WebGLBuffer): void` - Release buffer to pool
- `getMemoryInfo(): GPUMemoryInfo` - Get memory usage info
- `isMemoryLow(): boolean` - Check if memory is low
- `setMaxMemoryUsage(usage: number): void` - Set max memory usage (0-1)
- `cleanupUnusedResources(): void` - Clean up unused resources
- `cleanup(): void` - Clean up all resources

**Example:**
```typescript
const memoryManager = new GPUMemoryManager(gl);

// Create texture pool
const texturePool = memoryManager.createTexturePool(
  'particles',
  256, 256,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  10
);

// Get texture
const texture = memoryManager.getTexture('particles');

// Release texture
memoryManager.releaseTexture('particles', texture);
```

### AdaptiveQualityManager

Dynamic quality adjustment based on performance.

```typescript
class AdaptiveQualityManager {
  constructor(deviceProfile: DeviceProfile, performanceTargets: PerformanceTargets);
  updatePerformance(fps: number, frameTime: number, memoryUsage: number): void;
  getCurrentSettings(): QualitySettings;
  setPerformanceTargets(targets: Partial<PerformanceTargets>): void;
  resetToRecommended(): void;
  getPerformanceHistory(): { fps: number[], memory: number[] };
}
```

**Methods:**
- `constructor(deviceProfile: DeviceProfile, performanceTargets: PerformanceTargets)` - Initialize manager
- `updatePerformance(fps: number, frameTime: number, memoryUsage: number): void` - Update performance metrics
- `getCurrentSettings(): QualitySettings` - Get current quality settings
- `setPerformanceTargets(targets: Partial<PerformanceTargets>): void` - Set performance targets
- `resetToRecommended(): void` - Reset to recommended settings
- `getPerformanceHistory(): { fps: number[], memory: number[] }` - Get performance history

**Example:**
```typescript
const qualityManager = new AdaptiveQualityManager(deviceProfile, performanceTargets);

// Update performance
qualityManager.updatePerformance(fps, frameTime, memoryUsage);

// Get current settings
const settings = qualityManager.getCurrentSettings();
console.log('Current quality:', settings);
```

### PerformanceProfiler

Comprehensive performance monitoring.

```typescript
class PerformanceProfiler {
  constructor();
  startProfiling(): void;
  stopProfiling(): void;
  recordFrame(metrics: Partial<PerformanceMetrics>): void;
  getCurrentMetrics(): PerformanceMetrics | null;
  getPerformanceProfile(): PerformanceProfile | null;
  getAlerts(): PerformanceAlert[];
  getRecentAlerts(count?: number): PerformanceAlert[];
  getAlertsBySeverity(severity: PerformanceAlert['severity']): PerformanceAlert[];
  clearAlerts(): void;
  setAlertThresholds(thresholds: Partial<AlertThresholds>): void;
  getMetricsHistory(): PerformanceMetrics[];
  getMetricsForTimeRange(startTime: number, endTime: number): PerformanceMetrics[];
  exportProfile(): string;
  isProfilingActive(): boolean;
  getProfilingDuration(): number;
  getFrameCount(): number;
}
```

**Methods:**
- `constructor()` - Initialize profiler
- `startProfiling(): void` - Start performance profiling
- `stopProfiling(): void` - Stop performance profiling
- `recordFrame(metrics: Partial<PerformanceMetrics>): void` - Record frame metrics
- `getCurrentMetrics(): PerformanceMetrics | null` - Get current metrics
- `getPerformanceProfile(): PerformanceProfile | null` - Get performance profile
- `getAlerts(): PerformanceAlert[]` - Get all alerts
- `getRecentAlerts(count?: number): PerformanceAlert[]` - Get recent alerts
- `getAlertsBySeverity(severity): PerformanceAlert[]` - Get alerts by severity
- `clearAlerts(): void` - Clear all alerts
- `setAlertThresholds(thresholds): void` - Set alert thresholds
- `getMetricsHistory(): PerformanceMetrics[]` - Get metrics history
- `getMetricsForTimeRange(start, end): PerformanceMetrics[]` - Get metrics for time range
- `exportProfile(): string` - Export profile as JSON
- `isProfilingActive(): boolean` - Check if profiling is active
- `getProfilingDuration(): number` - Get profiling duration
- `getFrameCount(): number` - Get frame count

**Example:**
```typescript
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
console.log('Performance profile:', profile);
```

### ThermalThrottlingDetector

Thermal throttling detection and mitigation.

```typescript
class ThermalThrottlingDetector {
  constructor(thresholds?: Partial<ThrottlingThresholds>);
  startMonitoring(): void;
  stopMonitoring(): void;
  updatePerformance(fps: number, frameTime: number): void;
  getThermalStatus(): ThermalStatus;
  setThresholds(thresholds: Partial<ThrottlingThresholds>): void;
  getThresholds(): ThrottlingThresholds;
  isThrottlingDetected(): boolean;
  getThrottlingDuration(): number;
  reset(): void;
}
```

**Methods:**
- `constructor(thresholds?: Partial<ThrottlingThresholds>)` - Initialize detector
- `startMonitoring(): void` - Start thermal monitoring
- `stopMonitoring(): void` - Stop thermal monitoring
- `updatePerformance(fps: number, frameTime: number): void` - Update performance metrics
- `getThermalStatus(): ThermalStatus` - Get thermal status
- `setThresholds(thresholds): void` - Set throttling thresholds
- `getThresholds(): ThrottlingThresholds` - Get current thresholds
- `isThrottlingDetected(): boolean` - Check if throttling is detected
- `getThrottlingDuration(): number` - Get throttling duration
- `reset(): void` - Reset detector

**Example:**
```typescript
const thermalDetector = new ThermalThrottlingDetector();

// Start monitoring
thermalDetector.startMonitoring();

// Update performance
thermalDetector.updatePerformance(fps, frameTime);

// Check thermal status
const status = thermalDetector.getThermalStatus();
if (status.isThrottled) {
  console.warn('Thermal throttling detected');
}
```

## Data Types

### AudioData

Audio analysis data structure.

```typescript
interface AudioData {
  bass: number;        // 0-1, low frequencies (20-250 Hz)
  mids: number;        // 0-1, mid frequencies (250-4000 Hz)
  treble: number;      // 0-1, high frequencies (4000-20000 Hz)
  volume: number;      // 0-1, overall volume
  beatDetected: boolean; // Beat detection flag
  timestamp: number;   // Analysis timestamp
}
```

### PhysicsParams

Physics parameters for fluid simulation.

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

### Palette

Color palette structure.

```typescript
interface Palette {
  name: string;
  colors: [number, number, number][]; // RGB tuples
  description: string;
  era: string;
  culturalContext: string;
}
```

### DeviceCapabilities

Device capability information.

```typescript
interface DeviceCapabilities {
  maxTextureSize: number;
  maxVertexAttribs: number;
  maxVaryingVectors: number;
  maxFragmentUniforms: number;
  maxVertexUniforms: number;
  maxTextureImageUnits: number;
  maxVertexTextureImageUnits: number;
  maxCombinedTextureImageUnits: number;
  maxRenderBufferSize: number;
  maxViewportDims: [number, number];
  aliasedLineWidthRange: [number, number];
  aliasedPointSizeRange: [number, number];
  deviceMemory: number;
  mobile: boolean;
}
```

### DeviceTier

Performance tier enumeration.

```typescript
type DeviceTier = 'low' | 'medium' | 'high' | 'ultra';
```

### QualitySettings

Quality settings for adaptive quality management.

```typescript
interface QualitySettings {
  resolution: number;           // 0-1, render resolution
  particleCount: number;        // Number of fluid particles
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  effectComplexity: number;     // 0-1, effect intensity
  updateRate: number;          // Updates per second
  enablePostProcessing: boolean;
  enableShadows: boolean;
  enableReflections: boolean;
  maxDrawCalls: number;
  maxTriangles: number;
}
```

### PerformanceMetrics

Performance metrics structure.

```typescript
interface PerformanceMetrics {
  fps: number;              // Frames per second
  frameTime: number;        // Frame time in milliseconds
  drawCalls: number;        // Number of draw calls
  triangles: number;        // Number of triangles rendered
  textures: number;         // Number of textures used
  memoryUsage: number;      // Memory usage (0-1)
  gpuTime: number;          // GPU time in milliseconds
  cpuTime: number;          // CPU time in milliseconds
  timestamp: number;        // Metrics timestamp
}
```

### PerformanceProfile

Performance profile summary.

```typescript
interface PerformanceProfile {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  averageFrameTime: number;
  maxFrameTime: number;
  averageDrawCalls: number;
  maxDrawCalls: number;
  averageTriangles: number;
  maxTriangles: number;
  averageMemoryUsage: number;
  maxMemoryUsage: number;
  averageGPUTime: number;
  maxGPUTime: number;
  samples: number;
  duration: number; // in milliseconds
}
```

### PerformanceAlert

Performance alert structure.

```typescript
interface PerformanceAlert {
  id: string;
  type: 'fps-low' | 'fps-high' | 'memory-high' | 'gpu-overload' | 'cpu-overload' | 'draw-calls-high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
}
```

### ThermalStatus

Thermal status information.

```typescript
interface ThermalStatus {
  isThrottled: boolean;
  throttlingLevel: 'none' | 'light' | 'moderate' | 'severe';
  temperature: number | null; // in Celsius
  batteryLevel: number | null; // 0-1
  batteryCharging: boolean | null;
  performanceImpact: number; // 0-1
  recommendations: string[];
}
```

## Utility Functions

### createWebGL2Optimizer

Create a WebGL2 optimizer instance.

```typescript
function createWebGL2Optimizer(gl: WebGL2RenderingContext): WebGL2Optimizer;
```

### createGPUMemoryManager

Create a GPU memory manager instance.

```typescript
function createGPUMemoryManager(gl: WebGL2RenderingContext): GPUMemoryManager;
```

### createAdaptiveQualityManager

Create an adaptive quality manager instance.

```typescript
function createAdaptiveQualityManager(deviceProfile: DeviceProfile, performanceTargets: PerformanceTargets): AdaptiveQualityManager;
```

### createPerformanceProfiler

Create a performance profiler instance.

```typescript
function createPerformanceProfiler(): PerformanceProfiler;
```

### createThermalThrottlingDetector

Create a thermal throttling detector instance.

```typescript
function createThermalThrottlingDetector(thresholds?: Partial<ThrottlingThresholds>): ThermalThrottlingDetector;
```

### createDeviceProfile

Create a device profile from capabilities.

```typescript
function createDeviceProfile(capabilities: DeviceCapabilities): DeviceProfile;
```

### formatPerformanceMetrics

Format performance metrics for display.

```typescript
function formatPerformanceMetrics(metrics: PerformanceMetrics): string;
```

### formatPerformanceProfile

Format performance profile for display.

```typescript
function formatPerformanceProfile(profile: PerformanceProfile): string;
```

### formatThermalStatus

Format thermal status for display.

```typescript
function formatThermalStatus(status: ThermalStatus): string;
```

## Examples

### Basic Usage

```typescript
import { LiquidLightBackground } from './components/LiquidLightBackground';
import { AudioBus } from './lib/audio/AudioBus';
import { PaletteDirector } from './lib/palette/PaletteDirector';

function App() {
  const [audioData, setAudioData] = useState(null);

  useEffect(() => {
    // Start audio analysis
    AudioBus.startAnalysis();
    AudioBus.subscribe(setAudioData);

    // Set palette
    PaletteDirector.setPalette('psychedelic');

    return () => {
      AudioBus.stopAnalysis();
    };
  }, []);

  return (
    <LiquidLightBackground
      audioData={audioData}
      intensity={0.8}
      motionEnabled={true}
      className="liquid-light-bg"
    />
  );
}
```

### Performance Monitoring

```typescript
import { PerformanceProfiler } from './lib/performance/PerformanceProfiler';
import { AdaptiveQualityManager } from './lib/performance/AdaptiveQuality';
import { ThermalThrottlingDetector } from './lib/performance/ThermalThrottlingDetector';

function PerformanceMonitor() {
  const profiler = useRef(new PerformanceProfiler());
  const qualityManager = useRef(new AdaptiveQualityManager(deviceProfile, targets));
  const thermalDetector = useRef(new ThermalThrottlingDetector());

  useEffect(() => {
    // Start profiling
    profiler.current.startProfiling();
    thermalDetector.current.startMonitoring();

    // Monitor performance
    const interval = setInterval(() => {
      const metrics = profiler.current.getCurrentMetrics();
      if (metrics) {
        // Update quality based on performance
        qualityManager.current.updatePerformance(
          metrics.fps,
          metrics.frameTime,
          metrics.memoryUsage
        );

        // Check for thermal throttling
        thermalDetector.current.updatePerformance(
          metrics.fps,
          metrics.frameTime
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      profiler.current.stopProfiling();
      thermalDetector.current.stopMonitoring();
    };
  }, []);

  return null;
}
```

### Memory Management

```typescript
import { GPUMemoryManager } from './lib/performance/GPUMemoryManager';

function MemoryManager() {
  const memoryManager = useRef<GPUMemoryManager | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    
    if (gl) {
      memoryManager.current = new GPUMemoryManager(gl);
      
      // Create texture pools
      memoryManager.current.createTexturePool(
        'particles',
        256, 256,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        10
      );
    }

    return () => {
      if (memoryManager.current) {
        memoryManager.current.cleanup();
      }
    };
  }, []);

  return null;
}
```

## Error Handling

### Common Errors

1. **WebGL Context Lost**
   ```typescript
   canvas.addEventListener('webglcontextlost', (event) => {
     event.preventDefault();
     console.warn('WebGL context lost');
     // Switch to CSS fallback
   });
   ```

2. **Audio Permission Denied**
   ```typescript
   try {
     await AudioBus.startAnalysis();
   } catch (error) {
     console.error('Audio permission denied:', error);
     // Use fallback audio data
   }
   ```

3. **Memory Allocation Failed**
   ```typescript
   try {
     const texture = memoryManager.getTexture('particles');
   } catch (error) {
     console.error('Memory allocation failed:', error);
     // Reduce quality settings
   }
   ```

## Browser Compatibility

### WebGL Support
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

### Audio Support
- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

### Performance APIs
- Chrome 58+
- Firefox 55+
- Safari 10.1+
- Edge 79+

## Conclusion

This API reference provides comprehensive documentation for the Liquid Light System. For additional help, refer to the troubleshooting guide and performance optimization guide.
