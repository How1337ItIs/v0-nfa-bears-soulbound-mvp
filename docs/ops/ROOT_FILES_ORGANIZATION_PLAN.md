# Root Files Organization Plan (Non-Destructive)

Purpose: Document recommended destinations for root-level files without moving anything yet. This avoids breaking any path-based references. Use this as a checklist for future safe moves once references are audited.

Legend
- Type: config | log | build | doc | asset | script | schema | env | binary
- Risk: low (unlikely to be referenced by path), medium (referenced in docs/links), high (likely imported/required)

## Proposed Mapping

| File | Type | Recommended Destination | Risk | Notes |
|---|---|---|---|---|
| build-output.log | log | `nfa-bears-mvp/logs/` | low | Build artifact; rotate or gitignore large logs |
| CODEX_COLAB_MCP_DIAGNOSTIC_PROMPT.md | doc | `docs/ops/` | medium | Cross-agent ops prompt/reference |
| package.json | config | KEEP | high | Root package manager config |
| COORDINATION_SETUP_LOG.md | doc | `docs/ops/` | low | Coordination status/log |
| CLAUDE.md | doc | `docs/reports/` | medium | Agent-specific report |
| cursor_observe_my_codebase.md | doc | `docs/reports/` | medium | Large analysis; links may need updates |
| AUTONOMOUS_SESSION_COMPLETE.md | doc | `docs/ops/` | medium | Session summary |
| CULTURAL_ENHANCEMENTS.md | doc | `docs/reports/` | medium | Design/cultural notes |
| FEATURE_AUDIT.md | doc | `docs/ops/` | medium | Product/feature checklist |
| NFA_BEARS_SPECIALIZED_AGENT_PROMPT.md | doc | `docs/ops/` | medium | Agent ops prompt |
| SESSION_SUMMARY.txt | log | `docs/ops/` or `logs/` | low | Session text summary |
| CULTURAL_LANGUAGE_GUIDE.md | doc | `docs/reports/` | medium | Cultural style guide |
| FIX_SUMMARY.md | doc | `docs/ops/` | medium | Fix/change summary |
| tsconfig.tsbuildinfo | build | KEEP (gitignored) | high | Build cache file |
| package-lock.json | config | KEEP | high | Lockfile |
| next.config.js | config | KEEP | high | Next.js config |
| .env | env | KEEP (local) | high | Never move or commit |
| PILOT_EVENT_SIMULATION.md | doc | `docs/guides/` | medium | Operational playbook |
| AMBASSADOR_TRAINING.md | doc | `docs/guides/` | medium | Training content |
| fluid-debug-*.log | log | `nfa-bears-mvp/logs/` | low | Runtime debug logs |
| postcss.config.js | config | KEEP | high | Build config |
| next-env.d.ts | build | KEEP | high | Next.js typing |
| liquid-light-starter.zip | asset | `nfa-bears-mvp/assets/` | medium | External asset bundle |
| chatgpt-research-1.txt | doc | `docs/research-archive/` | medium | Text research |
| pnpm-lock.yaml | config | KEEP | high | Lockfile |
| postcss.config.mjs | config | KEEP | high | Build config variant |
| tsconfig.json | config | KEEP | high | TS config |
| .gitignore | config | KEEP | high | Git config |
| components.json | schema | KEEP | high | UI schema (Shadcn) |
| liquid-light-engine.zip | asset | `nfa-bears-mvp/assets/` | medium | Engine bundle |
| tailwind.config.js | config | KEEP | high | Tailwind config |
| AUDIT-FINDINGS.md | doc | `docs/ops/` | medium | Audit notes |
| claude-md-redesign-process.md | doc | `docs/reports/` | medium | Process writeup |
| deployed.json | config | KEEP | high | Deployment metadata consumed by app/scripts |
| hardhat.config.cjs | config | KEEP | high | Hardhat config |
| test-redis.js | script | `scripts/` | high | Already in `nfa-bears-mvp/`; verify imports before moving |
| web3-design-methodology.md | doc | `docs/reports/` | medium | Design methodology |
| web3-dev-best-practices.md | doc | `docs/guides/` | medium | Engineering best practices |
| check_server.txt | log | `nfa-bears-mvp/logs/` | low | Temp check output |
| eslint.config.mjs | config | KEEP | high | ESLint config |
| MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md | doc | `docs/reports/` | medium | High-level plan |
| README.md | doc | KEEP | high | Root project README (already points to docs) |
| Integration Plan for Liquid Light Show Aesthetics in NFA Bears App (1).docx | binary | `nfa-bears-mvp/assets/docs/` | medium | Keep for reference; large file |

## Guidance for Safe Future Moves

1) Pre-move audit
- Search imports/links: ripgrep for exact filenames and prior paths
- Update internal links in other docs to new location
- For code imports, only move after confirming there are none (or refactor safely)

2) Execution order
- Create destination folders first (`logs/`, `assets/`, `assets/docs/`)
- Move low-risk logs and binaries first
- Update docs links via relative paths and re-run link check

3) Non-goals (now)
- Do not move configs, lockfiles, envs, or any file possibly referenced by build/runtime
- Do not rename files (identifiers may be referenced in scripts/docs)

## Next Actions (Proposed, Non-Destructive)
- Create folders only: `nfa-bears-mvp/logs/`, `nfa-bears-mvp/assets/`, `nfa-bears-mvp/assets/docs/`
- Optionally add these folders to `.gitignore` where appropriate for large artifacts
- Keep this plan updated as references are audited
