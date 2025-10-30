# Audio Integration Patterns for Liquid Light System

## Overview

The Liquid Light System provides comprehensive audio integration patterns for creating reactive visual experiences. This document covers audio analysis, parameter mapping, and integration strategies.

## Audio Architecture

### Core Components

#### AudioBus
Centralized audio analysis and distribution system.

```typescript
class AudioBus {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private subscribers: ((data: AudioData) => void)[] = [];
  private isAnalyzing: boolean = false;
}
```

#### AudioData Interface
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

## Audio Analysis Patterns

### 1. Frequency Band Analysis

#### Basic Frequency Analysis
```typescript
class FrequencyAnalyzer {
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private bassRange = [0, 3];    // 20-250 Hz
  private midsRange = [3, 20];   // 250-4000 Hz
  private trebleRange = [20, 64]; // 4000-20000 Hz

  analyze(): AudioData {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const bass = this.calculateBandEnergy(this.bassRange);
    const mids = this.calculateBandEnergy(this.midsRange);
    const treble = this.calculateBandEnergy(this.trebleRange);
    const volume = this.calculateVolume();
    
    return {
      bass,
      mids,
      treble,
      volume,
      beatDetected: this.detectBeat(bass),
      timestamp: performance.now()
    };
  }

  private calculateBandEnergy(range: [number, number]): number {
    const [start, end] = range;
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += this.dataArray[i];
    }
    return sum / (end - start) / 255; // Normalize to 0-1
  }
}
```

#### Advanced Frequency Analysis
```typescript
class AdvancedFrequencyAnalyzer {
  private fft: FFT;
  private windowSize: number = 1024;
  private sampleRate: number = 44100;

  analyze(audioBuffer: AudioBuffer): AudioData {
    const channelData = audioBuffer.getChannelData(0);
    const fftData = this.fft.forward(channelData);
    
    // Calculate frequency bands with proper Hz mapping
    const bass = this.calculateBandEnergy(fftData, 20, 250);
    const mids = this.calculateBandEnergy(fftData, 250, 4000);
    const treble = this.calculateBandEnergy(fftData, 4000, 20000);
    
    return {
      bass,
      mids,
      treble,
      volume: this.calculateRMS(channelData),
      beatDetected: this.detectBeat(bass),
      timestamp: performance.now()
    };
  }

  private calculateBandEnergy(fftData: number[], lowHz: number, highHz: number): number {
    const lowBin = Math.floor(lowHz * this.windowSize / this.sampleRate);
    const highBin = Math.floor(highHz * this.windowSize / this.sampleRate);
    
    let sum = 0;
    for (let i = lowBin; i < highBin; i++) {
      sum += fftData[i] * fftData[i];
    }
    
    return Math.sqrt(sum / (highBin - lowBin));
  }
}
```

### 2. Beat Detection Patterns

#### Simple Beat Detection
```typescript
class SimpleBeatDetector {
  private energyHistory: number[] = [];
  private threshold: number = 1.3;
  private historyLength: number = 43; // ~1 second at 60fps

  detectBeat(currentEnergy: number): boolean {
    this.energyHistory.push(currentEnergy);
    
    if (this.energyHistory.length > this.historyLength) {
      this.energyHistory.shift();
    }
    
    if (this.energyHistory.length < this.historyLength) return false;
    
    const average = this.energyHistory.reduce((a, b) => a + b) / this.historyLength;
    return currentEnergy > average * this.threshold;
  }
}
```

#### Advanced Beat Detection
```typescript
class AdvancedBeatDetector {
  private energyHistory: number[] = [];
  private varianceHistory: number[] = [];
  private threshold: number = 1.3;
  private varianceThreshold: number = 0.1;
  private historyLength: number = 43;

  detectBeat(currentEnergy: number): boolean {
    this.energyHistory.push(currentEnergy);
    
    if (this.energyHistory.length > this.historyLength) {
      this.energyHistory.shift();
    }
    
    if (this.energyHistory.length < this.historyLength) return false;
    
    const average = this.energyHistory.reduce((a, b) => a + b) / this.historyLength;
    const variance = this.calculateVariance(this.energyHistory, average);
    
    this.varianceHistory.push(variance);
    if (this.varianceHistory.length > this.historyLength) {
      this.varianceHistory.shift();
    }
    
    const avgVariance = this.varianceHistory.reduce((a, b) => a + b) / this.varianceHistory.length;
    
    return currentEnergy > average * this.threshold && variance > avgVariance * this.varianceThreshold;
  }

  private calculateVariance(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b) / values.length;
  }
}
```

### 3. Volume Analysis

#### RMS Volume Calculation
```typescript
class VolumeAnalyzer {
  calculateRMS(audioData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    return Math.sqrt(sum / audioData.length);
  }

  calculatePeak(audioData: Float32Array): number {
    let peak = 0;
    for (let i = 0; i < audioData.length; i++) {
      peak = Math.max(peak, Math.abs(audioData[i]));
    }
    return peak;
  }
}
```

## Parameter Mapping Patterns

