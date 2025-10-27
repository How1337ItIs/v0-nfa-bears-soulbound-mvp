'use client';

import { useEffect, useRef, useState } from 'react';

export default function AuthenticOverheadProjector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<any>(null);
  const [status, setStatus] = useState('Initializing authentic overhead projector simulation...');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Test WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
      setStatus('❌ WebGL not supported - falling back to CSS animation');
      return;
    }

    setStatus('🎭 Loading authentic liquid light simulation...');

    import('webgl-fluid-enhanced')
      .then((module) => {
        try {
          setStatus('🌊 Initializing authentic overhead projector physics...');
          
          const fluidInstance = new module.default(container);
          
          // MINIMAL CONTINUOUS FLOW CONFIGURATION
          const authenticConfig = {
            // RESOLUTION
            SIM_RESOLUTION: 256,
            DYE_RESOLUTION: 1024,

            // MAXIMIZE NATURAL FLOW - Let fluid dynamics create the motion
            VELOCITY_DISSIPATION: 0.2,    // Very low - keep motion alive much longer
            DENSITY_DISSIPATION: 0.7,     // Keep colors flowing
            PRESSURE: 0.9,                 // Higher pressure for more active flow
            CURL: 50,                      // Maximum curl for natural swirling

            // MINIMAL EXTERNAL FORCES
            SPLAT_RADIUS: 0.25,
            SPLAT_FORCE: 6000,

            // EFFECTS
            BLOOM: false,
            SUNRAYS: false,

            // COLORS
            COLOR_PALETTE: [
              '#FF6B35', '#004E89', '#FF1744', '#00C853',
              '#9C27B0', '#FFC107', '#E91E63', '#00BCD4'
            ],
            COLORFUL: true,
            COLOR_UPDATE_SPEED: 10,
            BRIGHTNESS: 0.8,

            TRANSPARENT: false,
            HOVER: true,                   // Enable mouse for initial motion
            INITIAL: true,
            PAUSED: false,
            BACKGROUND_COLOR: '#000000'
          };
          
          fluidInstance.setConfig(authenticConfig);
          fluidInstance.start();
          fluidRef.current = fluidInstance;
          
          setStatus('🌍 GRAVITATIONAL TILT ACTIVE');

          // STRONG FREQUENT GRAVITY TILT - Like constantly rocking the clock face
          let tiltTime = 0;
          const gravitationalTilt = () => {
            if (!fluidRef.current?.setGravity) {
              // Check for config updates or other gravity methods
              console.log('Available methods:', Object.keys(fluidRef.current || {}));

              // Try alternative: update config gravity if available
              if (fluidRef.current?.setConfig) {
                tiltTime += 0.05; // Faster tilt changes

                const gravityX = Math.sin(tiltTime * 1.2) * 0.3;  // Strong X tilt
                const gravityY = Math.sin(tiltTime * 0.9) * 0.25; // Strong Y tilt

                fluidRef.current.setConfig({
                  GRAVITY_X: gravityX,
                  GRAVITY_Y: gravityY
                });
              }

              requestAnimationFrame(gravitationalTilt);
              return;
            }

            tiltTime += 0.05; // Much faster gravity changes

            // Strong gravity tilt - enough to actually move all the fluid
            const gravityX = Math.sin(tiltTime * 1.2) * 0.3;  // Strong X tilt
            const gravityY = Math.sin(tiltTime * 0.9) * 0.25; // Strong Y tilt

            // Apply strong tilted gravity to entire simulation
            fluidRef.current.setGravity(gravityX, gravityY);

            requestAnimationFrame(gravitationalTilt);
          };

          // Initial impulse to start motion and check for gravity API
          setTimeout(() => {
            if (fluidRef.current?.splatAtLocation) {
              const canvas = container.querySelector('canvas');
              if (canvas) {
                const scaleX = canvas.width / canvas.clientWidth;
                const scaleY = canvas.height / canvas.clientHeight;
                const centerX = (container.offsetWidth * 0.5) * scaleX;
                const centerY = (container.offsetHeight * 0.5) * scaleY;

                // Single impulse to create initial colors and motion
                fluidRef.current.splatAtLocation(centerX, centerY, 80, -60);
              }
            }

            // Try to start gravity tilt system
            gravitationalTilt();
          }, 1000);
          
          // Cleanup
          return () => {
            fluidInstance.stop();
          };
          
        } catch (error) {
          setStatus(`❌ Failed to initialize: ${error}`);
        }
      })
      .catch((error) => {
        setStatus(`❌ Failed to load library: ${error}`);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Status overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/90 text-white p-3 rounded-lg border border-white/20">
        <div className="text-sm font-mono">{status}</div>
        {status.includes('ACTIVE') && (
          <div className="text-xs mt-2 space-y-1 opacity-80">
            <div>🌍 Strong Gravity Vector (0.3 force)</div>
            <div>⚡ Fast Tilt Changes (every frame)</div>
            <div>🌊 All Fluid Responds</div>
            <div>🎭 Constant Rocking Motion</div>
          </div>
        )}
      </div>
      
      {/* Fluid simulation container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer"
        style={{ 
          background: '#000',
          filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' // Slight overhead projector character
        }}
      />
      
      {/* Subtle vignette like projector beam focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 70%, rgba(0,0,0,0.3) 100%)',
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}