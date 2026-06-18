import type { PaginationMeta } from './common'

export type VideoCollectionListItem = {
  id: number
  name: string
  cover: string
  provider: string | null
  duration: number
  is_third_party: boolean
  created_at: string
  updated_at: string
}

export type VideoCollectionListResponse = {
  data: VideoCollectionListItem[]
  pagination: PaginationMeta
}

export type VideoCollectionRawVideo = {
  id: number
  storage_path: string
  resolution: string
  fps: number | null
  bitrate: number | null
  video_type: string
  canny_cover: string | null
  stream_url?: string | null
}

export type TranscodedStreamFile = {
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
  task_id: string
  status: string
  progress: number | null
  error_message: string | null
  params?: {
    metadata_extractor?: {
      processor?: string
    } | null
  } | null
  created_at: string
  updated_at: string
}

export type VideoCollectionDetail = VideoCollectionListItem & {
  category_id: number
  raw_video: VideoCollectionRawVideo | null
  transcoded_stream_files: TranscodedStreamFile[]
}