### 1. Physics Parameter Mapping

#### Basic Mapping
```typescript
class PhysicsParameterMapper {
  mapAudioToPhysics(audioData: AudioData): PhysicsParams {
    return {
      splatForce: audioData.bass * 0.5 + 0.1,
      thermalRate: audioData.mids * 0.3 + 0.7,
      colorPhase: audioData.treble * Math.PI * 2,
      globalIntensity: audioData.volume,
      curlStrength: audioData.bass * 0.4 + 0.1,
      viscosity: audioData.mids * 0.2 + 0.8
    };
  }
}
```

#### Advanced Mapping with Smoothing
```typescript
class AdvancedPhysicsMapper {
  private smoothingFactor: number = 0.1;
  private previousParams: PhysicsParams;

  mapAudioToPhysics(audioData: AudioData): PhysicsParams {
    const rawParams = this.calculateRawParams(audioData);
    
    if (!this.previousParams) {
      this.previousParams = rawParams;
      return rawParams;
    }
    
    // Smooth parameter changes
    return {
      splatForce: this.smooth(this.previousParams.splatForce, rawParams.splatForce),
      thermalRate: this.smooth(this.previousParams.thermalRate, rawParams.thermalRate),
      colorPhase: this.smooth(this.previousParams.colorPhase, rawParams.colorPhase),
      globalIntensity: this.smooth(this.previousParams.globalIntensity, rawParams.globalIntensity),
      curlStrength: this.smooth(this.previousParams.curlStrength, rawParams.curlStrength),
      viscosity: this.smooth(this.previousParams.viscosity, rawParams.viscosity)
    };
  }

  private smooth(previous: number, current: number): number {
    return previous + (current - previous) * this.smoothingFactor;
  }
}
```

### 2. Visual Parameter Mapping

#### Color Mapping
```typescript
class ColorMapper {
  mapAudioToColor(audioData: AudioData): ColorData {
    const hue = audioData.treble * 360;
    const saturation = audioData.mids * 100;
    const lightness = audioData.volume * 50 + 25;
    
    return {
      hue,
      saturation,
      lightness,
      alpha: audioData.bass * 0.8 + 0.2
    };
  }
}
```

#### Effect Parameter Mapping
```typescript
class EffectParameterMapper {
  mapAudioToEffects(audioData: AudioData): EffectParams {
    return {
      distortion: audioData.bass * 0.5,
      blur: audioData.mids * 0.3,
      brightness: audioData.volume * 0.4 + 0.6,
      contrast: audioData.treble * 0.3 + 0.7,
      saturation: audioData.mids * 0.4 + 0.6
    };
  }
}
```

## Integration Patterns

### 1. React Integration

#### Hook Pattern
```typescript
function useAudioReactive() {
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    const audioBus = new AudioBus();
    audioBus.startAnalysis();
    
    const unsubscribe = audioBus.subscribe(setAudioData);
    
    return () => {
      unsubscribe();
      audioBus.stopAnalysis();
    };
  }, [isListening]);

  return { audioData, isListening, setIsListening };
}
```

#### Context Pattern
```typescript
const AudioContext = createContext<AudioContextValue | null>(null);

function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = useCallback(() => {
    AudioBus.startAnalysis();
    AudioBus.subscribe(setAudioData);
    setIsAnalyzing(true);
  }, []);

  const stopAnalysis = useCallback(() => {
    AudioBus.stopAnalysis();
    setAudioData(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <AudioContext.Provider value={{
      audioData,
      isAnalyzing,
      startAnalysis,
      stopAnalysis
    }}>
      {children}
    </AudioContext.Provider>
  );
}
```

### 2. WebGL Integration

#### Shader Uniform Updates
```typescript
class WebGLAudioIntegrator {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private uniforms: Map<string, WebGLUniformLocation> = new Map();

  updateAudioUniforms(audioData: AudioData) {
    const bass = audioData.bass;
    const mids = audioData.mids;
    const treble = audioData.treble;
    const volume = audioData.volume;

    // Update shader uniforms
    this.gl.uniform1f(this.uniforms.get('u_bass'), bass);
    this.gl.uniform1f(this.uniforms.get('u_mids'), mids);
    this.gl.uniform1f(this.uniforms.get('u_treble'), treble);
    this.gl.uniform1f(this.uniforms.get('u_volume'), volume);
    this.gl.uniform1f(this.uniforms.get('u_beat'), audioData.beatDetected ? 1.0 : 0.0);
  }
}
```

#### Texture Updates
```typescript
class AudioTextureUpdater {
  private gl: WebGL2RenderingContext;
  private texture: WebGLTexture;

  updateAudioTexture(audioData: AudioData) {
    const data = new Uint8Array(4);
    data[0] = Math.floor(audioData.bass * 255);
    data[1] = Math.floor(audioData.mids * 255);
    data[2] = Math.floor(audioData.treble * 255);
    data[3] = Math.floor(audioData.volume * 255);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
  }
}
```

## Real-time Processing Patterns

### 1. Audio Stream Processing

