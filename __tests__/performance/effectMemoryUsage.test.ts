/**
 * @file effectMemoryUsage.test.ts
 * @description Performance tests for effect memory usage
 */

import { render, screen, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { ComprehensiveEffectComposer } from '@/lib/post/ComprehensiveEffectComposer';
import type { ShaderPreset } from '@/components/liquid-light/ShaderPresets';

// Mock audio params
const mockAudioParams = {
  splatForce: 15,
  thermalRate: 4,
  colorPhase: 0.5,
  globalIntensity: 0.8,
  curlStrength: 0.3,
  viscosity: 0.95
};

// Mock performance API
const mockPerformance = {
  memory: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  }
};

// Mock WebGL context
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  createTexture: jest.fn(),
  deleteTexture: jest.fn(),
  createBuffer: jest.fn(),
  deleteBuffer: jest.fn(),
  createFramebuffer: jest.fn(),
  deleteFramebuffer: jest.fn(),
  createRenderbuffer: jest.fn(),
  deleteRenderbuffer: jest.fn(),
  createProgram: jest.fn(),
  deleteProgram: jest.fn(),
  createShader: jest.fn(),
  deleteShader: jest.fn(),
};

// Mock WebGL extensions
const mockWebGLExtensions = {
  'WEBGL_lose_context': {
    loseContext: jest.fn(),
    restoreContext: jest.fn()
  },
  'EXT_disjoint_timer_query': {
    createQueryEXT: jest.fn(),
    deleteQueryEXT: jest.fn(),
    beginQueryEXT: jest.fn(),
    endQueryEXT: jest.fn(),
    getQueryObjectEXT: jest.fn()
  }
};

// Setup mocks
beforeAll(() => {
  // Mock performance API
  Object.defineProperty(window, 'performance', {
    value: mockPerformance,
    writable: true
  });

  // Mock WebGL context
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(() => mockWebGLContext)
  });

  // Mock WebGL extensions
  mockWebGLContext.getExtension = jest.fn((name) => mockWebGLExtensions[name]);
});

// Helper function to get memory usage
function getMemoryUsage(): number {
  if (window.performance && (window.performance as any).memory) {
    return (window.performance as any).memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
  }
  return 0;
}

// Helper function to measure memory usage
async function measureMemoryUsage(
  renderFn: () => void,
  duration = 1000
): Promise<{ initial: number; peak: number; final: number; delta: number }> {
  const initial = getMemoryUsage();
  let peak = initial;
  
  renderFn();
  
  const startTime = Date.now();
  const checkInterval = 100; // Check every 100ms
  
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const current = getMemoryUsage();
      peak = Math.max(peak, current);
      
      if (Date.now() - startTime >= duration) {
        clearInterval(interval);
        const final = getMemoryUsage();
        resolve({
          initial,
          peak,
          final,
          delta: final - initial
        });
      }
    }, checkInterval);
  });
}

// Test wrapper component
function TestWrapper({ 
  effects,
  audioParams = mockAudioParams,
  deviceTier = 'high',
  paletteId = 'classic-60s',
  quality = 'desktop',
  mode = 'trip'
}: {
  effects: ShaderPreset;
  audioParams?: typeof mockAudioParams;
  deviceTier?: 'low' | 'medium' | 'high' | 'ultra';
  paletteId?: string;
  quality?: 'emergency' | 'mobile' | 'desktop' | 'ultra';
  mode?: 'ambient' | 'trip';
}) {
  return (
    <Canvas>
      <ComprehensiveEffectComposer
        effects={effects}
        audioParams={audioParams}
        deviceTier={deviceTier}
        paletteId={paletteId}
        quality={quality}
        mode={mode}
        intensity={0.8}
      />
    </Canvas>
  );
}

