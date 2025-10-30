import { createAmbientDetector, createBeatDetector, createDanceFloorDetector, BeatDetector } from './beatDetector';

export class AudioModeManager {
  private detectors: Record<string, BeatDetector> = {
    'dance-floor': createDanceFloorDetector(),
    'ambient': createAmbientDetector(),
    'reactive': createDanceFloorDetector(),
    'default': createBeatDetector(),
  };

  getDetector(mode: string): BeatDetector {
    return this.detectors[mode] || this.detectors.default;
  }
}

