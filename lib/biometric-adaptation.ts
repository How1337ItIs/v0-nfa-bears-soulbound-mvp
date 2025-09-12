// Biometric Adaptation System for Personalized Psychedelic Effects

export interface BiometricData {
  heartRate?: number;          // BPM
  breathingRate?: number;      // Breaths per minute
  eyeGaze?: { x: number; y: number }; // Screen coordinates
  deviceMotion?: DeviceMotionData;
  touchPressure?: number;      // 0-1 for devices that support it
  timestamp: number;
}

export interface DeviceMotionData {
  acceleration?: { x: number; y: number; z: number };
  rotationRate?: { alpha: number; beta: number; gamma: number };
  orientation?: { alpha: number; beta: number; gamma: number };
}

export interface BiometricFluidConfig {
  density: number;
  velocity: number;
  viscosity: number;
  gravity: { x: number; y: number };
  colorShift: number;
  pulseIntensity: number;
  particleAttraction: { x: number; y: number };
}

export interface PersonalizedProfile {
  userId: string;
  baselineHeartRate: number;
  preferredColorPalette: string[];
  sensitivityToEffects: number; // 0-1
  privacySettings: BiometricPrivacySettings;
}

export interface BiometricPrivacySettings {
  allowHeartRateMonitoring: boolean;
  allowEyeTracking: boolean;
  allowMotionTracking: boolean;
  dataRetentionDays: number;
  shareWithCommunity: boolean;
}

export class BiometricAdaptationSystem {
  private isInitialized = false;
  private currentProfile: PersonalizedProfile | null = null;
  private biometricStream: BiometricData[] = [];
  private maxStreamLength = 100; // Keep last 100 readings
  private permissions: { [key: string]: boolean } = {};

  // Heart rate monitoring via webcam (using remote photoplethysmography)
  private heartRateMonitor: HeartRateMonitor | null = null;
  
  // Eye tracking via webcam
  private eyeTracker: EyeTracker | null = null;
  
  // Device motion sensor
  private motionSensor: MotionSensor | null = null;

  constructor() {
    console.log('Initializing Biometric Adaptation System...');
  }

  async initialize(profile?: PersonalizedProfile): Promise<boolean> {
    try {
      this.currentProfile = profile || await this.createDefaultProfile();
      
      // Request necessary permissions
      await this.requestPermissions();
      
      // Initialize available biometric sensors
      await this.initializeSensors();
      
      this.isInitialized = true;
      console.log('Biometric Adaptation System initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize biometric system:', error);
      return false;
    }
  }

  private async createDefaultProfile(): Promise<PersonalizedProfile> {
    return {
      userId: `user_${Date.now()}`,
      baselineHeartRate: 70, // Average resting heart rate
      preferredColorPalette: ['#ff0080', '#8000ff', '#0080ff'], // Default psychedelic colors
      sensitivityToEffects: 0.7, // Moderate sensitivity
      privacySettings: {
        allowHeartRateMonitoring: false, // Opt-in required
        allowEyeTracking: false,
        allowMotionTracking: true, // Usually less privacy-sensitive
        dataRetentionDays: 1, // Only keep data for current session
        shareWithCommunity: false
      }
    };
  }

