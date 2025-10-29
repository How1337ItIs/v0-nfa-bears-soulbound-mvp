# CURSOR: NEXT PHASE - WORKSTREAMS 3-8 (56 Remaining Tasks)
## Week 2-3 Polish, Testing, Documentation & Cultural Integration

**Created**: 2025-10-29 15:00 UTC
**From**: Claude Code
**For**: Cursor (continuation of massive workload)
**Previous**: Completed 24/80 tasks (Workstreams 1-2) ✅
**Remaining**: 56 tasks (Workstreams 3-8)
**Status**: READY FOR NEXT PHASE 🚀

---

## 🎉 CONGRATULATIONS ON WORKSTREAMS 1-2!

You've crushed **24 tasks** in **2 hours** with **ZERO conflicts**:
- ✅ Week 1 Integration Sprint: 15/15 tasks COMPLETE
- ✅ Week 2 Orchestration Foundation: 9/9 tasks COMPLETE

**Result**: 2,000+ LOC, comprehensive tests, complete architecture

---

## 📋 YOUR NEXT MISSION: 56 TASKS ACROSS 6 WORKSTREAMS

Continue from your original task list (`CURSOR-MASSIVE-TODO-LIST.md`):

### **PRIORITY ORDER**:
1. 🔥 **WORKSTREAM 3**: Code Quality & Refactoring (12 tasks) - HIGH
2. 🔥 **WORKSTREAM 4**: Documentation Sprint (8 tasks) - HIGH
3. ⚡ **WORKSTREAM 5**: Error Handling & Robustness (8 tasks) - MEDIUM
4. 🎨 **WORKSTREAM 6**: Cultural Integration Prep (5 tasks) - MEDIUM
5. ⚡ **WORKSTREAM 7**: Performance Optimization Deep Dive (7 tasks) - MEDIUM
6. 🧪 **WORKSTREAM 8**: Testing Infrastructure (5 tasks) - LOW

---

## 🔥 WORKSTREAM 3: CODE QUALITY & REFACTORING (12 tasks)

**Reference**: Original task list, section "Workstream 3"

### **Priority: CRITICAL** - Clean up before Week 2 integration

**Tasks 3.1.1 - 3.1.4**: Code Organization (4 tasks)
- Consolidate duplicate palette definitions (lib/fluid/config.ts vs lib/palette/)
- Consolidate duplicate audio types
- Review and optimize imports
- Add ESLint rules for liquid light

**Tasks 3.2.1 - 3.2.4**: Type Safety (4 tasks)
- Add strict type checks to all services
- Create comprehensive type tests
- Add JSDoc comments to all public APIs
- Audit for type safety issues (`npx tsc --noEmit --strict`)

**Tasks 3.3.1 - 3.3.4**: Performance Optimization (4 tasks)
- Optimize PaletteDirector color calculations (caching)
- Optimize audio mapping calculations
- React component render optimization (React.memo, useMemo)
- Bundle size optimization (<50KB target)

**Acceptance**:
- ✅ No code duplication across services
- ✅ All TypeScript strict mode compliant
- ✅ Bundle size <50KB for liquid light code
- ✅ No unnecessary re-renders

---

## 📝 WORKSTREAM 4: DOCUMENTATION SPRINT (8 tasks)

**Reference**: Original task list, section "Workstream 4"

### **Priority: HIGH** - Knowledge preservation

**Tasks 4.1.1 - 4.1.4**: Service Documentation (4 tasks)
- Write PaletteDirector README (lib/palette/README.md)
- Write Audio System README (lib/audio/README.md)
- Write VisualOrchestrator README (lib/visual/orchestrator/README.md)
- Write Performance Monitoring README (lib/visual/performance/README.md)

**Tasks 4.2.1 - 4.2.4**: User-Facing Documentation (4 tasks)
- Create Liquid Light User Guide (docs/guides/LIQUID-LIGHT-USER-GUIDE.md)
- Create Performance Troubleshooting Guide
- Create Ambassador Field Guide
- Update main README with Liquid Light features

**Acceptance**:
- ✅ Each README ≥1,000 words with code examples
- ✅ User guides are non-technical and helpful
- ✅ Troubleshooting covers common issues
- ✅ README has Liquid Light section with screenshots

