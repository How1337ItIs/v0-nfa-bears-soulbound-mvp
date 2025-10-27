AI-Assisted Psychedelic Liquid Light Show – Technical Deep Dive
1. Integrating PavelDoGreat’s WebGL Fluid Simulation in Next.js 15

Using a React-Compatible Fluid Library: The fastest way to add Pavel Dobryakov’s fluid simulation to a Next.js 15 (React 18) app is to use an existing wrapper. One option is fluid-simulation-react (v1.0.5) – an npm package that ports Pavel’s WebGL code to a React component
npmjs.com
npmjs.com
. Another modern option is webgl-fluid-enhanced (an improved TypeScript fork) which adds features like initial fluid motion, bloom, and TS support
github.com
github.com
. Both wrap the core WebGL fluid engine, so you don’t have to rewrite shaders from scratch.

Installation: In your Next.js project, install the package via npm or Yarn:

# Option A: fluid-simulation-react
npm install fluid-simulation-react

# Option B: webgl-fluid-enhanced (TypeScript-friendly)
npm install webgl-fluid-enhanced


Basic Setup (Next.js App Router): Create a React client component for the fluid canvas. For example, in app/(components)/FluidCanvas.tsx:

'use client';
import { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';
// import FluidSimulation from 'fluid-simulation-react'; // if using fluid-simulation-react

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    // Initialize fluid simulation on the canvas element:
    webGLFluidEnhanced.simulation(canvasRef.current, {
      // configuration options…
      SIM_RESOLUTION: 256,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.9,
      VELOCITY_DISSIPATION: 0.95,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      COLOR_PALETTE: ['#ff0066', '#00ffcc', '#ffff33', '#ff6600'], // 60s palette
      HOVER: true,             // enable fluid interaction on hover
      BACK_COLOR: '#000000',   // black background for contrast
      TRANSPARENT: false       // false = draw black background
    });
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" />;
}


This uses webGLFluidEnhanced.simulation(canvas, config) to mount the fluid simulation on a full-screen canvas
github.com
github.com
. We attach the canvas to ref and call the initialization in a useEffect to ensure it runs on the client side (Next.js App Router requires 'use client' for such components). The canvas is styled to cover the viewport and sit behind other content (using Tailwind’s fixed inset-0 -z-10).

Configuration for 60s Aesthetics: The config object allows extensive tuning of the fluid’s look and feel. Key parameters include:

Color palette: Use the COLOR_PALETTE (or color prop in fluid-simulation-react) to set vibrant psychedelic colors
npmjs.com
. For a 60s vibe, think lava lamp hues – e.g. hot pink, neon orange, electric blue, and lime. In the example above, we pass an array of hex colors; the simulation will randomly pick and cycle through them for each “splat” (fluid injection). This yields multi-colored swirling fluids. (In fluid-simulation-react, you’d pass color={[[1,1,0],[0,1,1]]} for yellow & cyan, as RGB arrays 0–1
npmjs.com
.)

Dissipation rates: The density and velocity dissipation control how quickly color and motion fade out
medium.com
. Lower values make fluid dissipate faster (mimicking higher viscosity), while values near 1.0 preserve motion longer (like a runny liquid)
npmjs.com
. For a lava-lamp style slow flow, you might set VELOCITY_DISSIPATION to a lower value (e.g. 0.2–0.5) so that movement energy dissipates quickly
github.com
. This creates heavy, gloopy motion that settles into blobs. In contrast, a value ~0.99 (the default
npmjs.com
) yields a more water-like, wavy motion that keeps swirling. Density (dye) dissipation can be set high (close to 1) so colors persist on screen
github.com
 – useful if you want enduring pools of color. For example, DENSITY_DISSIPATION: 0.8 causes trails to slowly fade, whereas 1.0 would make dye essentially permanent until moved.

Resolution & performance: Both libraries let you reduce simulation resolution to improve performance on mobile. In fluid-simulation-react, use textureDownsample (e.g. 2 or 3) to render the fluid on a smaller internal texture
npmjs.com
npmjs.com
. In webgl-fluid-enhanced, use SIM_RESOLUTION and DYE_RESOLUTION (e.g. 256 or 128)
github.com
. Lowering these will trade off detail for speed – crucial for older devices. You can even detect device pixel ratio or mobile user agent and dynamically choose a quality (for instance, SIM_RESOLUTION: 128 on mobile, 256 on desktop). Pavel’s original demo offered “high/medium/low/very low” quality settings for this reason
paveldogreat.github.io
. Also consider setting TRANSPARENT:true and using a CSS background image or color behind the canvas
github.com
 – this can simplify layering and improve paint performance.

Fluid behavior tweaks: The curl parameter introduces vorticity (swirliness) – Pavel’s default is 30 for a nice turbulent look
medium.com
. Increasing CURL (e.g. 50–100) yields more dramatic eddies and psychedelic “swirls.” Pressure iterations (e.g. 20–30) affect fluid smoothness; higher values make the fluid incompressible but cost more GPU cycles
medium.com
. For mobile, you might drop this to ~15 to save performance. These parameters can be tuned via trial – for instance, Jamie Wong’s fluid article suggests that more pressure solves divergence but has diminishing returns
medium.com
. Start with defaults and adjust based on the feel: a 60s liquid light show often has a slow, viscous flow with occasional bursts of turbulence, so you might prefer slightly higher viscosity (higher velocity dampening) with spurts of motion when disturbed (which could be achieved by occasional random splats).

Step-by-Step Integration in Next.js:

Install & Import: Add the library to your project and import the component or API in a client-side module. With App Router, ensure the fluid canvas component is in the app tree where needed (and mark 'use client').

Add Canvas to Layout: Place the <FluidCanvas/> component near the top-level of your page (e.g. in your main layout or as a sibling to your content) so it renders behind everything. Use CSS (or Tailwind classes) to position it absolutely/fixed with full-screen size and a lower z-index than other content. For example: <FluidCanvas className="fixed w-full h-full inset-0 -z-10" /> will make it a background. This ensures your fluid effect covers the viewport like a backdrop.