  private async requestPermissions(): Promise<void> {
    const profile = this.currentProfile!;

    // Heart rate monitoring (via webcam)
    if (profile.privacySettings.allowHeartRateMonitoring) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        });
        stream.getTracks().forEach(track => track.stop()); // Test access only
        this.permissions.heartRate = true;
      } catch (error) {
        console.warn('Heart rate monitoring permission denied:', error);
        this.permissions.heartRate = false;
      }
    }

    // Eye tracking (via webcam)
    if (profile.privacySettings.allowEyeTracking) {
      this.permissions.eyeTracking = this.permissions.heartRate; // Same camera access
    }

    // Device motion (usually auto-granted)
    if (profile.privacySettings.allowMotionTracking) {
      if (typeof DeviceMotionEvent !== 'undefined') {
        // Request permission on iOS 13+
        if ('requestPermission' in DeviceMotionEvent) {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          this.permissions.deviceMotion = permission === 'granted';
        } else {
          this.permissions.deviceMotion = true;
        }
      }
    }
  }

  private async initializeSensors(): Promise<void> {
    // Initialize heart rate monitor
    if (this.permissions.heartRate) {
      this.heartRateMonitor = new HeartRateMonitor();
      await this.heartRateMonitor.initialize();
    }

    // Initialize eye tracker  
    if (this.permissions.eyeTracking) {
      this.eyeTracker = new EyeTracker();
      await this.eyeTracker.initialize();
    }

    // Initialize motion sensor
    if (this.permissions.deviceMotion) {
      this.motionSensor = new MotionSensor();
      this.motionSensor.initialize();
    }
  }

  async getCurrentBiometrics(): Promise<BiometricData> {
    const biometrics: BiometricData = {
      timestamp: Date.now()
    };

    // Collect heart rate
    if (this.heartRateMonitor?.isActive) {
      biometrics.heartRate = await this.heartRateMonitor.getCurrentHeartRate();
    }

    // Collect eye gaze data
    if (this.eyeTracker?.isActive) {
      biometrics.eyeGaze = await this.eyeTracker.getCurrentGaze();
    }

    // Collect device motion
    if (this.motionSensor?.isActive) {
      biometrics.deviceMotion = this.motionSensor.getCurrentMotion();
    }

    // Add to stream and maintain size limit
    this.biometricStream.push(biometrics);
    if (this.biometricStream.length > this.maxStreamLength) {
      this.biometricStream.shift();
    }

    return biometrics;
  }

  adaptFluidToHeartbeat(baseConfig: any, heartRate?: number): BiometricFluidConfig {
    if (!heartRate || !this.currentProfile) {
      return this.getDefaultFluidConfig(baseConfig);
    }

    const baseline = this.currentProfile.baselineHeartRate;
    const heartRateRatio = heartRate / baseline;
    const sensitivity = this.currentProfile.sensitivityToEffects;

    return {
      // Heart rate affects fluid pulsation
      density: baseConfig.density * (0.8 + heartRateRatio * 0.4),
      velocity: baseConfig.velocity * (0.7 + heartRateRatio * 0.6),
      viscosity: baseConfig.viscosity * (1.2 - heartRateRatio * 0.4), // Higher HR = less viscous
      
      // Gravity stays mostly normal
      gravity: { x: 0, y: baseConfig.gravity || 0.1 },
      
      // Color shifts with heart rate variability
      colorShift: this.calculateHeartRateVariability() * sensitivity,
      
      // Pulse intensity follows heartbeat
      pulseIntensity: Math.min(1.0, (heartRateRatio - 0.8) * sensitivity),
      
      // Default particle attraction
      particleAttraction: { x: 0.5, y: 0.5 }
    };
  }

  adaptFluidToEyeGaze(config: BiometricFluidConfig, eyeGaze?: { x: number; y: number }): BiometricFluidConfig {
    if (!eyeGaze) return config;

    // Eye gaze creates particle attraction points
    const normalizedGaze = {
      x: eyeGaze.x / window.innerWidth,
      y: eyeGaze.y / window.innerHeight
    };

    return {
      ...config,
      particleAttraction: normalizedGaze,
      // Gaze focus affects local density
      density: config.density * (1 + 0.3 * Math.sin(Date.now() * 0.01))
    };
  }

  adaptFluidToMotion(config: BiometricFluidConfig, motion?: DeviceMotionData): BiometricFluidConfig {
    if (!motion?.acceleration) return config;

    const { x, y, z } = motion.acceleration;
    const motionIntensity = Math.sqrt(x * x + y * y + z * z) / 10; // Normalize

    return {
      ...config,
      // Device tilt affects gravity direction
      gravity: {
        x: Math.max(-0.3, Math.min(0.3, x / 10)),
        y: Math.max(-0.3, Math.min(0.3, y / 10))
      },
      // Motion affects velocity
      velocity: config.velocity * (1 + motionIntensity * 0.2),
      // Shaking creates turbulence
      pulseIntensity: Math.max(config.pulseIntensity, motionIntensity)
    };
  }

  private calculateHeartRateVariability(): number {
    if (this.biometricStream.length < 10) return 0;

    const heartRates = this.biometricStream
      .slice(-10)
      .map(b => b.heartRate)
      .filter(hr => hr !== undefined) as number[];

    if (heartRates.length < 5) return 0;

    // Calculate coefficient of variation as HRV proxy
    const mean = heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length;
    const variance = heartRates.reduce((sum, hr) => sum + Math.pow(hr - mean, 2), 0) / heartRates.length;
    const cv = Math.sqrt(variance) / mean;

    return Math.min(1.0, cv * 10); // Normalize to 0-1 range
  }

  private getDefaultFluidConfig(baseConfig: any): BiometricFluidConfig {
    return {
      density: baseConfig.density || 0.8,
      velocity: baseConfig.velocity || 0.5,
      viscosity: baseConfig.viscosity || 0.1,
      gravity: { x: 0, y: baseConfig.gravity || 0.1 },
      colorShift: 0,
      pulseIntensity: 0,
      particleAttraction: { x: 0.5, y: 0.5 }
    };
  }

  // Privacy and data management
  async clearBiometricData(): Promise<void> {
    this.biometricStream = [];
    console.log('Biometric data cleared');
  }

  async exportBiometricData(): Promise<BiometricData[]> {
    if (!this.currentProfile?.privacySettings.shareWithCommunity) {
      throw new Error('Data export not permitted by privacy settings');
    }
    return [...this.biometricStream]; // Return copy
  }

  updatePrivacySettings(newSettings: Partial<BiometricPrivacySettings>): void {
    if (this.currentProfile) {
      this.currentProfile.privacySettings = {
        ...this.currentProfile.privacySettings,
        ...newSettings
      };
    }
  }

  dispose(): void {
    // Clean up sensors
    this.heartRateMonitor?.dispose();
    this.eyeTracker?.dispose();
    this.motionSensor?.dispose();
    
    // Clear data
    this.biometricStream = [];
    this.isInitialized = false;
    
    console.log('Biometric Adaptation System disposed');
  }
}

