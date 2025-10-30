'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AUTHENTIC_CONFIGS, DeviceCapabilities, detectDeviceCapabilities } from '@/lib/fluid/config';
import { setupThermalCurrents, setupGlobalMotion } from '@/lib/fluid/thermal';
import { useAudioReactive } from '@/lib/audio/useAudioReactive';
import {
  createEnhancedAudioProcessor,
  calculateEnhancedPhysicsParams,
  BeatDetector,
  createBeatDetector,
  type AudioData as EnhancedAudioData,
} from '@/lib/audio';
import { PaletteDirector } from '@/lib/palette';
import { CSSFallback, LiquidLightControls } from '@/components/liquid-light';
import { applyDPRToCanvas } from '@/lib/visual';
import type { AudioData, Palette as PaletteType } from '@/lib/visual/types';

// SINGLE ENGINE OF RECORD - webgl-fluid-enhanced only
// Eliminates parallel CSS/WebGL systems per unified recommendation

interface PerformanceMetrics {
  fps: number;
  frameCount: number;
  lastFpsCheck: number;
  tier: 'high' | 'medium' | 'low';
}

interface LiquidLightBackgroundProps {
  intensity?: number;
  motionEnabled?: boolean;
  tier?: 'low' | 'medium' | 'high';
  audioData?: AudioData | null;
  palette?: PaletteType | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function LiquidLightBackground({
  intensity: externalIntensity,
  motionEnabled: externalMotionEnabled,
  tier: externalTier,
  audioData: externalAudio,
  palette: externalPalette,
  className,
  style,
}: LiquidLightBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<any>(null);
  const performanceRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameCount: 0,
    lastFpsCheck: Date.now(),
    tier: 'high'
  });
  
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [currentTier, setCurrentTier] = useState<'high' | 'medium' | 'low'>(externalTier ?? 'high');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [intensity, setIntensity] = useState(externalIntensity ?? 1.0);
  const [motionEnabled, setMotionEnabled] = useState(externalMotionEnabled ?? true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('psychedelic');
  const [currentMode, setCurrentMode] = useState('ambient');
  const [tabHidden, setTabHidden] = useState(false);
  
  // Centralized audio reactivity (single analyzer)
  // Use shared audio when provided; otherwise, initialize a local analyzer
  const useLocalAnalyzer = externalAudio == null;
  const { audioData } = useLocalAnalyzer ? useAudioReactive() : { audioData: null as any };
  const audio = (externalAudio ?? audioData) as EnhancedAudioData | null;
  
  // Calculate physics parameters using centralized mapping
  // Enhanced audio processor + optional local beat detector if using local analyzer
  const audioProcessorRef = useRef(createEnhancedAudioProcessor(0.3));
  const beatDetectorRef = useRef<BeatDetector | null>(useLocalAnalyzer ? createBeatDetector() : null);

  const enrichedAudio: EnhancedAudioData | null = (() => {
    if (!audio) return null;
    if (!beatDetectorRef.current) return audio;
    const energy = Math.max(0, Math.min(100, (audio.bass || 0) * 100));
    const beat = beatDetectorRef.current.detect(energy);
    return { ...audio, beatDetected: beat.isBeat, tempo: beat.bpmEstimate } as EnhancedAudioData;
  })();

  const physicsParams = calculateEnhancedPhysicsParams(enrichedAudio, audioProcessorRef.current);

  // Device capability detection on mount
  useEffect(() => {
    const caps = detectDeviceCapabilities();
    setCapabilities(caps);
    setCurrentTier(externalTier ?? caps.tier);
    
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes to prefers-reduced-motion
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setMotionEnabled(false); // Auto-disable motion when user prefers reduced motion
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track tab visibility (pause when hidden)
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Auto-quality adjustment based on FPS monitoring
  const monitorPerformance = useCallback(() => {
    if (!capabilities) return;
    
    const now = Date.now();
    performanceRef.current.frameCount++;
    
    // Check FPS every 60 frames (~1 second at 60fps)
    if (performanceRef.current.frameCount % 60 === 0) {
      const elapsed = now - performanceRef.current.lastFpsCheck;
      const currentFps = Math.round(60000 / elapsed);
      performanceRef.current.fps = currentFps;
      
      // Auto-quality step-down logic
      if (externalTier == null && currentFps < 25 && currentTier !== 'low') {
        const newTier = currentTier === 'high' ? 'medium' : 'low';
        console.warn(`Performance degradation: ${currentFps}fps, stepping down to ${newTier}`);
        setCurrentTier(newTier);
      } else if (externalTier == null && currentFps > 50 && currentTier !== capabilities.tier) {
        const newTier = currentTier === 'low' ? 'medium' : capabilities.tier;
        console.log(`Performance improved: ${currentFps}fps, stepping up to ${newTier}`);
        setCurrentTier(newTier);
      }
      
      performanceRef.current.lastFpsCheck = now;
    }
  }, [capabilities, currentTier, externalTier]);

  // Main fluid engine initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !capabilities?.webgl || hasError) return;

    let cleanupFunctions: (() => void)[] = [];
    
    const initFluid = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { default: webGLFluidEnhanced } = await import('webgl-fluid-enhanced');
        
        // Get authentic config for current tier
        const config = AUTHENTIC_CONFIGS[currentTier];
        
        // Get palette colors for fluid config (orchestrator palette overrides local)
        const paletteColors = (externalPalette?.colors) ?? PaletteDirector.getCurrentPalette().colors;
        
        // Initialize fluid with authentic 60s parameters and current palette
        const fluidInstance = webGLFluidEnhanced.simulation(canvas, {
          ...config,
          // Override palette with current selection
          COLOR_PALETTE: paletteColors,
          // Apply intensity scaling to visual parameters
          SPLAT_RADIUS: config.SPLAT_RADIUS * (externalIntensity ?? intensity),
          DENSITY_DISSIPATION: config.DENSITY_DISSIPATION * (externalIntensity ?? intensity),
          VELOCITY_DISSIPATION: config.VELOCITY_DISSIPATION * (externalIntensity ?? intensity),
          // Ensure proper canvas setup
          TRANSPARENT: true,
          INITIAL: true,
          HOVER: true
        });
        
        fluidRef.current = fluidInstance;
        setIsLoaded(true);
        
        // Setup thermal convection (authentic physics)
        const thermalCleanup = setupThermalCurrents(fluidInstance, canvas, physicsParams);
        cleanupFunctions.push(thermalCleanup);
        
        // Setup subtle global motion to avoid digital stillness
        const motionCleanup = setupGlobalMotion(fluidInstance, canvas);
        cleanupFunctions.push(motionCleanup);
        
        // Start performance monitoring
        let animationId: number;
        const performanceLoop = () => {
          monitorPerformance();
          animationId = requestAnimationFrame(performanceLoop);
        };
        performanceLoop();
        
        cleanupFunctions.push(() => cancelAnimationFrame(animationId));
        
        console.log(`Liquid light initialized: tier ${currentTier}, config:`, config);
        
      } catch (error) {
        console.error('Fluid initialization failed:', error);
        setHasError(true);
      }
    };
    
    initFluid();
    
    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      if (fluidRef.current?.dispose) {
        fluidRef.current.dispose();
      }
    };
  }, [capabilities, currentTier, hasError, monitorPerformance, physicsParams, externalIntensity, externalPalette]);

  // Canvas resize handling with DPR clamp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      // Keep CSS size via classes; set backing store size via DPR clamp
      applyDPRToCanvas(canvas);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Handle WebGL context lost
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost, falling back to CSS');
      setHasError(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, []);

  // Audio reactivity integration with intensity scaling
  useEffect(() => {
    if (!fluidRef.current || !enrichedAudio || !isLoaded) return;
    
    // Apply audio-reactive physics parameters with intensity scaling
    const { splatForce, thermalRate, colorPhase, globalIntensity, curlStrength, viscosity } = physicsParams;
    
    const effIntensity = externalIntensity ?? intensity;
    const effMotion = (externalMotionEnabled ?? motionEnabled) && !prefersReducedMotion && !tabHidden;

    // Apply physics parameters to fluid with intensity scaling
    if (fluidRef.current.config && effMotion) {
      fluidRef.current.config.SPLAT_RADIUS = splatForce * effIntensity;
      fluidRef.current.config.DENSITY_DISSIPATION = thermalRate * effIntensity;
      fluidRef.current.config.VELOCITY_DISSIPATION = viscosity * effIntensity;
      fluidRef.current.config.CURL = curlStrength * effIntensity;
    } else if (fluidRef.current.config && !effMotion) {
      // Disable motion when toggle is off
      fluidRef.current.config.SPLAT_RADIUS = 0;
      fluidRef.current.config.DENSITY_DISSIPATION = 0.98; // Static
      fluidRef.current.config.VELOCITY_DISSIPATION = 0.98; // Static
      fluidRef.current.config.CURL = 0;
    }

    // Idle skip: if nearly silent and motion disabled, avoid extra work
    if ((enrichedAudio.volume ?? 0) < 0.01 && !effMotion) {
      return;
    }

    // Beat-triggered splats (intensity-scaled)
    if (enrichedAudio?.beatDetected && fluidRef.current.splat && effMotion) {
      const canvas = canvasRef.current;
      if (canvas) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * splatForce * (externalIntensity ?? intensity);
        const vy = (Math.random() - 0.5) * splatForce * (externalIntensity ?? intensity);
        // Use current palette for beat color instead of hardcoded
        const beatPalette = (externalPalette?.colors) ?? PaletteDirector.getCurrentPalette().colors;
        const beatColorIndex = Math.floor(Math.random() * beatPalette.length);
        const beatColor = PaletteDirector.getColorRGB(beatColorIndex);
        
        fluidRef.current.splat(x, y, vx, vy, beatColor);
      }
    }
  }, [enrichedAudio, physicsParams, isLoaded, intensity, externalIntensity, externalMotionEnabled, prefersReducedMotion, tabHidden, externalPalette]);

  // Strict fallback chain: WebGL → CSS fallback only
  if (!capabilities?.webgl || hasError) {
    return (
      <CSSFallback 
        intensity={externalIntensity ?? intensity}
        motionEnabled={(externalMotionEnabled ?? motionEnabled) && !prefersReducedMotion && !tabHidden}
        className={`fixed inset-0 -z-10 w-full h-full pointer-events-none ${className ?? ''}`}
        style={style}
      />
    );
  }

  return (
    <>
      {/* Development HUD */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 text-white text-xs bg-black/70 p-3 rounded backdrop-blur">
          <div>FPS: {performanceRef.current.fps}</div>
          <div>Tier: {currentTier} (max: {capabilities.tier})</div>
          <div>Audio: Bass {audioData?.bass.toFixed(2)} | Mids {audioData?.mids.toFixed(2)} | Treble {audioData?.treble.toFixed(2)}</div>
          <div>WebGL: {capabilities.webgl2 ? 'v2' : 'v1'} | Max Texture: {capabilities.maxTextureSize}</div>
          <div>Memory: {capabilities.deviceMemory}GB | Mobile: {capabilities.mobile ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      {/* User Controls */}
      <LiquidLightControls
        onIntensityChange={setIntensity}
        onPaletteChange={setCurrentPalette}
        onModeChange={setCurrentMode}
        onMotionToggle={setMotionEnabled}
        intensity={intensity}
        motionEnabled={motionEnabled}
        prefersReducedMotion={prefersReducedMotion}
        className="fixed top-4 left-4 z-50"
      />
      
      {/* Single full-viewport canvas - engine of record */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 -z-10 w-full h-full pointer-events-none ${className ?? ''}`}
        style={{
          mixBlendMode: 'screen',
          opacity: 0.8,
          background: 'transparent',
          ...(style || {}),
        }}
        role="img"
        aria-label="Authentic 1960s liquid light show background"
      />
    </>
  );
}
