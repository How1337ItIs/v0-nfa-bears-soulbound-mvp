# Common Issues and Solutions

This document provides solutions to the most common issues encountered when working with the Liquid Light System.

## 🎨 Visual Issues

### WebGL Context Loss / Black Screen

**Problem**: The liquid light simulation disappears, showing a black screen or the CSS fallback.

**Symptoms**:
- Black screen instead of fluid simulation
- Console errors: "WebGL context lost"
- CSS fallback appears unexpectedly

**Causes**:
- Browser tab was backgrounded for too long
- System ran out of GPU memory
- GPU driver issues or hardware acceleration disabled
- Too many WebGL contexts open

**Solutions**:

1. **Refresh the page**:
   ```bash
   # Simple refresh often resolves context loss
   Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   ```

2. **Check browser settings**:
   ```bash
   # Chrome: chrome://settings/system
   # Enable "Use hardware acceleration when available"
   
   # Firefox: about:preferences#general
   # Enable "Use recommended performance settings"
   ```

3. **Monitor GPU memory**:
   ```typescript
   // Check GPU memory usage
   const info = renderer.info.memory;
   console.log('GPU Memory:', info);
   
   // Use GPUMemoryManager to prevent leaks
   const manager = new GPUMemoryManager(renderer);
   manager.register(object);
   ```

4. **Implement context restoration**:
   ```typescript
   // Handle WebGL context loss
   canvas.addEventListener('webglcontextlost', (event) => {
     event.preventDefault();
     console.warn('WebGL context lost, switching to CSS fallback');
     setWebGLSupported(false);
   });
   
   canvas.addEventListener('webglcontextrestored', (event) => {
     console.log('WebGL context restored');
     setWebGLSupported(true);
     initializeWebGL();
   });
   ```

### Low Frame Rate / Choppy Animation

**Problem**: The liquid light simulation runs slowly or appears choppy.

**Symptoms**:
- FPS below 30
- Stuttering animation
- High CPU/GPU usage
- Browser becomes unresponsive

**Causes**:
- High resolution or complex fluid parameters
- Too many active visual layers
- High CPU usage from JavaScript logic
- Thermal throttling of the device

**Solutions**:

1. **Check AdaptiveQuality**:
   ```typescript
   // Ensure AdaptiveQuality is working
   const quality = new AdaptiveQuality();
   quality.setPerformanceMonitor(monitor);
   quality.adjustQuality();
   
   const settings = quality.getCurrentQualitySettings();
   console.log('Quality settings:', settings);
   ```

2. **Reduce intensity**:
   ```typescript
   // Lower the intensity control
   const [intensity, setIntensity] = useState(0.5); // Instead of 1.0
   ```

3. **Optimize fluid parameters**:
   ```typescript
   // Reduce fluid complexity
   const config = {
     SPLAT_RADIUS: 0.005,        // Reduce from 0.01
     DENSITY_DISSIPATION: 0.98,  // Increase from 0.95
     VELOCITY_DISSIPATION: 0.98, // Increase from 0.95
     CURL: 0.1                   // Reduce from 0.2
   };
   ```

4. **Profile performance**:
   ```typescript
   // Use PerformanceProfiler
   const profiler = new PerformanceProfiler();
   profiler.update();
   profiler.logMetrics();
   ```

5. **Check thermal throttling**:
   ```typescript
   // Monitor thermal state
   const thermalDetector = new ThermalThrottlingDetector();
   thermalDetector.onThermalStateChange((state) => {
     if (state === ThermalState.SERIOUS || state === ThermalState.CRITICAL) {
       console.warn('Thermal throttling detected, reducing quality');
       adaptiveQuality.adjustQuality();
     }
   });
   ```

### Colors Not Changing / Incorrect Palettes

**Problem**: The liquid light show uses incorrect colors or colors don't change.

**Symptoms**:
- Static colors instead of dynamic changes
- Wrong color palette displayed
- Beat-triggered color changes not working

**Causes**:
- PaletteDirector not initialized
- COLOR_PALETTE not updated in fluid config
- Beat detection not working
- Color mapping issues

**Solutions**:

1. **Verify PaletteDirector**:
   ```typescript
   // Check PaletteDirector initialization
   const palette = PaletteDirector.getCurrentPalette();
   console.log('Current palette:', palette);
   
   // Switch to a different palette
   PaletteDirector.setPalette('psychedelic_swirl');
   ```

