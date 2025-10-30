# Deployment Guide

This guide covers the complete deployment process for the Liquid Light System, from development to production.

## 🚀 Overview

The Liquid Light System is designed to be deployed as a modern web application with the following characteristics:
- **Static Generation**: Next.js static export for optimal performance
- **CDN Distribution**: Global content delivery for fast loading
- **WebGL Requirements**: WebGL2 support for optimal visual experience
- **Audio Permissions**: Microphone access for audio reactivity
- **Performance Optimization**: Adaptive quality based on device capabilities

## 📋 Prerequisites

### Development Environment
- Node.js 18+
- npm 8+
- Git
- Modern browser with WebGL2 support

### Production Environment
- **Hosting**: Vercel, Netlify, AWS, or similar
- **CDN**: CloudFlare, AWS CloudFront, or similar
- **Domain**: Custom domain with SSL certificate
- **Monitoring**: Performance and error tracking

### Required Services
- **Analytics**: Google Analytics, Mixpanel, or similar
- **Error Tracking**: Sentry, Bugsnag, or similar
- **Performance Monitoring**: Web Vitals, Core Web Vitals
- **Audio Processing**: Web Audio API support

## 🏗️ Build Process

### 1. Pre-Build Validation
```bash
# Run comprehensive quality checks
npm run quality:check

# Run liquid light specific checks
npm run quality:liquid-light

# Run all tests with coverage
npm run test:coverage

# Type check with strict mode
npm run type-check:strict
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.production

# Configure production environment
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 3. Production Build
```bash
# Build with optimizations
npm run liquid-light:build

# Verify build output
ls -la .next/

# Test production build locally
npm start
```

### 4. Static Export (Optional)
```bash
# Configure next.config.js for static export
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

# Generate static files
npm run build
```

## 🌐 Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_ANALYTICS_ID
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run liquid-light:build",
  "devCommand": "npm run liquid-light:dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run liquid-light:build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS S3 + CloudFront
```bash
# Install AWS CLI
aws configure

# Build and upload
npm run liquid-light:build
aws s3 sync .next/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Production Configuration

### Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // WebGL and audio requirements
  experimental: {
    esmExternals: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // WebGL and audio permissions
  async rewrites() {
    return [
      {
        source: '/api/audio/:path*',
        destination: '/api/audio/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Environment Variables
```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
NEXT_PUBLIC_WEBGL_REQUIRED=true
NEXT_PUBLIC_AUDIO_REQUIRED=true
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
```

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for large dependencies
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

### WebGL Optimizations
```typescript
// Enable WebGL2 optimizations
const webglOptimizer = new WebGL2Optimizations(renderer);

// Configure FBO caching
webglOptimizer.setFBOCacheSize(10);

// Enable instancing
webglOptimizer.setInstancingEnabled(true);
```

### Audio Optimizations
```typescript
// Configure audio processing
const audioBus = AudioBus.getInstance();
audioBus.setSensitivity(0.8);
audioBus.setBeatThreshold(0.6);
audioBus.setFrequencyBands([
  { name: 'bass', startFreq: 20, endFreq: 250, sensitivity: 0.9, enabled: true },
  { name: 'mids', startFreq: 250, endFreq: 4000, sensitivity: 0.7, enabled: true },
  { name: 'treble', startFreq: 4000, endFreq: 20000, sensitivity: 0.5, enabled: true }
]);
```

## 🔒 Security Configuration

### Content Security Policy
```html
<!-- Add to _document.tsx -->
<meta httpEquiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  media-src 'self' blob:;
  connect-src 'self' https://api.your-domain.com;
  worker-src 'self' blob:;
  child-src 'self' blob:;
" />
```

### Audio Permissions
```typescript
// Request microphone permission
async function requestAudioPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Audio permission denied:', error);
    return false;
  }
}
```

## 📈 Monitoring and Analytics

### Performance Monitoring
```typescript
// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
performanceMonitor.start();

// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```typescript
// Initialize Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.type === 'WebGLContextLostError') {
        return null; // Don't report WebGL context loss
      }
    }
    return event;
  }
});
```

### Analytics Integration
```typescript
// Google Analytics 4
import { gtag } from 'ga-gtag';

// Track liquid light interactions
function trackLiquidLightEvent(action: string, category: string) {
  gtag('event', action, {
    event_category: category,
    event_label: 'liquid-light',
    value: 1
  });
}

// Track performance metrics
function trackPerformanceMetrics(metrics: PerformanceMetrics) {
  gtag('event', 'performance_metrics', {
    event_category: 'performance',
    fps: metrics.fps,
    frame_time: metrics.frameTime,
    memory_usage: metrics.memoryUsage
  });
}
```

## 🧪 Testing in Production

### Health Checks
```typescript
// API route: /api/health
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    webgl: checkWebGLSupport(),
    audio: checkAudioSupport(),
    performance: getPerformanceMetrics()
  };
  
  res.status(200).json(health);
}
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load tests
artillery run load-test.yml
```

**Load Test Configuration** (`load-test.yml`):
```yaml
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Liquid Light Load Test"
    weight: 100
    flow:
      - get:
          url: "/"
      - think: 5
      - get:
          url: "/api/health"
```

## 🚨 Troubleshooting

### Common Issues

#### WebGL Context Loss
```typescript
// Handle WebGL context loss
canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.warn('WebGL context lost, switching to CSS fallback');
  setWebGLSupported(false);
});

canvas.addEventListener('webglcontextrestored', (event) => {
  console.log('WebGL context restored');
  setWebGLSupported(true);
  initializeWebGL();
});
```

#### Audio Permission Denied
```typescript
// Handle audio permission denial
function handleAudioPermissionDenied() {
  console.warn('Audio permission denied, disabling audio reactivity');
  setAudioEnabled(false);
  showAudioPermissionPrompt();
}
```

#### Performance Issues
```typescript
// Monitor and adjust performance
const performanceMonitor = new PerformanceMonitor();
performanceMonitor.onPerformanceChange((metrics) => {
  if (metrics.fps < 30) {
    console.warn('Low FPS detected, reducing quality');
    adaptiveQuality.adjustQuality();
  }
});
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Quality checks passing
- [ ] TypeScript compilation successful
- [ ] Bundle size within limits
- [ ] Environment variables configured
- [ ] Security headers configured
- [ ] Performance optimizations enabled

### Post-Deployment
- [ ] Health check endpoint responding
- [ ] WebGL functionality working
- [ ] Audio reactivity working
- [ ] Performance metrics within targets
- [ ] Error tracking configured
- [ ] Analytics tracking working
- [ ] CDN cache properly configured

### Monitoring
- [ ] Performance monitoring active
- [ ] Error tracking active
- [ ] Analytics tracking active
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run quality:check
      - run: npm run test:coverage
      - run: npm run liquid-light:build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

**Deployment successful! 🎉 Your Liquid Light System is now live and ready to create psychedelic experiences! ✨**
