# Code Style Guide

This document outlines the coding standards and conventions for the Liquid Light System.

## 🎯 General Principles

### Code Quality
- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns and conventions
- **Maintainability**: Write code that's easy to modify and extend
- **Performance**: Consider performance implications of code decisions

### Liquid Light Specific
- **WebGL Best Practices**: Follow WebGL optimization patterns
- **Audio Reactivity**: Implement responsive audio-driven visuals
- **Accessibility**: Ensure inclusive design and functionality
- **Performance**: Optimize for smooth 60fps experience

## 📝 Naming Conventions

### Files and Directories
```typescript
// Components: PascalCase
LiquidLightBackground.tsx
CSSFallback.tsx
LiquidLightControls.tsx

// Services: PascalCase
PaletteDirector.ts
AudioBus.ts
CapabilityDetector.ts

// Hooks: camelCase with 'use' prefix
useAudioReactive.ts
useAudioReactiveEngine.ts

// Utilities: camelCase
audioUtils.ts
colorUtils.ts
performanceUtils.ts

// Types: PascalCase
types.ts
interfaces.ts
enums.ts
```

### Variables and Functions
```typescript
// Variables: camelCase
const audioData = getAudioData();
const performanceMetrics = monitor.getMetrics();
const isWebGLSupported = checkWebGLSupport();

// Functions: camelCase
function calculatePhysicsParams(audioData: AudioData): PhysicsParams {
  // Implementation
}

function getCurrentPalette(): Palette {
  // Implementation
}

// Constants: UPPER_SNAKE_CASE
const MAX_INTENSITY = 1.0;
const DEFAULT_QUALITY_LEVEL = DeviceTier.MEDIUM;
const WEBGL2_REQUIRED = true;
```

### Classes and Interfaces
```typescript
// Classes: PascalCase
class PaletteDirector {
  // Implementation
}

class AudioBus {
  // Implementation
}

// Interfaces: PascalCase
interface AudioData {
  timestamp: number;
  volume: number;
  bass: number;
  mids: number;
  treble: number;
  beatDetected: boolean;
}

// Enums: PascalCase
enum DeviceTier {
  ULTRA = 'ultra',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  FALLBACK = 'fallback'
}
```

## 🏗️ Component Structure

### React Components
```typescript
import React from 'react';
import { PaletteDirector } from '@/lib/palette/PaletteDirector';
import { AudioData } from '@/lib/visual/types';

// Props interface
interface MyComponentProps {
  audioData: AudioData | null;
  intensity: number;
  motionEnabled: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Component implementation
export const MyComponent: React.FC<MyComponentProps> = ({
  audioData,
  intensity,
  motionEnabled,
  className,
  style,
  onLoad,
  onError
}) => {
  // Hooks
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  // Effects
  React.useEffect(() => {
    // Effect logic
  }, [audioData, intensity]);
  
  // Event handlers
  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);
  
  const handleError = React.useCallback((err: Error) => {
    setError(err);
    onError?.(err);
  }, [onError]);
  
  // Render
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div className={className} style={style}>
      {/* Component content */}
    </div>
  );
};
```

### Service Classes
```typescript
import { AudioData } from '@/lib/visual/types';

export class MyService {
  private static instance: MyService;
  private isInitialized: boolean = false;
  private callbacks: Set<(data: AudioData) => void> = new Set();
  
  // Singleton pattern
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
  
  // Public methods
  public async start(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    try {
      await this.initialize();
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to start service: ${error}`);
    }
  }
  
  public stop(): void {
    this.cleanup();
    this.isInitialized = false;
  }
  
  // Event subscription
  public onDataUpdate(callback: (data: AudioData) => void): () => void {
    this.callbacks.add(callback);
    
    return () => {
      this.callbacks.delete(callback);
    };
  }
  
  // Private methods
  private async initialize(): Promise<void> {
    // Initialization logic
  }
  
  private cleanup(): void {
    // Cleanup logic
  }
  
  private notifyCallbacks(data: AudioData): void {
    this.callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Callback error:', error);
      }
    });
  }
}
```

## 🎨 TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for object shapes
interface AudioData {
  timestamp: number;
  volume: number;
  bass: number;
  mids: number;
  treble: number;
  beatDetected: boolean;
}

// Use types for unions and computed types
type DeviceTier = 'ultra' | 'high' | 'medium' | 'low' | 'fallback';
type QualitySettings = {
  resolutionScale: number;
  splatDensity: number;
  dissipationRate: number;
  curlStrength: number;
  bloomIntensity: number;
  particleCount: number;
};

// Use enums for fixed sets of values
enum ThermalState {
  NOMINAL = 'nominal',
  FAIR = 'fair',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}
```

