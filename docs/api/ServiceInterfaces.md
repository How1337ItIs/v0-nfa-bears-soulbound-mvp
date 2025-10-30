# Service Interfaces Reference

This document provides detailed interface documentation for all services in the Liquid Light System.

## 🎨 Palette Director Service

### `PaletteDirector`
Centralized color palette management service.

```typescript
class PaletteDirector {
  // Singleton instance management
  static getInstance(initialPaletteId?: string): PaletteDirector;
  
  // Palette management
  getCurrentPalette(): Palette;
  getPaletteById(id: string): Palette | undefined;
  getAllPalettes(): Palette[];
  setPalette(id: string): boolean;
  
  // Color utilities
  getColorRGB(index: number): [number, number, number];
  getColorHSL(index: number): [number, number, number];
  getWavelengthColor(wavelengthNm: number): [number, number, number];
  
  // Palette information
  getPaletteCount(): number;
  getPaletteCategories(): string[];
  getPalettesByCategory(category: string): Palette[];
  searchPalettes(query: string): Palette[];
}
```

### `PaletteDirectorEvents`
Event system for palette changes.

```typescript
interface PaletteDirectorEvents {
  onPaletteChange: (palette: Palette) => void;
  onPaletteAdded: (palette: Palette) => void;
  onPaletteRemoved: (paletteId: string) => void;
  onPaletteUpdated: (palette: Palette) => void;
}
```

## 🎵 Audio Bus Service

### `AudioBus`
Real-time audio analysis and data dissemination service.

```typescript
class AudioBus {
  // Singleton instance management
  static getInstance(): AudioBus;
  
  // Audio processing
  start(sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  
  // Data access
  getAudioData(): AudioData;
  isProcessing(): boolean;
  isLoaded(): boolean;
  
  // Event subscription
  onAudioDataUpdate(callback: (data: AudioData) => void): () => void;
  onBeatDetected(callback: (timestamp: number) => void): () => void;
  onVolumeChange(callback: (volume: number) => void): () => void;
  
  // Configuration
  setSensitivity(sensitivity: number): void;
  setBeatThreshold(threshold: number): void;
  setFrequencyBands(bands: FrequencyBand[]): void;
  
  // Analysis methods
  getFrequencyData(): Uint8Array;
  getWaveformData(): Uint8Array;
  getSpectralCentroid(): number;
  getSpectralFlux(): number;
}
```

### `FrequencyBand`
Audio frequency band configuration.

```typescript
interface FrequencyBand {
  name: string;                  // Band name (e.g., 'bass', 'mids', 'treble')
  startFreq: number;             // Start frequency in Hz
  endFreq: number;               // End frequency in Hz
  sensitivity: number;           // Band sensitivity (0-1)
  enabled: boolean;              // Band enabled flag
}
```

## 🔍 Capability Detector Service

### `CapabilityDetector`
Device capability assessment and performance tier assignment.

```typescript
class CapabilityDetector {
  // Detection methods
  detectDeviceCapabilities(): DeviceCapabilities;
  getDeviceTier(): DeviceTier;
  isWebGL2Supported(): boolean;
  isWebGLSupported(): boolean;
  
  // Performance assessment
  getPerformanceScore(): number;
  getGPUScore(): number;
  getCPUScore(): number;
  getMemoryScore(): number;
  
  // Capability checks
  supportsInstancing(): boolean;
  supportsMultipleRenderTargets(): boolean;
  supportsTransformFeedback(): boolean;
  supportsUniformBufferObjects(): boolean;
  
  // Browser detection
  getBrowserInfo(): BrowserInfo;
  getOSInfo(): OSInfo;
  isMobile(): boolean;
  isTablet(): boolean;
  isDesktop(): boolean;
}
```

### `BrowserInfo`
Browser information interface.

```typescript
interface BrowserInfo {
  name: string;                  // Browser name
  version: string;               // Browser version
  engine: string;                // Rendering engine
  platform: string;              // Platform
  userAgent: string;             // User agent string
  language: string;              // Browser language
  cookieEnabled: boolean;        // Cookie support
  localStorage: boolean;         // Local storage support
  sessionStorage: boolean;       // Session storage support
}
```

### `OSInfo`
Operating system information interface.

```typescript
interface OSInfo {
  name: string;                  // OS name
  version: string;               // OS version
  architecture: string;          // System architecture
  platform: string;              // Platform identifier
  isMobile: boolean;             // Mobile device flag
  isTablet: boolean;             // Tablet device flag
  isDesktop: boolean;            // Desktop device flag
}
```

## ⚡ Performance Monitor Service

### `PerformanceMonitor`
Real-time performance monitoring and metrics collection.

