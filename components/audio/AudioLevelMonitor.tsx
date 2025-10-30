/**
 * @file AudioLevelMonitor.tsx
 * @description Audio level monitoring and warning component
 */

'use client';

import React, { useEffect, useState } from 'react';
import type { AudioData } from '@/lib/audio';

interface AudioLevelMonitorProps {
  audioData: AudioData | null;
  warningThreshold?: number;
  dangerThreshold?: number;
  onWarning?: (level: 'warning' | 'danger', message: string) => void;
  className?: string;
}

export function AudioLevelMonitor({
  audioData,
  warningThreshold = 0.8,
  dangerThreshold = 0.95,
  onWarning,
  className = '',
}: AudioLevelMonitorProps) {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [lastWarningTime, setLastWarningTime] = useState<number>(0);

  useEffect(() => {
    if (!audioData) return;

    const currentTime = performance.now();
    const newWarnings: string[] = [];

    // Check for high volume levels
    if (audioData.volume > dangerThreshold) {
      newWarnings.push(`Danger: Volume at ${(audioData.volume * 100).toFixed(0)}%`);
      if (onWarning && currentTime - lastWarningTime > 1000) {
        onWarning('danger', 'Audio levels are dangerously high');
        setLastWarningTime(currentTime);
      }
    } else if (audioData.volume > warningThreshold) {
      newWarnings.push(`Warning: Volume at ${(audioData.volume * 100).toFixed(0)}%`);
      if (onWarning && currentTime - lastWarningTime > 2000) {
        onWarning('warning', 'Audio levels are high');
        setLastWarningTime(currentTime);
      }
    }

    // Check for clipping in frequency bands
    if (audioData.bass > 0.98) {
      newWarnings.push('Bass clipping detected');
    }
    if (audioData.mids > 0.98) {
      newWarnings.push('Mids clipping detected');
    }
    if (audioData.treble > 0.98) {
      newWarnings.push('Treble clipping detected');
    }

    // Check for silence
    if (audioData.volume < 0.01) {
      newWarnings.push('Audio silence detected');
    }

    setWarnings(newWarnings);
  }, [audioData, warningThreshold, dangerThreshold, onWarning, lastWarningTime]);

  if (!audioData) {
    return (
      <div className={`text-white/50 text-sm ${className}`}>
        No audio data
      </div>
    );
  }

  const hasWarnings = warnings.length > 0;
  const hasDanger = warnings.some(w => w.includes('Danger') || w.includes('clipping'));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Level indicators */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            audioData.volume > dangerThreshold ? 'bg-red-500' :
            audioData.volume > warningThreshold ? 'bg-yellow-500' :
            'bg-green-500'
          }`} />
          <span className="text-xs text-white/70">
            {audioData.volume > dangerThreshold ? 'Danger' :
             audioData.volume > warningThreshold ? 'Warning' :
             'Normal'}
          </span>
        </div>

        <div className="text-xs text-white/70">
          Vol: {(audioData.volume * 100).toFixed(0)}%
        </div>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className={`p-2 rounded text-xs ${
          hasDanger ? 'bg-red-900/50 text-red-200' : 'bg-yellow-900/50 text-yellow-200'
        }`}>
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className="text-xs">⚠️</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Frequency band levels */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-8 text-white/70">Bass:</span>
          <div className="flex-1 h-1 bg-white/20 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                audioData.bass > 0.98 ? 'bg-red-500' :
                audioData.bass > 0.8 ? 'bg-yellow-500' :
                'bg-red-400'
              }`}
              style={{ width: `${audioData.bass * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-8 text-white/70">Mids:</span>
          <div className="flex-1 h-1 bg-white/20 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                audioData.mids > 0.98 ? 'bg-red-500' :
                audioData.mids > 0.8 ? 'bg-yellow-500' :
                'bg-green-400'
              }`}
              style={{ width: `${audioData.mids * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-8 text-white/70">Treble:</span>
          <div className="flex-1 h-1 bg-white/20 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                audioData.treble > 0.98 ? 'bg-red-500' :
                audioData.treble > 0.8 ? 'bg-yellow-500' :
                'bg-blue-400'
              }`}
              style={{ width: `${audioData.treble * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact level monitor for status bars
 */
export function CompactLevelMonitor({
  audioData,
  warningThreshold = 0.8,
  dangerThreshold = 0.95,
  className = '',
}: Omit<AudioLevelMonitorProps, 'onWarning'>) {
  if (!audioData) return null;

  const level = audioData.volume;
  const status = level > dangerThreshold ? 'danger' :
                level > warningThreshold ? 'warning' : 'normal';

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'danger' ? 'bg-red-500' :
        status === 'warning' ? 'bg-yellow-500' :
        'bg-green-500'
      }`} />
      <span className="text-xs text-white/70">
        {(level * 100).toFixed(0)}%
      </span>
    </div>
  );
}
