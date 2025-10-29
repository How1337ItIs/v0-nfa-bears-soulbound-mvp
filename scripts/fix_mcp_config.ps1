Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Status {
  param(
    [bool]$Ok,
    [string]$Message
  )
  if ($Ok) { Write-Host "[OK]  $Message" -ForegroundColor Green }
  else { Write-Host "[ERR] $Message" -ForegroundColor Red }
}

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Update-Config {
  param([string]$ConfigPath, [string]$ExpectedLogs, [string]$ClaudeHome, [string]$TmpDir)

  if (-not (Test-Path -LiteralPath $ConfigPath)) {
    Write-Status $false "Missing config: $ConfigPath"
    return $false
  }

  $raw = Get-Content -LiteralPath $ConfigPath -Raw
  try {
    $json = $raw | ConvertFrom-Json -ErrorAction Stop
  } catch {
    Write-Status $false "Invalid JSON in $ConfigPath: $($_.Exception.Message)"
    return $false
  }

  if (-not $json.mcpServers) { $json | Add-Member -NotePropertyName mcpServers -NotePropertyValue (@{}) }
  if (-not $json.mcpServers.'colab-mcp') { $json.mcpServers.'colab-mcp' = @{ } }

  $srv = $json.mcpServers.'colab-mcp'
  if (-not $srv.command) { $srv.command = 'python' }
  if (-not $srv.args) { $srv.args = @('-m','colab_mcp.main') }
  if (-not ($srv.args -is [System.Collections.IEnumerable])) { $srv.args = @($srv.args) }

  if (-not $srv.env) { $srv.env = @{ } }
  if (-not $srv.env.CLAUDE_HOME) { $srv.env.CLAUDE_HOME = $ClaudeHome }
  if (-not $srv.env.CURSOR_LOGS) { $srv.env.CURSOR_LOGS = $ExpectedLogs }
  if (-not $srv.env.TMPDIR) { $srv.env.TMPDIR = $TmpDir }

  # Enforce expected values
  $srv.command = 'python'
  $srv.args = @('-m','colab_mcp.main')
  $srv.env.CURSOR_LOGS = $ExpectedLogs
  $srv.env.CLAUDE_HOME = $ClaudeHome
  $srv.env.TMPDIR = $TmpDir

  $out = $json | ConvertTo-Json -Depth 8
  Set-Content -LiteralPath $ConfigPath -Value $out -Encoding UTF8
  Write-Status $true "Patched config: $ConfigPath"
  return $true
}

try {
  $userProfile = $env:USERPROFILE
  if (-not $userProfile) { throw 'USERPROFILE not set; run on your Windows machine.' }

  $appData = $env:APPDATA
  if (-not $appData) { $appData = Join-Path $userProfile 'AppData\Roaming' }

  $cursorConfig = Join-Path $userProfile '.cursor\mcp.json'
  $claudeConfig = Join-Path $userProfile '.claude\mcp.json'
  $expectedLogs = Join-Path $appData 'Cursor\logs'
  $claudeHome = Join-Path $userProfile '.claude'
  $tmpDir = if ($env:TEMP) { $env:TEMP } else { Join-Path $userProfile 'AppData\Local\Temp' }

  Ensure-Dir (Split-Path -Parent $cursorConfig)
  Ensure-Dir (Split-Path -Parent $claudeConfig)
  Ensure-Dir $expectedLogs

  $ok1 = Update-Config -ConfigPath $cursorConfig -ExpectedLogs $expectedLogs -ClaudeHome $claudeHome -TmpDir $tmpDir
  $ok2 = Update-Config -ConfigPath $claudeConfig -ExpectedLogs $expectedLogs -ClaudeHome $claudeHome -TmpDir $tmpDir

  if ($ok1 -and $ok2) {
    Write-Host "\nColab MCP configuration updated successfully." -ForegroundColor Green
    Write-Host "Cursor logs: $expectedLogs" -ForegroundColor DarkGray
  } else {
    Write-Host "\nCompleted with issues. See errors above." -ForegroundColor Yellow
    exit 1
  }
} catch {
  Write-Status $false $_.Exception.Message
  exit 1
}