Pointer Events Setup: By default, the fluid canvas captures pointer events for interactivity. If your app has UI elements (buttons, links) on top, you likely don’t want the canvas intercepting clicks. A common solution is to set pointer-events: none on the canvas (CSS) so that clicks pass through to the UI. However, you still want the fluid to respond to the mouse! To achieve this, you can have the simulation listen to window-level mousemove events. In Pavel’s repo, a community PR modified it to listen on the window instead of the canvas
medium.com
. If using webgl-fluid-enhanced, set HOVER:true and then call simulation() on the canvas after you’ve inserted it behind content – then manually add a global event: e.g. window.addEventListener('pointermove', (e) => webGLFluidEnhanced.pointerMove(e)). (The library’s docs mention a global hover fix as well.) Another approach: keep pointer events disabled on the canvas but overlay a transparent DIV that still captures the pointer and forwards the coordinates to the simulation API (this is more complicated; leveraging the library’s built-in options is easier). The key is to ensure your UI remains interactive while the fluid still reacts to cursor motions. For example, Advanced.Team’s site had to “tweak the pointer events of the body, canvas, and divs” to get the fluid background and foreground content working together
medium.com
.

Customize Visuals: Adjust the config as described – set your color palette and tune parameters for the desired aesthetic. For an authentic 1960s look, consider using warm, saturated colors (magentas, yellows, cyans) and slightly slower fluid dynamics (higher viscosity). You can use the default black background (like a dark stage) or experiment with TRANSPARENT:true and a subtle multicolor gradient behind the canvas for extra vibe.

Test on Devices: Once integrated, test the fluid on both desktop and mobile. On mobile PWA targets, verify it doesn’t tank the frame rate. If it’s heavy, lower the resolution or set textureDownsample higher for those devices. The PavelDoGreat sim can run on mobile (it was even made into an app) – Bauer Web Studio managed 60 FPS across all devices by careful optimization
bauerwebstudio.com
bauerwebstudio.com
. This included using WebGL2 features and keeping the simulation resolution modest on small screens.

Real-World Usage: Many modern creative sites use this fluid background successfully. For example, Advanced Team’s homepage (advanced.team) and designer Jantana Hennard’s site both employed Pavel’s simulation as an interactive backdrop
medium.com
. These sites typically run the fluid canvas behind content, with continuous subtle motion. Another example is FORMLESS (formless.xyz), which features a constantly flowing colorful fluid effect that responds to cursor movement
reddit.com
. Developers on Reddit identified that formless.xyz likely uses a modified version of Pavel’s shader, with an “idle” animation so the fluid keeps moving even with no user input
reddit.com
. The WebGL Fluid Enhanced library supports this via initial random splats (INITIAL:true and SPLAT_AMOUNT settings to inject motion at start
github.com
). You can enable something similar so that as soon as your page loads, the canvas isn’t static – e.g. set INITIAL:true and maybe periodically call webGLFluidEnhanced.splat(x,y,dx,dy) to add random disturbances over time. This creates that classic liquid light show effect where oils are always in subtle motion due to heat currents (more on that in section 3).

Mobile Optimization Tips: In addition to reducing resolution, consider capping the frame rate or pausing the simulation when off-screen. The fluid library runs on requestAnimationFrame; if your page has heavy sections or the user scrolls away, you might call webGLFluidEnhanced.pause() to halt it
github.com
. Also ensure WebGL context handling: Pavel’s code will try WebGL2 and fall back to WebGL1 if needed
medium.com
medium.com
. This means even older mobile browsers should still see something, albeit with lower precision (half-float textures). Just be mindful of the GPU memory – a full-screen 512x512 fluid with multiple render targets can be memory intensive, but generally fine for modern devices.

By following these steps, you can seamlessly integrate the fluid simulation into Next.js. The end result is a background canvas with authentic psychedelic swirls that your other React components can live on top of.

2. ShaderGPT + Shadertoy Workflow for Custom Liquid Shaders

AI-Generated Shaders with ShaderGPT: ShaderGPT is an experimental tool by 14islands that uses large language models to generate GLSL shaders from natural language prompts
fountn.design
fountn.design
. In practice, you can leverage ChatGPT (or ShaderGPT’s interface) to create novel fragment shaders mimicking 60s liquid light effects. The key is crafting effective prompts. Prompting Strategies: Describe the visual style and motion in detail, using terms from both art and graphics. For example: “A 1960s psychedelic liquid light show shader. Swirling colorful blobs of liquid merging and splitting, with tie-dye neon colors. Slow, trippy oscillating movement.” Including phrases like “fluid dynamics”, “lava lamp blobs”, or “reaction-diffusion psychedelic pattern” can guide the AI to use fluid-like algorithms (perlin noise flow, metaballs, etc.). It helps to mention specific techniques: e.g. “use sinusoidal distortion” or “use a distance field for blobs with soft edges”. Try iterative prompting: start simple (“swirling colorful fluid shader”) and then refine (“add slow rotation”, “make colors very saturated 1960s style”, “blobs should merge like oil drops”). ShaderGPT’s interface allows quick previews, so you can adjust your prompt until the output looks right
fountn.design
fountn.design
. In our experience, including color keywords and motion adjectives is crucial – e.g. “a swirling purple and orange vortex with pulsing edges” yields a very different result than “two-tone lava lamp blobs slowly undulating”.

Shadertoy as a Testing Sandbox: Once you have a GLSL fragment from AI, test it on Shadertoy.com for quick iteration. ShaderGPT often outputs code in a Shadertoy-like format by default (using mainImage() with fragCoord, iTime, etc.), since that’s a common shader format. You can paste the shader into Shadertoy’s editor and see it live. Use Shadertoy’s UI to tweak uniforms (like speed or color) if the shader provides them, or directly edit the code. This sandbox is great for verifying the AI shader’s visuals before integrating into your app.

Adapting Shadertoy Shaders to Three.js (React Three Fiber): Shadertoy shaders are essentially fragment shaders written for a full-screen quad. To use them in Three.js or R3F, you need to do a few adjustments:

