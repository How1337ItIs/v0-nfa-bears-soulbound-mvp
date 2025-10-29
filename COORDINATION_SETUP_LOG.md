# Agent Coordination Setup Log

**Date**: October 29, 2025
**Objective**: Enable seamless coordination between Claude Code (terminal) and Cursor (IDE with new @Browser feature) for collaborative NFA Bears MVP development

## Background

Cursor 2.0 was released today with a new `@Browser` feature that provides agents with visibility into browser state, console logs, network traffic, and screenshots directly in the chat interface. The goal was to enable Claude Code (running in terminal) to leverage this capability through coordination with Cursor.

## Solution Implemented: Colab MCP

**Colab MCP** (Model Context Protocol) is an existing open-source tool that enables context sharing between AI coding assistants (Claude Code, Cursor, Codex CLI) by indexing session logs.

**Why Colab MCP**:
- Minimal engineering required (existing solution)
- Real-time session transcript indexing
- Searchable message history across agents
- Bidirectional communication via shared log access
- Supports multiple agents: Claude Code, Cursor, Codex CLI

**Installation**:
```bash
pip install colab-mcp
colab-mcp-install  # Requires elevated shell on Windows
```

## Configuration Journey

### Initial Attempt (Failed)

**Mistake #1: Custom Log Files**
- Wrote test requests to `~/.claude/browser-test-requests.log`
- Assumed Colab MCP would read arbitrary log files
- **Problem**: Colab MCP only indexes tracked session conversations, not custom files
- **Result**: Cursor struggled ~79 lines to find the message

**Lesson**: Write messages directly in session conversations. Colab MCP auto-tracks.

### Configuration Error (Fixed)

**Mistake #2: Wrong CURSOR_LOGS Path**
Both `~/.cursor/mcp.json` and `~/.claude/mcp.json` initially configured with:
```json
"CURSOR_LOGS": "C:\\Users\\natha\\.cursor-server\\data\\logs"  // WRONG
```

**Diagnostic Process**:
1. Cursor still couldn't find messages after format improvements
2. Created comprehensive diagnostic prompt for Cursor
3. Cursor discovered path didn't exist on the system
4. Correct path: `C:\\Users\\natha\\AppData\\Roaming\\Cursor\\logs`

**Fix Applied**:
Both config files updated with correct paths:
```json
{
  "mcpServers": {
    "colab-mcp": {
      "command": "python",
      "args": ["-m", "colab_mcp.main"],
      "env": {
        "CLAUDE_HOME": "C:\\Users\\natha\\.claude",
        "CURSOR_LOGS": "C:\\Users\\natha\\AppData\\Roaming\\Cursor\\logs",
        "TMPDIR": "C:\\Users\\natha\\AppData\\Local\\Temp"
      }
    }
  }
}
```

**Verification**: After fix, Cursor successfully found 11+ messages with `[CURSOR_REQUEST]` prefix.

## Message Format Protocol

Established standardized format for inter-agent communication:

### From Claude Code → Cursor:
```
[CURSOR_REQUEST] id:unique-id action:action_type priority:high/medium/low
Description of request
- Specific task details
- Expected deliverables
```

### From Cursor → Claude Code:
```
[CLAUDE_REQUEST] id:unique-id action:action_type priority:high/medium/low
Description of request
- Specific task details
```

### From Any Agent → Codex:
```
[CODEX_REQUEST] id:unique-id action:action_type priority:high/medium/low
Description of terminal commands to run
- Command list
- Expected outputs
```

### From Any Agent → Any Agent (Generic Response):
```
[RESPONSE] id:request-id status:completed/failed/in_progress
Response details
- Results
- Additional context
```

### Searching for Messages:

**In Cursor**:
```javascript
search_logs("[CURSOR_REQUEST]")
search_logs("[RESPONSE]")
search_logs("unique-id")
```

**In Claude Code**:
```javascript
search_logs("[CLAUDE_REQUEST]")
search_logs("[CODEX_REQUEST]")
search_logs("[RESPONSE]")
search_logs("unique-id")
```

**In Codex**:
```javascript
search_logs("[CODEX_REQUEST]")
search_logs("priority:high")
```

