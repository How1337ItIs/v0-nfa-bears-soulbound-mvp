# 🔥 CURSOR MASSIVE TODO LIST - Week 1 Completion & Week 2 Prep
## You Asked For It - Here's 60+ Tasks Across All Workstreams

**Created**: 2025-10-29 14:30 UTC
**From**: Claude Code
**For**: Cursor (parallel execution partner)
**Context**: Master Liquid Light Integration Plan execution
**Your Status**: "READY FOR MASSIVE WORKLOAD" - Challenge accepted! 🚀

---

## 📋 WORKSTREAM 1: Week 1 Integration Sprint (15 tasks)

### Priority: CRITICAL - Complete This Week

**1.1 LiquidLightBackground Integration** (5 tasks)

- [ ] **Task 1.1.1**: Integrate PaletteDirector into LiquidLightBackground.tsx
  - Import: `import { PaletteDirector } from '@/lib/palette';`
  - Replace hardcoded colors with: `PaletteDirector.getCurrentColorsRGB()`
  - Update fluid config to use palette colors
  - Test palette switching updates fluid colors in real-time

- [ ] **Task 1.1.2**: Wire audio mapping to LiquidLightBackground.tsx
  - Import: `import { calculatePhysicsParams } from '@/lib/audio';`
  - Replace manual physics calculations with: `const params = calculatePhysicsParams(audioData);`
  - Verify thermal rate uses mapped values
  - Confirm splat force responds to bass

- [ ] **Task 1.1.3**: Add intensity control to LiquidLightBackground.tsx
  - Accept `intensity` prop (0-1 range)
  - Scale all visual effects by intensity multiplier
  - Apply to: splat force, thermal rate, dye amount, opacity
  - Test intensity slider smoothly affects visuals

- [ ] **Task 1.1.4**: Add motion toggle to LiquidLightBackground.tsx
  - Accept `motionEnabled` prop (boolean)
  - When false: freeze fluid simulation (stop splats, reduce velocity to near-zero)
  - When true: resume normal motion
  - Test toggle responds within 100ms

- [ ] **Task 1.1.5**: Implement prefers-reduced-motion detection
  - Check `window.matchMedia('(prefers-reduced-motion: reduce)')`
  - Auto-set motionEnabled = false if user prefers reduced motion
  - Add listener for preference changes
  - Test with system settings toggled

---

**1.2 User Controls Integration** (5 tasks)

- [ ] **Task 1.2.1**: Mount LiquidLightControls in app
  - Add to `app/layout.tsx` OR create settings page
  - Position: bottom-right fixed (as designed)
  - Ensure z-index doesn't conflict with other UI
  - Test controls are accessible on all pages

- [ ] **Task 1.2.2**: Create global visual state management
  - Options: React Context, Zustand, or localStorage
  - State: `{ intensity, paletteId, mode, motionEnabled }`
  - Persist to localStorage for user preferences
  - Test state persists across page refreshes

- [ ] **Task 1.2.3**: Wire controls to LiquidLightBackground
  - Pass state from controls to background component
  - Ensure real-time updates (no lag)
  - Test: Intensity slider → immediate visual change
  - Test: Palette selector → colors update within 1 second

- [ ] **Task 1.2.4**: Implement mode presets
  - Off mode: motionEnabled=false, intensity=0
  - Ambient mode: motionEnabled=true, intensity=0.5
  - Dance Floor mode: motionEnabled=true, intensity=0.8
  - Trip mode: motionEnabled=true, intensity=1.0
  - Test each mode applies correct settings

- [ ] **Task 1.2.5**: Add keyboard shortcuts (optional enhancement)
  - Press 'L' to toggle controls panel
  - Press '1-4' to switch modes quickly
  - Press '+/-' to adjust intensity
  - Test shortcuts don't conflict with text inputs

---

**1.3 CSS Fallback Integration** (3 tasks)

- [ ] **Task 1.3.1**: Replace inline CSS fallback in LiquidLightBackground.tsx
  - Remove hardcoded gradient fallback
  - Import and use: `<CSSFallback intensity={intensity} motionEnabled={motionEnabled} />`
  - Ensure fallback uses current palette
  - Test WebGL context loss triggers CSS fallback

- [ ] **Task 1.3.2**: Test CSS fallback visual quality
  - Disable WebGL in browser settings
  - Verify CSS fallback activates automatically
  - Check colors match selected palette
  - Confirm motion animations work
  - Validate looks acceptable (not broken)

- [ ] **Task 1.3.3**: Optimize CSS fallback performance
  - Reduce animation complexity if needed
  - Test on low-end device (if available)
  - Confirm <5% CPU usage
  - Verify no layout shifts or jank

---