Wrap in a ShaderMaterial: In Three.js, you can create a plane covering the screen (or use a postprocessing pass) and attach a custom shader material. Within R3F, this can be done by using a <shaderMaterial> from @react-three/drei or writing a custom material component.

Uniforms and Varyings: Shadertoy provides certain uniforms by default: iResolution (viewport size), iTime (time in seconds), iMouse (mouse coordinates), etc. You must declare and update these uniforms in Three.js. For example, in a Three shaderMaterial you would define uniform vec3 iResolution; uniform float iTime; uniform vec4 iMouse; in the fragment shader and pass those from your React code each frame
felixrieseberg.com
felixrieseberg.com
. R3F’s useFrame hook is perfect for updating a uniforms.iTime.value += delta and uniforms.iMouse.value.set(x,y,…) each frame.

Coordinate Space: Shadertoy uses fragCoord (pixel coordinates) in mainImage(). In Three.js, you often use UV coordinates (0 to 1). You have two approaches:

Modify the shader to use UVs: In your fragment shader, replace references to fragCoord/iResolution with a varying UV. For instance, pass vUv from a simple vertex shader (vUv = uv;) and then do vec2 uv = vUv; in fragment. Replace any fragCoord usage accordingly
bumbeishvili.medium.com
bumbeishvili.medium.com
. Remove the Shadertoy mainImage wrapper and put the code inside Three’s main() function using gl_FragColor for output
bumbeishvili.medium.com
bumbeishvili.medium.com
. This method is clean if you are comfortable editing the shader code.

Use gl_FragCoord directly: Alternatively, you can leave the shader mostly as-is and in your Three material set gl_FragCoord up. Use an OrthographicCamera covering the screen and a plane from -1 to 1 so that gl_FragCoord maps 1:1 to screen pixels. Then keep the mainImage() call pattern. The example by David B. shows embedding a Shadertoy shader by calling mainImage(fragColor, gl_FragCoord.xy) inside Three’s main()
bumbeishvili.medium.com
bumbeishvili.medium.com
. They still declare the uniforms like iTime and use an orthographic projection so that the fragment coordinates correspond to actual pixels. This way you can literally paste the Shadertoy code block (including its mainImage function) into a Three fragment shader string. Just remember to include any required uniform definitions above it.

Vertex Shader: For a full-screen effect, a minimal vertex shader is used (just pass through position and UV). Many Shadertoy-to-Three tutorials use an orthographic camera and a plane with corners at NDC. For example
bumbeishvili.medium.com
, the vertex shader might simply set gl_Position = vec4(position, 1.0) for a plane that spans [-1,1] (NDC). In R3F with <OrthographicCamera makeDefault /> and a <planeGeometry args={[2,2]}>, you can cover the screen easily
felixrieseberg.com
felixrieseberg.com
.

Handling Shadertoy specifics: Remove any unsupported WebGL code. For instance, Shadertoy allows texture(iChannel0, uv) for sampler channels – you’ll need to supply actual textures and declare uniform sampler2D iChannel0;. Also, Shadertoy uses precision highp by default; ensure you declare precision in your shader string (precision highp float;) if using raw ShaderMaterial. Common issues include forgetting to replace fragColor output with gl_FragColor (for WebGL1) or ensuring you use gl_FragColor in WebGL contexts that don’t support layout(location=0) out vec4 style (WebGL2 allows explicit out but Three might expect gl_FragColor unless using RawShaderMaterial and WebGL2 context).

Common Conversion Pitfalls:

Black screen: Often means a uniform wasn’t passed or your UV mapping is off. Check that you update iResolution (Three expects a Vector3; use Vector3(width,height,1)
bumbeishvili.medium.com
) and iTime. If the shader uses iMouse and you don’t set it, some shaders may read it as 0 and might behave oddly (but usually just no mouse effect).

Coordinate mismatch: If your shader appears squashed or mirrored, likely the UV vs fragCoord usage is wrong. Remember Shadertoy’s uv = fragCoord.xy / iResolution.xy maps (0,0) at bottom-left, whereas Three’s UV (0,0) is bottom-left by default for textures. If using UV, you might need to flip Y or use vec2(uv.x, 1.0-uv.y) if the shader was coded with a different origin.

Performance issues: Some Shadertoy shaders are extremely complex (heavy raymarching, lots of iterations). An AI-generated one might not be optimized. Compare performance by profiling frame times. If an AI shader runs slow, try simplifying it (e.g., reduce iteration loops count, precompute some tables, lower resolution by rendering to smaller offscreen target and upscaling). In general, a hand-crafted shader from Shadertoy might be more optimized than an AI-generated one that achieves the look brute-force. Performance comparison should consider that a physically-based fluid sim (like Pavel’s) offloads most work to a few ping-pong draw calls on GPU, whereas an AI “procedural” shader might be doing expensive math per-pixel each frame. For example, a custom shader that does multi-octave noise for swirling patterns might use more GPU time per frame than the grid-based simulation. Test both approaches: you can measure FPS or use the Chrome DevTools Performance panel to see GPU load. In some cases, combining an interactive simulation with AI shaders can yield worse performance than using the tried-and-true simulation alone. So always evaluate complexity – sometimes the most gorgeous Shadertoy demo runs at 20 FPS at full HD. You may need to dial down resolution or complexity for production.

Three.js Integration Example: Here’s a brief outline using R3F hooks – assume you have a fragment shader string (converted from Shadertoy):

// Pseudo-code for integrating an AI/Shadertoy shader in R3F
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3, Vector4, Clock } from 'three';
import shaderFragment from './shader.glsl';

function ShaderPlane() {
  const materialRef = useRef();
  const start = useMemo(() => performance.now(), []);
  useFrame(({ size, mouse }) => {
    const time = (performance.now() - start) / 1000;
    // Update uniforms each frame
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = time;
      materialRef.current.uniforms.iResolution.value = new Vector3(size.width, size.height, 1);
      materialRef.current.uniforms.iMouse.value = new Vector4(
        mouse.x * size.width, 
        mouse.y * size.height, 
        0, 0
      );
    }
  });
  return (
    <mesh scale={[2,2,1]}>
      <planeGeometry />
      <shaderMaterial 
        ref={materialRef}
        fragmentShader={shaderFragment}
        uniforms={{
          iTime: { value: 0 },
          iResolution: { value: new Vector3(0,0,0) },
          iMouse: { value: new Vector4() }
        }}
      />
    </mesh>
  );
}

