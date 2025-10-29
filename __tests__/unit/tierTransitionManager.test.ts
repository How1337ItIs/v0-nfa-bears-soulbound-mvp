import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TierTransitionManager } from '@/lib/visual/performance/tierTransitionManager'

describe('TierTransitionManager', () => {
  let now = 0
  beforeEach(() => {
    now = 0
    vi.spyOn(Date, 'now').mockImplementation(() => now)
  })

  const advance = (ms: number) => { now += ms }

  it('steps down after 2s below 25 fps', () => {
    const mgr = new TierTransitionManager({ stepDownDuration: 2000, stepUpDuration: 3000, cooldownPeriod: 5000 })
    let tier: any = mgr.checkAndTransition(24, 'high', 'high')
    expect(tier).toBeNull()
    advance(1500)
    tier = mgr.checkAndTransition(24, 'high', 'high')
    expect(tier).toBeNull()
    advance(600)
    tier = mgr.checkAndTransition(24, 'high', 'high')
    expect(tier).toBe('medium')
  })

  it('steps up after 3s above 50 fps without exceeding max', () => {
    const mgr = new TierTransitionManager({ stepDownDuration: 2000, stepUpDuration: 3000, cooldownPeriod: 5000 })
    let tier: any = mgr.checkAndTransition(55, 'medium', 'high')
    expect(tier).toBeNull()
    advance(2500)
    tier = mgr.checkAndTransition(55, 'medium', 'high')
    expect(tier).toBeNull()
    advance(600)
    tier = mgr.checkAndTransition(55, 'medium', 'high')
    expect(tier).toBe('high')
  })

  it('observes cooldown for repeated step-downs', () => {
    const mgr = new TierTransitionManager({ stepDownDuration: 2000, stepUpDuration: 3000, cooldownPeriod: 5000 })
    // First step down
    advance(2100)
    let tier: any = mgr.checkAndTransition(20, 'high', 'high')
    expect(tier).toBe('medium')
    // Immediately try again within cooldown
    advance(2100)
    tier = mgr.checkAndTransition(20, 'medium', 'high')
    expect(tier).toBeNull()
    // After cooldown
    advance(3000)
    tier = mgr.checkAndTransition(20, 'medium', 'high')
    expect(tier).toBe('low')
  })
})

