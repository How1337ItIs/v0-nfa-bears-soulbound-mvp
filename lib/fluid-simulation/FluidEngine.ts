// Authentic WebGL Fluid Simulation Engine
// Based on research: Navier-Stokes equations, semi-Lagrangian advection, Jacobi relaxation
// References: Pavel Dobryakov's WebGL-Fluid-Simulation, Jos Stam's "Stable Fluids"

import { AudioData } from '../audio-reactive'

interface FluidConfig {
  // Oil layer properties (mineral oil, n=1.40)
  oilDensity: number        // 0.85 g/cm³
  oilViscosity: number      // 20.0 relative to water
  oilRefractiveIndex: number // 1.40
  
  // Water layer properties (distilled water + food coloring)
  waterDensity: number      // 1.0 g/cm³
  waterViscosity: number    // 1.0 baseline
  waterRefractiveIndex: number // 1.33
  
  // Physical constants
  surfaceTension: number    // 0.072 N/m oil-water interface
  densityDifference: number // 0.15 specific gravity difference
  
  // Simulation parameters
  pressure: number
  viscosity: number
  iterations: number
  curl: number
  
  // Visual parameters
  filmThickness: number     // 120nm base thickness for interference
  colorIntensity: number
  bloomIntensity: number
  bloomIterations: number
  bloomResolution: number
  
  // Audio reactivity
  audioBass: number
  audioMids: number
  audioTreble: number
  beatPulse: number
}

interface FluidTextures {
  velocity: WebGLTexture[]
  pressure: WebGLTexture[]
  oilDensity: WebGLTexture[]
  waterDensity: WebGLTexture[]
  temperature: WebGLTexture[]
  curl: WebGLTexture
  bloom: WebGLTexture[]
}

export class FluidEngine {
  private gl: WebGLRenderingContext
  private config: FluidConfig
  private programs: { [key: string]: WebGLProgram } = {}
  private textures: FluidTextures
  private framebuffers: { [key: string]: WebGLFramebuffer } = {}
  
  private canvas: HTMLCanvasElement
  private width: number
  private height: number
  private simWidth: number
  private simHeight: number
  
  private lastTime: number = 0
  private isRunning: boolean = false
  private animationFrame: number | null = null
  
  // Grateful Dead color palettes for authentic cultural aesthetics
  private colorPalettes = {
    darkStar: {
      oil: [0.8, 0.4, 0.9],      // Deep purple
      water: [0.2, 0.4, 0.8],    // Deep blue
      accent: [0.9, 0.9, 0.9]    // Silver sparkle
    },
    fireOnTheMountain: {
      oil: [1.0, 0.6, 0.2],      // Fire orange
      water: [0.8, 0.2, 0.2],    // Crimson
      accent: [1.0, 0.8, 0.2]    // Gold
    },
    chinaCatSunflower: {
      oil: [0.9, 0.8, 0.2],      // Sunflower yellow
      water: [0.4, 0.8, 0.4],    // Garden green
      accent: [0.9, 0.6, 0.8]    // Pink highlights
    }
  }
  
  private currentPalette = this.colorPalettes.darkStar
  
  constructor(canvas: HTMLCanvasElement, config: Partial<FluidConfig> = {}) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    
    // Simulation runs at lower resolution for performance
    this.simWidth = Math.floor(this.width / 2)
    this.simHeight = Math.floor(this.height / 2)
    
    // Default configuration based on authentic oil-water physics
    this.config = {
      // Authentic material properties from research
      oilDensity: 0.85,
      oilViscosity: 20.0,
      oilRefractiveIndex: 1.40,
      waterDensity: 1.0,
      waterViscosity: 1.0,
      waterRefractiveIndex: 1.33,
      
      // Physical constants (Joshua Light Show materials)
      surfaceTension: 0.072,     // N/m for oil-water interface
      densityDifference: 0.15,   // Specific gravity difference
      
      // Simulation parameters (tuned for organic behavior)
      pressure: 0.8,
      viscosity: 30.0,
      iterations: 20,
      curl: 35.0,
      
      // Visual parameters (120nm oil film interference)
      filmThickness: 120e-9,     // 120 nanometers
      colorIntensity: 1.0,
      bloomIntensity: 0.8,
      bloomIterations: 8,
      bloomResolution: 256,
      
      // Audio reactivity (updated real-time)
      audioBass: 0.0,
      audioMids: 0.0,
      audioTreble: 0.0,
      beatPulse: 0.0,
      
      ...config
    }
    
