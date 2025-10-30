# Environment Configuration

This document covers the complete environment configuration for the Liquid Light System across different deployment stages.

## 🌍 Environment Overview

The Liquid Light System supports multiple environments with different configurations:

- **Development**: Local development with hot reloading and debugging
- **Staging**: Pre-production testing environment
- **Production**: Live production environment
- **Testing**: Automated testing environment

## 🔧 Environment Variables

### Required Variables

#### Core Application
```bash
# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Environment identifier
NODE_ENV=production|development|staging|test

# Application version
NEXT_PUBLIC_APP_VERSION=1.0.0

# Build timestamp
NEXT_PUBLIC_BUILD_TIMESTAMP=2025-10-29T12:00:00Z
```

#### WebGL and Audio
```bash
# WebGL requirements
NEXT_PUBLIC_WEBGL_REQUIRED=true
NEXT_PUBLIC_WEBGL2_REQUIRED=true

# Audio requirements
NEXT_PUBLIC_AUDIO_REQUIRED=true
NEXT_PUBLIC_MICROPHONE_REQUIRED=true

# Performance settings
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ADAPTIVE_QUALITY=true
```

#### Analytics and Monitoring
```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Performance monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_WEB_VITALS_TRACKING=true
```

#### CDN and Assets
```bash
# CDN configuration
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
NEXT_PUBLIC_ASSETS_URL=https://assets.your-domain.com

# Image optimization
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_IMAGE_QUALITY=80
```

### Optional Variables

#### Feature Flags
```bash
# Feature toggles
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY=false
NEXT_PUBLIC_ENABLE_WEBGL_DEBUG=false
NEXT_PUBLIC_ENABLE_AUDIO_DEBUG=false

# Experimental features
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

#### Third-Party Services
```bash
# External APIs
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_API_KEY=your-api-key

# Social media
NEXT_PUBLIC_TWITTER_HANDLE=@your-handle
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@your-domain.com
NEXT_PUBLIC_DOCS_URL=https://docs.your-domain.com
```

## 🏗️ Environment-Specific Configurations

### Development Environment

#### `.env.development`
```bash
# Development-specific variables
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Debug settings
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY=true
NEXT_PUBLIC_ENABLE_WEBGL_DEBUG=true
NEXT_PUBLIC_ENABLE_AUDIO_DEBUG=true

# Development services
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DEV-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://dev-sentry-dsn
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_CDN_URL=http://localhost:3000
```

#### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:debug": "NODE_ENV=development DEBUG=* next dev",
    "dev:liquid-light": "npm run type-check && npm run lint:liquid-light && npm run dev",
    "dev:analyze": "ANALYZE=true npm run dev"
  }
}
```

### Staging Environment

#### `.env.staging`
```bash
# Staging-specific variables
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com

# Staging services
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-STAGING-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://staging-sentry-dsn
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Staging CDN
NEXT_PUBLIC_CDN_URL=https://staging-cdn.your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://staging-api.your-domain.com

# Debug settings (limited)
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY=true
NEXT_PUBLIC_ENABLE_WEBGL_DEBUG=false
NEXT_PUBLIC_ENABLE_AUDIO_DEBUG=false
```

#### Staging Deployment
```bash
# Deploy to staging
npm run build:staging
npm run deploy:staging

# Verify staging deployment
npm run test:staging
npm run health-check:staging
```

### Production Environment

#### `.env.production`
```bash
# Production-specific variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Production services
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PROD-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://prod-sentry-dsn
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Production CDN
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com

# Security settings
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY=false
NEXT_PUBLIC_ENABLE_WEBGL_DEBUG=false
NEXT_PUBLIC_ENABLE_AUDIO_DEBUG=false

# Performance optimizations
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_IMAGE_QUALITY=85
NEXT_PUBLIC_ENABLE_COMPRESSION=true
```

#### Production Deployment
```bash
# Deploy to production
npm run build:production
npm run deploy:production

# Verify production deployment
npm run test:production
npm run health-check:production
```

### Testing Environment

#### `.env.test`
```bash
# Test-specific variables
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Test services (mocked)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://test-sentry-dsn
NEXT_PUBLIC_PERFORMANCE_MONITORING=false

# Test settings
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY=false
NEXT_PUBLIC_ENABLE_WEBGL_DEBUG=false
NEXT_PUBLIC_ENABLE_AUDIO_DEBUG=false

# Mock services
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_CDN_URL=http://localhost:3000
```

## 🔧 Configuration Management

