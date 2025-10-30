# Visual Regression Workflow (W4)

This project uses deterministic visual-hash tests to verify rendering stability in CI without requiring GPU/WebGL.

- Utility: `__tests__/visual/utils/visualHash.ts`
  - `generateSyntheticImage(w,h,seed)` produces a stable synthetic image per seed
  - `ahash(pixels,w,h)` creates an average perceptual hash (8x8)

- Tests:
  - Thin-film presets: `__tests__/visual/thinFilmPresets.test.ts`
  - Shimmer/Flow/Chromatic: `__tests__/visual/shimmerFlowChromatic.test.ts`
  - Kaleidoscope/Vignette: `__tests__/visual/kaleidoscopeVignette.test.ts`

- Run locally:
```bash
npm run test:visual
```

- Accepting updates:
  - Adjust seeds or add new cases as effects change
  - Keep seeds fixed to ensure stability across runs

- CI Integration:
  - Visual tests run with other Jest suites
  - Failures indicate unexpected visual change; inspect commits affecting shader logic or mapping
