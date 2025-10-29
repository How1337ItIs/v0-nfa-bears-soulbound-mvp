# Logs

Purpose
- Store build and runtime diagnostic logs (`build-output.log`, `fluid-debug-*.log`, `check_server.txt`) for cross-agent analysis and collaboration.

Notes
- Keep logs committed for cross-agent sharing unless they become too large or noisy.
- Rotate or prune older logs as needed; prefer timestamped filenames.
- Do not reference logs by hardcoded paths in code; use relative paths only within documentation.