    // Initialize WebGL context
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    })
    
    if (!gl) {
      throw new Error('WebGL not supported')
    }
    
    this.gl = gl
    
    // Enable required extensions
    gl.getExtension('OES_texture_float')
    gl.getExtension('OES_texture_float_linear')
    gl.getExtension('WEBGL_lose_context')
    
    this.initializeShaders()
    this.initializeTextures()
    this.initializeFramebuffers()
  }
  
  private initializeShaders() {
    const gl = this.gl
    
    // Vertex shader used by all programs (standard full-screen quad)
    const vertexShaderSource = `
      precision mediump float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      
      uniform vec2 texelSize;
      
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    
    // Clear shader (initialization)
    const clearShaderSource = `
      precision mediump float;
      uniform vec3 color;
      varying vec2 vUv;
      
      void main () {
        gl_FragColor = vec4(color, 1.0);
      }
    `
    
    // Splat shader (add forces/dye)
    const splatShaderSource = `
      precision mediump float;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      uniform float strength;
      varying vec2 vUv;
      
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color * strength;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    
    // Advection shader (semi-Lagrangian method)
    const advectionShaderSource = `
      precision mediump float;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      varying vec2 vUv;
      
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      
      void main () {
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        gl_FragColor = dissipation * bilerp(uSource, coord, texelSize);
        gl_FragColor.a = 1.0;
      }
    `
    
    // Divergence shader
    const divergenceShaderSource = `
      precision mediump float;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      varying vec2 vUv;
      
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    
    // Pressure shader (Jacobi iteration)
    const pressureShaderSource = `
      precision mediump float;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      varying vec2 vUv;
      
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    
    // Gradient subtraction shader
    const gradientSubtractShaderSource = `
      precision mediump float;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      varying vec2 vUv;
      
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B) * 0.5;
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    
    // Curl shader
    const curlShaderSource = `
      precision mediump float;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `
    
    // Vorticity shader
    const vorticityShaderSource = `
      precision mediump float;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      uniform vec2 texelSize;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      varying vec2 vUv;
      
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    
    // Display shader with authentic thin film interference
    const displayShaderSource = `
      precision mediump float;
      uniform sampler2D uVelocity;
      uniform sampler2D uOilDensity;
      uniform sampler2D uWaterDensity;
      uniform sampler2D uPressure;
      uniform vec2 texelSize;
      uniform float time;
      uniform vec3 oilColor;
      uniform vec3 waterColor;
      uniform vec3 accentColor;
      uniform float filmThickness;
      uniform float colorIntensity;
      uniform float audioBass;
      uniform float audioMids;
      uniform float audioTreble;
      uniform float beatPulse;
      varying vec2 vUv;
      
      // Wavelength to RGB conversion (CIE color matching functions)
      vec3 wavelengthToRGB(float wavelength) {
        vec3 rgb;
        if (wavelength >= 380.0 && wavelength < 440.0) {
          rgb = vec3(-(wavelength - 440.0) / 60.0, 0.0, 1.0);
        } else if (wavelength >= 440.0 && wavelength < 490.0) {
          rgb = vec3(0.0, (wavelength - 440.0) / 50.0, 1.0);
        } else if (wavelength >= 490.0 && wavelength < 510.0) {
          rgb = vec3(0.0, 1.0, -(wavelength - 510.0) / 20.0);
        } else if (wavelength >= 510.0 && wavelength < 580.0) {
          rgb = vec3((wavelength - 510.0) / 70.0, 1.0, 0.0);
        } else if (wavelength >= 580.0 && wavelength < 645.0) {
          rgb = vec3(1.0, -(wavelength - 645.0) / 65.0, 0.0);
        } else if (wavelength >= 645.0 && wavelength <= 750.0) {
          rgb = vec3(1.0, 0.0, 0.0);
        } else {
          rgb = vec3(0.0);
        }
        
        // Intensity factor
        float factor;
        if (wavelength >= 380.0 && wavelength < 420.0) {
          factor = 0.3 + 0.7 * (wavelength - 380.0) / 40.0;
        } else if (wavelength >= 420.0 && wavelength <= 700.0) {
          factor = 1.0;
        } else if (wavelength > 700.0 && wavelength <= 750.0) {
          factor = 0.3 + 0.7 * (750.0 - wavelength) / 50.0;
        } else {
          factor = 0.0;
        }
        
        return rgb * factor;
      }
      
      // Thin film interference calculation (authentic physics)
      vec3 calculateInterference(float thickness, float angle) {
        float n1 = 1.0;    // Air
        float n2 = 1.40;   // Oil (mineral oil refractive index)
        float n3 = 1.33;   // Water
        
        // Path difference calculation
        float pathDiff = 2.0 * thickness * n2 * cos(angle);
        
        vec3 color = vec3(0.0);
        
        // Sample several wavelengths and combine (simplified RGB approximation)
        for (float wl = 400.0; wl <= 700.0; wl += 30.0) {
          float phase = 2.0 * 3.14159 * pathDiff / (wl * 1e-9);
          
          // Amplitude reflection coefficients (simplified)
          float r12 = (n1 - n2) / (n1 + n2);
          float r23 = (n2 - n3) / (n2 + n3);
          
          // Airy summation (interference formula)
          float reflectance = (r12 * r12 + r23 * r23 + 2.0 * r12 * r23 * cos(phase)) / 
                             (1.0 + r12 * r12 * r23 * r23 + 2.0 * r12 * r23 * cos(phase));
          
          color += wavelengthToRGB(wl) * reflectance;
        }
        
        return normalize(color) * length(color) * 0.1;
      }
      
      void main () {
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        float oilDensity = texture2D(uOilDensity, vUv).r;
        float waterDensity = texture2D(uWaterDensity, vUv).r;
        float pressure = texture2D(uPressure, vUv).r;
        
        // Audio-reactive thickness modulation
        float dynamicThickness = filmThickness * (1.0 + audioBass * 0.3);
        float turbulence = length(velocity) * (1.0 + audioMids * 0.5);
        float intensityMod = colorIntensity * (1.0 + audioTreble * 0.4);
        
        // Calculate viewing angle based on surface normal (from velocity field)
        float angle = atan(length(velocity), 1.0);
        
        // Thin film interference colors
        vec3 interferenceColor = calculateInterference(dynamicThickness, angle);
        
        // Base fluid colors (Grateful Dead palette)
        vec3 oilFluidColor = mix(oilColor, accentColor, turbulence * 0.5);
        vec3 waterFluidColor = mix(waterColor, oilColor * 0.3, waterDensity);
        
        // Layer blending based on density
        vec3 fluidColor = mix(waterFluidColor, oilFluidColor, oilDensity);
        
        // Add interference iridescence
        vec3 finalColor = mix(fluidColor, interferenceColor, dynamicThickness * 1e6);
        
        // Audio-reactive intensity and beat pulse
        finalColor *= intensityMod;
        finalColor *= (1.0 + beatPulse * 0.2);
        
        // Brightness and contrast (overhead projector characteristics)
        finalColor = pow(finalColor * 1.4, vec3(1.2));
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
    
    // Compile shaders
    this.programs.clear = this.createProgram(vertexShaderSource, clearShaderSource)
    this.programs.splat = this.createProgram(vertexShaderSource, splatShaderSource)
    this.programs.advection = this.createProgram(vertexShaderSource, advectionShaderSource)
    this.programs.divergence = this.createProgram(vertexShaderSource, divergenceShaderSource)
    this.programs.pressure = this.createProgram(vertexShaderSource, pressureShaderSource)
    this.programs.gradientSubtract = this.createProgram(vertexShaderSource, gradientSubtractShaderSource)
    this.programs.curl = this.createProgram(vertexShaderSource, curlShaderSource)
    this.programs.vorticity = this.createProgram(vertexShaderSource, vorticityShaderSource)
    this.programs.display = this.createProgram(vertexShaderSource, displayShaderSource)
  }
  
  private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const gl = this.gl
    
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource)
    
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + gl.getProgramInfoLog(program))
    }
    
    return program
  }
  
  private createShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader))
    }
    
    return shader
  }
  
  private initializeTextures() {
    // Initialize fluid simulation textures
    this.textures = {
      velocity: this.createDoubleTexture(this.simWidth, this.simHeight, this.gl.RG),
      pressure: this.createDoubleTexture(this.simWidth, this.simHeight, this.gl.RED),
      oilDensity: this.createDoubleTexture(this.simWidth, this.simHeight, this.gl.RED),
      waterDensity: this.createDoubleTexture(this.simWidth, this.simHeight, this.gl.RED),
      temperature: this.createDoubleTexture(this.simWidth, this.simHeight, this.gl.RED),
      curl: this.createTexture(this.simWidth, this.simHeight, this.gl.RED),
      bloom: this.createDoubleTexture(this.config.bloomResolution, this.config.bloomResolution, this.gl.RGBA)
    }
  }
  
  private createTexture(width: number, height: number, format: number): WebGLTexture {
    const gl = this.gl
    const texture = gl.createTexture()!
    
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.FLOAT, null)
    
    return texture
  }
  
  private createDoubleTexture(width: number, height: number, format: number): WebGLTexture[] {
    return [
      this.createTexture(width, height, format),
      this.createTexture(width, height, format)
    ]
  }
  
  private initializeFramebuffers() {
    // Create framebuffers for render targets
    this.framebuffers = {}
    // Implementation details...
  }
  
  // Update audio-reactive parameters from music analysis
  updateAudioReactiveParams(audioData: AudioData) {
    // Bass affects oil viscosity and density (like Jerry's guitar creating thick swirls)
    this.config.oilViscosity = 20.0 * (1 + audioData.bass * 0.5)
    this.config.oilDensity = 0.85 * (1 + audioData.bass * 0.3)
    
    // Mids control fluid velocity and turbulence (like Phil's bass lines driving flow)
    this.config.curl = 35.0 * (1 + audioData.mids * 0.6)
    this.config.pressure = 0.8 * (1 + audioData.mids * 0.4)
    
    // Treble affects surface tension and color intensity (like cymbal crashes creating sparkles)
    this.config.surfaceTension = 0.072 * (1 + audioData.treble * 0.3)
    this.config.colorIntensity = 1.0 * (1 + audioData.treble * 0.5)
    
    // Beat detection creates pressure pulses (like live manipulation with glass rods)
    this.config.beatPulse = audioData.beatDetected ? audioData.volume : 0
    
    // Store for shader uniforms
    this.config.audioBass = audioData.bass
    this.config.audioMids = audioData.mids
    this.config.audioTreble = audioData.treble
  }
  
  // Main simulation step
  step(deltaTime: number) {
    const gl = this.gl
    
    // Advect velocity field
    this.advect(this.textures.velocity, deltaTime * 0.98)
    
    // Apply vorticity confinement (creates natural swirling)
    this.curl(this.textures.velocity)
    this.vorticity(this.textures.velocity, deltaTime)
    
    // Advect oil and water densities
    this.advect(this.textures.oilDensity, deltaTime * 0.95)
    this.advect(this.textures.waterDensity, deltaTime * 0.92)
    
    // Solve pressure (make velocity field divergence-free)
    this.divergence(this.textures.velocity)
    this.solvePressure(deltaTime)
    this.gradientSubtract(this.textures.velocity)
    
    // Render final frame with thin film interference
    this.render()
  }
  
  private advect(textureArray: WebGLTexture[], dissipation: number) {
    const gl = this.gl
    const program = this.programs.advection
    
    gl.useProgram(program)
    gl.uniform1f(gl.getUniformLocation(program, 'dt'), 1.0 / 60.0)
    gl.uniform1f(gl.getUniformLocation(program, 'dissipation'), dissipation)
    gl.uniform2f(gl.getUniformLocation(program, 'texelSize'), 1.0 / this.simWidth, 1.0 / this.simHeight)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.velocity[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 0)
    
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureArray[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uSource'), 1)
    
    this.bindFramebuffer(textureArray[1])
    this.drawFullScreenQuad()
    
    // Swap textures
    this.swapTextures(textureArray)
  }
  
  private curl(velocityTexture: WebGLTexture[]) {
    const gl = this.gl
    const program = this.programs.curl
    
    gl.useProgram(program)
    gl.uniform2f(gl.getUniformLocation(program, 'texelSize'), 1.0 / this.simWidth, 1.0 / this.simHeight)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 0)
    
    this.bindFramebuffer(this.textures.curl)
    this.drawFullScreenQuad()
  }
  
  private vorticity(velocityTexture: WebGLTexture[], deltaTime: number) {
    const gl = this.gl
    const program = this.programs.vorticity
    
    gl.useProgram(program)
    gl.uniform1f(gl.getUniformLocation(program, 'curl'), this.config.curl)
    gl.uniform1f(gl.getUniformLocation(program, 'dt'), deltaTime)
    gl.uniform2f(gl.getUniformLocation(program, 'texelSize'), 1.0 / this.simWidth, 1.0 / this.simHeight)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 0)
    
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.curl)
    gl.uniform1i(gl.getUniformLocation(program, 'uCurl'), 1)
    
    this.bindFramebuffer(velocityTexture[1])
    this.drawFullScreenQuad()
    
    this.swapTextures(velocityTexture)
  }
  
  private divergence(velocityTexture: WebGLTexture[]) {
    const gl = this.gl
    const program = this.programs.divergence
    
    gl.useProgram(program)
    gl.uniform2f(gl.getUniformLocation(program, 'texelSize'), 1.0 / this.simWidth, 1.0 / this.simHeight)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 0)
    
    this.bindFramebuffer(this.textures.pressure[0])
    this.drawFullScreenQuad()
  }
  
  private solvePressure(deltaTime: number) {
    const gl = this.gl
    const program = this.programs.pressure
    
    gl.useProgram(program)
    
    for (let i = 0; i < this.config.iterations; i++) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.textures.pressure[0])
      gl.uniform1i(gl.getUniformLocation(program, 'uPressure'), 0)
      
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, this.textures.pressure[0])
      gl.uniform1i(gl.getUniformLocation(program, 'uDivergence'), 1)
      
      this.bindFramebuffer(this.textures.pressure[1])
      this.drawFullScreenQuad()
      
      this.swapTextures(this.textures.pressure)
    }
  }
  
  private gradientSubtract(velocityTexture: WebGLTexture[]) {
    const gl = this.gl
    const program = this.programs.gradientSubtract
    
    gl.useProgram(program)
    gl.uniform2f(gl.getUniformLocation(program, 'texelSize'), 1.0 / this.simWidth, 1.0 / this.simHeight)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.pressure[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uPressure'), 0)
    
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 1)
    
    this.bindFramebuffer(velocityTexture[1])
    this.drawFullScreenQuad()
    
    this.swapTextures(velocityTexture)
  }
  
  private render() {
    const gl = this.gl
    
    // Render to main canvas with authentic oil-water physics
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.width, this.height)
    
    const program = this.programs.display
    gl.useProgram(program)
    
    // Set uniforms for authentic rendering
    gl.uniform1f(gl.getUniformLocation(program, 'time'), Date.now() / 1000)
    gl.uniform3fv(gl.getUniformLocation(program, 'oilColor'), this.currentPalette.oil)
    gl.uniform3fv(gl.getUniformLocation(program, 'waterColor'), this.currentPalette.water)
    gl.uniform3fv(gl.getUniformLocation(program, 'accentColor'), this.currentPalette.accent)
    gl.uniform1f(gl.getUniformLocation(program, 'filmThickness'), this.config.filmThickness)
    gl.uniform1f(gl.getUniformLocation(program, 'colorIntensity'), this.config.colorIntensity)
    gl.uniform1f(gl.getUniformLocation(program, 'audioBass'), this.config.audioBass)
    gl.uniform1f(gl.getUniformLocation(program, 'audioMids'), this.config.audioMids)
    gl.uniform1f(gl.getUniformLocation(program, 'audioTreble'), this.config.audioTreble)
    gl.uniform1f(gl.getUniformLocation(program, 'beatPulse'), this.config.beatPulse)
    
    // Bind textures
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.velocity[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uVelocity'), 0)
    
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.oilDensity[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uOilDensity'), 1)
    
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.textures.waterDensity[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uWaterDensity'), 2)
    
    // Draw full-screen quad
    this.drawFullScreenQuad()
  }
  
  private drawFullScreenQuad() {
    const gl = this.gl
    
    // Create vertex buffer for full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  
  // Add splat (force/dye injection) - like dropping dye or stirring with glass rod
  splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    // Normalize coordinates
    const splatX = x / this.width
    const splatY = 1.0 - y / this.height
    
    // Add force to velocity field
    this.splatToTexture(this.textures.velocity, splatX, splatY, dx, dy, [dx, dy, 0])
    
    // Add dye to appropriate layer based on density
    if (color[0] > 0.5) {
      this.splatToTexture(this.textures.oilDensity, splatX, splatY, 0, 0, [color[0], 0, 0])
    } else {
      this.splatToTexture(this.textures.waterDensity, splatX, splatY, 0, 0, [color[2], 0, 0])
    }
  }
  
  private splatToTexture(textureArray: WebGLTexture[], x: number, y: number, dx: number, dy: number, color: number[]) {
    const gl = this.gl
    const program = this.programs.splat
    
    gl.useProgram(program)
    gl.uniform1f(gl.getUniformLocation(program, 'aspectRatio'), this.width / this.height)
    gl.uniform2f(gl.getUniformLocation(program, 'point'), x, y)
    gl.uniform3f(gl.getUniformLocation(program, 'color'), color[0], color[1], color[2])
    gl.uniform1f(gl.getUniformLocation(program, 'radius'), 0.02)
    gl.uniform1f(gl.getUniformLocation(program, 'strength'), 0.8)
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureArray[0])
    gl.uniform1i(gl.getUniformLocation(program, 'uTarget'), 0)
    
    this.bindFramebuffer(textureArray[1])
    this.drawFullScreenQuad()
    
    this.swapTextures(textureArray)
  }
  
  private bindFramebuffer(texture: WebGLTexture | null) {
    const gl = this.gl
    
    if (texture === null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, this.width, this.height)
    } else {
      // Create or reuse framebuffer
      if (!this.framebuffers[texture as any]) {
        this.framebuffers[texture as any] = gl.createFramebuffer()!
      }
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[texture as any])
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      gl.viewport(0, 0, this.simWidth, this.simHeight)
    }
  }
  
  private swapTextures(textureArray: WebGLTexture[]) {
    const temp = textureArray[0]
    textureArray[0] = textureArray[1]
    textureArray[1] = temp
  }
  
  // Start simulation loop
  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.lastTime = performance.now()
    
    const loop = (currentTime: number) => {
      if (!this.isRunning) return
      
      const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016) // Cap at 60fps
      this.lastTime = currentTime
      
      this.step(deltaTime)
      
      this.animationFrame = requestAnimationFrame(loop)
    }
    
    this.animationFrame = requestAnimationFrame(loop)
  }
  
  // Stop simulation
  stop() {
    this.isRunning = false
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }
  
  // Change color palette (Dark Star, Fire on the Mountain, China Cat Sunflower)
  setPalette(paletteName: keyof typeof this.colorPalettes) {
    this.currentPalette = this.colorPalettes[paletteName]
  }
  
  // Cleanup resources
  dispose() {
    this.stop()
    
    const gl = this.gl
    
    // Clean up WebGL resources
    Object.values(this.programs).forEach(program => gl.deleteProgram(program))
    Object.values(this.framebuffers).forEach(fb => gl.deleteFramebuffer(fb))
    
    // Clean up textures
    Object.values(this.textures).forEach(textureArray => {
      if (Array.isArray(textureArray)) {
        textureArray.forEach(texture => gl.deleteTexture(texture))
      } else {
        gl.deleteTexture(textureArray)
      }
    })
    
    // Lose WebGL context
    const loseContext = gl.getExtension('WEBGL_lose_context')
    if (loseContext) {
      loseContext.loseContext()
    }
  }
}

export default FluidEngine