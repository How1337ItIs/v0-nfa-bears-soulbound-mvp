# V0 Liquid Light Engine Reference Guide
*Complete technical and cultural reference for authentic Joshua Light Show recreation*

## Historical Context & Cultural Authenticity

### 1960s Joshua Light Show Techniques
- **Venue**: Fillmore East, Avalon Ballroom, other psychedelic venues
- **Equipment**: Overhead projectors with glass clock faces or petri dishes
- **Materials**: Mineral oil (viscosity ~20x water), water, food coloring, candle dyes
- **Physics**: Oil-water density differences (oil: 0.8g/cm³, water: 1.0g/cm³)
- **Manipulation**: Live performance with glass rods, droppers, heat sources
- **Visual Result**: Never-repeating organic patterns, liquid response to music

### Grateful Dead Specific Visual Culture
**Song-Based Color Palettes** (from internal research):
- **Dark Star**: Deep indigo (#1E0A3C) → royal purple (#4C0B7A) → mysterious depth
- **Fire on the Mountain**: Electric gold (#FFD700) → orange fire (#FF4500) → building intensity  
- **Terrapin Station**: Jade green (#00FF80) → cyan (#00FFFF) → flowing water themes
- **Scarlet Begonias**: Scarlet red (#FF2500) → magenta (#FF0080) → vibrant blooming

**Cultural Values**:
- Anti-corporate aesthetic (organic, not geometric)
- Spiritual consciousness expansion themes
- Community-driven, authentic experience
- Rejection of predictable, "canned" visuals

## Technical Physics Reference

### Thin-Film Interference Mathematics
```javascript
// Authentic wavelength-to-RGB conversion
function wavelengthToRGB(wavelength) {
  // Visible spectrum: 380-750nm
  let r = 0, g = 0, b = 0;
  
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1.0;
  }
  
  // Intensity falloff at spectrum edges
  let factor = 1.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 700 && wavelength <= 750) {
    factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
  }
  
  return [r * factor * 255, g * factor * 255, b * factor * 255];
}

// Oil film interference calculation
function calculateInterference(filmThickness, viewingAngle, time) {
  const n_oil = 1.5;    // Refractive index of mineral oil
  const n_water = 1.33; // Refractive index of water
  
  // Optical path difference (authentic physics)
  const opticalPath = 2 * n_oil * filmThickness * Math.cos(viewingAngle);
  
  // Dynamic thickness with temporal variation
  const dynamicThickness = filmThickness + 50 * Math.sin(time * 0.001) * Math.cos(time * 0.0007);
  
  // Constructive interference wavelengths
  const wavelengths = [];
  for (let m = 1; m <= 3; m++) {
    const wavelength = (2 * opticalPath) / m;
    if (wavelength >= 380 && wavelength <= 750) {
      wavelengths.push(wavelength);
    }
  }
  
  return wavelengths.map(w => wavelengthToRGB(w));
}
```

### Fluid Dynamics Simplified (For WebGL Implementation)
```glsl
// GLSL Fragment Shader Reference
// Navier-Stokes simplified for real-time performance

// Velocity field calculation
vec2 calculateVelocity(vec2 position, float time) {
    // Perlin noise for organic movement
    float noiseScale = 0.01;
    float timeScale = 0.1;
    
    float noise1 = snoise(vec3(position * noiseScale, time * timeScale));
    float noise2 = snoise(vec3(position * noiseScale + 100.0, time * timeScale));
    
    return vec2(noise1, noise2) * 0.5;
}

// Oil droplet physics
float oilDropletBehavior(vec2 pos, vec2 center, float radius, float viscosity) {
    float dist = distance(pos, center);
    float droplet = smoothstep(radius + 0.1, radius - 0.1, dist);
    
    // Surface tension effects
    float tension = exp(-dist * dist / (radius * radius));
    
    return droplet * tension * (1.0 / viscosity);
}

// Color interference pattern
vec3 interferenceColor(float thickness, vec2 uv, float time) {
    // Wavelength shifts based on thickness
    float hue = mod(thickness * 10.0 + time * 0.1, 1.0);
    float sat = 0.8 + 0.2 * sin(thickness * 5.0);
    float val = 0.6 + 0.4 * cos(thickness * 3.0 + time * 0.05);
    
    return hsv2rgb(vec3(hue, sat, val));
}
```

## Audio-Reactive Mapping (From Research)

### Frequency Response Mapping
```javascript
const audioReactiveMapping = {
  bass: {
    frequency: '20-250Hz',
    visualEffect: 'Oil viscosity and droplet size',
    implementation: 'Scale droplet radius and movement speed',
    formula: 'viscosity = 0.02 + (1 - bassLevel) * 0.08'
  },
  
  mids: {
    frequency: '250-4000Hz', 
    visualEffect: 'Flow velocity and movement patterns',
    implementation: 'Control particle movement speed',
    formula: 'flowVelocity = 0.5 + midsLevel * 1.5'
  },
  
  treble: {
    frequency: '4000-20000Hz',
    visualEffect: 'Color iridescence and brightness',
    implementation: 'Affect color intensity and hue rotation', 
    formula: 'colorIntensity = 0.3 + trebleLevel * 0.7'
  },
  
  beatDetection: {
    trigger: 'Onset detection algorithm',
    visualEffect: 'New droplet spawning and pulse effects',
    implementation: 'Spawn particles at beat moments',
    formula: 'if (beatDetected) spawnDroplet(randomPosition())'
  }
};

// Musical context awareness
const musicalContextMapping = {
  jam: {
    characteristics: 'Long, flowing movements',
    colorProgression: 'Slow hue shifts',
    particleCount: 'Higher count, organic clustering'
  },
  ballad: {
    characteristics: 'Gentle, minimal movement', 
    colorProgression: 'Stable, warm colors',
    particleCount: 'Lower count, soft interactions'
  },
  rock: {
    characteristics: 'Sharp, energetic bursts',
    colorProgression: 'Rapid color changes',
    particleCount: 'Medium count, collision effects'
  },
  space: {
    characteristics: 'Mysterious, deep movement',
    colorProgression: 'Deep purples and blues',
    particleCount: 'Sparse, slow-moving particles'
  }
};
```

## Performance Requirements & Optimization

### Target Performance Metrics
```javascript
const performanceTargets = {
  desktop: {
    frameRate: '60fps',
    particleCount: '50-100 particles',
    shaderComplexity: 'Full fluid simulation',
    textureResolution: '1024x1024'
  },
  
  mobile: {
    frameRate: '30fps', 
    particleCount: '20-40 particles',
    shaderComplexity: 'Simplified noise functions',
    textureResolution: '512x512'
  },
  
  lowEnd: {
    frameRate: '15fps minimum',
    particleCount: '10-20 particles', 
    shaderComplexity: 'CSS fallback',
    textureResolution: '256x256'
  }
};

// GPU Memory Management
const memoryOptimization = {
  texturePooling: 'Reuse render targets',
  shaderCompilation: 'Cache compiled shaders',
  geometryBuffers: 'Static geometry, dynamic attributes',
  drawCalls: 'Instanced rendering for particles'
};
```

### Device Detection & Adaptation
```javascript
const deviceCapabilities = {
  detectWebGL2: () => !!document.createElement('canvas').getContext('webgl2'),
  detectFloatTextures: () => /* WebGL extension check */,
  estimateGPUTier: () => /* Based on renderer info */,
  
  adaptiveQuality: {
    high: 'Full shader complexity, all effects',
    medium: 'Reduced particles, simplified shaders', 
    low: 'Minimal effects, CSS fallback',
    accessibility: 'Static gradient, no animation'
  }
};
```

## React Three Fiber Implementation Patterns

### Component Architecture Reference
```tsx
// Recommended component structure
interface LiquidLightEngineProps {
  audioData?: {
    volume: number;        // 0-1
    bass: number;         // 0-1  
    mids: number;         // 0-1
    treble: number;       // 0-1
    beatDetected: boolean;
    tempo: number;        // BPM
  };
  songMode?: 'darkStar' | 'fireOnTheMountain' | 'terraPinStation' | 'scarletBegonias';
  intensity?: number;     // 0-1, overall effect strength
  interactive?: boolean;  // Enable mouse/touch interaction
  performanceMode?: 'high' | 'medium' | 'low';
  className?: string;
}

// Three.js Scene Structure
const sceneHierarchy = {
  Scene: {
    Camera: 'OrthographicCamera for 2D projection feel',
    Lighting: [
      'AmbientLight for base illumination',
      'SpotLight array simulating projector bulbs'
    ],
    FluidSimulation: {
      Background: 'Dark venue environment',
      ParticleSystem: 'Oil droplets with physics',
      InterferenceLayer: 'Color overlay effects',
      PostProcessing: 'Glow and bloom effects'
    }
  }
};
```

### Shader Material Patterns
```javascript
// Custom shader material structure
const liquidLightMaterial = {
  uniforms: {
    uTime: { value: 0.0 },
    uAudioData: { value: [0, 0, 0, 0] }, // [volume, bass, mids, treble]
    uBeatDetected: { value: false },
    uSongMode: { value: 0 }, // 0-3 for different modes
    uPerformanceMode: { value: 1 }, // 0-2 for quality levels
    uResolution: { value: [window.innerWidth, window.innerHeight] },
    uMousePosition: { value: [0, 0] }
  },
  
  vertexShader: `
    // Transform vertices, pass UV coordinates
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    // Main liquid light simulation logic here
    // Include noise functions, color calculations, physics simulation
  `
};
```

## Visual Design Specifications

### Authentic Color Palettes (HSL Values)
```javascript
const authenticPalettes = {
  darkStar: [
    { h: 280, s: 95, l: 15 }, // Deep indigo purple
    { h: 260, s: 88, l: 25 }, // Royal purple  
    { h: 240, s: 82, l: 35 }, // Electric blue
    { h: 220, s: 75, l: 45 }  // Lighter blue
  ],
  
  fireOnTheMountain: [
    { h: 60, s: 95, l: 50 },  // Electric gold
    { h: 30, s: 92, l: 45 },  // Orange fire
    { h: 15, s: 95, l: 40 },  // Red-orange
    { h: 0, s: 90, l: 35 }    // Deep red
  ],
  
  terraPinStation: [
    { h: 180, s: 85, l: 40 }, // Turquoise
    { h: 150, s: 80, l: 35 }, // Jade green
    { h: 120, s: 85, l: 30 }, // Forest green
    { h: 200, s: 90, l: 45 }  // Cyan
  ],
  
  scarletBegonias: [
    { h: 15, s: 95, l: 40 },  // Scarlet red
    { h: 340, s: 90, l: 35 }, // Magenta
    { h: 320, s: 85, l: 45 }, // Pink-red
    { h: 300, s: 88, l: 40 }  // Purple-pink
  ]
};

// Color transition functions
const colorBlending = {
  smoothHSLTransition: 'Use spherical interpolation in HSL space',
  wavelengthMapping: 'Map interference to authentic spectrum colors',
  dynamicSaturation: 'Vary saturation with audio intensity',
  temporalShifting: 'Slow color evolution over time'
};
```

### Movement Characteristics
```javascript
const movementPatterns = {
  oilOnWater: {
    speed: 'Very slow, hypnotic (20-45 second cycles)',
    pattern: 'Organic, never-repeating',
    physics: 'Surface tension, density differences, viscosity',
    interaction: 'Droplets merge and separate naturally'
  },
  
  audioResponse: {
    bass: 'Affects overall movement amplitude',
    mids: 'Controls directional flow patterns', 
    treble: 'Influences micro-movements and details',
    beat: 'Triggers discrete events (new droplets, pulses)'
  },
  
  spatialBehavior: {
    edges: 'Soft reflection, no hard boundaries',
    center: 'Gravitational attraction point',
    flow: 'Follows noise field gradients',
    clustering: 'Particles naturally group and separate'
  }
};
```

## Accessibility & User Experience

### Accessibility Requirements
```javascript
const accessibilityFeatures = {
  reducedMotion: {
    detection: '@media (prefers-reduced-motion: reduce)',
    fallback: 'Static gradient with subtle opacity changes',
    userControl: 'Manual intensity slider'
  },
  
  photosensitive: {
    flashing: 'No flashing >3Hz (seizure prevention)', 
    brightness: 'Limit peak brightness levels',
    contrast: 'Ensure sufficient contrast for UI elements'
  },
  
  screenReader: {
    description: 'Provide audio description of visual experience',
    controls: 'Keyboard-accessible intensity controls',
    context: 'Cultural and historical context available'
  }
};
```

### Performance Monitoring
```javascript
const performanceMonitoring = {
  fpsTracking: 'Monitor frame rate and adapt quality',
  memoryUsage: 'Track GPU memory and texture usage',
  batteryImpact: 'Reduce complexity on mobile devices',
  thermalThrottling: 'Detect and respond to device heating'
};
```

## Implementation Priority Order

1. **Core Fluid Physics**: Basic particle system with realistic movement
2. **Color Interference**: Authentic thin-film color generation
3. **Audio Reactivity**: Real-time response to music parameters
4. **Cultural Authenticity**: Song modes and Grateful Dead aesthetics  
5. **Performance Optimization**: Device-appropriate quality scaling
6. **Accessibility Features**: Reduced motion and user controls
7. **Interactive Elements**: Mouse/touch fluid manipulation
8. **Advanced Effects**: Post-processing, glow, advanced shaders

## Cultural Context Notes

- **Anti-Commercial Aesthetic**: Avoid corporate, geometric, or "digital" looking patterns
- **Spiritual Dimension**: Visuals should enhance consciousness expansion experience
- **Community Values**: Authentic to Deadhead culture, not generic "trippy" effects
- **Historical Accuracy**: Based on real 1960s techniques, not modern interpretations
- **Musical Connection**: Visuals should feel connected to the music, not just decorative

This reference provides the complete technical and cultural foundation for creating an authentic liquid light show engine that honors both the scientific accuracy and cultural significance of the original 1960s experience.