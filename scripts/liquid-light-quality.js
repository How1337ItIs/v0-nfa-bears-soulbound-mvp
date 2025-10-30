#!/usr/bin/env node

/**
 * LIQUID LIGHT SPECIFIC QUALITY CHECK SCRIPT
 * 
 * Specialized quality check script for liquid light system components
 * with specific rules and validations.
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

// Liquid Light specific file patterns
const liquidLightPatterns = [
  'components/LiquidLightBackground.tsx',
  'components/liquid-light/',
  'lib/palette/',
  'lib/audio/',
  'lib/visual/',
  'lib/performance/',
  'hooks/useAudioReactive',
  'hooks/useAudioReactiveEngine',
];

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

// Helper function to find liquid light files
function findLiquidLightFiles() {
  const files = [];
  
  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchDirectory(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  for (const pattern of liquidLightPatterns) {
    if (fileExists(pattern)) {
      if (fs.statSync(pattern).isDirectory()) {
        searchDirectory(pattern);
      } else {
        files.push(pattern);
      }
    }
  }
  
  return files;
}

// Check for hardcoded colors
function checkHardcodedColors() {
  console.log(`${colors.blue}${colors.bold}Checking for hardcoded colors...${colors.reset}`);
  
  const files = findLiquidLightFiles();
  let hasIssues = false;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/g;
    const matches = content.match(colorRegex);
    
    if (matches) {
      console.log(`${colors.yellow}⚠ Found hardcoded colors in ${file}:${colors.reset}`);
      matches.forEach(match => {
        console.log(`  ${colors.red}${match}${colors.reset}`);
      });
      hasIssues = true;
    }
  }
  
  if (!hasIssues) {
    console.log(`${colors.green}✓ No hardcoded colors found${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Hardcoded colors found. Use PaletteDirector instead.${colors.reset}\n`);
  }
  
  return !hasIssues;
}

// Check for direct WebGL calls
function checkDirectWebGLCalls() {
  console.log(`${colors.blue}${colors.bold}Checking for direct WebGL calls...${colors.reset}`);
  
  const files = findLiquidLightFiles();
  let hasIssues = false;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const webglRegex = /gl\.(createShader|createProgram|createBuffer|createTexture|createFramebuffer|createRenderbuffer)/g;
    const matches = content.match(webglRegex);
    
    if (matches) {
      console.log(`${colors.yellow}⚠ Found direct WebGL calls in ${file}:${colors.reset}`);
      matches.forEach(match => {
        console.log(`  ${colors.red}${match}${colors.reset}`);
      });
      hasIssues = true;
    }
  }
  
  if (!hasIssues) {
    console.log(`${colors.green}✓ No direct WebGL calls found${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Direct WebGL calls found. Use WebGL2Optimizer or GPUMemoryManager instead.${colors.reset}\n`);
  }
  
  return !hasIssues;
}

// Check for direct AudioContext calls
function checkDirectAudioContextCalls() {
  console.log(`${colors.blue}${colors.bold}Checking for direct AudioContext calls...${colors.reset}`);
  
  const files = findLiquidLightFiles();
  let hasIssues = false;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const audioRegex = /audioContext\.(createAnalyser|createMediaStreamSource|createGain|createOscillator)/g;
    const matches = content.match(audioRegex);
    
    if (matches) {
      console.log(`${colors.yellow}⚠ Found direct AudioContext calls in ${file}:${colors.reset}`);
      matches.forEach(match => {
        console.log(`  ${colors.red}${match}${colors.reset}`);
      });
      hasIssues = true;
    }
  }
  
  if (!hasIssues) {
    console.log(`${colors.green}✓ No direct AudioContext calls found${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Direct AudioContext calls found. Use AudioBus instead.${colors.reset}\n`);
  }
  
  return !hasIssues;
}

// Check for console statements in production files
function checkConsoleStatements() {
  console.log(`${colors.blue}${colors.bold}Checking for console statements...${colors.reset}`);
  
  const files = findLiquidLightFiles();
  let hasIssues = false;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const consoleRegex = /console\.(log|warn|error|info|debug)/g;
    const matches = content.match(consoleRegex);
    
    if (matches) {
      console.log(`${colors.yellow}⚠ Found console statements in ${file}:${colors.reset}`);
      matches.forEach(match => {
        console.log(`  ${colors.red}${match}${colors.reset}`);
      });
      hasIssues = true;
    }
  }
  
  if (!hasIssues) {
    console.log(`${colors.green}✓ No console statements found${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Console statements found. Remove for production.${colors.reset}\n`);
  }
  
  return !hasIssues;
}

// Main liquid light quality check function
function runLiquidLightQualityCheck() {
  console.log(`${colors.cyan}${colors.bold}🎨 Liquid Light System Quality Check${colors.reset}\n`);

  const checks = [
    () => checkHardcodedColors(),
    () => checkDirectWebGLCalls(),
    () => checkDirectAudioContextCalls(),
    () => checkConsoleStatements(),
  ];

  // Run standard quality checks on liquid light files
  if (fileExists('.eslintrc.js')) {
    checks.push(() => runCommand('npm run lint:liquid-light', 'Liquid Light ESLint rules'));
  }

  if (fileExists('tsconfig.json')) {
    checks.push(() => runCommand('npm run type-check', 'TypeScript type checking'));
  }

  if (fileExists('.prettierrc.js')) {
    checks.push(() => runCommand('npm run format:check', 'Prettier formatting check'));
  }

  // Run liquid light specific tests
  if (fileExists('jest.config.js') || fileExists('package.json')) {
    checks.push(() => runCommand('npm run test:liquid-light', 'Liquid Light test suite'));
  }

  let allPassed = true;

  // Run all checks
  for (const check of checks) {
    const passed = check();
    if (!passed) {
      allPassed = false;
    }
  }

  // Summary
  console.log(`${colors.cyan}${colors.bold}📊 Liquid Light Quality Check Summary${colors.reset}`);
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✅ All liquid light quality checks passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}❌ Some liquid light quality checks failed. Please fix the issues above.${colors.reset}`);
    process.exit(1);
  }
}

// Run the liquid light quality check
runLiquidLightQualityCheck();
