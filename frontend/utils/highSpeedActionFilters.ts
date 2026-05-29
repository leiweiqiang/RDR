import { formatResolutionLabel } from '~/composables/useContentPoolVideo'

export type HighSpeedActionFilterKey = 'time' | 'resolution' | 'type' | 'size'

export type HighSpeedActionFilters = Record<HighSpeedActionFilterKey, string>

export type HighSpeedActionFilterableItem = {
  title: string
  createdAt: string
  resolution: string
  fileType: string
  bitrate: number | null
  duration: number | null
}

function normalizeFileType(value: string): string {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return ''
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`
}

export function extractFileType(
  name: string,
  storagePath?: string | null,
  videoType?: string | null,
): string {
  const fromPath = storagePath?.match(/(\.[a-z0-9]+)$/i)?.[1]
  if (fromPath) return normalizeFileType(fromPath)

  const fromName = name.match(/(\.[a-z0-9]+)$/i)?.[1]
  if (fromName) return normalizeFileType(fromName)

  if (videoType) return normalizeFileType(videoType)

  return ''
}

export function resolutionFilterLabel(resolution: string): string {
  const match = resolution.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/)
  if (!match) return formatResolutionLabel(resolution).toUpperCase()

  const width = Number.parseInt(match[1], 10)
  if (width >= 3840) return '4K'
  if (width >= 1920) return '1080P'
  if (width >= 1280) return '720P'
  if (width >= 640) return '360P'
  return resolution.toUpperCase()
}

function parseResolutionPixels(resolution: string): number {
  const match = resolution.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/)
  if (!match) return 0
  return Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10)
}

function sizeScore(item: HighSpeedActionFilterableItem): number {
  const pixels = parseResolutionPixels(item.resolution)
  const bitrate = item.bitrate ?? 0
  const duration = item.duration ?? 0
  return pixels * Math.max(bitrate, 1) * Math.max(duration, 1)
}

function matchesResolutionFilter(resolution: string, filter: string): boolean {
  if (filter === 'All') return true
  return resolutionFilterLabel(resolution) === filter.toUpperCase()
}

function matchesTimeFilter(createdAt: string, filter: string): boolean {
  if (filter === 'All') return true

  const created = new Date(createdAt)
  if (Number.isNaN(created.getTime())) return true

  const ageMs = Date.now() - created.getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)

  switch (filter) {
    case 'Last Week':
      return ageDays <= 7
    case 'Last Month':
      return ageDays <= 30
    case 'Last Year':
      return ageDays <= 365
    default:
      return true
  }
}

function matchesTypeFilter(fileType: string, filter: string): boolean {
  if (filter === 'All') return true
  return fileType === normalizeFileType(filter)
}

function applySizeSort<T extends HighSpeedActionFilterableItem>(
  items: T[],
  sizeFilter: string,
): T[] {
  if (sizeFilter === 'All') return items

  return [...items].sort((left, right) => {
    const leftScore = sizeScore(left)
    const rightScore = sizeScore(right)
    return sizeFilter === 'Large to Small'
      ? rightScore - leftScore
      : leftScore - rightScore
  })
}

function matchesSearchQuery(item: HighSpeedActionFilterableItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  const haystack = [
    item.title,
    item.resolution,
    item.fileType,
    resolutionFilterLabel(item.resolution),
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalizedQuery)
}

export function filterHighSpeedActionItems<T extends HighSpeedActionFilterableItem>(
  items: T[],
  query: string,
  filters: HighSpeedActionFilters,
): T[] {
  let result = items.filter((item) => {
    if (!matchesSearchQuery(item, query)) return false
    if (!matchesTimeFilter(item.createdAt, filters.time)) return false
    if (!matchesResolutionFilter(item.resolution, filters.resolution)) return false
    if (!matchesTypeFilter(item.fileType, filters.type)) return false
    return true
  })

  result = applySizeSort(result, filters.size)
  return result
}
