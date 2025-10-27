'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface AudioAnalysisData {
  bass: number;      // 0-1
  mids: number;      // 0-1
  treble: number;    // 0-1
  volume: number;    // 0-1
  beatDetected: boolean;
  spectralData: Float32Array;
}

export interface AudioReactiveParams {
  splatForce: number;   // 8-23
  thermalRate: number;  // 2-8 splats / 10s
  colorPhase: number;   // 0-2π
  globalIntensity: number; // 0.4-1.0
}

export function mapAudioToPhysics(audio: AudioAnalysisData): AudioReactiveParams {
  return {
    splatForce: 8 + audio.bass * 15,
    thermalRate: 2 + audio.mids * 6,
    colorPhase: audio.treble * Math.PI * 2.0,
    globalIntensity: 0.4 + audio.volume * 0.6
  };
}

export function useAudioReactive() {
  const [audioData, setAudioData] = useState<AudioAnalysisData>({
    bass: 0.3, mids: 0.3, treble: 0.3, volume: 0.5, beatDetected: false,
    spectralData: new Float32Array(128)
  });
  const [physicsParams, setPhysicsParams] = useState<AudioReactiveParams>(mapAudioToPhysics(audioData));

  const analyserRef = useRef<AnalyserNode>();
  const audioContextRef = useRef<AudioContext>();
  const beatRef = useRef({ lastBeat: 0, threshold: 0.35, recentBeats: [] as number[] });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AC();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        const src = ctx.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyserRef.current = analyser;
        setPermissionGranted(true);

        const loop = () => {
          if (!analyserRef.current) return;
          const data = new Uint8Array(128);
          analyserRef.current.getByteFrequencyData(data);

          const bass = Array.from(data.slice(0, 4)).reduce((a, b) => a + b, 0) / (4 * 255);
          const mids = Array.from(data.slice(4, 16)).reduce((a, b) => a + b, 0) / (12 * 255);
          const treble = Array.from(data.slice(16, 64)).reduce((a, b) => a + b, 0) / (48 * 255);
          const volume = Array.from(data).reduce((a, b) => a + b, 0) / (128 * 255);

          const now = Date.now();
          const beatDetected = bass > beatRef.current.threshold && (now - beatRef.current.lastBeat) > 250;
          if (beatDetected) {
            beatRef.current.lastBeat = now;
            beatRef.current.recentBeats.push(now);
            beatRef.current.recentBeats = beatRef.current.recentBeats.filter(t => now - t < 5000);
          }

          const next: AudioAnalysisData = {
            bass, mids, treble, volume, beatDetected, spectralData: Float32Array.from(data)
          };
          setAudioData(next);
          setPhysicsParams(mapAudioToPhysics(next));

          requestAnimationFrame(loop);
        };
        loop();

        cleanup = () => {
          stream.getTracks().forEach(t => t.stop());
          if (ctx.state !== 'closed') ctx.close();
        };
      } catch (err) {
        console.warn('[useAudioReactive] mic denied or failed; simulating audio', err);
        setPermissionGranted(false);
        const sim = () => {
          const t = Date.now() * 0.001;
          const next: AudioAnalysisData = {
            bass: 0.3 + Math.sin(t * 0.5) * 0.2,
            mids: 0.3 + Math.sin(t * 0.7) * 0.2,
            treble: 0.3 + Math.sin(t * 1.2) * 0.2,
            volume: 0.5 + Math.sin(t * 0.3) * 0.1,
            beatDetected: Math.sin(t * 2) > 0.8,
            spectralData: new Float32Array(128)
          };
          setAudioData(next);
          setPhysicsParams(mapAudioToPhysics(next));
          setTimeout(sim, 50);
        };
        sim();
      }
    };
    init();
    return () => { if (cleanup) cleanup(); };
  }, []);

  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try { await audioContextRef.current.resume(); } catch {}
    }
  }, []);

  const getEstimatedTempo = useCallback(() => {
    const beats = beatRef.current.recentBeats;
    if (beats.length < 4) return null;
    const iv = [];
    for (let i = 1; i < beats.length; i++) iv.push(beats[i] - beats[i-1]);
    const avg = iv.reduce((a,b)=>a+b,0) / iv.length;
    return Math.round(60000 / avg);
  }, []);

  return { audioData, physicsParams, permissionGranted, resumeAudioContext, getEstimatedTempo };
}
