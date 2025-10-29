/**
 * VINTAGE FILTER EFFECTS
 * 
 * React component for applying vintage 60s filter effects
 * Includes CSS filters, WebGL shaders, and post-processing effects
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useEffect, useRef, useState } from 'react';
import { VINTAGE_60S_FILTERS, VintageFilter } from './PeriodAccurateEffects';

export interface VintageFilterProps {
  filterId: string;
  intensity?: number; // 0-1 range
  enabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onFilterChange?: (filter: VintageFilter) => void;
}

export interface FilterState {
  saturation: number;
  contrast: number;
  brightness: number;
  hue: number;
  sepia: number;
  vignette: number;
  grain: number;
}

const VintageFilterComponent: React.FC<VintageFilterProps> = ({
  filterId,
  intensity = 1.0,
  enabled = true,
  children,
  className = '',
  style = {},
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<VintageFilter | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    saturation: 1,
    contrast: 1,
    brightness: 1,
    hue: 0,
    sepia: 0,
    vignette: 0,
    grain: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vintageFilter = VINTAGE_60S_FILTERS.find(f => f.id === filterId);
    if (vintageFilter) {
      setFilter(vintageFilter);
      
      // Apply intensity scaling
      const scaledEffects = {
        saturation: vintageFilter.effects.saturation * intensity,
        contrast: vintageFilter.effects.contrast * intensity,
        brightness: vintageFilter.effects.brightness * intensity,
        hue: vintageFilter.effects.hue * intensity,
        sepia: vintageFilter.effects.sepia * intensity,
        vignette: vintageFilter.effects.vignette * intensity,
        grain: vintageFilter.effects.grain * intensity,
      };
      
      setFilterState(scaledEffects);
      onFilterChange?.(vintageFilter);
    }
  }, [filterId, intensity, onFilterChange]);

  const getCSSFilter = (): string => {
    if (!enabled || !filter) return 'none';
    
    const { saturation, contrast, brightness, hue, sepia } = filterState;
    
    return `
      saturate(${saturation}) 
      contrast(${contrast}) 
      brightness(${brightness}) 
      hue-rotate(${hue}deg) 
      sepia(${sepia})
    `.replace(/\s+/g, ' ').trim();
  };

  const getVignetteStyle = (): React.CSSProperties => {
    if (!enabled || !filter || filterState.vignette === 0) return {};
    
    return {
      background: `radial-gradient(circle, transparent 0%, rgba(0,0,0,${filterState.vignette}) 100%)`,
    };
  };

  const getGrainStyle = (): React.CSSProperties => {
    if (!enabled || !filter || filterState.grain === 0) return {};
    
    return {
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${filterState.grain}'/%3E%3C/svg%3E")`,
    };
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    filter: getCSSFilter(),
    ...style,
  };

  const vignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
    ...getVignetteStyle(),
  };

  const grainStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
    ...getGrainStyle(),
  };

  return (
    <div
      ref={containerRef}
      className={`vintage-filter ${className}`}
      style={containerStyle}
    >
      {children}
      {enabled && filter && (
        <>
          <div style={vignetteStyle} />
          <div style={grainStyle} />
        </>
      )}
    </div>
  );
};

export default VintageFilterComponent;

// Hook for using vintage filters
export function useVintageFilter(filterId: string, intensity: number = 1.0) {
  const [filter, setFilter] = useState<VintageFilter | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    saturation: 1,
    contrast: 1,
    brightness: 1,
    hue: 0,
    sepia: 0,
    vignette: 0,
    grain: 0,
  });

  useEffect(() => {
    const vintageFilter = VINTAGE_60S_FILTERS.find(f => f.id === filterId);
    if (vintageFilter) {
      setFilter(vintageFilter);
      
      const scaledEffects = {
        saturation: vintageFilter.effects.saturation * intensity,
        contrast: vintageFilter.effects.contrast * intensity,
        brightness: vintageFilter.effects.brightness * intensity,
        hue: vintageFilter.effects.hue * intensity,
        sepia: vintageFilter.effects.sepia * intensity,
        vignette: vintageFilter.effects.vignette * intensity,
        grain: vintageFilter.effects.grain * intensity,
      };
      
      setFilterState(scaledEffects);
    }
  }, [filterId, intensity]);

  return {
    filter,
    filterState,
    getCSSFilter: () => {
      if (!filter) return 'none';
      const { saturation, contrast, brightness, hue, sepia } = filterState;
      return `saturate(${saturation}) contrast(${contrast}) brightness(${brightness}) hue-rotate(${hue}deg) sepia(${sepia})`;
    },
    getVignetteStyle: () => {
      if (!filter || filterState.vignette === 0) return {};
      return {
        background: `radial-gradient(circle, transparent 0%, rgba(0,0,0,${filterState.vignette}) 100%)`,
      };
    },
    getGrainStyle: () => {
      if (!filter || filterState.grain === 0) return {};
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${filterState.grain}'/%3E%3C/svg%3E")`,
      };
    },
  };
}

// WebGL shader for vintage effects
export const VINTAGE_SHADER = `
  uniform float time;
  uniform float saturation;
  uniform float contrast;
  uniform float brightness;
  uniform float hue;
  uniform float sepia;
  uniform float vignette;
  uniform float grain;
  
  varying vec2 vUv;
  
  // HSV to RGB conversion
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // RGB to HSV conversion
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }
  
  // Noise function for grain
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 uv = vUv;
    vec4 color = texture2D(texture, uv);
    
    // Apply brightness
    color.rgb *= brightness;
    
    // Apply contrast
    color.rgb = (color.rgb - 0.5) * contrast + 0.5;
    
    // Apply saturation
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(vec3(gray), color.rgb, saturation);
    
    // Apply hue shift
    vec3 hsv = rgb2hsv(color.rgb);
    hsv.x += hue / 360.0;
    color.rgb = hsv2rgb(hsv);
    
    // Apply sepia
    if (sepia > 0.0) {
      float sepiaR = dot(color.rgb, vec3(0.393, 0.769, 0.189));
      float sepiaG = dot(color.rgb, vec3(0.349, 0.686, 0.168));
      float sepiaB = dot(color.rgb, vec3(0.272, 0.534, 0.131));
      color.rgb = mix(color.rgb, vec3(sepiaR, sepiaG, sepiaB), sepia);
    }
    
    // Apply vignette
    if (vignette > 0.0) {
      float dist = distance(uv, vec2(0.5, 0.5));
      float vignetteFactor = 1.0 - smoothstep(0.0, 0.7, dist);
      color.rgb *= mix(1.0, vignetteFactor, vignette);
    }
    
    // Apply grain
    if (grain > 0.0) {
      float grainValue = noise(uv * 100.0 + time) * 2.0 - 1.0;
      color.rgb += grainValue * grain * 0.1;
    }
    
    gl_FragColor = color;
  }
`;

// CSS-only vintage filter implementation
export const CSS_VINTAGE_FILTERS = {
  'psychedelic-glow': {
    filter: 'saturate(1.5) contrast(1.2) brightness(1.1)',
    backdropFilter: 'blur(1px)',
  },
  'acid-wash': {
    filter: 'saturate(2.0) contrast(1.8) brightness(0.9) hue-rotate(30deg)',
    backdropFilter: 'blur(2px)',
  },
  'flower-child': {
    filter: 'saturate(0.8) contrast(0.9) brightness(1.2) hue-rotate(-10deg) sepia(0.2)',
    backdropFilter: 'blur(0.5px)',
  },
  'mod-sharp': {
    filter: 'saturate(1.3) contrast(1.5) brightness(1.0)',
    backdropFilter: 'none',
  },
  'beat-worn': {
    filter: 'saturate(0.6) contrast(1.1) brightness(0.8) hue-rotate(20deg) sepia(0.4)',
    backdropFilter: 'blur(1px)',
  },
};

// Utility function to apply CSS filters
export function applyCSSVintageFilter(element: HTMLElement, filterId: string): void {
  const filter = CSS_VINTAGE_FILTERS[filterId as keyof typeof CSS_VINTAGE_FILTERS];
  if (filter) {
    Object.assign(element.style, filter);
  }
}

// Utility function to remove CSS filters
export function removeCSSVintageFilter(element: HTMLElement): void {
  element.style.filter = 'none';
  element.style.backdropFilter = 'none';
}
