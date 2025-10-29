# Assets

Purpose
- Store binary artifacts needed for reference or sharing: zip bundles, design docs, and other non-source files.

Layout
- `assets/` — general binary assets (e.g., `liquid-light-starter.zip`, `liquid-light-engine.zip`).
- `assets/docs/` — document artifacts (e.g., `.docx` integration plans).

Notes
- Avoid importing these directly in runtime code.
- Prefer linking from documentation with relative paths.
- Consider large file storage practices if size grows (Git LFS, etc.).
