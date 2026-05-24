export interface Vec3 {
  x: number
  y: number
  z: number
}

/** Bernoulli lemniscate (figure-eight) in the XY plane. t in [0, 2π). */
export function sampleInfinityCurve(t: number, scale = 1): Vec3 {
  const sinT = Math.sin(t)
  const cosT = Math.cos(t)
  const denom = 1 + sinT * sinT
  return {
    x: (scale * cosT) / denom,
    y: (scale * sinT * cosT) / denom,
    z: 0,
  }
}

export function createInfinityCurvePoints(count: number, scale = 1): Vec3[] {
  const points: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    points.push(sampleInfinityCurve(t, scale))
  }
  return points
}