**1.4 Testing & Validation** (2 tasks)

- [ ] **Task 1.4.1**: Run development server end-to-end test
  - Start: `npm run dev`
  - Navigate to homepage
  - Verify liquid light renders
  - Open controls panel
  - Test each control works
  - Check dev HUD shows correct data
  - Monitor console for errors (none expected)

- [ ] **Task 1.4.2**: Test build process
  - Run: `npm run build`
  - Verify no TypeScript errors
  - Verify no build warnings
  - Check bundle size impact of new services (<50KB expected)
  - Test production build locally

---

## 📋 WORKSTREAM 2: Week 2 Orchestration Architecture (20 tasks)

### Priority: HIGH - Prepare Foundation for Next Week

**2.1 VisualOrchestrator Provider** (8 tasks)

- [ ] **Task 2.1.1**: Create VisualOrchestrator.tsx skeleton
  - File: `lib/visual/orchestrator/VisualOrchestrator.tsx`
  - React Context Provider pattern
  - State: GlobalVisualState interface
  - Reference: Master Plan Appendix B for example code

- [ ] **Task 2.1.2**: Implement device detection in orchestrator
  - On mount: Call CapabilityDetector
  - Determine initial tier (low/medium/high/ultra)
  - Store in state for access by children
  - Check battery status and prefers-reduced-motion

- [ ] **Task 2.1.3**: Integrate AudioBus into orchestrator
  - Import useAudioReactive hook
  - Provide audio data to all children via context
  - Ensure single analyzer instance (no duplicates)
  - Test audio data flows to consumers

- [ ] **Task 2.1.4**: Integrate PaletteDirector into orchestrator
  - Get current palette on state change
  - Provide palette data to all children
  - Subscribe to palette changes
  - Test palette switching updates all consumers

- [ ] **Task 2.1.5**: Implement global state management
  - State: motionEnabled, intensity, pureMode, selectedPalette, mode, batterySaver
  - Provide setState function for updates
  - Implement state persistence (localStorage)
  - Test state updates propagate to all consumers

- [ ] **Task 2.1.6**: Create useVisualState hook
  - File: `lib/visual/orchestrator/useVisualState.ts`
  - Access context safely (throw error if outside provider)
  - Provide convenient access to: state, deviceTier, audioData, palette
  - Type-safe with full TypeScript support

- [ ] **Task 2.1.7**: Implement Pure Mode logic
  - When pureMode=true: Force profile to MEDIUM (CSS + WebGL fluid only)
  - Disable thin-film even if tier==='high'
  - Disable WebGPU even if supported
  - URL parameter support: `?pureMode=true`

- [ ] **Task 2.1.8**: Add battery saver mode
  - Detect: `navigator.getBattery()` if available
  - If battery <20%: Set batterySaver=true, force LOW tier
  - Listen for battery level changes
  - User can override via toggle

---

**2.2 Layer Coordinator** (6 tasks)

- [ ] **Task 2.2.1**: Create LayerCoordinator utility
  - File: `lib/visual/orchestrator/layerCoordinator.ts`
  - Function: `getLayerConfigs(policy: VisualPolicy): LayerConfig[]`
  - Returns which layers to mount based on tier
  - Includes z-index, blend mode, opacity for each

- [ ] **Task 2.2.2**: Implement layer mounting logic
  - Function: `shouldMountLayer(layerName: string, policy: VisualPolicy): boolean`
  - Check tier requirements
  - Check user preferences (pureMode, batterySaver)
  - Check FPS thresholds
  - Return boolean for conditional rendering

- [ ] **Task 2.2.3**: Define z-index stacking
  - CSS Fallback: -50
  - WebGL Fluid: -40
  - Thin-Film: -30
  - WebGPU Particles: -20
  - UI: 0 and above (never covered)

- [ ] **Task 2.2.4**: Define blend mode strategy
  - CSS: normal
  - WebGL Fluid: screen (current)
  - Thin-Film: screen or overlay (test which looks better)
  - WebGPU: screen with low opacity

- [ ] **Task 2.2.5**: RAF loop coordination strategy
  - Document approach: Single master RAF or coordinated separate loops?
  - Consider: webgl-fluid-enhanced has internal RAF, R3F has internal RAF
  - Recommendation: Let each run independently but sync via shared state
  - Alternative: Investigate merging into single RAF (complex, may not be worth it)

- [ ] **Task 2.2.6**: Layer lifecycle management
  - Document mounting sequence (to avoid visual flicker)
  - Unmounting cleanup checklist
  - Context loss handling per layer
  - Memory disposal verification

---

**2.3 Performance Monitoring** (6 tasks)

