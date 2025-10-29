'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// PRODUCTION ENGINE OF RECORD - webgl-fluid-enhanced only
// Eliminates parallel CSS/WebGL systems per ChatGPT-5 analysis

interface DeviceCapabilities {
  webgl: boolean;
  webgl2: boolean;
  maxTextureSize: number;
  deviceMemory: number;
  mobile: boolean;
  tier: 'high' | 'medium' | 'low';
}

interface AuthenticConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  VELOCITY_DISSIPATION: number;
  DENSITY_DISSIPATION: number;
  CURL: number;
  PRESSURE_ITERATIONS: number;
  COLOR_PALETTE: string[];
  TRANSPARENT: boolean;
  INITIAL: boolean;
  HOVER: boolean;
}

// Authentic 60s physics parameters (from all research synthesis)
const AUTHENTIC_CONFIGS: Record<string, AuthenticConfig> = {
  high: {
    SIM_RESOLUTION: 256,
    DYE_RESOLUTION: 512,
    VELOCITY_DISSIPATION: 0.4,   // Lava lamp viscosity
    DENSITY_DISSIPATION: 0.92,   // Color persistence
    CURL: 20,                    // Organic movement
    PRESSURE_ITERATIONS: 25,     // Smooth boundaries
    COLOR_PALETTE: [
      '#ff0066', // Electric magenta - 650nm
      '#00ffcc', // Cyan-turquoise - 485nm  
      '#ffff33', // Electric yellow - 580nm
      '#ff6600'  // Orange-red - 620nm
    ],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  },
  medium: {
    SIM_RESOLUTION: 192,
    DYE_RESOLUTION: 384,
    VELOCITY_DISSIPATION: 0.4,
    DENSITY_DISSIPATION: 0.92,
    CURL: 20,
    PRESSURE_ITERATIONS: 20,
    COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  },
  low: {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 256,
    VELOCITY_DISSIPATION: 0.5,
    DENSITY_DISSIPATION: 0.9,
    CURL: 15,
    PRESSURE_ITERATIONS: 15,
    COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'],
    TRANSPARENT: true,
    INITIAL: true,
    HOVER: true
  }
};

function detectDeviceCapabilities(): DeviceCapabilities {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const gl2 = canvas.getContext('webgl2');
  
  if (!gl) {
    return {
      webgl: false,
      webgl2: false,
      maxTextureSize: 0,
      deviceMemory: 2,
      mobile: true,
      tier: 'low'
    };
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const deviceMemory = (navigator as any).deviceMemory || (isMobile ? 3 : 8);
  
  // Performance tier determination (ChatGPT-5 recommendation)
  let tier: 'high' | 'medium' | 'low' = 'low';
  if (!isMobile && maxTextureSize >= 4096 && deviceMemory >= 8) {
    tier = 'high';
  } else if (maxTextureSize >= 2048 && deviceMemory >= 4) {
    tier = 'medium';
  }

  return {
    webgl: true,
    webgl2: !!gl2,
    maxTextureSize,
    deviceMemory,
    mobile: isMobile,
    tier
  };
}

export default function ProductionLiquidEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<any>(null);
  const performanceRef = useRef({ frameCount: 0, lastFpsCheck: Date.now() });
  
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [currentTier, setCurrentTier] = useState<'high' | 'medium' | 'low'>('high');
  const [fps, setFps] = useState(60);

  // Device capability detection
  useEffect(() => {
    setCapabilities(detectDeviceCapabilities());
  }, []);

  // Thermal current simulation (authentic 60s physics)
  const addThermalCurrents = useCallback(() => {
    if (!fluidRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.8 + Math.random() * 0.2); // Near bottom
    
    // Heat rises with authentic physics parameters
    const force = 15 + Math.random() * 10;
    const color = [1, 0.8, 0.2]; // Warm thermal color
    
    if (fluidRef.current.splat) {
      fluidRef.current.splat(x, y, 0, -force, color);
    }
  }, []);

  // Performance monitoring and auto-quality adjustment
  useEffect(() => {
    if (!capabilities) return;

    let animationId: number;
    
    const monitorPerformance = () => {
      const now = Date.now();
      performanceRef.current.frameCount++;
      
      // Check FPS every 60 frames
      if (performanceRef.current.frameCount % 60 === 0) {
        const elapsed = now - performanceRef.current.lastFpsCheck;
        const currentFps = Math.round(60000 / elapsed);
        setFps(currentFps);
        
        // Auto-quality adjustment (ChatGPT-5 specification)
        if (currentFps < 25 && currentTier !== 'low') {
          const newTier = currentTier === 'high' ? 'medium' : 'low';
          console.warn(`Performance degradation: ${currentFps}fps, reducing to ${newTier}`);
          setCurrentTier(newTier);
        } else if (currentFps > 50 && currentTier !== capabilities.tier) {
          const newTier = currentTier === 'low' ? 'medium' : capabilities.tier;
          setCurrentTier(newTier);
        }
        
        performanceRef.current.lastFpsCheck = now;
      }
      
      animationId = requestAnimationFrame(monitorPerformance);
    };
    
    monitorPerformance();
    return () => cancelAnimationFrame(animationId);
  }, [capabilities, currentTier]);

  // Fluid engine initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !capabilities?.webgl) return;

    // Dynamic import to avoid SSR issues
    import('webgl-fluid-enhanced').then(({ default: webGLFluidEnhanced }) => {
      try {
        const config = AUTHENTIC_CONFIGS[currentTier];
        
        // Initialize with authentic 60s parameters
        const fluidInstance = webGLFluidEnhanced.simulation(canvas, config);
        fluidRef.current = fluidInstance;

        // Setup thermal convection (3-5 second intervals with randomness)
        const thermalInterval = setInterval(addThermalCurrents, 3000 + Math.random() * 2000);
        
        // Slow global rotation for organic feel
        let rotationPhase = 0;
        const addGlobalMotion = () => {
          if (fluidRef.current && canvas) {
            rotationPhase += 0.01;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.3;
            
            const x = centerX + Math.cos(rotationPhase) * radius;
            const y = centerY + Math.sin(rotationPhase) * radius;
            const vx = -Math.sin(rotationPhase) * 2;
            const vy = Math.cos(rotationPhase) * 2;
            
            if (fluidRef.current.splat) {
              fluidRef.current.splat(x, y, vx, vy, [0.5, 0.5, 0.5]);
            }
          }
          
          setTimeout(addGlobalMotion, 1000);
        };
        addGlobalMotion();

        // Cleanup function
        return () => {
          clearInterval(thermalInterval);
          if (fluidInstance?.dispose) {
            fluidInstance.dispose();
          }
        };
      } catch (error) {
        console.error('WebGL fluid initialization failed:', error);
        setCapabilities(prev => prev ? { ...prev, webgl: false } : null);
      }
    }).catch(() => {
      console.error('Failed to load webgl-fluid-enhanced');
      setCapabilities(prev => prev ? { ...prev, webgl: false } : null);
    });
  }, [capabilities, currentTier, addThermalCurrents]);

  // Canvas resize handler
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

  // CSS fallback for non-WebGL browsers (single fallback system)
  if (!capabilities?.webgl) {
    return (
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Performance monitoring display (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 text-white text-xs bg-black/50 p-2 rounded">
          FPS: {fps} | Tier: {currentTier} | Device: {capabilities.tier}
        </div>
      )}
      
      {/* Single engine of record */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
    </>
  );
}