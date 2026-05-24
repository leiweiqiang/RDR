import { Color } from 'three'

export interface GradientStop {
  stop: number
  hex: string
}

/** Matches landing page landing__tri--left */
export const LEFT_TRIANGLE_GRADIENT: GradientStop[] = [
  { stop: 0, hex: '#c40000' },
  { stop: 0.35, hex: '#ff2a00' },
  { stop: 0.78, hex: '#ffae00' },
  { stop: 1, hex: '#ffff00' },
]

/** Matches landing page landing__tri--right */
export const RIGHT_TRIANGLE_GRADIENT: GradientStop[] = [
  { stop: 0, hex: '#fff200' },
  { stop: 0.18, hex: '#ff8800' },
  { stop: 0.38, hex: '#ff2200' },
  { stop: 0.62, hex: '#a4006e' },
  { stop: 0.82, hex: '#4b0082' },
  { stop: 1, hex: '#1a0028' },
]

const _from = new Color()
const _to = new Color()
const _out = new Color()

export function sampleGradientStops(stops: GradientStop[], t: number, target = _out): Color {
  const clamped = Math.max(0, Math.min(1, t))

  if (clamped <= stops[0].stop) return target.set(stops[0].hex)
  if (clamped >= stops[stops.length - 1].stop) {
    return target.set(stops[stops.length - 1].hex)
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (clamped >= a.stop && clamped <= b.stop) {
      const local = (clamped - a.stop) / (b.stop - a.stop)
      _from.set(a.hex)
      _to.set(b.hex)
      return target.copy(_from).lerp(_to, local)
    }
  }

  return target.set(stops[stops.length - 1].hex)
}

/** Map scene x to hourglass triangle gradient (center = yellow, edges = red / purple). */
export function sampleHourglassGradient(
  x: number,
  sceneHalfWidth = 2.5,
  target = _out,
): Color {
  if (x <= 0) {
    const t = 1 + x / sceneHalfWidth
    return sampleGradientStops(LEFT_TRIANGLE_GRADIENT, t, target)
  }

  const t = x / sceneHalfWidth
  const color = sampleGradientStops(RIGHT_TRIANGLE_GRADIENT, t, target)

  // Additive blending: lift very dark purple edge stops slightly for visibility.
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  if (hsl.l < 0.22) {
    _from.set('#4b0082')
    color.lerp(_from, 0.35)
  }

  return color
}

export function writeColorToBuffer(
  colors: Float32Array,
  index: number,
  color: Color,
  jitter = 0.08,
): void {
  const i = index * 3
  colors[i] = Math.min(1, color.r + (Math.random() - 0.5) * jitter)
  colors[i + 1] = Math.min(1, color.g + (Math.random() - 0.5) * jitter)
  colors[i + 2] = Math.min(1, color.b + (Math.random() - 0.5) * jitter)
}
