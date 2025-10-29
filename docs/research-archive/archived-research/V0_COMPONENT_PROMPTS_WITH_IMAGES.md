# V0 Component Prompts Using Generated Images

## V0 Prompt 1: Oil Interference Hero Component

```
Create a React component called "OilInterferenceHero" that uses a background image of oil-on-water interference patterns.

COMPONENT STRUCTURE:
- Full-screen hero section (100vh)
- Background image: oil-interference-base.jpg (you'll provide this)
- Subtle CSS animations to simulate liquid movement
- Audio-reactive intensity changes

VISUAL EFFECTS:
- background-size: cover with slow background-position animation
- CSS filter effects: saturate(), brightness(), hue-rotate()
- Gentle scaling animations (transform: scale(1.0 to 1.1))
- Mix-blend-mode: screen for layering with other components

PROPS:
- audioBass: number (0-1) - affects background-position speed
- audioIntensity: number (0-1) - affects saturation and brightness
- beatPulse: boolean - triggers brief scale pulse
- colorPalette: 'darkStar' | 'fireMountain' | 'chinaCat'

ANIMATIONS:
- Slow drift: background-position moves in a figure-8 pattern over 30 seconds
- Gentle breathing: scale from 1.0 to 1.05 over 20 seconds
- Audio-reactive: brightness and saturation respond to props
- Beat response: quick scale pulse when beatPulse is true

Include TypeScript types and make it responsive for mobile.
```

## V0 Prompt 2: Floating Droplets Overlay

```
Create a React component called "FloatingDroplets" that overlays multiple oil droplet images with individual animations.

COMPONENT STRUCTURE:
- Absolute positioned container covering full screen
- 6-8 individual droplet elements using oil-droplets-texture.jpg
- Each droplet has different size, position, and animation timing
- CSS clip-path or mask to show individual droplets from the texture

INDIVIDUAL DROPLET BEHAVIOR:
- Random starting positions across the screen
- Slow floating movement (transform: translate)
- Gentle rotation and scaling
- Opacity breathing (0.3 to 0.8)
- Different animation durations (15-35 seconds per droplet)

PROPS:
- audioMids: number (0-1) - affects movement speed
- audioTreble: number (0-1) - affects opacity and count of visible droplets
- intensity: number (0-1) - overall effect strength

PERFORMANCE:
- Use transform3d for GPU acceleration
- will-change: transform on animated elements
- Intersection Observer to pause when not visible

Generate 6-8 droplets with randomized properties but consistent behavior patterns.
```

## V0 Prompt 3: Surface Ripples Effect

```
Create a React component called "SurfaceRipples" that animates water surface ripple patterns.

COMPONENT STRUCTURE:
- Uses surface-ripples.jpg as base texture
- Multiple layers with different opacities and blend modes
- CSS animations for wave propagation
- Audio-reactive ripple intensity

VISUAL EFFECTS:
- background-position animation in concentric patterns
- Multiple background layers with different speeds
- CSS filter: blur() for depth of field effects
- Low opacity (0.1-0.3) to be subtle overlay

PROPS:
- waveSpeed: number (0.5-2.0) - animation duration multiplier
- audioVolume: number (0-1) - affects wave amplitude (scale)
- beatDetected: boolean - triggers new ripple wave

ANIMATIONS:
- Concentric wave propagation from multiple points
- Each wave layer has different timing (10-25 seconds)
- Beat detection creates new ripple burst
- Subtle rotation of the entire pattern

Keep it subtle - this should enhance other effects, not dominate them.
```

## V0 Prompt 4: Overhead Projector Filter

```
Create a React component called "ProjectorFilter" that simulates 1960s overhead projector lighting characteristics.

COMPONENT STRUCTURE:
- Full-screen overlay using projector-light-cone.jpg
- CSS filter effects to simulate projector optics
- Subtle flickering animation like vintage halogen bulbs
- Radial gradient overlay for additional lighting control

VISUAL EFFECTS:
- background-image with projector light cone pattern
- CSS filters: brightness(1.4) contrast(1.2) blur(0.5px)
- Radial gradient overlay from center to edges
- Subtle opacity flickering (0.95 to 1.0)

PROPS:
- intensity: number (0.5-1.5) - brightness multiplier
- flicker: boolean - enable/disable bulb flicker effect
- warmth: number (0-1) - color temperature adjustment

ANIMATIONS:
- Very subtle brightness flickering (2-4 second intervals)
- Gentle warmth variations using hue-rotate
- No dramatic effects - should feel like authentic projector

Apply as overlay with mix-blend-mode: overlay and pointer-events: none.
```

## V0 Prompt 5: Glass Clock Face Container