- [ ] **Task 2.3.1**: Create PerformanceMonitor class
  - File: `lib/visual/performance/PerformanceMonitor.ts`
  - Track: FPS, frame count, last check time
  - Methods: tick(), getFPS(), shouldStepDown(), shouldStepUp(), reset()
  - Reference: Master Plan Task 6 for Codex

- [ ] **Task 2.3.2**: Integrate PerformanceMonitor into LiquidLightBackground
  - Create instance on mount
  - Call tick() on each frame
  - Check shouldStepDown() every 60 frames
  - Apply tier changes when thresholds crossed

- [ ] **Task 2.3.3**: Add memory monitoring
  - Use: `performance.memory` API (Chrome only)
  - Track: usedJSHeapSize over time
  - Warn if >100MB
  - Log to dev HUD

- [ ] **Task 2.3.4**: Add GPU time budget tracking
  - Estimate frame time: 16.67ms for 60fps, 33.33ms for 30fps
  - Measure: Time from frame start to frame end
  - Warn if exceeding budget
  - Consider reducing quality if consistently over

- [ ] **Task 2.3.5**: Implement step-down cooldown
  - Don't step down more than once per 5 seconds
  - Prevent rapid oscillation between tiers
  - Track last step-down time
  - Test tier doesn't flicker

- [ ] **Task 2.3.6**: Implement step-up delay
  - Require 3 seconds of good FPS before stepping up
  - More conservative than step-down
  - Prevent premature quality increase
  - Test tier only increases when stable

---

## 📋 WORKSTREAM 3: Testing & Validation Marathon (15 tasks)

### Priority: HIGH - Quality Assurance

**3.1 Component Testing** (5 tasks)

- [ ] **Task 3.1.1**: Test LiquidLightControls component
  - Render in isolation
  - Test each control (intensity, palette, mode, motion)
  - Verify callbacks fire correctly
  - Check color preview displays correctly
  - Confirm UI is responsive on mobile sizes

- [ ] **Task 3.1.2**: Test CSSFallback component
  - Render in isolation
  - Test with different palettes (verify colors change)
  - Test with different intensities (verify opacity scales)
  - Test motion toggle (animations pause/resume)
  - Check visual quality (looks good, not broken)

- [ ] **Task 3.1.3**: Test PaletteDirector service
  - Test: getPalette() returns correct palette
  - Test: setCurrentPalette() changes active palette
  - Test: getColorRGB() returns correct values
  - Test: wavelengthToRGB() matches expected outputs
  - Test: interpolateColors() produces smooth gradients

- [ ] **Task 3.1.4**: Test audio mapping functions
  - Test: calculatePhysicsParams() with sample audio data
  - Verify: Bass high → Splat force high
  - Verify: Mids high → Thermal rate high
  - Verify: Treble high → Color phase shifts
  - Check: Null audio returns BASE values

- [ ] **Task 3.1.5**: Test CapabilityDetector
  - Mock different device scenarios
  - Verify: Desktop high-end → tier='high'
  - Verify: Mobile mid-range → tier='medium'
  - Verify: Old device → tier='low'
  - Check: WebGL detection works correctly

---

**3.2 Integration Testing** (5 tasks)

- [ ] **Task 3.2.1**: Test full liquid light stack renders
  - Start dev server
  - Navigate to homepage
  - Verify liquid light background renders
  - Check no console errors
  - Confirm dev HUD appears (development mode)

- [ ] **Task 3.2.2**: Test palette switching end-to-end
  - Open controls panel
  - Change palette from Classic to Dark Star
  - Verify background colors update
  - Check transition is smooth (no flicker)
  - Test 3-4 different palettes

- [ ] **Task 3.2.3**: Test intensity slider end-to-end
  - Slide from 0 to 100%
  - Verify visual effects scale smoothly
  - Check no stuttering or lag
  - Test at 0%: effects minimal but visible
  - Test at 100%: effects at maximum

- [ ] **Task 3.2.4**: Test mode presets end-to-end
  - Click "Off" mode → verify motion stops, intensity=0
  - Click "Ambient" mode → verify moderate effects
  - Click "Dance Floor" mode → verify intense effects
  - Click "Trip" mode → verify maximum effects
  - Check transitions are smooth

- [ ] **Task 3.2.5**: Test audio reactivity end-to-end
  - Play music OR use simulated audio
  - Verify visual effects pulse with beats
  - Check bass frequencies trigger splats
  - Confirm treble affects color shifts
  - Test with/without microphone permission

---

**3.3 Fallback & Edge Case Testing** (5 tasks)

- [ ] **Task 3.3.1**: Test WebGL context loss
  - Simulate: Open Chrome DevTools → Rendering → Force WebGL context loss
  - Verify: CSS fallback activates immediately
  - Check: No blank screen or crash
  - Confirm: User can continue using app
  - Test: Context restore if available

