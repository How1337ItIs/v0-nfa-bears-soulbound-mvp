# Glossary

This document defines key terms and concepts used throughout the Liquid Light System.

## 🎨 Visual Terms

### WebGL
**WebGL** (Web Graphics Library) is a JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser without the use of plug-ins.

### WebGL2
**WebGL2** is the second generation of the WebGL API, providing additional features like:
- Multiple render targets
- Instanced rendering
- Transform feedback
- Uniform buffer objects
- 3D textures

### Fluid Simulation
**Fluid Simulation** is a computer graphics technique that simulates the behavior of fluids (liquids, gases) using mathematical models and numerical methods.

### Liquid Light
**Liquid Light** refers to the psychedelic light shows popular in the 1960s, where colored liquids were projected onto screens to create flowing, organic visual patterns.

### Splat
**Splat** in the context of fluid simulation refers to a localized disturbance or impulse applied to the fluid, creating ripples and waves.

### Dissipation
**Dissipation** is the process by which fluid properties (density, velocity) gradually decrease over time, causing the fluid to settle and become calm.

### Curl
**Curl** in fluid dynamics refers to the rotation or swirling motion of fluid particles, creating vortices and turbulence.

### Viscosity
**Viscosity** is a measure of a fluid's resistance to flow. Higher viscosity means the fluid flows more slowly and smoothly.

## 🎵 Audio Terms

### Web Audio API
**Web Audio API** is a high-level JavaScript API for processing and synthesizing audio in web applications.

### Audio Context
**Audio Context** is the central object in the Web Audio API that manages all audio processing and routing.

### Analyser Node
**Analyser Node** is a Web Audio API node that provides real-time frequency and time-domain analysis of audio signals.

### Frequency Bands
**Frequency Bands** are ranges of audio frequencies:
- **Bass**: 20Hz - 250Hz (low frequencies)
- **Mids**: 250Hz - 4kHz (mid frequencies)
- **Treble**: 4kHz - 20kHz (high frequencies)

### Beat Detection
**Beat Detection** is the process of identifying musical beats or rhythmic patterns in audio signals.

### Spectral Analysis
**Spectral Analysis** is the analysis of audio signals in the frequency domain, revealing the frequency content and characteristics.

### FFT
**FFT** (Fast Fourier Transform) is an algorithm that converts time-domain signals to frequency-domain representations.

## ⚡ Performance Terms

### FPS
**FPS** (Frames Per Second) is a measure of how many frames are rendered per second, indicating the smoothness of animation.

### Frame Time
**Frame Time** is the time taken to render a single frame, typically measured in milliseconds.

### GPU Memory
**GPU Memory** (VRAM) is the dedicated memory on the graphics card used for storing textures, buffers, and other graphics data.

### Thermal Throttling
**Thermal Throttling** occurs when a device reduces its performance to prevent overheating, often resulting in lower frame rates.

### Adaptive Quality
**Adaptive Quality** is a technique that automatically adjusts visual quality settings based on real-time performance metrics.

### Device Tier
**Device Tier** is a classification system that categorizes devices based on their performance capabilities:
- **Ultra**: High-end devices with powerful GPUs
- **High**: Good performance devices
- **Medium**: Average performance devices
- **Low**: Low-end devices
- **Fallback**: Very low-end or non-WebGL devices

## 🎨 Color Terms

### Palette
**Palette** is a collection of colors used together in a design or artwork.

### RGB
**RGB** (Red, Green, Blue) is a color model that represents colors as combinations of red, green, and blue values.

### HSL
**HSL** (Hue, Saturation, Lightness) is a color model that represents colors in terms of hue, saturation, and lightness.

### Wavelength
**Wavelength** is the distance between consecutive peaks of a wave, measured in nanometers for visible light.

### Spectral Colors
**Spectral Colors** are colors that correspond to specific wavelengths of light, such as the colors of a rainbow.

## 🛠️ Technical Terms

### TypeScript
**TypeScript** is a programming language that adds static type checking to JavaScript, helping catch errors at compile time.

