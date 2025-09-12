'use client';

import { useEffect, useRef, useState } from 'react';
import AudioReactiveSystem, { AudioData, AudioReactiveFluid } from '../lib/audio-reactive';

interface EnhancedFluidConfig {
  resolution: number;
  density: number;
  velocity: number;
  pressure: number;
  viscosity: number;
  colorIntensity: number;
  curlStrength: number;
  turbulence: number;
  oilWaterEffect: number;
  gratefulDeadMode: boolean;
  audioReactive: boolean;
  microphoneAccess: boolean;
}

export default function EnhancedWebGLFluidSimulation({ 
  config = {} 
}: { 
  config?: Partial<EnhancedFluidConfig> 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const audioSystemRef = useRef<AudioReactiveSystem | null>(null);
  const audioFluidRef = useRef<AudioReactiveFluid | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const defaultConfig: EnhancedFluidConfig = {
    resolution: 256,
    density: 0.8,
    velocity: 0.5,
    pressure: 0.8,
    viscosity: 0.1,
    colorIntensity: 1.0,
    curlStrength: 0.3,
    turbulence: 0.4,
    oilWaterEffect: 0.5,
    gratefulDeadMode: true,
    audioReactive: true,
    microphoneAccess: false,
    ...config
  };

  console.log('🌊 EnhancedWebGLFluidSimulation mounted with config:', defaultConfig);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('🚨 EnhancedWebGLFluidSimulation: Canvas ref is null');
      return;
    }

    console.log('🎨 Setting up WebGL context...');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('🚨 WebGL not supported!');
      setIsSupported(false);
      return;
    }

    console.log('✅ WebGL context created successfully');
    glRef.current = gl;
    setupEnhancedWebGL(gl, canvas);
    startAnimation(gl);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const setupEnhancedWebGL = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Enhanced fragment shader with curl noise and oil-water effects
    const fragmentShaderSource = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_density;
      uniform float u_velocity;
      uniform float u_pressure;
      uniform float u_viscosity;
      uniform float u_colorIntensity;
      uniform float u_curlStrength;
      uniform float u_turbulence;
      uniform float u_oilWaterEffect;
      uniform bool u_gratefulDeadMode;
      
      varying vec2 v_texCoord;
      
      // Enhanced noise functions
      vec3 hash3(vec2 p) {
        vec3 q = vec3(
          dot(p, vec2(127.1, 311.7)),
          dot(p, vec2(269.5, 183.3)),
          dot(p, vec2(419.2, 371.9))
        );
        return fract(sin(q) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(dot(hash3(i + vec2(0.0, 0.0)).xy, f - vec2(0.0, 0.0)),
              dot(hash3(i + vec2(1.0, 0.0)).xy, f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash3(i + vec2(0.0, 1.0)).xy, f - vec2(0.0, 1.0)),
              dot(hash3(i + vec2(1.0, 1.0)).xy, f - vec2(1.0, 1.0)), u.x), u.y
        );
      }
      
      // Curl noise for turbulent flow
      vec2 curlNoise(vec2 p, float time) {
        float eps = 0.01;
        float n1, n2, a, b;
        
        a = noise(p + vec2(0.0, eps) + time);
        b = noise(p + vec2(0.0, -eps) + time);
        n1 = (a - b) / (2.0 * eps);
        
        a = noise(p + vec2(eps, 0.0) + time);
        b = noise(p + vec2(-eps, 0.0) + time);
        n2 = (a - b) / (2.0 * eps);
        
        return vec2(n1, -n2);
      }
      
      // Oil-water surface tension simulation
      float oilWaterNoise(vec2 p, float time) {
        float noise1 = noise(p * 2.0 + time * 0.1);
        float noise2 = noise(p * 4.0 + time * 0.15 + 100.0);
        float noise3 = noise(p * 8.0 + time * 0.08 + 200.0);
        
        float surfaceTension = 0.3 + 0.2 * sin(time * 0.5);
        return smoothstep(surfaceTension - 0.1, surfaceTension + 0.1, 
                         noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
      }
      
      // Grateful Dead color palettes
      vec3 getGratefulDeadColor(float t, float variant) {
        if (variant < 0.2) {
          // Fire on the Mountain - reds/oranges with gold
          return mix(
            vec3(1.0, 0.3, 0.1), // Deep red
            vec3(1.0, 0.8, 0.2), // Gold
            0.5 + 0.5 * sin(t * 3.0)
          );
        } else if (variant < 0.4) {
          // Dark Star - deep purples with silver sparkles
          return mix(
            vec3(0.2, 0.1, 0.5), // Deep purple
            vec3(0.8, 0.8, 1.0), // Silver
            0.5 + 0.5 * sin(t * 4.0)
          );
        } else if (variant < 0.6) {
          // China Cat Sunflower - yellows with green undertones
          return mix(
            vec3(1.0, 1.0, 0.2), // Bright yellow
            vec3(0.3, 0.8, 0.2), // Green
            0.5 + 0.5 * sin(t * 2.0)
          );
        } else if (variant < 0.8) {
          // Ripple - blues with white highlights
          return mix(
            vec3(0.1, 0.3, 1.0), // Deep blue
            vec3(0.9, 0.9, 1.0), // White
            0.5 + 0.5 * sin(t * 1.5)
          );
        } else {
          // Terrapin Station - earth tones with cosmic accents
          return mix(
            vec3(0.6, 0.4, 0.2), // Earth brown
            vec3(0.8, 0.2, 1.0), // Cosmic purple
            0.5 + 0.5 * sin(t * 2.5)
          );
        }
      }
      
      // EXTREME TEST - Bright obvious colors
      vec3 standardPsychedelicColor(float t) {
        // Make it IMPOSSIBLE to miss - full bright colors
        return vec3(1.0, 0.0, 1.0);  // BRIGHT MAGENTA TEST
      }
      
      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        
        float time = u_time * 0.3;
        
        // Enhanced fluid movement with curl noise
        vec2 curlForce = curlNoise(p * 3.0, time) * u_curlStrength;
        vec2 flow = curlForce;
        
        // Add turbulence layers
        flow += curlNoise(p * 1.5 + time * 0.1, time + 50.0) * u_turbulence * 0.5;
        flow += curlNoise(p * 6.0 + time * 0.2, time + 100.0) * u_turbulence * 0.2;
        
        // Oil-water effect
        float oilWater = oilWaterNoise(p + flow * 0.5, time);
        flow *= (1.0 + oilWater * u_oilWaterEffect);
        
        // Create enhanced density field
        float density = 0.0;
        vec2 flowPos = p + flow * u_velocity;
        
        density += noise(flowPos * 2.0 + time * 0.1) * 0.4;
        density += noise(flowPos * 4.0 + time * 0.15) * 0.3;
        density += noise(flowPos * 8.0 + time * 0.08) * 0.2;
        density += oilWater * 0.1;
        
        density *= u_density;
        density = max(0.0, density);
        
        // Color calculation
        float colorSeed = time + length(p) * 2.0 + density;
        vec3 color;
        
        if (u_gratefulDeadMode) {
          float colorVariant = noise(p * 0.5 + time * 0.05);
          color = getGratefulDeadColor(colorSeed, colorVariant);
        } else {
          color = standardPsychedelicColor(colorSeed);
        }
        
        // Enhanced color processing
        
        // Add oil-water color separation
        float separation = oilWater * 0.3;
        color.r += separation * sin(colorSeed * 3.0);
        color.g += separation * sin(colorSeed * 3.0 + 2.0);
        color.b += separation * sin(colorSeed * 3.0 + 4.0);
        
        // Iridescent shimmer
        float shimmer = sin(density * 15.0 + time * 4.0) * 0.5 + 0.5;
        color = mix(color, vec3(1.0), shimmer * 0.2 * density);
        
        // Apply density to color
        color *= (0.2 + density * 0.8);
        
        // Enhanced glow with curl-based intensity
        float glowIntensity = length(curlForce) * 0.5 + density;
        color += glowIntensity * 0.3;
        
        // Color intensity
        color *= u_colorIntensity;
        
        // Enhanced transparency with flow-based alpha
        float alpha = 0.05 + density * 0.4 + length(flow) * 0.1;
        // Fill ENTIRE screen with psychedelic colors - not just where fluid exists
        vec2 screenPos = gl_FragCoord.xy / u_resolution;
        float time = u_time * 0.5;
        
        // Psychedelic pattern that covers ENTIRE screen
        vec3 color = vec3(
          0.5 + 0.5 * sin(screenPos.x * 10.0 + time),
          0.5 + 0.5 * sin(screenPos.y * 8.0 + time * 1.3),  
          0.5 + 0.5 * sin((screenPos.x + screenPos.y) * 6.0 + time * 0.8)
        );
        
        gl_FragColor = vec4(color, 1.0);  // SOLID - covers everything
      }
    `;

    // Create shaders and program
    console.log('🔨 Compiling vertex shader...');
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    console.log('🔨 Compiling fragment shader...');
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('🚨 Failed to create enhanced shaders', {
        vertex: !!vertexShader,
        fragment: !!fragmentShader
      });
      return;
    }

    console.log('✅ Shaders compiled successfully');
    console.log('🔗 Creating shader program...');
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('🚨 Failed to create enhanced program');
      return;
    }
    console.log('✅ Shader program created successfully');

    programRef.current = program;
    gl.useProgram(program);

    // Set up geometry and buffers (same as before)
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1,
    ]);
    const texCoords = new Float32Array([
      0, 0, 1, 0, 0, 1, 1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Enhanced uniform locations
    const uniformLocations = {
      time: gl.getUniformLocation(program, 'u_time'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      density: gl.getUniformLocation(program, 'u_density'),
      velocity: gl.getUniformLocation(program, 'u_velocity'),
      pressure: gl.getUniformLocation(program, 'u_pressure'),
      viscosity: gl.getUniformLocation(program, 'u_viscosity'),
      colorIntensity: gl.getUniformLocation(program, 'u_colorIntensity'),
      curlStrength: gl.getUniformLocation(program, 'u_curlStrength'),
      turbulence: gl.getUniformLocation(program, 'u_turbulence'),
      oilWaterEffect: gl.getUniformLocation(program, 'u_oilWaterEffect'),
      gratefulDeadMode: gl.getUniformLocation(program, 'u_gratefulDeadMode')
    };

    (program as any).uniforms = uniformLocations;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  };

  const startAnimation = (gl: WebGLRenderingContext) => {
    let startTime = Date.now();

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 60 === 0) {
        console.log(`🎬 Animation frame ${frameCount}, rendering...`);
      }
      
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      const program = programRef.current;
      if (program && (program as any).uniforms) {
        const uniforms = (program as any).uniforms;
        
        gl.uniform1f(uniforms.time, elapsed);
        gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(uniforms.density, defaultConfig.density);
        gl.uniform1f(uniforms.velocity, defaultConfig.velocity);
        gl.uniform1f(uniforms.pressure, defaultConfig.pressure);
        gl.uniform1f(uniforms.viscosity, defaultConfig.viscosity);
        gl.uniform1f(uniforms.colorIntensity, defaultConfig.colorIntensity);
        gl.uniform1f(uniforms.curlStrength, defaultConfig.curlStrength);
        gl.uniform1f(uniforms.turbulence, defaultConfig.turbulence);
        gl.uniform1f(uniforms.oilWaterEffect, defaultConfig.oilWaterEffect);
        gl.uniform1i(uniforms.gratefulDeadMode, defaultConfig.gratefulDeadMode ? 1 : 0);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('🚨 Failed to create shader object');
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const shaderType = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';
      const error = gl.getShaderInfoLog(shader);
      console.error(`🚨 ${shaderType} Shader compilation error:`, error);
      console.error('🚨 Shader source:', source);
      gl.deleteShader(shader);
      return null;
    }

    const shaderType = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';
    console.log(`✅ ${shaderType} shader compiled successfully`);
    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    console.log('📦 Creating WebGL program...');
    const program = gl.createProgram();
    if (!program) {
      console.error('🚨 Failed to create WebGL program object');
      return null;
    }

    console.log('🔗 Attaching shaders to program...');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    console.log('🔗 Linking program...');
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      console.error('🚨 Enhanced program linking error:', error);
      gl.deleteProgram(program);
      return null;
    }

    console.log('✅ Shader program created and linked successfully!');
    return program;
  };

  if (!isSupported) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 opacity-20" />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ 
        zIndex: 5,  // Between background (z-0) and content (z-10)
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    />
  );
}