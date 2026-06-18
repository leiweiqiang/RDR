export type ResolutionId = '4k' | '1080p' | '720p' | '360p'

export type ResolutionPreset = {
  id: ResolutionId
  label: string
  width: number
  height: number
  bitrateMbps: number
  bitrateLabel: string
}

export const RESOLUTION_PRESETS: readonly ResolutionPreset[] = [
  {
    id: '360p',
    label: '360p (640 X 360)',
    width: 640,
    height: 360,
    bitrateMbps: 0.6,
    bitrateLabel: '600 kbps',
  },
  {
    id: '720p',
    label: '720p (1280 X 720)',
    width: 1280,
    height: 720,
    bitrateMbps: 3.5,
    bitrateLabel: '3.5 Mbps',
  },
  {
    id: '1080p',
    label: '1080p (1920 X 1080)',
    width: 1920,
    height: 1080,
    bitrateMbps: 5,
    bitrateLabel: '5 Mbps',
  },
  // {
  //   id: '4k',
  //   label: '4K (3840 X 2160)',
  //   width: 3840,
  //   height: 2160,
  //   bitrateMbps: 15,
  //   bitrateLabel: '15 Mbps',
  // },
]

export const FIXED_TARGET_FPS = 30
export const FIXED_FPS_LABEL = '30 fps'

export const RESOLUTION_OPTION_LABELS = RESOLUTION_PRESETS.map((p) => p.label)

const STORAGE_PREFIX = 'rdr:content-pool-targeting:'

function storageKey(poolId: string): string {
  return `${STORAGE_PREFIX}${poolId}`
}

export function isValidResolutionLabel(label: string): boolean {
  return RESOLUTION_PRESETS.some((p) => p.label === label)
}

export function findResolutionPreset(label: string): ResolutionPreset | undefined {
  return RESOLUTION_PRESETS.find((p) => p.label === label)
}

export function resolutionIdFromLabel(label: string): ResolutionId | null {
  return findResolutionPreset(label)?.id ?? null
}

export function bitrateLabelForResolution(label: string): string {
  return findResolutionPreset(label)?.bitrateLabel ?? '—'
}

export function apiResolutionForLabel(label: string): string | null {
  const preset = findResolutionPreset(label)
  if (!preset) return null
  return `${preset.width}x${preset.height}`
}

export function bitrateMbpsForLabel(label: string): number | null {
  const preset = findResolutionPreset(label)
  return preset?.bitrateMbps ?? null
}

/** Load saved resolution labels per row (empty string = blank row). */
export function loadTargetingResolutionRows(poolId: string): string[] | null {
  if (!import.meta.client) return null

  try {
    const raw = sessionStorage.getItem(storageKey(poolId))
    if (!raw) return null
    const data = JSON.parse(raw) as { resolutions?: unknown }
    if (!Array.isArray(data.resolutions)) return null
    return data.resolutions.map((r) =>
      typeof r === 'string' && (r === '' || isValidResolutionLabel(r)) ? r : '',
    )
  } catch {
    return null
  }
}

export function saveTargetingResolutionRows(poolId: string, resolutions: string[]) {
  if (!import.meta.client) return
  sessionStorage.setItem(storageKey(poolId), JSON.stringify({ resolutions }))
}

/** Complete selections only (non-empty, valid labels). */
export function loadCompleteTargetingResolutions(poolId: string): string[] {
  const rows = loadTargetingResolutionRows(poolId)
  if (!rows) return []
  return rows.filter((r) => r && isValidResolutionLabel(r))
}

/** Display form e.g. `720p(1280x720)`. */
export function formatResolutionCompact(label: string): string {
  const preset = findResolutionPreset(label)
  if (!preset) return label
  return `${preset.id}(${preset.width}x${preset.height})`
}

export function formatTargetingSelectionSummary(label: string): string {
  const preset = findResolutionPreset(label)
  if (!preset) return label
  return `${formatResolutionCompact(label)}, ${FIXED_FPS_LABEL}, ${preset.bitrateLabel}`
}

function normalizeApiResolution(resolution: string): string {
  return resolution.trim().toLowerCase().replace(/\s+/g, '')
}

export function streamMatchesTargetingLabel(
  streamResolution: string,
  label: string,
): boolean {
  const expected = apiResolutionForLabel(label)
  if (!expected) return false
  return normalizeApiResolution(streamResolution) === normalizeApiResolution(expected)
}

export function isResolutionAlreadyTranscoded(
  label: string,
  streamResolutions: readonly string[],
): boolean {
  if (!label) return false
  return streamResolutions.some((resolution) => streamMatchesTargetingLabel(resolution, label))
}

export const RESOLUTION_ALREADY_EXISTS_HINT = ' · Video already exists'
