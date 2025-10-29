/**
 * DPR Clamp Utilities
 *
 * Clamps device pixel ratio to reduce GPU cost, especially on high-DPR devices.
 * - Mobile: max 1.5
 * - Desktop: max 2.0
 */

export function getClampedDPR(): number {
  if (typeof window === 'undefined') return 1;
  const dpr = window.devicePixelRatio || 1;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

  if (isMobile) {
    return Math.min(dpr, 1.5);
  }
  return Math.min(dpr, 2.0);
}

export function applyDPRToCanvas(canvas: HTMLCanvasElement): void {
  const dpr = getClampedDPR();
  const width = Math.floor((canvas.clientWidth || canvas.offsetWidth) * dpr);
  const height = Math.floor((canvas.clientHeight || canvas.offsetHeight) * dpr);

  if (width > 0 && height > 0) {
    canvas.width = width;
    canvas.height = height;
  }
}

