# Liquid Light System Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting solutions for common issues with the Liquid Light System. It covers WebGL problems, audio issues, performance problems, and integration challenges.

## Quick Diagnostic Checklist

### 1. System Requirements Check
- [ ] WebGL 2.0 support
- [ ] Modern browser (Chrome 56+, Firefox 51+, Safari 15+)
- [ ] Sufficient GPU memory (1GB+)
- [ ] Audio permissions granted
- [ ] No browser extensions blocking WebGL

### 2. Performance Check
- [ ] FPS above 30
- [ ] Memory usage below 80%
- [ ] No thermal throttling
- [ ] GPU drivers up to date

### 3. Audio Check
- [ ] Microphone permissions granted
- [ ] Audio context created successfully
- [ ] Audio data being received
- [ ] No audio context suspension

## Common Issues and Solutions

### WebGL Issues

#### Issue: "WebGL not supported"
**Symptoms:**
- Black screen or error message
- Console error: "WebGL not supported"
- Fallback to CSS mode

**Solutions:**
1. **Check browser support:**
   ```javascript
   const canvas = document.createElement('canvas');
   const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
   if (!gl) {
     console.error('WebGL not supported');
   }
   ```

2. **Enable WebGL in browser:**
   - Chrome: `chrome://flags/#enable-webgl2`
   - Firefox: `about:config` → `webgl.force-enabled`
   - Safari: `Develop` → `Enable WebGL`

3. **Update graphics drivers:**
   - Windows: Device Manager → Display adapters
   - macOS: System Preferences → Software Update
   - Linux: `sudo apt update && sudo apt upgrade`

#### Issue: "WebGL context lost"
**Symptoms:**
- Liquid light stops working
- Console error: "WebGL context lost"
- Automatic fallback to CSS

**Solutions:**
1. **Handle context loss:**
   ```javascript
   canvas.addEventListener('webglcontextlost', (event) => {
     event.preventDefault();
     console.warn('WebGL context lost, switching to CSS fallback');
     // Switch to CSS fallback
   });
   ```

2. **Prevent context loss:**
   ```javascript
   // Avoid excessive memory usage
   const memoryManager = new GPUMemoryManager(gl);
   memoryManager.setMaxMemoryUsage(0.8);
   
   // Clean up resources regularly
   setInterval(() => {
     memoryManager.cleanupUnusedResources();
   }, 5000);
   ```

3. **Recover from context loss:**
   ```javascript
   canvas.addEventListener('webglcontextrestored', () => {
     console.log('WebGL context restored');
     // Reinitialize WebGL
     initializeWebGL();
   });
   ```

#### Issue: "Out of memory"
**Symptoms:**
- WebGL errors about memory
- Performance degradation
- Browser crash

**Solutions:**
1. **Enable memory pooling:**
   ```javascript
   const memoryManager = new GPUMemoryManager(gl);
   memoryManager.createTexturePool('particles', 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, 10);
   ```

2. **Reduce texture quality:**
   ```javascript
   const qualityManager = new AdaptiveQualityManager(deviceProfile, targets);
   qualityManager.setPerformanceTargets({
     maxMemoryUsage: 0.6
   });
   ```

3. **Clean up resources:**
   ```javascript
   // Clean up unused textures
   memoryManager.cleanupUnusedResources();
   
   // Reduce particle count
   settings.particleCount = Math.min(settings.particleCount, 5000);
   ```

### Audio Issues

#### Issue: "Audio not working"
**Symptoms:**
- No audio reactivity
- Console error: "Audio not supported"
- Microphone permission denied

**Solutions:**
1. **Check microphone permissions:**
   ```javascript
   navigator.mediaDevices.getUserMedia({ audio: true })
     .then(stream => {
       console.log('Microphone access granted');
       stream.getTracks().forEach(track => track.stop());
     })
     .catch(error => {
       console.error('Microphone access denied:', error);
     });
   ```

