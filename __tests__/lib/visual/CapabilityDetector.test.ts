/**
 * UNIT TESTS FOR CAPABILITY DETECTOR
 * 
 * Tests for the CapabilityDetector service including device capability
 * detection, performance tier assignment, and WebGL support checking.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { CapabilityDetector } from '../../../lib/visual/CapabilityDetector';
import { DeviceCapabilities, DeviceTier } from '../../../lib/visual/types';

// Mock WebGL context
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  getSupportedExtensions: jest.fn(() => [])
};

// Mock canvas
const mockCanvas = {
  getContext: jest.fn(() => mockWebGLContext)
};

// Mock document.createElement
Object.defineProperty(document, 'createElement', {
  writable: true,
  value: jest.fn(() => mockCanvas)
});

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 8
});

describe('CapabilityDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default WebGL context mock
    mockWebGLContext.getParameter.mockImplementation((param) => {
      switch (param) {
        case 3379: // MAX_TEXTURE_SIZE
          return 4096;
        case 34921: // MAX_VERTEX_ATTRIBS
          return 16;
        case 36347: // MAX_VARYING_VECTORS
          return 8;
        case 36349: // MAX_FRAGMENT_UNIFORM_VECTORS
          return 16;
        case 36347: // MAX_VERTEX_UNIFORM_VECTORS
          return 16;
        case 34930: // MAX_TEXTURE_IMAGE_UNITS
          return 8;
        case 35660: // MAX_VERTEX_TEXTURE_IMAGE_UNITS
          return 4;
        case 35661: // MAX_COMBINED_TEXTURE_IMAGE_UNITS
          return 16;
        case 34024: // MAX_RENDERBUFFER_SIZE
          return 4096;
        case 3386: // MAX_VIEWPORT_DIMS
          return [4096, 4096];
        case 33901: // ALIASED_LINE_WIDTH_RANGE
          return [1, 1];
        case 33902: // ALIASED_POINT_SIZE_RANGE
          return [1, 1];
        default:
          return 0;
      }
    });
  });

  describe('detect', () => {
    it('should return device capabilities', () => {
      const capabilities = CapabilityDetector.detect();
      
      expect(capabilities).toBeDefined();
      expect(capabilities).toHaveProperty('maxTextureSize');
      expect(capabilities).toHaveProperty('maxVertexAttribs');
      expect(capabilities).toHaveProperty('maxVaryingVectors');
      expect(capabilities).toHaveProperty('maxFragmentUniforms');
      expect(capabilities).toHaveProperty('maxVertexUniforms');
      expect(capabilities).toHaveProperty('maxTextureImageUnits');
      expect(capabilities).toHaveProperty('maxVertexTextureImageUnits');
      expect(capabilities).toHaveProperty('maxCombinedTextureImageUnits');
      expect(capabilities).toHaveProperty('maxRenderBufferSize');
      expect(capabilities).toHaveProperty('maxViewportDims');
      expect(capabilities).toHaveProperty('aliasedLineWidthRange');
      expect(capabilities).toHaveProperty('aliasedPointSizeRange');
      expect(capabilities).toHaveProperty('deviceMemory');
      expect(capabilities).toHaveProperty('mobile');
    });

    it('should detect WebGL capabilities correctly', () => {
      const capabilities = CapabilityDetector.detect();
      
      expect(capabilities.maxTextureSize).toBe(4096);
      expect(capabilities.maxVertexAttribs).toBe(16);
      expect(capabilities.maxVaryingVectors).toBe(8);
      expect(capabilities.maxFragmentUniforms).toBe(16);
      expect(capabilities.maxVertexUniforms).toBe(16);
      expect(capabilities.maxTextureImageUnits).toBe(8);
      expect(capabilities.maxVertexTextureImageUnits).toBe(4);
      expect(capabilities.maxCombinedTextureImageUnits).toBe(16);
      expect(capabilities.maxRenderBufferSize).toBe(4096);
    });

    it('should detect device memory', () => {
      const capabilities = CapabilityDetector.detect();
      expect(typeof capabilities.deviceMemory).toBe('number');
      expect(capabilities.deviceMemory).toBeGreaterThan(0);
    });

    it('should detect mobile devices', () => {
      // Test desktop
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
      let capabilities = CapabilityDetector.detect();
      expect(capabilities.mobile).toBe(false);

      // Test mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      capabilities = CapabilityDetector.detect();
      expect(capabilities.mobile).toBe(true);
    });

    it('should handle missing deviceMemory', () => {
      delete (navigator as any).deviceMemory;
      const capabilities = CapabilityDetector.detect();
      expect(capabilities.deviceMemory).toBe(4); // Default fallback
    });
  });

  describe('getDeviceTier', () => {
    it('should return ultra tier for high-end devices', () => {
      const capabilities: DeviceCapabilities = {
        maxTextureSize: 8192,
        maxVertexAttribs: 32,
        maxVaryingVectors: 16,
        maxFragmentUniforms: 32,
        maxVertexUniforms: 32,
        maxTextureImageUnits: 16,
        maxVertexTextureImageUnits: 16,
        maxCombinedTextureImageUnits: 32,
        maxRenderBufferSize: 8192,
        maxViewportDims: [8192, 8192],
        aliasedLineWidthRange: [1, 10],
        aliasedPointSizeRange: [1, 10],
        deviceMemory: 16,
        mobile: false
      };

      const tier = CapabilityDetector.getDeviceTier(capabilities);
      expect(tier).toBe('ultra');
    });

    it('should return high tier for good devices', () => {
      const capabilities: DeviceCapabilities = {
        maxTextureSize: 4096,
        maxVertexAttribs: 16,
        maxVaryingVectors: 8,
        maxFragmentUniforms: 16,
        maxVertexUniforms: 16,
        maxTextureImageUnits: 8,
        maxVertexTextureImageUnits: 4,
        maxCombinedTextureImageUnits: 16,
        maxRenderBufferSize: 4096,
        maxViewportDims: [4096, 4096],
        aliasedLineWidthRange: [1, 5],
        aliasedPointSizeRange: [1, 5],
        deviceMemory: 8,
        mobile: false
      };

      const tier = CapabilityDetector.getDeviceTier(capabilities);
      expect(tier).toBe('high');
    });

    it('should return medium tier for mid-range devices', () => {
      const capabilities: DeviceCapabilities = {
        maxTextureSize: 2048,
        maxVertexAttribs: 8,
        maxVaryingVectors: 4,
        maxFragmentUniforms: 8,
        maxVertexUniforms: 8,
        maxTextureImageUnits: 4,
        maxVertexTextureImageUnits: 2,
        maxCombinedTextureImageUnits: 8,
        maxRenderBufferSize: 2048,
        maxViewportDims: [2048, 2048],
        aliasedLineWidthRange: [1, 2],
        aliasedPointSizeRange: [1, 2],
        deviceMemory: 4,
        mobile: false
      };

      const tier = CapabilityDetector.getDeviceTier(capabilities);
      expect(tier).toBe('medium');
    });

    it('should return low tier for low-end devices', () => {
      const capabilities: DeviceCapabilities = {
        maxTextureSize: 1024,
        maxVertexAttribs: 4,
        maxVaryingVectors: 2,
        maxFragmentUniforms: 4,
        maxVertexUniforms: 4,
        maxTextureImageUnits: 2,
        maxVertexTextureImageUnits: 1,
        maxCombinedTextureImageUnits: 4,
        maxRenderBufferSize: 1024,
        maxViewportDims: [1024, 1024],
        aliasedLineWidthRange: [1, 1],
        aliasedPointSizeRange: [1, 1],
        deviceMemory: 2,
        mobile: true
      };

      const tier = CapabilityDetector.getDeviceTier(capabilities);
      expect(tier).toBe('low');
    });

    it('should handle mobile devices appropriately', () => {
      const capabilities: DeviceCapabilities = {
        maxTextureSize: 4096,
        maxVertexAttribs: 16,
        maxVaryingVectors: 8,
        maxFragmentUniforms: 16,
        maxVertexUniforms: 16,
        maxTextureImageUnits: 8,
        maxVertexTextureImageUnits: 4,
        maxCombinedTextureImageUnits: 16,
        maxRenderBufferSize: 4096,
        maxViewportDims: [4096, 4096],
        aliasedLineWidthRange: [1, 5],
        aliasedPointSizeRange: [1, 5],
        deviceMemory: 8,
        mobile: true
      };

      const tier = CapabilityDetector.getDeviceTier(capabilities);
      expect(tier).toBe('high'); // Mobile can still be high tier
    });
  });

  describe('isWebGL2Supported', () => {
    it('should return true when WebGL2 is supported', () => {
      mockCanvas.getContext.mockReturnValue(mockWebGLContext);
      const supported = CapabilityDetector.isWebGL2Supported();
      expect(supported).toBe(true);
    });

    it('should return false when WebGL2 is not supported', () => {
      mockCanvas.getContext.mockReturnValue(null);
      const supported = CapabilityDetector.isWebGL2Supported();
      expect(supported).toBe(false);
    });

    it('should fallback to WebGL1 when WebGL2 is not available', () => {
      mockCanvas.getContext.mockImplementation((contextType) => {
        if (contextType === 'webgl2') return null;
        if (contextType === 'webgl') return mockWebGLContext;
        return null;
      });
      
      const supported = CapabilityDetector.isWebGL2Supported();
      expect(supported).toBe(false); // Should return false for WebGL1
    });
  });

  describe('isMobile', () => {
    it('should detect mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      expect(CapabilityDetector.isMobile()).toBe(true);
    });

    it('should detect Android devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36'
      });
      expect(CapabilityDetector.isMobile()).toBe(true);
    });

    it('should detect desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
      expect(CapabilityDetector.isMobile()).toBe(false);
    });

    it('should detect tablet devices as mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      expect(CapabilityDetector.isMobile()).toBe(true);
    });
  });

  describe('getMemoryEstimate', () => {
    it('should return device memory when available', () => {
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 8
      });
      const memory = CapabilityDetector.getMemoryEstimate();
      expect(memory).toBe(8);
    });

    it('should return fallback memory when not available', () => {
      delete (navigator as any).deviceMemory;
      const memory = CapabilityDetector.getMemoryEstimate();
      expect(memory).toBe(4); // Default fallback
    });

    it('should handle invalid memory values', () => {
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 0
      });
      const memory = CapabilityDetector.getMemoryEstimate();
      expect(memory).toBe(4); // Should use fallback for invalid values
    });
  });

  describe('error handling', () => {
    it('should handle WebGL context creation failure', () => {
      mockCanvas.getContext.mockImplementation(() => {
        throw new Error('WebGL not supported');
      });
      
      expect(() => CapabilityDetector.detect()).not.toThrow();
      const capabilities = CapabilityDetector.detect();
      expect(capabilities.maxTextureSize).toBe(0);
    });

    it('should handle missing WebGL parameters', () => {
      mockWebGLContext.getParameter.mockReturnValue(undefined);
      
      expect(() => CapabilityDetector.detect()).not.toThrow();
      const capabilities = CapabilityDetector.detect();
      expect(capabilities.maxTextureSize).toBe(0);
    });
  });

  describe('performance', () => {
    it('should detect capabilities quickly', () => {
      const start = performance.now();
      CapabilityDetector.detect();
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should get device tier quickly', () => {
      const capabilities = CapabilityDetector.detect();
      
      const start = performance.now();
      CapabilityDetector.getDeviceTier(capabilities);
      const end = performance.now();
      expect(end - start).toBeLessThan(10); // Should complete in under 10ms
    });
  });
});