// Usage:
<Canvas camera={{ position: [0,0,1], near:0.1, far:100 }} orthographic>
  <ShaderPlane/>
</Canvas>


This sets up a fullscreen plane with the shader. We manually manage iTime, iResolution, iMouse. Note: mouse.x and mouse.y in R3F are normalized (-1 to +1), so we scale by viewport size to get pixel coords (assuming our shader expects Shadertoy-style pixel mouse coords). If your shader uses iMouse.zw for click down/up, you’d handle pointer events to set those.

Testing & Iteration: Always verify the shader in isolation. Shadertoy has an advantage of a community – you might find an existing shader very close to what you want (search Shadertoy for “lava lamp” or “liquid”). Sometimes it’s faster to take a known Shadertoy shader (with permission) and adapt it than to prompt GPT from scratch. If using an AI-generated shader, inspect the code for inefficiencies: e.g., GPT might not know certain optimizations or might include unused uniforms. Clean those out. Add comments in your code for any AI-generated sections and perhaps keep a copy of the prompt used – this is useful for future maintenance (as discussed in section 4).

Summary: The ShaderGPT + Shadertoy workflow can produce custom psychedelic effects that aren’t constrained by a physics simulation. By prompting carefully, converting the shader to Three.js, and addressing common issues (uniforms, coords, performance), you can integrate these AI-created shaders into a React app. Just remember to profile them – if the AI shader is too slow, you might simplify it or use it in combination with the fluid sim (e.g., use the shader as a post-processing layer for color effects on the fluid simulation).

3. Authentic Movement Physics – Thermal Currents, Surface Tension, and Motion Patterns

To truly mimic the physics of 60s liquid light shows, we should understand what caused those mesmerizing motions. In the real shows, blobs of colored oil and water on a hot projector produced thermal currents, convection, surface tension-driven blob merging, and slow oscillatory flows. Simulating all of these accurately is complex, but we can approximate key aspects:

Thermal Currents (Buoyancy): Heat from the lamp causes fluid to rise and fall – in fluid simulation terms, this is a buoyancy force. In a Navier-Stokes solver, you can introduce a temperature field that adds an upward force where fluid is warm. A simplified approach: apply an artificial buoyancy force in the fluid equations
n-e-r-v-o-u-s.com
. For example, you can add a small upward velocity in regions of lower density (or simply everywhere uniformly) to simulate warm fluid rising. In Pavel’s shader code, there isn’t built-in buoyancy, but you could hack it: one idea is to constantly inject a gentle upward flow. If you had access to the velocity field, you’d do velocity.y += b * dt each frame (with b being a buoyancy constant). With the current library, a workaround is to periodically trigger splat forces from below – e.g., every few seconds, call splat(x_random, canvasHeight, dx=0, dy=-small) for a rising bubble effect, or the opposite if you want downward currents. In an SPH (particle) fluid simulation, temperature can lower fluid density causing rise
n-e-r-v-o-u-s.com
, but with grid-based solvers like ours, a direct force injection is easier. The Nervous System simulation guide notes that buoyancy can be faked as a constant upward force in place of gravity
n-e-r-v-o-u-s.com
. For our purpose, implementing a full thermal diffusion model might be overkill – instead, try a simple oscillating vertical flow: for example, add a slow sin-wave to the y-component of velocity globally (simulate an updraft that oscillates). This could be done by adding a velocity offset each frame: v.y += A * sin(time * freq) in the shader (if modifying the source) or applying a slight y-movement to all new splats (e.g., when user moves mouse, add an upward bias to the splat delta).

Surface Tension & Blob Merging: Real oil blobs merge when they touch due to surface tension minimizing the surface area. Standard fluid simulations (Navier-Stokes grid solvers) do not model surface tension by default
n-e-r-v-o-u-s.com
 – they treat the fluid as a continuous dye with no interfacial tension. To simulate blob behavior, we have a few options:

Shader-based approach: Use a metaballs or reaction-diffusion technique. Metaballs treat each “blob” as a field that merges naturally – this is essentially an iso-surface of a scalar field. There are Shadertoy examples (and even GPU Gems examples) of metaball fluid. If you generate N circles (blobs) and draw them with a field that adds up, the threshold creates organic merging shapes. This might be something an AI shader could do (with distance functions). Reaction-diffusion (Turing patterns) can also produce blob-like merging and splitting
muffingroup.com
, though more like chemical waves than flowing oil. The Turing Fluid Simulator (cake23.de) mentioned in the trippy sites list uses reaction-diffusion equations to get very organic fluid-like patterns
muffingroup.com
 – swirling the mouse stirs it, giving a fluid appearance with merging color domains. If surface tension is critical, a metaball or particle approach might capture it better than the Eulerian grid.

Augmenting Navier-Stokes: Some research adds surface tension by identifying fluid free surfaces and applying curvature forces
n-e-r-v-o-u-s.com
. In SPH (smoothed particle hydrodynamics), you detect surface particles and apply a cohesive force to pull them together
n-e-r-v-o-u-s.com
. Implementing this in our WebGL setup would mean post-processing the density field to find edges of blobs and then adjusting velocities inward. That’s quite advanced and not readily supported by existing WebGL fluid code. A simpler hack: tweak the fluid parameters so that it naturally forms “blobs”. For instance, high density dissipation (close to 1.0) means the dye doesn’t diffuse away – color stays concentrated, which helps maintain blob-like regions. Also, using a lower fluid resolution will cause individual plumes to appear chunkier and merge together rather than finely mixing (essentially blurring the boundaries less). Additionally, enabling pressure and vorticity confinement yields rounder shapes. Pavel’s sim already has a bit of that via the curl and pressure solver, but you could experiment with reducing diffusion so that when two color streams meet, they don’t immediately blend uniformly but rather push against each other a bit (mimicking immiscible liquids).

