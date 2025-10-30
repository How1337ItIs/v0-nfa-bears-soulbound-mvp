# Frequently Asked Questions (FAQ)

This document answers the most common questions about the Liquid Light System.

## 🎨 General Questions

### What is the Liquid Light System?
The Liquid Light System is a modern web application that creates an authentic 1960s-inspired liquid light show experience using WebGL fluid simulation, real-time audio analysis, and adaptive performance optimization.

### What technologies does it use?
- **Frontend**: Next.js, React, TypeScript
- **WebGL**: Three.js, React Three Fiber, webgl-fluid-enhanced
- **Audio**: Web Audio API, real-time analysis
- **Styling**: Tailwind CSS, CSS-in-JS
- **Testing**: Jest, React Testing Library
- **Quality**: ESLint, Prettier, TypeScript strict mode

### Is it open source?
Yes! The Liquid Light System is open source and available on GitHub. You can contribute, fork, or use it in your own projects.

### What browsers are supported?
- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

### What are the system requirements?
- **RAM**: 8GB minimum, 16GB recommended
- **GPU**: WebGL2 compatible graphics card
- **CPU**: Modern multi-core processor
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

## 🎵 Audio Questions

### How does audio reactivity work?
The system uses the Web Audio API to analyze incoming audio in real-time, extracting frequency bands (bass, mids, treble), overall volume, and beat detection. This data is then mapped to fluid physics parameters like splat force, dissipation rates, and curl strength.

### Can I use my microphone?
Yes! The system can use your microphone for audio input. You'll need to grant microphone permissions when prompted.

### Can I use audio files instead?
Yes! You can play audio files and the system will react to them. Just make sure the audio element is playing and not muted.

### Why isn't the audio working?
Common causes include:
- Microphone permissions denied
- Audio context not started
- Audio element not playing
- Browser doesn't support Web Audio API

See the [Troubleshooting Guide](../troubleshooting/CommonIssues.md) for solutions.

### How do I adjust audio sensitivity?
You can adjust audio sensitivity through the `AudioBus` service:
```typescript
const audioBus = AudioBus.getInstance();
audioBus.setSensitivity(0.8); // 0-1, higher = more sensitive
```

## 🎨 Visual Questions

### How do I change the color palette?
Use the `PaletteDirector` service to switch palettes:
```typescript
import { PaletteDirector } from '@/lib/palette/PaletteDirector';

// Switch to a specific palette
PaletteDirector.setPalette('psychedelic_swirl');

// Get available palettes
const palettes = PaletteDirector.getAllPalettes();
```

### Can I create custom palettes?
Yes! You can add custom palettes by extending the `Authentic60sPalettes` array or creating your own palette definitions.

### Why is the screen black?
This usually indicates a WebGL context loss. The system will automatically fall back to CSS gradients. Common causes:
- Browser tab was backgrounded too long
- GPU memory issues
- Hardware acceleration disabled

### How do I adjust the visual intensity?
Use the intensity control in the `LiquidLightControls` component or set it programmatically:
```typescript
const [intensity, setIntensity] = useState(0.7); // 0-1
```

### Can I disable motion for accessibility?
Yes! The system respects `prefers-reduced-motion` and provides a motion toggle. When disabled, the fluid simulation becomes static but maintains the color palette.

## ⚡ Performance Questions

### Why is it running slowly?
The system uses adaptive quality to maintain performance. If it's still slow:
- Check your device tier (Ultra, High, Medium, Low, Fallback)
- Reduce the intensity setting
- Close other applications
- Check for thermal throttling

### How does adaptive quality work?
The system continuously monitors FPS, CPU/GPU usage, and memory consumption. When performance drops below thresholds, it automatically reduces quality settings like resolution, particle count, and effect complexity.

### Can I force a specific quality level?
Yes! You can manually set the quality level:
```typescript
import { AdaptiveQuality } from '@/lib/performance/AdaptiveQuality';

const quality = new AdaptiveQuality();
quality.setDeviceTier(DeviceTier.HIGH);
```

### What's the difference between quality tiers?
- **Ultra**: Full resolution, all effects, maximum particles
- **High**: 80% resolution, reduced particles, most effects
- **Medium**: 70% resolution, fewer particles, basic effects
- **Low**: 60% resolution, minimal particles, essential effects
- **Fallback**: CSS-only gradients, no WebGL

