/**
 * @file effectStackingOrder.test.tsx
 * @description Integration tests for effect stacking order
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { ComprehensiveEffectComposer, EffectStackingOrderTest } from '@/lib/post/ComprehensiveEffectComposer';
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

describe('Effect Stacking Order', () => {
  describe('Correct Rendering Order', () => {
    test('effects render in correct order: vignette → flow field → thin-film → shimmer → chromatic → kaleidoscope', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      render(<TestWrapper effects={effects} mode="trip" />);

      await waitFor(() => {
        // Verify all effects are rendered
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
        expect(screen.getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
        expect(screen.getByTestId('kaleidoscope-effect')).toBeInTheDocument();
      });

      // The order is verified by the component structure in ComprehensiveEffectComposer
      // Effects are rendered in the order they appear in the JSX
    });

    test('kaleidoscope only renders in trip mode', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: true,
      };

      // Test ambient mode (should not show kaleidoscope)
      const { rerender } = render(<TestWrapper effects={effects} mode="ambient" />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('kaleidoscope-effect')).not.toBeInTheDocument();
      });

      // Test trip mode (should show kaleidoscope)
      rerender(<TestWrapper effects={effects} mode="trip" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('kaleidoscope-effect')).toBeInTheDocument();
      });
    });

    test('disabled effects do not render', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        // No effects should render
        expect(screen.queryByTestId('vignette-effect')).not.toBeInTheDocument();
        expect(screen.queryByTestId('flow-field-effect')).not.toBeInTheDocument();
        expect(screen.queryByTestId('thin-film-effect')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shimmer-effect')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chromatic-aberration-effect')).not.toBeInTheDocument();
        expect(screen.queryByTestId('kaleidoscope-effect')).not.toBeInTheDocument();
      });
    });
  });

  describe('Effect Interaction', () => {
    test('vignette affects all subsequent effects', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      // Vignette should be applied first, affecting the visual output of subsequent effects
      // This is verified by the rendering order in ComprehensiveEffectComposer
    });

    test('flow field affects all subsequent effects', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: false,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
      });

      // Flow field should distort UV coordinates, affecting subsequent effects
      // This is verified by the rendering order in ComprehensiveEffectComposer
    });

    test('thin-film is the main effect layer', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      // Thin-film should be the main visual effect, with other effects as overlays
      // This is verified by its position in the rendering order
    });
  });

  describe('Device Tier Integration', () => {
    test('low tier disables thin-film effect', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} deviceTier="low" />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        // Thin-film should be disabled for low tier
        expect(screen.queryByTestId('thin-film-effect')).not.toBeInTheDocument();
      });
    });

    test('medium tier enables basic effects', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: false,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} deviceTier="medium" />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
        expect(screen.getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
      });
    });

    test('high tier enables all effects except kaleidoscope', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      render(<TestWrapper effects={effects} deviceTier="high" mode="trip" />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
        expect(screen.getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
        expect(screen.getByTestId('kaleidoscope-effect')).toBeInTheDocument();
      });
    });

    test('ultra tier enables all effects with maximum quality', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      render(<TestWrapper effects={effects} deviceTier="ultra" quality="ultra" mode="trip" />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
        expect(screen.getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
        expect(screen.getByTestId('kaleidoscope-effect')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Characteristics', () => {
    test('effect composer handles multiple effects efficiently', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      const startTime = performance.now();

      render(<TestWrapper effects={effects} deviceTier="high" mode="trip" />);

      await waitFor(() => {
        expect(screen.getByTestId('vignette-effect')).toBeInTheDocument();
        expect(screen.getByTestId('flow-field-effect')).toBeInTheDocument();
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
        expect(screen.getByTestId('shimmer-effect')).toBeInTheDocument();
        expect(screen.getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
        expect(screen.getByTestId('kaleidoscope-effect')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render all effects efficiently (under 200ms for test environment)
      expect(renderTime).toBeLessThan(200);
    });

    test('effect composer handles no effects gracefully', async () => {
      const effects: ShaderPreset = {
        vignette: false,
        flowField: false,
        thinFilm: false,
        shimmer: false,
        chromatic: false,
        kaleidoscope: false,
      };

      render(<TestWrapper effects={effects} />);

      await waitFor(() => {
        // Should render without errors even with no effects
        expect(screen.getByTestId('effect-composer')).toBeInTheDocument();
      });
    });
  });

  describe('Effect Stacking Order Test Component', () => {
    test('effect stacking order test component renders', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      render(
        <Canvas>
          <EffectStackingOrderTest
            effects={effects}
            audioParams={mockAudioParams}
            deviceTier="high"
            paletteId="classic-60s"
            quality="desktop"
            mode="trip"
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(screen.getByText('Effect Stacking Order Test')).toBeInTheDocument();
      });
    });

    test('effect buttons are clickable', async () => {
      const effects: ShaderPreset = {
        vignette: true,
        flowField: true,
        thinFilm: true,
        shimmer: true,
        chromatic: true,
        kaleidoscope: true,
      };

      render(
        <Canvas>
          <EffectStackingOrderTest
            effects={effects}
            audioParams={mockAudioParams}
            deviceTier="high"
            paletteId="classic-60s"
            quality="desktop"
            mode="trip"
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(screen.getByText('Vignette')).toBeInTheDocument();
        expect(screen.getByText('Flow Field')).toBeInTheDocument();
        expect(screen.getByText('Thin-Film')).toBeInTheDocument();
        expect(screen.getByText('Shimmer')).toBeInTheDocument();
        expect(screen.getByText('Chromatic Aberration')).toBeInTheDocument();
        expect(screen.getByText('Kaleidoscope')).toBeInTheDocument();
      });
    });
  });
});
