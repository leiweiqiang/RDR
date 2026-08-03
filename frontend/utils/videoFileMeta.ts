export type ProbedVideoMeta = {
  duration: number
  width: number
  height: number
  resolution: string
  /** Estimated Mbps from file size / duration when available. */
  bitrate: number | null
  /** Best-effort FPS; browsers rarely expose container FPS, so this may be a default. */
  fps: number | null
  videoType: string | null
  objectUrl: string
}

function extensionFromName(name: string): string | null {
  const match = name.match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : null
}

function basenameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    const last = path.split('/').filter(Boolean).pop()
    return last ? decodeURIComponent(last) : url
  } catch {
    const last = url.split('/').filter(Boolean).pop()
    return last ?? url
  }
}

export function defaultTitleFromFileName(fileName: string): string {
  return fileName.replace(/\.[a-z0-9]+$/i, '') || fileName
}

export function defaultTitleFromUrl(url: string): string {
  return defaultTitleFromFileName(basenameFromUrl(url))
}

export function fileNameFromUrl(url: string): string {
  return basenameFromUrl(url)
}

/**
 * Probe a local video File via a temporary <video> element.
 * Resolves with duration/resolution when the browser can decode the file.
 */
export function probeVideoFile(file: File): Promise<ProbedVideoMeta> {
  const objectUrl = URL.createObjectURL(file)
  return probeVideoUrl(objectUrl, {
    fileSizeBytes: file.size,
    videoType: extensionFromName(file.name),
    revokeOnFail: true,
  })
}

/** True when the URL is likely a file the browser can open in <video> (not YouTube/Vimeo pages). */
export function isDirectMediaUrl(url: string): boolean {
  if (!url || url.startsWith('blob:')) return true
  try {
    const path = new URL(url).pathname
    return /\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|$)/i.test(path)
  } catch {
    return /\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|$)/i.test(url)
  }
}

export function probeVideoUrl(
  objectUrl: string,
  options: {
    fileSizeBytes?: number
    videoType?: string | null
    revokeOnFail?: boolean
  } = {},
): Promise<ProbedVideoMeta> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    // `auto` + in-DOM element is more reliable than detached `metadata` preload
    // for getting videoWidth/Height across browsers (esp. Safari).
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    // Remote URLs may need CORS for canvas cover capture later; harmless for blob:.
    video.crossOrigin = 'anonymous'
    Object.assign(video.style, {
      position: 'fixed',
      width: '2px',
      height: '2px',
      opacity: '0',
      pointerEvents: 'none',
      left: '0',
      top: '0',
      zIndex: '-1',
    })
    document.body.appendChild(video)

    let settled = false
    let timeoutId = 0

    const detach = () => {
      video.onloadedmetadata = null
      video.onloadeddata = null
      video.onerror = null
      try {
        video.pause()
        video.removeAttribute('src')
        video.load()
      } catch {
        // ignore
      }
      video.remove()
    }

    const fail = (message: string) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      detach()
      if (options.revokeOnFail) URL.revokeObjectURL(objectUrl)
      reject(new Error(message))
    }

    const succeed = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      const duration =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
      const width = video.videoWidth || 0
      const height = video.videoHeight || 0
      let bitrate: number | null = null
      if (options.fileSizeBytes && duration > 0) {
        // bytes * 8 / seconds / 1e6 → Mbps
        bitrate = Math.round(((options.fileSizeBytes * 8) / duration / 1_000_000) * 100) / 100
      }
      // Keep object URL for preview; do not revoke on success.
      detach()
      resolve({
        duration,
        width,
        height,
        resolution: width > 0 && height > 0 ? `${width}x${height}` : '',
        bitrate,
        // Browser media elements do not expose container FPS; default matches product defaults.
        fps: duration > 0 || (width > 0 && height > 0) ? 30 : null,
        videoType: options.videoType ?? null,
        objectUrl,
      })
    }

    const tryFinishAfterDimensions = async () => {
      if (settled) return
      if (video.videoWidth <= 0 || video.videoHeight <= 0) {
        // Some browsers report 0x0 until a frame is decoded — nudge with a tiny seek.
        try {
          if (Number.isFinite(video.duration) && video.duration > 0) {
            await seekVideo(video, Math.min(0.25, Math.max(0.01, video.duration * 0.05)))
          }
        } catch {
          // ignore seek failures; fall through
        }
      }
      succeed()
    }

    video.onerror = () => fail('Failed to load video metadata')
    video.onloadedmetadata = () => {
      void tryFinishAfterDimensions()
    }
    video.onloadeddata = () => {
      if (settled) return
      if (video.videoWidth > 0 && video.videoHeight > 0) succeed()
    }

    timeoutId = window.setTimeout(() => {
      if (settled) return
      if (video.readyState >= 1) {
        void tryFinishAfterDimensions()
      } else {
        fail('Timed out while reading video metadata')
      }
    }, 10_000)

    video.src = objectUrl
  })
}

