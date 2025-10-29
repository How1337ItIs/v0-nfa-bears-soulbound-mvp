/**
 * Visual System Types
 * 
 * Consolidated TypeScript interfaces for the visual orchestration system
 * All visual-related types in one place for better maintainability
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

// ============================================================================
// DEVICE CAPABILITIES
// ============================================================================

export interface DeviceCapabilities {
  webgl: boolean;
  webgl2: boolean;
  webgpu: boolean;
  maxTextureSize: number;
  deviceMemory: number;
  mobile: boolean;
  tier: 'low' | 'medium' | 'high' | 'ultra';
}

// ============================================================================
// VISUAL POLICY
// ============================================================================

export interface VisualPolicy {
  // Device capabilities
  capabilities: DeviceCapabilities;
  
  // Performance settings
  performanceTier: 'low' | 'medium' | 'high' | 'ultra';
  targetFPS: number;
  maxTextureSize: number;
  
  // User preferences
  motionEnabled: boolean;
  intensity: number; // 0-1 range
  prefersReducedMotion: boolean;
  
  // Visual settings
  paletteId: string;
  mode: 'ambient' | 'reactive' | 'performance' | 'accessibility';
  
  // Global flags
  webglEnabled: boolean;
  audioEnabled: boolean;
  thermalEnabled: boolean;
  thinFilmEnabled: boolean;
  
  // Quality settings
  fluidQuality: 'low' | 'medium' | 'high';
  particleCount: number;
  resolution: number;
  
  // Accessibility
  highContrast: boolean;
  colorBlindFriendly: boolean;
  reducedMotion: boolean;
}

export interface VisualPolicyConfig {
  // Override device detection
  forceCapabilities?: Partial<DeviceCapabilities>;
  
  // Override user preferences
  forceMotionEnabled?: boolean;
  forceIntensity?: number;
  forcePalette?: string;
  forceMode?: VisualPolicy['mode'];
  
  // Override global flags
  forceWebglEnabled?: boolean;
  forceAudioEnabled?: boolean;
  forceThermalEnabled?: boolean;
  forceThinFilmEnabled?: boolean;
  
  // Override quality settings
  forceFluidQuality?: VisualPolicy['fluidQuality'];
  forceParticleCount?: number;
  forceResolution?: number;
}

// ============================================================================
// VISUAL LAYERS
// ============================================================================

export interface VisualLayer {
  id: string;
  type: 'webgl' | 'css' | 'thin-film' | 'thermal' | 'overlay';
  enabled: boolean;
  priority: number;
  zIndex: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
}

export interface BlendOperation {
  layerId: string;
  blendMode: VisualLayer['blendMode'];
  opacity: number;
  mask?: string; // CSS mask or WebGL stencil
  shader?: string; // Custom shader for complex blending
}

// ============================================================================
// LAYER COORDINATION
// ============================================================================

export interface LayerComposition {
  layers: VisualLayer[];
  blendStack: BlendOperation[];
  renderOrder: number[];
  performance: {
    estimatedCost: number;
    memoryUsage: number;
    gpuLoad: number;
  };
}

export interface LayerConflict {
  type: 'zIndex' | 'blendMode' | 'performance' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  layers: string[];
  description: string;
  resolution?: string;
}

export interface LayerOptimization {
  layerId: string;
  optimizations: {
    culling?: boolean;
    lod?: number; // Level of detail
    resolution?: number; // Render resolution multiplier
    frameSkip?: number; // Skip every N frames
    quality?: 'low' | 'medium' | 'high';
  };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  gpuUsage: number;
  cpuUsage: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
}

export interface QualitySettings {
  current: 'low' | 'medium' | 'high' | 'ultra';
  target: 'low' | 'medium' | 'high' | 'ultra';
  adaptive: boolean;
  autoAdjust: boolean;
  thresholds: {
    fpsLow: number;
    fpsHigh: number;
    memoryHigh: number;
    gpuHigh: number;
  };
}

// ============================================================================
// VISUAL ORCHESTRATOR
// ============================================================================

export interface VisualOrchestratorState {
  layers: VisualLayer[];
  activeLayers: VisualLayer[];
  performance: PerformanceMetrics;
  quality: QualitySettings;
  errors: string[];
  warnings: string[];
  lastUpdate: number;
}

export interface VisualOrchestratorProps {
  className?: string;
  children?: React.ReactNode;
  onStateChange?: (state: VisualOrchestratorState) => void;
  onError?: (error: string) => void;
  onWarning?: (warning: string) => void;
  config?: VisualPolicyConfig;
}

// ============================================================================
// AUDIO INTEGRATION
// ============================================================================

export interface AudioData {
  bass: number;
  mids: number;
  treble: number;
  volume: number;
  beatDetected: boolean;
  spectralData: Float32Array;
  tempo?: number;
}

export interface PhysicsParams {
  splatForce: number;
  thermalRate: number;
  colorPhase: number;
  globalIntensity: number;
  curlStrength: number;
  viscosity: number;
}

// ============================================================================
// PALETTE SYSTEM
// ============================================================================

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  description?: string;
  category?: string;
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface VisualError {
  type: 'webgl' | 'performance' | 'layer' | 'audio' | 'palette';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  timestamp: number;
  resolved: boolean;
}

export interface VisualWarning {
  type: 'performance' | 'compatibility' | 'accessibility' | 'optimization';
  message: string;
  suggestion?: string;
  timestamp: number;
  dismissed: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LayerType = VisualLayer['type'];
export type BlendMode = VisualLayer['blendMode'];
export type PerformanceTier = DeviceCapabilities['tier'];
export type QualityLevel = QualitySettings['current'];
export type VisualMode = VisualPolicy['mode'];

// ============================================================================
// REACT COMPONENT PROPS
// ============================================================================

export interface LiquidLightControlsProps {
  onIntensityChange?: (intensity: number) => void;
  onPaletteChange?: (paletteId: string) => void;
  onModeChange?: (mode: VisualMode) => void;
  onMotionToggle?: (enabled: boolean) => void;
  intensity?: number;
  motionEnabled?: boolean;
  prefersReducedMotion?: boolean;
  className?: string;
}

export interface CSSFallbackProps {
  intensity?: number;
  motionEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface VisualSystemConfig {
  policy: VisualPolicyConfig;
  performance: {
    enableMonitoring: boolean;
    targetFPS: number;
    adaptiveQuality: boolean;
    memoryThreshold: number;
  };
  layers: {
    enableWebGL: boolean;
    enableCSS: boolean;
    enableThermal: boolean;
    enableThinFilm: boolean;
  };
  accessibility: {
    respectReducedMotion: boolean;
    highContrast: boolean;
    colorBlindFriendly: boolean;
  };
  development: {
    showHUD: boolean;
    enableLogging: boolean;
    enableProfiling: boolean;
  };
}

// ============================================================================
// LEGACY COMPATIBILITY (for existing code)
// ============================================================================

export interface DeviceTier {
  name: 'low' | 'medium' | 'high' | 'ultra';
}

export interface GlobalVisualState {
  motionEnabled: boolean;
  intensity: number; // 0..1
  pureMode: boolean;
  selectedPalette: string;
  audioReactive: boolean;
  mode: 'off' | 'ambient' | 'dance-floor' | 'trip';
  batterySaver: boolean;
}

export interface VisualContextValue {
  state: GlobalVisualState;
  deviceTier: DeviceTier | null;
  audioData: AudioData | null;
  palette: Palette | null;
  setState: (updates: Partial<GlobalVisualState>) => void;
}