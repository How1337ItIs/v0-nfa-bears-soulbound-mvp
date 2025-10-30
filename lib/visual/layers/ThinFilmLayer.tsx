import React from 'react';
import { AuthenticThinFilmEffect } from '@/lib/post/ThinFilmPass';

export interface ThinFilmLayerProps {
  audioParams: {
    splatForce: number;
    thermalRate: number;
    colorPhase: number;
    globalIntensity: number;
  };
  deviceTier: 'low' | 'medium' | 'high';
  paletteId?: string;
  enabled?: boolean;
  intensity?: number;
}

export function ThinFilmLayer({ audioParams, deviceTier, paletteId, enabled, intensity }: ThinFilmLayerProps) {
  if (deviceTier === 'low') return null;
  return (
    <div className="thin-film-layer" style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
      <AuthenticThinFilmEffect
        audioParams={audioParams as any}
        deviceTier={deviceTier}
        paletteId={paletteId}
        enabled={enabled}
        intensity={intensity}
      />
    </div>
  );
}

