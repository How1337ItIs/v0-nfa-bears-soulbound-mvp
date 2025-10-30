# Best Practices

This document outlines the best practices for developing, maintaining, and using the Liquid Light System.

## 🎨 Visual Development

### WebGL Best Practices

#### Context Management
```typescript
// ✅ Good: Proper context management
const canvas = useRef<HTMLCanvasElement>(null);
const [webglSupported, setWebglSupported] = useState(false);

useEffect(() => {
  if (!canvas.current) return;
  
  const gl = canvas.current.getContext('webgl2');
  if (!gl) {
    setWebglSupported(false);
    return;
  }
  
  setWebglSupported(true);
  
  // Handle context loss
  canvas.current.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    setWebglSupported(false);
  });
  
  canvas.current.addEventListener('webglcontextrestored', () => {
    setWebglSupported(true);
    initializeWebGL();
  });
}, []);
```

#### Memory Management
```typescript
// ✅ Good: Proper memory management
const manager = new GPUMemoryManager(renderer);

useEffect(() => {
  // Register objects for cleanup
  manager.register(geometry);
  manager.register(material);
  manager.register(texture);
  
  return () => {
    // Cleanup on unmount
    manager.disposeAll();
  };
}, []);
```

#### Performance Optimization
```typescript
// ✅ Good: Use WebGL2 optimizations
const webglOptimizer = new WebGL2Optimizations(renderer);

// Reuse FBOs
const fbo = webglOptimizer.getFBO(width, height, options, 'main-fbo');

// Use instancing for repeated objects
const instancedMesh = webglOptimizer.createInstancedMesh(
  geometry, 
  material, 
  instanceCount
);
```

### Color Management

#### Use PaletteDirector
```typescript
// ✅ Good: Use PaletteDirector for colors
import { PaletteDirector } from '@/lib/palette/PaletteDirector';

const color = PaletteDirector.getColorRGB(0);
const palette = PaletteDirector.getCurrentPalette();

// ❌ Bad: Hardcoded colors
const color = '#ff0080';
```

#### Dynamic Color Updates
```typescript
// ✅ Good: Update colors dynamically
useEffect(() => {
  const currentPalette = PaletteDirector.getCurrentPalette();
  fluidInstance.config.COLOR_PALETTE = currentPalette.colors;
}, [currentPaletteId]);
```

### Audio Integration

#### Proper Audio Context Management
```typescript
// ✅ Good: Proper audio context management
const audioBus = AudioBus.getInstance();

useEffect(() => {
  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      await audioBus.start(source);
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };
  
  startAudio();
  
  return () => {
    audioBus.stop();
  };
}, []);
```

#### Audio Data Processing
```typescript
// ✅ Good: Efficient audio data processing
const processAudioData = useCallback((audioData: AudioData) => {
  const physicsParams = calculatePhysicsParams(audioData);
  
  // Apply physics parameters
  if (fluidRef.current?.config) {
    fluidRef.current.config.SPLAT_RADIUS = physicsParams.splatForce;
    fluidRef.current.config.DENSITY_DISSIPATION = physicsParams.thermalRate;
    fluidRef.current.config.VELOCITY_DISSIPATION = physicsParams.viscosity;
    fluidRef.current.config.CURL = physicsParams.curlStrength;
  }
}, []);
```

## ⚡ Performance Best Practices

### Adaptive Quality
```typescript
// ✅ Good: Use adaptive quality
const adaptiveQuality = new AdaptiveQuality();
adaptiveQuality.setPerformanceMonitor(performanceMonitor);

useEffect(() => {
  const interval = setInterval(() => {
    adaptiveQuality.adjustQuality();
  }, 2000);
  
  return () => clearInterval(interval);
}, []);
```

### Performance Monitoring
```typescript
// ✅ Good: Monitor performance
const performanceMonitor = new PerformanceMonitor();

useEffect(() => {
  performanceMonitor.start();
  
  const unsubscribe = performanceMonitor.onPerformanceChange((metrics) => {
    if (metrics.fps < 30) {
      console.warn('Low FPS detected:', metrics.fps);
    }
  });
  
  return () => {
    unsubscribe();
    performanceMonitor.stop();
  };
}, []);
```

### Memory Management
```typescript
// ✅ Good: Proper memory management
const [objects, setObjects] = useState<THREE.Object3D[]>([]);

useEffect(() => {
  const newObjects = createObjects();
  setObjects(newObjects);
  
  return () => {
    newObjects.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  };
}, []);
```

## 🧪 Testing Best Practices

### Component Testing
```typescript
// ✅ Good: Comprehensive component testing
describe('LiquidLightBackground', () => {
  const defaultProps = {
    audioData: null,
    intensity: 0.5,
    motionEnabled: true
  };
  
  it('renders without crashing', () => {
    render(<LiquidLightBackground {...defaultProps} />);
  });
  
  it('handles audio data changes', () => {
    const { rerender } = render(<LiquidLightBackground {...defaultProps} />);
    
    const audioData = {
      timestamp: Date.now(),
      volume: 0.8,
      bass: 0.6,
      mids: 0.4,
      treble: 0.3,
      beatDetected: true
    };
    
    rerender(<LiquidLightBackground {...defaultProps} audioData={audioData} />);
    expect(screen.getByText('Beat detected!')).toBeInTheDocument();
  });
  
  it('respects prefers-reduced-motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<LiquidLightBackground {...defaultProps} />);
    // Test that motion is disabled
  });
});
```