describe('Effect Memory Usage', () => {
  beforeEach(() => {
    // Reset memory mock
    mockPerformance.memory.usedJSHeapSize = 50 * 1024 * 1024; // 50MB baseline
  });

  describe('Memory Leak Detection', () => {
    test('toggling effects does not leak memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      const { rerender } = render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });

      // Toggle effects 20 times
      for (let i = 0; i < 20; i++) {
        const newEffects: ShaderPreset = {
          ...effects,
          shimmer: i % 2 === 0,
          chromatic: i % 3 === 0,
        };
        
        rerender(<TestWrapper effects={newEffects} />);
        
        // Wait for render
        await waitFor(() => {
          expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
        });
        
        // Small delay to allow cleanup
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Check final memory usage
      const finalMemory = getMemoryUsage();
      expect(finalMemory).toBeLessThan(100); // Should not exceed 100MB
    }, 10000);

    test('disposing effects releases memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const { unmount } = render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // Memory should be released
      const finalMemory = getMemoryUsage();
      expect(finalMemory).toBeLessThan(80); // Should be close to initial
    });

    test('multiple effect instances do not accumulate memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      // Render multiple instances
      const { unmount: unmount1 } = render(<TestWrapper effects={effects} />);
      const { unmount: unmount2 } = render(<TestWrapper effects={effects} />);
      const { unmount: unmount3 } = render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getAllByTestId('effect-composer')).toHaveLength(3);
      });

      // Unmount all instances
      unmount1();
      unmount2();
      unmount3();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 200));

      // Memory should be released
      const finalMemory = getMemoryUsage();
      expect(finalMemory).toBeLessThan(90);
    });
  });

  describe('Memory Usage by Effect', () => {
    test('thin-film effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: true,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(20); // Should use less than 20MB
    });

    test('shimmer effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: true,
        chromatic: false,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(10); // Should use less than 10MB
    });

    test('flow field effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: true,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(15); // Should use less than 15MB
    });

    test('chromatic aberration effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(5); // Should use less than 5MB
    });

    test('kaleidoscope effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: true,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(10); // Should use less than 10MB
    });

    test('vignette effect memory usage', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(5); // Should use less than 5MB
    });
  });

  describe('Quality Level Memory Impact', () => {
    test('emergency quality uses minimal memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: false,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} quality="emergency" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(10); // Should use less than 10MB
    });

    test('mobile quality uses moderate memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} quality="mobile" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(20); // Should use less than 20MB
    });

    test('desktop quality uses more memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} quality="desktop" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(40); // Should use less than 40MB
    });

    test('ultra quality uses maximum memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} quality="ultra" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(60); // Should use less than 60MB
    });
  });

  describe('Device Tier Memory Impact', () => {
    test('low tier uses minimal memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: false, // Disabled for low tier
        shimmer: false,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} deviceTier="low" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(10); // Should use less than 10MB
    });

    test('medium tier uses moderate memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: false,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} deviceTier="medium" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(25); // Should use less than 25MB
    });

    test('high tier uses more memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} deviceTier="high" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(45); // Should use less than 45MB
    });

    test('ultra tier uses maximum memory', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const memoryUsage = await measureMemoryUsage(() => {
        render(<TestWrapper effects={effects} deviceTier="ultra" />);
      }, 2000);

      expect(memoryUsage.delta).toBeLessThan(65); // Should use less than 65MB
    });
  });

  describe('Memory Cleanup', () => {
    test('effects cleanup on unmount', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const { unmount } = render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });

      // Record memory before unmount
      const beforeUnmount = getMemoryUsage();

      // Unmount
      unmount();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 500));

      // Record memory after unmount
      const afterUnmount = getMemoryUsage();

      // Memory should be released
      expect(afterUnmount).toBeLessThanOrEqual(beforeUnmount);
    });

    test('effects cleanup on effect change', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const { rerender } = render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });

      // Change effects
      const newEffects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      rerender(<TestWrapper effects={newEffects} />);

      await waitFor(() => {
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });

      // Memory should be cleaned up
      const finalMemory = getMemoryUsage();
      expect(finalMemory).toBeLessThan(100);
    });
  });
});
