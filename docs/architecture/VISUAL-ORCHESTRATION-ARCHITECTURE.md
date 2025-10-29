# Visual Orchestration Architecture

## Overview

The Visual Orchestration system is the central coordination layer for all visual effects in the liquid light application. It manages multiple visual layers, handles performance optimization, and provides a unified interface for controlling the entire visual experience.

## Architecture Components

### 1. VisualPolicy Module

**Purpose**: Centralized policy management for visual orchestration

**Key Features**:
- Device capability detection and management
- User preference handling
- Performance tier assignment
- Accessibility settings
- Global visual flags

**Core Interfaces**:
```typescript
interface VisualPolicy {
  capabilities: DeviceCapabilities;
  performanceTier: 'low' | 'medium' | 'high' | 'ultra';
  motionEnabled: boolean;
  intensity: number;
  paletteId: string;
  mode: 'ambient' | 'reactive' | 'performance' | 'accessibility';
  // ... additional properties
}
```

**Responsibilities**:
- Detect device capabilities (WebGL, memory, mobile status)
- Manage user preferences (motion, intensity, palette)
- Handle accessibility settings (reduced motion, high contrast)
- Provide effective values based on policy and device constraints

### 2. VisualOrchestrator Component

**Purpose**: Main coordination component that manages all visual layers

**Key Features**:
- Layer composition and rendering
- Performance monitoring
- Error handling and fallbacks
- Quality adaptation
- State management

**Core Interfaces**:
```typescript
interface VisualLayer {
  id: string;
  type: 'webgl' | 'css' | 'thin-film' | 'thermal' | 'overlay';
  enabled: boolean;
  priority: number;
  zIndex: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
}

interface VisualOrchestratorState {
  layers: VisualLayer[];
  activeLayers: VisualLayer[];
  performance: PerformanceMetrics;
  quality: QualitySettings;
  errors: string[];
  warnings: string[];
}
```

**Responsibilities**:
- Render visual layers in correct order
- Monitor performance and adapt quality
- Handle errors gracefully
- Coordinate between different layer types
- Provide development HUD

### 3. LayerCoordinator Utility

**Purpose**: Manages layer composition, blending, and optimization

**Key Features**:
- Layer conflict detection
- Performance cost estimation
- Device-specific optimization
- Blend mode management
- Resource conflict resolution

**Core Interfaces**:
```typescript
interface LayerComposition {
  layers: VisualLayer[];
  blendStack: BlendOperation[];
  renderOrder: number[];
  performance: PerformanceCost;
}

interface LayerConflict {
  type: 'zIndex' | 'blendMode' | 'performance' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  layers: string[];
  description: string;
  resolution?: string;
}
```

**Responsibilities**:
- Detect and resolve layer conflicts
- Optimize layers for device capabilities
- Estimate performance costs
- Manage blend operations
- Provide optimization recommendations

## Layer Types

### 1. WebGL Layer
- **Purpose**: Primary fluid simulation using webgl-fluid-enhanced
- **Performance**: High GPU usage, high visual quality
- **Fallback**: CSS layer when WebGL unavailable
- **Optimization**: Resolution scaling, particle count reduction

### 2. CSS Layer
- **Purpose**: Fallback visual effects using CSS gradients
- **Performance**: Low GPU usage, medium visual quality
- **Activation**: When WebGL fails or disabled
- **Optimization**: Gradient complexity, animation frequency

### 3. Thermal Layer
- **Purpose**: Thermal convection effects
- **Performance**: Medium GPU usage, medium visual quality
- **Dependencies**: WebGL layer, motion enabled
- **Optimization**: Simulation resolution, update frequency

### 4. Thin-Film Layer
- **Purpose**: Oil-on-water iridescence effects
- **Performance**: High GPU usage, high visual quality
- **Dependencies**: WebGL layer, high-tier devices
- **Optimization**: Shader complexity, resolution scaling

### 5. Overlay Layer
- **Purpose**: UI elements and controls
- **Performance**: Low GPU usage, low visual quality
- **Dependencies**: None
- **Optimization**: Element culling, update frequency

## Performance Management

### Quality Tiers

**Ultra** (High-end devices):
- Full resolution rendering
- Maximum particle counts
- All effects enabled
- 60+ FPS target

