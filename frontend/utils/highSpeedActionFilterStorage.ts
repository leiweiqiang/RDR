import type { HighSpeedActionFilterKey, HighSpeedActionFilters } from '~/utils/highSpeedActionFilters'

export const HIGH_SPEED_ACTION_TIME_OPTIONS = [
  'All',
  'Last Week',
  'Last Month',
  'Last Year',
] as const

export const HIGH_SPEED_ACTION_RESOLUTION_OPTIONS = [
  'All',
  '4K',
  '1080P',
  '720P',
  '360P',
] as const

export const HIGH_SPEED_ACTION_TYPE_OPTIONS = ['All', '.mp4', '.mov'] as const

export const HIGH_SPEED_ACTION_SIZE_OPTIONS = [
  'All',
  'Large to Small',
  'Small to Large',
] as const

export const DEFAULT_HIGH_SPEED_ACTION_FILTERS: HighSpeedActionFilters = {
  time: 'All',
  resolution: 'All',
  type: 'All',
  size: 'All',
}

export type HighSpeedActionListQueryState = {
  searchQuery: string
  filters: HighSpeedActionFilters
}

export type HighSpeedActionPageQueryState = {
  pool: HighSpeedActionListQueryState
  stream: HighSpeedActionListQueryState
}

const STORAGE_PREFIX = 'rdr:high-speed-action-filters:'

const FILTER_OPTION_SETS: Record<HighSpeedActionFilterKey, readonly string[]> = {
  time: HIGH_SPEED_ACTION_TIME_OPTIONS,
  resolution: HIGH_SPEED_ACTION_RESOLUTION_OPTIONS,
  type: HIGH_SPEED_ACTION_TYPE_OPTIONS,
  size: HIGH_SPEED_ACTION_SIZE_OPTIONS,
}

function storageKey(categoryName: string): string {
  return `${STORAGE_PREFIX}${categoryName}`
}

function createDefaultListQueryState(): HighSpeedActionListQueryState {
  return {
    searchQuery: '',
    filters: { ...DEFAULT_HIGH_SPEED_ACTION_FILTERS },
  }
}

export function createDefaultHighSpeedActionPageQueryState(): HighSpeedActionPageQueryState {
  return {
    pool: createDefaultListQueryState(),
    stream: createDefaultListQueryState(),
  }
}

function sanitizeFilterValue(key: HighSpeedActionFilterKey, value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_HIGH_SPEED_ACTION_FILTERS[key]
  return FILTER_OPTION_SETS[key].includes(value)
    ? value
    : DEFAULT_HIGH_SPEED_ACTION_FILTERS[key]
}

function sanitizeFilters(value: unknown): HighSpeedActionFilters {
  const source = value && typeof value === 'object' ? (value as Partial<HighSpeedActionFilters>) : {}

  return {
    time: sanitizeFilterValue('time', source.time),
    resolution: sanitizeFilterValue('resolution', source.resolution),
    type: sanitizeFilterValue('type', source.type),
    size: sanitizeFilterValue('size', source.size),
  }
}

function sanitizeListQueryState(value: unknown): HighSpeedActionListQueryState {
  const source = value && typeof value === 'object' ? (value as Partial<HighSpeedActionListQueryState>) : {}

  return {
    searchQuery: typeof source.searchQuery === 'string' ? source.searchQuery : '',
    filters: sanitizeFilters(source.filters),
  }
}

export function loadHighSpeedActionPageQueryState(
  categoryName: string,
): HighSpeedActionPageQueryState | null {
  if (!import.meta.client) return null

  try {
    const raw = sessionStorage.getItem(storageKey(categoryName))
    if (!raw) return null

    const data = JSON.parse(raw) as Partial<HighSpeedActionPageQueryState>
    return {
      pool: sanitizeListQueryState(data.pool),
      stream: sanitizeListQueryState(data.stream),
    }
  } catch {
    return null
  }
}

export function saveHighSpeedActionPageQueryState(
  categoryName: string,
  state: HighSpeedActionPageQueryState,
) {
  if (!import.meta.client) return

  sessionStorage.setItem(storageKey(categoryName), JSON.stringify(state))
}