```
Create a React component called "ClockFaceContainer" that creates circular containers with glass-like edges.

COMPONENT STRUCTURE:
- Uses glass-clock-face.jpg as background or overlay
- Circular container with CSS clip-path or border-radius
- Inner content area for liquid effects
- Glassmorphism effects with backdrop-filter

VISUAL FEATURES:
- Perfect circle shape with glass refraction edges
- backdrop-filter: blur(10px) saturate(1.8)
- Subtle border with glass-like appearance
- Rotating container animation (60 second rotation)
- Multiple size variants: 200px, 400px, 600px

PROPS:
- size: 'small' | 'medium' | 'large'
- rotationSpeed: number (seconds per full rotation)
- children: React.ReactNode (liquid effects go inside)
- glassOpacity: number (0-1)

ANIMATIONS:
- Slow continuous rotation
- Subtle scale breathing effect
- Glass reflection highlights moving around edge

The children prop content should be masked to the circular boundary.
```

## V0 Prompt 6: Psychedelic Hero Section

```
Create a React component called "PsychedelicHero" that combines multiple generated images into a cohesive liquid light show background.

COMPONENT STRUCTURE:
- Full-screen section with deep-space-background.jpg as base
- Layered components: oil patterns, droplets, ripples, projector filter
- Smooth color palette transitions
- Audio-reactive parameter management

LAYER COMPOSITION:
1. Base: deep-space-background.jpg (z-index: 1)
2. Oil patterns: dark-star-pattern.jpg or fire-mountain-pattern.jpg (z-index: 2)
3. Floating droplets overlay (z-index: 3)
4. Surface ripples (z-index: 4)  
5. Projector filter (z-index: 5)
6. Content overlay area (z-index: 10)

PROPS:
- audioData: {bass: number, mids: number, treble: number, volume: number, beatDetected: boolean}
- colorPalette: 'darkStar' | 'fireMountain' | 'chinaCat'
- intensity: number (0-1)
- children: React.ReactNode (for overlaid content)

FEATURES:
- Smooth palette switching with CSS transitions
- All child components receive appropriate audio props
- Performance optimization with reduced effects on mobile
- Accessibility: respect prefers-reduced-motion

This should orchestrate all the visual elements into a cohesive experience.
```

## V0 Prompt 7: Audio Control Panel Component

```
Create a React component called "AudioControlPanel" that provides manual controls for testing the liquid light effects.

COMPONENT STRUCTURE:
- Glassmorphic panel that floats over the liquid light background
- Sliders for bass, mids, treble, volume
- Buttons for beat detection and palette switching
- Toggle for enabling/disabling effects

CONTROLS NEEDED:
- Bass slider (0-100) with real-time value display
- Mids slider (0-100) with real-time value display  
- Treble slider (0-100) with real-time value display
- Volume slider (0-100) with real-time value display
- "Beat Pulse" button that triggers beat effect
- Palette selector: Dark Star / Fire Mountain / China Cat buttons
- "Effects On/Off" toggle switch

STYLING:
- backdrop-filter: blur(20px) saturate(1.8)
- Semi-transparent background
- Neon-style sliders and buttons
- Grateful Dead inspired typography
- Position: fixed in bottom-right corner
- Collapsible/expandable with smooth animations

PROPS:
- onAudioChange: (audioData: AudioData) => void
- onPaletteChange: (palette: string) => void
- onEffectsToggle: (enabled: boolean) => void

This will allow testing all the audio-reactive features without needing real audio input.
```

## V0 Prompt 8: Complete Liquid Light App Shell

```
Create a React component called "LiquidLightApp" that combines everything into a complete application shell.

COMPONENT STRUCTURE:
- PsychedelicHero as the main background
- AudioControlPanel for testing
- Navigation overlay with glassmorphic styling
- Content areas that work over the liquid light background

MAIN FEATURES:
- State management for audio parameters and palette selection
- Smooth transitions between different sections/pages
- Mobile-responsive with simplified effects
- Performance monitoring and quality adjustment
- Accessibility controls (reduce motion, etc.)

LAYOUT:
- Full-screen liquid light background
- Floating navigation with backdrop-filter
- Content areas with proper contrast over the effects
- Control panel for testing (can be hidden)

PROPS:
- initialPalette: string
- showControls: boolean (for testing vs production)
- performanceMode: 'high' | 'medium' | 'low'
- children: React.ReactNode

STATE MANAGEMENT:
- Audio reactive parameters
- Current color palette
- Effect intensity levels
- Performance/accessibility settings

Include proper TypeScript types and responsive design considerations.
```

---

# Implementation Workflow:

1. **Generate images** using the ChatGPT prompts
2. **Start with V0 Prompt 1** (Oil Interference Hero) 
3. **Build up layers** with Prompts 2-5
4. **Combine into hero section** with Prompt 6
5. **Add controls for testing** with Prompt 7
6. **Complete app shell** with Prompt 8

Each v0 component will be much more achievable because it's working with real visual assets rather than trying to generate complex organic patterns with CSS alone.