Thresholding for blob edges: Another trick: once you have the fluid image, you can post-process the fragment color to exaggerate blobs. For example, apply a posterize or sigmoid filter in a shader to make densities above a threshold more opaque and below more transparent – this can visually clump fluid into blob shapes. Combined with a slight blur, it can look like blobby shapes merging.

In summary, true surface tension requires specialized simulation or particle systems. However, for a convincing effect, you might not need physical accuracy – just ensure the fluid doesn’t dissipate too quickly and colors remain somewhat separate. The WebGL Fluid Enhanced library has a COLORFUL mode that rapidly changes colors
github.com
; turning that off (or using a fixed palette) means a given blob of dye keeps its color, making it easier to track “blobs” visually and see them merge.

“Slow Rotation + Oscillating Jiggle” Patterns: A hallmark of the analog shows was that the liquid plates were often slowly rotated by hand, and vibrations caused jiggling. To simulate a slow global rotation, you can impart a subtle rotational flow to the whole fluid domain. One idea: continuously apply a small twisting force around the center. In a shader context, that could mean adding a curl noise or rotational vector field. For example, for each pixel’s velocity, add a term like ω × r (a perpendicular vector) to induce spin. Practically, you could periodically splat in a circular pattern – e.g., four splats around the center with velocities tangential to a circle. If coding from scratch, you could add a uniform rotation by offsetting coordinates with time (like rendering the simulation in a rotating reference frame). However, that’s complex to inject into Pavel’s code without rewriting shaders. A simpler approach: apply a post-transform to the rendered canvas – for instance, use a CSS animation or an extra shader pass to rotate the entire fluid texture slowly (say 5° per second). This won’t change the fluid simulation’s physics but will give the visual impression of rotation. If done slowly and combined with fluid motion, it can feel like the fluid is rotating in the dish.

For the oscillating jiggle, think of it as a low-frequency vibration causing blobs to wobble. You can simulate this by modulating some aspect of the fluid periodically. For example:

Slightly oscillate the gravity or buoyancy: e.g., make the upward force b * sin(time * 0.5) so every few seconds the fluid gently reverses buoyant direction – causing a slow slosh back and forth.

Oscillate the boundaries: if the fluid is in a container, moving the container would jiggle the fluid. You could emulate moving boundaries by adjusting how splats reflect at the edges. In absence of that, you could inject a very subtle velocity field that is an oscillating function of position. For instance, add dx = A * sin(y * frequency + phase) to velocity (a horizontal shear that oscillates in time).

Another trick: use a small periodic injection of curl – e.g., every second, add a tiny vortical spin somewhere, then the next second opposite spin. This can set up an oscillation.

The goal is not an obvious wave, but an almost imperceptible quiver in the fluid. You might not find an out-of-the-box parameter for this, so experimentation is needed. Using the fluid simulation’s own parameters: increasing and decreasing PRESSURE or CURL periodically could also cause the fluid to alternate between more turbulent and more stable states, resulting in a dynamic steady-state that “breathes.”

If you want to get mathematical: a combination of two sinusoidal flows slightly out of phase can produce a beat pattern that jiggles the fluid. For example, apply v.x += 0.1*sin(time) and v.x += 0.1*sin(time + φ) for some small φ; their interference might create a gentle oscillation. Keep any such perturbations small – too much and it looks like an artificial wave rather than the subtle shimmer of a projector plate.

Viscosity and Flow Parameters: The visual difference between a lava-lamp oil blob and water ripples largely comes down to viscosity and inertia. In our simulation, the velocity dissipation is effectively a proxy for viscosity (since high dissipation = quickly lost momentum = thick fluid). A lava lamp effect calls for higher viscosity: use a lower velocity dissipation (e.g. 0.85 or even 0.5 as mentioned) so that as soon as movement happens, it damps out and blobs tend to stick together. Also lower diffusion of dye (so blobs don’t mix quickly). You might also reduce the “curl” so you don’t get fine turbulent tendrils – lava lamp blobs move smoothly rather than swirling into tiny filaments. Perhaps set CURL to a smaller value (or even 0) for very smooth bulk motion.

For a water-like effect, you do the opposite: high velocity retention (0.99, nearly no viscosity), so flows keep going and break into detailed swirls. Higher curl can accentuate small vortices. Lower density dissipation (like 0.9) so the color trails behind in whispy ways. Essentially, water in this context means the fluid will form lots of intricate waves and eddies, whereas oil will form large slow-moving globs.

In the webgl-fluid-enhanced config above, note how setting VELOCITY_DISSIPATION: 0.2 and DENSITY_DISSIPATION: 1 would make the fluid stop moving very quickly and the color never fade
github.com
 – this could simulate a heavy oil that once moved, almost freezes in place as a persistent blob. On the flip side, VELOCITY_DISSIPATION: 0.99 and DENSITY_DISSIPATION: 0.9 would behave more like smoke or water – motion continues and color gradually evaporates.

Implementing these in code: Both fluid libraries expose these parameters, so it’s just about choosing values. If you want to incorporate dynamic changes (like oscillating something with time), you might need access to the internal loop. For instance, with fluid-simulation-react or webgl-fluid-enhanced, after initialization you don’t easily inject forces except via user interaction (splat events). You can, however, call the splat(x,y, dx,dy, color) function on an interval to simulate continuous forces
github.com
github.com
. For thermal currents, you could splat upward forces randomly from the bottom center. For jiggling, maybe splat tiny forces alternating left/right on the fluid periodically. These are creative uses of the API to approximate the physics.

