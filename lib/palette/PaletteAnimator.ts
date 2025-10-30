import { PaletteDirector, type Palette } from '@/lib/palette';

function rgbToHex01([r, g, b]: number[]): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n * 255))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export class PaletteAnimator {
  private targetPalette: string | null = null;
  private startPalette: string | null = null;
  private progress = 0;
  private duration = 2000; // ms
  private active = false;

  transitionTo(paletteId: string, duration?: number) {
    const current = PaletteDirector.getCurrentPalette().id;
    if (current === paletteId) return;
    this.startPalette = current;
    this.targetPalette = paletteId;
    this.progress = 0;
    if (duration) this.duration = duration;
    this.active = true;
  }

  isActive(): boolean {
    return this.active;
  }

  update(deltaMs: number): boolean {
    if (!this.active || !this.startPalette || !this.targetPalette) return false;
    this.progress += deltaMs / this.duration;
    const t = Math.min(1, this.progress);

    // Blend palettes and register as temporary custom palette
    const blended = PaletteDirector.blendPalettes(this.startPalette, this.targetPalette, t);
    const base = PaletteDirector.getCurrentPalette();
    const temp: Palette = {
      id: '__animating',
      name: base.name + ' → ' + this.targetPalette,
      description: 'Transition blend',
      colors: blended.map(rgbToHex01),
      wavelengths: base.wavelengths,
      culturalContext: base.culturalContext,
      viscosity: base.viscosity,
      energy: base.energy,
    };
    PaletteDirector.registerCustomPalette(temp);
    PaletteDirector.setCurrentPalette(temp.id);

    if (t >= 1) {
      // Finalize to target palette
      PaletteDirector.setCurrentPalette(this.targetPalette);
      this.active = false;
      this.startPalette = null;
      this.targetPalette = null;
      this.progress = 0;
      return false;
    }
    return true;
  }
}