/**
 * Capture a JPEG frame from a video element or object URL.
 * Tries t≈0 first, then ~0.33s (≈frame 10 at 30fps).
 */
export async function captureVideoCover(
  source: string | HTMLVideoElement,
  options: { timeSeconds?: number; quality?: number } = {},
): Promise<Blob> {
  const quality = options.quality ?? 0.88
  const ownVideo = typeof source === 'string'
  const video = ownVideo ? document.createElement('video') : source

  if (ownVideo) {
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.src = source
    await waitForEvent(video, 'loadeddata')
  }

  const tryTimes = [
    options.timeSeconds ?? 0,
    0.33,
    Math.min(1, Math.max(0, (video.duration || 1) * 0.05)),
  ]

  let lastError: Error | null = null
  for (const t of tryTimes) {
    try {
      await seekVideo(video, t)
      const blob = drawFrameToJpeg(video, quality)
      if (blob.size > 0) return blob
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError ?? new Error('Failed to capture video cover')
}

function drawFrameToJpeg(video: HTMLVideoElement, quality: number): Blob {
  const width = video.videoWidth
  const height = video.videoHeight
  if (!width || !height) {
    throw new Error('Video has no dimensions')
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.drawImage(video, 0, 0, width, height)

  // toBlob is async; use sync data URL conversion for reliability
  const dataUrl = canvas.toDataURL('image/jpeg', quality)
  const comma = dataUrl.indexOf(',')
  const binary = atob(dataUrl.slice(comma + 1))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: 'image/jpeg' })
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      resolve()
      return
    }
    const target = Math.min(Math.max(0, time), Math.max(0, video.duration - 0.05))
    const onSeeked = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error('Seek failed'))
    }
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
    }
    video.addEventListener('seeked', onSeeked, { once: true })
    video.addEventListener('error', onError, { once: true })
    if (Math.abs(video.currentTime - target) < 0.01) {
      cleanup()
      resolve()
      return
    }
    video.currentTime = target
  })
}

function waitForEvent(el: HTMLMediaElement, event: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onOk = () => {
      cleanup()
      resolve()
    }
    const onErr = () => {
      cleanup()
      reject(new Error(`Video event "${event}" failed`))
    }
    const cleanup = () => {
      el.removeEventListener(event, onOk)
      el.removeEventListener('error', onErr)
    }
    el.addEventListener(event, onOk, { once: true })
    el.addEventListener('error', onErr, { once: true })
  })
}

export const RESOLUTION_OPTIONS = [
  '3840x2160',
  '2560x1440',
  '1920x1080',
  '1280x720',
  '854x480',
  '640x360',
] as const

export const RESOLUTION_LABELS: Record<string, string> = {
  '3840x2160': '4K (3840x2160)',
  '2560x1440': '2K (2560x1440)',
  '1920x1080': '1080P (1920x1080)',
  '1280x720': '720P (1280x720)',
  '854x480': '480P (854x480)',
  '640x360': '360P (640x360)',
}

export const BITRATE_OPTIONS = [
  '1',
  '2',
  '3.5',
  '5',
  '8',
  '10',
  '15',
  '20',
  '35',
  '60',
] as const

export const FPS_OPTIONS = ['24', '25', '30', '48', '50', '60'] as const

export const URL_PROVIDER_OPTIONS = ['YouTube', 'Vimeo', 'Other'] as const

/** Map a probed WxH to the closest known option, or return the raw value. */
export function nearestResolutionOption(resolution: string): string {
  if (!resolution) return ''
  if ((RESOLUTION_OPTIONS as readonly string[]).includes(resolution)) return resolution
  const match = resolution.match(/^(\d+)x(\d+)$/)
  if (!match) return resolution
  const w = Number(match[1])
  let best = RESOLUTION_OPTIONS[0]
  let bestDelta = Infinity
  for (const opt of RESOLUTION_OPTIONS) {
    const ow = Number(opt.split('x')[0])
    const delta = Math.abs(ow - w)
    if (delta < bestDelta) {
      best = opt
      bestDelta = delta
    }
  }
  return best
}

export function nearestBitrateOption(bitrate: number | null): string {
  if (bitrate == null || !Number.isFinite(bitrate) || bitrate <= 0) return ''
  let best = BITRATE_OPTIONS[0]
  let bestDelta = Infinity
  for (const opt of BITRATE_OPTIONS) {
    const delta = Math.abs(Number(opt) - bitrate)
    if (delta < bestDelta) {
      best = opt
      bestDelta = delta
    }
  }
  return best
}

export function nearestFpsOption(fps: number | null): string {
  if (fps == null || !Number.isFinite(fps) || fps <= 0) return ''
  let best = FPS_OPTIONS[0]
  let bestDelta = Infinity
  for (const opt of FPS_OPTIONS) {
    const delta = Math.abs(Number(opt) - fps)
    if (delta < bestDelta) {
      best = opt
      bestDelta = delta
    }
  }
  return best
}
