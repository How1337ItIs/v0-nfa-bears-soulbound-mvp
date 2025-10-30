# Getting Started with Liquid Light System

This guide will help you get up and running with the Liquid Light System development environment.

## 🚀 Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Recommended Tools
- **VS Code**: With TypeScript, ESLint, and Prettier extensions
- **Chrome DevTools**: For WebGL debugging
- **WebGL Inspector**: Browser extension for WebGL debugging

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **GPU**: WebGL2 compatible graphics card
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/nfa-bears-mvp.git
cd nfa-bears-mvp
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Verify installation
npm run type-check
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# Add your configuration values
```

### 4. Verify Installation
```bash
# Run quality checks
npm run quality:check

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
nfa-bears-mvp/
├── components/                 # React components
│   ├── LiquidLightBackground.tsx
│   └── liquid-light/          # Liquid light specific components
├── lib/                       # Core libraries
│   ├── audio/                 # Audio processing
│   ├── palette/               # Color palette management
│   ├── visual/                # Visual system
│   └── performance/           # Performance monitoring
├── hooks/                     # Custom React hooks
├── docs/                      # Documentation
├── __tests__/                 # Test files
├── scripts/                   # Build and utility scripts
└── public/                    # Static assets
```

## 🎨 Liquid Light System Overview

### Core Components
1. **LiquidLightBackground**: Main WebGL fluid simulation component
2. **PaletteDirector**: Color palette management service
3. **AudioBus**: Real-time audio analysis service
4. **CapabilityDetector**: Device capability assessment
5. **PerformanceMonitor**: Real-time performance tracking

### Key Features
- **WebGL Fluid Simulation**: High-performance fluid dynamics
- **Audio Reactivity**: Real-time audio-driven visuals
- **Adaptive Quality**: Dynamic performance optimization
- **Accessibility**: Full `prefers-reduced-motion` support
- **Graceful Degradation**: CSS fallbacks for non-WebGL environments

## 🛠️ Development Workflow

### 1. Start Development Server
```bash
# Start with quality checks
npm run liquid-light:dev

# Or start without checks (faster)
npm run dev
```

### 2. Make Changes
- Edit components in `components/` directory
- Modify services in `lib/` directory
- Update tests in `__tests__/` directory

### 3. Quality Checks
```bash
# Run all quality checks
npm run quality:check

# Fix quality issues
npm run quality:fix

# Liquid light specific checks
npm run quality:liquid-light
```

### 4. Testing
```bash
# Run all tests
npm run test

# Run liquid light tests
npm run test:liquid-light

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### 5. Build
```bash
# Build for production
npm run liquid-light:build

# Analyze bundle
npm run analyze
```

## 🎯 Development Guidelines

### Code Style
- **TypeScript**: Use strict mode with comprehensive types
- **ESLint**: Follow configured rules and custom liquid light rules
- **Prettier**: Use consistent formatting
- **Naming**: Use descriptive, camelCase names

### Component Development
```typescript
// Example component structure
import React from 'react';
import { PaletteDirector } from '@/lib/palette/PaletteDirector';

interface MyComponentProps {
  intensity: number;
  motionEnabled: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  intensity,
  motionEnabled
}) => {
  // Component logic
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

### Service Development
```typescript
// Example service structure
export class MyService {
  private static instance: MyService;
  
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
  
  // Service methods
  public doSomething(): void {
    // Implementation
  }
}
```

### Testing
```typescript
// Example test structure
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent intensity={0.5} motionEnabled={true} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### TypeScript Configuration
- **File**: `tsconfig.json`
- **Strict Mode**: Enabled with comprehensive type checking
- **Path Mapping**: Clean imports with `@/` aliases
- **Target**: ES2022 for modern features

### ESLint Configuration
- **File**: `.eslintrc.js`
- **Rules**: TypeScript, React, accessibility, and custom liquid light rules
- **Plugins**: Custom liquid light plugin for specific rules

### Prettier Configuration
- **File**: `.prettierrc.js`
- **Settings**: 100 character width, single quotes, trailing commas
- **Plugins**: Import sorting and Tailwind CSS support

### Jest Configuration
- **File**: `jest.config.js`
- **Coverage**: 80% global threshold, higher for liquid light components
- **Environment**: jsdom for React testing
- **Mocks**: WebGL, audio, and performance APIs

## 🐛 Debugging

### WebGL Debugging
1. **Chrome DevTools**: Use the WebGL tab for context inspection
2. **WebGL Inspector**: Browser extension for detailed WebGL debugging
3. **Console Logging**: Use `console.log` for debugging (remove in production)

### Performance Debugging
1. **Performance Tab**: Use Chrome DevTools Performance tab
2. **Memory Tab**: Monitor memory usage and detect leaks
3. **Performance Monitor**: Use built-in `PerformanceMonitor` service

### Audio Debugging
1. **Audio Tab**: Use Chrome DevTools Audio tab
2. **Console Logging**: Log audio data and analysis results
3. **Visualization**: Use audio visualization tools

## 📚 Learning Resources

### WebGL Resources
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL2 Reference](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)

### React Resources
- [React Documentation](https://reactjs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)
- [TypeScript Testing](https://jestjs.io/docs/getting-started#using-typescript)

## 🚨 Common Issues

### WebGL Context Loss
- **Cause**: Browser tab backgrounded, GPU memory issues
- **Solution**: Implement context restoration, use `CSSFallback`

### Audio Not Working
- **Cause**: Microphone permissions, audio context issues
- **Solution**: Check permissions, ensure audio context is started

### Performance Issues
- **Cause**: High quality settings, complex effects
- **Solution**: Use `AdaptiveQuality`, check device tier

### TypeScript Errors
- **Cause**: Strict type checking, missing types
- **Solution**: Add proper types, use type assertions carefully

## 🎉 Next Steps

1. **Explore Components**: Check out `LiquidLightBackground.tsx`
2. **Understand Services**: Study `PaletteDirector` and `AudioBus`
3. **Run Tests**: Execute the test suite to understand functionality
4. **Make Changes**: Try modifying components and see the results
5. **Read Documentation**: Explore the comprehensive documentation

## 📞 Getting Help

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Documentation**: Check the comprehensive docs in `docs/`
- **Code Examples**: Look at existing components and services

---

**Happy coding! 🎨✨**
