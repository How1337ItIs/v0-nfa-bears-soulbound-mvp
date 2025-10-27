# Three.js Liquid Light Enhancement Plan
*Building on Working Foundation with Research-Based Improvements*

## Current State Analysis ✅

**Working Foundation:**
- ✅ Continuous flowing motion without discrete flashes
- ✅ Vibrant multi-color patterns (blue, green, red)
- ✅ Smooth time-based animation
- ✅ No performance issues or black screens
- ✅ Good visual contrast and readability

**Enhancement Opportunities:**
- 🔧 More organic, natural fluid patterns
- 🔧 Deeper visual complexity and layering
- 🔧 Physics-based thermal convection behavior
- 🔧 Authentic thin-film interference colors

## Research-Based Enhancement Strategy

### Phase 1: Advanced Noise Implementation (Week 1)

Based on Three.js best practices research, implement **Fractal Brownian Motion (FBM)** for organic patterns:

```glsl
// Enhanced noise functions
float hash(float n) {
    return fract(sin(n) * 1e4);
}

float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + 1.0 + i.y * 57.0);
    float c = hash(i.x + (i.y + 1.0) * 57.0);
    float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// FBM with multiple octaves for organic complexity
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(frequency * p);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Turbulence for thermal convection patterns
float turbulence(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 4; i++) {
        value += amplitude * abs(noise(frequency * p));
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
```

### Phase 2: Multi-Pass FBO Rendering (Week 2)

Implement **Frame Buffer Objects** for velocity and temperature fields:

```typescript
// Enhanced ThermalLiquidLight with multi-pass rendering
export function EnhancedThermalLiquidLight() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, gl } = useThree();

  // Create render targets for multi-pass simulation
  const velocityTarget = useFBO(512, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  const temperatureTarget = useFBO(512, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  // Shader materials for each pass
  const velocityMaterial = useShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uVelocityTexture: { value: velocityTarget.texture },
      uTemperatureTexture: { value: temperatureTarget.texture },
      uDeltaTime: { value: 0.016 }
    },
    vertexShader: velocityVertexShader,
    fragmentShader: velocityFragmentShader
  });

  const temperatureMaterial = useShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uVelocityTexture: { value: velocityTarget.texture },
      uTemperatureTexture: { value: temperatureTarget.texture },
      uThermalGradient: { value: 0.8 }
    },
    vertexShader: temperatureVertexShader,
    fragmentShader: temperatureFragmentShader
  });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pass 1: Update velocity field
    gl.setRenderTarget(velocityTarget);
    // Render velocity update

    // Pass 2: Update temperature field
    gl.setRenderTarget(temperatureTarget);
    // Render temperature update

    // Final pass: Render to screen with combined data
    gl.setRenderTarget(null);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uVelocityTexture: { value: velocityTarget.texture },
          uTemperatureTexture: { value: temperatureTarget.texture }
        }}
        vertexShader={finalVertexShader}
        fragmentShader={finalFragmentShader}
      />
    </mesh>
  );
}
```

### Phase 3: Authentic Thermal Convection (Week 3)

Add **physics-based thermal behavior** with directional flow:

```glsl
// Thermal convection fragment shader
vec2 getThermalVelocity(vec2 uv, float time) {
    // Base thermal gradient (hot bottom, cool top)
    float temperatureGradient = 1.0 - uv.y;

    // Add thermal noise for convection cells
    float thermalNoise = fbm(uv * 8.0 + time * 0.1);
    float temperature = temperatureGradient + thermalNoise * 0.3;

    // Buoyancy force (hot rises, cool sinks)
    vec2 buoyancy = vec2(0.0, temperature - 0.5) * 0.2;

    // Horizontal circulation from convection cells
    float cellPattern = sin(uv.x * 12.0 + time * 0.2) * cos(uv.y * 8.0);
    vec2 circulation = vec2(cellPattern * 0.1, 0.0);

    return buoyancy + circulation;
}

// Domain warping for organic flow patterns
vec2 domainWarp(vec2 uv, float time) {
    vec2 q = vec2(fbm(uv + time * 0.1),
                  fbm(uv + vec2(5.2, 1.3) + time * 0.08));

    vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + time * 0.06),
                  fbm(uv + 4.0 * q + vec2(8.3, 2.8) + time * 0.05));

    return fbm(uv + 4.0 * r) * vec2(1.0);
}
```

### Phase 4: Enhanced Color System (Week 4)

Implement **authentic thin-film interference** colors:

