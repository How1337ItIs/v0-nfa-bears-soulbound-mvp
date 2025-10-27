# Liquid Light Starter (Next.js 15 / React 18 / TS)

Production-ready starter pack for an authentic 60s-style liquid light background:

- **Engine of record:** `webgl-fluid-enhanced`
- **Single background canvas**, pointer-safe (`pointer-events:none`)
- **Authentic physics preset** (lava-lamp viscosity, thermal convection, slow rotation)
- **Centralized audio reactivity** (one analyzer → unified mapping)
- **Optional thin-film interference overlay** (R3F Canvas)
- **Auto-quality tiers** (FPS-driven step-down / step-up)

## Install
```bash
npm i webgl-fluid-enhanced three @react-three/fiber @react-three/drei
```

## File map
- `components/LiquidLightBackground.tsx` — mounts and manages the fluid canvas
- `components/ThinFilmOverlayExample.tsx` — optional iridescent overlay (R3F)
- `lib/fluid/config.ts` — presets + device capability/tiering
- `lib/fluid/thermal.ts` — convection + rotation helpers
- `lib/audio/useAudioReactive.ts` — single analyzer + mapping
- `lib/post/ThinFilmPass.tsx` — overlay pass

## Usage (Next.js App Router)
Add the background (and optionally the overlay) in your root layout:
```tsx
// app/layout.tsx
import LiquidLightBackground from '@/components/LiquidLightBackground';
import ThinFilmOverlayExample from '@/components/ThinFilmOverlayExample';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LiquidLightBackground />
        {/* Consider gating the overlay by a device tier in your store */}
        <ThinFilmOverlayExample />
        {children}
      </body>
    </html>
  );
}
```

## Notes
- Canvas is non-interactive; a global pointer listener feeds the sim while keeping UI clickable.
- Auto-tiering: starts from device tier, steps down if FPS < 25 for ~1s; steps up if > 50 (tweak in code).
- Audio is optional; if mic blocked, a mild simulated signal keeps visuals alive.
- Keep only **one** CSS fallback component; do not maintain multiple effect stacks.
- For production, test mobile tiers (SIM/DYE resolutions, pressure iterations). Aim for 30fps+ on mid phones.

## Where to extend
- Replace `ThinFilmOverlayExample` with your own post chain; use the same audio params.
- Add palette presets in `lib/fluid/config.ts` and expose a brand theme switcher.
- Add `visibilitychange` handlers for aggressive pause/resume if desired.

MIT-ish; adapt freely.
