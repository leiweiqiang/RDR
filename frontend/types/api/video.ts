import type { PaginationMeta } from './common'

export type RawVideoListItem = {
  id: number
  name: string
  cover: string
  canny_cover: string | null
  provider: string | null
  storage_path: string
  duration: number
  resolution: string
  fps: number | null
  bitrate: number | null
  video_type: string
  created_at: string
  updated_at: string
}

export type RawVideoListResponse = {
  data: RawVideoListItem[]
  pagination: PaginationMeta
}