2. **Handle audio context suspension:**
   ```javascript
   const audioContext = new AudioContext();
   
   if (audioContext.state === 'suspended') {
     await audioContext.resume();
   }
   
   // Handle user interaction requirement
   document.addEventListener('click', async () => {
     if (audioContext.state === 'suspended') {
       await audioContext.resume();
     }
   });
   ```

3. **Use fallback audio data:**
   ```javascript
   try {
     const audioData = await AudioBus.getCurrentData();
   } catch (error) {
     console.warn('Audio not available, using fallback');
     const fallbackData = generateFallbackAudioData();
   }
   ```

#### Issue: "Audio context suspended"
**Symptoms:**
- Audio stops working after page load
- Console warning: "Audio context suspended"
- No audio reactivity

**Solutions:**
1. **Resume audio context:**
   ```javascript
   const resumeAudio = async () => {
     if (audioContext.state === 'suspended') {
       await audioContext.resume();
     }
   };
   
   // Resume on user interaction
   document.addEventListener('click', resumeAudio);
   document.addEventListener('keydown', resumeAudio);
   ```

2. **Check audio context state:**
   ```javascript
   audioContext.addEventListener('statechange', () => {
     console.log('Audio context state:', audioContext.state);
     if (audioContext.state === 'suspended') {
       // Show user prompt to click to resume
     }
   });
   ```

#### Issue: "No audio data received"
**Symptoms:**
- Audio permissions granted but no data
- Console error: "No audio data"
- Static visual effects

**Solutions:**
1. **Check audio analysis:**
   ```javascript
   const analyser = audioContext.createAnalyser();
   analyser.fftSize = 2048;
   
   const dataArray = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(dataArray);
   
   const hasData = dataArray.some(value => value > 0);
   if (!hasData) {
     console.warn('No audio data detected');
   }
   ```

2. **Verify microphone connection:**
   ```javascript
   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
   const source = audioContext.createMediaStreamSource(stream);
   source.connect(analyser);
   
   // Check if microphone is working
   const dataArray = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(dataArray);
   ```

3. **Use test audio:**
   ```javascript
   // Generate test audio for debugging
   const oscillator = audioContext.createOscillator();
   const gainNode = audioContext.createGain();
   
   oscillator.connect(gainNode);
   gainNode.connect(analyser);
   
   oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
   gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
   
   oscillator.start();
   ```

### Performance Issues

#### Issue: "Low FPS"
**Symptoms:**
- Choppy animation
- FPS below 30
- Console warning: "Low FPS detected"

**Solutions:**
1. **Enable adaptive quality:**
   ```javascript
   const qualityManager = new AdaptiveQualityManager(deviceProfile, {
     targetFPS: 60,
     minFPS: 30,
     maxMemoryUsage: 0.8
   });
   
   qualityManager.updatePerformance(fps, frameTime, memoryUsage);
   ```

2. **Reduce particle count:**
   ```javascript
   const settings = qualityManager.getCurrentSettings();
   if (fps < 30) {
     settings.particleCount = Math.max(1000, settings.particleCount * 0.8);
   }
   ```

3. **Disable expensive effects:**
   ```javascript
   if (fps < 30) {
     settings.enablePostProcessing = false;
     settings.enableShadows = false;
     settings.enableReflections = false;
   }
   ```

#### Issue: "High memory usage"
**Symptoms:**
- Browser slowdown
- Memory usage above 80%
- Console warning: "High memory usage"

**Solutions:**
1. **Enable memory management:**
   ```javascript
   const memoryManager = new GPUMemoryManager(gl);
   memoryManager.setMaxMemoryUsage(0.8);
   
   // Clean up unused resources
   setInterval(() => {
     memoryManager.cleanupUnusedResources();
   }, 5000);
   ```

2. **Reduce texture resolution:**
   ```javascript
   const settings = qualityManager.getCurrentSettings();
   if (memoryUsage > 0.8) {
     settings.resolution = Math.max(0.5, settings.resolution * 0.9);
   }
   ```