// Sensor implementations (simplified versions)
class HeartRateMonitor {
  isActive = false;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      this.videoElement.style.display = 'none';
      document.body.appendChild(this.videoElement);
      
      this.isActive = true;
      console.log('Heart rate monitor initialized');
    } catch (error) {
      console.error('Failed to initialize heart rate monitor:', error);
    }
  }

  async getCurrentHeartRate(): Promise<number> {
    // Simplified heart rate detection
    // In production, this would use computer vision to detect subtle color changes
    // in the user's face caused by blood flow (photoplethysmography)
    return 65 + Math.random() * 20; // Simulated 65-85 BPM
  }

  dispose(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.videoElement) {
      document.body.removeChild(this.videoElement);
    }
    this.isActive = false;
  }
}

class EyeTracker {
  isActive = false;

  async initialize(): Promise<void> {
    // Simplified eye tracking initialization
    // In production, this would use WebGazer.js or similar library
    this.isActive = true;
    console.log('Eye tracker initialized');
  }

  async getCurrentGaze(): Promise<{ x: number; y: number }> {
    // Simplified gaze detection
    // Returns center of screen with some random movement
    return {
      x: window.innerWidth * (0.4 + Math.random() * 0.2),
      y: window.innerHeight * (0.4 + Math.random() * 0.2)
    };
  }

  dispose(): void {
    this.isActive = false;
  }
}

class MotionSensor {
  isActive = false;
  private currentMotion: DeviceMotionData = {};

  initialize(): void {
    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleMotion.bind(this));
      this.isActive = true;
      console.log('Motion sensor initialized');
    }
  }

  private handleMotion(event: DeviceMotionEvent): void {
    this.currentMotion = {
      acceleration: event.acceleration ? {
        x: event.acceleration.x || 0,
        y: event.acceleration.y || 0, 
        z: event.acceleration.z || 0
      } : undefined,
      rotationRate: event.rotationRate ? {
        alpha: event.rotationRate.alpha || 0,
        beta: event.rotationRate.beta || 0,
        gamma: event.rotationRate.gamma || 0
      } : undefined
    };
  }

  getCurrentMotion(): DeviceMotionData {
    return { ...this.currentMotion };
  }

  dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.handleMotion.bind(this));
    }
    this.isActive = false;
  }
}

export default BiometricAdaptationSystem;