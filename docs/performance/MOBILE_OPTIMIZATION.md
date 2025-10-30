# Mobile Optimization Strategy (W9)

- Detection: `detectMobilePerfHints()` detects `saveData`, `deviceMemory`, and mobile UA.
- Canvas caps: `getMobileCanvasCap()` reduces DPR by tier: low → ~360p, medium → qHD, high → 720p.
- Throttling: On low tier or save-data, the render loop is throttled to ~30fps via a small timeout gate.
- Passive listeners: Resize uses passive listeners to avoid main-thread jank.
- Next steps (optional):
  - Auto-disable post-processing on low tier
  - Texture size clamps by tier
  - Memory pressure hooks (idle cleanup)
