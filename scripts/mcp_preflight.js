#!/usr/bin/env node
// Lightweight preflight to ensure Colab MCP sync is configured.
// - Runs verify script if present
// - Prints concise warnings but does not fail dev/start

const { spawnSync } = require('child_process');
const path = require('path');

function runVerify() {
  const script = path.join(__dirname, 'verify_mcp_config.js');
  const res = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  // verify_mcp_config exits 1 on issues; we catch and print a short hint
  if (res.status !== 0) {
    const hint = [
      '[MCP PREFLIGHT] Colab MCP not verified. Dev will continue.',
      ' - To fix automatically (Windows): npm run mcp:fix',
      ' - To verify again: npm run mcp:verify',
      ' - Ensure ~/.cursor/mcp.json and ~/.claude/mcp.json have a colab-mcp server with',
      "   command: 'python', args: ['-m','colab_mcp.main'] and correct env paths",
    ].join('\n');
    console.warn(hint);
    return false;
  }
  console.log('[MCP PREFLIGHT] Colab MCP verified.');
  return true;
}

try {
  runVerify();
} catch (e) {
  console.warn('[MCP PREFLIGHT] Skipped (verify script error):', e.message);
}

