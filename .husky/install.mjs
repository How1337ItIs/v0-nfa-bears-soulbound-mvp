#!/usr/bin/env node
/**
 * Husky install script for Liquid Light System
 * 
 * Sets up Git hooks for the liquid light system
 * with proper permissions and configurations.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { execSync } from 'child_process';
import { existsSync, chmodSync } from 'fs';
import { join } from 'path';

const huskyDir = join(process.cwd(), '.husky');

console.log('🎨 Setting up Liquid Light Git hooks...');

// Create .husky directory if it doesn't exist
if (!existsSync(huskyDir)) {
  execSync(`mkdir -p ${huskyDir}`, { stdio: 'inherit' });
}

// Set up hooks
const hooks = [
  'pre-commit',
  'pre-push', 
  'commit-msg',
  'post-commit'
];

hooks.forEach(hook => {
  const hookPath = join(huskyDir, hook);
  if (existsSync(hookPath)) {
    chmodSync(hookPath, '755');
    console.log(`✅ ${hook} hook configured`);
  } else {
    console.log(`⚠️  ${hook} hook not found`);
  }
});

console.log('🎉 Liquid Light Git hooks setup complete!');
