'use client';

import { useEffect, useRef, useState } from 'react';

interface WebGLFluidConfig {
  resolution: number;
  density: number;
  velocity: number;
  pressure: number;
  viscosity: number;
  colorIntensity: number;
}

export default function WebGLFluidSimulation({ 
  config = {} 
}: { 
  config?: Partial<WebGLFluidConfig> 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const [isSupported, setIsSupported] = useState(true);

  const defaultConfig: WebGLFluidConfig = {
    resolution: 256,
    density: 0.8,
    velocity: 0.5,
    pressure: 0.8,
    viscosity: 0.1,
    colorIntensity: 1.0,
    ...config
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setIsSupported(false);
      return;
    }

    glRef.current = gl;
    setupWebGL(gl, canvas);
    startAnimation(gl);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const setupWebGL = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader source for psychedelic fluid simulation
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_density;
      uniform float u_velocity;
      uniform float u_pressure;
      uniform float u_viscosity;
      uniform float u_colorIntensity;
      
      varying vec2 v_texCoord;
      
      // Noise function for organic movement
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Smooth noise
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      // Fractal noise
      float fractalNoise(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * smoothNoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      // Psychedelic color function
      vec3 psychedelicColor(float t) {
        float r = 0.5 + 0.5 * sin(t * 2.0 + 0.0);
        float g = 0.5 + 0.5 * sin(t * 2.0 + 2.094);
        float b = 0.5 + 0.5 * sin(t * 2.0 + 4.188);
        return vec3(r, g, b);
      }
      
      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * 2.0 - 1.0;
        
        // Create fluid-like movement
        float time = u_time * 0.5;
        vec2 flow = vec2(
          fractalNoise(p * 2.0 + time * 0.1),
          fractalNoise(p * 2.0 + time * 0.1 + 100.0)
        );
        
        // Add multiple layers of movement
        vec2 flow2 = vec2(
          fractalNoise(p * 3.0 + time * 0.15 + 200.0),
          fractalNoise(p * 3.0 + time * 0.15 + 300.0)
        );
        
        vec2 flow3 = vec2(
          fractalNoise(p * 1.5 + time * 0.08 + 400.0),
          fractalNoise(p * 1.5 + time * 0.08 + 500.0)
        );
        
        // Combine flows
        vec2 combinedFlow = (flow + flow2 * 0.5 + flow3 * 0.3) * u_velocity;
        
        // Create density field
        float density = 0.0;
        density += fractalNoise(p * 4.0 + combinedFlow + time * 0.2) * 0.4;
        density += fractalNoise(p * 8.0 + combinedFlow * 2.0 + time * 0.3) * 0.2;
        density += fractalNoise(p * 16.0 + combinedFlow * 4.0 + time * 0.4) * 0.1;
        
        density *= u_density;
        
        // Create color based on density and position
        float colorTime = time + length(p) * 2.0;
        vec3 baseColor = psychedelicColor(colorTime);
        
        // Add iridescent effect
        float iridescence = sin(density * 10.0 + time * 3.0) * 0.5 + 0.5;
        vec3 iridescentColor = mix(
          baseColor,
          vec3(1.0, 1.0, 1.0),
          iridescence * 0.3
        );
        
        // Apply density to color
        vec3 finalColor = iridescentColor * (0.3 + density * 0.7);
        
        // Add glow effect
        float glow = smoothstep(0.0, 1.0, density);
        finalColor += glow * 0.2;
        
        // Apply color intensity
        finalColor *= u_colorIntensity;
        
        // Add some transparency for blending
        float alpha = 0.1 + density * 0.3;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Create geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);

    // Create buffers
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

    // Set up uniforms
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const densityLocation = gl.getUniformLocation(program, 'u_density');
    const velocityLocation = gl.getUniformLocation(program, 'u_velocity');
    const pressureLocation = gl.getUniformLocation(program, 'u_pressure');
    const viscosityLocation = gl.getUniformLocation(program, 'u_viscosity');
    const colorIntensityLocation = gl.getUniformLocation(program, 'u_colorIntensity');

    // Store uniform locations
    (program as any).uniforms = {
      time: timeLocation,
      resolution: resolutionLocation,
      density: densityLocation,
      velocity: velocityLocation,
      pressure: pressureLocation,
      viscosity: viscosityLocation,
      colorIntensity: colorIntensityLocation
    };

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  };

  const startAnimation = (gl: WebGLRenderingContext) => {
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      // Update uniforms
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
      }

      // Clear and draw
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
}
