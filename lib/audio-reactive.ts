// Audio-reactive system for psychedelic effects

export interface AudioData {
  bass: number;        // 0-1, low frequencies
  mids: number;        // 0-1, mid frequencies  
  treble: number;      // 0-1, high frequencies
  volume: number;      // 0-1, overall volume
  beatDetected: boolean;
  tempo: number;       // BPM estimate
  spectrum: Float32Array; // Full frequency spectrum
  waveform: Float32Array; // Time domain data
}

export interface AudioReactiveConfig {
  smoothing: number;        // 0-1, smoothing factor
  sensitivity: number;      // 0-3, multiplier for effects
  beatThreshold: number;    // 0-1, beat detection sensitivity
  frequencyBands: number;   // Number of frequency bands to analyze
}

export class AudioReactiveSystem {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private dataArray: Uint8Array = new Uint8Array(0);
  private frequencyData: Uint8Array = new Uint8Array(0);
  private config: AudioReactiveConfig;
  
  // Beat detection
  private previousVolume: number = 0;
  private volumeHistory: number[] = [];
  private beatCounter: number = 0;
  private lastBeatTime: number = 0;
  
  // Grateful Dead music integration
  private gratefulDeadTracks = [
    { name: "Fire on the Mountain", bpm: 126, key: "E", mood: "fiery" },
    { name: "Dark Star", bpm: 90, key: "E", mood: "cosmic" },
    { name: "China Cat Sunflower", bpm: 140, key: "A", mood: "bright" },
    { name: "Ripple", bpm: 108, key: "G", mood: "gentle" },
    { name: "Terrapin Station", bpm: 120, key: "A", mood: "mystical" },
    { name: "Eyes of the World", bpm: 132, key: "E", mood: "flowing" },
    { name: "Truckin'", bpm: 118, key: "E", mood: "driving" },
    { name: "Sugar Magnolia", bpm: 138, key: "A", mood: "joyful" },
  ];
  
  constructor(config: Partial<AudioReactiveConfig> = {}) {
    this.config = {
      smoothing: 0.8,
      sensitivity: 1.5,
      beatThreshold: 0.3,
      frequencyBands: 32,
      ...config
    };
  }
  
  async initializeAudio(audioElement?: HTMLAudioElement): Promise<boolean> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioElement) {
        // Check if the audio element already has a source connected
        // In development mode with Fast Refresh, this prevents double connection errors
        try {
          this.source = this.audioContext.createMediaElementSource(audioElement);
        } catch (error) {
          if (error instanceof Error && error.message.includes('already connected')) {
            // Element is already connected, create a new audio element to avoid conflicts
            const newAudioElement = audioElement.cloneNode(true) as HTMLAudioElement;
            newAudioElement.src = audioElement.src;
            newAudioElement.currentTime = audioElement.currentTime;
            newAudioElement.volume = audioElement.volume;
            this.source = this.audioContext.createMediaElementSource(newAudioElement);
          } else {
            throw error;
          }
        }
      } else {
        // No audio element provided - skip initialization
        console.warn('No audio element provided for audio reactivity');
        return false;
      }
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = this.config.smoothing;
      
      // Connect audio graph
      this.source.connect(this.analyser);
      if (audioElement) {
        // Only connect to destination if we have an audio element (not mic)
        this.analyser.connect(this.audioContext.destination);
      }
      
      // Initialize data arrays
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }
  
  getAudioData(): AudioData {
    if (!this.analyser || !this.audioContext) {
      return this.getEmptyAudioData();
    }
    
    // Get frequency and time domain data
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.dataArray);
    
    // Convert to normalized arrays
    const spectrum = new Float32Array(this.frequencyData.length);
    const waveform = new Float32Array(this.dataArray.length);
    
    for (let i = 0; i < this.frequencyData.length; i++) {
      spectrum[i] = this.frequencyData[i] / 255;
    }
    
    for (let i = 0; i < this.dataArray.length; i++) {
      waveform[i] = (this.dataArray[i] - 128) / 128;
    }
    
    // Calculate frequency bands
    const bass = this.getFrequencyBand(spectrum, 0, 0.1) * this.config.sensitivity;
    const mids = this.getFrequencyBand(spectrum, 0.1, 0.4) * this.config.sensitivity;
    const treble = this.getFrequencyBand(spectrum, 0.4, 1.0) * this.config.sensitivity;
    const volume = this.getAverageVolume(spectrum);
    
    // Beat detection
    const beatDetected = this.detectBeat(volume);
    const tempo = this.estimateTempo();
    
    return {
      bass: Math.min(1, bass),
      mids: Math.min(1, mids),
      treble: Math.min(1, treble),
      volume: Math.min(1, volume),
      beatDetected,
      tempo,
      spectrum,
      waveform
    };
  }
  
  private getFrequencyBand(spectrum: Float32Array, startRatio: number, endRatio: number): number {
    const startIndex = Math.floor(startRatio * spectrum.length);
    const endIndex = Math.floor(endRatio * spectrum.length);
    let sum = 0;
    let count = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
      sum += spectrum[i];
      count++;
    }
    
    return count > 0 ? sum / count : 0;
  }
  
  private getAverageVolume(spectrum: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < spectrum.length; i++) {
      sum += spectrum[i];
    }
    return sum / spectrum.length;
  }
  
  private detectBeat(currentVolume: number): boolean {
    const now = performance.now();
    
    // Add to volume history (keep last 20 samples)
    this.volumeHistory.push(currentVolume);
    if (this.volumeHistory.length > 20) {
      this.volumeHistory.shift();
    }
    
    // Calculate average volume
    const avgVolume = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
    
    // Detect beat as significant increase from average
    const isLocalMaxima = currentVolume > this.previousVolume;
    const isAboveThreshold = currentVolume > avgVolume * (1 + this.config.beatThreshold);
    const timeSinceLastBeat = now - this.lastBeatTime;
    const minBeatInterval = 60000 / 180; // Max 180 BPM
    
    const beatDetected = isLocalMaxima && isAboveThreshold && timeSinceLastBeat > minBeatInterval;
    
    if (beatDetected) {
      this.beatCounter++;
      this.lastBeatTime = now;
    }
    
    this.previousVolume = currentVolume;
    return beatDetected;
  }
  
  private estimateTempo(): number {
    const now = performance.now();
    const timeWindow = 10000; // 10 seconds
    
    // Simple BPM estimation based on recent beats
    if (this.beatCounter < 2) return 120; // Default BPM
    
    const avgBeatInterval = (now - this.lastBeatTime + timeWindow) / this.beatCounter;
    return Math.max(60, Math.min(180, 60000 / avgBeatInterval));
  }
  
  private getEmptyAudioData(): AudioData {
    return {
      bass: 0,
      mids: 0,
      treble: 0,
      volume: 0,
      beatDetected: false,
      tempo: 120,
      spectrum: new Float32Array(0),
      waveform: new Float32Array(0)
    };
  }
  
  // Get Grateful Dead track info for themed effects
  getGratefulDeadTrackInfo(trackName: string) {
    return this.gratefulDeadTracks.find(track => 
      track.name.toLowerCase().includes(trackName.toLowerCase())
    ) || this.gratefulDeadTracks[0]; // Default to Fire on the Mountain
  }
  
  // Generate audio-reactive shader uniforms
  generateShaderUniforms(audioData: AudioData) {
    return {
      u_audioVolume: audioData.volume,
      u_audioBass: audioData.bass,
      u_audioMids: audioData.mids,
      u_audioTreble: audioData.treble,
      u_beat: audioData.beatDetected ? 1.0 : 0.0,
      u_tempo: audioData.tempo / 120.0, // Normalized around 120 BPM
      u_bassHistory: audioData.volume, // Could be expanded to history array
    };
  }
  
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
  }
}

