# V0 Prompts for Authentic Liquid Light Show Components
*Based on comprehensive research of 1960s Joshua Light Show techniques*

## Prompt 1: Oil-Water Interference Base Layer

```
Create a React component called "OilInterferenceLayer" that simulates authentic thin-film interference patterns like oil on water. Based on real physics:

VISUAL REQUIREMENTS:
- Use CSS conic-gradient with these exact wavelength colors based on 120nm oil film thickness:
  - 420nm violet: hsl(280, 90%, 60%)
  - 470nm blue: hsl(240, 90%, 60%) 
  - 520nm cyan: hsl(180, 90%, 60%)
  - 570nm green: hsl(120, 90%, 60%)
  - 620nm yellow: hsl(60, 90%, 60%)
  - 670nm orange-red: hsl(20, 90%, 60%)

ANIMATION:
- Slow organic rotation (15-20s duration)
- Background-position shifts to simulate oil movement
- Subtle hue-rotate effects
- Never-repeating patterns using different timing

PROPS:
- intensity: number (0-1) - affects saturation and brightness
- audioBass: number (0-1) - affects rotation speed
- beatPulse: boolean - triggers brief intensity boost

Make it full-screen, position absolute, and optimized for 60fps. Include proper z-index layering.
```

## Prompt 2: Organic Fluid Droplets Component

```
Create a React component called "FluidDroplets" that simulates oil droplets floating in water using CSS.

VISUAL REQUIREMENTS:
- Multiple radial-gradient circles of different sizes
- Organic elliptical shapes (not perfect circles)
- Semi-transparent with mix-blend-mode: screen
- Colors: deep purples, golds, blues (Grateful Dead palette)
- Varying opacity (0.1 to 0.4)

ANIMATION:
- Slow floating movement with different paths for each droplet
- Size pulsing (scale transforms)
- Opacity breathing effects
- Random duration between 20-35 seconds
- Use transform: translate3d for GPU acceleration

PROPS:
- audioMids: number (0-1) - affects movement speed
- audioTreble: number (0-1) - affects droplet count/visibility
- colorPalette: 'darkStar' | 'fireOnTheMountain' | 'chinaCat'

Generate 6-8 droplets with different sizes and starting positions. Full-screen overlay.
```

## Prompt 3: Surface Tension Waves Component

```
Create a React component called "SurfaceTensionWaves" that simulates the ripples and surface distortion effects seen in liquid light shows.

VISUAL REQUIREMENTS:
- Use CSS linear-gradient and radial-gradient combinations
- Subtle wave-like distortions using background-size and position
- Transparency with backdrop-filter: blur() for depth
- Colors should be very subtle (low opacity)

ANIMATION:
- Wave-like motion using sine-wave-inspired keyframes
- Multiple layers moving at different speeds
- Gentle scaling and rotation
- Duration: 25-40 seconds for organic feel

PROPS:
- waveIntensity: number (0-1)
- audioVolume: number (0-1) - affects wave amplitude
- direction: 'horizontal' | 'vertical' | 'radial'

Use transform-origin: center and will-change: transform for performance.
```

## Prompt 4: Overhead Projector Filter Component

```
Create a React component called "ProjectorFilter" that simulates the visual characteristics of 1960s overhead projectors.

VISUAL REQUIREMENTS:
- Radial gradient from center to edges (Fresnel lens effect)
- Slight vignetting around edges
- CSS filters: brightness(1.4) contrast(1.2) blur(0.5px)
- Subtle chromatic aberration effect using box-shadow
- Hot spot in center with cooler edges

ANIMATION:
- Very subtle flickering (like halogen bulbs)
- Gentle brightness variations
- Heat shimmer effect using small transforms

PROPS:
- intensity: number (0.5-1.5) - brightness multiplier  
- flicker: boolean - enable/disable flicker effect
- heatShimmer: boolean - subtle distortion effect

Apply as overlay with mix-blend-mode and pointer-events: none.
```

## Prompt 5: Audio-Reactive Control System

