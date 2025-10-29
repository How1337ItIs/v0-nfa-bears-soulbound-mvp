# NFA Bears MVP - Agent Guidelines

## Project Overview
Web3 community platform for Grateful Dead culture using Soulbound Tokens (SBTs) for membership verification. Built with Next.js 15, React 19, Privy authentication, and Berachain Bepolia testnet.

## Project Structure & Module Organization
- `app/`: App Router pages and `app/api/*` routes (`invite`, `invite/verify`, `mint`).
- `components/` (`ui/`, `dashboard/`, `mobile/`): Reusable React components (PascalCase).
- `lib/`: Core utilities (`error-handling.ts`, `viemProvider.ts`, `redis.ts`).
- `hooks/`, `providers/`: Custom hooks and React context/providers.
- `contracts/`, `artifacts/`, `deployments/`: Solidity sources and generated ABIs/metadata.
- `scripts/`: Operational scripts (e.g., `scripts/deploy_membership.js`).
- `public/`, `styles/`: Static assets and Tailwind CSS.
- `data/venues.json`, `types/`: Venue data and TypeScript types.
- `archived-research/`: Archived documentation and research files.

## Build, Test, and Development Commands
- Install: `npm install --legacy-peer-deps` (React 19 compatibility issues).
- Develop: `npm run dev` → Next.js at `http://localhost:3000`.
- Build/Start: `npm run build` then `npm run start` (prod).
- Lint/Typecheck: `npm run lint`, `npm run typecheck`.
- Example scripts: `node scripts/deploy_membership.js`, `npx tsx scripts/sanity-check.ts`.
- Env (create `.env`): `DEPLOYER_PRIVATE_KEY`, `SECRET_KEY`, `REDIS_URL`, `REDIS_TOKEN`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_BEPOLIA_RPC`, `NEXT_PUBLIC_PRIVY_APP_ID`, optional `DEV_SKIP_GPS=true`, `NEXT_PUBLIC_BASE_URL`.

## Current Build Status & Known Issues
- **Production Build**: Passing. `export const dynamic = 'force-dynamic'` applied on pages using Web3/Privy hooks to avoid static pre-render issues.
- **Dev/Prod**: `npm run dev` and `npm run build && npm start` both work with current config.
- **Dependencies**: All critical dependencies installed (`@privy-io/react-auth`, `wagmi`, `viem`, Upstash packages, etc.).
- **React 19 Compatibility**: Use `--legacy-peer-deps` for npm installs due to peer dependency conflicts.

## Coding Style & Naming Conventions
- TypeScript strict; function components only.
- Components: PascalCase files; hooks start with `use*`.
- Routes: App Router conventions (`app/**/page.tsx`, `app/api/**/route.ts`).
- Error handling: use `lib/error-handling.ts` (Logger, APIError, `withErrorHandling`).
- Styling: Tailwind utilities; keep global styles in `styles/globals.css`.

## Testing Guidelines
- No formal unit tests yet. Validate flows via cURL:
  - Generate invite: `curl -X POST :3000/api/invite -H 'Content-Type: application/json' -d '{"venueId":"local-dev"}'`.
  - Verify invite: `curl -X POST :3000/api/invite/verify -H 'Content-Type: application/json' -d '{"code":"...","address":"0x..."}'`.
  - Mint SBT: `curl -X POST :3000/api/mint -H 'Content-Type: application/json' -d '{"address":"0x...","code":"..."}'`.
- Redis check: `node test-redis.js` (or Upstash via `UPSTASH_*`). Add Vitest/Playwright if introducing tests.
- **End-to-End Testing**: Test ambassador → invite → mint flow in dev mode before production deployment.

## Commit & Pull Request Guidelines
- Commits: Imperative; Conventional Commits preferred (e.g., `feat(api): add invite verify`).
- PRs: Small, descriptive; link issues; include screenshots for UI and list env changes.
- Pre-push: `npm run lint` + `npm run build`. Update docs when touching security, env, or APIs.

## Security & Configuration Tips
- Keys: Never commit secrets. Use strong `SECRET_KEY` (≥32 chars). Relayer `DEPLOYER_PRIVATE_KEY` must be `0x` + 64 hex.
- Rate limits: Upstash-based in API routes; do not reduce in production.
- Chain: Berachain Bepolia (id 80069). RPC via `NEXT_PUBLIC_BEPOLIA_RPC`.
- Base URL: Use `NEXT_PUBLIC_BASE_URL` (e.g., `http://localhost:3000`) for links/QRs.
- Venues: Keep `data/venues.json` and any in-route venue constants in sync.

