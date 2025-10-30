export interface MobilePerfHints {
  saveData: boolean;
  deviceMemory: number | null;
  mobileUA: boolean;
}

export function detectMobilePerfHints(): MobilePerfHints {
  const navAny = (typeof navigator !== 'undefined' ? (navigator as any) : {});
  const connection = navAny.connection || navAny.mozConnection || navAny.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const deviceMemory = typeof (navigator as any)?.deviceMemory === 'number' ? (navigator as any).deviceMemory : null;
  const mobileUA = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return { saveData, deviceMemory, mobileUA };
}

export function getMobileCanvasCap(width: number, height: number, dpr: number, tier: 'low'|'medium'|'high'): { width: number; height: number; dpr: number } {
  const maxPixelsByTier: Record<string, number> = {
    low: 640 * 360,      // 360p cap
    medium: 960 * 540,   // qHD cap
    high: 1280 * 720,    // 720p cap
  };

  const maxPixels = maxPixelsByTier[tier] || maxPixelsByTier.high;
  const targetPixels = Math.min(maxPixels, Math.floor((width * height * dpr * dpr)));

  // Compute scale to meet targetPixels
  const basePixels = width * height;
  const maxDpr = Math.sqrt(targetPixels / basePixels);

  const cappedDpr = Math.min(dpr, Math.max(1, Math.floor(maxDpr * 10) / 10));
  return { width, height, dpr: cappedDpr };
}