### React
**React** is a JavaScript library for building user interfaces, particularly for web applications.

### Next.js
**Next.js** is a React framework that provides features like server-side rendering, static site generation, and API routes.

### Three.js
**Three.js** is a JavaScript library for creating 3D graphics in web browsers using WebGL.

### React Three Fiber
**React Three Fiber** is a React renderer for Three.js that allows you to use Three.js in a declarative way.

### Jest
**Jest** is a JavaScript testing framework that provides test runners, assertions, and mocking capabilities.

### ESLint
**ESLint** is a static code analysis tool that identifies and reports on patterns in JavaScript/TypeScript code.

### Prettier
**Prettier** is a code formatter that enforces consistent code style across a project.

## 🎯 System Terms

### Singleton
**Singleton** is a design pattern that ensures a class has only one instance and provides global access to it.

### Service Layer
**Service Layer** is an architectural pattern that encapsulates business logic and provides a clean interface for components.

### Context
**Context** in React is a way to share data between components without prop drilling.

### Hook
**Hook** in React is a function that allows you to use state and other React features in functional components.

### Effect
**Effect** in React is a function that runs after the component renders, allowing you to perform side effects.

### Ref
**Ref** in React is a way to access DOM elements or component instances directly.

## 🎨 Liquid Light Specific Terms

### PaletteDirector
**PaletteDirector** is the service that manages color palettes and provides color-related functionality.

### AudioBus
**AudioBus** is the service that handles audio processing and provides real-time audio data to components.

### CapabilityDetector
**CapabilityDetector** is the service that detects device capabilities and assigns performance tiers.

### PerformanceMonitor
**PerformanceMonitor** is the service that tracks real-time performance metrics.

### AdaptiveQuality
**AdaptiveQuality** is the service that dynamically adjusts quality settings based on performance.

### WebGL2Optimizations
**WebGL2Optimizations** is the service that provides WebGL2-specific performance optimizations.

### GPUMemoryManager
**GPUMemoryManager** is the service that manages GPU memory and prevents memory leaks.

### ThermalThrottlingDetector
**ThermalThrottlingDetector** is the service that monitors device thermal state and detects throttling.

## 🧪 Testing Terms

### Unit Test
**Unit Test** is a test that verifies the behavior of a single function or component in isolation.

### Integration Test
**Integration Test** is a test that verifies the interaction between multiple components or services.

### Performance Test
**Performance Test** is a test that measures the performance characteristics of the application.

### Accessibility Test
**Accessibility Test** is a test that verifies the application is usable by people with disabilities.

### Visual Test
**Visual Test** is a test that compares visual output to ensure no unintended changes.

### Mock
**Mock** is a fake implementation of a function or service used in testing.

### Coverage
**Coverage** is a measure of how much of the code is executed during testing.

## 🚀 Deployment Terms

### Build
**Build** is the process of compiling and bundling the application for production.

### Bundle
**Bundle** is the compiled and optimized JavaScript files ready for deployment.

### CDN
**CDN** (Content Delivery Network) is a network of servers that deliver content to users based on their geographic location.

### Static Export
**Static Export** is the process of generating static HTML files that can be served from any web server.

### Environment Variables
**Environment Variables** are configuration values that can be set outside the application code.

### CI/CD
**CI/CD** (Continuous Integration/Continuous Deployment) is a practice of automatically building, testing, and deploying code changes.

## 🔒 Security Terms

### CSP
**CSP** (Content Security Policy) is a security feature that helps prevent cross-site scripting attacks.

### HTTPS
**HTTPS** (HTTP Secure) is a secure version of HTTP that uses encryption to protect data transmission.

### CORS
**CORS** (Cross-Origin Resource Sharing) is a security feature that controls which domains can access resources.

### XSS
**XSS** (Cross-Site Scripting) is a security vulnerability that allows attackers to inject malicious scripts.

### CSRF
**CSRF** (Cross-Site Request Forgery) is a security vulnerability that allows attackers to perform actions on behalf of users.

---

**This glossary is continuously updated as new terms are added to the Liquid Light System! 📚✨**