- [ ] **Task 3.3.2**: Test prefers-reduced-motion
  - Enable system setting: prefers-reduced-motion
  - Verify: Motion auto-disables on load
  - Check: CSS fallback uses static gradients
  - Test: User can override via controls
  - Confirm: Respect user preference by default

- [ ] **Task 3.3.3**: Test microphone permission denial
  - Deny microphone access when prompted
  - Verify: Falls back to simulated audio
  - Check: Visual effects still animate
  - Confirm: No error messages shown
  - Test: Visuals look good without real audio

- [ ] **Task 3.3.4**: Test on devices without WebGL
  - Disable WebGL in browser OR test in old browser
  - Verify: CSS fallback activates
  - Check: App remains functional
  - Confirm: Fallback looks decent
  - Test: No JavaScript errors

- [ ] **Task 3.3.5**: Test rapid tier switching
  - Manually trigger FPS drops (open heavy tabs)
  - Verify: Tier steps down appropriately
  - Close tabs → verify tier steps back up
  - Check: No rapid oscillation (cooldown working)
  - Test: Smooth transitions between tiers

---

## 📋 WORKSTREAM 2: Week 2 Architecture Implementation (20 tasks)

### Priority: HIGH - Get Ahead on Orchestration

**2.1 VisualOrchestrator Full Implementation** (10 tasks)

- [ ] **Task 2.1.1**: Implement full VisualOrchestrator provider
  - Expand skeleton created by Codex (if exists) OR create from scratch
  - Use Master Plan Appendix B example code
  - Full state management with all fields
  - Context value with all services

- [ ] **Task 2.1.2**: Add conditional layer rendering
  - Based on VisualPolicy (from Codex)
  - Mount CSS fallback if WebGL fails
  - Mount WebGL fluid if tier >= medium
  - Mount thin-film if tier === high AND enabled
  - Mount WebGPU if tier === ultra AND supported

- [ ] **Task 2.1.3**: Implement layer z-index management
  - Apply z-index from layerCoordinator
  - Ensure proper stacking order
  - Prevent UI coverage
  - Test layers don't overlap incorrectly

- [ ] **Task 2.1.4**: Implement blend mode coordination
  - Apply blend modes from layerCoordinator
  - Test: screen mode for fluid
  - Test: overlay or screen for thin-film
  - Find optimal combination for visual richness

- [ ] **Task 2.1.5**: Add global intensity application
  - Scale all layer opacities by global intensity
  - Distribute intensity to layer-specific params
  - Test intensity slider affects all layers uniformly
  - Verify smooth transitions

- [ ] **Task 2.1.6**: Wire motion toggle to all layers
  - When motionEnabled=false: Pause all animations
  - CSS: Stop/slow animations
  - WebGL: Freeze simulation or reduce velocity
  - Thin-film: Stop time-based oscillations
  - Test: Immediate response to toggle

- [ ] **Task 2.1.7**: Implement Pure Mode enforcement
  - When pureMode=true: Disable thin-film and WebGPU layers
  - Only allow CSS + WebGL fluid
  - Ignore device tier (force MEDIUM profile)
  - Add URL parameter support: `?pureMode=true`

- [ ] **Task 2.1.8**: Add state persistence
  - Save globalVisualState to localStorage
  - Load on mount (with sensible defaults)
  - Handle migration if state schema changes
  - Test: Settings persist across page reloads

