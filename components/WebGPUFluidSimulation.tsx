'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioData } from '../lib/audio-reactive';

interface WebGPUFluidConfig {
  particleCount: number;
  workgroupSize: number;
  deltaTime: number;
  damping: number;
  gravity: number;
  colorIntensity: number;
  kaleidoscopeMode: boolean;
  mirrorCount: number;
}

interface Particle {
  position: [number, number];
  velocity: [number, number];
  mass: number;
  color: [number, number, number, number];
  life: number;
}

export default function WebGPUFluidSimulation({
  config = {},
  audioData
}: {
  config?: Partial<WebGPUFluidConfig>;
  audioData?: AudioData;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const contextRef = useRef<GPUCanvasContext | null>(null);
  const pipelinesRef = useRef<{
    compute?: GPUComputePipeline;
    render?: GPURenderPipeline;
  }>({});
  const buffersRef = useRef<{
    particles?: GPUBuffer;
    uniforms?: GPUBuffer;
  }>({});
  const animationRef = useRef<number>();
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultConfig: WebGPUFluidConfig = {
    particleCount: 100000,
    workgroupSize: 64,
    deltaTime: 0.016,
    damping: 0.99,
    gravity: 0.1,
    colorIntensity: 1.0,
    kaleidoscopeMode: true,
    mirrorCount: 8,
    ...config
  };

  useEffect(() => {
    initWebGPU();
    return () => {
      cleanup();
    };
  }, []);

  const initWebGPU = async () => {
    if (!navigator.gpu) {
      console.warn('WebGPU not supported, falling back to WebGL');
      setIsSupported(false);
      return;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      });
      
      if (!adapter) {
        throw new Error('No WebGPU adapter available');
      }

      const device = await adapter.requestDevice({
        requiredFeatures: ['shader-f16'] as any[],
        requiredLimits: {
          maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
          maxComputeWorkgroupsPerDimension: adapter.limits.maxComputeWorkgroupsPerDimension,
        }
      });

      deviceRef.current = device;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('webgpu');
      if (!context) {
        throw new Error('Failed to get WebGPU context');
      }

      contextRef.current = context;

      // Configure canvas
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: 'premultiplied',
      });

      await setupComputePipeline(device);
      await setupRenderPipeline(device, format);
      initializeParticles(device);

      setIsSupported(true);
      setIsInitialized(true);
      startAnimation();
    } catch (error) {
      console.error('WebGPU initialization failed:', error);
      setIsSupported(false);
    }
  };

  const setupComputePipeline = async (device: GPUDevice) => {
    const computeShaderCode = `
      struct Particle {
        position: vec2<f32>,
        velocity: vec2<f32>,
        mass: f32,
        color: vec4<f32>,
        life: f32,
        padding: vec3<f32>, // Align to 16 bytes
      };

      struct Uniforms {
        deltaTime: f32,
        damping: f32,
        gravity: f32,
        audioVolume: f32,
        audioBass: f32,
        audioMids: f32,
        audioTreble: f32,
        beat: f32,
        time: f32,
        kaleidoscopeMode: f32,
        mirrorCount: f32,
        colorIntensity: f32,
        screenSize: vec2<f32>,
        padding: vec2<f32>,
      };

      @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
      @group(0) @binding(1) var<uniform> uniforms: Uniforms;

      // Hash function for pseudorandom numbers
      fn hash(p: vec2<f32>) -> f32 {
        let p3 = fract(vec3<f32>(p.xyx) * 0.1031);
        let p3_dot = dot(p3, vec3<f32>(p3.yzx) + 33.33);
        return fract((p3.x + p3.y) * p3_dot);
      }

      // Curl noise for turbulent flow
      fn curlNoise(p: vec2<f32>, time: f32) -> vec2<f32> {
        let eps = 0.01;
        let n1 = hash(p + vec2<f32>(0.0, eps) + vec2<f32>(time));
        let n2 = hash(p + vec2<f32>(0.0, -eps) + vec2<f32>(time));
        let dx = (n1 - n2) / (2.0 * eps);
        
        let n3 = hash(p + vec2<f32>(eps, 0.0) + vec2<f32>(time));
        let n4 = hash(p + vec2<f32>(-eps, 0.0) + vec2<f32>(time));
        let dy = (n3 - n4) / (2.0 * eps);
        
        return vec2<f32>(dy, -dx); // Curl = (∂n/∂y, -∂n/∂x)
      }

      // Grateful Dead color palette
      fn getGratefulDeadColor(t: f32, variant: f32) -> vec4<f32> {
        var color: vec3<f32>;
        
        if (variant < 0.2) {
          // Fire on the Mountain
          color = mix(vec3<f32>(1.0, 0.3, 0.1), vec3<f32>(1.0, 0.8, 0.2), 0.5 + 0.5 * sin(t * 3.0));
        } else if (variant < 0.4) {
          // Dark Star
          color = mix(vec3<f32>(0.2, 0.1, 0.5), vec3<f32>(0.8, 0.8, 1.0), 0.5 + 0.5 * sin(t * 4.0));
        } else if (variant < 0.6) {
          // China Cat Sunflower
          color = mix(vec3<f32>(1.0, 1.0, 0.2), vec3<f32>(0.3, 0.8, 0.2), 0.5 + 0.5 * sin(t * 2.0));
        } else if (variant < 0.8) {
          // Ripple
          color = mix(vec3<f32>(0.1, 0.3, 1.0), vec3<f32>(0.9, 0.9, 1.0), 0.5 + 0.5 * sin(t * 1.5));
        } else {
          // Terrapin Station
          color = mix(vec3<f32>(0.6, 0.4, 0.2), vec3<f32>(0.8, 0.2, 1.0), 0.5 + 0.5 * sin(t * 2.5));
        }
        
        return vec4<f32>(color * uniforms.colorIntensity, 1.0);
      }

      @compute @workgroup_size(${defaultConfig.workgroupSize})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        let index = id.x;
        if (index >= arrayLength(&particles)) {
          return;
        }

        var particle = particles[index];
        
        // Audio-reactive forces
        let audioForce = uniforms.audioBass * 0.5 + uniforms.audioMids * 0.3;
        let beatPulse = uniforms.beat * 2.0;
        
        // Curl noise for organic movement
        let curlForce = curlNoise(particle.position * 0.01, uniforms.time) * (0.1 + audioForce);
        
        // Update velocity with curl noise and audio reactivity
        particle.velocity += curlForce * uniforms.deltaTime;
        particle.velocity += vec2<f32>(0.0, -uniforms.gravity) * uniforms.deltaTime;
        
        // Audio-reactive damping
        let dynamicDamping = uniforms.damping * (1.0 - uniforms.audioTreble * 0.2);
        particle.velocity *= dynamicDamping;
        
        // Beat detection creates explosions
        if (uniforms.beat > 0.5) {
          let explosionCenter = vec2<f32>(sin(uniforms.time), cos(uniforms.time)) * 200.0;
          let dir = normalize(particle.position - explosionCenter);
          particle.velocity += dir * beatPulse * 50.0;
        }
        
        // Update position
        particle.position += particle.velocity * uniforms.deltaTime;
        
        // Kaleidoscope boundary wrapping
        if (uniforms.kaleidoscopeMode > 0.5) {
          let angle = atan2(particle.position.y, particle.position.x);
          let radius = length(particle.position);
          let mirrorAngle = 2.0 * 3.14159 / uniforms.mirrorCount;
          let wrappedAngle = fract(angle / mirrorAngle) * mirrorAngle;
          particle.position = vec2<f32>(cos(wrappedAngle), sin(wrappedAngle)) * radius;
        } else {
          // Screen wrapping for non-kaleidoscope mode
          if (particle.position.x < -uniforms.screenSize.x * 0.5) { particle.position.x = uniforms.screenSize.x * 0.5; }
          if (particle.position.x > uniforms.screenSize.x * 0.5) { particle.position.x = -uniforms.screenSize.x * 0.5; }
          if (particle.position.y < -uniforms.screenSize.y * 0.5) { particle.position.y = uniforms.screenSize.y * 0.5; }
          if (particle.position.y > uniforms.screenSize.y * 0.5) { particle.position.y = -uniforms.screenSize.y * 0.5; }
        }
        
        // Update color based on velocity and audio
        let colorSeed = uniforms.time + length(particle.position) * 0.01;
        let colorVariant = hash(particle.position * 0.001);
        particle.color = getGratefulDeadColor(colorSeed + uniforms.audioTreble * 2.0, colorVariant);
        
        // Audio-reactive alpha
        particle.color.w = 0.3 + uniforms.audioVolume * 0.7;
        
        // Update life (for particle recycling)
        particle.life -= uniforms.deltaTime;
        if (particle.life <= 0.0) {
          // Respawn particle
          particle.position = vec2<f32>(hash(particle.position), hash(particle.position.yx)) * uniforms.screenSize - uniforms.screenSize * 0.5;
          particle.velocity = vec2<f32>(0.0, 0.0);
          particle.life = 10.0 + hash(particle.position.xy) * 20.0;
        }
        
        particles[index] = particle;
      }
    `;

    const computeShader = device.createShaderModule({
      code: computeShaderCode
    });

    pipelinesRef.current.compute = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: computeShader,
        entryPoint: 'main'
      }
    });
  };

  const setupRenderPipeline = async (device: GPUDevice, format: GPUTextureFormat) => {
    const renderShaderCode = `
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) color: vec4<f32>,
        @location(1) pointCoord: vec2<f32>,
      };

      struct Particle {
        position: vec2<f32>,
        velocity: vec2<f32>,
        mass: f32,
        color: vec4<f32>,
        life: f32,
        padding: vec3<f32>,
      };

      struct Uniforms {
        deltaTime: f32,
        damping: f32,
        gravity: f32,
        audioVolume: f32,
        audioBass: f32,
        audioMids: f32,
        audioTreble: f32,
        beat: f32,
        time: f32,
        kaleidoscopeMode: f32,
        mirrorCount: f32,
        colorIntensity: f32,
        screenSize: vec2<f32>,
        padding: vec2<f32>,
      };

      @group(0) @binding(0) var<storage, read> particles: array<Particle>;
      @group(0) @binding(1) var<uniform> uniforms: Uniforms;

      @vertex
      fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
        let particle = particles[vertexIndex];
        
        // Convert world position to clip space
        let clipPosition = vec4<f32>(
          particle.position.x / (uniforms.screenSize.x * 0.5),
          particle.position.y / (uniforms.screenSize.y * 0.5),
          0.0,
          1.0
        );
        
        var output: VertexOutput;
        output.position = clipPosition;
        output.color = particle.color;
        output.pointCoord = vec2<f32>(0.0, 0.0); // Will be set by point primitive
        
        return output;
      }

      @fragment
      fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
        // Create circular particle shape
        let dist = length(input.pointCoord - vec2<f32>(0.5, 0.5));
        if (dist > 0.5) {
          discard;
        }
        
        // Soft edge falloff
        let alpha = (0.5 - dist) * 2.0;
        
        // Audio-reactive glow
        let glow = 1.0 + uniforms.audioBass * 2.0;
        
        return vec4<f32>(input.color.rgb * glow, input.color.a * alpha);
      }
    `;

    const renderShader = device.createShaderModule({
      code: renderShaderCode
    });

    pipelinesRef.current.render = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: renderShader,
        entryPoint: 'vs_main'
      },
      fragment: {
        module: renderShader,
        entryPoint: 'fs_main',
        targets: [{
          format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha'
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha'
            }
          }
        }]
      },
      primitive: {
        topology: 'point-list'
      },
      multisample: {
        count: 4
      }
    });
  };

  const initializeParticles = (device: GPUDevice) => {
    const particleData = new Float32Array(defaultConfig.particleCount * 16); // 16 floats per particle

    // Initialize particles with random positions and properties
    for (let i = 0; i < defaultConfig.particleCount; i++) {
      const offset = i * 16;
      
      // Position
      particleData[offset] = (Math.random() - 0.5) * 800; // x
      particleData[offset + 1] = (Math.random() - 0.5) * 600; // y
      
      // Velocity
      particleData[offset + 2] = (Math.random() - 0.5) * 10; // vx
      particleData[offset + 3] = (Math.random() - 0.5) * 10; // vy
      
      // Mass
      particleData[offset + 4] = 1.0;
      
      // Color (RGBA)
      particleData[offset + 5] = Math.random(); // r
      particleData[offset + 6] = Math.random(); // g
      particleData[offset + 7] = Math.random(); // b
      particleData[offset + 8] = 1.0; // a
      
      // Life
      particleData[offset + 9] = Math.random() * 30 + 10;
      
      // Padding (offset 10, 11, 12)
      particleData[offset + 10] = 0;
      particleData[offset + 11] = 0;
      particleData[offset + 12] = 0;
    }

    // Create particle buffer
    buffersRef.current.particles = device.createBuffer({
      size: particleData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(buffersRef.current.particles, 0, particleData);

    // Create uniform buffer
    const uniformData = new Float32Array(16); // Pad to 64 bytes
    buffersRef.current.uniforms = device.createBuffer({
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  };

  const startAnimation = () => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!deviceRef.current || !contextRef.current || !isInitialized) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      updateUniforms(deltaTime, currentTime / 1000);
      render();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const updateUniforms = (deltaTime: number, time: number) => {
    if (!deviceRef.current || !buffersRef.current.uniforms) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prepare uniform data
    const uniformData = new Float32Array([
      deltaTime,
      defaultConfig.damping,
      defaultConfig.gravity,
      audioData?.volume || 0,
      audioData?.bass || 0,
      audioData?.mids || 0,
      audioData?.treble || 0,
      audioData?.beatDetected ? 1.0 : 0.0,
      time,
      defaultConfig.kaleidoscopeMode ? 1.0 : 0.0,
      defaultConfig.mirrorCount,
      defaultConfig.colorIntensity,
      canvas.width,
      canvas.height,
      0, // padding
      0  // padding
    ]);

    deviceRef.current.queue.writeBuffer(buffersRef.current.uniforms, 0, uniformData);
  };

  const render = () => {
    if (!deviceRef.current || !contextRef.current || !pipelinesRef.current.compute || !pipelinesRef.current.render) {
      return;
    }

    const commandEncoder = deviceRef.current.createCommandEncoder();

    // Compute pass
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(pipelinesRef.current.compute);
    
    const computeBindGroup = deviceRef.current.createBindGroup({
      layout: pipelinesRef.current.compute.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: buffersRef.current.particles! } },
        { binding: 1, resource: { buffer: buffersRef.current.uniforms! } }
      ]
    });
    
    computePass.setBindGroup(0, computeBindGroup);
    computePass.dispatchWorkgroups(Math.ceil(defaultConfig.particleCount / defaultConfig.workgroupSize));
    computePass.end();

    // Render pass
    const textureView = contextRef.current.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: 'clear',
        storeOp: 'store'
      }]
    });

    renderPass.setPipeline(pipelinesRef.current.render);
    
    const renderBindGroup = deviceRef.current.createBindGroup({
      layout: pipelinesRef.current.render.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: buffersRef.current.particles! } },
        { binding: 1, resource: { buffer: buffersRef.current.uniforms! } }
      ]
    });
    
    renderPass.setBindGroup(0, renderBindGroup);
    renderPass.draw(defaultConfig.particleCount);
    renderPass.end();

    deviceRef.current.queue.submit([commandEncoder.finish()]);
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Clean up WebGPU resources
    buffersRef.current.particles?.destroy();
    buffersRef.current.uniforms?.destroy();
    deviceRef.current?.destroy();
  };

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  if (!isSupported) {
    return null; // Fallback to WebGL version
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