```typescript
class PerformanceMonitor {
  // Monitoring control
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  
  // Metrics access
  getMetrics(): PerformanceMetrics | null;
  getMetricsHistory(): PerformanceMetrics[];
  getAverageMetrics(duration: number): PerformanceMetrics;
  
  // Performance analysis
  getFPS(): number;
  getFrameTime(): number;
  getCPUTime(): number;
  getGPUTime(): number;
  getMemoryUsage(): number;
  getGPUMemoryUsage(): number;
  
  // Threshold monitoring
  setFPSThreshold(threshold: number): void;
  setMemoryThreshold(threshold: number): void;
  setCPUTimeThreshold(threshold: number): void;
  isPerformanceAcceptable(): boolean;
  
  // Event subscription
  onPerformanceChange(callback: (metrics: PerformanceMetrics) => void): () => void;
  onThresholdExceeded(callback: (metric: string, value: number) => void): () => void;
  onPerformanceDegraded(callback: (reason: string) => void): () => void;
  
  // Configuration
  setUpdateInterval(interval: number): void;
  setHistorySize(size: number): void;
  enableDetailedMetrics(enabled: boolean): void;
}
```

## 🎛️ Adaptive Quality Service

### `AdaptiveQuality`
Dynamic quality adjustment based on performance metrics.

```typescript
class AdaptiveQuality {
  // Quality management
  getCurrentQualitySettings(): QualitySettings;
  setQualitySettings(settings: QualitySettings): void;
  adjustQuality(): void;
  resetToDefault(): void;
  
  // Device tier management
  setDeviceTier(tier: DeviceTier): void;
  getDeviceTier(): DeviceTier;
  
  // Performance monitoring integration
  setPerformanceMonitor(monitor: PerformanceMonitor): void;
  getPerformanceMonitor(): PerformanceMonitor | null;
  
  // Quality presets
  getQualityPresets(): Record<DeviceTier, QualitySettings>;
  setQualityPreset(tier: DeviceTier, settings: QualitySettings): void;
  
  // Event subscription
  onQualityChange(callback: (settings: QualitySettings) => void): () => void;
  onTierChange(callback: (tier: DeviceTier) => void): () => void;
  
  // Configuration
  setTargetFPS(fps: number): void;
  setAdjustmentInterval(interval: number): void;
  setQualityBounds(min: QualitySettings, max: QualitySettings): void;
}
```

## 🔥 WebGL2 Optimizations Service

### `WebGL2Optimizations`
WebGL2-specific performance optimizations.

```typescript
class WebGL2Optimizations {
  // FBO management
  getFBO(width: number, height: number, options: WebGLRenderTargetOptions, key: string): WebGLRenderTarget;
  disposeFBOs(): void;
  clearFBOCache(): void;
  
  // Instancing
  createInstancedMesh(geometry: BufferGeometry, material: Material, count: number): InstancedMesh | Mesh;
  updateInstancedMesh(mesh: InstancedMesh, index: number, matrix: Matrix4): void;
  
  // Shader optimization
  precompileShader(material: Material, scene: Scene, camera: Camera): void;
  optimizeShader(shader: Shader): void;
  
  // Geometry optimization
  mergeGeometries(meshes: Mesh[], material: Material): Mesh;
  optimizeGeometry(geometry: BufferGeometry): BufferGeometry;
  
  // Texture optimization
  optimizeTexture(texture: Texture): void;
  compressTexture(texture: Texture, format: string): void;
  
  // Performance analysis
  getOptimizationStats(): OptimizationStats;
  getMemoryUsage(): MemoryUsage;
  getDrawCallCount(): number;
}
```

### `OptimizationStats`
WebGL optimization statistics.

```typescript
interface OptimizationStats {
  fboCount: number;              // Number of cached FBOs
  instancedMeshes: number;       // Number of instanced meshes
  mergedGeometries: number;      // Number of merged geometries
  optimizedShaders: number;      // Number of optimized shaders
  compressedTextures: number;    // Number of compressed textures
  drawCalls: number;             // Current draw call count
  triangles: number;             // Current triangle count
  memoryUsage: number;           // Total memory usage in MB
}
```

## 🧠 GPU Memory Manager Service

### `GPUMemoryManager`
GPU memory management and leak prevention.