### Service Testing
```typescript
// ✅ Good: Service testing with mocks
describe('PaletteDirector', () => {
  let paletteDirector: PaletteDirector;
  
  beforeEach(() => {
    paletteDirector = PaletteDirector.getInstance();
  });
  
  afterEach(() => {
    // Clean up singleton
    (PaletteDirector as any).instance = undefined;
  });
  
  it('should be a singleton', () => {
    const anotherInstance = PaletteDirector.getInstance();
    expect(paletteDirector).toBe(anotherInstance);
  });
  
  it('should switch palettes correctly', () => {
    const success = paletteDirector.setPalette('psychedelic_swirl');
    expect(success).toBe(true);
    expect(paletteDirector.getCurrentPalette().id).toBe('psychedelic_swirl');
  });
});
```

### Performance Testing
```typescript
// ✅ Good: Performance testing
describe('Performance', () => {
  it('should maintain 60fps', async () => {
    const startTime = performance.now();
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(frameCount).toBeGreaterThan(50); // At least 50fps
  });
});
```

## 🛠️ Code Quality Best Practices

### TypeScript Usage
```typescript
// ✅ Good: Proper TypeScript usage
interface AudioData {
  timestamp: number;
  volume: number;
  bass: number;
  mids: number;
  treble: number;
  beatDetected: boolean;
}

function calculatePhysicsParams(audioData: AudioData): PhysicsParams {
  // Implementation
}

// ❌ Bad: Using any
function calculatePhysicsParams(audioData: any): any {
  // Implementation
}
```

### Error Handling
```typescript
// ✅ Good: Proper error handling
try {
  await audioBus.start(audioSource);
} catch (error) {
  console.error('Failed to start audio bus:', error);
  setError(error as Error);
  // Fallback behavior
  setAudioEnabled(false);
}

// ❌ Bad: Ignoring errors
await audioBus.start(audioSource); // What if this fails?
```

### Code Organization
```typescript
// ✅ Good: Well-organized code
export class MyService {
  private static instance: MyService;
  private isInitialized: boolean = false;
  private callbacks: Set<(data: any) => void> = new Set();
  
  // Public methods
  public static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
  
  public async start(): Promise<void> {
    // Implementation
  }
  
  // Private methods
  private initialize(): void {
    // Implementation
  }
}
```

## 🚀 Deployment Best Practices

### Environment Configuration
```typescript
// ✅ Good: Environment validation
function validateEnvironment(): EnvironmentConfig {
  const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV',
    'NEXT_PUBLIC_WEBGL_REQUIRED'
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
  
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    nodeEnv: process.env.NODE_ENV!,
    webglRequired: process.env.NEXT_PUBLIC_WEBGL_REQUIRED === 'true'
  };
}
```

### Security Headers
```typescript
// ✅ Good: Security headers
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
];
```

### Performance Optimization
```typescript
// ✅ Good: Performance optimization
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    esmExternals: true
  }
};
```

## 🎯 Accessibility Best Practices

### Motion Preferences
```typescript
// ✅ Good: Respect motion preferences
const [motionEnabled, setMotionEnabled] = useState(true);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setMotionEnabled(!mediaQuery.matches);
  
  const handleChange = (e: MediaQueryListEvent) => {
    setMotionEnabled(!e.matches);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### Keyboard Navigation
```typescript
// ✅ Good: Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      setIntensity(prev => Math.min(1, prev + 0.1));
      break;
    case 'ArrowDown':
      setIntensity(prev => Math.max(0, prev - 0.1));
      break;
    case ' ':
      setMotionEnabled(prev => !prev);
      break;
  }
};
```

### Screen Reader Support
```typescript
// ✅ Good: Screen reader support
<div
  role="img"
  aria-label="Liquid light simulation"
  aria-live="polite"
  aria-describedby="liquid-light-description"
>
  <canvas ref={canvasRef} />
</div>

<div id="liquid-light-description">
  Interactive liquid light simulation that responds to audio input
</div>
```

## 📚 Documentation Best Practices

### Code Comments
```typescript
// ✅ Good: Clear, helpful comments
/**
 * Calculates physics parameters from audio data for fluid simulation.
 * 
 * @param audioData - Real-time audio analysis data
 * @returns Physics parameters for fluid simulation
 * 
 * @example
 * ```typescript
 * const audioData = { volume: 0.8, bass: 0.6, mids: 0.4, treble: 0.3, beatDetected: true };
 * const physicsParams = calculatePhysicsParams(audioData);
 * ```
 */
function calculatePhysicsParams(audioData: AudioData): PhysicsParams {
  // Implementation
}
```

### README Files
```markdown
<!-- ✅ Good: Comprehensive README -->
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
```

---

**Follow these best practices to ensure high-quality, maintainable, and performant code! 🎨✨**
