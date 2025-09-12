# 🎨 Psychedelic MCP Setup Guide for NFA Bears

## 🚀 Quick Setup

Your MCP configuration is already set up at `~/.cursor/mcp.json` with the psychedelic visual design stack:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    },
    "excalidraw": {
      "command": "npx",
      "args": ["-y", "mcp-excalidraw"]
    },
    "svgmaker": {
      "command": "npx",
      "args": ["-y", "@genwave/svgmaker-mcp"],
      "env": { "SVGMAKER_API_KEY": "YOUR_KEY" }
    },
    "mediaProcessor": {
      "command": "npx",
      "args": ["-y", "mcp-media-processor@latest"]
    },
    "satori": {
      "type": "http",
      "url": "https://satori.jellypod.ai/mcp"
    }
  }
}
```

## 🎭 Psychedelic Asset Generation

### 1. **Playwright MCP** - Capture Psychedelic Screenshots
Perfect for documenting your oil projection light show effects:

**Example Prompts:**
```
"Take a full-page screenshot of localhost:3000/dashboard with viewport 1920x1080 to capture the lava lamp aesthetic"
"Capture the QR scanner page at localhost:3000/scan with mobile viewport 390x844 to show the kaleidoscope frame"
"Screenshot the Genesis mint page at localhost:3000/mint-genesis to document the psychedelic oil blob effects"
```

### 2. **Excalidraw MCP** - Sketch Oil Blob Patterns
Great for rapid prototyping of new psychedelic elements:

**Example Prompts:**
```
"Create a new Excalidraw canvas with flowing oil blob shapes in psychedelic colors - hot pink, electric blue, acid green"
"Sketch a kaleidoscope frame design with 8 segments and rainbow gradients for the QR scanner"
"Draw organic, morphing shapes inspired by 1960s liquid light shows with tie-dye color schemes"
```

### 3. **SVGMaker MCP** - Generate Psychedelic SVGs
Perfect for creating custom oil blob patterns and kaleidoscope elements:

**Example Prompts:**
```
"Generate an SVG oil blob with organic, flowing edges using psychedelic gradient colors #ff0080, #8000ff, #0080ff"
"Create a kaleidoscope frame SVG with 6 segments and rainbow conic gradient"
"Make a lava lamp blob SVG with morphing, organic shapes and iridescent color effects"
```

### 4. **Media Processor MCP** - Enhance Psychedelic Assets
For post-processing and optimizing your psychedelic visuals:

**Example Prompts:**
```
"Resize the oil blob SVG to 512x512 PNG and add a subtle drop shadow effect"
"Convert the kaleidoscope frame to PNG with transparency and apply a blur filter"
"Create a psychedelic background by compositing multiple oil blob images with blend modes"
```

### 5. **Satori MCP** - Generate Psychedelic Social Cards
Perfect for creating shareable psychedelic images:

**Example Prompts:**
```
"Generate an OG image 1200x630 with title 'NFA Bears — Psychedelic Oil Projection Light Show', psychedelic gradient background, Inter Bold font, and floating oil blob elements"
"Create a social card for the Genesis Bears mint with kaleidoscope frame and liquid chrome text effects"
"Make a psychedelic banner 1920x1080 with the NFA Bears logo and flowing oil projection background"
```

## 🎨 Custom Psychedelic Assets Generated

Your asset generator has created:

- **Oil Blob Patterns**: `oil-blob-oilSlick.svg`, `oil-blob-lavaLamp.svg`, `oil-blob-tieDye.svg`
- **Kaleidoscope Frame**: `kaleidoscope-frame.svg`
- **Psychedelic Background**: `psychedelic-background.svg`
- **CSS Classes**: `psychedelic-assets.css`

## 🔧 Integration with Your App

Add the generated CSS to your app:

```css
/* In your globals.css */
@import "/psychedelic-assets/psychedelic-assets.css";
```

Use the classes in your components:

```jsx
<div className="psychedelic-oil-blob-oilslick">
  {/* Your content */}
</div>

<div className="psychedelic-kaleidoscope-frame">
  {/* QR Scanner */}
</div>

<div className="psychedelic-background">
  {/* Page background */}
</div>
```

## 🎵 Psychedelic Design Principles

### Color Palettes
- **Oil Slick**: `#ff0080`, `#8000ff`, `#0080ff`, `#00ff80`, `#ffff00`, `#ff8000`
- **Lava Lamp**: `#ff3366`, `#ff6600`, `#ffcc00`, `#66ff00`, `#0066ff`, `#cc00ff`
- **Tie Dye**: `#ff1493`, `#8a2be2`, `#00bfff`, `#00ff7f`, `#ffd700`, `#ff4500`

### Animation Principles
- **Viscous Movement**: Slow, thick, syrupy transitions
- **Organic Morphing**: Blob shapes that continuously transform
- **Color Shifting**: Hue rotation and saturation changes
- **Liquid Flow**: Elements that appear to flow like oil on water

### Cultural References
- 1960s Grateful Dead concert liquid light shows
- Psychedelic art movement aesthetics
- Head shop poster vibes
- "Turn on, tune in" Web3 community

## 🚀 Next Steps

1. **Restart Cursor** to load the MCP servers
2. **Test the MCP tools** with the example prompts above
3. **Capture screenshots** of your psychedelic UI
4. **Generate custom assets** for specific components
5. **Create social media assets** for the NFA Bears community

## 🐻 Pro Tips

- Use **Playwright** to document your psychedelic effects
- Use **Excalidraw** for rapid prototyping of new patterns
- Use **SVGMaker** for production-ready psychedelic graphics
- Use **Media Processor** for optimizing and enhancing assets
- Use **Satori** for creating shareable psychedelic content

Ready to make the NFA Bears the most psychedelic Web3 community ever! ✨🎭🐻
