/**
 * UNIFORM UPDATE OPTIMIZER
 *
 * Caches uniform values and only updates when changed.
 * Reduces WebGL state changes, improving performance.
 *
 * Features:
 * - Automatic change detection
 * - Type-safe uniform setting
 * - Statistics tracking
 * - Batch uniform updates
 *
 * Usage:
 * ```typescript
 * const optimizer = new UniformOptimizer();
 *
 * optimizer.setUniform(gl, location, 'uTime', 0.5);
 * optimizer.setUniform(gl, location, 'uTime', 0.5); // Skipped (no change)
 * optimizer.setUniform(gl, location, 'uTime', 0.6); // Updated
 * ```
 */

export type UniformValue = number | number[] | Float32Array | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 | THREE.Matrix4;

export interface UniformUpdateStats {
  totalSets: number;
  actualUpdates: number;
  skippedUpdates: number;
  updateRate: number; // Percentage of sets that actually updated
}

// TypeScript namespace for Three.js types
declare const THREE: any;

export class UniformOptimizer {
  private cache: Map<string, any> = new Map();
  private stats = {
    totalSets: 0,
    actualUpdates: 0,
    skippedUpdates: 0,
  };

  /**
   * Set uniform value (with caching)
   * @param gl - WebGL context
   * @param location - Uniform location
   * @param name - Uniform name (for caching)
   * @param value - Uniform value
   */
  setUniform(
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation | null,
    name: string,
    value: UniformValue
  ): void {
    if (!location) return;

    this.stats.totalSets++;

    // Check cache
    const cached = this.cache.get(name);

    if (this.valuesEqual(cached, value)) {
      this.stats.skippedUpdates++;
      return; // No change, skip update
    }

    // Update cache
    this.cache.set(name, this.cloneValue(value));
    this.stats.actualUpdates++;

    // Set uniform based on type
    if (typeof value === 'number') {
      gl.uniform1f(location, value);
    } else if (Array.isArray(value)) {
      this.setArrayUniform(gl, location, value);
    } else if (value instanceof Float32Array) {
      this.setTypedArrayUniform(gl, location, value);
    } else if (this.isVector(value)) {
      this.setVectorUniform(gl, location, value);
    } else if (this.isMatrix(value)) {
      this.setMatrixUniform(gl, location, value);
    }
  }

  /**
   * Set array uniform
   */
  private setArrayUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation, value: number[]): void {
    if (value.length === 1) {
      gl.uniform1f(location, value[0]);
    } else if (value.length === 2) {
      gl.uniform2fv(location, value);
    } else if (value.length === 3) {
      gl.uniform3fv(location, value);
    } else if (value.length === 4) {
      gl.uniform4fv(location, value);
    } else {
      gl.uniform1fv(location, value);
    }
  }

  /**
   * Set typed array uniform
   */
  private setTypedArrayUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation, value: Float32Array): void {
    if (value.length === 1) {
      gl.uniform1f(location, value[0]);
    } else if (value.length === 2) {
      gl.uniform2fv(location, value);
    } else if (value.length === 3) {
      gl.uniform3fv(location, value);
    } else if (value.length === 4) {
      gl.uniform4fv(location, value);
    } else {
      gl.uniform1fv(location, value);
    }
  }

  /**
   * Set vector uniform
   */
  private setVectorUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation, value: any): void {
    if (value.isVector2) {
      gl.uniform2f(location, value.x, value.y);
    } else if (value.isVector3) {
      gl.uniform3f(location, value.x, value.y, value.z);
    } else if (value.isVector4) {
      gl.uniform4f(location, value.x, value.y, value.z, value.w);
    }
  }

  /**
   * Set matrix uniform
   */
  private setMatrixUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation, value: any): void {
    if (value.isMatrix4) {
      gl.uniformMatrix4fv(location, false, value.elements);
    } else if (value.isMatrix3) {
      gl.uniformMatrix3fv(location, false, value.elements);
    }
  }

  /**
   * Check if value is a Three.js vector
   */
  private isVector(value: any): boolean {
    return value && (value.isVector2 || value.isVector3 || value.isVector4);
  }

  /**
   * Check if value is a Three.js matrix
   */
  private isMatrix(value: any): boolean {
    return value && (value.isMatrix3 || value.isMatrix4);
  }

  /**
   * Check if two values are equal
   */
  private valuesEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;

    if (typeof a === 'number' && typeof b === 'number') {
      return Math.abs(a - b) < 0.000001; // Float epsilon
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, i) => Math.abs(val - b[i]) < 0.000001);
    }

    if (a instanceof Float32Array && b instanceof Float32Array) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) >= 0.000001) return false;
      }
      return true;
    }

    if (this.isVector(a) && this.isVector(b)) {
      if (a.isVector2 && b.isVector2) {
        return Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001;
      }
      if (a.isVector3 && b.isVector3) {
        return Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001 && Math.abs(a.z - b.z) < 0.000001;
      }
      if (a.isVector4 && b.isVector4) {
        return Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001 && Math.abs(a.z - b.z) < 0.000001 && Math.abs(a.w - b.w) < 0.000001;
      }
    }

    return false;
  }

  /**
   * Clone value for caching
   */
  private cloneValue(value: any): any {
    if (typeof value === 'number') return value;
    if (Array.isArray(value)) return [...value];
    if (value instanceof Float32Array) return new Float32Array(value);
    if (this.isVector(value)) return value.clone();
    if (this.isMatrix(value)) return value.clone();
    return value;
  }

  /**
   * Get statistics
   */
  getStats(): UniformUpdateStats {
    return {
      totalSets: this.stats.totalSets,
      actualUpdates: this.stats.actualUpdates,
      skippedUpdates: this.stats.skippedUpdates,
      updateRate: this.stats.totalSets > 0
        ? (this.stats.actualUpdates / this.stats.totalSets) * 100
        : 0,
    };
  }

  /**
   * Print statistics
   */
  printStats(): void {
    const stats = this.getStats();

    console.group('[UniformOptimizer Stats]');
    console.log(`Total sets: ${stats.totalSets}`);
    console.log(`Actual updates: ${stats.actualUpdates}`);
    console.log(`Skipped: ${stats.skippedUpdates}`);
    console.log(`Update rate: ${stats.updateRate.toFixed(1)}%`);
    console.log(`Efficiency: ${(100 - stats.updateRate).toFixed(1)}% redundant updates avoided`);
    console.groupEnd();
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalSets: 0,
      actualUpdates: 0,
      skippedUpdates: 0,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get geometry name helper
   */
  private getGeometryName(geometry: any): string {
    return geometry?.type || 'geometry';
  }

  /**
   * Get material name helper
   */
  private getMaterialName(material: any): string {
    return material?.type || 'material';
  }
}

/**
 * Create uniform optimizer
 */
export function createUniformOptimizer(): UniformOptimizer {
  return new UniformOptimizer();
}
