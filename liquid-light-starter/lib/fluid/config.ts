/**
 * Authentic 60s liquid-light configuration presets and device tiering.
 * Central source of truth for the fluid engine parameters.
 */
export type Tier = 'high' | 'medium' | 'low';

export interface AuthenticConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  VELOCITY_DISSIPATION: number;
  DENSITY_DISSIPATION: number;
  CURL: number;
  PRESSURE_ITERATIONS: number;
  COLOR_PALETTE: string[];
  TRANSPARENT: boolean;
  INITIAL: boolean;
  HOVER: boolean;
}

export const AUTHENTIC_CONFIGS: Record<Tier, AuthenticConfig> = {
  high: {
    SIM_RESOLUTION: 256,
    DYE_RESOLUTION: 512,
    VELOCITY_DISSIPATION: 0.4,   // Lava lamp viscosity (gloopy)
    DENSITY_DISSIPATION: 0.92,   // Color persistence
    CURL: 20,
    PRESSURE_ITERATIONS: 25,
    COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  },
  medium: {
    SIM_RESOLUTION: 192,
    DYE_RESOLUTION: 384,
    VELOCITY_DISSIPATION: 0.45,
    DENSITY_DISSIPATION: 0.91,
    CURL: 18,
    PRESSURE_ITERATIONS: 20,
    COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  },
  low: {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 256,
    VELOCITY_DISSIPATION: 0.5,
    DENSITY_DISSIPATION: 0.9,
    CURL: 15,
    PRESSURE_ITERATIONS: 15,
    COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  }
};

export interface DeviceCapabilities {
  webgl: boolean;
  webgl2: boolean;
  maxTextureSize: number;
  deviceMemory: number; // GB (approx)
  mobile: boolean;
  tier: Tier;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;

  if (!gl) {
    return {
      webgl: false,
      webgl2: false,
      maxTextureSize: 0,
      deviceMemory: 2,
      mobile: true,
      tier: 'low'
    };
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const deviceMemory = (navigator as any).deviceMemory || (isMobile ? 3 : 8);

  let tier: Tier = 'low';
  if (!isMobile && maxTextureSize >= 4096 && deviceMemory >= 8) tier = 'high';
  else if (maxTextureSize >= 2048 && deviceMemory >= 4) tier = 'medium';

  return {
    webgl: true,
    webgl2: !!gl2,
    maxTextureSize,
    deviceMemory,
    mobile: isMobile,
    tier
  };
}
