/**
 * JEST CONFIGURATION FOR LIQUID LIGHT SYSTEM
 * 
 * Jest configuration with coverage reporting and liquid light specific
 * test patterns and coverage thresholds.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test patterns
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/components/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/hooks/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Test path patterns for liquid light system
  testPathPatterns: [
    'liquid-light',
    'performance',
    'accessibility',
    'visual',
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
    'clover',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Liquid light specific thresholds
    './components/LiquidLightBackground.tsx': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './components/liquid-light/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './lib/palette/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './lib/audio/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './lib/visual/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './lib/performance/': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  
  // Coverage collection patterns
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.config.js',
    '!**/*.config.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/jest.setup.js',
    '!**/jest.config.js',
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/__tests__/',
    '/__mocks__/',
    '/jest.setup.js',
    '/jest.config.js',
    '/.eslintrc.js',
    '/.prettierrc.js',
    '/tailwind.config.js',
    '/next.config.js',
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  
  // Global setup
  globalSetup: '<rootDir>/jest.global-setup.js',
  
  // Global teardown
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // Setup files
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  
  // Test results processor
  testResultsProcessor: '<rootDir>/jest.results-processor.js',
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Notify mode
  notify: true,
  notifyMode: 'failure-change',
  
  // Error on deprecated
  errorOnDeprecated: true,
  
  // Force exit
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Detect leaks
  detectLeaks: true,
  
  // Detect open handles timeout
  detectOpenHandlesTimeout: 10000,
};

// Create and export the Jest config
module.exports = createJestConfig(customJestConfig);
