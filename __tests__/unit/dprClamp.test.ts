import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClampedDPR, applyDPRToCanvas } from '@/lib/visual/utils/dprClamp'

describe('DPR Clamp', () => {
  beforeEach(() => {
    // reset mocks
    vi.restoreAllMocks()
  })

  it('clamps DPR to 1.5 on mobile', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true })
    Object.defineProperty(window.navigator, 'userAgent', { value: 'iPhone', configurable: true })
    expect(getClampedDPR()).toBe(1.5)
  })

  it('clamps DPR to 2.0 on desktop', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true })
    Object.defineProperty(window.navigator, 'userAgent', { value: 'Mozilla/5.0 (Windows NT 10.0)', configurable: true })
    expect(getClampedDPR()).toBe(2.0)
  })

  it('applies DPR to canvas backing size', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true })
    Object.defineProperty(window.navigator, 'userAgent', { value: 'Mozilla/5.0 (Windows NT 10.0)', configurable: true })

    const canvas = document.createElement('canvas') as HTMLCanvasElement
    // Mock client size
    Object.defineProperty(canvas, 'clientWidth', { value: 100, configurable: true })
    Object.defineProperty(canvas, 'clientHeight', { value: 50, configurable: true })

    applyDPRToCanvas(canvas)
    expect(canvas.width).toBe(200)
    expect(canvas.height).toBe(100)
  })
})

