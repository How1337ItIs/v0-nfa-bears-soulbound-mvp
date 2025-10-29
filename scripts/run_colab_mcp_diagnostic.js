#!/usr/bin/env node
// Colab MCP Diagnostic for Codex CLI (Windows paths via WSL mount)
// Mirrors the steps in CODEX_COLAB_MCP_DIAGNOSTIC_PROMPT.md

const fs = require('fs');
const path = require('path');

function p(...parts) {
  return path.join(...parts);
}

function readJsonSafe(fp) {
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function exists(fp) {
  try { return fs.existsSync(fp); } catch { return false; }
}

function main() {
  const winUser = 'natha';
  const base = '/mnt/c/Users/' + winUser;
  const claudeDir = p(base, '.claude');
  const claudeSettings = p(claudeDir, 'mcp_settings.json');
  const claudeMcpJson = p(claudeDir, 'mcp.json');

  const results = { steps: [] };

  // Step 2: Tool check is not possible here (no MCP runtime in this sandbox)
  results.steps.push({ step: 'tool_check', status: 'skipped', reason: 'MCP tool enumeration not available in Codex sandbox' });

  // Step 3: Read Claude config(s)
  const hasSettings = exists(claudeSettings);
  const hasMcpJson = exists(claudeMcpJson);
  let settingsJson = null;
  let mcpJson = null;
  if (hasSettings) settingsJson = readJsonSafe(claudeSettings);
  if (hasMcpJson) mcpJson = readJsonSafe(claudeMcpJson);
  results.steps.push({ step: 'read_configs', claudeSettings: hasSettings, claudeMcpJson: hasMcpJson, validSettingsJson: !!settingsJson, validMcpJson: !!mcpJson });

  // Inspect for server entries
  let settingsHasColab = false;
  let settingsCmd = null;
  if (settingsJson && settingsJson.mcpServers && settingsJson.mcpServers.colab) {
    settingsHasColab = true;
    settingsCmd = settingsJson.mcpServers.colab.command || null;
  }

  let mcpHasColab = false;
  let mcpCmd = null;
  if (mcpJson && mcpJson.mcpServers && (mcpJson.mcpServers['colab-mcp'] || mcpJson.mcpServers['colab'])) {
    const entry = mcpJson.mcpServers['colab-mcp'] || mcpJson.mcpServers['colab'];
    mcpHasColab = true;
    mcpCmd = entry.command || null;
  }
  results.steps.push({ step: 'inspect_servers', settingsHasColab, settingsCmd, mcpHasColab, mcpCmd });

  // Step 4: Check colab-mcp executable common locations
  const commonExePaths = [
    p(base, 'AppData', 'Roaming', 'Python', 'Python313', 'Scripts', 'colab-mcp.exe'),
    p(base, 'AppData', 'Local', 'Programs', 'Python', 'Python313', 'Scripts', 'colab-mcp.exe'),
  ];
  const exeStatus = commonExePaths.map(fp => ({ path: fp, exists: exists(fp) }));
  results.steps.push({ step: 'check_exe', exeStatus });

  // Output concise diagnostics
  function log(msg, obj) { console.log(msg + (obj ? ' ' + JSON.stringify(obj, null, 2) : '')); }

  log('[DIAG] Claude settings path', { claudeSettings, present: hasSettings });
  log('[DIAG] Claude mcp.json path', { claudeMcpJson, present: hasMcpJson });
  log('[DIAG] Server entries', { settingsHasColab, mcpHasColab });
  log('[DIAG] Common colab-mcp.exe locations', exeStatus);

  // Summary + next steps
  const okConfig = (settingsHasColab || mcpHasColab) && (exeStatus.some(e => e.exists));
  if (okConfig) {
    console.log('\n[SUMMARY] Colab MCP appears installed and configured. If tools still do not appear, restart Claude Code.');
    process.exit(0);
  } else {
    console.log('\n[SUMMARY] Colab MCP not fully verified.');
    if (!settingsHasColab && !mcpHasColab) console.log('- Missing colab server entry in Claude config (mcp_settings.json or mcp.json).');
    if (!exeStatus.some(e => e.exists)) console.log('- Could not find colab-mcp.exe in common locations; try: pip install colab-mcp');
    console.log('\nFollow-up actions:');
    console.log('1) Install: pip install colab-mcp');
    console.log('2) Find exe: run Windows "where colab-mcp" and update Claude config path if needed');
    console.log('3) Restart Claude Code');
    process.exit(1);
  }
}

main();