// Audio-reactive fluid parameters
export class AudioReactiveFluid {
  private audioSystem: AudioReactiveSystem;
  private baseConfig: any;
  
  constructor(audioSystem: AudioReactiveSystem, baseConfig: any) {
    this.audioSystem = audioSystem;
    this.baseConfig = baseConfig;
  }
  
  updateFluidParams(audioData: AudioData) {
    return {
      ...this.baseConfig,
      // Bass affects fluid density and viscosity
      density: this.baseConfig.density * (1 + audioData.bass * 0.5),
      viscosity: this.baseConfig.viscosity * (1 - audioData.bass * 0.3),
      
      // Mids affect velocity and turbulence
      velocity: this.baseConfig.velocity * (1 + audioData.mids * 0.8),
      turbulence: this.baseConfig.turbulence * (1 + audioData.mids * 0.6),
      
      // Treble affects color intensity and curl strength
      colorIntensity: this.baseConfig.colorIntensity * (1 + audioData.treble * 0.4),
      curlStrength: this.baseConfig.curlStrength * (1 + audioData.treble * 0.7),
      
      // Beat detection creates pulses
      oilWaterEffect: audioData.beatDetected 
        ? this.baseConfig.oilWaterEffect * 2.0
        : this.baseConfig.oilWaterEffect,
        
      // Volume affects overall intensity
      pressure: this.baseConfig.pressure * (0.5 + audioData.volume * 0.5),
    };
  }
}

// Grateful Dead music player component data
export const GRATEFUL_DEAD_PLAYLIST = [
  {
    title: "Fire on the Mountain",
    artist: "Grateful Dead",
    album: "Shakedown Street",
    duration: "12:03",
    url: "/music/fire-on-the-mountain.mp3", // Would need actual files
    mood: "fiery",
    bpm: 126,
    description: "Epic jams with fiery energy - perfect for intense visual effects"
  },
  {
    title: "Dark Star",
    artist: "Grateful Dead", 
    album: "Live/Dead",
    duration: "23:19",
    url: "/music/dark-star.mp3",
    mood: "cosmic",
    bpm: 90,
    description: "Spacey, cosmic exploration - ideal for deep psychedelic visuals"
  },
  {
    title: "Eyes of the World",
    artist: "Grateful Dead",
    album: "Wake of the Flood", 
    duration: "10:45",
    url: "/music/eyes-of-the-world.mp3",
    mood: "flowing",
    bpm: 132,
    description: "Flowing, melodic journey through consciousness"
  },
  // Add more tracks as needed
];

export default AudioReactiveSystem;