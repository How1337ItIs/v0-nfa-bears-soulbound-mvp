'use client';

import { useEffect, useRef, useState } from 'react';

// SYSTEMATIC TUNING - Start conservative, build up what works
export default function SimpleFluidTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<any>(null);
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);
  const debugLog = useRef<string[]>([]);

  // Debug logging utility
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    debugLog.current.push(logEntry);
    console.log(`[FluidDebug] ${logEntry}`);
  };

  // Save debug log to file
  const saveDebugLog = async () => {
    try {
      addDebugLog('Attempting to save debug log...');
      const response = await fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          logs: debugLog.current,
          filename: `fluid-debug-${Date.now()}.log`
        })
      });
      const result = await response.json();
      if (response.ok) {
        addDebugLog(`Debug log saved successfully: ${result.filename}`);
        alert(`Debug log saved to project root: ${result.filename}`);
      } else {
        addDebugLog(`Failed to save debug log: ${result.error}`);
        alert(`Failed to save debug log: ${result.error}`);
      }
    } catch (e) {
      addDebugLog(`Error saving debug log: ${e}`);
      console.error('Failed to save debug log:', e);
      alert(`Error saving debug log: ${e}`);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    addDebugLog('=== FLUID DEBUG SESSION START ===');
    addDebugLog(`Container dimensions: ${container.offsetWidth}x${container.offsetHeight}`);

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
      addDebugLog('ERROR: WebGL not supported');
      setError('WebGL not supported');
      return;
    }

    addDebugLog('WebGL context created successfully');
    setStatus('WebGL OK, testing webgl-fluid-enhanced...');

    import('webgl-fluid-enhanced')
      .then((module) => {
        addDebugLog('webgl-fluid-enhanced library loaded successfully');
        setStatus('Library loaded, initializing...');
        
        try {
          // VERSION 9: DEBUG API + COORDINATE FIX - use working constructor with coordinate compensation
          addDebugLog('Investigating available API methods...');
          addDebugLog(`Module default: ${typeof module.default}`);
          addDebugLog(`Available methods: ${Object.getOwnPropertyNames(module.default.prototype || {}).join(', ')}`);
          addDebugLog(`Static methods: ${Object.getOwnPropertyNames(module.default).join(', ')}`);
          
          addDebugLog('Creating fluid instance with working constructor');
          const fluidInstance = new module.default(container);
          addDebugLog('Fluid instance created successfully');
          
          // DEBUG: Check if there are multiple canvases being created
          addDebugLog(`Container children before config: ${container.children.length}`);
          const canvases = container.querySelectorAll('canvas');
          addDebugLog(`Number of canvas elements: ${canvases.length}`);
          canvases.forEach((canvas, i) => {
            addDebugLog(`Canvas ${i}: ${canvas.width}x${canvas.height}, style: ${canvas.style.width}x${canvas.style.height}`);
          });
          
          // VERSION 24: EXTREME DARK MODE - Nearly black with minimal brightness
          const config = {
            // Lower resolution to reduce complexity
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 256,
            
            // VERSION 32: NATURAL FLOW PHYSICS - Let the fluid create its own motion
            VELOCITY_DISSIPATION: 0.85,  // Moderate dissipation - let motion persist
            DENSITY_DISSIPATION: 0.90,   // Moderate dissipation - keep colors alive
            PRESSURE: 0.8,               // Normal pressure for natural convection
            CURL: 30,                    // Higher curl creates natural turbulence and circulation
            
            // Tiny, minimal splats
            SPLAT_RADIUS: 0.02,          // Microscopic radius
            SPLAT_FORCE: 50,             // Extremely low force
            
            // ALL BLOOM/BRIGHTNESS FEATURES OFF
            BLOOM: false,
            SUNRAYS: false,
            
            // AUTHENTIC OIL COLORS - Now safe since virtual cursors are gone
            COLOR_PALETTE: [
              '#4A148C',  // Deep violet (120nm oil film)
              '#1A237E',  // Deep blue (150nm oil film)  
              '#006064',  // Deep cyan (200nm oil film)
              '#2E7D32',  // Deep green (250nm oil film)
              '#F57F17',  // Deep amber (300nm oil film)
              '#E65100',  // Deep orange (350nm oil film)
              '#BF360C',  // Deep red (400nm oil film)
            ],
            COLORFUL: true,             // Enable color cycling
            COLOR_UPDATE_SPEED: 3,      // Normal color transitions
            BRIGHTNESS: 0.3,            // Moderate brightness - safe without cursor accumulation
            
            TRANSPARENT: false,
            HOVER: false,
            BACKGROUND_COLOR: '#000000'
          };
          
          addDebugLog(`Setting config: ${JSON.stringify(config, null, 2)}`);
          fluidInstance.setConfig(config);
          addDebugLog('Config applied successfully');
          
          addDebugLog('Starting fluid simulation');
          fluidInstance.start();
          fluidRef.current = fluidInstance;
          
          // VERSION 26: SPORADIC THERMAL CONVECTION - Authentic liquid light motion
          addDebugLog('NEW APPROACH: Sporadic thermal convection instead of continuous cursors');
          
          // VERSION 39: AUTHENTIC LIQUID LIGHT SHOW - Large blobs, oil/water physics, continuous sloshing
          addDebugLog('NEW APPROACH: Authentic 1960s liquid light show - large flowing blobs with sloshing motion');
          
          // 1. LARGE BLOB INJECTION - Create big colorful blobs like oil and water
          const createLargeBlob = () => {
            if (fluidRef.current?.splatAtLocation) {
              const canvas = container.querySelector('canvas');
              if (canvas) {
                const scaleX = canvas.width / canvas.clientWidth;
                const scaleY = canvas.height / canvas.clientHeight;
                
                // Random location for blob
                const blobX = (Math.random() * container.offsetWidth * 0.6 + container.offsetWidth * 0.2) * scaleX;
                const blobY = (Math.random() * container.offsetHeight * 0.6 + container.offsetHeight * 0.2) * scaleY;
                
                // Large blob with moderate force
                const blobForce = 15 + Math.random() * 10;
                const angle = Math.random() * Math.PI * 2;
                const dx = Math.cos(angle) * blobForce;
                const dy = Math.sin(angle) * blobForce;
                
                fluidRef.current.splatAtLocation(blobX, blobY, dx, dy);
                addDebugLog(`Large blob created at (${blobX.toFixed(0)}, ${blobY.toFixed(0)}) with force ${blobForce.toFixed(1)}`);
              }
            }
          };
          
          // 2. CONTINUOUS SLOSHING - "The Jiggle" effect from overhead projector shows
          const sloshingInterval = setInterval(() => {
            if (fluidRef.current?.splatAtLocation) {
              const canvas = container.querySelector('canvas');
              if (canvas) {
                const scaleX = canvas.width / canvas.clientWidth;
                const scaleY = canvas.height / canvas.clientHeight;
                
                // Create sloshing motion across the width
                const sloshDirection = Math.random() > 0.5 ? 1 : -1;
                const numSloshPoints = 5 + Math.random() * 5;
                
                for (let i = 0; i < numSloshPoints; i++) {
                  const sloshX = (container.offsetWidth * (0.2 + i * 0.15)) * scaleX;
                  const sloshY = (container.offsetHeight * (0.3 + Math.random() * 0.4)) * scaleY;
                  
                  const sloshForce = 8 + Math.random() * 6;
                  const dx = sloshDirection * sloshForce;
                  const dy = (Math.random() - 0.5) * sloshForce * 0.5;
                  
                  setTimeout(() => {
                    if (fluidRef.current?.splatAtLocation) {
                      fluidRef.current.splatAtLocation(sloshX, sloshY, dx, dy);
                    }
                  }, i * 100); // Stagger the sloshing
                }
                
                addDebugLog(`Sloshing motion: ${numSloshPoints} points, direction ${sloshDirection}`);
              }
            }
          }, 3000); // Every 3 seconds
          
          // 3. INITIAL BLOB SETUP - Start with some large blobs
          setTimeout(() => {
            createLargeBlob();
            setTimeout(() => createLargeBlob(), 1000);
            setTimeout(() => createLargeBlob(), 2000);
          }, 500);
          
          // DISABLE ALCOHOL PATTERNS FOR CLEAN TESTING
          addDebugLog('Alcohol lightning patterns disabled for clean ultra-gentle testing');
          
          setStatus('🔬 VERSION 39 - AUTHENTIC LIQUID LIGHT: Large blobs + continuous sloshing motion');
          
          // Cleanup function for all motion intervals
          return () => {
            clearInterval(sloshingInterval);
          };
          
          // DEBUGGING COORDINATE TRANSFORMATION ISSUE
          const handleClick = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;
            
            // Get actual canvas dimensions for debugging
            const canvases = container.querySelectorAll('canvas');
            const mainCanvas = canvases[0];
            
            addDebugLog(`=== CLICK DEBUG ===`);
            addDebugLog(`Client click: (${e.clientX}, ${e.clientY})`);
            addDebugLog(`Container rect: ${rect.left}, ${rect.top}, ${rect.width}x${rect.height}`);
            addDebugLog(`Raw coordinates: (${rawX.toFixed(2)}, ${rawY.toFixed(2)})`);
            addDebugLog(`Container size: ${container.offsetWidth}x${container.offsetHeight}`);
            
            if (mainCanvas) {
              addDebugLog(`Canvas size: ${mainCanvas.width}x${mainCanvas.height}`);
              addDebugLog(`Canvas style: ${mainCanvas.style.width}x${mainCanvas.style.height}`);
              addDebugLog(`Canvas client: ${mainCanvas.clientWidth}x${mainCanvas.clientHeight}`);
              
              // Test normalized coordinates manually
              const normalizedX = rawX / mainCanvas.clientWidth;
              const normalizedY = rawY / mainCanvas.clientHeight;
              addDebugLog(`Manual normalization: (${normalizedX.toFixed(3)}, ${normalizedY.toFixed(3)})`);
            }
            
            const dx = (Math.random() - 0.5) * 8;
            const dy = (Math.random() - 0.5) * 8;
            
            // FINAL FIX: Compensate for canvas buffer vs display size mismatch
            if (fluidRef.current?.splatAtLocation && mainCanvas) {
              // Scale coordinates based on buffer vs display size ratio
              const scaleX = mainCanvas.width / mainCanvas.clientWidth;
              const scaleY = mainCanvas.height / mainCanvas.clientHeight;
              const scaledX = rawX * scaleX;
              const scaledY = rawY * scaleY;
              
              addDebugLog(`Scale factors: X=${scaleX.toFixed(3)}, Y=${scaleY.toFixed(3)}`);
              addDebugLog(`Scaled coords: (${scaledX.toFixed(2)}, ${scaledY.toFixed(2)})`);
              
              // Let the library handle colors with its psychedelic palette
              fluidRef.current.splatAtLocation(scaledX, scaledY, dx, dy);
              addDebugLog(`✅ FINAL FIX applied - buffer-scaled coordinates`);
            }
          };
          
          container.addEventListener('click', handleClick);
          
          return () => {
            container.removeEventListener('click', handleClick);
            fluidInstance.stop();
          };
        } catch (initError) {
          setError(`Initialization failed: ${initError}`);
        }
      })
      .catch((loadError) => {
        setError(`Library load failed: ${loadError}`);
      });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      container.style.width = '100%';
      container.style.height = '100%';
    };
    
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">❌ Fluid Test Failed</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded">
        <div className="text-sm mb-2">{status}</div>
        <div className="text-xs opacity-70">
          🌊 FULL FLOW SYSTEM<br/>
          🔥 Thermal columns (1.5-3.5s)<br/>
          ↔️ Horizontal currents (2-5s)<br/>
          🌀 Gentle stirring (2.5-5s)<br/>
          🏞️ Edge currents (1.8-4s)<br/>
          📊 Version 29 - RICH FLOW!
        </div>
        <button 
          onClick={saveDebugLog}
          className="mt-2 px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700"
        >
          💾 Save Debug Log
        </button>
      </div>
      
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        style={{ background: '#000' }}
      />
    </div>
  );
}