Summary: Authentic physics like surface tension and thermal convection are challenging to fully simulate in real-time WebGL, but by clever tuning and small hacks we can get close. Use buoyancy forces (fake or via splats) to simulate rising heat currents, adjust dissipation for viscosity differences, and introduce subtle oscillatory forces for that slow rotation and jiggle. If ultimate realism is required, one might consider a custom solver (e.g. an SPH simulation of few blobs), but for production web apps, the above tweaks to a stable fluid engine strike a good balance between visual authenticity and performance. Always test the effect: Does it feel like the lava lamp at a 60s gig? If blobs are merging too fast, increase that surface tension effect by reducing diffusion. If everything is too static, ease off the viscosity. Through iterative tuning, you’ll be able to nail the vibe of an authentic psychedelic liquid motion.

4. Hybrid Strategy: Combining AI-Generated Shaders with Established Libraries

Rather than choosing between an AI-generated shader or a physics library, you can blend both approaches to get the best of each. A hybrid strategy might look like this: use the proven fluid simulation engine for core motion (ensuring stable, interactive fluid dynamics), and layer on AI-generated shader effects for extra visuals or fine-tuned styles. Here are some guidelines:

Division of Responsibilities: Identify which aspects are better handled by known algorithms vs AI. For example, basic fluid motion (advection, diffusion) is complex to get right – libraries like Pavel’s have highly optimized GLSL code for it (based on Stable Fluids from GPU Gems Ch38). It’s wise to trust this for the heavy lifting of moving pixels around realistically. On the other hand, specific visual embellishments (color cycling, warping, pattern overlays) can be generated by AI shaders to give a unique twist. For instance, you might use the fluid library to produce a black-and-white flow field (or basic colored fluid), and then use an AI shader as a post-process to recolor it in a tie-dye style or add bloom/glitch effects. Use AI for what it’s best at – generating creative visuals quickly – and use the library for what it’s optimized for – correct fluid physics.

Integration Patterns: One effective pattern is the post-processing stack. Render the fluid simulation to a texture (off-screen canvas) and then have a shader (maybe AI-generated) sample that texture and apply transformations. With Three.js you could use EffectComposer – e.g., one pass that draws the fluid (as a background or on a plane), then another pass with a custom fragment shader that takes the fluid texture as input (iChannel0) and does funky stuff (color inversion pulses, edge detection for outlines, etc.). This layering means you don’t risk destabilizing the fluid algorithm by injecting unknown code; you treat the AI shader as a filter on top. For example, an AI shader could be prompted to “simulate an analog projector look – with slight chromatic aberration and film grain on an input texture of swirling fluid”. You’d then integrate that by passing the fluid render into the shader. React Three Fiber can handle this via the <Effects> component or just by rendering to a texture via WebGLRenderTarget.

Another pattern: hybrid shaders where you splice AI-generated code into known frameworks. Suppose you want a custom force in the fluid – you could ask GPT to generate a GLSL function that computes a force field (like a turbulence function) and then plug that into the fluid solver’s code (if you are modifying the library). This is advanced and requires understanding the library’s source, but AI can assist in writing say a curl-noise function or a simplex noise routine you integrate. You still rely on the library for the rest, but use AI to generate specific pieces (with careful code review!).

Version Control & Maintenance of AI-Generated Code: Treat AI code as you would any third-party snippet: check it into your repo, commented and tested. It’s important to retain the prompt or reasoning behind it – consider adding a comment block in the shader code: /* Generated by ChatGPT - prompt: "...." on 2025-09-12 */. This acts like documentation, so six months later if you need to tweak it, you know the origin. Because AI code can be unconventional, do a thorough code review. Ensure it meets your project’s standards (formatting, naming, no obviously inefficient loops, etc.). If the AI shader is long or complex, you might even break it into smaller pieces and add unit tests (though testing GLSL functions outside of runtime is tricky – you could use tools like glslunit or capture the shader’s output for known inputs).

For version control, it’s often helpful to keep the prompt alongside the code (in comments or in the commit message). If a future developer regenerates the shader with a better model or prompt, they should commit that as a new version, rather than blindly editing the code without context. In short, maintain AI-generated shaders like you maintain other assets – with history and documentation.

When to Regenerate vs When to Refine: Sometimes an AI shader might partially work but needs fixes. Minor fixes (like off-by-one in coordinates, or adding a uniform) you do manually. But if it’s fundamentally flawed, consider re-prompting or using a different model. Keep track of quality: If a shader is critical, it might be worth rewriting parts by hand for stability. AI is great to jump-start creative coding, but once you have a baseline, it can become just another piece of code to maintain.

Testing Complex Shader Combos: When you layer shaders (fluid + postprocessing or multiple passes), test each component in isolation first. Verify the fluid engine outputs expected patterns (perhaps by temporarily drawing it to screen). Then verify the AI shader filter using a simple input (e.g., feed it a static test texture to see its effect). Finally, test them combined. Look for edge cases: e.g., if the fluid output goes to very low values, does the AI shader blow it up (perhaps divide by zero or amplifying noise)? Use tools like Spector.js (a WebGL frame debugger) to capture a frame and inspect the intermediate textures and shaders – this can be invaluable for debugging multi-pass effects.

Also consider performance testing of the combo. It’s possible each component is 60fps alone, but combined they drop the frame rate (maybe fill-rate or memory bandwidth becomes an issue). Profile with DevTools or even add your own timing around the render loop. If you see a hit, you might decide to simplify the AI shader or reduce the resolution of one of the passes.

Optimal Combination Example: You might decide, for instance, to use Pavel’s fluid for movement, and an AI-generated “kaleidoscope” shader to recolor and mirror the output for a truly trippy effect. The fluid gives natural motion; the AI shader gives a unique look. The integration would involve rendering the fluid to a renderTarget every frame, then in the main canvas, drawing a full-screen quad with the kaleidoscope shader sampling that renderTarget. The result: proven fluid physics, but an AI-crafted visual twist on top. This is often more efficient and reliable than asking AI to do everything (which could result in a slower, purely procedural fluid).

