/**
 * Audio Module Exports
 */

export { useAudioReactive } from './useAudioReactive';

// Basic mapping
export {
  AUDIO_PHYSICS_MAPPING,
  mapAudioToPhysics,
  calculatePhysicsParams,
  MODE_PRESETS,
} from './mapping';
export type { AudioData, PhysicsParams, ModeType } from './mapping';

// Advanced curves and smoothing
export {
  softKnee,
  powerCurve,
  sCurve,
  EMASmootherBank,
  BeatGate,
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
} from './mapping';
export type {
  BeatGateConfig,
  EnhancedAudioProcessor,
} from './mapping';

// Beat detection
export {
  BeatDetector,
  createBeatDetector,
  createDanceFloorDetector,
  createAmbientDetector,
} from './beatDetector';
export type { BeatDetectionResult, BeatDetectorConfig } from './beatDetector';