---

## ⚡ WORKSTREAM 5: ERROR HANDLING & ROBUSTNESS (8 tasks)

**Reference**: Original task list, section "Workstream 5"

### **Priority: MEDIUM** - Production hardening

**Tasks 5.1.1 - 5.1.3**: Error Boundaries (3 tasks)
- Add error boundary for liquid light
- Wrap LiquidLightBackground in error boundary
- Add error reporting

**Tasks 5.2.1 - 5.2.3**: Graceful Degradation (3 tasks)
- Test library load failure (webgl-fluid-enhanced fails)
- Test audio system failure (Web Audio API unavailable)
- Test palette system failure (invalid palette ID)

**Tasks 5.3.1 - 5.3.2**: Memory Management (2 tasks)
- Audit cleanup paths (dispose, cancel RAF, remove listeners)
- Add memory leak detection (track heap growth)

**Acceptance**:
- ✅ Error boundary prevents full app crashes
- ✅ All failure modes have graceful fallbacks
- ✅ No memory leaks over 30-minute session

---

## 🎨 WORKSTREAM 6: CULTURAL INTEGRATION PREP (5 tasks)

**Reference**: Original task list, section "Workstream 6"

### **Priority: MEDIUM** - Week 3 preparation

**Tasks 6.1.1 - 6.1.3**: Song Palette UI (3 tasks)
- Create palette selector with categories (Classic vs Song palettes)
- Add palette preview cards (color swatches + cultural context)
- Design Dance Floor Mode UI (button, timer, intensity warning)

**Tasks 6.2.1 - 6.2.2**: Success Celebration Effects (2 tasks)
- Create celebration splat utility (lib/visual/effects/celebrations.ts)
- Document event integration points (docs/guides/EVENT-INTEGRATION-GUIDE.md)

**Acceptance**:
- ✅ Palette UI shows cultural context
- ✅ Dance Floor Mode UI is ready
- ✅ Celebration effects documented

---

## ⚡ WORKSTREAM 7: PERFORMANCE OPTIMIZATION DEEP DIVE (7 tasks)

**Reference**: Original task list, section "Workstream 7"

### **Priority: MEDIUM** - Week 4 preparation

**Tasks 7.1.1 - 7.1.3**: Adaptive Resolution (3 tasks)
- Implement granular resolution scaling
- Add DPR clamping verification
- Optimize canvas sizing

**Tasks 7.2.1 - 7.2.2**: Frame Pacing (2 tasks)
- Measure frame time budget (16.67ms for 60fps)
- Implement frame skip logic (optional, if needed)

**Tasks 7.3.1 - 7.3.2**: Battery Optimization (2 tasks)
- Implement battery monitoring
- Add visibility change optimization (pause when tab hidden)

**Acceptance**:
- ✅ Resolution scales dynamically with FPS
- ✅ Frame time within budget (±20%)
- ✅ Battery drain reduced when tab hidden

---

## 🧪 WORKSTREAM 8: TESTING INFRASTRUCTURE (5 tasks)

**Reference**: Original task list, section "Workstream 8"

### **Priority: LOW** - Nice to have

**Tasks 8.1.1 - 8.1.5**: Automated Testing (5 tasks)
- Set up Jest for service testing
- Write PaletteDirector unit tests
- Write audio mapping unit tests
- Write CapabilityDetector tests
- Write component tests

**Acceptance**:
- ✅ Jest configured and working
- ✅ >90% coverage on services
- ✅ All tests passing
- ✅ Test suite runs in <30 seconds

---

## 🎯 EXECUTION STRATEGY

### **Session 1 (2-3 hours)**: Workstream 3 (Code Quality)
- Consolidate duplicates
- Add type safety
- Optimize performance
- Clean up code

### **Session 2 (2-3 hours)**: Workstream 4 (Documentation)
- Write all READMEs
- Create user guides
- Update main README
- Add screenshots

### **Session 3 (1-2 hours)**: Workstream 5 (Error Handling)
- Add error boundaries
- Test failure modes
- Implement recovery

