# TypeScript Interfaces Reference

This document provides a comprehensive reference for all TypeScript interfaces used in the Liquid Light System.

## 🎨 Visual System Interfaces

### `DeviceCapabilities`
Represents the hardware and software capabilities of the client device.

```typescript
interface DeviceCapabilities {
  webglVersion: number;           // WebGL version (1 or 2)
  webgl2Supported: boolean;       // WebGL2 support flag
  gpuMemory: number;              // Estimated GPU memory in MB
  cpuCores: number;               // Number of CPU cores
  systemMemory: number;           // System RAM in GB
  maxTextureSize: number;         // Maximum texture size
  maxRenderBufferSize: number;    // Maximum render buffer size
  extensions: string[];           // Supported WebGL extensions
  userAgent: string;              // Browser user agent
  platform: string;               // Operating system platform
}
```

### `DeviceTier`
Performance tier classification for devices.

```typescript
enum DeviceTier {
  ULTRA = 'ultra',       // High-end devices with WebGL2
  HIGH = 'high',         // Good performance devices
  MEDIUM = 'medium',     // Average performance devices
  LOW = 'low',           // Low-end devices
  FALLBACK = 'fallback'  // Very low-end or no WebGL
}
```

### `VisualPolicy`
Defines how visual layers are mapped and combined.

```typescript
interface VisualPolicy {
  id: string;                    // Unique policy identifier
  name: string;                  // Human-readable name
  description: string;           // Policy description
  deviceTier: DeviceTier;       // Target device tier
  layers: VisualLayer[];        // Associated visual layers
  qualitySettings: QualitySettings; // Quality parameters
  enabled: boolean;              // Policy active status
  priority: number;              // Policy priority (0-100)
}
```

### `VisualLayer`
Represents a single visual layer in the system.

```typescript
interface VisualLayer {
  id: string;                    // Unique layer identifier
  name: string;                  // Layer name
  type: 'webgl' | 'css' | 'canvas' | 'svg'; // Layer type
  component: React.ComponentType; // React component
  enabled: boolean;              // Layer active status
  zIndex: number;                // Layer stacking order
  opacity: number;               // Layer opacity (0-1)
  blendMode: string;             // CSS blend mode
  performanceWeight: number;     // Performance impact (0-1)
}
```

### `VisualOrchestratorState`
Current state of the visual orchestrator.

```typescript
interface VisualOrchestratorState {
  activeLayers: VisualLayer[];   // Currently active layers
  currentPolicy: VisualPolicy;   // Active visual policy
  deviceTier: DeviceTier;        // Current device tier
  performanceMetrics: PerformanceMetrics; // Current performance
  qualitySettings: QualitySettings; // Current quality settings
  isInitialized: boolean;        // Orchestrator initialization status
  lastUpdate: number;            // Last update timestamp
}
```

## 🎵 Audio System Interfaces

### `AudioData`
Real-time audio analysis data.

```typescript
interface AudioData {
  timestamp: number;             // Data timestamp
  volume: number;                // Overall volume (0-1)
  bass: number;                  // Bass frequency energy (0-1)
  mids: number;                  // Mid frequency energy (0-1)
  treble: number;                // Treble frequency energy (0-1)
  beatDetected: boolean;         // Beat detection flag
  frequencyBinData?: Uint8Array; // Raw frequency data (optional)
  waveformData?: Uint8Array;     // Raw waveform data (optional)
}
```

### `PhysicsParams`
Audio-derived physics parameters for fluid simulation.

```typescript
interface PhysicsParams {
  splatForce: number;            // Fluid splat intensity
  thermalRate: number;           // Density dissipation rate
  colorPhase: number;            // Color phase shift (0-1)
  globalIntensity: number;       // Overall intensity multiplier
  curlStrength: number;          // Fluid curl/turbulence
  viscosity: number;             // Fluid viscosity
}
```

## 🎨 Palette System Interfaces

### `Palette`
Color palette definition.

