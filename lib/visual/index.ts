/**
 * Visual System Exports
 * 
 * Centralized exports for the visual orchestration system
 * All visual modules available through this single entry point
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

// Core modules
export { CapabilityDetector, capabilityDetector } from './CapabilityDetector';
export { VisualPolicy, createVisualPolicyManager, getVisualPolicyManager, destroyVisualPolicyManager, useVisualPolicy } from './VisualPolicy';
export { default as VisualOrchestrator } from './VisualOrchestrator';
export { LayerCoordinator, getLayerCoordinator, createLayerCoordinator, destroyLayerCoordinator } from './LayerCoordinator';
export { PerformanceMonitor, getPerformanceMonitor, createPerformanceMonitor, destroyPerformanceMonitor, usePerformanceMonitor } from './PerformanceMonitor';
// Utilities
export { getClampedDPR, applyDPRToCanvas } from './utils/dprClamp';
export { TierTransitionManager } from './performance/tierTransitionManager';
export { getBatterySaverPolicy } from './capability/batterySaverPolicy';

// Type exports
export type {
  // Device capabilities
  DeviceCapabilities,
  
  // Visual policy
  VisualPolicy,
  VisualPolicyConfig,
  
  // Visual layers
  VisualLayer,
  BlendOperation,
  
  // Layer coordination
  LayerComposition,
  LayerConflict,
  LayerOptimization,
  
  // Performance monitoring
  PerformanceMetrics,
  QualitySettings,
  PerformanceThresholds,
  PerformanceHistory,
  PerformanceAlert,
  AdaptiveQualityConfig,
  
  // Visual orchestrator
  VisualOrchestratorState,
  VisualOrchestratorProps,
  
  // Audio integration
  AudioData,
  PhysicsParams,
  
  // Palette system
  Palette,
  ColorRGB,
  
  // Error handling
  VisualError,
  VisualWarning,
  
  // Utility types
  LayerType,
  BlendMode,
  PerformanceTier,
  QualityLevel,
  VisualMode,
  
  // React component props
  LiquidLightControlsProps,
  CSSFallbackProps,
  
  // Configuration
  VisualSystemConfig,
  
  // Legacy compatibility
  DeviceTier,
  GlobalVisualState,
  VisualContextValue,
} from './types';
