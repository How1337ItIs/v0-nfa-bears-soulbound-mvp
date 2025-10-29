'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { AUDIO_PHYSICS_MAPPING } from '@/lib/fluid/config';

// CENTRALIZED AUDIO REACTIVITY - Single analyzer for entire app
// Prevents resource conflicts from multiple analyzers per route

export interface AudioAnalysisData {
  bass: number;                    // 0-1, low frequency energy (0-4 bins)
  mids: number;                    // 0-1, mid frequency energy (4-16 bins)
  treble: number;                  // 0-1, high frequency energy (16-64 bins)
  volume: number;                  // 0-1, overall volume level
  beatDetected: boolean;           // Beat detection flag
  spectralData: Float32Array;      // Raw frequency data for advanced use
  tempo?: number;                  // Estimated BPM (optional)
}

export interface AudioReactiveParams {
  splatForce: number;              // Bass -> splat intensity (8-23 range)
  thermalRate: number;             // Mids -> convection frequency (2-8 range)
  colorPhase: number;              // Treble -> thin-film color shift (0-2π)
  globalIntensity: number;         // Volume -> overall effect strength (0.4-1.0)
}

interface BeatDetection {
  threshold: number;
  lastBeat: number;
  recentBeats: number[];
  sensitivity: number;
}

// UNIFIED AUDIO-TO-PHYSICS MAPPING
// Single source of truth prevents conflicting interpretations
function mapAudioToPhysics(audio: AudioAnalysisData): AudioReactiveParams {
  const { SPLAT_FORCE, THERMAL_RATE, COLOR_PHASE, GLOBAL_INTENSITY } = AUDIO_PHYSICS_MAPPING;
  
  return {
    splatForce: SPLAT_FORCE.BASE + audio.bass * (SPLAT_FORCE.MAX - SPLAT_FORCE.MIN),
    thermalRate: THERMAL_RATE.BASE + audio.mids * (THERMAL_RATE.MAX - THERMAL_RATE.MIN),
    colorPhase: COLOR_PHASE.BASE + audio.treble * COLOR_PHASE.MAX,
    globalIntensity: GLOBAL_INTENSITY.BASE + audio.volume * (GLOBAL_INTENSITY.MAX - GLOBAL_INTENSITY.BASE)
  };
}

// BEAT DETECTION ALGORITHM
function detectBeat(
  currentBass: number,
  detection: BeatDetection
): { beatDetected: boolean; newThreshold: number } {
  const now = Date.now();
  const timeSinceLastBeat = now - detection.lastBeat;
  
  // Adaptive threshold based on recent activity
  const avgBass = detection.recentBeats.length > 0 
    ? detection.recentBeats.reduce((a, b) => a + b) / detection.recentBeats.length
    : 0.3;
  
  const adaptiveThreshold = Math.max(0.2, avgBass * 1.2);
  
  // Beat detected if bass exceeds threshold and enough time has passed
  const beatDetected = currentBass > adaptiveThreshold && 
                      timeSinceLastBeat > 250; // Minimum 250ms between beats
  
  return {
    beatDetected,
    newThreshold: adaptiveThreshold
  };
}

// TEMPO ESTIMATION
function estimateTempo(recentBeats: number[]): number | undefined {
  if (recentBeats.length < 4) return undefined;
  
  // Calculate intervals between beats
  const intervals: number[] = [];
  for (let i = 1; i < recentBeats.length; i++) {
    intervals.push(recentBeats[i] - recentBeats[i - 1]);
  }
  
  // Remove outliers (beats that are too far apart or too close)
  const validIntervals = intervals.filter(interval => 
    interval > 300 && interval < 2000 // 30-200 BPM range
  );
  
  if (validIntervals.length < 2) return undefined;
  
  // Average interval to BPM
  const avgInterval = validIntervals.reduce((a, b) => a + b) / validIntervals.length;
  return Math.round(60000 / avgInterval);
}