```glsl
// Wavelength to RGB conversion (research-based)
vec3 wavelengthToRGB(float wavelength) {
    vec3 color = vec3(0.0);
    wavelength = clamp(wavelength, 380.0, 750.0);

    if (wavelength >= 380.0 && wavelength < 440.0) {
        float attenuation = 0.3 + 0.7 * (wavelength - 380.0) / (440.0 - 380.0);
        color.r = pow((-(wavelength - 440.0) / (440.0 - 380.0)) * attenuation, 0.8);
        color.b = pow(1.0 * attenuation, 0.8);
    } else if (wavelength >= 440.0 && wavelength < 490.0) {
        color.g = pow((wavelength - 440.0) / (490.0 - 440.0), 0.8);
        color.b = 1.0;
    } else if (wavelength >= 490.0 && wavelength < 510.0) {
        color.g = 1.0;
        color.b = pow(-(wavelength - 510.0) / (510.0 - 490.0), 0.8);
    } else if (wavelength >= 510.0 && wavelength < 580.0) {
        color.r = pow((wavelength - 510.0) / (580.0 - 510.0), 0.8);
        color.g = 1.0;
    } else if (wavelength >= 580.0 && wavelength < 645.0) {
        color.r = 1.0;
        color.g = pow(-(wavelength - 645.0) / (645.0 - 580.0), 0.8);
    } else if (wavelength >= 645.0 && wavelength <= 750.0) {
        float attenuation = 0.3 + 0.7 * (750.0 - wavelength) / (750.0 - 645.0);
        color.r = pow(1.0 * attenuation, 0.8);
    }

    return color;
}

// Thin-film interference calculation
vec3 calculateInterference(float filmThickness, vec2 uv, float time) {
    // Viewing angle varies across surface
    float viewAngle = length(uv - vec2(0.5)) * 0.5;

    // Optical path difference (oil film on water)
    float oilRefractiveIndex = 1.40;
    float pathDiff = 2.0 * oilRefractiveIndex * filmThickness * cos(viewAngle);

    // Add phase shift for air-oil interface
    pathDiff += 0.5 * 550e-9; // Half wavelength at 550nm

    // Calculate dominant wavelength
    float wavelength = pathDiff * 1e9; // Convert to nanometers
    wavelength = mod(wavelength, 370.0) + 380.0; // Keep in visible range

    return wavelengthToRGB(wavelength);
}
```

## Performance Optimization Strategy

### 1. Device-Adaptive Quality
```typescript
const useAdaptiveQuality = () => {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
      setQuality('low');
      return;
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent);

    if (maxTextureSize >= 4096 && !isMobile) {
      setQuality('high');   // FBO: 512x512, 6 FBM octaves
    } else if (maxTextureSize >= 2048) {
      setQuality('medium'); // FBO: 256x256, 4 FBM octaves
    } else {
      setQuality('low');    // Single pass, 2 FBM octaves
    }
  }, []);

  return quality;
};
```

### 2. FPS Monitoring
```typescript
const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);

  useFrame((state, delta) => {
    const currentFps = 1 / delta;
    setFps(Math.round(currentFps));

    // Auto-degrade quality if FPS drops
    if (currentFps < 25) {
      // Reduce quality level
    }
  });

  return fps;
};
```

## Implementation Timeline

### Week 1: Advanced Noise Foundation
- [ ] Replace basic trigonometric functions with FBM
- [ ] Add turbulence function for thermal patterns
- [ ] Implement domain warping for organic flow
- [ ] Test performance impact and optimize

### Week 2: Multi-Pass Architecture
- [ ] Implement FBO render targets for velocity/temperature
- [ ] Create separate shader passes for physics simulation
- [ ] Add proper texture ping-ponging for temporal coherence
- [ ] Verify multi-pass performance on target devices

### Week 3: Thermal Physics Enhancement
- [ ] Add authentic buoyancy forces (hot rises, cool sinks)
- [ ] Implement convection cell patterns
- [ ] Add temperature gradient from bottom to top
- [ ] Fine-tune thermal behavior parameters

### Week 4: Color Authenticity & Polish
- [ ] Implement physics-based wavelength-to-RGB conversion
- [ ] Add thin-film interference calculations
- [ ] Enhance color transitions and blending
- [ ] Final performance optimization and polish

## Success Metrics

### Visual Quality
- [ ] More organic, less geometric patterns
- [ ] Authentic thermal convection behavior (hot rises, cool sinks)
- [ ] Physics-based color relationships
- [ ] Increased visual depth and complexity

### Performance
- [ ] Maintain 60fps on desktop, 30fps on mobile
- [ ] Graceful degradation on lower-end devices
- [ ] Memory usage under 100MB
- [ ] Startup time under 2 seconds

### Technical Robustness
- [ ] No visual artifacts or discontinuities
- [ ] Proper cleanup and resource management
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

This plan builds on our working foundation while incorporating the best Three.js practices from research to create a more authentic, performant, and visually compelling liquid light simulation.