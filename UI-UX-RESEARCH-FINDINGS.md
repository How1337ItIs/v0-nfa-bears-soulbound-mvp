# UI/UX Research Findings: Canvas Layering & Visual Hierarchy

## Problem Identified
- **7 WebGL canvases** all at z-index 0, stacking chaotically
- Enhanced psychedelic effects rendering but invisible due to poor layering
- Multiple components mounting duplicate fluid simulations

## Research-Based Solution Strategy

### 1. CSS Z-Index Best Practices (2025)
- **Position Requirement**: z-index only works with positioned elements (relative/absolute/fixed)
- **Stacking Context**: Properties like `transform` and `opacity` create new stacking contexts
- **Performance**: GPU-accelerated CSS transforms > repeated z-index changes
- **Consolidation**: Fewer canvases with dirty-flagging > multiple overlapping canvases

### 2. WebGL Blend Modes & Visual Effects
- **CSS mix-blend-mode** for psychedelic layering:
  - `screen` - inverts, multiplies, inverts (always lighter)
  - `color-dodge` - blows out highlights, perfect for light effects
  - `difference` - creates psychedelic color inversions
  - `plus-lighter` - prevents blinking in cross-fade animations
- **WebGL blend functions**: Use `gl.BLEND` with custom blend equations
- **Performance**: SVG filters have widest support, WebGL for complex effects

### 3. AI Agent Design Principles (2025)
- **Automated Visual Hierarchy**: Clear separation between layers
- **Component Reusability**: Break complex UIs into reusable, manageable pieces  
- **Workflow Automation**: AI-assisted canvas management and layout generation
- **Consistency**: Maintain design system coherence across multiple layers

## Proposed Visual Hierarchy
```
z-50+   UI Elements (navigation, controls)
z-20    Kaleidoscope Mirrors (overlay effects)
z-10    Enhanced WebGL Fluid (psychedelic effects)
z-0     Primary Fluid Simulation (base layer)
z--10   Fallback Gradient (safety background)
z--20   Page Background (deepest)
```

## Implementation Strategy
1. **Consolidate Canvas Management**: Single background system, not multiple
2. **Proper Positioning**: All layers use absolute/fixed positioning
3. **Blend Mode Optimization**: Use `mix-blend-mode: screen` for additive effects
4. **Performance**: GPU-accelerated transforms, minimal DOM reflows
5. **Component Deduplication**: Remove duplicate fluid simulation mounts

## Key Mix-Blend-Modes for Psychedelic Effects
- `screen` - Brightening, additive color mixing
- `color-dodge` - Intense highlights, light-leak effects  
- `difference` - Color inversion, trippy effects
- `exclusion` - Softer color inversion
- `multiply` - Color darkening, shadow effects

## AI Agent Best Practices Applied
- **Automated Hierarchy**: Let z-index values be managed by a single system
- **Visual Consistency**: Use design tokens for consistent spacing/effects
- **Component Reuse**: Single fluid background component, multiple blend layers
- **Performance Monitoring**: Track canvas count and blend complexity