## 🛠️ Development Questions

### How do I set up the development environment?
See the [Getting Started Guide](../development/GettingStarted.md) for detailed setup instructions.

### What's the project structure?
```
nfa-bears-mvp/
├── components/          # React components
├── lib/                # Core libraries
│   ├── audio/          # Audio processing
│   ├── palette/        # Color management
│   ├── visual/         # Visual system
│   └── performance/    # Performance monitoring
├── hooks/              # Custom React hooks
├── docs/               # Documentation
└── __tests__/          # Test files
```

### How do I run tests?
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

### How do I contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `npm run quality:check`
5. Submit a pull request

### What coding standards should I follow?
See the [Code Style Guide](../development/CodeStyleGuide.md) for detailed coding standards and conventions.

## 🚀 Deployment Questions

### How do I deploy to production?
See the [Deployment Guide](../deployment/DeploymentGuide.md) for complete deployment instructions.

### What hosting platforms are supported?
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

### Do I need a CDN?
A CDN is recommended for optimal performance, especially for global users. The system is designed to work with any CDN.

### What environment variables do I need?
See the [Environment Configuration](../deployment/EnvironmentConfiguration.md) for a complete list of environment variables.

## 🐛 Troubleshooting Questions

### The liquid light isn't showing up
1. Check if WebGL is supported
2. Verify the canvas element is rendered
3. Check for JavaScript errors in the console
4. Ensure the component is properly mounted

### Audio isn't working
1. Check microphone permissions
2. Verify audio context is started
3. Ensure audio element is playing
4. Check browser Web Audio API support

### Performance is poor
1. Check device tier and quality settings
2. Monitor CPU/GPU usage
3. Look for memory leaks
4. Verify adaptive quality is working

### Tests are failing
1. Check Jest configuration
2. Verify test file patterns
3. Ensure all dependencies are installed
4. Check for WebGL mocking issues

## 🔧 Technical Questions

### How does WebGL optimization work?
The system uses several WebGL2 optimizations:
- FBO (Framebuffer Object) reuse
- Instanced rendering
- Shader pre-compilation
- Geometry merging
- Texture optimization

### How does memory management work?
The `GPUMemoryManager` tracks all WebGL objects and automatically disposes of them when no longer needed. This prevents memory leaks and ensures smooth performance.

### How does beat detection work?
The system uses a combination of frequency analysis and transient detection to identify musical beats. It analyzes the audio signal for sudden increases in energy that typically indicate beats.

### How does color mapping work?
Colors are managed through the `PaletteDirector` service, which provides:
- Authentic 60s color palettes
- Wavelength-to-RGB conversion
- Intensity scaling
- Dynamic palette switching

## 📚 Documentation Questions

### Where can I find more documentation?
- [API Reference](../api/APIReference.md)
- [TypeScript Interfaces](../api/TypeScriptInterfaces.md)
- [Service Interfaces](../api/ServiceInterfaces.md)
- [Performance Guide](../performance/PerformanceOptimizationGuide.md)
- [Audio Integration](../audio/AudioIntegrationPatterns.md)

### How do I report bugs?
Use the [GitHub Issues](https://github.com/your-org/nfa-bears-mvp/issues) page to report bugs. Please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### How do I request features?
Use the [GitHub Discussions](https://github.com/your-org/nfa-bears-mvp/discussions) page to request features or ask questions.

### How do I get help?
- Check the documentation
- Search existing issues
- Ask in GitHub Discussions
- Create a new issue if needed

## 🎯 Usage Questions

### Can I use this in my own project?
Yes! The Liquid Light System is open source and can be used in your own projects. Just make sure to follow the license terms.

### Can I customize the visual effects?
Yes! You can customize:
- Color palettes
- Fluid parameters
- Audio mapping
- Performance settings
- Visual layers

### Can I add new visual layers?
Yes! The system is designed to be extensible. You can add new visual layers by implementing the `VisualLayer` interface.

### Can I integrate with other audio sources?
Yes! The `AudioBus` service can work with any audio source that provides a `MediaElementAudioSourceNode` or `MediaStreamAudioSourceNode`.

---

**Still have questions? Check the [GitHub Discussions](https://github.com/your-org/nfa-bears-mvp/discussions) or create a new issue! 🎨✨**