#### Microphone Input
```typescript
class MicrophoneProcessor {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private microphone: MediaStreamAudioSourceNode;

  async startMicrophone(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    this.microphone.connect(this.analyser);
  }

  getAudioData(): AudioData {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    return this.analyzeFrequencyData(dataArray);
  }
}
```

#### Audio File Processing
```typescript
class AudioFileProcessor {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;

  async processAudioFile(file: File): Promise<AudioData[]> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const audioData: AudioData[] = [];
    const chunkSize = 1024;
    
    for (let i = 0; i < audioBuffer.length; i += chunkSize) {
      const chunk = audioBuffer.slice(i, i + chunkSize);
      const data = this.analyzeChunk(chunk);
      audioData.push(data);
    }
    
    return audioData;
  }
}
```

### 2. Performance Optimization

#### Efficient Analysis
```typescript
class EfficientAudioAnalyzer {
  private analysisInterval: number = 16; // ~60fps
  private lastAnalysis: number = 0;
  private cachedData: AudioData | null = null;

  analyze(audioData: AudioData): AudioData | null {
    const now = performance.now();
    
    if (now - this.lastAnalysis < this.analysisInterval) {
      return this.cachedData;
    }
    
    this.lastAnalysis = now;
    this.cachedData = audioData;
    return audioData;
  }
}
```

#### Throttled Updates
```typescript
class ThrottledAudioUpdater {
  private updateInterval: number = 100; // 10fps
  private lastUpdate: number = 0;
  private pendingUpdate: AudioData | null = null;

  update(audioData: AudioData, callback: (data: AudioData) => void) {
    this.pendingUpdate = audioData;
    
    const now = performance.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      if (this.pendingUpdate) {
        callback(this.pendingUpdate);
        this.pendingUpdate = null;
        this.lastUpdate = now;
      }
    }
  }
}
```

## Error Handling Patterns

### 1. Audio Context Errors

```typescript
class AudioErrorHandler {
  private audioContext: AudioContext | null = null;

  async createAudioContext(): Promise<AudioContext> {
    try {
      this.audioContext = new AudioContext();
      return this.audioContext;
    } catch (error) {
      console.error('Failed to create audio context:', error);
      throw new Error('Audio not supported');
    }
  }

  handleContextStateChange() {
    if (this.audioContext) {
      this.audioContext.addEventListener('statechange', () => {
        if (this.audioContext?.state === 'suspended') {
          console.warn('Audio context suspended');
        } else if (this.audioContext?.state === 'running') {
          console.log('Audio context resumed');
        }
      });
    }
  }
}
```

### 2. Permission Errors

```typescript
class PermissionHandler {
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  handlePermissionError(error: Error) {
    if (error.name === 'NotAllowedError') {
      console.error('Microphone permission denied by user');
    } else if (error.name === 'NotFoundError') {
      console.error('No microphone found');
    } else if (error.name === 'NotSupportedError') {
      console.error('Audio not supported');
    }
  }
}
```

## Testing Patterns

### 1. Mock Audio Data

```typescript
class MockAudioDataGenerator {
  generateSineWave(frequency: number, duration: number): AudioData {
    const samples = 44100 * duration;
    const data = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / 44100);
    }
    
    return this.analyzeAudioData(data);
  }

  generateBeatPattern(): AudioData[] {
    const pattern: AudioData[] = [];
    
    for (let i = 0; i < 100; i++) {
      const beat = i % 4 === 0;
      pattern.push({
        bass: beat ? 0.8 : 0.2,
        mids: beat ? 0.6 : 0.3,
        treble: beat ? 0.4 : 0.2,
        volume: beat ? 0.9 : 0.4,
        beatDetected: beat,
        timestamp: performance.now() + i * 16
      });
    }
    
    return pattern;
  }
}
```

### 2. Audio Testing Utilities

```typescript
class AudioTestUtils {
  static createTestAudioContext(): AudioContext {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    
    return audioContext;
  }

  static createTestAnalyser(audioContext: AudioContext): AnalyserNode {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    return analyser;
  }
}
```

## Best Practices

### 1. Audio Context Management

```typescript
// Always check audio context state
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}

// Handle context loss
audioContext.addEventListener('statechange', () => {
  if (audioContext.state === 'closed') {
    // Recreate audio context
    audioContext = new AudioContext();
  }
});
```

### 2. Performance Considerations

```typescript
// Use efficient analysis intervals
const analysisInterval = 16; // ~60fps
let lastAnalysis = 0;

function analyzeAudio() {
  const now = performance.now();
  if (now - lastAnalysis >= analysisInterval) {
    // Perform analysis
    lastAnalysis = now;
  }
}
```

### 3. Error Recovery

```typescript
// Implement fallback strategies
try {
  await startAudioAnalysis();
} catch (error) {
  console.warn('Audio analysis failed, using fallback');
  useFallbackAudioData();
}
```

## Conclusion

The Liquid Light System provides comprehensive audio integration patterns for creating reactive visual experiences. By following these patterns and best practices, you can create smooth, responsive audio-reactive liquid light shows that work across all devices and browsers.