```typescript
interface Palette {
  id: string;                    // Unique palette identifier
  name: string;                  // Human-readable name
  description: string;           // Palette description
  colors: [number, number, number][]; // RGB color array
  category: string;              // Palette category
  era: string;                   // Historical era
  tags: string[];                // Search tags
  isDefault: boolean;            // Default palette flag
}
```

### `GlobalVisualState`
Global visual state management.

```typescript
interface GlobalVisualState {
  currentPalette: Palette;       // Active color palette
  intensity: number;             // Global intensity (0-1)
  motionEnabled: boolean;        // Motion animation flag
  audioEnabled: boolean;         // Audio reactivity flag
  qualityLevel: DeviceTier;      // Current quality level
  performanceMode: 'auto' | 'manual'; // Performance mode
  userPreferences: UserPreferences; // User settings
}
```

### `VisualContextValue`
React context value for visual state.

```typescript
interface VisualContextValue {
  state: GlobalVisualState;      // Current visual state
  actions: {
    setPalette: (id: string) => void;
    setIntensity: (intensity: number) => void;
    setMotionEnabled: (enabled: boolean) => void;
    setAudioEnabled: (enabled: boolean) => void;
    setQualityLevel: (tier: DeviceTier) => void;
    setPerformanceMode: (mode: 'auto' | 'manual') => void;
  };
  services: {
    paletteDirector: PaletteDirector;
    audioBus: AudioBus;
    capabilityDetector: CapabilityDetector;
    performanceMonitor: PerformanceMonitor;
  };
}
```

## ⚡ Performance System Interfaces

### `PerformanceMetrics`
Real-time performance monitoring data.

```typescript
interface PerformanceMetrics {
  timestamp: number;             // Metrics timestamp
  fps: number;                   // Frames per second
  frameTime: number;             // Frame time in milliseconds
  cpuTime: number;               // CPU time per frame
  gpuTime: number;               // GPU time per frame
  memoryUsage: number;           // Memory usage in MB
  gpuMemoryUsage: number;        // GPU memory usage in MB
  drawCalls: number;             // Number of draw calls
  triangles: number;             // Number of triangles rendered
  textures: number;              // Number of active textures
  shaders: number;               // Number of active shaders
}
```

### `QualitySettings`
Quality configuration parameters.

```typescript
interface QualitySettings {
  resolutionScale: number;       // Render resolution scale (0-1)
  splatDensity: number;          // Splat density multiplier
  dissipationRate: number;       // Fluid dissipation rate
  curlStrength: number;          // Curl strength multiplier
  bloomIntensity: number;        // Post-processing bloom intensity
  particleCount: number;         // Particle system count
  shadowQuality: 'low' | 'medium' | 'high' | 'ultra';
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  antialiasing: boolean;         // Anti-aliasing enabled
  vsync: boolean;                // Vertical sync enabled
}
```

### `ThermalState`
Device thermal state enumeration.

```typescript
enum ThermalState {
  NOMINAL = 'nominal',           // Normal operating temperature
  FAIR = 'fair',                 // Slightly elevated temperature
  SERIOUS = 'serious',           // High temperature, throttling likely
  CRITICAL = 'critical',         // Critical temperature, severe throttling
  UNKNOWN = 'unknown'            // Thermal state unknown
}
```

### `ThermalMetrics`
Thermal monitoring data.

```typescript
interface ThermalMetrics {
  timestamp: number;             // Metrics timestamp
  thermalState: ThermalState;    // Current thermal state
  temperature?: number;          // Temperature in Celsius (if available)
  throttlingDetected: boolean;   // Throttling detection flag
  performanceImpact: number;     // Performance impact (0-1)
}
```

## 🧪 Testing Interfaces

### `TestConfig`
Test configuration interface.

```typescript
interface TestConfig {
  testEnvironment: 'jsdom' | 'node';
  setupFiles: string[];
  testMatch: string[];
  coverageThreshold: CoverageThreshold;
  mockConfig: MockConfig;
  timeout: number;
  retries: number;
}
```

### `CoverageThreshold`
Code coverage requirements.