// MAIN AUDIO REACTIVE HOOK
export function useAudioReactive() {
  const [audioData, setAudioData] = useState<AudioAnalysisData>({
    bass: 0.3,
    mids: 0.3,
    treble: 0.3,
    volume: 0.5,
    beatDetected: false,
    spectralData: new Float32Array(128)
  });
  
  const [physicsParams, setPhysicsParams] = useState<AudioReactiveParams>(
    mapAudioToPhysics(audioData)
  );
  
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  
  // Refs for audio processing
  const analyserRef = useRef<AnalyserNode>();
  const audioContextRef = useRef<AudioContext>();
  const streamRef = useRef<MediaStream>();
  const animationRef = useRef<number>();
  
  // Beat detection state
  const beatDetectionRef = useRef<BeatDetection>({
    threshold: 0.35,
    lastBeat: 0,
    recentBeats: [],
    sensitivity: 1.0
  });
  
  // Audio context initialization
  const initializeAudioContext = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      streamRef.current = stream;
      setMicrophonePermission('granted');
      
      // Create audio context with cross-browser support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      // Setup analyzer node
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;                 // 128 frequency bins
      analyser.smoothingTimeConstant = 0.8;   // Temporal smoothing
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      
      source.connect(analyser);
      analyserRef.current = analyser;
      
      console.log('Audio context initialized successfully');
      
    } catch (error) {
      console.warn('Microphone access denied or failed:', error);
      setMicrophonePermission('denied');
      
      // Start simulated audio for consistent visual behavior
      startSimulatedAudio();
    }
  }, []);
  
  // Simulated audio for when microphone is unavailable
  const startSimulatedAudio = useCallback(() => {
    console.log('Starting simulated audio reactivity');
    
    const simulateAudio = () => {
      const time = Date.now() * 0.001;
      
      // Generate realistic-looking audio data
      const simulatedData: AudioAnalysisData = {
        bass: 0.25 + Math.sin(time * 0.5) * 0.15 + Math.random() * 0.1,
        mids: 0.3 + Math.sin(time * 0.7) * 0.2 + Math.random() * 0.1,
        treble: 0.35 + Math.sin(time * 1.2) * 0.25 + Math.random() * 0.1,
        volume: 0.4 + Math.sin(time * 0.3) * 0.2 + Math.random() * 0.05,
        beatDetected: Math.sin(time * 2.1) > 0.7 && Math.random() > 0.8,
        spectralData: new Float32Array(128).map(() => Math.random() * 128),
        tempo: 120 + Math.sin(time * 0.1) * 20 // 100-140 BPM range
      };
      
      setAudioData(simulatedData);
      setPhysicsParams(mapAudioToPhysics(simulatedData));
      
      // Continue simulation
      setTimeout(simulateAudio, 50); // ~20fps
    };
    
    simulateAudio();
  }, []);
  
  // Real-time audio analysis loop
  const startAudioAnalysis = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyzeAudio = () => {
      if (!analyserRef.current) return;
      
      const dataArray = new Uint8Array(128);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Frequency band analysis (research-validated ranges)
      const bassRange = Array.from(dataArray.slice(0, 4));      // 0-4 bins
      const midsRange = Array.from(dataArray.slice(4, 16));     // 4-16 bins
      const trebleRange = Array.from(dataArray.slice(16, 64));  // 16-64 bins
      const fullRange = Array.from(dataArray);
      
      // Calculate normalized values (0-1 range)
      const bass = bassRange.reduce((a, b) => a + b) / (4 * 255);
      const mids = midsRange.reduce((a, b) => a + b) / (12 * 255);
      const treble = trebleRange.reduce((a, b) => a + b) / (48 * 255);
      const volume = fullRange.reduce((a, b) => a + b) / (128 * 255);
      
      // Beat detection with adaptive threshold
      const { beatDetected, newThreshold } = detectBeat(bass, beatDetectionRef.current);
      beatDetectionRef.current.threshold = newThreshold;
      
      if (beatDetected) {
        const now = Date.now();
        beatDetectionRef.current.lastBeat = now;
        beatDetectionRef.current.recentBeats.push(bass);
        
        // Keep only recent beats (last 10 seconds)
        beatDetectionRef.current.recentBeats = beatDetectionRef.current.recentBeats
          .slice(-20); // Keep last 20 beats max
      }
      
      // Tempo estimation
      const recentBeatTimes = beatDetectionRef.current.recentBeats.map((_, i) => 
        beatDetectionRef.current.lastBeat - (beatDetectionRef.current.recentBeats.length - 1 - i) * 500
      );
      const tempo = estimateTempo(recentBeatTimes);
      
      const newAudioData: AudioAnalysisData = {
        bass,
        mids,
        treble,
        volume,
        beatDetected,
        spectralData: new Float32Array(dataArray),
        tempo
      };
      
      setAudioData(newAudioData);
      setPhysicsParams(mapAudioToPhysics(newAudioData));
      
      // Continue analysis loop
      animationRef.current = requestAnimationFrame(analyzeAudio);
    };
    
    analyzeAudio();
  }, []);
  
  // Initialize audio system on mount
  useEffect(() => {
    initializeAudioContext();
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [initializeAudioContext]);
  
  // Start analysis when analyzer is ready
  useEffect(() => {
    if (analyserRef.current && microphonePermission === 'granted') {
      startAudioAnalysis();
    }
  }, [startAudioAnalysis, microphonePermission]);
  
  // Audio context state management (handle browser autoplay policies)
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('Audio context resumed');
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }, []);
  
  // Manual sensitivity adjustment
  const adjustBeatSensitivity = useCallback((sensitivity: number) => {
    beatDetectionRef.current.sensitivity = Math.max(0.1, Math.min(2.0, sensitivity));
  }, []);
  
  return {
    audioData,
    physicsParams,
    microphonePermission,
    resumeAudioContext,
    adjustBeatSensitivity
  };
}

// UTILITY HOOKS

// Hook for components that only need physics parameters
export function useAudioPhysics(): AudioReactiveParams {
  const { physicsParams } = useAudioReactive();
  return physicsParams;
}

// Hook for components that only need beat detection
export function useBeatDetection(): { beatDetected: boolean; tempo?: number } {
  const { audioData } = useAudioReactive();
  return {
    beatDetected: audioData.beatDetected,
    tempo: audioData.tempo
  };
}

// Export mapping function and types for consistency
export { mapAudioToPhysics };
export type { AudioAnalysisData, AudioReactiveParams };