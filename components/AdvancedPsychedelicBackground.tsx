'use client';

import { useEffect, useRef, useState } from 'react';
import WebGLFluidSimulation from './WebGLFluidSimulation';
import ModernFluidBackground from './ModernFluidBackground';

interface AdvancedPsychedelicConfig {
  webgl: boolean;
  canvas: boolean;
  intensity: number;
  performance: 'low' | 'medium' | 'high';
  colorScheme: 'classic' | 'neon' | 'pastel' | 'monochrome';
}

export default function AdvancedPsychedelicBackground({
  config = {}
}: {
  config?: Partial<AdvancedPsychedelicConfig>
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<AdvancedPsychedelicConfig>({
    webgl: true,
    canvas: true,
    intensity: 0.7,
    performance: 'medium',
    colorScheme: 'classic',
    ...config
  });

  useEffect(() => {
    // Add advanced CSS styles
    const style = document.createElement('style');
    style.textContent = `
      /* Advanced Psychedelic Background Effects */
      .psychedelic-bg-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      }
      
      /* Multiple layered backgrounds */
      .psychedelic-layer-1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(ellipse 800px 600px at 20% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 60%),
          radial-gradient(ellipse 600px 800px at 80% 70%, rgba(128, 0, 255, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse 700px 500px at 50% 20%, rgba(0, 128, 255, 0.06) 0%, transparent 60%);
        animation: psychedelic-layer-1-flow 45s ease-in-out infinite;
      }
      
      .psychedelic-layer-2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          conic-gradient(from 0deg at 30% 40%, 
            rgba(255, 0, 128, 0.05) 0deg,
            rgba(128, 0, 255, 0.04) 60deg,
            rgba(0, 128, 255, 0.03) 120deg,
            rgba(255, 255, 0, 0.02) 180deg,
            rgba(255, 0, 128, 0.05) 360deg);
        animation: psychedelic-layer-2-rotate 60s linear infinite;
      }
      
      .psychedelic-layer-3 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(45deg, 
            rgba(255, 0, 128, 0.03) 0%,
            rgba(128, 0, 255, 0.02) 25%,
            rgba(0, 128, 255, 0.01) 50%,
            rgba(255, 255, 0, 0.02) 75%,
            rgba(255, 0, 128, 0.03) 100%);
        animation: psychedelic-layer-3-shift 30s ease-in-out infinite;
      }
      
      @keyframes psychedelic-layer-1-flow {
        0% {
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(128, 0, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 50% 20%, rgba(0, 128, 255, 0.06) 0%, transparent 60%);
          filter: hue-rotate(0deg) saturate(1.2);
        }
        25% {
          background: 
            radial-gradient(ellipse 900px 500px at 30% 20%, rgba(128, 0, 255, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 500px 900px at 70% 80%, rgba(0, 128, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 600px at 60% 30%, rgba(255, 255, 0, 0.06) 0%, transparent 60%);
          filter: hue-rotate(90deg) saturate(1.4);
        }
        50% {
          background: 
            radial-gradient(ellipse 700px 800px at 40% 40%, rgba(0, 128, 255, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 800px 600px at 60% 60%, rgba(255, 255, 0, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 500px 700px at 80% 20%, rgba(255, 0, 128, 0.06) 0%, transparent 60%);
          filter: hue-rotate(180deg) saturate(1.6);
        }
        75% {
          background: 
            radial-gradient(ellipse 600px 700px at 70% 30%, rgba(255, 255, 0, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 30% 70%, rgba(255, 0, 128, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 800px 600px at 50% 80%, rgba(128, 0, 255, 0.06) 0%, transparent 60%);
          filter: hue-rotate(270deg) saturate(1.4);
        }
        100% {
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(128, 0, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 50% 20%, rgba(0, 128, 255, 0.06) 0%, transparent 60%);
          filter: hue-rotate(360deg) saturate(1.2);
        }
      }
      
      @keyframes psychedelic-layer-2-rotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      
      @keyframes psychedelic-layer-3-shift {
        0% { 
          background-position: 0% 0%;
          transform: translateX(0) translateY(0);
        }
        25% { 
          background-position: 100% 0%;
          transform: translateX(10px) translateY(-5px);
        }
        50% { 
          background-position: 100% 100%;
          transform: translateX(0) translateY(10px);
        }
        75% { 
          background-position: 0% 100%;
          transform: translateX(-10px) translateY(5px);
        }
        100% { 
          background-position: 0% 0%;
          transform: translateX(0) translateY(0);
        }
      }
      
      /* Floating organic shapes */
      .psychedelic-organic-shape {
        position: absolute;
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        background: 
          radial-gradient(ellipse 200px 150px at 30% 20%, rgba(255, 0, 128, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 150px 200px at 70% 80%, rgba(128, 0, 255, 0.12) 0%, transparent 50%);
        animation: psychedelic-organic-morph 25s ease-in-out infinite;
        filter: blur(1px);
      }
      
      .psychedelic-organic-shape:nth-child(1) {
        top: 10%;
        left: 10%;
        width: 300px;
        height: 200px;
        animation-delay: 0s;
      }
      
      .psychedelic-organic-shape:nth-child(2) {
        top: 60%;
        right: 15%;
        width: 250px;
        height: 300px;
        animation-delay: 8s;
      }
      
      .psychedelic-organic-shape:nth-child(3) {
        bottom: 20%;
        left: 20%;
        width: 200px;
        height: 250px;
        animation-delay: 16s;
      }
      
      .psychedelic-organic-shape:nth-child(4) {
        top: 30%;
        right: 30%;
        width: 180px;
        height: 180px;
        animation-delay: 24s;
      }
      
      @keyframes psychedelic-organic-morph {
        0% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transform: rotate(0deg) scale(1);
          filter: blur(1px) hue-rotate(0deg);
        }
        25% {
          border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          transform: rotate(90deg) scale(1.1);
          filter: blur(1px) hue-rotate(90deg);
        }
        50% {
          border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%;
          transform: rotate(180deg) scale(1.2);
          filter: blur(1px) hue-rotate(180deg);
        }
        75% {
          border-radius: 40% 70% 60% 30% / 70% 40% 30% 60%;
          transform: rotate(270deg) scale(1.1);
          filter: blur(1px) hue-rotate(270deg);
        }
        100% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transform: rotate(360deg) scale(1);
          filter: blur(1px) hue-rotate(360deg);
        }
      }
      
      /* Performance optimizations */
      .psychedelic-optimized {
        will-change: transform, filter, background;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .psychedelic-layer-1,
        .psychedelic-layer-2,
        .psychedelic-layer-3,
        .psychedelic-organic-shape {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle visibility changes for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="psychedelic-bg-container psychedelic-optimized"
    >
      {/* CSS-based layered backgrounds */}
      <div className="psychedelic-layer-1" />
      <div className="psychedelic-layer-2" />
      <div className="psychedelic-layer-3" />
      
      {/* Floating organic shapes */}
      <div className="psychedelic-organic-shape" />
      <div className="psychedelic-organic-shape" />
      <div className="psychedelic-organic-shape" />
      <div className="psychedelic-organic-shape" />
      
      {/* WebGL fluid simulation */}
      {currentConfig.webgl && (
        <WebGLFluidSimulation 
          config={{
            resolution: currentConfig.performance === 'high' ? 512 : 
                       currentConfig.performance === 'medium' ? 256 : 128,
            density: currentConfig.intensity * 0.8,
            velocity: currentConfig.intensity * 0.5,
            pressure: currentConfig.intensity * 0.8,
            viscosity: 0.1,
            colorIntensity: currentConfig.intensity
          }}
        />
      )}
      
      {/* Canvas-based fluid simulation */}
      {currentConfig.canvas && (
        <ModernFluidBackground />
      )}
    </div>
  );
}