```typescript
interface CoverageThreshold {
  global: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
  };
  [path: string]: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
  };
}
```

### `MockConfig`
Mock configuration for tests.

```typescript
interface MockConfig {
  webgl: boolean;                // Mock WebGL context
  audio: boolean;                // Mock audio context
  performance: boolean;          // Mock performance API
  matchMedia: boolean;           // Mock matchMedia API
  localStorage: boolean;         // Mock localStorage
  sessionStorage: boolean;       // Mock sessionStorage
}
```

## 🎛️ Component Props Interfaces

### `LiquidLightBackgroundProps`
Props for the main liquid light component.

```typescript
interface LiquidLightBackgroundProps {
  audioData: AudioData | null;   // Audio analysis data
  intensity: number;             // Visual intensity (0-1)
  motionEnabled: boolean;        // Motion animation enabled
  className?: string;            // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
  onLoad?: () => void;          // Load callback
  onError?: (error: Error) => void; // Error callback
}
```

### `CSSFallbackProps`
Props for the CSS fallback component.

```typescript
interface CSSFallbackProps {
  intensity: number;             // Visual intensity (0-1)
  motionEnabled: boolean;        // Motion animation enabled
  className?: string;            // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
}
```

### `LiquidLightControlsProps`
Props for the control panel component.

```typescript
interface LiquidLightControlsProps {
  intensity: number;             // Current intensity value
  setIntensity: (value: number) => void; // Intensity setter
  motionEnabled: boolean;        // Current motion state
  setMotionEnabled: (enabled: boolean) => void; // Motion setter
  currentPaletteId: string;      // Current palette ID
  setCurrentPaletteId: (id: string) => void; // Palette setter
  className?: string;            // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
}
```

## 🔧 Utility Interfaces

### `UserPreferences`
User preference settings.

```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
  performance: {
    qualityLevel: DeviceTier;
    performanceMode: 'auto' | 'manual';
    monitoringEnabled: boolean;
  };
  audio: {
    enabled: boolean;
    sensitivity: number;
    beatDetection: boolean;
  };
}
```

### `ErrorInfo`
Error information interface.

```typescript
interface ErrorInfo {
  code: string;                  // Error code
  message: string;               // Error message
  stack?: string;                // Stack trace
  timestamp: number;             // Error timestamp
  context?: Record<string, any>; // Additional context
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;          // Error recovery possible
}
```

### `EventData`
Generic event data interface.

```typescript
interface EventData {
  type: string;                  // Event type
  timestamp: number;             // Event timestamp
  data: Record<string, any>;     // Event data
  source: string;                // Event source
  target?: string;               // Event target
}
```

---

## 📝 Usage Examples

### Basic Usage
```typescript
import { AudioData, PhysicsParams } from '@/lib/visual/types';

// Create audio data
const audioData: AudioData = {
  timestamp: Date.now(),
  volume: 0.8,
  bass: 0.6,
  mids: 0.4,
  treble: 0.3,
  beatDetected: true
};

// Calculate physics parameters
const physicsParams: PhysicsParams = calculatePhysicsParams(audioData);
```

### Component Props
```typescript
import { LiquidLightBackgroundProps } from '@/components/LiquidLightBackground';

const props: LiquidLightBackgroundProps = {
  audioData: audioData,
  intensity: 0.7,
  motionEnabled: true,
  onLoad: () => console.log('Liquid light loaded'),
  onError: (error) => console.error('Liquid light error:', error)
};
```

### Performance Monitoring
```typescript
import { PerformanceMetrics, QualitySettings } from '@/lib/performance/types';

const metrics: PerformanceMetrics = {
  timestamp: Date.now(),
  fps: 60,
  frameTime: 16.67,
  cpuTime: 8.5,
  gpuTime: 12.3,
  memoryUsage: 256.7,
  gpuMemoryUsage: 128.4,
  drawCalls: 45,
  triangles: 125000,
  textures: 12,
  shaders: 8
};
```

---

**Last Updated**: 2025-10-29  
**Version**: 1.0.0  
**Maintainer**: Cursor AI Assistant
