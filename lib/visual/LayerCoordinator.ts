/**
 * LAYER COORDINATOR UTILITY
 * 
 * Manages visual layer composition, blending, and rendering order
 * Handles layer conflicts, performance optimization, and quality scaling
 * 
 * Based on Master Liquid Light Integration Plan (Week 2)
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { VisualLayer } from './VisualOrchestrator';
import { VisualPolicy } from './VisualPolicy';
import { DeviceCapabilities } from './types';

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

export interface BlendOperation {
  layerId: string;
  blendMode: VisualLayer['blendMode'];
  opacity: number;
  mask?: string; // CSS mask or WebGL stencil
  shader?: string; // Custom shader for complex blending
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

class LayerCoordinator {
  private layers: Map<string, VisualLayer> = new Map();
  private composition: LayerComposition | null = null;
  private conflicts: LayerConflict[] = [];
  private optimizations: Map<string, LayerOptimization> = new Map();

  // Layer management
  addLayer(layer: VisualLayer): void {
    this.layers.set(layer.id, layer);
    this.updateComposition();
    this.detectConflicts();
  }

  removeLayer(layerId: string): void {
    this.layers.delete(layerId);
    this.updateComposition();
    this.detectConflicts();
  }

  updateLayer(layerId: string, updates: Partial<VisualLayer>): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      const updatedLayer = { ...layer, ...updates };
      this.layers.set(layerId, updatedLayer);
      this.updateComposition();
      this.detectConflicts();
    }
  }

  getLayer(layerId: string): VisualLayer | undefined {
    return this.layers.get(layerId);
  }

  getAllLayers(): VisualLayer[] {
    return Array.from(this.layers.values());
  }

  // Composition management
  private updateComposition(): void {
    const layers = this.getAllLayers();
    const enabledLayers = layers.filter(layer => layer.enabled);
    
    // Sort by priority, then by zIndex
    const sortedLayers = enabledLayers.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.zIndex - b.zIndex;
    });

    // Create blend stack
    const blendStack: BlendOperation[] = sortedLayers.map(layer => ({
      layerId: layer.id,
      blendMode: layer.blendMode,
      opacity: layer.opacity,
    }));

    // Calculate render order (back to front)
    const renderOrder = sortedLayers.map((_, index) => index);

    // Estimate performance cost
    const performance = this.estimatePerformanceCost(sortedLayers);

    this.composition = {
      layers: sortedLayers,
      blendStack,
      renderOrder,
      performance,
    };
  }

  private estimatePerformanceCost(layers: VisualLayer[]): {
    estimatedCost: number;
    memoryUsage: number;
    gpuLoad: number;
  } {
    let estimatedCost = 0;
    let memoryUsage = 0;
    let gpuLoad = 0;

    for (const layer of layers) {
      const baseCost = this.getBaseCostForLayerType(layer.type);
      const opacityMultiplier = layer.opacity;
      const blendMultiplier = this.getBlendModeCost(layer.blendMode);
      
      estimatedCost += baseCost * opacityMultiplier * blendMultiplier;
      memoryUsage += this.getMemoryUsageForLayer(layer);
      gpuLoad += this.getGPULoadForLayer(layer);
    }

    return {
      estimatedCost,
      memoryUsage,
      gpuLoad: Math.min(1, gpuLoad), // Cap at 100%
    };
  }

  private getBaseCostForLayerType(type: VisualLayer['type']): number {
    switch (type) {
      case 'webgl': return 10;
      case 'css': return 2;
      case 'thermal': return 5;
      case 'thin-film': return 8;
      case 'overlay': return 1;
      default: return 1;
    }
  }

  private getBlendModeCost(blendMode: VisualLayer['blendMode']): number {
    switch (blendMode) {
      case 'normal': return 1;
      case 'multiply': return 1.2;
      case 'screen': return 1.2;
      case 'overlay': return 1.5;
      case 'soft-light': return 1.8;
      default: return 1;
    }
  }

  private getMemoryUsageForLayer(layer: VisualLayer): number {
    // Estimate memory usage in MB
    switch (layer.type) {
      case 'webgl': return 50; // Fluid simulation textures
      case 'css': return 5; // CSS gradients
      case 'thermal': return 20; // Thermal simulation data
      case 'thin-film': return 30; // Thin-film shader data
      case 'overlay': return 1; // UI elements
      default: return 1;
    }
  }

  private getGPULoadForLayer(layer: VisualLayer): number {
    // Estimate GPU load (0-1)
    switch (layer.type) {
      case 'webgl': return 0.8;
      case 'css': return 0.1;
      case 'thermal': return 0.4;
      case 'thin-film': return 0.6;
      case 'overlay': return 0.05;
      default: return 0.1;
    }
  }

  // Conflict detection
  private detectConflicts(): void {
    this.conflicts = [];
    const layers = this.getAllLayers();

    // Check for zIndex conflicts
    this.detectZIndexConflicts(layers);
    
    // Check for blend mode conflicts
    this.detectBlendModeConflicts(layers);
    
    // Check for performance conflicts
    this.detectPerformanceConflicts(layers);
    
    // Check for resource conflicts
    this.detectResourceConflicts(layers);
  }

  private detectZIndexConflicts(layers: VisualLayer[]): void {
    const zIndexGroups = new Map<number, VisualLayer[]>();
    
    for (const layer of layers) {
      if (!zIndexGroups.has(layer.zIndex)) {
        zIndexGroups.set(layer.zIndex, []);
      }
      zIndexGroups.get(layer.zIndex)!.push(layer);
    }

    for (const [zIndex, groupLayers] of zIndexGroups) {
      if (groupLayers.length > 1) {
        this.conflicts.push({
          type: 'zIndex',
          severity: 'medium',
          layers: groupLayers.map(l => l.id),
          description: `Multiple layers at zIndex ${zIndex}`,
          resolution: 'Adjust zIndex values to avoid overlap',
        });
      }
    }
  }

  private detectBlendModeConflicts(layers: VisualLayer[]): void {
    const problematicBlends = ['overlay', 'soft-light'];
    
    for (const layer of layers) {
      if (problematicBlends.includes(layer.blendMode) && layer.opacity > 0.8) {
        this.conflicts.push({
          type: 'blendMode',
          severity: 'low',
          layers: [layer.id],
          description: `High opacity with ${layer.blendMode} blend mode may cause visual artifacts`,
          resolution: 'Consider reducing opacity or changing blend mode',
        });
      }
    }
  }

  private detectPerformanceConflicts(layers: VisualLayer[]): void {
    if (!this.composition) return;

    const { performance } = this.composition;
    
    if (performance.estimatedCost > 50) {
      this.conflicts.push({
        type: 'performance',
        severity: 'high',
        layers: layers.map(l => l.id),
        description: `High performance cost: ${performance.estimatedCost.toFixed(1)}`,
        resolution: 'Consider disabling or optimizing some layers',
      });
    }

    if (performance.gpuLoad > 0.9) {
      this.conflicts.push({
        type: 'performance',
        severity: 'critical',
        layers: layers.map(l => l.id),
        description: `GPU load too high: ${Math.round(performance.gpuLoad * 100)}%`,
        resolution: 'Disable high-cost layers or reduce quality',
      });
    }
  }

  private detectResourceConflicts(layers: VisualLayer[]): void {
    const webglLayers = layers.filter(l => l.type === 'webgl');
    const cssLayers = layers.filter(l => l.type === 'css');
    
    if (webglLayers.length > 0 && cssLayers.length > 0) {
      this.conflicts.push({
        type: 'resource',
        severity: 'medium',
        layers: [...webglLayers, ...cssLayers].map(l => l.id),
        description: 'Both WebGL and CSS layers active - potential redundancy',
        resolution: 'Use WebGL when available, CSS as fallback only',
      });
    }
  }

  // Optimization
  optimizeForDevice(capabilities: DeviceCapabilities, policy: VisualPolicy): LayerOptimization[] {
    const optimizations: LayerOptimization[] = [];
    const layers = this.getAllLayers();

    for (const layer of layers) {
      const optimization: LayerOptimization = {
        layerId: layer.id,
        optimizations: {},
      };

      // Performance-based optimizations
      if (capabilities.tier === 'low') {
        optimization.optimizations.culling = true;
        optimization.optimizations.lod = 0.5;
        optimization.optimizations.resolution = 0.5;
        optimization.optimizations.frameSkip = 2;
        optimization.optimizations.quality = 'low';
      } else if (capabilities.tier === 'medium') {
        optimization.optimizations.lod = 0.75;
        optimization.optimizations.resolution = 0.75;
        optimization.optimizations.quality = 'medium';
      } else {
        optimization.optimizations.quality = 'high';
      }

      // Policy-based optimizations
      if (!policy.motionEnabled) {
        optimization.optimizations.frameSkip = 10; // Reduce updates
      }

      if (policy.intensity < 0.5) {
        optimization.optimizations.resolution = Math.max(0.25, policy.intensity);
      }

      optimizations.push(optimization);
      this.optimizations.set(layer.id, optimization);
    }

    return optimizations;
  }

  // Public API
  getComposition(): LayerComposition | null {
    return this.composition;
  }

  getConflicts(): LayerConflict[] {
    return [...this.conflicts];
  }

  getOptimizations(): LayerOptimization[] {
    return Array.from(this.optimizations.values());
  }

  getLayerOptimization(layerId: string): LayerOptimization | undefined {
    return this.optimizations.get(layerId);
  }

  // Utility methods
  getLayersByType(type: VisualLayer['type']): VisualLayer[] {
    return this.getAllLayers().filter(layer => layer.type === type);
  }

  getLayersByZIndex(zIndex: number): VisualLayer[] {
    return this.getAllLayers().filter(layer => layer.zIndex === zIndex);
  }

  getTopLayer(): VisualLayer | undefined {
    const layers = this.getAllLayers();
    if (layers.length === 0) return undefined;
    
    return layers.reduce((top, current) => {
      if (current.zIndex > top.zIndex) return current;
      if (current.zIndex === top.zIndex && current.priority > top.priority) return current;
      return top;
    });
  }

  getBottomLayer(): VisualLayer | undefined {
    const layers = this.getAllLayers();
    if (layers.length === 0) return undefined;
    
    return layers.reduce((bottom, current) => {
      if (current.zIndex < bottom.zIndex) return current;
      if (current.zIndex === bottom.zIndex && current.priority < bottom.priority) return current;
      return bottom;
    });
  }

  // Cleanup
  clear(): void {
    this.layers.clear();
    this.composition = null;
    this.conflicts = [];
    this.optimizations.clear();
  }
}

// Singleton instance
let layerCoordinator: LayerCoordinator | null = null;

export function getLayerCoordinator(): LayerCoordinator {
  if (!layerCoordinator) {
    layerCoordinator = new LayerCoordinator();
  }
  return layerCoordinator;
}

export function createLayerCoordinator(): LayerCoordinator {
  layerCoordinator = new LayerCoordinator();
  return layerCoordinator;
}

export function destroyLayerCoordinator(): void {
  if (layerCoordinator) {
    layerCoordinator.clear();
    layerCoordinator = null;
  }
}