```typescript
class GPUMemoryManager {
  // Object management
  register(object: Object3D | Texture | BufferGeometry | Material | WebGLRenderTarget): void;
  unregister(object: Object3D | Texture | BufferGeometry | Material | WebGLRenderTarget): void;
  disposeObject(object: Object3D | Texture | BufferGeometry | Material | WebGLRenderTarget): void;
  disposeAll(): void;
  
  // Memory monitoring
  getMemoryUsage(): MemoryUsage;
  getObjectCount(): number;
  getRegisteredObjects(): (Object3D | Texture | BufferGeometry | Material | WebGLRenderTarget)[];
  
  // Memory analysis
  analyzeMemoryUsage(): MemoryAnalysis;
  findMemoryLeaks(): MemoryLeak[];
  optimizeMemory(): void;
  
  // Event subscription
  onMemoryWarning(callback: (usage: MemoryUsage) => void): () => void;
  onObjectDisposed(callback: (object: any) => void): () => void;
  onMemoryLeak(callback: (leak: MemoryLeak) => void): () => void;
}
```

### `MemoryUsage`
Memory usage statistics.

```typescript
interface MemoryUsage {
  geometries: number;            // Number of geometries
  textures: number;              // Number of textures
  materials: number;             // Number of materials
  programs: number;              // Number of shader programs
  renderTargets: number;         // Number of render targets
  total: number;                 // Total memory usage
  peak: number;                  // Peak memory usage
  available: number;             // Available memory
}
```

### `MemoryAnalysis`
Detailed memory analysis.

```typescript
interface MemoryAnalysis {
  totalObjects: number;          // Total managed objects
  memoryByType: Record<string, number>; // Memory usage by type
  largestObjects: ObjectInfo[];  // Largest memory consumers
  potentialLeaks: ObjectInfo[];  // Potential memory leaks
  recommendations: string[];     // Optimization recommendations
}
```

### `MemoryLeak`
Memory leak information.

```typescript
interface MemoryLeak {
  object: any;                   // Leaked object
  type: string;                  // Object type
  size: number;                  // Memory size
  age: number;                   // Age in milliseconds
  stackTrace: string;            // Creation stack trace
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

## 🌡️ Thermal Throttling Detector Service

### `ThermalThrottlingDetector`
Device thermal state monitoring and throttling detection.

```typescript
class ThermalThrottlingDetector {
  // Monitoring control
  startMonitoring(): void;
  stopMonitoring(): void;
  isMonitoring(): boolean;
  
  // Thermal state access
  getCurrentThermalState(): ThermalState;
  getLastReportedMetrics(): ThermalMetrics | null;
  getThermalHistory(): ThermalMetrics[];
  
  // Throttling detection
  isThrottling(): boolean;
  getThrottlingLevel(): number;
  getPerformanceImpact(): number;
  
  // Event subscription
  onThermalStateChange(callback: (state: ThermalState) => void): () => void;
  onThrottlingDetected(callback: (level: number) => void): () => void;
  onThermalWarning(callback: (warning: string) => void): () => void;
  
  // Configuration
  setCheckInterval(interval: number): void;
  setThermalThresholds(thresholds: ThermalThresholds): void;
  enablePredictiveThrottling(enabled: boolean): void;
}
```

### `ThermalThresholds`
Thermal state thresholds.

```typescript
interface ThermalThresholds {
  nominal: number;               // Nominal temperature threshold
  fair: number;                  // Fair temperature threshold
  serious: number;               // Serious temperature threshold
  critical: number;              // Critical temperature threshold
}
```

---

## 📝 Usage Examples

### Palette Director Usage
```typescript
import { PaletteDirector } from '@/lib/palette/PaletteDirector';

// Get singleton instance
const paletteDirector = PaletteDirector.getInstance();

// Get current palette
const currentPalette = paletteDirector.getCurrentPalette();

// Switch to a specific palette
paletteDirector.setPalette('psychedelic_swirl');

// Get a specific color
const color = paletteDirector.getColorRGB(0); // [255, 0, 128]
```

### Audio Bus Usage
```typescript
import { AudioBus } from '@/lib/audio/AudioBus';

// Get singleton instance
const audioBus = AudioBus.getInstance();

// Start audio processing
await audioBus.start(audioSourceNode);

// Subscribe to audio data updates
const unsubscribe = audioBus.onAudioDataUpdate((data) => {
  console.log('Audio data:', data);
});

// Get current audio data
const audioData = audioBus.getAudioData();
```

### Performance Monitoring Usage
```typescript
import { PerformanceMonitor } from '@/lib/performance/PerformanceMonitor';

// Create performance monitor
const monitor = new PerformanceMonitor();

// Start monitoring
monitor.start();

// Get current metrics
const metrics = monitor.getMetrics();

// Subscribe to performance changes
monitor.onPerformanceChange((metrics) => {
  if (metrics.fps < 30) {
    console.warn('Low FPS detected:', metrics.fps);
  }
});
```

---

**Last Updated**: 2025-10-29  
**Version**: 1.0.0  
**Maintainer**: Cursor AI Assistant
