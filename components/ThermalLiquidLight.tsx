'use client';

import { useRef, useEffect, useState } from 'react';

interface FluidEngineProps {
  audioData?: {
    bass: number;
    mids: number;
    treble: number;
    volume: number;
  };
  songMode?: 'darkStar' | 'fireOnTheMountain' | 'terraPinStation' | 'scarletBegonias';
  className?: string;
}

const layerConfigs = {
  mainLayer: {
    viscosity: 0.8,
    curl: 60,
    velocityDissipation: 0.08,
    colors: [0xFFD700, 0xFF8C00],
    blendMode: 'normal',
    opacity: 1.0
  }
};

const songModes = {
  darkStar: {
    colors: [0x1E0A3C, 0x4C0B7A, 0x240B5C, 0x2D0F6B],
    movement: 'slow_mysterious',
    thermalIntensity: 0.3
  },
  fireOnTheMountain: {
    colors: [0xFFD700, 0xFF4500, 0xFF6347, 0xFF8C00],
    movement: 'building_intensity',
    thermalIntensity: 0.8
  },
  terraPinStation: {
    colors: [0x00FFFF, 0x00FF80, 0x20B2AA, 0x48D1CC],
    movement: 'flowing_water',
    thermalIntensity: 0.5
  },
  scarletBegonias: {
    colors: [0xFF2500, 0xFF0080, 0xFF1493, 0xFF69B4],
    movement: 'vibrant_blooming',
    thermalIntensity: 0.7
  }
};

