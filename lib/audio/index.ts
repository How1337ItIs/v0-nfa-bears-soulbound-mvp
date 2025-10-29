/**
 * Audio Module Exports
 */

export { useAudioReactive } from './useAudioReactive';
export {
  AUDIO_PHYSICS_MAPPING,
  mapAudioToPhysics,
  calculatePhysicsParams,
  MODE_PRESETS,
} from './mapping';
export type { AudioData, PhysicsParams, ModeType } from './mapping';
export {
  BeatDetector,
  createBeatDetector,
  createDanceFloorDetector,
  createAmbientDetector,
} from './beatDetector';
export type { BeatDetectionResult, BeatDetectorConfig } from './beatDetector';
