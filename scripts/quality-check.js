#!/usr/bin/env node

/**
 * QUALITY CHECK SCRIPT FOR LIQUID LIGHT SYSTEM
 * 
 * Comprehensive quality check script that runs all quality checks
 * including TypeScript, ESLint, Prettier, and tests.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Helper function to run commands
function runCommand(command, description) {
  console.log(`${colors.blue}${colors.bold}Running: ${description}${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ ${description} passed${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ ${description} failed${colors.reset}\n`);
    return false;
  }
}

// Helper function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

// Main quality check function
function runQualityCheck() {
  console.log(`${colors.cyan}${colors.bold}🔍 Liquid Light System Quality Check${colors.reset}\n`);

  const checks = [];
  let allPassed = true;

  // TypeScript type checking
  if (fileExists('tsconfig.json')) {
    checks.push(() => runCommand('npm run type-check', 'TypeScript type checking'));
  }

  // ESLint checking
  if (fileExists('.eslintrc.js')) {
    checks.push(() => runCommand('npm run lint', 'ESLint code quality check'));
  }

  // Prettier formatting check
  if (fileExists('.prettierrc.js')) {
    checks.push(() => runCommand('npm run format:check', 'Prettier formatting check'));
  }

  // Jest tests
  if (fileExists('jest.config.js') || fileExists('package.json')) {
    checks.push(() => runCommand('npm run test:coverage', 'Jest test suite with coverage'));
  }

  // Liquid Light specific checks
  if (fileExists('eslint-plugin-liquid-light.js')) {
    checks.push(() => runCommand('npm run lint:liquid-light', 'Liquid Light ESLint rules'));
  }

  // Run all checks
  for (const check of checks) {
    const passed = check();
    if (!passed) {
      allPassed = false;
    }
  }

  // Summary
  console.log(`${colors.cyan}${colors.bold}📊 Quality Check Summary${colors.reset}`);
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✅ All quality checks passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}❌ Some quality checks failed. Please fix the issues above.${colors.reset}`);
    process.exit(1);
  }
}

// Run the quality check
runQualityCheck();
