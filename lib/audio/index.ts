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

// Spectral analysis
export {
  calculateSpectralCentroid,
  calculateSpectralRolloff,
  calculateSpectralFlux,
  analyzeHarmonicContent,
  mapCentroidToTemperature,
  SpectralAnalyzer,
} from './spectralAnalysis';

// Onset detection
export {
  OnsetDetector,
  createOnsetDetector,
  createPercussiveOnsetDetector,
  createMelodicOnsetDetector,
} from './onsetDetector';
export type { OnsetDetectionResult, OnsetDetectorConfig } from './onsetDetector';

// Tempo tracking
export {
  TempoTracker,
  createTempoTracker,
} from './tempoTracker';
export type { TempoEstimate, TempoTrackerConfig } from './tempoTracker';

// Audio events
export {
  AudioEventEmitter,
  globalAudioEvents,
  useAudioEvent,
} from './audioEventEmitter';
export type {
  BeatEventData,
  OnsetEventData,
  DropEventData,
  BuildupEventData,
  SilenceEventData,
  TempoChangeEventData,
} from './audioEventEmitter';
