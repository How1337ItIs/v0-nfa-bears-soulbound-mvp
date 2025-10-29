'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// CENTRALIZED AUDIO REACTIVITY - Single analyzer for entire app
// Per ChatGPT-5 recommendation: avoid multiple analyzers per route

interface AudioAnalysisData {
  bass: number;          // 0-1, affects splat force & oil thickness
  mids: number;          // 0-1, affects flow velocity
  treble: number;        // 0-1, affects surface iridescence  
  volume: number;        // 0-1, overall intensity multiplier
  beatDetected: boolean; // beat detection for pulse effects
  spectralData: Float32Array; // raw frequency data for advanced use
}

interface AudioReactiveParams {
  splatForce: number;    // Bass -> splat intensity (5-25 range)
  thermalRate: number;   // Mids -> convection frequency (1-10 range)
  colorPhase: number;    // Treble -> thin-film color shift (0-2π range)
  globalIntensity: number; // Volume -> overall effect strength (0.3-1.2 range)
}

// UNIFIED AUDIO-TO-PHYSICS MAPPING (single source of truth)
// Prevents different components from using conflicting mappings
function mapAudioToPhysics(audio: AudioAnalysisData): AudioReactiveParams {
  return {
    splatForce: 8 + audio.bass * 15,              // 8-23 range for authentic physics
    thermalRate: 2 + audio.mids * 6,              // 2-8 convection splats per 10s
    colorPhase: audio.treble * Math.PI * 2,       // 0-2π for color rotation
    globalIntensity: 0.4 + audio.volume * 0.6    // 0.4-1.0 prevents invisible effects
  };
}

export function useAudioReactiveEngine() {
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
  
  const analyserRef = useRef<AnalyserNode>();
  const beatDetectionRef = useRef({ 
    lastBeat: 0, 
    threshold: 0.35,
    recentBeats: [] as number[]
  });
  const audioContextRef = useRef<AudioContext>();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Initialize audio context and analyzer
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    
    const initAudio = async () => {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create audio context (cross-browser support)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;
        
        // Setup analyzer
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256; // 128 frequency bins
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        setPermissionGranted(true);
        
        // Real-time audio analysis loop
        const updateAudioData = () => {
          if (!analyserRef.current) return;
          
          const dataArray = new Uint8Array(128);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Frequency band analysis (authentic mapping from research)
          const bassRange = Array.from(dataArray.slice(0, 4));
          const midsRange = Array.from(dataArray.slice(4, 16));
          const trebleRange = Array.from(dataArray.slice(16, 64));
          
          const bass = bassRange.reduce((a, b) => a + b) / (4 * 255);
          const mids = midsRange.reduce((a, b) => a + b) / (12 * 255);
          const treble = trebleRange.reduce((a, b) => a + b) / (48 * 255);
          const volume = Array.from(dataArray).reduce((a, b) => a + b) / (128 * 255);
          
          // Enhanced beat detection with history
          const now = Date.now();
          const beatDetected = bass > beatDetectionRef.current.threshold && 
                              (now - beatDetectionRef.current.lastBeat) > 250;
          
          if (beatDetected) {
            beatDetectionRef.current.lastBeat = now;
            beatDetectionRef.current.recentBeats.push(now);
            
            // Keep only recent beats (last 5 seconds)
            beatDetectionRef.current.recentBeats = beatDetectionRef.current.recentBeats
              .filter(time => now - time < 5000);
          }
          
          const newAudioData: AudioAnalysisData = {
            bass,
            mids,
            treble,
            volume,
            beatDetected,
            spectralData: new Float32Array(dataArray)
          };
          
          setAudioData(newAudioData);
          setPhysicsParams(mapAudioToPhysics(newAudioData));
          
          requestAnimationFrame(updateAudioData);
        };
        
        updateAudioData();
        
        // Cleanup function
        cleanup = () => {
          stream.getTracks().forEach(track => track.stop());
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        };
        
      } catch (error) {
        console.warn('Microphone access denied or failed:', error);
        setPermissionGranted(false);
        
        // Fallback: simulated audio data for visual consistency
        const simulateAudio = () => {
          const time = Date.now() * 0.001;
          const simulatedData: AudioAnalysisData = {
            bass: 0.3 + Math.sin(time * 0.5) * 0.2,
            mids: 0.3 + Math.sin(time * 0.7) * 0.2,
            treble: 0.3 + Math.sin(time * 1.2) * 0.2,
            volume: 0.5 + Math.sin(time * 0.3) * 0.1,
            beatDetected: Math.sin(time * 2) > 0.8,
            spectralData: new Float32Array(128)
          };
          
          setAudioData(simulatedData);
          setPhysicsParams(mapAudioToPhysics(simulatedData));
          
          setTimeout(simulateAudio, 50); // ~20fps simulation
        };
        
        simulateAudio();
      }
    };
    
    initAudio();
    
    return cleanup || (() => {});
  }, []);
  
  // Audio context state management
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
  
  // Tempo detection (bonus feature for future use)
  const getEstimatedTempo = useCallback(() => {
    const recentBeats = beatDetectionRef.current.recentBeats;
    if (recentBeats.length < 4) return null;
    
    // Calculate intervals between recent beats
    const intervals = [];
    for (let i = 1; i < recentBeats.length; i++) {
      intervals.push(recentBeats[i] - recentBeats[i - 1]);
    }
    
    // Average interval to BPM
    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    return Math.round(60000 / avgInterval); // BPM
  }, []);
  
  return {
    audioData,
    physicsParams,
    permissionGranted,
    resumeAudioContext,
    getEstimatedTempo
  };
}

// Utility hook for components that only need physics parameters
export function useAudioPhysics() {
  const { physicsParams } = useAudioReactiveEngine();
  return physicsParams;
}

// Export the mapping function for consistency across components
export { mapAudioToPhysics };
export type { AudioAnalysisData, AudioReactiveParams };