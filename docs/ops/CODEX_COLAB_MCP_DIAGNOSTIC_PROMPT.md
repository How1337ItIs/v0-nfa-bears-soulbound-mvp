# Colab MCP Diagnostic & Fix Instructions for Codex

## Your Task

You need to diagnose and fix the Colab MCP (Model Context Protocol) server installation. Follow these steps systematically.

## Step 1: Understand What Colab MCP Is

Colab MCP is a server that allows you to interact with Google Colab notebooks through the MCP protocol. It should show up as `mcp__colab__*` tools in your available tools list.

## Step 2: Check if Colab MCP Tools Are Available

First, check your available tools. Look for any tools that start with `mcp__colab__`.

**If you see them**: Great! The MCP server is connected. Skip to Step 6 to test functionality.

**If you don't see them**: Continue to Step 3.

## Step 3: Check Claude Code Configuration

The Colab MCP server needs to be configured in Claude Code's MCP settings file.

**Action**: Read the Claude Code MCP settings file at:
```
C:\Users\natha\.claude\mcp_settings.json
```

**What to look for**:
- Is there a "colab" entry in the mcpServers configuration?
- Does it have the correct command path?
- Are there any obvious syntax errors?

**Expected format**:
```json
{
  "mcpServers": {
    "colab": {
      "command": "C:\\Users\\natha\\AppData\\Roaming\\Python\\Python313\\Scripts\\colab-mcp.exe",
      "args": []
    }
  }
}
```

## Step 4: Verify the Colab MCP Executable Exists

**Action**: Check if the colab-mcp executable exists at the path specified in the config.

Common locations to check:
1. `C:\Users\natha\AppData\Roaming\Python\Python313\Scripts\colab-mcp.exe`
2. `C:\Users\natha\AppData\Local\Programs\Python\Python313\Scripts\colab-mcp.exe`
3. Run `where colab-mcp` to find it

**If file doesn't exist**: You need to install it. Continue to Step 5.

**If file exists**: The configuration path might be wrong. Update mcp_settings.json with the correct path.

## Step 5: Install Colab MCP (If Needed)

**Action**: Install the colab-mcp package:

```bash
pip install colab-mcp
```

or

```bash
python -m pip install colab-mcp
```

**After installation**:
- Find where it was installed: `where colab-mcp`
- Update the path in `mcp_settings.json`

## Step 6: Restart Required

**IMPORTANT**: After making changes to `mcp_settings.json`, you need to restart Claude Code for the changes to take effect.

Tell the user:
"I've configured the Colab MCP server. Please restart Claude Code (close and reopen the application) for the changes to take effect. After restarting, the mcp__colab__* tools should be available."

## Step 7: Test Functionality (After Restart)

Once the tools are available, test them:

1. **List available Colab MCP tools**: You should see tools like:
   - `mcp__colab__list_notebooks`
   - `mcp__colab__create_notebook`
   - `mcp__colab__execute_code`
   - etc.

2. **Try a simple operation**: For example, list notebooks or create a test notebook

3. **Verify it works**: If you get a successful response, the MCP server is working correctly!

## Common Issues & Fixes

### Issue: "command not found" error
**Fix**: The path to colab-mcp.exe is wrong. Find the correct path with `where colab-mcp` and update mcp_settings.json

### Issue: Python not found
**Fix**: Install Python 3.13 or verify Python is in PATH

### Issue: Permission denied
**Fix**: Run the installation command with appropriate permissions

### Issue: Tools still not showing after restart
**Fix**:
1. Check Claude Code logs for MCP connection errors
2. Verify JSON syntax in mcp_settings.json (no trailing commas, proper quotes)
3. Try running the colab-mcp.exe command directly in terminal to see error messages

## Step 8: Report Back

Once you've completed the diagnostic:

1. **Tell the user what you found**: Was it installed? Was the config wrong? Did you fix it?
2. **Tell the user what they need to do**: Do they need to restart? Run additional commands?
3. **Provide next steps**: How to test it's working after any required restarts

## Example Response Template

"I've diagnosed the Colab MCP setup. Here's what I found:

**Status**: [Not installed / Installed but misconfigured / Installed and configured]

**Actions I took**:
- [List what you did]

**What you need to do**:
1. [User action required, e.g., restart Claude Code]
2. [Any additional steps]

**After restart, you should see**:
- mcp__colab__* tools available in my tool list
- Ability to interact with Google Colab notebooks

**To test it's working**:
- Ask me to 'list my Colab notebooks' or 'create a new Colab notebook'
- I should be able to execute those commands successfully"

---

## Important Notes

- You CANNOT restart Claude Code yourself - the user must do this
- Always verify file paths exist before writing them to config
- Use double backslashes `\\` in JSON paths on Windows
- The MCP server runs as a separate process that Claude Code connects to
- Check for error messages in terminal output when running commands

Now proceed with the diagnostic!
