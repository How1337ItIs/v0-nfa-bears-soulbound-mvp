#!/usr/bin/env node
// Verifies local Colab MCP configuration for Cursor and Claude Code on Windows.
// Usage: node scripts/verify_mcp_config.js

const fs = require('fs');
const path = require('path');

function log(ok, msg) {
  const prefix = ok ? '[OK] ' : '[ERR]';
  console.log(`${prefix} ${msg}`);
}

function readJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to read/parse JSON at ${p}: ${e.message}`);
  }
}

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function main() {
  const userProfile = process.env.USERPROFILE || process.env.HOME || '';
  const appData = process.env.APPDATA || path.join(userProfile, 'AppData', 'Roaming');
  if (!userProfile) {
    log(false, 'USERPROFILE/HOME not set; run this on your local machine.');
    process.exit(1);
  }

  const cursorConfig = path.join(userProfile, '.cursor', 'mcp.json');
  const claudeConfig = path.join(userProfile, '.claude', 'mcp.json');
  const logsExpected = path.join(appData, 'Cursor', 'logs');

  let ok = true;

  // Existence checks
  if (exists(cursorConfig)) {
    log(true, `Found Cursor config: ${cursorConfig}`);
  } else {
    log(false, `Missing Cursor config: ${cursorConfig}`);
    ok = false;
  }

  if (exists(claudeConfig)) {
    log(true, `Found Claude config: ${claudeConfig}`);
  } else {
    log(false, `Missing Claude config: ${claudeConfig}`);
    ok = false;
  }

  // Parse and validate both configs if present
  const validate = (label, cfgPath) => {
    try {
      const cfg = readJson(cfgPath);
      const servers = cfg.mcpServers || cfg.mcpservers || cfg.MCPServers;
      if (!servers) throw new Error('Missing mcpServers');
      const colab = servers['colab-mcp'];
      if (!colab) throw new Error("Missing 'colab-mcp' server entry");

      // Validate command/args
      if (colab.command !== 'python') throw new Error("command should be 'python'");
      const args = Array.isArray(colab.args) ? colab.args : [];
      if (!(args.includes('-m') && args.includes('colab_mcp.main'))) {
        throw new Error("args should include ['-m', 'colab_mcp.main']");
      }

      // Validate env
      const env = colab.env || {};
      const keys = ['CLAUDE_HOME', 'CURSOR_LOGS', 'TMPDIR'];
      for (const k of keys) {
        if (!env[k]) throw new Error(`env.${k} missing`);
      }

      // Validate CURSOR_LOGS path matches expectation
      const curLogs = path.normalize(env.CURSOR_LOGS);
      const expected = path.normalize(logsExpected);
      if (curLogs !== expected) {
        throw new Error(`env.CURSOR_LOGS mismatch. Found: ${curLogs} Expected: ${expected}`);
      }

      log(true, `${label}: configuration structure and paths look valid`);
    } catch (e) {
      ok = false;
      log(false, `${label}: ${e.message}`);
    }
  };

  if (exists(cursorConfig)) validate('Cursor mcp.json', cursorConfig);
  if (exists(claudeConfig)) validate('Claude mcp.json', claudeConfig);

  // Check logs directory exists
  if (exists(logsExpected)) {
    log(true, `Cursor logs path exists: ${logsExpected}`);
  } else {
    ok = false;
    log(false, `Cursor logs path not found: ${logsExpected}`);
  }

  if (!ok) {
    console.log('\nSuggested fix:');
    console.log('- Ensure both files exist and match: ~/.cursor/mcp.json and ~/.claude/mcp.json');
    console.log(`- Set env.CURSOR_LOGS to: ${logsExpected}`);
    console.log("- Use args: ['-m', 'colab_mcp.main'] and command: 'python'");
    process.exit(1);
  }

  console.log('\nAll MCP configuration checks passed.');
}

main();

