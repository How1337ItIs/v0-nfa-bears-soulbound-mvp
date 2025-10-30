/**
 * CSS Fallback Component
 * 
 * Pure CSS-based liquid light effect for when WebGL fails
 * or is disabled. Provides graceful degradation.
 * 
 * Based on Master Liquid Light Integration Plan (Week 1)
 * Author: Claude Code
 * Date: 2025-10-29
 */

import React from 'react';
import { PaletteDirector } from '@/lib/palette';

interface CSSFallbackProps {
  intensity?: number; // 0-1 range
  motionEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function CSSFallback({ 
  intensity = 0.6, 
  motionEnabled = true,
  className = '',
  style,
}: CSSFallbackProps) {
  const currentPalette = PaletteDirector.getCurrentPalette();
  const primaryColor = currentPalette.colors[0];
  const secondaryColor = currentPalette.colors[1] || currentPalette.colors[0];
  const tertiaryColor = currentPalette.colors[2] || currentPalette.colors[0];

  return (
    <div 
      className={`fixed inset-0 -z-10 w-full h-full pointer-events-none ${className}`}
      style={{
        opacity: intensity,
        background: `radial-gradient(ellipse at center, 
          ${primaryColor}20 0%, 
          ${secondaryColor}15 25%, 
          ${tertiaryColor}10 50%, 
          transparent 70%)`,
        ...(style || {}),
      }}
    >
      {/* Animated gradient orbs */}
      <div 
        className={`absolute inset-0 ${motionEnabled ? 'animate-pulse' : ''}`}
        style={{
          background: `conic-gradient(from 0deg at 30% 30%, 
            ${primaryColor}40, 
            ${secondaryColor}30, 
            ${tertiaryColor}20, 
            ${primaryColor}40)`,
          animationDuration: motionEnabled ? '8s' : 'none',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Secondary layer for depth */}
      <div 
        className={`absolute inset-0 ${motionEnabled ? 'animate-pulse' : ''}`}
        style={{
          background: `radial-gradient(circle at 70% 70%, 
            ${secondaryColor}25, 
            ${tertiaryColor}15, 
            transparent 60%)`,
          animationDuration: motionEnabled ? '12s' : 'none',
          animationDelay: '2s',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Subtle breathing effect */}
      {motionEnabled && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(45deg, 
              ${primaryColor}10, 
              transparent 50%, 
              ${secondaryColor}10)`,
            animationDuration: '6s',
            animationDelay: '1s'
          }}
        />
      )}
    </div>
  );
}
