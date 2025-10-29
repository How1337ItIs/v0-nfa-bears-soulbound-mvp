/**
 * Battery Saver Policy
 *
 * Determines whether to enforce a lower visual tier based on battery state
 * and environment. Uses navigator.getBattery() when available.
 */

export type ForcedTier = 'low' | 'medium' | null;

export interface BatterySaverDecision {
  enabled: boolean;
  forcedTier: ForcedTier;
  reason: string;
}

export async function getBatterySaverPolicy(options?: Partial<{ mobileHint: boolean; userOverride?: boolean | null }>): Promise<BatterySaverDecision> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = options?.mobileHint ?? /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

  // If user override explicitly disables/enables, respect it (no forced tier, but enabled flag may still show)
  if (options && options.userOverride != null) {
    return {
      enabled: !!options.userOverride,
      forcedTier: null,
      reason: 'user-override',
    };
  }

  // Power Saver Mode (heuristic): prefers-reduced-motion sometimes correlates with saver, but we avoid conflating.
  // We keep this path minimal unless future APIs expose power-save.

  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery: any = await (navigator as any).getBattery();
      const level = typeof battery.level === 'number' ? battery.level : 1;
      const charging = !!battery.charging;

      // Rule 1: <20% and not charging → Force LOW
      if (!charging && level < 0.2) {
        return { enabled: true, forcedTier: 'low', reason: 'battery<20%_not_charging' };
      }

      // Rule 2: <50%, not charging, and mobile → Force MEDIUM
      if (!charging && level < 0.5 && isMobile) {
        return { enabled: true, forcedTier: 'medium', reason: 'battery<50%_mobile' };
      }

      // Otherwise no enforcement
      return { enabled: false, forcedTier: null, reason: 'sufficient_battery_or_charging' };
    } catch (e) {
      // Battery API present but failed: fall through to no enforcement
      return { enabled: false, forcedTier: null, reason: 'battery_api_error' };
    }
  }

  // No Battery API: be conservative and do not force, caller may still implement a manual saver toggle
  return { enabled: false, forcedTier: null, reason: 'battery_api_unavailable' };
}