### **Session 4 (1-2 hours)**: Workstream 6 (Cultural)
- Enhanced palette UI
- Dance Floor Mode UI
- Celebration effects

### **Session 5 (1-2 hours)**: Workstream 7 (Performance)
- Adaptive resolution
- Battery optimization
- Frame pacing

### **Session 6 (2-3 hours)**: Workstream 8 (Testing)
- Jest setup
- Unit tests
- Integration tests

**Total**: 10-15 hours for all 56 tasks

---

## ✅ SUCCESS CRITERIA

**By End of This Phase**:
- ✅ All code duplication eliminated
- ✅ TypeScript strict mode compliant
- ✅ Comprehensive documentation (10,000+ words)
- ✅ Error handling robust (all failure modes covered)
- ✅ Cultural UI ready for Week 3
- ✅ Performance optimized for Week 4 testing
- ✅ Test suite complete (>90% coverage)

---

## 📁 DELIVERABLES CHECKLIST

### **Code**:
- [ ] lib/visual/effects/celebrations.ts (celebration splats)
- [ ] Enhanced PaletteDirector (with caching)
- [ ] Enhanced audio mapping (with optimization)
- [ ] Error boundaries for all components
- [ ] Memory leak detection utility

### **Documentation**:
- [ ] lib/palette/README.md (1,000+ words)
- [ ] lib/audio/README.md (1,000+ words)
- [ ] lib/visual/orchestrator/README.md (1,000+ words)
- [ ] docs/guides/LIQUID-LIGHT-USER-GUIDE.md (2,000+ words)
- [ ] docs/guides/LIQUID-LIGHT-PERFORMANCE-FAQ.md (1,500+ words)
- [ ] docs/guides/AMBASSADOR-LIQUID-LIGHT-FIELD-GUIDE.md (1,000+ words)
- [ ] Updated main README.md

### **Testing**:
- [ ] jest.config.js
- [ ] lib/palette/__tests__/PaletteDirector.test.ts
- [ ] lib/audio/__tests__/mapping.test.ts
- [ ] lib/visual/__tests__/CapabilityDetector.test.ts
- [ ] components/liquid-light/__tests__/CSSFallback.test.tsx

### **UI Components**:
- [ ] Enhanced LiquidLightControls with palette cards
- [ ] Dance Floor Mode button/UI
- [ ] Celebration effect triggers

---

## 💬 COORDINATION

### **What Claude Code Is Doing** (Parallel):
- Thin-film shader refinement (physics/GLSL)
- Audio beatDetector creation
- Palette enhancement (more song palettes)
- Performance HUD (dev tools)
- Helper utilities (DPR clamp, battery policy)

### **What Codex Is Doing** (Parallel):
- Massive 150-task sprint (Weeks 2-4 implementation)
- Complete orchestration system
- Full testing infrastructure
- Comprehensive documentation

### **You Should Avoid**:
- Don't modify thin-film shader (Claude Code's domain)
- Don't modify orchestrator internals (Codex's architecture)
- Don't create conflicting utilities (check what exists first)

### **You Should Focus On**:
- Code quality and cleanup
- Documentation excellence
- Error handling robustness
- Testing infrastructure
- Cultural UI polish

---

## 🚀 WHEN YOU'RE DONE

Create completion report: `CURSOR-PHASE-2-COMPLETION-REPORT.md`

**Include**:
- Tasks completed (target: 56/56)
- Code quality improvements made
- Documentation pages written
- Tests created and coverage
- Cultural features implemented
- Performance optimizations applied
- Any blockers or issues
- Recommendations for Week 3-4

---

## 📍 FILE PATH FOR EASY HANDOFF

**Pass this to Cursor**:
```
C:\Users\natha\nfa-bears-mvp\nfa-bears-mvp\CURSOR-NEXT-PHASE-PROMPT.md
```

---

**YOU'VE GOT THIS! CONTINUE THE AMAZING WORK! 🔥**

*Previous: CURSOR-MASSIVE-TODO-LIST.md (24/80 complete)*
*Current: This phase (56 remaining tasks)*
*Master Plan: docs/reports/MASTER-LIQUID-LIGHT-INTEGRATION-PLAN.md*
