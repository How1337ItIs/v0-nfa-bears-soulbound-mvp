'use client';

import React from 'react';
import { ThinFilmOverlay } from '../lib/post/ThinFilmPass';
import { useAudioReactive } from '../lib/audio/useAudioReactive';

/**
 * Optional overlay that adds an iridescent veil above the fluid.
 * Enable only on higher tiers if perf allows.
 */
export default function ThinFilmOverlayExample() {
  const { physicsParams } = useAudioReactive();
  return (
    <ThinFilmOverlay
      enabled={true}
      intensity={0.5 * physicsParams.globalIntensity}
      phase={physicsParams.colorPhase}
    />
  );
}
