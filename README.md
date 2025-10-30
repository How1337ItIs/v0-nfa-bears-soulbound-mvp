# 🎨 NFA Bears MVP - Liquid Light System

A cutting-edge web application featuring an authentic 1960s-inspired liquid light show experience, built with modern web technologies and WebGL fluid simulation.

## 🌟 Features

### 🎭 Liquid Light Show
- **WebGL Fluid Simulation**: High-performance fluid dynamics using `webgl-fluid-enhanced`
- **Audio Reactivity**: Real-time audio analysis driving visual parameters
- **Authentic 60s Palettes**: Curated color schemes from the psychedelic era
- **Adaptive Quality**: Dynamic performance optimization based on device capabilities
- **Accessibility**: Full `prefers-reduced-motion` support with CSS fallbacks

### 🎵 Audio Integration
- **Real-time Analysis**: Bass, mids, treble, and beat detection
- **Physics Mapping**: Audio data drives fluid splat force, dissipation, and curl
- **Beat Detection**: Transient peaks trigger dynamic visual effects
- **Multiple Sources**: Microphone, media elements, and Web Audio API support

### 🎨 Visual System
- **Palette Director**: Centralized color management with authentic 60s palettes
- **Performance Monitoring**: Real-time FPS, CPU/GPU usage tracking
- **WebGL2 Optimizations**: FBO reuse, instancing, and efficient shader management
- **Graceful Degradation**: CSS-only fallbacks for non-WebGL environments

### 🛠️ Developer Experience
- **TypeScript**: Strict type safety throughout the codebase
- **Quality Tools**: ESLint, Prettier, Jest with comprehensive coverage
- **Git Hooks**: Pre-commit quality checks and commit message validation
- **Testing**: Unit, integration, performance, and accessibility tests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with WebGL2 support

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/nfa-bears-mvp.git
cd nfa-bears-mvp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
# Development with quality checks
npm run liquid-light:dev

# Build with strict validation
npm run liquid-light:build

# Run comprehensive tests
npm run liquid-light:test

# Quality checks
npm run quality:check
npm run quality:liquid-light
```

## 🏗️ Architecture

### Core Components

#### `LiquidLightBackground.tsx`
The main component rendering the WebGL fluid simulation with audio reactivity and user controls.

```tsx
import { LiquidLightBackground } from '@/components/LiquidLightBackground';

<LiquidLightBackground
  audioData={audioData}
  intensity={0.7}
  motionEnabled={true}
/>
```

#### `PaletteDirector`
Centralized color palette management with authentic 60s schemes.

```tsx
import { PaletteDirector } from '@/lib/palette/PaletteDirector';

// Get current palette
const palette = PaletteDirector.getCurrentPalette();

// Get specific color
const color = PaletteDirector.getColorRGB(0);

// Switch palette
PaletteDirector.setPalette('psychedelic_swirl');
```

#### `AudioBus`
Real-time audio analysis and data dissemination.

```tsx
import { AudioBus } from '@/lib/audio/AudioBus';

const audioBus = AudioBus.getInstance();
await audioBus.start(audioSourceNode);
const audioData = audioBus.getAudioData();
```

### Performance Services

#### `CapabilityDetector`
Device capability assessment and performance tier assignment.

```tsx
import { CapabilityDetector } from '@/lib/visual/CapabilityDetector';

const detector = new CapabilityDetector();
const tier = detector.getDeviceTier(); // ULTRA, HIGH, MEDIUM, LOW, FALLBACK
```

#### `AdaptiveQuality`
Dynamic quality adjustment based on performance metrics.

```tsx
import { AdaptiveQuality } from '@/lib/performance/AdaptiveQuality';

const quality = new AdaptiveQuality();
quality.setPerformanceMonitor(monitor);
const settings = quality.getCurrentQualitySettings();
```

## 🎨 Liquid Light System

### Visual Layers
1. **WebGL Fluid**: Primary liquid light simulation
2. **Thin Film**: Post-processing interference effects
3. **Particles**: Additional visual elements
4. **CSS Fallback**: Gradient-based fallback

### Audio Mapping
- **Bass**: Drives splat force and curl strength
- **Mids**: Influences fluid viscosity and motion
- **Treble**: Controls color phase and palette shifts
- **Beats**: Triggers transient visual effects

### Performance Tiers
- **ULTRA**: Full resolution, all effects enabled
- **HIGH**: 80% resolution, reduced particle count
- **MEDIUM**: 70% resolution, simplified effects
- **LOW**: 60% resolution, minimal effects
- **FALLBACK**: CSS-only gradients

## 🧪 Testing

### Test Categories
- **Unit Tests**: Individual component and service testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: FPS, memory, and GPU usage
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Visual Tests**: Screenshot comparison and regression testing

### Running Tests
```bash
# All tests
npm run test

# Liquid light specific
npm run test:liquid-light

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Coverage Thresholds
- **Global**: 80% branches, functions, lines, statements
- **LiquidLightBackground**: 85-90%
- **PaletteDirector**: 90-95%
- **Audio Services**: 85-90%
- **Performance Services**: 80-85%

## 🎯 Quality Assurance

### Code Quality
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Custom rules for liquid light best practices
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit quality validation

### Performance Monitoring
- **Real-time Metrics**: FPS, CPU/GPU usage, memory consumption
- **Thermal Detection**: Device temperature monitoring
- **Adaptive Quality**: Dynamic performance adjustment
- **WebGL Optimizations**: FBO reuse, instancing, shader optimization

## 📚 Documentation

### API Reference
- [Liquid Light System API](./docs/api/APIReference.md)
- [Performance Optimization Guide](./docs/performance/PerformanceOptimizationGuide.md)
- [Audio Integration Patterns](./docs/audio/AudioIntegrationPatterns.md)
- [Troubleshooting Guide](./docs/troubleshooting/TroubleshootingGuide.md)

### Development Guides
- [Getting Started](./docs/development/GettingStarted.md)
- [Contributing Guidelines](./docs/development/Contributing.md)
- [Architecture Overview](./docs/architecture/Architecture.md)
- [Testing Strategy](./docs/testing/TestingStrategy.md)

## 🚀 Deployment

### Production Build
```bash
# Build with optimizations
npm run liquid-light:build

# Start production server
npm start
```

### Environment Variables
```bash
# Required
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
```

### Performance Considerations
- **WebGL2**: Required for optimal performance
- **Audio Permissions**: Microphone access for audio reactivity
- **Device Capabilities**: Automatic quality adjustment
- **CDN**: Static assets served from CDN

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with quality checks
4. Run comprehensive tests
5. Submit a pull request

### Code Standards
- Follow TypeScript strict mode
- Maintain test coverage thresholds
- Use conventional commit messages
- Follow liquid light specific ESLint rules

### Commit Message Format
```
type(scope): description

Examples:
feat(liquid-light): add WebGL2 optimizations
fix(audio): resolve beat detection timing
docs(api): update PaletteDirector documentation
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **webgl-fluid-enhanced**: WebGL fluid simulation library
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **60s Liquid Light Shows**: Inspiration for authentic visual effects

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/nfa-bears-mvp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/nfa-bears-mvp/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-org/nfa-bears-mvp/wiki)

---

**Built with ❤️ for the psychedelic web experience**