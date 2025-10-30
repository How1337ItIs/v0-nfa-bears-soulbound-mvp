/**
 * THERMAL THROTTLING DETECTOR FOR LIQUID LIGHT
 * 
 * Detects thermal throttling and adjusts performance accordingly
 * Monitors device temperature, battery status, and performance degradation
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface ThermalStatus {
  isThrottled: boolean;
  throttlingLevel: 'none' | 'light' | 'moderate' | 'severe';
  temperature: number | null; // in Celsius, null if not available
  batteryLevel: number | null; // 0-1, null if not available
  batteryCharging: boolean | null; // null if not available
  performanceImpact: number; // 0-1, estimated performance impact
  recommendations: string[];
}

export interface ThrottlingThresholds {
  fpsDropThreshold: number; // FPS drop to trigger throttling detection
  frameTimeIncreaseThreshold: number; // Frame time increase to trigger detection
  consecutiveFramesThreshold: number; // Number of consecutive frames to confirm throttling
  temperatureThreshold: number; // Temperature threshold (if available)
  batteryLowThreshold: number; // Battery level threshold
}

export class ThermalThrottlingDetector {
  private performanceHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private isMonitoring: boolean = false;
  private throttlingDetected: boolean = false;
  private throttlingStartTime: number = 0;
  private lastThrottlingCheck: number = 0;
  private checkInterval: number = 1000; // Check every second
  private thresholds: ThrottlingThresholds;
  private batteryAPI: any = null;
  private temperatureAPI: any = null;

  constructor(thresholds?: Partial<ThrottlingThresholds>) {
    this.thresholds = {
      fpsDropThreshold: 10, // 10 FPS drop
      frameTimeIncreaseThreshold: 5, // 5ms increase
      consecutiveFramesThreshold: 30, // 30 frames (0.5 seconds at 60fps)
      temperatureThreshold: 80, // 80°C
      batteryLowThreshold: 0.2, // 20% battery
      ...thresholds,
    };

    this.initializeAPIs();
  }

  private async initializeAPIs() {
    // Try to initialize Battery API
    if ('getBattery' in navigator) {
      try {
        this.batteryAPI = await (navigator as any).getBattery();
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }

    // Try to initialize temperature API (experimental)
    if ('sensors' in navigator) {
      try {
        const sensor = await (navigator as any).sensors.getSensor('AmbientLightSensor');
        this.temperatureAPI = sensor;
      } catch (error) {
        console.warn('Temperature API not available:', error);
      }
    }
  }

  public startMonitoring() {
    this.isMonitoring = true;
    this.performanceHistory = [];
    this.frameTimeHistory = [];
    this.throttlingDetected = false;
    this.lastThrottlingCheck = performance.now();
  }

  public stopMonitoring() {
    this.isMonitoring = false;
  }

  public updatePerformance(fps: number, frameTime: number) {
    if (!this.isMonitoring) return;

    const now = performance.now();
    
    // Add to history
    this.performanceHistory.push(fps);
    this.frameTimeHistory.push(frameTime);

    // Keep only recent history (last 60 samples)
    if (this.performanceHistory.length > 60) {
      this.performanceHistory.shift();
    }
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    // Check for throttling every second
    if (now - this.lastThrottlingCheck >= this.checkInterval) {
      this.checkForThrottling();
      this.lastThrottlingCheck = now;
    }
  }

  private checkForThrottling() {
    if (this.performanceHistory.length < this.thresholds.consecutiveFramesThreshold) {
      return;
    }

    const recentFPS = this.performanceHistory.slice(-this.thresholds.consecutiveFramesThreshold);
    const recentFrameTime = this.frameTimeHistory.slice(-this.thresholds.consecutiveFramesThreshold);
    
    const avgRecentFPS = this.average(recentFPS);
    const avgRecentFrameTime = this.average(recentFrameTime);
    
    // Calculate baseline (first half of history)
    const baselineFPS = this.performanceHistory.length >= 60 
      ? this.average(this.performanceHistory.slice(0, 30))
      : avgRecentFPS;
    const baselineFrameTime = this.frameTimeHistory.length >= 60
      ? this.average(this.frameTimeHistory.slice(0, 30))
      : avgRecentFrameTime;

    const fpsDrop = baselineFPS - avgRecentFPS;
    const frameTimeIncrease = avgRecentFrameTime - baselineFrameTime;

    // Check if throttling is detected
    const isFPSThrottled = fpsDrop >= this.thresholds.fpsDropThreshold;
    const isFrameTimeThrottled = frameTimeIncrease >= this.thresholds.frameTimeIncreaseThreshold;
    
    if ((isFPSThrottled || isFrameTimeThrottled) && !this.throttlingDetected) {
      this.throttlingDetected = true;
      this.throttlingStartTime = performance.now();
      console.warn('Thermal throttling detected');
    } else if (!isFPSThrottled && !isFrameTimeThrottled && this.throttlingDetected) {
      this.throttlingDetected = false;
      console.log('Thermal throttling resolved');
    }
  }

  public getThermalStatus(): ThermalStatus {
    const isThrottled = this.throttlingDetected;
    const throttlingLevel = this.getThrottlingLevel();
    const temperature = this.getTemperature();
    const batteryLevel = this.getBatteryLevel();
    const batteryCharging = this.getBatteryCharging();
    const performanceImpact = this.calculatePerformanceImpact();
    const recommendations = this.getRecommendations();

    return {
      isThrottled,
      throttlingLevel,
      temperature,
      batteryLevel,
      batteryCharging,
      performanceImpact,
      recommendations,
    };
  }

  private getThrottlingLevel(): 'none' | 'light' | 'moderate' | 'severe' {
    if (!this.throttlingDetected) return 'none';

    if (this.performanceHistory.length < 10) return 'none';

    const recentFPS = this.performanceHistory.slice(-10);
    const avgRecentFPS = this.average(recentFPS);
    const baselineFPS = this.performanceHistory.length >= 30 
      ? this.average(this.performanceHistory.slice(0, 15))
      : avgRecentFPS;

    const fpsDrop = baselineFPS - avgRecentFPS;

    if (fpsDrop >= 30) return 'severe';
    if (fpsDrop >= 20) return 'moderate';
    if (fpsDrop >= 10) return 'light';
    return 'none';
  }

  private getTemperature(): number | null {
    // This is a placeholder - actual temperature reading would require
    // device-specific APIs that are not widely available
    return null;
  }

  private getBatteryLevel(): number | null {
    if (!this.batteryAPI) return null;
    return this.batteryAPI.level;
  }

  private getBatteryCharging(): boolean | null {
    if (!this.batteryAPI) return null;
    return this.batteryAPI.charging;
  }

  private calculatePerformanceImpact(): number {
    if (!this.throttlingDetected || this.performanceHistory.length < 10) {
      return 0;
    }

    const recentFPS = this.performanceHistory.slice(-10);
    const avgRecentFPS = this.average(recentFPS);
    const baselineFPS = this.performanceHistory.length >= 30 
      ? this.average(this.performanceHistory.slice(0, 15))
      : avgRecentFPS;

    const fpsDrop = baselineFPS - avgRecentFPS;
    return Math.min(1, fpsDrop / 60); // Normalize to 0-1
  }

  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    const status = this.getThermalStatus();

    if (status.isThrottled) {
      recommendations.push('Reduce visual quality settings');
      recommendations.push('Lower particle count');
      recommendations.push('Disable post-processing effects');
      
      if (status.batteryLevel !== null && status.batteryLevel < this.thresholds.batteryLowThreshold) {
        recommendations.push('Connect device to power source');
        recommendations.push('Enable battery saver mode');
      }

      if (status.throttlingLevel === 'severe') {
        recommendations.push('Close other applications');
        recommendations.push('Reduce screen brightness');
        recommendations.push('Allow device to cool down');
      }
    } else {
      recommendations.push('Performance is optimal');
      recommendations.push('No thermal throttling detected');
    }

    return recommendations;
  }

  public setThresholds(thresholds: Partial<ThrottlingThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  public getThresholds(): ThrottlingThresholds {
    return { ...this.thresholds };
  }

  public isThrottlingDetected(): boolean {
    return this.throttlingDetected;
  }

  public getThrottlingDuration(): number {
    if (!this.throttlingDetected) return 0;
    return performance.now() - this.throttlingStartTime;
  }

  public reset() {
    this.throttlingDetected = false;
    this.performanceHistory = [];
    this.frameTimeHistory = [];
    this.throttlingStartTime = 0;
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}

export function createThermalThrottlingDetector(thresholds?: Partial<ThrottlingThresholds>): ThermalThrottlingDetector {
  return new ThermalThrottlingDetector(thresholds);
}

export function formatThermalStatus(status: ThermalStatus): string {
  let output = `Thermal Status: ${status.isThrottled ? 'THROTTLED' : 'NORMAL'}\n`;
  output += `Throttling Level: ${status.throttlingLevel}\n`;
  output += `Performance Impact: ${(status.performanceImpact * 100).toFixed(1)}%\n`;
  
  if (status.temperature !== null) {
    output += `Temperature: ${status.temperature}°C\n`;
  }
  
  if (status.batteryLevel !== null) {
    output += `Battery: ${(status.batteryLevel * 100).toFixed(1)}% ${status.batteryCharging ? '(Charging)' : ''}\n`;
  }
  
  output += `Recommendations:\n`;
  status.recommendations.forEach(rec => {
    output += `  - ${rec}\n`;
  });
  
  return output;
}

