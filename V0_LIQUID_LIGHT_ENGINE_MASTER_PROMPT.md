# The Ultimate v0 Liquid Light Engine Prompt

## Master Prompt (Copy this entire block to v0.dev)

```
Create a complete "LiquidLightEngine" React component that simulates authentic 1960s Joshua Light Show projections using React Three Fiber, Motion (Framer Motion), and advanced WebGL techniques. This is for a Grateful Dead cultural preservation project.

HISTORICAL CONTEXT:
Recreate the actual liquid light shows used behind the Grateful Dead at venues like Fillmore East. These used overhead projectors with mineral oil, water, and colored dyes to create organic, never-repeating psychedelic visuals that responded to the music.

TECHNICAL REQUIREMENTS:

1. CORE ARCHITECTURE:
   - Use React Three Fiber as the primary 3D rendering engine
   - Integrate Motion for smooth animations and audio-reactive effects
   - Use drei helpers for advanced 3D effects (Text, Environment, etc.)
   - Export as a complete, copy-paste component for Next.js 15

2. AUTHENTIC LIQUID SIMULATION:
   - Implement real-time fluid dynamics using Fragment shaders in React Three Fiber
   - Create multiple liquid "droplets" that merge, separate, and flow organically
   - Use Perlin noise for natural movement patterns (not predictable animations)
   - Simulate oil-on-water physics: density differences, surface tension, viscosity

3. THIN-FILM INTERFERENCE COLORS:
   - Generate authentic rainbow interference patterns from oil film thickness
   - Color progression: deep purple → electric blue → cyan → jade green → gold → orange → red → magenta
   - Use HSL color space for smooth wavelength transitions
   - Implement dynamic color shifting based on simulated film thickness

4. AUDIO-REACTIVE SYSTEM:
   - Accept props: { volume, bass, mids, treble, beatDetected, tempo, musicalContext }
   - Bass frequencies → affect liquid viscosity and droplet size
   - Mid frequencies → control flow velocity and movement patterns
   - Treble frequencies → influence color intensity and iridescence
   - Beat detection → trigger new droplets and pulse effects

5. GRATEFUL DEAD CULTURAL THEMES:
   - Include preset "song modes": 'darkStar', 'fireOnTheMountain', 'terraPinStation', 'scarletBegonias'
   - Each mode uses authentic color palettes from that song's typical visuals
   - Dark Star: deep indigos and purples, mysterious slow movement
   - Fire on the Mountain: golds and oranges, building energy patterns
   - Terrapin Station: greens and blues, flowing water-like motion
   - Scarlet Begonias: reds and pinks, vibrant blooming patterns

6. PERFORMANCE OPTIMIZATION:
   - Implement LOD (Level of Detail) for different device capabilities
   - Desktop: Full complexity with 50+ fluid particles
   - Mobile: Reduced complexity with 20 particles and simpler shaders
   - Include GPU memory management and cleanup
   - Respect prefers-reduced-motion accessibility setting

7. 3D SCENE COMPOSITION:
   - Camera positioned for optimal "projection screen" viewing
   - Multiple light sources simulating overhead projector bulbs
   - Transparent materials with realistic refraction
   - Background "venue darkness" environment
   - Layered rendering: background → fluid simulation → foreground glow

8. INTERACTION CAPABILITIES:
   - Optional mouse/touch interaction to "stir" the fluid
   - Click to spawn new droplets with realistic physics
   - Drag to create flow currents and movement vectors

VISUAL SPECIFICATIONS:

- Canvas size: responsive (100vw x 100vh with proper z-indexing)
- Color depth: Use floating-point textures for smooth gradients
- Frame rate target: 60fps desktop, 30fps mobile
- Blend modes: Use screen and color-dodge for realistic light addition
- Particle count: Dynamic based on device performance

SHADER REQUIREMENTS:

Include custom Fragment shaders for:
- Fluid velocity field calculation (Navier-Stokes simplified)
- Color interference pattern generation
- Particle trail rendering with fade-out
- Realistic light scattering and refraction effects

PROPS INTERFACE:

```typescript
interface LiquidLightEngineProps {
  audioData?: {
    volume: number;        // 0-1
    bass: number;         // 0-1  
    mids: number;         // 0-1
    treble: number;       // 0-1
    beatDetected: boolean;
    tempo: number;        // BPM
  };
  songMode?: 'darkStar' | 'fireOnTheMountain' | 'terraPinStation' | 'scarletBegonias';
  intensity?: number;     // 0-1, overall effect strength
  interactive?: boolean;  // Enable mouse/touch interaction
  performanceMode?: 'high' | 'medium' | 'low';
  className?: string;
}
```

ACCESSIBILITY FEATURES:

- Include reduced-motion fallback with static gradient
- Provide intensity controls for photosensitive users
- Ensure proper contrast for any overlaid UI elements
- Add screen reader descriptions for the visual experience

INSTALLATION REQUIREMENTS:

The component should work with these npm packages (include installation notes):
- @react-three/fiber
- @react-three/drei  
- framer-motion (Motion)
- three

CREATIVE ENHANCEMENT:

Feel free to enhance this concept using any modern techniques you think would improve authenticity:
- Advanced noise functions for more organic movement
- Particle system optimizations
- Custom geometry for complex liquid shapes
- Post-processing effects for realistic glow
- Any React Three Fiber features that enhance the liquid simulation

CULTURAL AUTHENTICITY:

The end result should genuinely evoke watching liquid light projections behind the Grateful Dead at a 1960s concert. Focus on organic, mesmerizing movement that feels alive and responsive to music, not generic "colorful animations."

OUTPUT REQUIREMENTS:

Provide complete, production-ready React component code that can be copied directly into a Next.js 15 application with TypeScript and Tailwind CSS. Include all necessary imports, proper TypeScript interfaces, and comprehensive JSDoc comments explaining the physics simulation and cultural significance.

The component should be sophisticated enough to serve as the primary visual element for an authentic Grateful Dead cultural preservation application.
```

## Implementation Strategy

After v0 generates the component:

1. **Test the component** in our existing app structure
2. **Wire up audio data** from our existing FloatingMusicPlayer
3. **Replace current CSS background** in both desktop and mobile shells
4. **Fine-tune performance** based on real device testing
5. **Add cultural authenticity** refinements based on user feedback

## Expected Results

This approach should deliver:
- **Authentic liquid physics** (not CSS approximations)
- **Professional React Three Fiber implementation** 
- **Smooth audio reactivity** with proper performance
- **Cultural accuracy** to 1960s Grateful Dead shows
- **Production-ready code** that integrates seamlessly

The single comprehensive prompt leverages all of v0's strengths while incorporating everything from our internal research synthesis.