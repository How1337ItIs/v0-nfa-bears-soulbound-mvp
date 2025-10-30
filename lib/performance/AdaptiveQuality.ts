/**
 * ADAPTIVE QUALITY ALGORITHMS FOR LIQUID LIGHT
 * 
 * Dynamic quality adjustment based on performance metrics
 * Includes FPS-based scaling, memory-aware optimization, and device adaptation
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface QualitySettings {
  resolution: number; // 0-1, where 1 is full resolution
  particleCount: number; // Number of fluid particles
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  effectComplexity: number; // 0-1
  updateRate: number; // Updates per second
  enablePostProcessing: boolean;
  enableShadows: boolean;
  enableReflections: boolean;
  maxDrawCalls: number;
  maxTriangles: number;
}

export interface PerformanceTargets {
  targetFPS: number;
  minFPS: number;
  maxFrameTime: number; // in milliseconds
  maxMemoryUsage: number; // 0-1
  maxCPUUsage: number; // 0-1
}

export interface DeviceProfile {
  tier: 'low' | 'medium' | 'high' | 'ultra';
  capabilities: {
    maxTextureSize: number;
    maxVertexAttribs: number;
    maxVaryingVectors: number;
    maxFragmentUniforms: number;
    deviceMemory: number;
    mobile: boolean;
  };
  recommendedSettings: QualitySettings;
}

export class AdaptiveQualityManager {
  private currentSettings: QualitySettings;
  private performanceTargets: PerformanceTargets;
  private deviceProfile: DeviceProfile;
  private performanceHistory: number[] = [];
  private memoryHistory: number[] = [];
  private adjustmentCooldown: number = 0;
  private lastAdjustment: number = 0;
  private isAdjusting: boolean = false;

  constructor(deviceProfile: DeviceProfile, performanceTargets: PerformanceTargets) {
    this.deviceProfile = deviceProfile;
    this.performanceTargets = performanceTargets;
    this.currentSettings = { ...deviceProfile.recommendedSettings };
  }

  public updatePerformance(fps: number, frameTime: number, memoryUsage: number) {
    this.performanceHistory.push(fps);
    this.memoryHistory.push(memoryUsage);

    // Keep only last 60 samples (1 second at 60fps)
    if (this.performanceHistory.length > 60) {
      this.performanceHistory.shift();
    }
    if (this.memoryHistory.length > 60) {
      this.memoryHistory.shift();
    }

    // Check if adjustment is needed
    const now = Date.now();
    if (now - this.lastAdjustment < this.adjustmentCooldown) {
      return;
    }

    this.adjustQuality(fps, frameTime, memoryUsage);
  }

  private adjustQuality(fps: number, frameTime: number, memoryUsage: number) {
    if (this.isAdjusting) return;

    this.isAdjusting = true;
    this.lastAdjustment = Date.now();

    const avgFPS = this.getAverageFPS();
    const avgMemory = this.getAverageMemoryUsage();
    const performanceScore = this.calculatePerformanceScore(avgFPS, frameTime, avgMemory);

    let adjustmentMade = false;

    // Performance is too low - reduce quality
    if (performanceScore < 0.3) {
      this.reduceQuality();
      adjustmentMade = true;
      this.adjustmentCooldown = 2000; // 2 second cooldown
    }
    // Performance is good - increase quality
    else if (performanceScore > 0.8 && avgFPS > this.performanceTargets.targetFPS) {
      this.increaseQuality();
      adjustmentMade = true;
      this.adjustmentCooldown = 5000; // 5 second cooldown
    }

    if (adjustmentMade) {
      console.log(`Quality adjusted: ${JSON.stringify(this.currentSettings)}`);
    }

    this.isAdjusting = false;
  }

  private getAverageFPS(): number {
    if (this.performanceHistory.length === 0) return 0;
    return this.performanceHistory.reduce((sum, fps) => sum + fps, 0) / this.performanceHistory.length;
  }

  private getAverageMemoryUsage(): number {
    if (this.memoryHistory.length === 0) return 0;
    return this.memoryHistory.reduce((sum, mem) => sum + mem, 0) / this.memoryHistory.length;
  }

  private calculatePerformanceScore(fps: number, frameTime: number, memoryUsage: number): number {
    const fpsScore = Math.min(fps / this.performanceTargets.targetFPS, 1);
    const frameTimeScore = Math.max(0, 1 - (frameTime / this.performanceTargets.maxFrameTime));
    const memoryScore = Math.max(0, 1 - memoryUsage / this.performanceTargets.maxMemoryUsage);
    
    return (fpsScore + frameTimeScore + memoryScore) / 3;
  }

  private reduceQuality() {
    const { tier } = this.deviceProfile;
    
    // Reduce resolution
    if (this.currentSettings.resolution > 0.5) {
      this.currentSettings.resolution = Math.max(0.5, this.currentSettings.resolution - 0.1);
    }

    // Reduce particle count
    if (this.currentSettings.particleCount > 1000) {
      this.currentSettings.particleCount = Math.max(1000, Math.floor(this.currentSettings.particleCount * 0.8));
    }

    // Reduce texture quality
    const textureQualityOrder = ['ultra', 'high', 'medium', 'low'];
    const currentIndex = textureQualityOrder.indexOf(this.currentSettings.textureQuality);
    if (currentIndex < textureQualityOrder.length - 1) {
      this.currentSettings.textureQuality = textureQualityOrder[currentIndex + 1] as any;
    }

    // Reduce effect complexity
    if (this.currentSettings.effectComplexity > 0.3) {
      this.currentSettings.effectComplexity = Math.max(0.3, this.currentSettings.effectComplexity - 0.1);
    }

    // Reduce update rate
    if (this.currentSettings.updateRate > 30) {
      this.currentSettings.updateRate = Math.max(30, this.currentSettings.updateRate - 10);
    }

    // Disable expensive features
    if (this.currentSettings.enablePostProcessing) {
      this.currentSettings.enablePostProcessing = false;
    }
    if (this.currentSettings.enableShadows) {
      this.currentSettings.enableShadows = false;
    }
    if (this.currentSettings.enableReflections) {
      this.currentSettings.enableReflections = false;
    }

    // Reduce draw call and triangle limits
    this.currentSettings.maxDrawCalls = Math.max(50, Math.floor(this.currentSettings.maxDrawCalls * 0.8));
    this.currentSettings.maxTriangles = Math.max(10000, Math.floor(this.currentSettings.maxTriangles * 0.8));
  }

  private increaseQuality() {
    const { tier } = this.deviceProfile;
    
    // Increase resolution
    if (this.currentSettings.resolution < 1.0) {
      this.currentSettings.resolution = Math.min(1.0, this.currentSettings.resolution + 0.1);
    }

    // Increase particle count
    const maxParticles = this.getMaxParticlesForTier(tier);
    if (this.currentSettings.particleCount < maxParticles) {
      this.currentSettings.particleCount = Math.min(maxParticles, Math.floor(this.currentSettings.particleCount * 1.2));
    }

    // Increase texture quality
    const textureQualityOrder = ['low', 'medium', 'high', 'ultra'];
    const currentIndex = textureQualityOrder.indexOf(this.currentSettings.textureQuality);
    if (currentIndex > 0) {
      this.currentSettings.textureQuality = textureQualityOrder[currentIndex - 1] as any;
    }

    // Increase effect complexity
    if (this.currentSettings.effectComplexity < 1.0) {
      this.currentSettings.effectComplexity = Math.min(1.0, this.currentSettings.effectComplexity + 0.1);
    }

    // Increase update rate
    const maxUpdateRate = this.getMaxUpdateRateForTier(tier);
    if (this.currentSettings.updateRate < maxUpdateRate) {
      this.currentSettings.updateRate = Math.min(maxUpdateRate, this.currentSettings.updateRate + 10);
    }

    // Enable expensive features for high/ultra tiers
    if (tier === 'high' || tier === 'ultra') {
      if (!this.currentSettings.enablePostProcessing) {
        this.currentSettings.enablePostProcessing = true;
      }
      if (tier === 'ultra' && !this.currentSettings.enableShadows) {
        this.currentSettings.enableShadows = true;
      }
      if (tier === 'ultra' && !this.currentSettings.enableReflections) {
        this.currentSettings.enableReflections = true;
      }
    }

    // Increase draw call and triangle limits
    const maxDrawCalls = this.getMaxDrawCallsForTier(tier);
    const maxTriangles = this.getMaxTrianglesForTier(tier);
    this.currentSettings.maxDrawCalls = Math.min(maxDrawCalls, Math.floor(this.currentSettings.maxDrawCalls * 1.2));
    this.currentSettings.maxTriangles = Math.min(maxTriangles, Math.floor(this.currentSettings.maxTriangles * 1.2));
  }

  private getMaxParticlesForTier(tier: string): number {
    switch (tier) {
      case 'low': return 2000;
      case 'medium': return 5000;
      case 'high': return 10000;
      case 'ultra': return 20000;
      default: return 2000;
    }
  }

  private getMaxUpdateRateForTier(tier: string): number {
    switch (tier) {
      case 'low': return 30;
      case 'medium': return 45;
      case 'high': return 60;
      case 'ultra': return 120;
      default: return 30;
    }
  }

  private getMaxDrawCallsForTier(tier: string): number {
    switch (tier) {
      case 'low': return 100;
      case 'medium': return 200;
      case 'high': return 500;
      case 'ultra': return 1000;
      default: return 100;
    }
  }

  private getMaxTrianglesForTier(tier: string): number {
    switch (tier) {
      case 'low': return 50000;
      case 'medium': return 100000;
      case 'high': return 500000;
      case 'ultra': return 1000000;
      default: return 50000;
    }
  }

  public getCurrentSettings(): QualitySettings {
    return { ...this.currentSettings };
  }

  public setPerformanceTargets(targets: Partial<PerformanceTargets>) {
    this.performanceTargets = { ...this.performanceTargets, ...targets };
  }

  public resetToRecommended() {
    this.currentSettings = { ...this.deviceProfile.recommendedSettings };
  }

  public getPerformanceHistory(): { fps: number[], memory: number[] } {
    return {
      fps: [...this.performanceHistory],
      memory: [...this.memoryHistory],
    };
  }
}

export function createAdaptiveQualityManager(deviceProfile: DeviceProfile, performanceTargets: PerformanceTargets): AdaptiveQualityManager {
  return new AdaptiveQualityManager(deviceProfile, performanceTargets);
}

export function createDeviceProfile(capabilities: any): DeviceProfile {
  const { maxTextureSize, deviceMemory, mobile } = capabilities;
  
  let tier: 'low' | 'medium' | 'high' | 'ultra' = 'low';
  
  if (maxTextureSize >= 8192 && deviceMemory >= 8 && !mobile) {
    tier = 'ultra';
  } else if (maxTextureSize >= 4096 && deviceMemory >= 4) {
    tier = 'high';
  } else if (maxTextureSize >= 2048 && deviceMemory >= 2) {
    tier = 'medium';
  }

  const recommendedSettings: QualitySettings = {
    resolution: tier === 'ultra' ? 1.0 : tier === 'high' ? 0.9 : tier === 'medium' ? 0.8 : 0.6,
    particleCount: tier === 'ultra' ? 20000 : tier === 'high' ? 10000 : tier === 'medium' ? 5000 : 2000,
    textureQuality: tier === 'ultra' ? 'ultra' : tier === 'high' ? 'high' : tier === 'medium' ? 'medium' : 'low',
    effectComplexity: tier === 'ultra' ? 1.0 : tier === 'high' ? 0.8 : tier === 'medium' ? 0.6 : 0.4,
    updateRate: tier === 'ultra' ? 120 : tier === 'high' ? 60 : tier === 'medium' ? 45 : 30,
    enablePostProcessing: tier === 'high' || tier === 'ultra',
    enableShadows: tier === 'ultra',
    enableReflections: tier === 'ultra',
    maxDrawCalls: tier === 'ultra' ? 1000 : tier === 'high' ? 500 : tier === 'medium' ? 200 : 100,
    maxTriangles: tier === 'ultra' ? 1000000 : tier === 'high' ? 500000 : tier === 'medium' ? 100000 : 50000,
  };

  return {
    tier,
    capabilities,
    recommendedSettings,
  };
}