## Colab MCP Integration
- **Status**: ✅ Working - Claude Code and Cursor can communicate via Colab MCP.
- **Preflight**: `npm run dev` and `npm start` now run a non-blocking MCP preflight that verifies sync and prints a short fix hint if misconfigured.
- **Configuration**: MCP configs point to correct log paths:
  - Cursor: `C:\Users\natha\AppData\Roaming\Cursor\logs`
  - Claude: `C:\Users\natha\.claude`
- **Usage**: Use `mcp_colab-mcp_search_logs()` and `mcp_colab-mcp_fetch_transcript()` for inter-agent communication.

## Current Project Status
- **Smart Contract**: Deployed at `0xF0e401E962f2C126A3E44a6708E0884De038E77b` on Berachain Bepolia
- **Dependencies**: All critical packages installed (Privy, Wagmi, Viem, Upstash, etc.)
- **Build**: Production build passes; dynamic rendering set on Web3 pages
- **Next Steps**: Test end-to-end flow, initialize git, prepare for pilot event deployment

## Colab MCP Setup and Usage (Expanded)

- Purpose: Share session context between Claude Code and Cursor, coordinate tasks, and search logs across tools.
- Status: ✅ Working with correct Windows log paths and MCP server config.

### 1) Install
- Require Python 3.10+: verify with `python --version`.
- Install package: `pip install colab-mcp`
- Run installer: `colab-mcp-install` (run as Administrator/elevated on Windows)
- Restart tools: Fully quit and relaunch Cursor and Claude Code.

### 2) Configure (Windows)
Create or update both files with the same server entry:
- `~/.cursor/mcp.json` (Cursor)
- `~/.claude/mcp.json` (Claude Code)

Config snippet:
```
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

Notes:
- Cursor logs path must be `AppData\Roaming\Cursor\logs` (NOT `.cursor-server\data\logs`).
- Keep both configs in sync and restart both apps after editing.

### 3) Request/Response Conventions
- Prefixes: `[CURSOR_REQUEST]` (Claude → Cursor), `[CLAUDE_REQUEST]` (Cursor → Claude)
- Include: `id`, `action`, `priority`, and clear checklist bullets
- Keep messages in the active session; Colab MCP auto-indexes session logs

Examples:
```
[CURSOR_REQUEST] action:browser_test priority:high id:test-001
Please test http://localhost:3000
- Load and screenshot
- Click "Connect Wallet" and verify Privy modal
- Check console for Web3 errors

[CLAUDE_REQUEST] action:code_review priority:high id:review-001
Review app/api/mint/route.ts
- Private key exposure risks
- Rate limiting bypasses
- HMAC signature validation
```

### 4) Useful MCP Tools
- `list_sessions` – List available sessions
- `fetch_transcript` – Retrieve full transcript
- `summarize_session` – Summarize a session
- `search_logs("query")` – e.g., `search_logs("[CURSOR_REQUEST]")`
- `codex_status` – Codex CLI activity (if applicable)

### 5) Troubleshooting
- No messages found: Verify prefixes and that you posted in-session
- Wrong logs path: Use `C:\\Users\\natha\\AppData\\Roaming\\Cursor\\logs`
- Server not found: `pip show colab-mcp`; or run via `python -m colab_mcp.main`
- Config ignored: Validate JSON syntax; restart Cursor and Claude after changes

### 6) Security Practices
- Do not paste secrets in logs or requests
- Reference env keys by name (avoid dumping full `.env`)
- Treat transcripts as sensitive; they may include stack traces and local paths

### 7) Helper Scripts
- Fix config (PowerShell): `powershell -NoProfile -ExecutionPolicy Bypass -File "nfa-bears-mvp\scripts\fix_mcp_config.ps1"`
- Verify config (Node): `node nfa-bears-mvp\scripts\verify_mcp_config.js`
- One-liner (fix + verify): `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'nfa-bears-mvp\scripts\fix_mcp_config.ps1'; node 'nfa-bears-mvp\scripts\verify_mcp_config.js' }"`
 - Preflight is automatic before `dev`/`start`: `npm run mcp:verify` if you need to check manually