**High** (Mid-high devices):
- 75% resolution scaling
- High particle counts
- Most effects enabled
- 60 FPS target

**Medium** (Mid-range devices):
- 50% resolution scaling
- Medium particle counts
- Core effects only
- 30-60 FPS target

**Low** (Low-end devices):
- 25% resolution scaling
- Minimal particle counts
- CSS fallback preferred
- 30 FPS target

### Adaptive Quality

The system automatically adjusts quality based on:
- Real-time FPS monitoring
- Memory usage
- GPU load
- Device thermal state
- User preferences

### Performance Monitoring

**Metrics Tracked**:
- FPS (frames per second)
- Memory usage (JavaScript heap)
- GPU load (estimated)
- CPU usage (estimated)

**Adaptation Triggers**:
- FPS < 25: Step down quality
- FPS > 50: Step up quality
- Memory > 80%: Reduce particle counts
- GPU load > 90%: Disable expensive effects

## Error Handling

### Error Types

**WebGL Errors**:
- Context loss
- Shader compilation failure
- Texture creation failure
- Memory exhaustion

**Performance Errors**:
- FPS too low
- Memory usage too high
- GPU overload
- Thermal throttling

**Layer Conflicts**:
- Z-index conflicts
- Blend mode issues
- Resource conflicts
- Performance conflicts

### Fallback Strategy

1. **Primary**: WebGL fluid simulation
2. **Secondary**: CSS gradient fallback
3. **Tertiary**: Static background
4. **Final**: Error message

## Integration Points

### Audio System
- Receives audio data from `useAudioReactive`
- Maps audio to physics parameters
- Triggers visual effects on beats
- Adjusts intensity based on volume

### Palette System
- Uses `PaletteDirector` for color management
- Applies palette changes to all layers
- Handles color space conversions
- Manages intensity scaling

### Device Detection
- Uses `CapabilityDetector` for device profiling
- Adapts quality based on capabilities
- Handles mobile-specific optimizations
- Manages WebGL feature detection

## Usage Examples

### Basic Usage
```tsx
import VisualOrchestrator from '@/lib/visual/VisualOrchestrator';

function App() {
  return (
    <VisualOrchestrator>
      <YourAppContent />
    </VisualOrchestrator>
  );
}
```

### Advanced Usage
```tsx
import { useVisualPolicy } from '@/lib/visual/VisualPolicy';

function App() {
  const {
    policy,
    setIntensity,
    setPalette,
    shouldRenderWebGL,
  } = useVisualPolicy();

  return (
    <VisualOrchestrator
      onStateChange={(state) => {
        console.log('Performance:', state.performance);
        console.log('Active layers:', state.activeLayers.length);
      }}
      onError={(error) => console.error('Visual error:', error)}
    >
      <YourAppContent />
    </VisualOrchestrator>
  );
}
```

## Future Enhancements

### Planned Features
- WebGL2-specific optimizations
- Advanced shader effects
- Real-time layer editing
- Performance profiling tools
- A/B testing framework

### Scalability Considerations
- Micro-frontend architecture
- Service worker integration
- CDN optimization
- Progressive enhancement

## Troubleshooting

### Common Issues

**WebGL Not Working**:
- Check device capabilities
- Verify WebGL support
- Check for context loss
- Review error logs

**Performance Issues**:
- Reduce quality tier
- Disable expensive layers
- Check memory usage
- Monitor FPS

**Visual Artifacts**:
- Check blend modes
- Verify z-index ordering
- Review layer conflicts
- Test on different devices

### Debug Tools

**Development HUD**:
- Real-time performance metrics
- Layer status display
- Error/warning logs
- Quality tier indicator

**Console Logging**:
- Performance warnings
- Error details
- Layer state changes
- Optimization suggestions

## Conclusion

The Visual Orchestration system provides a robust, scalable foundation for managing complex visual effects. It balances performance, quality, and accessibility while providing a clean API for developers and a smooth experience for users.

The architecture is designed to be:
- **Modular**: Each component has clear responsibilities
- **Extensible**: Easy to add new layer types
- **Performant**: Adaptive quality and optimization
- **Accessible**: Respects user preferences
- **Robust**: Comprehensive error handling