- [ ] **Task 2.1.9**: Implement state change callbacks
  - Notify layers when state changes
  - Efficient updates (don't re-render everything)
  - Use React.memo for optimization
  - Test: Only affected components re-render

- [ ] **Task 2.1.10**: Create orchestrator documentation
  - File: `lib/visual/orchestrator/README.md`
  - Document: How to use VisualOrchestrator
  - Example: Wrapping app in provider
  - Example: Accessing state with useVisualState
  - Example: Adding new layers to coordination

---

**2.2 Layer Integration** (5 tasks)

- [ ] **Task 2.2.1**: Wrap app in VisualOrchestrator
  - Modify: `app/layout.tsx`
  - Add VisualOrchestrator provider at root
  - Move LiquidLightBackground inside provider
  - Pass state from orchestrator to background

- [ ] **Task 2.2.2**: Update LiquidLightBackground to use orchestrator
  - Access state via: `const { state, audioData, palette } = useVisualState();`
  - Remove direct audio/palette imports
  - Use orchestrator-provided data
  - Test: Works same as before, but centralized

- [ ] **Task 2.2.3**: Update controls to use orchestrator
  - Access state via: `const { state, setState } = useVisualState();`
  - Remove local state management
  - Use global state from orchestrator
  - Test: Controls update global state correctly

- [ ] **Task 2.2.4**: Test layer coordination
  - Enable multiple layers (if high tier)
  - Verify all use same audio data (synchronized)
  - Verify all use same palette (consistent colors)
  - Check timing is synchronized (beat pulses align)

- [ ] **Task 2.2.5**: Optimize layer updates
  - Prevent unnecessary re-renders
  - Use React.memo on expensive components
  - Memoize audio/palette data
  - Test: Only changed values trigger re-renders

---

**2.3 Performance Integration** (5 tasks)

- [ ] **Task 2.3.1**: Integrate PerformanceMonitor into orchestrator
  - Create PerformanceMonitor instance
  - Tick on each frame (via RAF or layer notification)
  - Check thresholds every 60 frames
  - Update tier in global state when needed

- [ ] **Task 2.3.2**: Implement auto-tier adjustment
  - When FPS < 25: Step down tier (high→medium→low)
  - When FPS > 50: Step up tier (low→medium→high, max deviceTier)
  - Apply cooldowns (step-down: 2s, step-up: 3s)
  - Log tier changes to console (development mode)

- [ ] **Task 2.3.3**: Add tier change notifications
  - Show toast when tier changes: "Quality adjusted for performance"
  - Optional: Allow user to lock tier (prevent auto-adjustment)
  - Test notifications don't spam user

- [ ] **Task 2.3.4**: Create performance debug panel
  - File: `components/liquid-light/dev/PerformanceHUD.tsx`
  - Show: Current FPS, tier, audio levels, memory, battery
  - Position: top-right, semi-transparent
  - Gate: `process.env.NODE_ENV === 'development'` OR `?debug=true`
  - Reference: LiquidLightBackground.tsx has similar HUD

- [ ] **Task 2.3.5**: Test performance monitoring accuracy
  - Throttle FPS artificially (open heavy tabs)
  - Verify: FPS reported matches actual frame rate
  - Check: Step-down triggers at <25fps
  - Check: Step-up triggers at >50fps
  - Validate: Memory tracking is accurate

---

## 📋 WORKSTREAM 3: Code Quality & Refactoring (12 tasks)

### Priority: MEDIUM - Improve Maintainability

**3.1 Code Organization** (4 tasks)

- [ ] **Task 3.1.1**: Consolidate duplicate palette definitions
  - Check: lib/fluid/config.ts AUTHENTIC_PALETTES
  - Check: lib/palette/PaletteDirector.ts AUTHENTIC_PALETTES
  - Decide: Keep one source, import in other
  - Recommendation: Keep in PaletteDirector (it's the color authority)

- [ ] **Task 3.1.2**: Consolidate duplicate audio types
  - Check: lib/audio/useAudioReactive.ts AudioData type
  - Check: lib/audio/mapping.ts AudioData type
  - Ensure: Single definition in one place
  - Update: Imports to reference single source

- [ ] **Task 3.1.3**: Review and optimize imports
  - Check all @/lib/* imports resolve correctly
  - Remove unused imports
  - Use index.ts files for clean exports
  - Test: TypeScript doesn't complain about imports

- [ ] **Task 3.1.4**: Add ESLint rules for liquid light
  - Prevent: console.log in production (except warnings/errors)
  - Prevent: Hardcoded test values
  - Require: Type annotations on exports
  - Enforce: Consistent naming conventions

---

**3.2 Type Safety** (4 tasks)

- [ ] **Task 3.2.1**: Add strict type checks to all services
  - PaletteDirector: Full type coverage
  - AudioBus: Full type coverage
  - VisualOrchestrator: Full type coverage
  - No `any` types (use proper types or `unknown`)

- [ ] **Task 3.2.2**: Create comprehensive type tests
  - File: `lib/visual/__tests__/types.test.ts`
  - Test: Interfaces are correctly shaped
  - Test: Type inference works
  - Test: Invalid values rejected by TypeScript

- [ ] **Task 3.2.3**: Add JSDoc comments to all public APIs
  - PaletteDirector methods
  - AudioBus functions
  - VisualOrchestrator hooks
  - Include: @param, @returns, @example

- [ ] **Task 3.2.4**: Audit for type safety issues
  - Run: `npx tsc --noEmit --strict`
  - Fix any type errors
  - Ensure strict mode compliance
  - Document any legitimate `any` types with // @ts-expect-error

---

**3.3 Performance Optimization** (4 tasks)

- [ ] **Task 3.3.1**: Optimize PaletteDirector color calculations
  - Cache: RGB conversions (don't recalculate on every access)
  - Memoize: interpolateColors results
  - Profile: Check if any functions are slow
  - Benchmark: Should be <1ms per color access

- [ ] **Task 3.3.2**: Optimize audio mapping calculations
  - Cache: mapAudioToPhysics results if audio unchanged
  - Use: Typed arrays for better performance
  - Profile: calculatePhysicsParams should be <1ms
  - Test: No performance impact at 60fps

- [ ] **Task 3.3.3**: Review React component render optimization
  - Add React.memo where appropriate
  - Use useMemo for expensive calculations
  - Use useCallback for stable function references
  - Test: Components don't re-render excessively

- [ ] **Task 3.3.4**: Bundle size optimization
  - Check: Impact of new services on bundle
  - Target: <50KB added for all new code
  - Consider: Code splitting if bundle large
  - Use: Next.js bundle analyzer to verify

---

## 📋 WORKSTREAM 4: Documentation Sprint (8 tasks)

### Priority: MEDIUM - Knowledge Preservation

**4.1 Service Documentation** (4 tasks)

- [ ] **Task 4.1.1**: Write PaletteDirector README
  - File: `lib/palette/README.md`
  - Document: All palettes with descriptions
  - Examples: How to use PaletteDirector
  - Reference: Wavelength science for educational value

- [ ] **Task 4.1.2**: Write Audio System README
  - File: `lib/audio/README.md`
  - Document: Audio-to-physics mappings
  - Examples: How to use calculatePhysicsParams
  - Reference: Web Audio API for educational value

- [ ] **Task 4.1.3**: Write VisualOrchestrator README
  - File: `lib/visual/orchestrator/README.md`
  - Document: How to use the provider
  - Examples: Accessing state, adding layers
  - Architecture: Overview of coordination pattern

- [ ] **Task 4.1.4**: Write Performance Monitoring README
  - File: `lib/visual/performance/README.md`
  - Document: How FPS monitoring works
  - Examples: Using PerformanceMonitor
  - Thresholds: Step-down/up criteria

---

**4.2 User-Facing Documentation** (4 tasks)

- [ ] **Task 4.2.1**: Create Liquid Light User Guide
  - File: `docs/guides/LIQUID-LIGHT-USER-GUIDE.md`
  - Explain: What is liquid light (Joshua Light Show history)
  - Controls: How to adjust intensity, change palettes, select modes
  - Accessibility: How to disable if needed
  - Troubleshooting: Common issues and solutions

- [ ] **Task 4.2.2**: Create Performance Troubleshooting Guide
  - File: `docs/guides/LIQUID-LIGHT-PERFORMANCE-TROUBLESHOOTING.md`
  - Issue: "FPS drops" → Solutions: Battery saver, reduce intensity, Pure Mode
  - Issue: "Context loss" → Solutions: Page refresh
  - Issue: "Audio not reactive" → Solutions: Check mic permissions
  - Issue: "Battery draining" → Solutions: Enable Pure Mode, reduce intensity

- [ ] **Task 4.2.3**: Create Ambassador Field Guide
  - File: `docs/guides/AMBASSADOR-LIQUID-LIGHT-GUIDE.md`
  - How to use dev HUD at events
  - How to help users with performance issues
  - When to recommend Pure Mode
  - How to gather performance data

- [ ] **Task 4.2.4**: Update main README
  - Add: Liquid Light Features section
  - Link: User guide and troubleshooting
  - Screenshots: Show controls panel (if possible)
  - Credits: Joshua Light Show, research sources

---

## 📋 WORKSTREAM 5: Error Handling & Robustness (8 tasks)

### Priority: MEDIUM - Production Hardening

**5.1 Error Boundaries** (3 tasks)

- [ ] **Task 5.1.1**: Add error boundary for liquid light
  - File: `components/liquid-light/ErrorBoundary.tsx`
  - Catch: Rendering errors in liquid light components
  - Fallback: Show CSS fallback OR minimal gradient
  - Log: Error to console (development) or error service (production)

- [ ] **Task 5.1.2**: Wrap LiquidLightBackground in error boundary
  - If component crashes: Show CSS fallback
  - Log error details
  - Provide "Retry" button for user
  - Don't crash entire app

- [ ] **Task 5.1.3**: Add error reporting
  - Log errors to console (development)
  - Consider: Send to error tracking service (production)
  - Include: Device tier, browser, WebGL version
  - Help debugging production issues

---

**5.2 Graceful Degradation** (3 tasks)

- [ ] **Task 5.2.1**: Test library load failure
  - Simulate: webgl-fluid-enhanced fails to import
  - Verify: Falls back to CSS
  - Check: No blank screen
  - Test: App continues working

- [ ] **Task 5.2.2**: Test audio system failure
  - Simulate: Web Audio API unavailable
  - Verify: Visual effects still render (no audio reactivity)
  - Check: No crash or blank screen
  - Test: Fallback to static parameters

- [ ] **Task 5.2.3**: Test palette system failure
  - Simulate: Invalid palette ID
  - Verify: Falls back to 'classic-60s'
  - Log warning to console
  - Don't crash app

---

**5.3 Memory Management** (2 tasks)

- [ ] **Task 5.3.1**: Audit cleanup paths
  - LiquidLightBackground: Verify dispose() called on unmount
  - Thermal/motion intervals: Verify cleared
  - RAF loops: Verify cancelled
  - Event listeners: Verify removed
  - Test: No memory leaks over 30-minute session

- [ ] **Task 5.3.2**: Add memory leak detection
  - File: `lib/visual/performance/memoryMonitor.ts`
  - Track: Heap size over time
  - Warn: If growth >50MB
  - Test: 1-hour session shows stable memory

---

## 📋 WORKSTREAM 6: Cultural Integration Preparation (5 tasks)

### Priority: MEDIUM - Week 3 Prep

**6.1 Song Palette UI** (3 tasks)

- [ ] **Task 6.1.1**: Create palette selector with categories
  - Group: Classic palettes (60s, Dead, Joshua)
  - Group: Song palettes (Dark Star, Fire, China Cat, etc.)
  - UI: Dropdown with sections
  - Include: Descriptions and cultural context

- [ ] **Task 6.1.2**: Add palette preview cards
  - Show: 4 color swatches per palette
  - Label: Wavelength values (650nm, etc.)
  - Description: Cultural context
  - Interactive: Click to select palette

- [ ] **Task 6.1.3**: Design Dance Floor Mode UI
  - Button: "Enter Dance Floor Mode"
  - Warning: "High intensity, check battery level"
  - Timer: Show countdown (3 minutes, then decay)
  - Visual: Full-screen effect preview

---

**6.2 Success Celebration Effects** (2 tasks)

- [ ] **Task 6.2.1**: Create celebration splat utility
  - File: `lib/visual/effects/celebrations.ts`
  - Function: triggerMintCelebration() → golden splats
  - Function: triggerInviteCelebration() → multi-color burst
  - Function: triggerSuccessPulse() → subtle pulse

- [ ] **Task 6.2.2**: Document event integration points
  - File: `docs/guides/EVENT-INTEGRATION-GUIDE.md`
  - List: Where to trigger celebrations (after minting, etc.)
  - Code: Examples of calling celebration functions
  - Timing: Duration and decay patterns

---

## 📋 WORKSTREAM 7: Performance Optimization Deep Dive (7 tasks)

### Priority: MEDIUM - Week 4 Prep

**7.1 Adaptive Resolution** (3 tasks)

- [ ] **Task 7.1.1**: Implement granular resolution scaling
  - Current: Step-down tier (discrete jumps)
  - Enhancement: Gradual resolution reduction
  - If FPS 40-50: Reduce simRes by 25%
  - If FPS 25-40: Reduce simRes by 50%, dyeRes by 25%
  - If FPS <25: Step down full tier

- [ ] **Task 7.1.2**: Add DPR clamping verification
  - Verify: Mobile DPR clamped to 1.5 max
  - Verify: Desktop DPR clamped to 2.0 max
  - Test on: 4K display (should not render at full 4K)
  - Document: DPR formula in code comments

- [ ] **Task 7.1.3**: Optimize canvas sizing
  - Ensure: Canvas dimensions match viewport
  - Handle: Window resize efficiently (debounce if needed)
  - Prevent: Excessive canvas recreations
  - Test: Smooth resize without flicker

---

**7.2 Frame Pacing** (2 tasks)

- [ ] **Task 7.2.1**: Measure frame time budget
  - Track: Time from frame start to frame end (ms)
  - Budget: 16.67ms for 60fps, 33.33ms for 30fps
  - Warn: If consistently exceeding budget
  - Consider: Reducing quality preemptively

- [ ] **Task 7.2.2**: Implement frame skip logic (optional)
  - If frame time >20ms: Skip non-essential updates
  - Thin-film: Render every other frame if needed
  - Thermal: Reduce event frequency temporarily
  - Test: Maintains smooth appearance despite skips

---

**7.3 Battery Optimization** (2 tasks)

- [ ] **Task 7.3.1**: Implement battery monitoring
  - Use: Battery Status API (if available)
  - Track: Battery level, charging status
  - Auto-adjust: If <20%, enable battery saver mode
  - Notify: User when battery mode activates

- [ ] **Task 7.3.2**: Add visibility change optimization
  - Listen: `document.visibilitychange` event
  - When hidden: Pause animations, reduce RAF frequency
  - When visible: Resume smoothly
  - Test: Saves battery when tab not active

---

## 📋 WORKSTREAM 8: Testing Infrastructure (5 tasks)

### Priority: LOW - Nice to Have

**8.1 Automated Testing** (5 tasks)

- [ ] **Task 8.1.1**: Set up Jest for service testing
  - Install: Jest + React Testing Library
  - Config: Next.js jest configuration
  - Create: `jest.config.js` if not exists

- [ ] **Task 8.1.2**: Write PaletteDirector unit tests
  - File: `lib/palette/__tests__/PaletteDirector.test.ts`
  - Test: getPalette() returns correct values
  - Test: wavelengthToRGB() accuracy
  - Test: Color interpolation

- [ ] **Task 8.1.3**: Write audio mapping unit tests
  - File: `lib/audio/__tests__/mapping.test.ts`
  - Test: calculatePhysicsParams() with various inputs
  - Test: mapAudioToPhysics() linear interpolation
  - Test: Edge cases (null audio, extreme values)

- [ ] **Task 8.1.4**: Write CapabilityDetector tests
  - File: `lib/visual/__tests__/CapabilityDetector.test.ts`
  - Mock: navigator properties
  - Test: Tier assignment logic
  - Test: Edge cases (no WebGL, low memory)

- [ ] **Task 8.1.5**: Write component tests
  - File: `components/liquid-light/__tests__/CSSFallback.test.tsx`
  - Test: Renders without errors
  - Test: Props affect rendering
  - Test: prefers-reduced-motion respected

---

## 📊 Progress Tracking

### Your Session Plan:
- **Hour 1**: Workstream 1 (Week 1 Integration) - 15 tasks
- **Hour 2**: Workstream 2 (Week 2 Architecture) - 20 tasks
- **Hour 3**: Workstream 3 (Code Quality) - 12 tasks
- **Hour 4**: Workstream 4 (Documentation) - 8 tasks
- **Hour 5**: Workstream 5 (Error Handling) - 8 tasks
- **Hour 6**: Workstream 6 (Cultural Prep) - 5 tasks
- **Hour 7**: Workstream 7 (Performance) - 7 tasks
- **Hour 8**: Workstream 8 (Testing) - 5 tasks (if time)

**Total**: 80 tasks across 8 workstreams

### Prioritization:
1. **CRITICAL**: Workstream 1 (Week 1 completion)
2. **HIGH**: Workstream 2 (Week 2 foundation)
3. **MEDIUM**: Workstreams 3, 4, 5, 6, 7
4. **LOW**: Workstream 8 (nice to have)

---

## ✅ Completion Checklist

When you finish each workstream, verify:
- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] Changes committed with clear message
- [ ] Pushed to GitHub
- [ ] No conflicts with Claude Code's work
- [ ] Updated WEEK-1-PROGRESS.md with your additions

---

## 💬 Communication Protocol

### After Each Workstream:
1. Commit your changes
2. Push to GitHub
3. Update progress tracker
4. Note any issues or decisions
5. Continue to next workstream

### If You Encounter Issues:
- Document the issue in commit message
- Don't block on it (move to next task)
- Flag for Claude Code or me to review
- Continue with other tasks

### When Complete:
- Create: CURSOR-COMPLETION-REPORT.md
- List: All tasks completed
- Summary: Files created/modified
- Notes: Architectural decisions made
- Questions: Any items for review

---

## 🎯 Expected Outcomes

**By End of Your Session**:
- ✅ Week 1 integration complete (Workstream 1)
- ✅ Week 2 architecture ready (Workstream 2)
- ✅ Code quality improved (Workstream 3)
- ✅ Documentation comprehensive (Workstream 4)
- ✅ Error handling robust (Workstream 5)
- ✅ Cultural features prepared (Workstream 6)
- ✅ Performance optimized (Workstream 7)
- ✅ Tests added if time (Workstream 8)

**Impact**:
- Week 1 deliverables ready for testing
- Week 2 foundation laid for orchestration
- Production-ready code quality
- Comprehensive documentation

---

## 🔥 You Wanted to Be SWAMPED - Here's Your Challenge!

**80 tasks** across **8 workstreams** spanning **Week 1 completion** through **Week 2 prep**.

This is exactly what you asked for - a MASSIVE TODO list that will keep you intensively working and advancing the Master Plan.

**Every task is**:
- ✅ Specific (file paths, requirements, success criteria)
- ✅ Actionable (you can start immediately)
- ✅ Valuable (contributes to Master Plan goals)
- ✅ Non-conflicting (doesn't interfere with other agents)

**LET'S GO! 🚀**

---

*Master Plan: `docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md`*
*Week 1 Progress: `WEEK-1-PROGRESS.md`*
*Your parallel work foundation: You've got this!*
