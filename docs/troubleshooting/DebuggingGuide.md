# Debugging Guide

This guide provides comprehensive debugging techniques and tools for the Liquid Light System.

## 🔍 Debugging Tools

### Browser Developer Tools

#### Chrome DevTools
1. **Console Tab**: For logging and error messages
2. **Elements Tab**: Inspect DOM structure and CSS
3. **Performance Tab**: Profile CPU and GPU usage
4. **Memory Tab**: Monitor memory usage and detect leaks
5. **Network Tab**: Check resource loading times
6. **Application Tab**: Inspect storage and service workers
7. **Security Tab**: Check HTTPS and certificate issues
8. **Lighthouse Tab**: Performance and accessibility audits

#### Firefox Developer Tools
1. **Console**: JavaScript logging and errors
2. **Inspector**: DOM and CSS inspection
3. **Performance**: Performance profiling
4. **Memory**: Memory usage analysis
5. **Network**: Network request monitoring
6. **Storage**: Local storage inspection

#### Safari Web Inspector
1. **Console**: JavaScript debugging
2. **Elements**: DOM inspection
3. **Resources**: Network and storage
4. **Timeline**: Performance profiling
5. **Storage**: Local storage and databases

### WebGL Debugging Tools

#### WebGL Inspector
- **Installation**: Chrome extension or Firefox addon
- **Features**: 
  - WebGL context inspection
  - Shader debugging
  - Texture and buffer analysis
  - Draw call visualization

#### Spector.js
- **Installation**: `npm install spectorjs`
- **Usage**:
  ```typescript
  import { Spector } from 'spectorjs';
  
  const spector = new Spector();
  spector.displayUI();
  spector.captureCanvas(canvas);
  ```

#### Three.js Inspector
- **Installation**: `npm install three-inspector`
- **Usage**:
  ```typescript
  import { Inspector } from 'three-inspector';
  
  const inspector = new Inspector(renderer, scene, camera);
  inspector.toggle();
  ```

### Audio Debugging Tools

#### Web Audio API Inspector
- **Chrome Extension**: Web Audio API Inspector
- **Features**:
  - Audio context visualization
  - Node graph display
  - Real-time audio analysis
  - Frequency spectrum display

#### Audio Context Debugger
```typescript
// Custom audio debugging
function debugAudioContext(audioContext: AudioContext) {
  console.log('Audio Context State:', audioContext.state);
  console.log('Sample Rate:', audioContext.sampleRate);
  console.log('Base Latency:', audioContext.baseLatency);
  
  // Monitor state changes
  audioContext.addEventListener('statechange', () => {
    console.log('Audio Context State Changed:', audioContext.state);
  });
}
```

## 🐛 Debugging Techniques

### Console Logging

#### Basic Logging
```typescript
// Different log levels
console.log('General information');
console.warn('Warning message');
console.error('Error message');
console.info('Informational message');
console.debug('Debug information');

// Grouped logging
console.group('Liquid Light Debug');
console.log('Audio Data:', audioData);
console.log('Physics Params:', physicsParams);
console.log('Performance:', performanceMetrics);
console.groupEnd();
```

#### Conditional Logging
```typescript
// Debug mode logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}

// Feature flag logging
if (features.debugMode) {
  console.log('Debug mode enabled');
}

// Performance logging
if (performanceMetrics.fps < 30) {
  console.warn('Low FPS detected:', performanceMetrics.fps);
}
```

#### Structured Logging
```typescript
// Structured log format
interface LogEntry {
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

function log(level: LogEntry['level'], category: string, message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: Date.now(),
    level,
    category,
    message,
    data,
    stack: level === 'error' ? new Error().stack : undefined
  };
  
  console[level](`[${category}] ${message}`, data);
  
  // Send to logging service in production
  if (process.env.NODE_ENV === 'production') {
    sendToLoggingService(entry);
  }
}

// Usage
log('info', 'AudioBus', 'Audio processing started');
log('error', 'WebGL', 'Context lost', { error: 'WebGLContextLostError' });
```

### Performance Debugging

#### FPS Monitoring
```typescript
// FPS counter
class FPSCounter {
  private frames = 0;
  private lastTime = 0;
  private fps = 0;
  
  update() {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
      
      console.log(`FPS: ${this.fps}`);
    }
  }
}

const fpsCounter = new FPSCounter();
function animate() {
  fpsCounter.update();
  requestAnimationFrame(animate);
}
animate();
```

#### Memory Monitoring
```typescript
// Memory usage monitoring
function monitorMemory() {
  if (performance.memory) {
    const memory = performance.memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    });
  }
}

// Monitor every 5 seconds
setInterval(monitorMemory, 5000);
```

#### WebGL Performance
```typescript
// WebGL performance monitoring
function monitorWebGLPerformance(renderer: THREE.WebGLRenderer) {
  const info = renderer.info;
  console.log('WebGL Performance:', {
    render: {
      calls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines
    },
    memory: {
      geometries: info.memory.geometries,
      textures: info.memory.textures
    },
    programs: info.programs?.length || 0
  });
}
```

### Error Debugging

