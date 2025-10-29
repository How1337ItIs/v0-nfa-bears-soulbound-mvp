'use client';

/**
 * THIN-FILM DEBUG CONTROLS
 *
 * Compact control panel for tuning thin-film shader parameters in development.
 * Only visible with ?debug-thinfilm=true or in dev environment.
 *
 * Controls:
 * - Film thickness (100-400nm)
 * - Index of refraction (1.0-2.0)
 * - Blend mode (screen, overlay, normal)
 * - Intensity (0.0-1.0)
 * - Interference strength (0.0-1.0)
 *
 * Performance: <6KB bundle impact (tree-shaken in production)
 */

import React, { useState, useEffect } from 'react';

export interface ThinFilmDebugState {
  thickness: number; // 100-400nm
  ior: number; // 1.0-2.0
  blendMode: 'screen' | 'overlay' | 'normal';
  intensity: number; // 0.0-1.0
  interferenceStrength: number; // 0.0-1.0
}

export interface ThinFilmDebugControlsProps {
  enabled?: boolean;
  initialState?: Partial<ThinFilmDebugState>;
  onChange?: (state: ThinFilmDebugState) => void;
}

export default function ThinFilmDebugControls({
  enabled,
  initialState = {},
  onChange,
}: ThinFilmDebugControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Debug state
  const [state, setState] = useState<ThinFilmDebugState>({
    thickness: initialState.thickness ?? 200,
    ior: initialState.ior ?? 1.5,
    blendMode: initialState.blendMode ?? 'screen',
    intensity: initialState.intensity ?? 0.6,
    interferenceStrength: initialState.interferenceStrength ?? 0.8,
  });

  // Check if controls should be visible
  useEffect(() => {
    if (enabled !== undefined) {
      setIsVisible(enabled);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug-thinfilm') === 'true';
    const isDev = process.env.NODE_ENV === 'development';

    setIsVisible(debugParam || isDev);
  }, [enabled]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [state, onChange]);

  if (!isVisible) {
    return null;
  }

  const updateState = (updates: Partial<ThinFilmDebugState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        padding: isMinimized ? '8px 12px' : '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        zIndex: 99998,
        minWidth: isMinimized ? 'auto' : '280px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMinimized ? '0' : '12px',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: isMinimized ? '0' : '8px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#ff00ff',
          }}
        >
          🎨 THIN-FILM DEBUG
        </span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 4px',
            pointerEvents: 'auto',
          }}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Thickness */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
              }}
            >
              Thickness: {state.thickness.toFixed(0)}nm
            </label>
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={state.thickness}
              onChange={(e) =>
                updateState({ thickness: parseFloat(e.target.value) })
              }
              style={{
                width: '100%',
                pointerEvents: 'auto',
              }}
            />
          </div>

          {/* Index of Refraction */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
              }}
            >
              IOR: {state.ior.toFixed(2)}
            </label>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={state.ior}
              onChange={(e) =>
                updateState({ ior: parseFloat(e.target.value) })
              }
              style={{
                width: '100%',
                pointerEvents: 'auto',
              }}
            />
          </div>

          {/* Intensity */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
              }}
            >
              Intensity: {state.intensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.intensity}
              onChange={(e) =>
                updateState({ intensity: parseFloat(e.target.value) })
              }
              style={{
                width: '100%',
                pointerEvents: 'auto',
              }}
            />
          </div>

          {/* Interference Strength */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
              }}
            >
              Interference: {state.interferenceStrength.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.interferenceStrength}
              onChange={(e) =>
                updateState({
                  interferenceStrength: parseFloat(e.target.value),
                })
              }
              style={{
                width: '100%',
                pointerEvents: 'auto',
              }}
            />
          </div>

          {/* Blend Mode */}
          <div style={{ marginBottom: '6px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
              }}
            >
              Blend Mode
            </label>
            <select
              value={state.blendMode}
              onChange={(e) =>
                updateState({
                  blendMode: e.target.value as ThinFilmDebugState['blendMode'],
                })
              }
              style={{
                width: '100%',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                fontSize: '11px',
                pointerEvents: 'auto',
              }}
            >
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Presets */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: '#aaa',
                fontSize: '10px',
              }}
            >
              PRESETS
            </label>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <PresetButton
                label="Oil"
                onClick={() =>
                  setState({
                    thickness: 200,
                    ior: 1.5,
                    blendMode: 'screen',
                    intensity: 0.6,
                    interferenceStrength: 0.8,
                  })
                }
              />
              <PresetButton
                label="Soap"
                onClick={() =>
                  setState({
                    thickness: 150,
                    ior: 1.33,
                    blendMode: 'overlay',
                    intensity: 0.7,
                    interferenceStrength: 0.9,
                  })
                }
              />
              <PresetButton
                label="Intense"
                onClick={() =>
                  setState({
                    thickness: 300,
                    ior: 1.8,
                    blendMode: 'screen',
                    intensity: 0.9,
                    interferenceStrength: 1.0,
                  })
                }
              />
              <PresetButton
                label="Subtle"
                onClick={() =>
                  setState({
                    thickness: 180,
                    ior: 1.4,
                    blendMode: 'normal',
                    intensity: 0.4,
                    interferenceStrength: 0.5,
                  })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PresetButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(255, 0, 255, 0.2)',
        border: '1px solid rgba(255, 0, 255, 0.4)',
        color: '#ff00ff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      {label}
    </button>
  );
}