2. **Update fluid config**:
   ```typescript
   // Ensure COLOR_PALETTE is updated
   const currentPalette = PaletteDirector.getCurrentPalette();
   fluidInstance.config.COLOR_PALETTE = currentPalette.colors;
   ```

3. **Check beat detection**:
   ```typescript
   // Verify beat detection is working
   audioBus.onBeatDetected((timestamp) => {
     console.log('Beat detected at:', timestamp);
     // Trigger color change
   });
   ```

4. **Debug color mapping**:
   ```typescript
   // Log color values
   const color = PaletteDirector.getColorRGB(0);
   console.log('Color RGB:', color);
   
   // Check if colors are being applied
   console.log('Fluid config COLOR_PALETTE:', fluidInstance.config.COLOR_PALETTE);
   ```

## 🎵 Audio Issues

### Audio Not Reacting / No Sound

**Problem**: The liquid light show doesn't respond to audio or no sound is playing.

**Symptoms**:
- No visual response to audio
- Silent audio playback
- Console errors about audio context
- Microphone permission denied

**Causes**:
- Microphone access denied
- Audio source not loaded or playing
- AudioBus not initialized
- Incorrect audio mapping

**Solutions**:

1. **Check microphone permissions**:
   ```typescript
   // Request microphone permission
   async function requestAudioPermission(): Promise<boolean> {
     try {
       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
       stream.getTracks().forEach(track => track.stop());
       return true;
     } catch (error) {
       console.error('Audio permission denied:', error);
       return false;
     }
   }
   ```

2. **Verify audio source**:
   ```typescript
   // Check if audio element is playing
   const audioElement = document.querySelector('audio');
   if (audioElement) {
     console.log('Audio paused:', audioElement.paused);
     console.log('Audio muted:', audioElement.muted);
     console.log('Audio volume:', audioElement.volume);
   }
   ```

3. **Initialize AudioBus**:
   ```typescript
   // Ensure AudioBus is started
   const audioBus = AudioBus.getInstance();
   await audioBus.start(audioSourceNode);
   
   // Check if audio is processing
   console.log('Audio processing:', audioBus.isProcessing());
   ```

4. **Debug audio data**:
   ```typescript
   // Log audio data
   audioBus.onAudioDataUpdate((data) => {
     console.log('Audio data:', data);
   });
   ```

### Audio Context Issues

**Problem**: Audio context fails to initialize or stops working.

**Symptoms**:
- "AudioContext is not supported" error
- Audio context suspended
- No audio data received

**Causes**:
- Browser doesn't support Web Audio API
- Audio context suspended by browser
- Audio context creation failed

**Solutions**:

1. **Check Web Audio API support**:
   ```typescript
   // Check if Web Audio API is supported
   if (!window.AudioContext && !window.webkitAudioContext) {
     console.error('Web Audio API not supported');
     return;
   }
   ```

2. **Resume suspended context**:
   ```typescript
   // Resume suspended audio context
   if (audioContext.state === 'suspended') {
     await audioContext.resume();
   }
   ```

3. **Handle context state changes**:
   ```typescript
   // Monitor audio context state
   audioContext.addEventListener('statechange', () => {
     console.log('Audio context state:', audioContext.state);
   });
   ```

## ⚡ Performance Issues

### Memory Leaks

**Problem**: Memory usage increases over time, eventually causing crashes.

**Symptoms**:
- Increasing memory usage in DevTools
- Browser becomes slow or crashes
- GPU memory warnings

**Causes**:
- Objects not disposed properly
- Event listeners not removed
- WebGL resources not cleaned up

**Solutions**:

1. **Use GPUMemoryManager**:
   ```typescript
   // Register objects for cleanup
   const manager = new GPUMemoryManager(renderer);
   manager.register(geometry);
   manager.register(material);
   manager.register(texture);
   
   // Cleanup on unmount
   useEffect(() => {
     return () => {
       manager.disposeAll();
     };
   }, []);
   ```

2. **Remove event listeners**:
   ```typescript
   // Store cleanup functions
   const cleanup = audioBus.onAudioDataUpdate((data) => {
     // Handle data
   });
   
   // Cleanup on unmount
   useEffect(() => {
     return cleanup;
   }, []);
   ```

