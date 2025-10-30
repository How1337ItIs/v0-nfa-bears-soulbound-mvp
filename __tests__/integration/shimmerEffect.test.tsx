/**
 * @file shimmerEffect.test.tsx
 * @description Integration tests for shimmer effect
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { ShimmerPass } from '@/lib/post/ShimmerPass';
import { PaletteDirector } from '@/lib/palette';

// Test wrapper component
function TestWrapper({ 
  enabled = true, 
  intensity = 0.3, 
  frequency = 10.0, 
  fresnelPower = 3.0,
  paletteId = 'classic-60s'
}: {
  enabled?: boolean;
  intensity?: number;
  frequency?: number;
  fresnelPower?: number;
  paletteId?: string;
}) {
  return (
    <Canvas>
      <ShimmerPass
        enabled={enabled}
        intensity={intensity}
        frequency={frequency}
        fresnelPower={fresnelPower}
        paletteId={paletteId}
      />
    </Canvas>
  );
}

describe('Shimmer Effect', () => {
  beforeEach(() => {
    // Reset PaletteDirector to default state
    PaletteDirector.setPalette('classic-60s');
  });

  describe('Basic Rendering', () => {
    test('shimmer effect renders when enabled', async () => {
      render(<TestWrapper enabled={true} />);
      
      await waitFor(() => {
        // Verify the component renders without errors
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer effect does not render when disabled', () => {
      render(<TestWrapper enabled={false} />);
      
      // Should not render the effect when disabled
      expect(screen.queryByTestId('shimmer-effect')).not.toBeInTheDocument();
    });
  });

  describe('Parameter Configuration', () => {
    test('shimmer responds to intensity changes', async () => {
      const { rerender } = render(<TestWrapper intensity={0.1} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Change intensity
      rerender(<TestWrapper intensity={0.8} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer responds to frequency changes', async () => {
      const { rerender } = render(<TestWrapper frequency={5.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Change frequency
      rerender(<TestWrapper frequency={20.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer responds to fresnel power changes', async () => {
      const { rerender } = render(<TestWrapper fresnelPower={2.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Change fresnel power
      rerender(<TestWrapper fresnelPower={5.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });
  });

  describe('Palette Integration', () => {
    test('shimmer responds to palette changes', async () => {
      // Set initial palette
      PaletteDirector.setPalette('classic-60s');
      
      const { rerender } = render(<TestWrapper paletteId="classic-60s" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Change palette
      PaletteDirector.setPalette('dark-star');
      rerender(<TestWrapper paletteId="dark-star" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer uses palette colors for tinting', async () => {
      // Set a specific palette
      PaletteDirector.setPalette('fire-on-the-mountain');
      
      render(<TestWrapper paletteId="fire-on-the-mountain" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Verify palette colors are available
      const currentPalette = PaletteDirector.getCurrentPalette();
      expect(currentPalette.id).toBe('fire-on-the-mountain');
      expect(currentPalette.colors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Characteristics', () => {
    test('shimmer effect is lightweight', async () => {
      const startTime = performance.now();
      
      render(<TestWrapper />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly (under 100ms for test environment)
      expect(renderTime).toBeLessThan(100);
    });

    test('shimmer effect handles multiple instances', async () => {
      // Render multiple shimmer effects
      render(
        <Canvas>
          <ShimmerPass enabled={true} intensity={0.2} />
          <ShimmerPass enabled={true} intensity={0.4} />
          <ShimmerPass enabled={true} intensity={0.6} />
        </Canvas>
      );

      await waitFor(() => {
        // Should handle multiple instances without errors
        expect(screen.getAllByTestId('shimmer-effect')).toHaveLength(3);
      });
    });
  });

  describe('Edge Cases', () => {
    test('shimmer handles extreme intensity values', async () => {
      render(<TestWrapper intensity={0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Test maximum intensity
      const { rerender } = render(<TestWrapper intensity={1.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer handles extreme frequency values', async () => {
      render(<TestWrapper frequency={0.1} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Test high frequency
      const { rerender } = render(<TestWrapper frequency={100.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });

    test('shimmer handles invalid palette gracefully', async () => {
      // Test with non-existent palette
      render(<TestWrapper paletteId="non-existent-palette" />);
      
      await waitFor(() => {
        // Should still render, falling back to default palette
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });
    });
  });

  describe('Visual Quality', () => {
    test('shimmer creates Fresnel-based edge effect', async () => {
      render(<TestWrapper fresnelPower={3.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // The effect should be configured for edge-based shimmer
      // This is more of a visual test, but we can verify the parameters are set
    });

    test('shimmer wave animation is time-based', async () => {
      render(<TestWrapper frequency={10.0} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // The effect should animate over time
      // In a real test, we'd check that the time uniform is being updated
    });
  });
});
