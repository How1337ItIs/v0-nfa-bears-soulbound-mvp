'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AUTHENTIC_CONFIGS, DeviceCapabilities, detectDeviceCapabilities } from '@/lib/fluid/config';
import { setupThermalCurrents, setupGlobalMotion } from '@/lib/fluid/thermal';
import { useAudioReactive } from '@/lib/audio/useAudioReactive';
import { calculatePhysicsParams } from '@/lib/audio';
import { PaletteDirector } from '@/lib/palette';
import { CSSFallback, LiquidLightControls } from '@/components/liquid-light';

// SINGLE ENGINE OF RECORD - webgl-fluid-enhanced only
// Eliminates parallel CSS/WebGL systems per unified recommendation

interface PerformanceMetrics {
  fps: number;
  frameCount: number;
  lastFpsCheck: number;
  tier: 'high' | 'medium' | 'low';
}

export default function LiquidLightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<any>(null);
  const performanceRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameCount: 0,
    lastFpsCheck: Date.now(),
    tier: 'high'
  });
  
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [currentTier, setCurrentTier] = useState<'high' | 'medium' | 'low'>('high');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [intensity, setIntensity] = useState(1.0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('psychedelic');
  const [currentMode, setCurrentMode] = useState('ambient');
  
  // Centralized audio reactivity (single analyzer)
  const { audioData } = useAudioReactive();
  
  // Calculate physics parameters using centralized mapping
  const physicsParams = calculatePhysicsParams(audioData);

  // Device capability detection on mount
  useEffect(() => {
    const caps = detectDeviceCapabilities();
    setCapabilities(caps);
    setCurrentTier(caps.tier);
    
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
      if (currentFps < 25 && currentTier !== 'low') {
        const newTier = currentTier === 'high' ? 'medium' : 'low';
        console.warn(`Performance degradation: ${currentFps}fps, stepping down to ${newTier}`);
        setCurrentTier(newTier);
      } else if (currentFps > 50 && currentTier !== capabilities.tier) {
        const newTier = currentTier === 'low' ? 'medium' : capabilities.tier;
        console.log(`Performance improved: ${currentFps}fps, stepping up to ${newTier}`);
        setCurrentTier(newTier);
      }
      
      performanceRef.current.lastFpsCheck = now;
    }
  }, [capabilities, currentTier]);

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
        
        // Get current palette colors for fluid config
        const currentPalette = PaletteDirector.getCurrentPalette();
        const paletteColors = currentPalette.colors;
        
        // Initialize fluid with authentic 60s parameters and current palette
        const fluidInstance = webGLFluidEnhanced.simulation(canvas, {
          ...config,
          // Override palette with current selection
          COLOR_PALETTE: paletteColors,
          // Apply intensity scaling to visual parameters
          SPLAT_RADIUS: config.SPLAT_RADIUS * intensity,
          DENSITY_DISSIPATION: config.DENSITY_DISSIPATION * intensity,
          VELOCITY_DISSIPATION: config.VELOCITY_DISSIPATION * intensity,
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
  }, [capabilities, currentTier, hasError, monitorPerformance, physicsParams]);

  // Canvas resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    if (!fluidRef.current || !audioData || !isLoaded) return;
    
    // Apply audio-reactive physics parameters with intensity scaling
    const { splatForce, thermalRate, colorPhase, globalIntensity, curlStrength, viscosity } = physicsParams;
    
    // Apply physics parameters to fluid with intensity scaling (only if motion enabled and not reduced motion)
    if (fluidRef.current.config && motionEnabled && !prefersReducedMotion) {
      fluidRef.current.config.SPLAT_RADIUS = splatForce * intensity;
      fluidRef.current.config.DENSITY_DISSIPATION = thermalRate * intensity;
      fluidRef.current.config.VELOCITY_DISSIPATION = viscosity * intensity;
      fluidRef.current.config.CURL = curlStrength * intensity;
    } else if (fluidRef.current.config && (!motionEnabled || prefersReducedMotion)) {
      // Disable motion when toggle is off
      fluidRef.current.config.SPLAT_RADIUS = 0;
      fluidRef.current.config.DENSITY_DISSIPATION = 0.98; // Static
      fluidRef.current.config.VELOCITY_DISSIPATION = 0.98; // Static
      fluidRef.current.config.CURL = 0;
    }
    
    // Beat-triggered splats (intensity-scaled, only if motion enabled and not reduced motion)
    if (audioData.beatDetected && fluidRef.current.splat && motionEnabled && !prefersReducedMotion) {
      const canvas = canvasRef.current;
      if (canvas) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * splatForce * intensity;
        const vy = (Math.random() - 0.5) * splatForce * intensity;
        // Use current palette for beat color instead of hardcoded
        const beatColorIndex = Math.floor(Math.random() * currentPalette.colors.length);
        const beatColor = PaletteDirector.getColorRGB(beatColorIndex);
        
        fluidRef.current.splat(x, y, vx, vy, beatColor);
      }
    }
  }, [audioData, physicsParams, isLoaded, intensity, motionEnabled, prefersReducedMotion]);

  // Strict fallback chain: WebGL → CSS fallback only
  if (!capabilities?.webgl || hasError) {
    return (
      <CSSFallback 
        intensity={intensity}
        motionEnabled={motionEnabled && !prefersReducedMotion}
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
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
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.8,
          background: 'transparent'
        }}
        role="img"
        aria-label="Authentic 1960s liquid light show background"
      />
    </>
  );
}