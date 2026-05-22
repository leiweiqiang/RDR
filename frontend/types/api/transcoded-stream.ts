import type { PaginationMeta } from './common'

export type RawVideoBrief = {
  id: number
  name: string
  cover: string
  resolution: string
  duration: number
}

export type TranscodedStreamListItem = {
  id: number
  name: string
  cover: string
  provider: string | null
  stream_url: string
  duration: number
  resolution: string
  fps: number | null
  bitrate: number | null
  segment_number: number | null
  transcode_task_id: number
  video: RawVideoBrief
  created_at: string
  updated_at: string
}

export type TranscodedStreamListResponse = {
  data: TranscodedStreamListItem[]
  pagination: PaginationMeta
}