### Generic Types
```typescript
// Generic interfaces
interface Service<T> {
  getInstance(): T;
  start(): Promise<void>;
  stop(): void;
}

// Generic functions
function createService<T extends Service<any>>(
  ServiceClass: new () => T
): T {
  return new ServiceClass();
}

// Generic constraints
interface AudioProcessor<T extends AudioData> {
  process(data: T): T;
  validate(data: T): boolean;
}
```

### Utility Types
```typescript
// Use built-in utility types
type PartialAudioData = Partial<AudioData>;
type RequiredAudioData = Required<AudioData>;
type AudioDataKeys = keyof AudioData;
type AudioDataValues = AudioData[AudioDataKeys];

// Create custom utility types
type NonNullable<T> = T extends null | undefined ? never : T;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

## 🎵 Audio Integration Patterns

### Audio Data Processing
```typescript
// Audio data validation
function validateAudioData(data: unknown): data is AudioData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as AudioData).timestamp === 'number' &&
    typeof (data as AudioData).volume === 'number' &&
    typeof (data as AudioData).bass === 'number' &&
    typeof (data as AudioData).mids === 'number' &&
    typeof (data as AudioData).treble === 'number' &&
    typeof (data as AudioData).beatDetected === 'boolean'
  );
}

// Physics parameter calculation
function calculatePhysicsParams(audioData: AudioData): PhysicsParams {
  const { volume, bass, mids, treble, beatDetected } = audioData;
  
  // Base values
  const baseSplatForce = 0.005;
  const baseThermalRate = 0.98;
  const baseCurlStrength = 0.1;
  const baseViscosity = 0.98;
  
  // Calculate parameters
  let splatForce = baseSplatForce;
  let thermalRate = baseThermalRate;
  let colorPhase = 0;
  let globalIntensity = volume;
  let curlStrength = baseCurlStrength;
  let viscosity = baseViscosity;
  
  // Apply audio reactivity
  if (bass > 0.6) {
    splatForce += bass * 0.005;
    curlStrength += bass * 0.1;
  }
  
  if (mids > 0.4) {
    splatForce += mids * 0.002;
    viscosity = Math.max(0.9, baseViscosity - mids * 0.02);
  }
  
  if (treble > 0.3) {
    colorPhase = treble;
  }
  
  if (beatDetected) {
    splatForce *= 1.5;
    globalIntensity = Math.min(1.0, globalIntensity + 0.2);
  }
  
  return {
    splatForce: Math.min(0.02, splatForce),
    thermalRate: Math.min(0.99, Math.max(0.95, thermalRate)),
    colorPhase,
    globalIntensity,
    curlStrength: Math.min(0.5, curlStrength),
    viscosity: Math.min(0.99, Math.max(0.9, viscosity))
  };
}
```

## 🎨 Visual System Patterns

### Palette Management
```typescript
// Palette usage
const palette = PaletteDirector.getCurrentPalette();
const color = PaletteDirector.getColorRGB(0);

// Avoid hardcoded colors
// ❌ Bad
const color = '#ff0080';

// ✅ Good
const color = PaletteDirector.getColorRGB(0);

// Wavelength color generation
const wavelengthColor = PaletteDirector.getWavelengthColor(580); // Yellow
```

### WebGL Best Practices
```typescript
// Use WebGL2Optimizer for WebGL calls
// ❌ Bad
const texture = gl.createTexture();

