/**
 * GPU MEMORY MANAGEMENT FOR LIQUID LIGHT
 * 
 * Efficient GPU memory management for liquid light system
 * Includes texture pooling, buffer management, and memory monitoring
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface GPUMemoryInfo {
  totalMemory: number;
  usedMemory: number;
  availableMemory: number;
  memoryUsage: number; // 0-1
  textureCount: number;
  bufferCount: number;
  programCount: number;
}

export interface TexturePool {
  id: string;
  width: number;
  height: number;
  format: number;
  type: number;
  textures: WebGLTexture[];
  available: WebGLTexture[];
  inUse: Set<WebGLTexture>;
}

export interface BufferPool {
  id: string;
  size: number;
  usage: number;
  buffers: WebGLBuffer[];
  available: WebGLBuffer[];
  inUse: Set<WebGLBuffer>;
}

export class GPUMemoryManager {
  private gl: WebGL2RenderingContext;
  private texturePools: Map<string, TexturePool> = new Map();
  private bufferPools: Map<string, BufferPool> = new Map();
  private memoryInfo: GPUMemoryInfo;
  private maxMemoryUsage: number = 0.8; // 80% max usage
  private cleanupInterval: number | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.memoryInfo = {
      totalMemory: this.estimateTotalMemory(),
      usedMemory: 0,
      availableMemory: 0,
      memoryUsage: 0,
      textureCount: 0,
      bufferCount: 0,
      programCount: 0,
    };
    this.startMemoryMonitoring();
  }

  private estimateTotalMemory(): number {
    // Estimate total GPU memory based on device capabilities
    const capabilities = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
    const maxTextureSize = capabilities || 4096;
    
    // Rough estimation: 4GB for high-end, 2GB for mid-range, 1GB for low-end
    if (maxTextureSize >= 8192) return 4 * 1024 * 1024 * 1024; // 4GB
    if (maxTextureSize >= 4096) return 2 * 1024 * 1024 * 1024; // 2GB
    return 1 * 1024 * 1024 * 1024; // 1GB
  }

  private startMemoryMonitoring() {
    this.cleanupInterval = window.setInterval(() => {
      this.updateMemoryInfo();
      this.performCleanup();
    }, 1000); // Check every second
  }

  private updateMemoryInfo() {
    let usedMemory = 0;
    let textureCount = 0;
    let bufferCount = 0;

    // Count textures
    this.texturePools.forEach(pool => {
      textureCount += pool.textures.length;
      usedMemory += pool.textures.length * pool.width * pool.height * 4; // RGBA
    });

    // Count buffers
    this.bufferPools.forEach(pool => {
      bufferCount += pool.buffers.length;
      usedMemory += pool.buffers.length * pool.size;
    });

    this.memoryInfo = {
      ...this.memoryInfo,
      usedMemory,
      availableMemory: this.memoryInfo.totalMemory - usedMemory,
      memoryUsage: usedMemory / this.memoryInfo.totalMemory,
      textureCount,
      bufferCount,
    };
  }

  private performCleanup() {
    if (this.memoryInfo.memoryUsage > this.maxMemoryUsage) {
      this.cleanupUnusedResources();
    }
  }

  private cleanupUnusedResources() {
    // Clean up unused textures
    this.texturePools.forEach(pool => {
      const unused = pool.textures.filter(tex => !pool.inUse.has(tex));
      unused.forEach(tex => {
        this.gl.deleteTexture(tex);
        const index = pool.textures.indexOf(tex);
        if (index > -1) pool.textures.splice(index, 1);
        const availIndex = pool.available.indexOf(tex);
        if (availIndex > -1) pool.available.splice(availIndex, 1);
      });
    });

    // Clean up unused buffers
    this.bufferPools.forEach(pool => {
      const unused = pool.buffers.filter(buf => !pool.inUse.has(buf));
      unused.forEach(buf => {
        this.gl.deleteBuffer(buf);
        const index = pool.buffers.indexOf(buf);
        if (index > -1) pool.buffers.splice(index, 1);
        const availIndex = pool.available.indexOf(buf);
        if (availIndex > -1) pool.available.splice(availIndex, 1);
      });
    });
  }

  public createTexturePool(id: string, width: number, height: number, format: number = this.gl.RGBA, type: number = this.gl.UNSIGNED_BYTE, initialCount: number = 5): TexturePool {
    const pool: TexturePool = {
      id,
      width,
      height,
      format,
      type,
      textures: [],
      available: [],
      inUse: new Set(),
    };

    // Create initial textures
    for (let i = 0; i < initialCount; i++) {
      const texture = this.gl.createTexture();
      if (texture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, format, width, height, 0, format, type, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        
        pool.textures.push(texture);
        pool.available.push(texture);
      }
    }

    this.texturePools.set(id, pool);
    return pool;
  }

  public getTexture(poolId: string): WebGLTexture | null {
    const pool = this.texturePools.get(poolId);
    if (!pool) return null;

    if (pool.available.length > 0) {
      const texture = pool.available.pop()!;
      pool.inUse.add(texture);
      return texture;
    }

    // Create new texture if pool is empty
    const texture = this.gl.createTexture();
    if (texture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, pool.format, pool.width, pool.height, 0, pool.format, pool.type, null);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      
      pool.textures.push(texture);
      pool.inUse.add(texture);
    }

    return texture;
  }

  public releaseTexture(poolId: string, texture: WebGLTexture) {
    const pool = this.texturePools.get(poolId);
    if (!pool) return;

    if (pool.inUse.has(texture)) {
      pool.inUse.delete(texture);
      pool.available.push(texture);
    }
  }

  public createBufferPool(id: string, size: number, usage: number = this.gl.DYNAMIC_DRAW, initialCount: number = 5): BufferPool {
    const pool: BufferPool = {
      id,
      size,
      usage,
      buffers: [],
      available: [],
      inUse: new Set(),
    };

    // Create initial buffers
    for (let i = 0; i < initialCount; i++) {
      const buffer = this.gl.createBuffer();
      if (buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, size, usage);
        
        pool.buffers.push(buffer);
        pool.available.push(buffer);
      }
    }

    this.bufferPools.set(id, pool);
    return pool;
  }

  public getBuffer(poolId: string): WebGLBuffer | null {
    const pool = this.bufferPools.get(poolId);
    if (!pool) return null;

    if (pool.available.length > 0) {
      const buffer = pool.available.pop()!;
      pool.inUse.add(buffer);
      return buffer;
    }

    // Create new buffer if pool is empty
    const buffer = this.gl.createBuffer();
    if (buffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, pool.size, pool.usage);
      
      pool.buffers.push(buffer);
      pool.inUse.add(buffer);
    }

    return buffer;
  }

  public releaseBuffer(poolId: string, buffer: WebGLBuffer) {
    const pool = this.bufferPools.get(poolId);
    if (!pool) return;

    if (pool.inUse.has(buffer)) {
      pool.inUse.delete(buffer);
      pool.available.push(buffer);
    }
  }

  public getMemoryInfo(): GPUMemoryInfo {
    return { ...this.memoryInfo };
  }

  public isMemoryLow(): boolean {
    return this.memoryInfo.memoryUsage > this.maxMemoryUsage;
  }

  public setMaxMemoryUsage(usage: number) {
    this.maxMemoryUsage = Math.max(0, Math.min(1, usage));
  }

  public cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Clean up all resources
    this.texturePools.forEach(pool => {
      pool.textures.forEach(texture => this.gl.deleteTexture(texture));
    });
    this.texturePools.clear();

    this.bufferPools.forEach(pool => {
      pool.buffers.forEach(buffer => this.gl.deleteBuffer(buffer));
    });
    this.bufferPools.clear();
  }
}

export function createGPUMemoryManager(gl: WebGL2RenderingContext): GPUMemoryManager {
  return new GPUMemoryManager(gl);
}

