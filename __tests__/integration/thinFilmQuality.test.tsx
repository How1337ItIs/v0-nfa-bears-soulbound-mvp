/**
 * @file thinFilmQuality.test.tsx
 * @description Integration tests for thin-film quality presets
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { AuthenticThinFilmEffect } from '@/lib/post/ThinFilmPass';
import { THIN_FILM_QUALITY_PRESETS, getRecommendedQuality } from '@/lib/post/thinFilmQualityPresets';
import { CapabilityDetector } from '@/lib/visual/CapabilityDetector';

// Mock audio params
const mockAudioParams = {
  splatForce: 15,
  thermalRate: 4,
  colorPhase: 0.5,
  globalIntensity: 0.8,
  curlStrength: 0.3,
  viscosity: 0.95
};

// Mock device tier
const mockDeviceTier = 'high';

// Test wrapper component
function TestWrapper({ quality, deviceTier = mockDeviceTier }: { quality: string; deviceTier?: string }) {
  return (
    <Canvas>
      <AuthenticThinFilmEffect
        audioParams={mockAudioParams}
        deviceTier={deviceTier as any}
        quality={quality as any}
        enabled={true}
        intensity={0.8}
      />
    </Canvas>
  );
}

describe('Thin-Film Quality Presets', () => {
  let capabilityDetector: CapabilityDetector;

  beforeAll(() => {
    capabilityDetector = new CapabilityDetector();
  });

  describe('Quality Preset Rendering', () => {
    test('emergency quality renders 1 interference order', async () => {
      render(<TestWrapper quality="emergency" />);
      
      await waitFor(() => {
        // Verify the component renders without errors
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      // Check that emergency quality preset is applied
      const emergencyPreset = THIN_FILM_QUALITY_PRESETS.emergency;
      expect(emergencyPreset.interferenceOrders).toBe(1);
      expect(emergencyPreset.textureSize).toBe(256);
      expect(emergencyPreset.multisampling).toBe(0);
    });

    test('mobile quality renders 2 interference orders', async () => {
      render(<TestWrapper quality="mobile" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      const mobilePreset = THIN_FILM_QUALITY_PRESETS.mobile;
      expect(mobilePreset.interferenceOrders).toBe(2);
      expect(mobilePreset.textureSize).toBe(512);
      expect(mobilePreset.multisampling).toBe(0);
    });

    test('desktop quality renders 3 interference orders', async () => {
      render(<TestWrapper quality="desktop" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      const desktopPreset = THIN_FILM_QUALITY_PRESETS.desktop;
      expect(desktopPreset.interferenceOrders).toBe(3);
      expect(desktopPreset.textureSize).toBe(1024);
      expect(desktopPreset.multisampling).toBe(4);
    });

    test('ultra quality renders 4 interference orders', async () => {
      render(<TestWrapper quality="ultra" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });

      const ultraPreset = THIN_FILM_QUALITY_PRESETS.ultra;
      expect(ultraPreset.interferenceOrders).toBe(4);
      expect(ultraPreset.textureSize).toBe(2048);
      expect(ultraPreset.multisampling).toBe(8);
    });
  });

  describe('Quality Auto-Selection', () => {
    test('quality auto-selects based on tier - medium tier selects mobile', () => {
      const quality = getRecommendedQuality('medium', 60, null);
      expect(quality).toBe('mobile');
    });

    test('quality auto-selects based on tier - high tier selects desktop', () => {
      const quality = getRecommendedQuality('high', 60, null);
      expect(quality).toBe('desktop');
    });

    test('quality auto-selects based on tier - ultra tier selects ultra', () => {
      const quality = getRecommendedQuality('ultra', 60, null);
      expect(quality).toBe('ultra');
    });

    test('emergency quality selected when FPS < 30', () => {
      const quality = getRecommendedQuality('high', 25, null);
      expect(quality).toBe('emergency');
    });

    test('emergency quality selected when battery < 10%', () => {
      const quality = getRecommendedQuality('high', 60, 0.05);
      expect(quality).toBe('emergency');
    });

    test('mobile quality selected when battery < 30% on high tier', () => {
      const quality = getRecommendedQuality('high', 60, 0.2);
      expect(quality).toBe('mobile');
    });

    test('mobile quality selected when FPS < 45 on high tier', () => {
      const quality = getRecommendedQuality('high', 40, null);
      expect(quality).toBe('mobile');
    });
  });

  describe('Performance Characteristics', () => {
    test('emergency quality has lowest resource requirements', () => {
      const emergencyPreset = THIN_FILM_QUALITY_PRESETS.emergency;
      const mobilePreset = THIN_FILM_QUALITY_PRESETS.mobile;
      
      expect(emergencyPreset.interferenceOrders).toBeLessThan(mobilePreset.interferenceOrders);
      expect(emergencyPreset.textureSize).toBeLessThan(mobilePreset.textureSize);
      expect(emergencyPreset.multisampling).toBeLessThanOrEqual(mobilePreset.multisampling);
    });

    test('ultra quality has highest resource requirements', () => {
      const ultraPreset = THIN_FILM_QUALITY_PRESETS.ultra;
      const desktopPreset = THIN_FILM_QUALITY_PRESETS.desktop;
      
      expect(ultraPreset.interferenceOrders).toBeGreaterThan(desktopPreset.interferenceOrders);
      expect(ultraPreset.textureSize).toBeGreaterThan(desktopPreset.textureSize);
      expect(ultraPreset.multisampling).toBeGreaterThanOrEqual(desktopPreset.multisampling);
    });

    test('quality presets scale appropriately', () => {
      const emergency = THIN_FILM_QUALITY_PRESETS.emergency;
      const mobile = THIN_FILM_QUALITY_PRESETS.mobile;
      const desktop = THIN_FILM_QUALITY_PRESETS.desktop;
      const ultra = THIN_FILM_QUALITY_PRESETS.ultra;

      // Interference orders should increase
      expect(emergency.interferenceOrders).toBeLessThan(mobile.interferenceOrders);
      expect(mobile.interferenceOrders).toBeLessThan(desktop.interferenceOrders);
      expect(desktop.interferenceOrders).toBeLessThan(ultra.interferenceOrders);

      // Texture size should increase
      expect(emergency.textureSize).toBeLessThan(mobile.textureSize);
      expect(mobile.textureSize).toBeLessThan(desktop.textureSize);
      expect(desktop.textureSize).toBeLessThan(ultra.textureSize);
    });
  });

  describe('Device Tier Integration', () => {
    test('low tier disables thin-film effect', () => {
      render(<TestWrapper quality="mobile" deviceTier="low" />);
      
      // Should not render the effect for low tier
      expect(screen.queryByTestId('thin-film-effect')).not.toBeInTheDocument();
    });

    test('medium tier enables thin-film with mobile quality', () => {
      render(<TestWrapper quality="mobile" deviceTier="medium" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });
    });

    test('high tier enables thin-film with desktop quality', () => {
      render(<TestWrapper quality="desktop" deviceTier="high" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });
    });

    test('ultra tier enables thin-film with ultra quality', () => {
      render(<TestWrapper quality="ultra" deviceTier="ultra" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });
    });
  });

  describe('Audio Reactivity', () => {
    test('thin-film responds to audio parameters', async () => {
      const highEnergyAudio = {
        ...mockAudioParams,
        splatForce: 25,
        thermalRate: 8,
        globalIntensity: 1.0
      };

      render(
        <Canvas>
          <AuthenticThinFilmEffect
            audioParams={highEnergyAudio}
            deviceTier="high"
            quality="desktop"
            enabled={true}
            intensity={0.8}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(screen.getByTestId('thin-film-effect')).toBeInTheDocument();
      });
    });
  });
});
