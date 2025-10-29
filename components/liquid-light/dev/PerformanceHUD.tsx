'use client';

/**
 * PERFORMANCE HUD - Development-only visual performance monitor
 *
 * Shows real-time metrics:
 * - FPS
 * - Device tier
 * - Audio levels (bass, mids, treble)
 * - Battery status
 * - DPR
 * - Memory usage
 *
 * Only rendered when:
 * - ?debug=true URL param, OR
 * - process.env.NODE_ENV === 'development'
 *
 * Performance cost: <1ms/frame (minimal overhead)
 */

import React, { useEffect, useState, useRef } from 'react';
import type { AudioData } from '@/lib/audio';

export interface PerformanceHUDProps {
  fps?: number;
  tier?: 'low' | 'medium' | 'high' | 'ultra';
  audioData?: AudioData | null;
  dpr?: number;
  enabled?: boolean; // Override visibility
}

export default function PerformanceHUD({
  fps = 0,
  tier = 'medium',
  audioData = null,
  dpr,
  enabled,
}: PerformanceHUDProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const frameCountRef = useRef(0);

  // Check if HUD should be visible
  useEffect(() => {
    // Explicit override
    if (enabled !== undefined) {
      setIsVisible(enabled);
      return;
    }

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug') === 'true';

    // Check dev environment
    const isDev = process.env.NODE_ENV === 'development';

    setIsVisible(debugParam || isDev);
  }, [enabled]);

  // Monitor battery status
  useEffect(() => {
    if (!isVisible) return;

    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          setBatteryLevel(battery.level);
          setBatteryCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(battery.level);
          });
          battery.addEventListener('chargingchange', () => {
            setBatteryCharging(battery.charging);
          });
        } catch (e) {
          // Battery API not available
        }
      }
    };

    updateBattery();
  }, [isVisible]);

  // Monitor memory usage (if available)
  useEffect(() => {
    if (!isVisible) return;

    const updateMemory = () => {
      if ('memory' in performance) {
        const perfMemory = (performance as any).memory;
        if (perfMemory && perfMemory.usedJSHeapSize) {
          const usedMB = perfMemory.usedJSHeapSize / 1024 / 1024;
          setMemoryUsage(usedMB);
        }
      }
    };

    // Update memory every second
    const interval = setInterval(updateMemory, 1000);
    updateMemory();

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  // Format audio levels
  const bassLevel = audioData?.bass ?? 0;
  const midsLevel = audioData?.mids ?? 0;
  const trebleLevel = audioData?.treble ?? 0;

  // FPS color coding
  const fpsColor =
    fps >= 55 ? '#00ff00' : fps >= 30 ? '#ffff00' : '#ff0000';

  // Tier color coding
  const tierColors = {
    low: '#ff6b6b',
    medium: '#ffd93d',
    high: '#6bcf7f',
    ultra: '#4d96ff',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        lineHeight: '1.6',
        zIndex: 99999,
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        minWidth: '200px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '6px',
          color: '#00ffff',
        }}
      >
        🔧 PERFORMANCE HUD
      </div>

      {/* FPS */}
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: '#aaa' }}>FPS:</span>{' '}
        <span style={{ color: fpsColor, fontWeight: 'bold' }}>
          {fps.toFixed(1)}
        </span>
      </div>

      {/* Tier */}
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: '#aaa' }}>Tier:</span>{' '}
        <span
          style={{
            color: tierColors[tier],
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {tier}
        </span>
      </div>

      {/* DPR */}
      {dpr !== undefined && (
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: '#aaa' }}>DPR:</span>{' '}
          <span style={{ color: '#fff' }}>{dpr.toFixed(2)}</span>
        </div>
      )}

      {/* Audio Levels */}
      {audioData && (
        <div style={{ marginTop: '8px', marginBottom: '4px' }}>
          <div
            style={{
              fontSize: '10px',
              color: '#00ffff',
              marginBottom: '4px',
            }}
          >
            AUDIO LEVELS
          </div>
          <AudioBar label="Bass" level={bassLevel} color="#ff6b6b" />
          <AudioBar label="Mids" level={midsLevel} color="#ffd93d" />
          <AudioBar label="Treb" level={trebleLevel} color="#6bcf7f" />
        </div>
      )}

      {/* Battery */}
      {batteryLevel !== null && (
        <div style={{ marginTop: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#aaa' }}>Battery:</span>{' '}
          <span style={{ color: batteryLevel < 0.2 ? '#ff6b6b' : '#fff' }}>
            {(batteryLevel * 100).toFixed(0)}%
          </span>
          {batteryCharging && (
            <span style={{ color: '#00ff00', marginLeft: '4px' }}>⚡</span>
          )}
        </div>
      )}

      {/* Memory */}
      {memoryUsage !== null && (
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: '#aaa' }}>Memory:</span>{' '}
          <span style={{ color: '#fff' }}>{memoryUsage.toFixed(1)} MB</span>
        </div>
      )}
    </div>
  );
}

/**
 * Audio level bar component
 */
function AudioBar({
  label,
  level,
  color,
}: {
  label: string;
  level: number;
  color: string;
}) {
  const percentage = Math.min(100, level * 100);

  return (
    <div style={{ marginBottom: '3px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: '#aaa', width: '32px', fontSize: '10px' }}>
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${percentage}%`,
              background: color,
              transition: 'width 0.1s ease-out',
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>
        <span style={{ color: '#666', width: '30px', fontSize: '9px' }}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