3. **Use texture pooling:**
   ```javascript
   const texturePool = memoryManager.createTexturePool(
     'particles',
     256, 256,
     gl.RGBA,
     gl.UNSIGNED_BYTE,
     5
   );
   ```

#### Issue: "Thermal throttling"
**Symptoms:**
- Performance degrades over time
- Device gets hot
- Console warning: "Thermal throttling detected"

**Solutions:**
1. **Enable thermal detection:**
   ```javascript
   const thermalDetector = new ThermalThrottlingDetector();
   thermalDetector.startMonitoring();
   
   thermalDetector.updatePerformance(fps, frameTime);
   
   const status = thermalDetector.getThermalStatus();
   if (status.isThrottled) {
     qualityManager.reduceQuality();
   }
   ```

2. **Reduce quality on throttling:**
   ```javascript
   if (thermalDetector.isThrottlingDetected()) {
     settings.particleCount = Math.max(1000, settings.particleCount * 0.7);
     settings.resolution = Math.max(0.5, settings.resolution * 0.8);
     settings.updateRate = Math.max(30, settings.updateRate - 10);
   }
   ```

3. **Allow device to cool:**
   ```javascript
   if (thermalDetector.getThrottlingDuration() > 30000) { // 30 seconds
     // Pause rendering to allow cooling
     pauseRendering();
     setTimeout(() => {
       resumeRendering();
     }, 10000); // 10 second pause
   }
   ```

### Integration Issues

#### Issue: "Component not rendering"
**Symptoms:**
- LiquidLightBackground not visible
- Console error: "Component not rendering"
- Blank screen

**Solutions:**
1. **Check component props:**
   ```javascript
   <LiquidLightBackground
     audioData={audioData}
     intensity={0.8}
     motionEnabled={true}
     className="liquid-light-bg"
   />
   ```

2. **Verify WebGL context:**
   ```javascript
   const canvas = canvasRef.current;
   const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
   if (!gl) {
     console.error('WebGL context not available');
     return;
   }
   ```

3. **Check CSS styling:**
   ```css
   .liquid-light-bg {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     z-index: -1;
   }
   ```

#### Issue: "Audio not reactive"
**Symptoms:**
- Visual effects not responding to audio
- Static liquid light
- Console error: "Audio not reactive"

**Solutions:**
1. **Check audio data flow:**
   ```javascript
   useEffect(() => {
     if (!audioData) return;
     
     console.log('Audio data:', audioData);
     
     // Update fluid parameters
     if (fluidRef.current) {
       fluidRef.current.config.SPLAT_RADIUS = audioData.bass * 0.5;
       fluidRef.current.config.DENSITY_DISSIPATION = audioData.mids * 0.3;
     }
   }, [audioData]);
   ```

2. **Verify audio analysis:**
   ```javascript
   const audioData = AudioBus.getCurrentData();
   if (audioData && audioData.volume > 0) {
     console.log('Audio data received:', audioData);
   } else {
     console.warn('No audio data available');
   }
   ```

3. **Check parameter mapping:**
   ```javascript
   const physicsParams = calculatePhysicsParams(audioData);
   console.log('Physics params:', physicsParams);
   
   // Apply to fluid
   if (fluidRef.current && fluidRef.current.config) {
     Object.assign(fluidRef.current.config, physicsParams);
   }
   ```

### Browser-Specific Issues

#### Chrome Issues

**Issue: "WebGL context lost on tab switch"**
```javascript
// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause rendering
    pauseRendering();
  } else {
    // Resume rendering
    resumeRendering();
  }
});
```

**Issue: "Audio context suspended on tab switch"**
```javascript
// Resume audio context on visibility change
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
});
```

#### Firefox Issues

