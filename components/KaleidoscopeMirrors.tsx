'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioData } from '../lib/audio-reactive';

interface KaleidoscopeConfig {
  mirrorCount: number;
  rotation: number;
  zoom: number;
  centerX: number;
  centerY: number;
  opacity: number;
  audioReactive: boolean;
}

export default function KaleidoscopeMirrors({
  config = {},
  audioData,
  children
}: {
  config?: Partial<KaleidoscopeConfig>;
  audioData?: AudioData;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [currentRotation, setCurrentRotation] = useState(0);

  const defaultConfig: KaleidoscopeConfig = {
    mirrorCount: 8,
    rotation: 0,
    zoom: 1.0,
    centerX: 50,
    centerY: 50,
    opacity: 0.3,
    audioReactive: true,
    ...config
  };

  useEffect(() => {
    const animate = () => {
      if (!defaultConfig.audioReactive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      let rotationSpeed = 0.2; // Base rotation speed
      let currentZoom = defaultConfig.zoom;
      let currentOpacity = defaultConfig.opacity;

      if (audioData) {
        // Audio-reactive rotation
        rotationSpeed += audioData.mids * 2.0;
        
        // Beat detection creates zoom pulses
        if (audioData.beatDetected) {
          currentZoom *= (1 + audioData.bass * 0.3);
        }
        
        // Treble affects opacity
        currentOpacity = Math.min(0.6, defaultConfig.opacity + audioData.treble * 0.3);
      }

      setCurrentRotation(prev => prev + rotationSpeed);

      // Update CSS custom properties for dynamic effects
      if (containerRef.current) {
        containerRef.current.style.setProperty('--kaleidoscope-zoom', currentZoom.toString());
        containerRef.current.style.setProperty('--kaleidoscope-opacity', currentOpacity.toString());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, defaultConfig]);

  // Generate mirror segments
  const generateMirrorSegments = () => {
    const segments = [];
    const angleStep = 360 / defaultConfig.mirrorCount;
    
    for (let i = 0; i < defaultConfig.mirrorCount; i++) {
      const angle = i * angleStep;
      const nextAngle = (i + 1) * angleStep;
      
      // Create a triangular clip-path for each mirror segment
      const clipPath = `polygon(
        50% 50%,
        ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%,
        ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%
      )`;

      // Determine if this segment should be mirrored
      const shouldMirror = i % 2 === 1;

      segments.push(
        <div
          key={i}
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath,
            transform: `scale(var(--kaleidoscope-zoom, 1)) ${shouldMirror ? 'scaleX(-1)' : ''}`,
            opacity: 'var(--kaleidoscope-opacity, 0.3)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transformOrigin: `${defaultConfig.centerX}% ${defaultConfig.centerY}%`,
            }}
          >
            {children}
          </div>
        </div>
      );
    }
    
    return segments;
  };

  // Dead-specific kaleidoscope patterns
  const getDeadKaleidoscopePattern = () => {
    if (audioData?.volume && audioData.volume > 0.1) {
      // During music, use more dynamic patterns
      if (audioData.bass > 0.5) {
        // Heavy bass = more mirrors, slower rotation
        return { mirrorCount: 12, rotation: currentRotation * 0.3 };
      } else if (audioData.treble > 0.5) {
        // High treble = fewer mirrors, faster rotation  
        return { mirrorCount: 6, rotation: currentRotation * 1.5 };
      }
    }
    
    // Default Grateful Dead sacred geometry - 8 sides
    return { mirrorCount: 8, rotation: currentRotation };
  };

  const pattern = getDeadKaleidoscopePattern();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        '--kaleidoscope-zoom': defaultConfig.zoom,
        '--kaleidoscope-opacity': defaultConfig.opacity,
      } as React.CSSProperties}
    >
      {/* Kaleidoscope Container */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `rotate(${pattern.rotation}deg)`,
          transformOrigin: `${defaultConfig.centerX}% ${defaultConfig.centerY}%`,
        }}
      >
        {generateMirrorSegments()}
      </div>

      {/* Sacred Geometry Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ 
            opacity: audioData?.beatDetected ? 0.8 : 0.2,
            transition: 'opacity 0.1s ease'
          }}
        >
          {/* Grateful Dead mandala patterns */}
          <defs>
            <radialGradient id="deadGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 0, 128, 0.3)" />
              <stop offset="50%" stopColor="rgba(128, 0, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(0, 128, 255, 0.1)" />
            </radialGradient>
          </defs>
          
          {/* Central mandala */}
          <g transform={`translate(${defaultConfig.centerX * 4}, ${defaultConfig.centerY * 3})`}>
            {/* Outer ring */}
            <circle
              cx="0"
              cy="0"
              r="200"
              fill="none"
              stroke="url(#deadGradient)"
              strokeWidth="2"
              style={{
                transform: `rotate(${currentRotation * 0.5}deg)`,
                transformOrigin: 'center'
              }}
            />
            
            {/* Mirror division lines */}
            {Array.from({ length: pattern.mirrorCount }, (_, i) => {
              const angle = (i * 360) / pattern.mirrorCount;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={100 * Math.cos((angle * Math.PI) / 180)}
                  y2={100 * Math.sin((angle * Math.PI) / 180)}
                  stroke="url(#deadGradient)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}
            
            {/* Inner sacred geometry */}
            <polygon
              points={Array.from({ length: pattern.mirrorCount }, (_, i) => {
                const angle = (i * 360) / pattern.mirrorCount;
                const x = 50 * Math.cos((angle * Math.PI) / 180);
                const y = 50 * Math.sin((angle * Math.PI) / 180);
                return `${x},${y}`;
              }).join(' ')}
              fill="url(#deadGradient)"
              opacity="0.1"
              style={{
                transform: `rotate(${-currentRotation * 0.7}deg)`,
                transformOrigin: 'center'
              }}
            />
          </g>
          
          {/* Corner mandalas for full-screen coverage */}
          {[
            { x: 40, y: 30 },
            { x: 360, y: 30 },
            { x: 40, y: 270 },
            { x: 360, y: 270 }
          ].map((pos, i) => (
            <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle
                cx="0"
                cy="0"
                r="50"
                fill="none"
                stroke="url(#deadGradient)"
                strokeWidth="1"
                opacity="0.3"
                style={{
                  transform: `rotate(${currentRotation * (i % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Audio-reactive burst effect */}
      {audioData?.beatDetected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${defaultConfig.centerX}% ${defaultConfig.centerY}%, 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 30%)`,
            animation: 'beat-burst 0.3s ease-out',
          }}
        />
      )}

      <style jsx>{`
        @keyframes beat-burst {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}