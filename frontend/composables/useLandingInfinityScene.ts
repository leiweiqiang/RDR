import {
  onBeforeUnmount,
  onMounted,
  type Ref,
  shallowRef,
  watch,
} from 'vue'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { createInfinityCurvePoints, sampleInfinityCurve } from '~/utils/infinityCurve'
import {
  sampleHourglassGradient,
  writeColorToBuffer,
} from '~/utils/hourglassGradient'

export interface LandingSceneOptions {
  particleCount?: number
  interactive?: boolean
}

interface ParticleState {
  baseT: number
  speed: number
  isPath: boolean
  driftPhase: number
  driftSpeed: number
  size: number
}

const SCENE_HALF_WIDTH = 2.5
const _particleColor = new Color()

function getParticleCount(): number {
  if (typeof window === 'undefined') return 3000
  const mobile = window.matchMedia('(max-width: 768px)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return mobile ? 400 : 800
  return mobile ? 1000 : 4500
}

export function useLandingInfinityScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: LandingSceneOptions = {},
) {
  const ready = shallowRef(false)
  let renderer: WebGLRenderer | null = null
  let scene: Scene | null = null
  let camera: PerspectiveCamera | null = null
  let points: Points | null = null
  let geometry: BufferGeometry | null = null
  let material: PointsMaterial | null = null
  let rafId = 0
  let running = false
  let phase = 0
  let resizeObserver: ResizeObserver | null = null
  let visibilityHandler: (() => void) | null = null
  let mouseMoveHandler: ((event: MouseEvent) => void) | null = null
  let mouseLeaveHandler: (() => void) | null = null

  const mouse = { x: 0, y: 0, active: false }
  const targetCamera = { x: 0, y: 0 }
  const currentCamera = { x: 0, y: 0 }

  let particles: ParticleState[] = []
  let positions: Float32Array | null = null
  let colors: Float32Array | null = null
  let sizes: Float32Array | null = null

  const interactive = options.interactive ?? true
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function initScene() {
    const canvas = canvasRef.value
    if (!canvas) return

    const count = options.particleCount ?? getParticleCount()
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight

    scene = new Scene()
    camera = new PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.z = 5.5

    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height, false)

    positions = new Float32Array(count * 3)
    colors = new Float32Array(count * 3)
    sizes = new Float32Array(count)

    particles = []
    const pathRatio = 0.62
    const pathCount = Math.floor(count * pathRatio)
    const curvePoints = createInfinityCurvePoints(pathCount, 2.4)

    for (let i = 0; i < count; i++) {
      const isPath = i < pathCount
      const state: ParticleState = {
        baseT: isPath ? (i / pathCount) * Math.PI * 2 : Math.random() * Math.PI * 2,
        speed: isPath ? 0.12 + Math.random() * 0.18 : 0,
        isPath,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.15 + Math.random() * 0.35,
        size: isPath ? 1.8 + Math.random() * 2.8 : 0.6 + Math.random() * 1.4,
      }
      particles.push(state)

      let x = 0
      let y = 0
      let z = 0

      if (isPath) {
        const p = curvePoints[i]
        x = p.x + (Math.random() - 0.5) * 0.08
        y = p.y + (Math.random() - 0.5) * 0.08
        z = (Math.random() - 0.5) * 0.15
      } else {
        x = (Math.random() - 0.5) * 14
        y = (Math.random() - 0.5) * 9
        z = (Math.random() - 0.5) * 3
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      sizes[i] = state.size

      sampleHourglassGradient(x, SCENE_HALF_WIDTH, _particleColor)
      writeColorToBuffer(colors, i, _particleColor, 0.06)
    }

    geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('color', new BufferAttribute(colors, 3))
    geometry.setAttribute('size', new BufferAttribute(sizes, 1))

    material = new PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    points = new Points(geometry, material)
    scene.add(points)

    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(canvas)

    if (interactive && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      mouseMoveHandler = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        mouse.active = true
        targetCamera.x = mouse.x * 0.18
        targetCamera.y = mouse.y * 0.12
      }
      mouseLeaveHandler = () => {
        mouse.active = false
        targetCamera.x = 0
        targetCamera.y = 0
      }
      canvas.addEventListener('mousemove', mouseMoveHandler)
      canvas.addEventListener('mouseleave', mouseLeaveHandler)
    }

    visibilityHandler = () => {
      if (document.hidden) {
        stopLoop()
      } else {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', visibilityHandler)

    ready.value = true
    startLoop()
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas || !renderer || !camera) return
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  function updateParticles(elapsed: number) {
    if (!positions || !particles || !colors) return

    const dt = Math.min(elapsed, 0.05)
    phase += dt * (reducedMotion ? 0.08 : 0.35)

    const mouseWorld = new Vector3(mouse.x * 3.2, mouse.y * 2.2, 0)
    const repelRadius = 0.85
    const repelStrength = reducedMotion ? 0 : 0.35

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      let x = 0
      let y = 0
      let z = 0

      if (p.isPath) {
        const t = p.baseT + phase * p.speed
        const sample = sampleInfinityCurve(t, 2.4)
        x = sample.x
        y = sample.y
        z = Math.sin(t * 2 + p.driftPhase) * 0.12
      } else {
        x =
          Math.sin(p.driftPhase + elapsed * p.driftSpeed) * 6 +
          Math.cos(p.driftPhase * 1.7) * 2
        y =
          Math.cos(p.driftPhase * 0.8 + elapsed * p.driftSpeed * 0.7) * 3.5 +
          Math.sin(p.driftPhase) * 1.2
        z = Math.sin(p.driftPhase + elapsed) * 1.5
      }

      if (mouse.active && repelStrength > 0) {
        const dx = x - mouseWorld.x
        const dy = y - mouseWorld.y
        const distSq = dx * dx + dy * dy
        if (distSq < repelRadius * repelRadius && distSq > 0.0001) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / repelRadius) * repelStrength
          x += (dx / dist) * force
          y += (dy / dist) * force
        }
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      sampleHourglassGradient(x, SCENE_HALF_WIDTH, _particleColor)
      writeColorToBuffer(colors, i, _particleColor, 0.04)
    }

    if (geometry?.attributes.position) {
      geometry.attributes.position.needsUpdate = true
    }
    if (geometry?.attributes.color) {
      geometry.attributes.color.needsUpdate = true
    }
  }

  function animate() {
    if (!renderer || !scene || !camera) return

    const elapsed = performance.now() * 0.001
    updateParticles(elapsed)

    currentCamera.x += (targetCamera.x - currentCamera.x) * 0.06
    currentCamera.y += (targetCamera.y - currentCamera.y) * 0.06
    camera.position.x = currentCamera.x
    camera.position.y = currentCamera.y
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(animate)
  }

  function startLoop() {
    if (running) return
    running = true
    rafId = requestAnimationFrame(animate)
  }

  function stopLoop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  function dispose() {
    stopLoop()

    const canvas = canvasRef.value
    if (canvas && mouseMoveHandler) canvas.removeEventListener('mousemove', mouseMoveHandler)
    if (canvas && mouseLeaveHandler) canvas.removeEventListener('mouseleave', mouseLeaveHandler)
    if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
    resizeObserver?.disconnect()

    geometry?.dispose()
    material?.dispose()
    renderer?.dispose()

    renderer = null
    scene = null
    camera = null
    points = null
    geometry = null
    material = null
    particles = []
    positions = null
    colors = null
    sizes = null
    ready.value = false
  }

  onMounted(() => {
    if (canvasRef.value) initScene()
  })

  watch(canvasRef, (canvas) => {
    if (canvas && !ready.value) initScene()
  })

  onBeforeUnmount(dispose)

  return { ready }
}