#### Error Boundaries
```typescript
// React Error Boundary
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      sendErrorToTrackingService(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

#### Global Error Handling
```typescript
// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  sendErrorToTrackingService(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  sendErrorToTrackingService(event.reason, {
    type: 'unhandledrejection'
  });
});
```

### Network Debugging

#### Request Monitoring
```typescript
// Monitor network requests
function monitorNetworkRequests() {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const startTime = performance.now();
    console.log('Fetch request:', args[0]);
    
    try {
      const response = await originalFetch(...args);
      const endTime = performance.now();
      console.log('Fetch response:', {
        url: args[0],
        status: response.status,
        duration: endTime - startTime
      });
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
}
```

#### Resource Loading
```typescript
// Monitor resource loading
function monitorResourceLoading() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        console.log('Resource loaded:', {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType
        });
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}
```

## 🛠️ Debugging Utilities

### Debug Overlay
```typescript
// Debug overlay component
interface DebugOverlayProps {
  performanceMetrics: PerformanceMetrics;
  audioData: AudioData | null;
  webglSupported: boolean;
  audioSupported: boolean;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  performanceMetrics,
  audioData,
  webglSupported,
  audioSupported
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>FPS: {performanceMetrics.fps.toFixed(1)}</div>
      <div>Frame Time: {performanceMetrics.frameTime.toFixed(2)}ms</div>
      <div>Memory: {performanceMetrics.memoryUsage.toFixed(1)}MB</div>
      <div>WebGL: {webglSupported ? '✓' : '✗'}</div>
      <div>Audio: {audioSupported ? '✓' : '✗'}</div>
      {audioData && (
        <div>
          <div>Volume: {audioData.volume.toFixed(2)}</div>
          <div>Bass: {audioData.bass.toFixed(2)}</div>
          <div>Mids: {audioData.mids.toFixed(2)}</div>
          <div>Treble: {audioData.treble.toFixed(2)}</div>
          <div>Beat: {audioData.beatDetected ? '✓' : '✗'}</div>
        </div>
      )}
    </div>
  );
};
```

### Debug Controls
```typescript
// Debug controls component
export const DebugControls: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [performanceOverlay, setPerformanceOverlay] = useState(false);
  const [webglDebug, setWebglDebug] = useState(false);
  const [audioDebug, setAudioDebug] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      left: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      zIndex: 9999
    }}>
      <button onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? 'Hide' : 'Show'} Debug
      </button>
      
      {showDebug && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={performanceOverlay}
              onChange={(e) => setPerformanceOverlay(e.target.checked)}
            />
            Performance Overlay
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={webglDebug}
              onChange={(e) => setWebglDebug(e.target.checked)}
            />
            WebGL Debug
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={audioDebug}
              onChange={(e) => setAudioDebug(e.target.checked)}
            />
            Audio Debug
          </label>
        </div>
      )}
    </div>
  );
};
```

### Debug Hooks
```typescript
// Debug hooks
export function useDebugLog(name: string, value: any) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${name}]`, value);
    }
  }, [name, value]);
}

export function usePerformanceDebug() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const monitor = new PerformanceMonitor();
    monitor.start();
    
    const unsubscribe = monitor.onPerformanceChange((newMetrics) => {
      setMetrics(newMetrics);
    });
    
    return () => {
      unsubscribe();
      monitor.stop();
    };
  }, []);
  
  return metrics;
}
```

## 🔧 Debugging Scripts

### Performance Profiler
```typescript
// Performance profiling script
class PerformanceProfiler {
  private startTime: number = 0;
  private measurements: Map<string, number[]> = new Map();
  
  start(label: string) {
    this.startTime = performance.now();
    console.log(`Starting ${label}...`);
  }
  
  end(label: string) {
    const duration = performance.now() - this.startTime;
    
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    
    this.measurements.get(label)!.push(duration);
    console.log(`${label} took ${duration.toFixed(2)}ms`);
    
    return duration;
  }
  
  getAverage(label: string): number {
    const measurements = this.measurements.get(label) || [];
    return measurements.reduce((a, b) => a + b, 0) / measurements.length;
  }
  
  getReport(): Record<string, number> {
    const report: Record<string, number> = {};
    
    for (const [label, measurements] of this.measurements) {
      report[label] = this.getAverage(label);
    }
    
    return report;
  }
}

// Usage
const profiler = new PerformanceProfiler();
profiler.start('fluid-update');
// ... fluid update code ...
profiler.end('fluid-update');
```

### Memory Leak Detector
```typescript
// Memory leak detection
class MemoryLeakDetector {
  private snapshots: Map<string, number> = new Map();
  private interval: number | null = null;
  
  start(label: string) {
    this.snapshots.set(label, this.getMemoryUsage());
  }
  
  check(label: string) {
    const current = this.getMemoryUsage();
    const previous = this.snapshots.get(label) || 0;
    const difference = current - previous;
    
    if (difference > 10) { // 10MB threshold
      console.warn(`Potential memory leak in ${label}: +${difference.toFixed(2)}MB`);
    }
    
    this.snapshots.set(label, current);
  }
  
  private getMemoryUsage(): number {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }
}

// Usage
const leakDetector = new MemoryLeakDetector();
leakDetector.start('component-mount');
// ... component logic ...
leakDetector.check('component-mount');
```

---

**Happy debugging! 🐛✨ Remember to remove debug code before production deployment!**