## Key Learnings

### What Worked:
1. **Existing solution vs custom build**: Colab MCP provided everything needed without custom engineering
2. **Standardized message format**: Clear prefixes make searching efficient
3. **Diagnostic approach**: When communication failed, comprehensive diagnostic prompt helped Cursor identify the root cause
4. **Direct session messages**: Writing in session conversations (not custom files) ensures Colab MCP indexing

### What Didn't Work:
1. **Custom log files**: Colab MCP doesn't read arbitrary files
2. **Assumed paths**: Initial configuration used wrong Windows path for Cursor logs
3. **Programmatic @Browser access**: Cannot call `@Browser` directly from Claude Code terminal (it's a Cursor UI feature)

### Critical Success Factors:
1. **Correct Windows paths**: `AppData\Roaming\Cursor\logs` (NOT `.cursor-server\data\logs`)
2. **Consistent message prefixes**: `[CURSOR_REQUEST]`, `[CLAUDE_REQUEST]`
3. **Unique IDs**: Enable request/response tracking
4. **Full tool restarts**: Both Cursor and Claude Code must be fully quit and relaunched after config changes

## Current Status

✅ **Operational**: All agents can search_logs() and find each other's messages
✅ **Three-Agent System**: Claude Code + Cursor + Codex CLI now coordinating
✅ **Documented**: CLAUDE.md contains usage instructions and best practices
✅ **Dev Server**: Running on localhost:3000 for browser testing
⏳ **First Test Pending**: Browser test request written, awaiting Cursor execution

## Update: Codex Added to Coordination

**Date**: Same session as initial setup

Codex CLI was brought into the coordination system, creating a three-agent workflow:
- **Claude Code**: Strategic planning, code analysis, architecture decisions
- **Cursor**: Visual/browser testing via @Browser, design review, UI feedback
- **Codex CLI**: Terminal command execution, build/test automation, quick checks

**Message Format for Codex**:
```
[CODEX_REQUEST] id:unique-id action:action_type priority:level
Task description
```

**Example Three-Agent Workflow**:
1. Claude Code identifies work needed → sends `[CODEX_REQUEST]` for build check
2. Codex executes commands → returns `[RESPONSE]` with results
3. Claude Code analyzes errors → sends `[CURSOR_REQUEST]` for visual context
4. Cursor uses @Browser → provides screenshot + recommendations

**Colab MCP Tools for Codex**:
- `codex_status` - Check if Codex CLI is active
- `search_logs("[CODEX_REQUEST]")` - Find pending requests
- All standard MCP tools (list_sessions, fetch_transcript, etc.)

## Example First Request

```
[CURSOR_REQUEST] id:nfa-homepage-001 action:browser_test priority:high
Please test http://localhost:3000 homepage:
- Navigate and take screenshot
- Verify NFA Bears branding/logo visible
- Verify "Connect Wallet" button visible
- Check browser console for errors
- Test wallet connection flow (click button, verify Privy modal appears)
- Report visual state and any issues found
```

Cursor can find this via: `search_logs("nfa-homepage-001")`

## Files Modified

1. **`~/.cursor/mcp.json`**: Added/fixed colab-mcp configuration
2. **`~/.claude/mcp.json`**: Created with colab-mcp configuration
3. **`CLAUDE.md`**: Added "Agent Coordination (Colab MCP)" section with:
   - Message format standards
   - Search patterns
   - Best practices
   - Configuration examples
   - Common coordination patterns

## Next Steps

1. Execute first browser test request via Cursor @Browser
2. Refine message format based on real-world usage
3. Document additional coordination patterns as they emerge
4. Consider automating common request/response flows

## References

- **Colab MCP**: Open-source MCP server for AI agent coordination
- **Cursor 2.0 @Browser**: Released Oct 29, 2025 - native browser control in IDE
- **MCP Protocol**: JSON-RPC based protocol for AI tool interoperability

---

**Conclusion**: Successfully established real-time coordination system between Claude Code and Cursor using minimal custom engineering. The system is operational and ready for collaborative development workflows, particularly browser-based UI testing and design work.