Maintaining AI Code: Because AI shaders can be lengthy, use source control effectively. Break the shader code into logical sections with comments (even if AI didn’t provide them). Write down expected behavior (“// this part creates three moving blobs and blends them”). If an update to your design is needed (say you want more blobs or a different palette), you can either manually edit or go back to AI with a refined prompt. If you do the latter, make sure to diff the new shader against the old to see what changed – sometimes AI might inadvertently introduce new issues. Having tests or at least known visual benchmarks helps ensure the new version still meets requirements.

Collaboration between AI and Library in Development: It might be useful during development to use AI to generate small helper functions or ideas, then incorporate them. For example, you could ask GPT for “GLSL function to compute surface tension force given a normal vector” just to see how it might be done physically, even if you don’t plug it in directly. The AI can act as a creative coding partner, but you as the developer orchestrate which parts go where.

Case Study – Bloom and Sunrays: The fluid-enhanced library itself showcases a hybrid concept: it has the core fluid, plus optional bloom and sunrays shaders to enhance visuals
github.com
. Those shaders were not generated by AI but designed by humans, yet conceptually you could swap them with AI variants. If you wanted a more “60s projector” feel, you could disable the built-in bloom and instead apply an AI-generated color diffraction shader (to mimic how old projectors might fringe colors at the edges). This is another hybrid approach: rely on the library for mechanics, but replace or augment its built-in effects with AI-designed ones to fit your artistic vision.

Version Control Strategy: If your project integrates both library code and AI code, be mindful when updating libraries. For example, if webgl-fluid-enhanced releases an update, ensure your custom modifications (if any) or usage still work. Keep your AI shaders decoupled enough that a library upgrade doesn’t break them (since they likely just take the library’s output as input). If you have forked or modified the fluid library shader code (less ideal, but possible), clearly document those changes. One approach is to maintain a patch file or git branch with your mods, so you can reapply them on a new version if needed. Because AI code might not be easily diffable (if regenerated), try to stick to one approach: either lock down a good version of the shader and treat it as source, or regenerate afresh but then thoroughly test.

Automated Testing: For complex visuals, automated tests are tricky, but you could have a regression test that renders a frame off-screen and compares it to a baseline image (perhaps with a tolerance, since fluid is dynamic). This could catch if an update changed the overall look drastically or if a shader fails to compile. Also test on multiple hardware (some low-end phones vs high-end PC) to ensure no shader exceeds hardware limits (e.g., too many texture accesses or too high precision demands).

In summary, a hybrid strategy can accelerate development (AI gives you quick creative shaders) while ensuring reliability (trusted fluid engine). The key is clear separation of concerns, rigorous testing, and treating AI-generated code as first-class code in your project (with documentation and versioning). This approach often leads to faster concept-to-production, as you’re not reinventing the wheel where you don’t have to, and you inject innovation where you want it.

5. Production Examples and What Works in Practice

To ground these strategies, let’s look at a few live websites that feature impressive psychedelic or fluid backgrounds, and examine how they implement and optimize them:

Advanced Team (advanced.team): As mentioned, this digital agency site has a full-screen fluid background behind its content. Upon inspection, it appears to be a customized version of Pavel Dobryakov’s WebGL Fluid. The site responds fluidly (no pun intended) to cursor movements with colorful swirls. Notably, the developers ensured the effect runs underneath the interactive content. They achieved this by fixing the canvas as a background layer and adjusting z-index and pointer events so that the fluid reacts to cursor without blocking clicks
medium.com
. This implies they set pointer-events: none on the canvas and used the trick of listening to window mouse events (as described earlier). In terms of parameters, the feel is very fluid and light – likely using relatively low viscosity (high velocity retention) to keep motion flowing while the user is idle. Performance-wise, the site is smooth on desktop. On mobile, it possibly switches to a simpler background (some sites disable heavy WebGL on mobile if performance is insufficient). However, since Pavel’s sim can work on mobile, they might just use a lower quality setting. An anecdote from a Medium article
medium.com
 indicates the default Pavel implementation triggered only on drag, and Advanced Team had theirs on hover, which means they definitely modified the event handling (as confirmed by an open-source PR
medium.com
). Takeaway: Advanced.Team shows that using the fluid simulation in production is feasible, but you must handle layering and events carefully. It also demonstrates the importance of tweaking the interaction model (trigger on hover vs drag) to fit your UX.

FORMLESS (formless.xyz): This site’s background fluid is less in-your-face, more of a continuous subtle motion. According to a Redditor’s analysis, it runs even when not interacting, providing a gently moving backdrop
reddit.com
. Likely they achieved this by introducing continual forces (like initial splats or low-level noise in the velocity field). The repository “WebGL-Fluid-Enhanced” was actually created to replicate such behavior, with features like INITIAL:true to do random splats on load
github.com
 and an API to trigger ongoing splats. In production, having an idle animation is great for visual appeal, but you should also consider a fallback: perhaps if the tab is inactive or on very low-end devices, stop the idle animations to save battery. This can be done by checking the document.visibilityState and pausing the sim when not visible.

Len Bauer’s Fluid (fluid.lenbauer.com): This is essentially a polished product of a fluid sim (from Bauer Web Studio). They report it runs 60fps on all devices, and they achieved that with multi-layered optimizations and effects
bauerwebstudio.com
bauerwebstudio.com
. Their approach includes bloom and sunrays to enhance the look, which shows that adding post-effects can significantly improve the perceived quality (the fluid looks like it’s glowing). In production, they likely used half-resolution buffers for those effects (common trick: apply bloom on a downsampled texture to save processing, since slight blur is acceptable). They also mention touch controls for mobile
bauerwebstudio.com
. This highlights that on mobile, instead of hover, you use touch events (and perhaps limit the number of simultaneous touch “pointers” to keep the sim stable). If implementing, ensure to handle touchmove and generate splats from those, and possibly throttle them (since a fast finger can easily overwhelm with continuous splats – maybe process only every few frames).

Other Examples: Some award-winning sites incorporate fluid or reactive backgrounds, though not always the same algorithm:

Apple’s WWDC2022 webpage had a background with colorful fluid-like shapes (possibly a custom shader rather than a full simulation).

Awwwards “Mouse Fluid” demo shows an interactive fluid element
awwwards.com
, likely using a shader approach.

The list of trippy sites mentioned a Turing Fluid Simulator
muffingroup.com
 – that one by Georg Fischer (cake23) is a purely shader-based reaction-diffusion, which in production is simpler (only one pass shader) and extremely performant on modern GPUs. It might not respond to user input as naturally as a Navier-Stokes fluid, but it’s a viable alternative if you want continuous psychedelic visuals with minimal CPU usage.

What We Learn About Performance: In production, maintainers often:

Limit the resolution: e.g., for a 4K screen, they might cap the fluid sim at, say, 1024x1024 simulation grid and upscale it. Users rarely notice a slight blur in an abstract background.

Optimize interaction frequency: maybe they don’t spawn 100 droplets per second under the cursor – they spawn a few large ones to create effect without overloading.

Use requestAnimationFrame smartly: ensure no other heavy JS runs in that loop. The fluid libraries mostly handle this internally in an optimized manner (using WebGL to do parallel computation). As a developer, you should avoid adding heavy computations in the same tick.

Fallback: Provide a static image or simpler animation for very old browsers or devices that cannot do WebGL. This could be as simple as using Modernizr to detect WebGL support and swapping a <canvas> with a <video> or GIF of a fluid effect as a fallback. Some sites have a “toggle visuals” for users if performance is an issue.

Production Benchmarking: If possible, gather metrics. For example, measure the FPS on typical devices (you can use the Performance API or just a custom loop incrementing a counter and checking per second). The Bauer Web Studio case implies they did extensive cross-device testing to ensure smoothness
bauerwebstudio.com
. Achieving 60fps on mobile probably required reducing effect detail (maybe disabling sunrays on lower end). Use feature detection: e.g., if WebGL2 isn’t supported, fall back to a simpler effect because WebGL1 might struggle with high-res fluid without half-float blending.

Evidence of What Works: Summarizing the above:

Stable, maintained libraries (like Pavel’s or its forks) are battle-tested – using them is generally safer for production than a novel shader with unknown stability. Many sites have deployed these with success, proving their viability.

Simpler shader effects (like reaction-diffusion or noise shaders) can also produce psychedelic visuals at lower cost – if interactivity is not paramount, these might be used. For instance, an interactive piece “Canopy” by ChromeExperiments
muffingroup.com
 uses fractal growth (different algorithm) but achieves a trippy endless effect with good performance.

Hybrid use in production: While there aren’t public examples explicitly stating “we used GPT to generate our shader,” it’s likely some studios use AI tools internally now. The key point is that any AI-generated code that makes it to production has usually been heavily reviewed and optimized by developers after initial generation. So while AI can speed up R&D, the final production code is curated.

File Structure and Build: For a Next.js app in production, organize your files so that shader code is easy to manage. Place GLSL files in a public/shaders or use a .glsl.js approach (some use template literals in JS). Use a loader or a vite plugin if needed for .glsl imports. Ensure these files are watched by your build so changes propagate. In package.json, lock versions of critical deps (like three, react-three-fiber, fluid libs) to avoid surprises. Also if using WebGL extensions, double-check that Next’s bundling doesn’t tree-shake them out. Sometimes you might need to import three’s add-ons (e.g. THREE.BasicEffectComposer) to ensure all pieces are included.

Monitoring in Production: Integrate performance monitoring. You could use the User Timing API to mark frames or use a library like web-vitals to see if the long tasks increase (a fluid sim might count as long tasks if not careful). React DevTools Profiler won’t show much for the fluid animation (since it’s mostly outside React once initiated), but you can use it to ensure that the React part (mounting the canvas, etc.) isn’t re-rendering unnecessarily. Ideally, the FluidCanvas mounts once, and then the library runs imperatively – React DevTools should show near-zero re-render activity from it. If you see repeated mounting/unmounting (maybe due to Next’s routing or key changes), fix that – keep the canvas mounted across navigations if possible to avoid restarting the simulation unless needed.

Finally, user experience considerations: these effects can be dazzling but also distracting. Some production sites provide a toggle or automatically tone down the effect after some time (e.g., reduce contrast or fade it a bit so text remains readable). For accessibility, ensure any important content isn’t obscured by the fluid. Many designs put the fluid behind a translucent layer or blur it under text. In technical terms, that might mean using CSS backdrop-filter or rendering the fluid to a texture and blending it with an overlay color to desaturate it behind content.

In conclusion, real production implementations confirm that our chosen techniques – Pavel’s simulation, optimized shader workflows, hybrid layering – do work at scale, as long as we mind the details of integration and performance. By studying these examples and following best practices (layer canvases properly, fine-tune quality, test on devices, and keep the experience smooth), we can confidently go from concept to a stunning, working production code in the shortest time.

Sources:

Pavel Dobryakov’s WebGL Fluid Simulation (React integration and parameters)
npmjs.com
npmjs.com
github.com
github.com

Medium – “Explaining fluid-simulation-react” (parameter definitions and usage)
medium.com
npmjs.com

fluid-simulation-react NPM README (basic usage example)
npmjs.com
npmjs.com

webgl-fluid-enhanced Documentation (Next.js usage and config options)
github.com
github.com

Medium – “How I built the animation on my portfolio” (Webflow/Pavel integration notes)
medium.com
medium.com

ShaderGPT description (AI shader generation via natural language)
fountn.design
fountn.design

Medium – “Porting ShaderToy shaders to Three.js” (differences in coordinates and uniforms)
bumbeishvili.medium.com
bumbeishvili.medium.com

Felix Rieseberg – “Using Shadertoy Shaders in Three.js” (R3F integration tips)
felixrieseberg.com
felixrieseberg.com

Nervous System’s simulation notes (SPH surface tension and buoyancy)
n-e-r-v-o-u-s.com
n-e-r-v-o-u-s.com

GitHub – webgl-fluid-enhanced (additional features like initial splats, bloom)
github.com
github.com

Reddit – r/webgl discussion (formless.xyz fluid effect and enhanced repo)
reddit.com
reddit.com

Bauer Web Studio – Fluid WebGL project (performance goals and multi-layer solution)
bauerwebstudio.com
bauerwebstudio.com