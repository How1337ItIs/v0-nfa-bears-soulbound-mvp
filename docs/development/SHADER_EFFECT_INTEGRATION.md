# Shader Effect Integration Guide

## Overview

This guide provides comprehensive instructions for integrating new shader effects into the Liquid Light System. It covers the complete process from creating a new effect to integrating it into the production system.

## Table of Contents

1. [Adding a New Effect](#adding-a-new-effect)
2. [Integration Checklist](#integration-checklist)
3. [Effect Architecture](#effect-architecture)
4. [Performance Considerations](#performance-considerations)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Requirements](#documentation-requirements)
7. [Example Implementation](#example-implementation)

## Adding a New Effect

### Step 1: Create Effect File

Create a new file in `lib/post/` following the naming convention `YourEffectPass.tsx`:

```typescript
// lib/post/YourEffectPass.tsx
'use client';

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Your effect shader
const yourEffectShader = `
  uniform float uIntensity;
  uniform float uTime;
  // Add other uniforms as needed
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Your shader logic here
    outputColor = inputColor;
  }
`;

class YourEffect extends Effect {
  constructor() {
    super('YourEffect', yourEffectShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uIntensity', new THREE.Uniform(0.5)],
        ['uTime', new THREE.Uniform(0)],
        // Add other uniforms
      ])
    });
  }
}

extend({ YourEffect });

interface YourEffectPassProps {
  intensity?: number;
  enabled?: boolean;
  // Add other props
}

export function YourEffectPass({
  intensity = 0.5,
  enabled = true
}: YourEffectPassProps) {
  const effectRef = useRef<YourEffect>();
  
  const effect = useMemo(() => {
    const yourEffect = new YourEffect();
    effectRef.current = yourEffect;
    return yourEffect;
  }, []);
  
  useFrame((state) => {
    if (!effectRef.current) return;
    
    const uniforms = effectRef.current.uniforms;
    uniforms.get('uIntensity')!.value = intensity;
    uniforms.get('uTime')!.value = state.clock.elapsedTime;
  });
  
  return enabled ? <primitive object={effect} /> : null;
}
```

### Step 2: Add to ShaderPreset Interface

Update `components/liquid-light/ShaderPresets.tsx`:

```typescript
export interface ShaderPreset {
  thinFilm: boolean;
  shimmer: boolean;
  flowField: boolean;
  chromatic: boolean;
  kaleidoscope: boolean;
  vignette: boolean;
  yourEffect: boolean; // Add your effect
}
```

### Step 3: Update Preset Configurations

Add your effect to the preset configurations:

```typescript
export const SHADER_PRESETS: Record<string, ShaderPresetConfig> = {
  minimal: {
    // ... existing config
    yourEffect: false, // Add to each preset
  },
  classic: {
    // ... existing config
    yourEffect: true, // Enable where appropriate
  },
  // ... other presets
};
```

### Step 4: Integrate into ComprehensiveEffectComposer

Update `lib/post/ComprehensiveEffectComposer.tsx`:

```typescript
import { YourEffectPass } from './YourEffectPass';

export function ComprehensiveEffectComposer({
  effects,
  // ... other props
}: ComprehensiveEffectComposerProps) {
  return (
    <EffectComposer>
      {/* ... existing effects */}
      
      {/* Add your effect in appropriate position */}
      {effects.yourEffect && (
        <YourEffectPass
          intensity={0.5}
          enabled={true}
        />
      )}
    </EffectComposer>
  );
}
```

### Step 5: Add to Effect Toggles UI

Update `components/liquid-light/controls/EffectToggles.tsx`:

```typescript
const effectConfigs = [
  // ... existing effects
  {
    key: 'yourEffect' as keyof ShaderPreset,
    label: 'Your Effect',
    description: 'Description of your effect',
    icon: '🎨',
    performance: 'medium',
    deviceTier: 'medium' as const,
    enabled: true
  }
];
```

## Integration Checklist

### ✅ Effect Development
- [ ] Effect extends R3F Effect class
- [ ] Shader uniforms documented
- [ ] Performance benchmarked
- [ ] Memory usage measured
- [ ] Audio reactivity implemented (if applicable)
- [ ] Palette integration implemented (if applicable)

### ✅ Testing
- [ ] Unit tests created
- [ ] Integration tests created
- [ ] Performance tests created
- [ ] Memory leak tests created
- [ ] Visual regression tests created
- [ ] Cross-browser tests created

### ✅ Integration
- [ ] Added to ComprehensiveEffectComposer
- [ ] Added to ShaderPreset interface
- [ ] Added to preset configurations
- [ ] Added to effect toggles UI
- [ ] Added to performance benchmark
- [ ] Added to documentation

### ✅ Quality Assurance
- [ ] ESLint rules pass
- [ ] TypeScript compilation passes
- [ ] Performance within acceptable limits
- [ ] Memory usage within acceptable limits
- [ ] Visual quality meets standards
- [ ] Accessibility considerations addressed

## Effect Architecture

### Core Components

1. **Effect Class**: Extends `@react-three/postprocessing/Effect`
2. **React Component**: Wraps the effect for React integration
3. **Shader Code**: GLSL fragment shader for the effect
4. **Uniforms**: Shader uniforms for dynamic parameters
5. **Props Interface**: TypeScript interface for component props

### Shader Structure

```glsl
// Standard shader structure
uniform float uTime;           // Time uniform
uniform float uIntensity;      // Effect intensity
uniform vec2 uResolution;      // Screen resolution
uniform sampler2D inputBuffer; // Input texture (automatic)

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Your effect logic here
  outputColor = inputColor;
}
```

### Performance Guidelines

1. **GPU Time**: Target <5ms for medium tier devices
2. **Memory Usage**: Target <10MB per effect
3. **Uniform Count**: Minimize uniform count for performance
4. **Texture Usage**: Use texture atlases when possible
5. **Branching**: Minimize branching in fragment shaders

## Performance Considerations

### Optimization Techniques

1. **Shader Optimization**
   - Use `lowp` precision where possible
   - Minimize texture lookups
   - Avoid branching in inner loops
   - Use built-in functions when available

2. **Memory Management**
   - Dispose of unused resources
   - Use object pooling for frequently created objects
   - Implement proper cleanup in useEffect

3. **Rendering Optimization**
   - Use appropriate blend functions
   - Minimize draw calls
   - Use instancing for repeated elements

### Performance Targets

| Device Tier | Max GPU Time | Max Memory | Max Uniforms |
|-------------|--------------|------------|--------------|
| Low | 2ms | 5MB | 5 |
| Medium | 5ms | 10MB | 8 |
| High | 10ms | 20MB | 12 |
| Ultra | 20ms | 40MB | 16 |

## Testing Requirements

### Unit Tests

```typescript
// __tests__/lib/post/YourEffectPass.test.tsx
describe('YourEffectPass', () => {
  test('renders when enabled', () => {
    render(<YourEffectPass enabled={true} />);
    expect(screen.getByTestId('your-effect')).toBeInTheDocument();
  });
  
  test('does not render when disabled', () => {
    render(<YourEffectPass enabled={false} />);
    expect(screen.queryByTestId('your-effect')).not.toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/yourEffect.test.tsx
describe('Your Effect Integration', () => {
  test('integrates with ComprehensiveEffectComposer', () => {
    const effects = { yourEffect: true };
    render(<ComprehensiveEffectComposer effects={effects} />);
    expect(screen.getByTestId('your-effect')).toBeInTheDocument();
  });
});
```

### Performance Tests

```typescript
// __tests__/performance/yourEffectPerformance.test.ts
describe('Your Effect Performance', () => {
  test('meets performance targets', async () => {
    const startTime = performance.now();
    render(<YourEffectPass />);
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## Documentation Requirements

### Code Documentation

1. **File Header**: Include purpose, performance characteristics, and usage
2. **Function Documentation**: JSDoc comments for all public functions
3. **Uniform Documentation**: Document all shader uniforms
4. **Props Documentation**: Document all component props

### User Documentation

1. **Effect Description**: Clear description of what the effect does
2. **Performance Impact**: GPU time and memory usage
3. **Device Compatibility**: Which device tiers support the effect
4. **Usage Examples**: Code examples showing how to use the effect

### API Documentation

1. **Component Props**: Complete prop interface documentation
2. **Shader Uniforms**: All shader uniform descriptions
3. **Performance Metrics**: Benchmark results
4. **Integration Examples**: How to integrate with other effects

## Example Implementation

### Complete Example: Glow Effect

```typescript
// lib/post/GlowPass.tsx
'use client';

import React, { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Effect } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const glowShader = `
  uniform float uIntensity;
  uniform float uRadius;
  uniform vec3 uColor;
  uniform float uTime;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 original = inputColor;
    
    // Simple glow effect
    float glow = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime);
    glow = smoothstep(0.0, 1.0, glow);
    
    vec3 glowColor = uColor * glow * uIntensity;
    vec3 finalColor = original.rgb + glowColor;
    
    outputColor = vec4(finalColor, original.a);
  }
`;

class GlowEffect extends Effect {
  constructor() {
    super('GlowEffect', glowShader, {
      blendFunction: BlendFunction.ADD,
      uniforms: new Map([
        ['uIntensity', new THREE.Uniform(0.5)],
        ['uRadius', new THREE.Uniform(0.1)],
        ['uColor', new THREE.Uniform(new THREE.Color(1, 1, 1))],
        ['uTime', new THREE.Uniform(0)],
      ])
    });
  }
}

extend({ GlowEffect });

interface GlowPassProps {
  intensity?: number;
  radius?: number;
  color?: [number, number, number];
  enabled?: boolean;
}

export function GlowPass({
  intensity = 0.5,
  radius = 0.1,
  color = [1, 1, 1],
  enabled = true
}: GlowPassProps) {
  const effectRef = useRef<GlowEffect>();
  
  const effect = useMemo(() => {
    const glowEffect = new GlowEffect();
    effectRef.current = glowEffect;
    return glowEffect;
  }, []);
  
  useFrame((state) => {
    if (!effectRef.current) return;
    
    const uniforms = effectRef.current.uniforms;
    uniforms.get('uIntensity')!.value = intensity;
    uniforms.get('uRadius')!.value = radius;
    uniforms.get('uColor')!.value = new THREE.Color(color[0], color[1], color[2]);
    uniforms.get('uTime')!.value = state.clock.elapsedTime;
  });
  
  return enabled ? <primitive object={effect} /> : null;
}
```

## Conclusion

Following this guide ensures that new shader effects are properly integrated into the Liquid Light System with optimal performance, comprehensive testing, and complete documentation. Always prioritize performance and user experience when implementing new effects.

For questions or assistance, refer to the [Troubleshooting Guide](../troubleshooting/TroubleshootingGuide.md) or [Performance Optimization Guide](../performance/PerformanceOptimizationGuide.md).