3. **Dispose WebGL resources**:
   ```typescript
   // Dispose of WebGL resources
   geometry.dispose();
   material.dispose();
   texture.dispose();
   renderTarget.dispose();
   ```

### High CPU Usage

**Problem**: High CPU usage causing poor performance.

**Symptoms**:
- High CPU usage in Task Manager
- Browser becomes unresponsive
- Poor performance on low-end devices

**Causes**:
- Complex calculations in render loop
- Inefficient algorithms
- Too many DOM updates

**Solutions**:

1. **Optimize render loop**:
   ```typescript
   // Use requestAnimationFrame
   function animate() {
     // Update logic
     requestAnimationFrame(animate);
   }
   animate();
   ```

2. **Use Web Workers**:
   ```typescript
   // Move heavy calculations to Web Worker
   const worker = new Worker('/audio-processor.js');
   worker.postMessage(audioData);
   worker.onmessage = (event) => {
     const processedData = event.data;
     // Use processed data
   };
   ```

3. **Debounce updates**:
   ```typescript
   // Debounce frequent updates
   const debouncedUpdate = debounce((data) => {
     // Update UI
   }, 16); // ~60fps
   ```

## 🧪 Testing Issues

### Tests Not Running

**Problem**: Jest tests fail to run or execute.

**Symptoms**:
- "No tests found" error
- Tests fail to compile
- Timeout errors

**Causes**:
- Incorrect test file patterns
- Missing dependencies
- Configuration issues

**Solutions**:

1. **Check test file patterns**:
   ```javascript
   // jest.config.js
   testMatch: [
     '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
     '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
   ]
   ```

2. **Install missing dependencies**:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom
   ```

3. **Check Jest configuration**:
   ```javascript
   // jest.config.js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
   };
   ```

### WebGL Tests Failing

**Problem**: Tests involving WebGL fail to run.

**Symptoms**:
- "WebGL is not supported" errors
- Canvas context creation fails
- Mock WebGL not working

**Solutions**:

1. **Mock WebGL context**:
   ```typescript
   // jest.setup.js
   global.WebGL2RenderingContext = jest.fn();
   global.HTMLCanvasElement = jest.fn();
   ```

2. **Mock Three.js**:
   ```typescript
   // Mock Three.js
   jest.mock('three', () => ({
     WebGLRenderer: jest.fn(),
     Scene: jest.fn(),
     PerspectiveCamera: jest.fn()
   }));
   ```

## 🔧 Development Issues

### TypeScript Errors

**Problem**: TypeScript compilation errors.

**Symptoms**:
- "Type 'X' is not assignable to type 'Y'" errors
- "Property 'X' does not exist on type 'Y'" errors
- "Cannot find module" errors

**Solutions**:

1. **Check type definitions**:
   ```typescript
   // Ensure proper types are imported
   import { AudioData, PhysicsParams } from '@/lib/visual/types';
   ```

2. **Add missing types**:
   ```typescript
   // Add type assertions where needed
   const element = document.getElementById('canvas') as HTMLCanvasElement;
   ```

3. **Update tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

### Build Failures

**Problem**: Production build fails.

**Symptoms**:
- Build process exits with error
- Missing dependencies
- TypeScript compilation errors

**Solutions**:

1. **Check dependencies**:
   ```bash
   npm install
   npm audit fix
   ```

2. **Clear build cache**:
   ```bash
   npm run clean
   rm -rf .next node_modules/.cache
   npm install
   ```

3. **Check environment variables**:
   ```bash
   # Ensure all required environment variables are set
   echo $NEXT_PUBLIC_APP_URL
   echo $NODE_ENV
   ```

## 🚨 Emergency Procedures

### Complete System Reset

If all else fails, perform a complete system reset:

```bash
# Stop all processes
pkill -f "next dev"
pkill -f "npm run dev"

# Clean everything
npm run clean:all
rm -rf .next dist build coverage node_modules package-lock.json

# Reinstall everything
npm install

# Restart development
npm run dev
```

### Rollback to Previous Version

```bash
# Check git history
git log --oneline

# Rollback to previous commit
git reset --hard HEAD~1

# Or rollback to specific commit
git reset --hard <commit-hash>

# Force push if necessary
git push --force-with-lease
```

---

**Need more help? Check the [API Reference](../api/APIReference.md) or [GitHub Issues](https://github.com/your-org/nfa-bears-mvp/issues) for additional support! 🎨✨**