// ✅ Good
const texture = webglOptimizer.createTexture(options);

// Memory management
// ❌ Bad
// No cleanup

// ✅ Good
const manager = new GPUMemoryManager(renderer);
manager.register(texture);
// Later...
manager.disposeObject(texture);
```

## ⚡ Performance Patterns

### Performance Monitoring
```typescript
// Use PerformanceMonitor for timing
const monitor = new PerformanceMonitor();
monitor.start();

// Monitor performance changes
monitor.onPerformanceChange((metrics) => {
  if (metrics.fps < 30) {
    console.warn('Low FPS detected:', metrics.fps);
  }
});

// Use AdaptiveQuality for dynamic adjustment
const quality = new AdaptiveQuality();
quality.setPerformanceMonitor(monitor);
quality.adjustQuality();
```

### Memory Management
```typescript
// Register objects for cleanup
const manager = new GPUMemoryManager(renderer);
manager.register(geometry);
manager.register(material);
manager.register(texture);

// Cleanup on unmount
React.useEffect(() => {
  return () => {
    manager.disposeAll();
  };
}, []);
```

## 🧪 Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  const defaultProps = {
    audioData: null,
    intensity: 0.5,
    motionEnabled: true
  };
  
  it('renders correctly', () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles audio data changes', () => {
    const { rerender } = render(<MyComponent {...defaultProps} />);
    
    const audioData = {
      timestamp: Date.now(),
      volume: 0.8,
      bass: 0.6,
      mids: 0.4,
      treble: 0.3,
      beatDetected: true
    };
    
    rerender(<MyComponent {...defaultProps} audioData={audioData} />);
    expect(screen.getByText('Beat detected!')).toBeInTheDocument();
  });
});
```

### Service Testing
```typescript
import { MyService } from '@/lib/services/MyService';

describe('MyService', () => {
  let service: MyService;
  
  beforeEach(() => {
    service = MyService.getInstance();
  });
  
  afterEach(() => {
    service.stop();
  });
  
  it('starts and stops correctly', async () => {
    await service.start();
    expect(service.isInitialized).toBe(true);
    
    service.stop();
    expect(service.isInitialized).toBe(false);
  });
  
  it('notifies callbacks on data update', async () => {
    const callback = jest.fn();
    const unsubscribe = service.onDataUpdate(callback);
    
    await service.start();
    // Trigger data update
    
    expect(callback).toHaveBeenCalled();
    
    unsubscribe();
  });
});
```

## 🚨 Error Handling

### Error Boundaries
```typescript
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error?.message}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Service Error Handling
```typescript
export class MyService {
  private handleError(error: Error, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    // Notify error handlers
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error, context);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }
  
  public onError(callback: (error: Error, context: string) => void): () => void {
    this.errorCallbacks.add(callback);
    
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }
}
```

## 📚 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Calculates physics parameters from audio data for fluid simulation.
 * 
 * @param audioData - Real-time audio analysis data
 * @returns Physics parameters for fluid simulation
 * 
 * @example
 * ```typescript
 * const audioData = {
 *   timestamp: Date.now(),
 *   volume: 0.8,
 *   bass: 0.6,
 *   mids: 0.4,
 *   treble: 0.3,
 *   beatDetected: true
 * };
 * 
 * const physicsParams = calculatePhysicsParams(audioData);
 * console.log(physicsParams.splatForce); // 0.008
 * ```
 */
function calculatePhysicsParams(audioData: AudioData): PhysicsParams {
  // Implementation
}
```

### README Files
```markdown
# Component Name

Brief description of the component's purpose and functionality.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

```typescript
import { ComponentName } from '@/components/ComponentName';

<ComponentName
  prop1="value1"
  prop2={value2}
  onEvent={handleEvent}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | Description of prop1 |
| prop2 | number | 0 | Description of prop2 |

## Examples

### Basic Usage
```typescript
// Example code
```

### Advanced Usage
```typescript
// Example code
```
```

---

**Remember**: Follow these guidelines consistently to maintain code quality and readability across the Liquid Light System! 🎨✨
