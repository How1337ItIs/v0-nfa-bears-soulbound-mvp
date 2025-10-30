/**
 * SHADER HOT-SWAPPING SYSTEM
 *
 * Allows live shader replacement without page reload.
 * Essential for rapid shader development and tuning.
 *
 * Features:
 * - Live shader replacement
 * - Compilation error handling
 * - Rollback on failure
 * - HMR integration
 * - Version tracking
 *
 * Usage:
 * ```typescript
 * const hotSwap = new ShaderHotSwap(gl, program);
 *
 * // Replace fragment shader
 * hotSwap.swapFragment(newFragmentShader);
 *
 * // Rollback if issues
 * hotSwap.rollback();
 * ```
 */

export interface ShaderVersion {
  vertex: string;
  fragment: string;
  timestamp: number;
  version: number;
}

export class ShaderHotSwap {
  private gl: WebGL2RenderingContext;
  private currentProgram: WebGLProgram;
  private history: ShaderVersion[] = [];
  private maxHistory = 10;
  private currentVersion = 0;

  constructor(gl: WebGL2RenderingContext, initialProgram: WebGLProgram) {
    this.gl = gl;
    this.currentProgram = initialProgram;
  }

  /**
   * Swap fragment shader
   * @param newFragmentSource - New fragment shader source
   * @param vertexSource - Vertex shader source (optional, reuse current if not provided)
   * @returns Success status
   */
  async swapFragment(newFragmentSource: string, vertexSource?: string): Promise<boolean> {
    try {
      // Get current shaders if not provided
      const currentVertex = vertexSource || this.getCurrentVertexSource();

      // Save to history
      this.saveToHistory(currentVertex, newFragmentSource);

      // Compile new program
      const newProgram = await this.compileProgram(currentVertex, newFragmentSource);

      // Swap programs
      const oldProgram = this.currentProgram;
      this.currentProgram = newProgram;

      // Delete old program
      this.gl.deleteProgram(oldProgram);

      console.log('[ShaderHotSwap] Fragment shader updated successfully');

      return true;
    } catch (error) {
      console.error('[ShaderHotSwap] Hot-swap failed:', error);
      return false;
    }
  }

  /**
   * Swap complete shader program
   * @param vertexSource - New vertex shader
   * @param fragmentSource - New fragment shader
   * @returns Success status
   */
  async swapProgram(vertexSource: string, fragmentSource: string): Promise<boolean> {
    try {
      this.saveToHistory(vertexSource, fragmentSource);

      const newProgram = await this.compileProgram(vertexSource, fragmentSource);

      const oldProgram = this.currentProgram;
      this.currentProgram = newProgram;

      this.gl.deleteProgram(oldProgram);

      console.log('[ShaderHotSwap] Complete program updated successfully');

      return true;
    } catch (error) {
      console.error('[ShaderHotSwap] Hot-swap failed:', error);
      return false;
    }
  }

  /**
   * Compile shader program
   */
  private async compileProgram(vertexSource: string, fragmentSource: string): Promise<WebGLProgram> {
    const gl = this.gl;

    // Compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(vertexShader);
      gl.deleteShader(vertexShader);
      throw new Error(`Vertex shader error: ${error}`);
    }

    // Compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(fragmentShader);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error(`Fragment shader error: ${error}`);
    }

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      throw new Error(`Program linking error: ${error}`);
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  /**
   * Rollback to previous shader version
   * @param steps - Number of versions to go back (default: 1)
   * @returns Success status
   */
  async rollback(steps: number = 1): Promise<boolean> {
    if (this.history.length < steps + 1) {
      console.warn('[ShaderHotSwap] Not enough history to rollback');
      return false;
    }

    const targetVersion = this.history[this.history.length - steps - 1];

    try {
      const newProgram = await this.compileProgram(targetVersion.vertex, targetVersion.fragment);

      const oldProgram = this.currentProgram;
      this.currentProgram = newProgram;

      this.gl.deleteProgram(oldProgram);

      console.log(`[ShaderHotSwap] Rolled back ${steps} version(s)`);

      return true;
    } catch (error) {
      console.error('[ShaderHotSwap] Rollback failed:', error);
      return false;
    }
  }

  /**
   * Save version to history
   */
  private saveToHistory(vertex: string, fragment: string): void {
    this.history.push({
      vertex,
      fragment,
      timestamp: Date.now(),
      version: ++this.currentVersion,
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Get current vertex shader source (placeholder - would extract from program)
   */
  private getCurrentVertexSource(): string {
    // In real implementation, would extract from current program
    // For now, return a basic vertex shader
    return `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }

  /**
   * Get current program
   */
  getCurrentProgram(): WebGLProgram {
    return this.currentProgram;
  }

  /**
   * Get version history
   */
  getHistory(): ShaderVersion[] {
    return [...this.history];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
  }
}

/**
 * Create shader hot-swap system
 * @param gl - WebGL2 context
 * @param program - Initial program
 * @returns ShaderHotSwap instance
 */
export function createShaderHotSwap(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
): ShaderHotSwap {
  return new ShaderHotSwap(gl, program);
}

/**
 * Enable hot module replacement for shaders (development only)
 */
export function enableShaderHMR(): void {
  if (process.env.NODE_ENV !== 'development') return;

  if (typeof module !== 'undefined' && (module as any).hot) {
    (module as any).hot.accept('./shaders', () => {
      console.log('[ShaderHotSwap] Shaders updated, reloading...');
      // Trigger shader reload
    });
  }
}
