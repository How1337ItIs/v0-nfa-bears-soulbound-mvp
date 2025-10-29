import { describe, it, expect } from 'vitest'
import { getBatterySaverPolicy } from '@/lib/visual/capability/batterySaverPolicy'

function mockBattery(level: number, charging: boolean) {
  ;(navigator as any).getBattery = async () => ({ level, charging, addEventListener: () => {} })
}

describe('Battery Saver Policy', () => {
  it('forces LOW when <20% and not charging', async () => {
    mockBattery(0.19, false)
    const d = await getBatterySaverPolicy({ mobileHint: true })
    expect(d.enabled).toBe(true)
    expect(d.forcedTier).toBe('low')
  })

  it('forces MEDIUM when <50%, not charging, and mobile', async () => {
    mockBattery(0.4, false)
    const d = await getBatterySaverPolicy({ mobileHint: true })
    expect(d.enabled).toBe(true)
    expect(d.forcedTier).toBe('medium')
  })

  it('no enforcement when charging', async () => {
    mockBattery(0.1, true)
    const d = await getBatterySaverPolicy({ mobileHint: true })
    expect(d.enabled).toBe(false)
    expect(d.forcedTier).toBeNull()
  })
})

