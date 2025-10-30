/**
 * DRAW CALL BATCHING SYSTEM
 *
 * Reduces draw calls by batching similar geometry with instancing.
 * Major performance optimization for scenes with many similar objects.
 *
 * Features:
 * - Automatic batching by geometry + material
 * - GPU instancing support
 * - Batch statistics tracking
 * - Manual flush control
 *
 * Usage:
 * ```typescript
 * const batcher = new DrawCallBatcher(gl);
 *
 * // Add instances
 * for (const particle of particles) {
 *   batcher.add(particleGeometry, particleMaterial, particle.matrix);
 * }
 *
 * // Render all batches
 * batcher.flush();
 * ```
 */

export interface BatchInstance {
  geometry: any;
  material: any;
  matrix: any; // Transformation matrix
}

export interface Batch {
  geometry: any;
  material: any;
  matrices: any[];
  instanceCount: number;
}

export interface BatchStats {
  totalBatches: number;
  totalInstances: number;
  drawCallsSaved: number;
  batches: Array<{
    geometry: string;
    material: string;
    instances: number;
  }>;
}

export class DrawCallBatcher {
  private batches: Map<string, Batch> = new Map();
  private totalInstances = 0;

  /**
   * Add instance to batch
   * @param geometry - Geometry object
   * @param material - Material object
   * @param matrix - Transformation matrix
   */
  add(geometry: any, material: any, matrix: any): void {
    const key = this.getBatchKey(geometry, material);

    let batch = this.batches.get(key);

    if (!batch) {
      batch = {
        geometry,
        material,
        matrices: [],
        instanceCount: 0,
      };
      this.batches.set(key, batch);
    }

    batch.matrices.push(matrix);
    batch.instanceCount++;
    this.totalInstances++;
  }

  /**
   * Render all batches
   * Note: Actual rendering would integrate with Three.js or WebGL directly
   * This is a framework for the batching logic
   */
  flush(): void {
    for (const batch of this.batches.values()) {
      if (batch.instanceCount === 1) {
        // Single instance: render normally
        this.renderSingle(batch);
      } else {
        // Multiple instances: use instancing
        this.renderInstanced(batch);
      }
    }

    // Clear batches
    this.clear();
  }

  /**
   * Render single instance (no instancing)
   */
  private renderSingle(batch: Batch): void {
    // Pseudo-code for single draw call
    // gl.drawArrays() or similar
    console.log(`[Batcher] Rendering ${batch.instanceCount} instance(s) of ${this.getGeometryName(batch.geometry)}`);
  }

  /**
   * Render instanced batch
   */
  private renderInstanced(batch: Batch): void {
    // Pseudo-code for instanced rendering
    // Set up instance buffer with matrices
    // gl.drawArraysInstanced() or similar
    console.log(`[Batcher] Instanced rendering ${batch.instanceCount} instances of ${this.getGeometryName(batch.geometry)}`);
  }

  /**
   * Get batch statistics
   * @returns Statistics about batching efficiency
   */
  getStats(): BatchStats {
    const batches = Array.from(this.batches.values());

    const batchDetails = batches.map(batch => ({
      geometry: this.getGeometryName(batch.geometry),
      material: this.getMaterialName(batch.material),
      instances: batch.instanceCount,
    }));

    // Calculate draw calls saved
    // Without batching: totalInstances draw calls
    // With batching: batches.length draw calls
    const drawCallsSaved = this.totalInstances - batches.length;

    return {
      totalBatches: batches.length,
      totalInstances: this.totalInstances,
      drawCallsSaved,
      batches: batchDetails,
    };
  }

  /**
   * Clear all batches
   */
  clear(): void {
    this.batches.clear();
    this.totalInstances = 0;
  }

  /**
   * Print statistics to console
   */
  printStats(): void {
    const stats = this.getStats();

    console.group('[DrawCallBatcher Stats]');
    console.log(`Total batches: ${stats.totalBatches}`);
    console.log(`Total instances: ${stats.totalInstances}`);
    console.log(`Draw calls saved: ${stats.drawCallsSaved}`);

    if (stats.batches.length > 0) {
      console.log('\nBatches:');
      for (const batch of stats.batches) {
        console.log(`  ${batch.geometry}: ${batch.instances} instances`);
      }
    }

    console.groupEnd();
  }

  /**
   * Get unique batch key for geometry + material combination
   */
  private getBatchKey(geometry: any, material: any): string {
    const geoId = this.getGeometryName(geometry);
    const matId = this.getMaterialName(material);
    return `${geoId}_${matId}`;
  }

  /**
   * Get geometry identifier
   */
  private getGeometryName(geometry: any): string {
    return geometry?.uuid || geometry?.name || 'unknown-geometry';
  }

  /**
   * Get material identifier
   */
  private getMaterialName(material: any): string {
    return material?.uuid || material?.name || 'unknown-material';
  }
}

/**
 * Create draw call batcher
 * @returns DrawCallBatcher instance
 */
export function createDrawCallBatcher(): DrawCallBatcher {
  return new DrawCallBatcher();
}

/**
 * Estimate draw call savings from batching
 * @param instanceCounts - Array of instance counts per geometry
 * @returns Estimated draw calls saved
 */
export function estimateDrawCallSavings(instanceCounts: number[]): number {
  const totalInstances = instanceCounts.reduce((a, b) => a + b, 0);
  const uniqueGeometries = instanceCounts.length;

  return totalInstances - uniqueGeometries;
}