```
Create a React hook called "useAudioReactiveControls" that manages audio-reactive parameters for liquid light components.

FUNCTIONALITY:
- Accept AudioData input with bass, mids, treble, volume, beatDetected
- Map frequency bands to visual parameters:
  - Bass (0-250Hz) → viscosity, oil density, slow movement
  - Mids (250-4000Hz) → turbulence, velocity, medium movement  
  - Treble (4000Hz+) → sparkles, surface tension, fast effects
- Beat detection → trigger splats, intensity bursts, palette shifts
- Tempo → overall animation speed scaling

RETURN:
- oilParams: { viscosity, density, rotation }
- fluidParams: { velocity, turbulence, dropletCount }
- visualParams: { brightness, saturation, hueShift }
- beatEffects: { pulse, splat, colorShift }

Include smoothing/interpolation to prevent jittery effects. Use requestAnimationFrame for 60fps updates.
```

## Prompt 6: Grateful Dead Color Palette System

```
Create a React component called "ColorPaletteProvider" that manages authentic Grateful Dead color schemes.

PALETTES NEEDED:
1. Dark Star: Deep purples, indigo, silver sparkles
2. Fire on the Mountain: Reds, oranges, gold flames  
3. China Cat Sunflower: Yellows, greens, organic patterns
4. Ripple: Blues, white highlights, water-like flow

FUNCTIONALITY:
- Context provider for current palette
- Smooth transitions between palettes (3-5 second fade)
- Audio-reactive palette switching based on musical intensity
- CSS custom properties updated in real-time

PROPS:
- currentSong: string - auto-select appropriate palette
- audioIntensity: number - affects color saturation
- manualOverride: palette name - force specific palette

Export both context and custom CSS properties for components to use.
```

## Prompt 7: Glass Clock Face Container

```
Create a React component called "ClockFaceContainer" that simulates the glass clock face containers used in authentic liquid light shows.

VISUAL REQUIREMENTS:
- Circular container with subtle glass edges
- Inner content area for liquid effects
- Slight refraction/distortion around edges
- CSS glassmorphism: backdrop-filter, border-radius: 50%
- Multiple size variants: small (200px), medium (400px), large (600px)

FEATURES:
- Rotating container (slow, 30-60 second rotation)
- Tilt animation (subtle perspective shifts)
- Content masking to circular boundary
- Option for multiple concentric clock faces

PROPS:
- size: 'small' | 'medium' | 'large'
- rotationSpeed: number (seconds per revolution)
- tiltEnabled: boolean
- children: React.ReactNode (liquid effects go inside)

Position absolute with overflow: hidden for proper masking.
```

## Prompt 8: Main Liquid Light Composition

```
Create a React component called "LiquidLightShow" that orchestrates all the liquid light elements into an authentic composition.

COMPOSITION:
- Layer 1 (bottom): Dark space background
- Layer 2: Oil interference base layer
- Layer 3: Surface tension waves
- Layer 4: Fluid droplets  
- Layer 5: Overhead projector filter
- Layer 6: Glass clock face containers (optional)

FEATURES:
- Responsive to audio input via props
- Smooth palette transitions
- Performance optimization (pause animations when not visible)
- Accessibility: respect prefers-reduced-motion
- Mobile optimization with reduced complexity

PROPS:
- audioData: AudioData object
- palette: color palette name
- intensity: overall effect intensity (0-1)
- clockFacesEnabled: boolean
- performanceMode: 'high' | 'medium' | 'low'

Use Intersection Observer for performance and React.memo for optimization.
```

---

## Additional Resources for v0:

### Color Values to Use:
```css
/* Dark Star Palette */
--dark-star-primary: hsl(280, 90%, 25%)
--dark-star-secondary: hsl(285, 90%, 45%) 
--dark-star-accent: hsl(0, 0%, 75%)

/* Fire on Mountain Palette */
--fire-primary: hsl(345, 85%, 47%)
--fire-secondary: hsl(25, 100%, 50%)
--fire-accent: hsl(45, 100%, 50%)

/* China Cat Palette */
--china-primary: hsl(60, 90%, 60%)
--china-secondary: hsl(120, 80%, 50%)
--china-accent: hsl(300, 70%, 70%)
```

### Animation Timing Guidelines:
- Oil film interference: 15-20 seconds
- Droplet movement: 20-35 seconds  
- Surface waves: 25-40 seconds
- Projector flicker: 0.1-0.3 seconds
- Beat response: 0.1-0.2 seconds

Would you like me to start with any specific prompt, or do you want to modify these before sending to v0? I can also have ChatGPT generate reference images for any of these components if that would help v0 understand the visual targets better.