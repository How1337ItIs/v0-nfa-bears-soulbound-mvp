/**
 * CapabilityDetector Service
 * 
 * Detects device capabilities and assigns performance tier
 * Based on Master Liquid Light Integration Plan (Week 1)
 */

import { DeviceCapabilities } from './types';

export class CapabilityDetector {
  private static instance: CapabilityDetector;
  private capabilities: DeviceCapabilities | null = null;

  private constructor() {}

  static getInstance(): CapabilityDetector {
    if (!CapabilityDetector.instance) {
      CapabilityDetector.instance = new CapabilityDetector();
    }
    return CapabilityDetector.instance;
  }

  /**
   * Detect device capabilities
   */
  detect(): DeviceCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const webgl2 = !!canvas.getContext('webgl2');
    const webgpu = 'gpu' in navigator;
    
    // Device memory detection (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4;
    
    // Mobile detection
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Max texture size
    const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 1024;
    
    // Determine tier based on capabilities
    let tier: 'low' | 'medium' | 'high' | 'ultra' = 'low';
    
    if (webgpu && deviceMemory >= 8) {
      tier = 'ultra';
    } else if (webgl2 && deviceMemory >= 4 && maxTextureSize >= 4096) {
      tier = 'high';
    } else if (gl && deviceMemory >= 2 && maxTextureSize >= 2048) {
      tier = 'medium';
    }

    // Clamp DPR for mobile to avoid extreme GPU load
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    
    this.capabilities = {
      webgl: !!gl,
      webgl2,
      webgpu,
      deviceMemory,
      maxTextureSize,
      mobile,
      tier
    };

    return this.capabilities;
  }

  /**
   * Get cached capabilities
   */
  getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  /**
   * Reset capabilities (for testing)
   */
  reset(): void {
    this.capabilities = null;
  }
}

// Export singleton instance
export const capabilityDetector = CapabilityDetector.getInstance();
