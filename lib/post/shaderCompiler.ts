/**
 * SHADER COMPILATION OPTIMIZER
 *
 * Precompiles and caches shader programs to reduce initial load time.
 * Provides shader program pooling and reuse.
 *
 * Features:
 * - Shader program cache
 * - Async compilation
 * - Error handling
 * - Statistics tracking
 *
 * Usage:
 * ```typescript
 * const compiler = new ShaderCompiler(gl);
 *
 * const program = await compiler.getProgram('myShader', vertexShader, fragmentShader);
 * // Returns cached program if available
 * ```
 */

export interface ShaderCompilationStats {
  totalCompilations: number;
  cacheHits: number;
  cacheMisses: number;
  compilationErrors: number;
  avgCompilationTime: number;
}

export class ShaderCompiler {
  private gl: WebGL2RenderingContext;
  private programCache: Map<string, WebGLProgram> = new Map();
  private stats: ShaderCompilationStats = {
    totalCompilations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    compilationErrors: 0,
    avgCompilationTime: 0,
  };
  private compilationTimes: number[] = [];

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /**
   * Get or compile shader program
   * @param key - Cache key
   * @param vertexSource - Vertex shader source
   * @param fragmentSource - Fragment shader source
   * @returns Compiled program
   */
  async getProgram(
    key: string,
    vertexSource: string,
    fragmentSource: string
  ): Promise<WebGLProgram | null> {
    this.stats.totalCompilations++;

    // Check cache
    if (this.programCache.has(key)) {
      this.stats.cacheHits++;
      return this.programCache.get(key)!;
    }

    this.stats.cacheMisses++;

    // Compile
    const startTime = performance.now();

    try {
      const program = await this.compileProgram(vertexSource, fragmentSource);

      const compilationTime = performance.now() - startTime;
      this.compilationTimes.push(compilationTime);

      // Update average
      this.stats.avgCompilationTime =
        this.compilationTimes.reduce((a, b) => a + b) / this.compilationTimes.length;

      // Cache
      this.programCache.set(key, program);

      console.log(`[ShaderCompiler] Compiled '${key}' in ${compilationTime.toFixed(2)}ms`);

      return program;
    } catch (error) {
      this.stats.compilationErrors++;
      console.error(`[ShaderCompiler] Error compiling '${key}':`, error);
      return null;
    }
  }

  /**
   * Compile shader program
   * @param vertexSource - Vertex shader source
   * @param fragmentSource - Fragment shader source
   * @returns Compiled program
   */
  private async compileProgram(
    vertexSource: string,
    fragmentSource: string
  ): Promise<WebGLProgram> {
    const gl = this.gl;

    // Compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(vertexShader);
      gl.deleteShader(vertexShader);
      throw new Error(`Vertex shader compilation failed: ${error}`);
    }

    // Compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(fragmentShader);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error(`Fragment shader compilation failed: ${error}`);
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
      throw new Error(`Program linking failed: ${error}`);
    }

    // Clean up shaders (no longer needed after linking)
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  /**
   * Precompile shaders during idle time
   * @param shaders - Array of {key, vertex, fragment}
   */
  async precompileShaders(
    shaders: Array<{ key: string; vertex: string; fragment: string }>
  ): Promise<void> {
    console.log(`[ShaderCompiler] Precompiling ${shaders.length} shaders...`);

    for (const shader of shaders) {
      await this.getProgram(shader.key, shader.vertex, shader.fragment);
    }

    console.log('[ShaderCompiler] Precompilation complete');
  }

  /**
   * Get compilation statistics
   */
  getStats(): ShaderCompilationStats {
    return { ...this.stats };
  }

  /**
   * Clear program cache
   */
  clearCache(): void {
    // Dispose all programs
    for (const program of this.programCache.values()) {
      this.gl.deleteProgram(program);
    }

    this.programCache.clear();
  }

  /**
   * Dispose of specific cached program
   * @param key - Cache key
   */
  dispose(key: string): void {
    const program = this.programCache.get(key);
    if (program) {
      this.gl.deleteProgram(program);
      this.programCache.delete(key);
    }
  }

  /**
   * Print statistics
   */
  printStats(): void {
    const stats = this.getStats();

    console.group('[ShaderCompiler Stats]');
    console.log(`Total compilations: ${stats.totalCompilations}`);
    console.log(`Cache hits: ${stats.cacheHits}`);
    console.log(`Cache misses: ${stats.cacheMisses}`);
    console.log(`Errors: ${stats.compilationErrors}`);
    console.log(`Avg compilation time: ${stats.avgCompilationTime.toFixed(2)}ms`);
    console.log(`Cache efficiency: ${((stats.cacheHits / stats.totalCompilations) * 100).toFixed(1)}%`);
    console.groupEnd();
  }
}

/**
 * Create shader compiler
 * @param gl - WebGL2 context
 * @returns ShaderCompiler instance
 */
export function createShaderCompiler(gl: WebGL2RenderingContext): ShaderCompiler {
  return new ShaderCompiler(gl);
}
