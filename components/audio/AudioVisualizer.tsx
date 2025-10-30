/**
 * @file AudioVisualizer.tsx
 * @description Real-time audio visualization components
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { AudioData } from '@/lib/audio';

interface AudioVisualizerProps {
  audioData: AudioData | null;
  className?: string;
  showBeatIndicator?: boolean;
  showFrequencyBars?: boolean;
  showWaveform?: boolean;
}

export function AudioVisualizer({
  audioData,
  className = '',
  showBeatIndicator = true,
  showFrequencyBars = true,
  showWaveform = false,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [beatFlash, setBeatFlash] = useState(false);

  // Beat flash effect
  useEffect(() => {
    if (audioData?.beatDetected) {
      setBeatFlash(true);
      const timer = setTimeout(() => setBeatFlash(false), 150);
      return () => clearTimeout(timer);
    }
  }, [audioData?.beatDetected]);

  // Frequency bars visualization
  useEffect(() => {
    if (!showFrequencyBars || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrequencyBars = () => {
      if (!audioData) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw frequency bars
      const barCount = 32;
      const barWidth = width / barCount;
      const maxHeight = height * 0.8;

      // Bass bars (red)
      const bassBars = Math.floor(barCount * 0.3);
      for (let i = 0; i < bassBars; i++) {
        const barHeight = (audioData.bass * maxHeight) * (1 - i / bassBars * 0.5);
        ctx.fillStyle = `rgba(255, 100, 100, ${0.7 + audioData.bass * 0.3})`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
      }

      // Mids bars (green)
      const midsStart = bassBars;
      const midsBars = Math.floor(barCount * 0.4);
      for (let i = 0; i < midsBars; i++) {
        const barHeight = (audioData.mids * maxHeight) * (1 - i / midsBars * 0.3);
        ctx.fillStyle = `rgba(100, 255, 100, ${0.7 + audioData.mids * 0.3})`;
        ctx.fillRect((midsStart + i) * barWidth, height - barHeight, barWidth - 2, barHeight);
      }

      // Treble bars (blue)
      const trebleStart = midsStart + midsBars;
      const trebleBars = barCount - trebleStart;
      for (let i = 0; i < trebleBars; i++) {
        const barHeight = (audioData.treble * maxHeight) * (1 - i / trebleBars * 0.2);
        ctx.fillStyle = `rgba(100, 100, 255, ${0.7 + audioData.treble * 0.3})`;
        ctx.fillRect((trebleStart + i) * barWidth, height - barHeight, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(drawFrequencyBars);
    };

    drawFrequencyBars();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, showFrequencyBars]);

  if (!audioData) {
    return (
      <div className={`flex items-center justify-center text-white/50 ${className}`}>
        No audio data
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Beat indicator */}
      {showBeatIndicator && (
        <div
          className={`absolute top-2 right-2 w-4 h-4 rounded-full transition-all duration-150 ${
            beatFlash
              ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-125'
              : 'bg-white/20'
          }`}
          title={`Beat: ${audioData.beatDetected ? 'YES' : 'NO'}`}
        />
      )}

      {/* Frequency bars canvas */}
      {showFrequencyBars && (
        <canvas
          ref={canvasRef}
          width={320}
          height={120}
          className="w-full h-full rounded"
        />
      )}

      {/* Audio level meters */}
      <div className="absolute bottom-2 left-2 right-2 space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-12 text-white/70">Bass:</span>
          <div className="flex-1 h-2 bg-white/20 rounded overflow-hidden">
            <div
              className="h-full bg-red-400 transition-all duration-100"
              style={{ width: `${audioData.bass * 100}%` }}
            />
          </div>
          <span className="w-8 text-white/70">{(audioData.bass * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-12 text-white/70">Mids:</span>
          <div className="flex-1 h-2 bg-white/20 rounded overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-100"
              style={{ width: `${audioData.mids * 100}%` }}
            />
          </div>
          <span className="w-8 text-white/70">{(audioData.mids * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-12 text-white/70">Treble:</span>
          <div className="flex-1 h-2 bg-white/20 rounded overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all duration-100"
              style={{ width: `${audioData.treble * 100}%` }}
            />
          </div>
          <span className="w-8 text-white/70">{(audioData.treble * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-12 text-white/70">Vol:</span>
          <div className="flex-1 h-2 bg-white/20 rounded overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-100"
              style={{ width: `${audioData.volume * 100}%` }}
            />
          </div>
          <span className="w-8 text-white/70">{(audioData.volume * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* BPM display */}
      {audioData.tempo && (
        <div className="absolute top-2 left-2 text-xs text-white/70">
          BPM: {Math.round(audioData.tempo)}
        </div>
      )}
    </div>
  );
}

/**
 * Compact audio level indicator
 */
export function AudioLevelIndicator({ audioData, className = '' }: { audioData: AudioData | null; className?: string }) {
  if (!audioData) return null;

  const overallLevel = (audioData.bass + audioData.mids + audioData.treble) / 3;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-white/20" />
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-1 h-3 rounded-sm ${
              overallLevel * 5 >= level ? 'bg-green-400' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