export default function ThermalLiquidLight({
  audioData = { bass: 0.5, mids: 0.5, treble: 0.5, volume: 0.5 },
  songMode = 'darkStar',
  className = ''
}: FluidEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fluidEnginesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>();

  const [FluidEngine, setFluidEngine] = useState<any>(null);

  useEffect(() => {
    async function loadFluidEngine() {
      try {
        const module = await import('webgl-fluid-enhanced');
        setFluidEngine(() => module.default);
      } catch (error) {
        console.error('Failed to load webgl-fluid-enhanced:', error);
      }
    }
    loadFluidEngine();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !FluidEngine) {
      console.log('ThermalLiquidLight: Missing container or FluidEngine', {
        hasContainer: !!containerRef.current,
        hasFluidEngine: !!FluidEngine
      });
      return;
    }

    console.log('ThermalLiquidLight: Initializing with FluidEngine', FluidEngine);
    const container = containerRef.current;
    const currentMode = songModes[songMode];

    container.innerHTML = '';
    fluidEnginesRef.current = [];

    Object.entries(layerConfigs).forEach(([layerName, config], index) => {
      console.log(`ThermalLiquidLight: Creating layer ${layerName}`, config);

      const layerContainer = document.createElement('div');
      layerContainer.style.position = 'absolute';
      layerContainer.style.top = '0';
      layerContainer.style.left = '0';
      layerContainer.style.width = '100%';
      layerContainer.style.height = '100%';
      layerContainer.style.mixBlendMode = config.blendMode;
      layerContainer.style.opacity = config.opacity.toString();
      layerContainer.style.zIndex = index.toString();

      console.log(`ThermalLiquidLight: Created layer container for ${layerName}`, {
        width: layerContainer.style.width,
        height: layerContainer.style.height,
        position: layerContainer.style.position
      });

      try {
        const simulation = new FluidEngine(layerContainer);
        console.log(`ThermalLiquidLight: FluidEngine instance created for ${layerName}`, simulation);

        simulation.setConfig({
          transparent: true,
          curl: config.curl,
          velocityDissipation: config.velocityDissipation,
          densityDissipation: 0.97,
          pressure: 0.8,
          pressureIterations: 20,
          splatRadius: 0.25,
          shading: true,
          colorful: true,
          colorUpdateSpeed: 10,
          backgroundColor: '#000000',
          bloom: true,
          bloomIterations: 8,
          bloomResolution: 256,
          bloomIntensity: 0.8,
          bloomThreshold: 0.6,
          bloomSoftKnee: 0.7,
          hover: false
        });

        console.log(`ThermalLiquidLight: Config set for ${layerName}, starting simulation`);
        simulation.start();
        console.log(`ThermalLiquidLight: Simulation started for ${layerName}`);

        // Ensure canvas is properly sized
        setTimeout(() => {
          const canvas = layerContainer.querySelector('canvas');
          if (canvas) {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            console.log(`ThermalLiquidLight: Canvas resized for ${layerName}`, {
              width: canvas.width,
              height: canvas.height,
              clientWidth: canvas.clientWidth,
              clientHeight: canvas.clientHeight
            });
          }
        }, 100);

        container.appendChild(layerContainer);
        fluidEnginesRef.current.push(simulation);
        console.log(`ThermalLiquidLight: Layer ${layerName} added to container and engines array`);
      } catch (error) {
        console.error(`ThermalLiquidLight: Error creating simulation for ${layerName}:`, error);
      }
    });

    function createThermalConvection() {
      const time = Date.now() * 0.001;
      const thermalIntensity = currentMode.thermalIntensity;
      const layerOffset = time * 0.1;

      // Debug log every 5 seconds
      if (Math.floor(time) % 5 === 0 && time - Math.floor(time) < 0.1) {
        console.log('ThermalLiquidLight: Animation loop running', {
          time: Math.floor(time),
          engineCount: fluidEnginesRef.current.length,
          thermalIntensity
        });
      }

      if (fluidEnginesRef.current.length === 0) {
        console.log('ThermalLiquidLight: No fluid engines available for thermal convection');
        return;
      }

      fluidEnginesRef.current.forEach((simulation, layerIndex) => {
        const layerSpecificOffset = layerIndex * 0.3;
        const viscosityMultiplier = Object.values(layerConfigs)[layerIndex].viscosity;

        const layerThermalSources = [
          {
            x: 0.2 + Math.sin(time * 0.3 + layerSpecificOffset) * 0.1,
            y: 0.85,
            intensity: audioData.bass * thermalIntensity * 0.3 / viscosityMultiplier
          },
          {
            x: 0.5 + Math.cos(time * 0.2 + layerSpecificOffset) * 0.15,
            y: 0.9,
            intensity: audioData.mids * thermalIntensity * 0.25 / viscosityMultiplier
          },
          {
            x: 0.8 + Math.sin(time * 0.25 + layerSpecificOffset) * 0.1,
            y: 0.8,
            intensity: audioData.treble * thermalIntensity * 0.2 / viscosityMultiplier
          }
        ];

        layerThermalSources.forEach((source, index) => {
          const dx = (Math.random() - 0.5) * 20;
          const dy = -source.intensity * 150;

          const color = currentMode.colors[layerIndex % currentMode.colors.length];
          const hexColor = `#${color.toString(16).padStart(6, '0')}`;

          const splatX = source.x * window.innerWidth;
          const splatY = source.y * window.innerHeight;

          if (index === 0 && layerIndex === 0 && Math.random() < 0.01) {
            console.log('ThermalLiquidLight: Creating splat', {
              x: splatX,
              y: splatY,
              dx,
              dy,
              color: hexColor,
              intensity: source.intensity
            });
          }

          simulation.splatAtLocation(splatX, splatY, dx, dy, hexColor);
        });

        const coolingSources = [
          { x: 0.1, y: 0.1, intensity: 0.01 },
          { x: 0.9, y: 0.1, intensity: 0.01 },
          { x: 0.5, y: 0.05, intensity: 0.015 }
        ];

        coolingSources.forEach(source => {
          const dx = (Math.random() - 0.5) * 10;
          const dy = source.intensity * 100;

          simulation.splatAtLocation(
            source.x * window.innerWidth,
            source.y * window.innerHeight,
            dx,
            dy,
            '#1a2332'
          );
        });

        if (audioData.volume > 0.7) {
          const burstX = 0.3 + Math.random() * 0.4;
          const burstY = 0.7 + Math.random() * 0.2;
          const burstIntensity = (audioData.volume - 0.7) * 0.5;

          simulation.splatAtLocation(
            burstX * window.innerWidth,
            burstY * window.innerHeight,
            (Math.random() - 0.5) * burstIntensity * 100,
            -burstIntensity * 30,
            '#ffcc33'
          );
        }
      });
    }

    function animate() {
      createThermalConvection();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      fluidEnginesRef.current.forEach(simulation => {
        if (simulation && typeof simulation.stop === 'function') {
          simulation.stop();
        }
      });
      fluidEnginesRef.current = [];
    };
  }, [FluidEngine, songMode, audioData]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ background: '#000011' }}
    />
  );
}