### Environment Validation
```typescript
// lib/config/environment.ts
interface EnvironmentConfig {
  appUrl: string;
  nodeEnv: string;
  webglRequired: boolean;
  audioRequired: boolean;
  performanceMonitoring: boolean;
  debugMode: boolean;
  analyticsId?: string;
  sentryDsn?: string;
}

function validateEnvironment(): EnvironmentConfig {
  const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV',
    'NEXT_PUBLIC_WEBGL_REQUIRED',
    'NEXT_PUBLIC_AUDIO_REQUIRED',
    'NEXT_PUBLIC_PERFORMANCE_MONITORING'
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    nodeEnv: process.env.NODE_ENV!,
    webglRequired: process.env.NEXT_PUBLIC_WEBGL_REQUIRED === 'true',
    audioRequired: process.env.NEXT_PUBLIC_AUDIO_REQUIRED === 'true',
    performanceMonitoring: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true',
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
    analyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN
  };
}

export const env = validateEnvironment();
```

### Feature Flags
```typescript
// lib/config/features.ts
interface FeatureFlags {
  debugMode: boolean;
  performanceOverlay: boolean;
  webglDebug: boolean;
  audioDebug: boolean;
  experimentalFeatures: boolean;
  betaFeatures: boolean;
}

function getFeatureFlags(): FeatureFlags {
  return {
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
    performanceOverlay: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_OVERLAY === 'true',
    webglDebug: process.env.NEXT_PUBLIC_ENABLE_WEBGL_DEBUG === 'true',
    audioDebug: process.env.NEXT_PUBLIC_ENABLE_AUDIO_DEBUG === 'true',
    experimentalFeatures: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES === 'true',
    betaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true'
  };
}

export const features = getFeatureFlags();
```

## 🚀 Deployment Scripts

### Build Scripts
```json
{
  "scripts": {
    "build": "next build",
    "build:development": "NODE_ENV=development next build",
    "build:staging": "NODE_ENV=staging next build",
    "build:production": "NODE_ENV=production next build",
    "build:test": "NODE_ENV=test next build"
  }
}
```

### Deployment Scripts
```json
{
  "scripts": {
    "deploy": "npm run build && npm run deploy:vercel",
    "deploy:staging": "npm run build:staging && npm run deploy:vercel:staging",
    "deploy:production": "npm run build:production && npm run deploy:vercel:production",
    "deploy:vercel": "vercel --prod",
    "deploy:vercel:staging": "vercel --target staging",
    "deploy:vercel:production": "vercel --prod"
  }
}
```

### Health Check Scripts
```json
{
  "scripts": {
    "health-check": "node scripts/health-check.js",
    "health-check:staging": "NODE_ENV=staging npm run health-check",
    "health-check:production": "NODE_ENV=production npm run health-check"
  }
}
```

## 🔒 Security Configuration

### Environment Security
```typescript
// lib/security/environment.ts
function validateEnvironmentSecurity(): void {
  // Check for sensitive data in environment variables
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /key/i,
    /token/i,
    /auth/i
  ];

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_') && value) {
      for (const pattern of sensitivePatterns) {
        if (pattern.test(key) && !pattern.test('NEXT_PUBLIC_')) {
          console.warn(`Warning: Potentially sensitive data in public environment variable: ${key}`);
        }
      }
    }
  }
}

export { validateEnvironmentSecurity };
```

### Content Security Policy
```typescript
// lib/security/csp.ts
function getContentSecurityPolicy(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';
  
  const basePolicy = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'media-src': ["'self'", 'blob:'],
    'connect-src': ["'self'", 'https://api.your-domain.com'],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:']
  };

  if (isDevelopment) {
    basePolicy['script-src'].push('http://localhost:*');
    basePolicy['connect-src'].push('http://localhost:*', 'ws://localhost:*');
  }

  if (isStaging) {
    basePolicy['connect-src'].push('https://staging-api.your-domain.com');
  }

  return Object.entries(basePolicy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

export { getContentSecurityPolicy };
```

## 📊 Monitoring Configuration

### Performance Monitoring
```typescript
// lib/monitoring/performance.ts
function configurePerformanceMonitoring(): void {
  if (process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true') {
    // Initialize performance monitoring
    const monitor = new PerformanceMonitor();
    monitor.start();

    // Configure Web Vitals tracking
    if (process.env.NEXT_PUBLIC_WEB_VITALS_TRACKING === 'true') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }
}

export { configurePerformanceMonitoring };
```

### Error Tracking
```typescript
// lib/monitoring/error.ts
function configureErrorTracking(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        beforeSend(event) {
          // Filter out non-critical errors
          if (event.exception) {
            const error = event.exception.values[0];
            if (error.type === 'WebGLContextLostError') {
              return null;
            }
          }
          return event;
        }
      });
    });
  }
}

export { configureErrorTracking };
```

---

**Environment configuration complete! 🎉 Your Liquid Light System is now properly configured for all deployment stages! ✨**