**Issue: "WebGL not working in private mode"**
```javascript
// Check if WebGL is available
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
if (!gl) {
  console.error('WebGL not available, possibly due to private mode');
  // Use CSS fallback
}
```

#### Safari Issues

**Issue: "Audio context not working"**
```javascript
// Handle Safari audio context restrictions
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (audioContext.state === 'suspended') {
  // Resume on user interaction
  document.addEventListener('click', async () => {
    await audioContext.resume();
  });
}
```

## Debug Tools

### 1. Performance Monitor

```javascript
class DebugPerformanceMonitor {
  constructor() {
    this.profiler = new PerformanceProfiler();
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      z-index: 1000;
    `;
    document.body.appendChild(this.overlay);
  }

  update() {
    const metrics = this.profiler.getCurrentMetrics();
    if (metrics) {
      this.overlay.innerHTML = `
        FPS: ${metrics.fps.toFixed(1)}<br>
        Frame: ${metrics.frameTime.toFixed(2)}ms<br>
        Draw Calls: ${metrics.drawCalls}<br>
        Triangles: ${metrics.triangles.toLocaleString()}<br>
        Memory: ${(metrics.memoryUsage * 100).toFixed(1)}%<br>
        GPU: ${metrics.gpuTime.toFixed(2)}ms
      `;
    }
  }
}
```

### 2. Audio Debugger

```javascript
class DebugAudioMonitor {
  constructor() {
    this.audioData = null;
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      z-index: 1000;
    `;
    document.body.appendChild(this.overlay);
  }

  update(audioData) {
    this.audioData = audioData;
    if (audioData) {
      this.overlay.innerHTML = `
        Bass: ${(audioData.bass * 100).toFixed(1)}%<br>
        Mids: ${(audioData.mids * 100).toFixed(1)}%<br>
        Treble: ${(audioData.treble * 100).toFixed(1)}%<br>
        Volume: ${(audioData.volume * 100).toFixed(1)}%<br>
        Beat: ${audioData.beatDetected ? 'YES' : 'NO'}
      `;
    }
  }
}
```

### 3. Error Logger

```javascript
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });
  }

  logError(type, error) {
    const errorInfo = {
      type,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    this.errors.push(errorInfo);
    console.error('Error logged:', errorInfo);
  }

  getErrors() {
    return this.errors;
  }
}
```

## Testing Checklist

### 1. Basic Functionality
- [ ] WebGL context created successfully
- [ ] Fluid simulation running
- [ ] Audio analysis working
- [ ] Visual effects responding to audio
- [ ] Performance within acceptable limits

### 2. Performance Testing
- [ ] FPS above 30 on target devices
- [ ] Memory usage below 80%
- [ ] No thermal throttling
- [ ] Smooth animation
- [ ] Responsive controls

### 3. Audio Testing
- [ ] Microphone permissions granted
- [ ] Audio context created
- [ ] Audio data received
- [ ] Beat detection working
- [ ] Visual reactivity to audio

### 4. Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 5. Device Testing
- [ ] Desktop (Windows, macOS, Linux)
- [ ] Mobile (iOS, Android)
- [ ] Tablet (iPad, Android tablets)
- [ ] Low-end devices
- [ ] High-end devices

## Getting Help

### 1. Check Console Logs
Always check the browser console for error messages and warnings.

### 2. Enable Debug Mode
```javascript
// Enable debug logging
const DEBUG = true;
if (DEBUG) {
  console.log('Debug mode enabled');
  // Enable additional logging
}
```

### 3. Use Browser DevTools
- Performance tab for profiling
- Memory tab for memory analysis
- Network tab for resource loading
- Console tab for error messages

### 4. Report Issues
When reporting issues, include:
- Browser version and OS
- Console error messages
- Steps to reproduce
- Expected vs actual behavior
- Performance metrics if available

## Conclusion

This troubleshooting guide covers the most common issues with the Liquid Light System. For additional help, check the console logs, use the debug tools, and refer to the performance optimization guide for advanced tuning.
