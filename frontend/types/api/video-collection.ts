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
  stream_url: string | null
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
    transcode?: {
      fps?: number
      bitrate?: number
      resolution?: string
    }
    metadata_storage?: string
    metadata_extractor?: {
      processor?: string
    } | null
    fps?: number
    bitrate?: number
    resolution?: string
    metadata_type?: string
    metadata_location?: string
  } | null
  started_at?: string | null
  finished_at?: string | null
  created_at: string
  updated_at: string
}

export type DecodedStreamParent = Pick<TranscodedStreamFile, 'id' | 'name' | 'cover'>

export type DecodedStreamFile = {
  id: number
  name: string
  resolution: string
  fps: number | null
  bitrate: number | null
  duration: number | null
  transcoded_stream_file_id: number
  parent?: DecodedStreamParent | null
  recovered_stream_url: string | null
  improved_stream_url: string | null
  task_id: string
  recovered_prompt_id: string | null
  improved_prompt_id: string | null
  status: string
  progress: number | null
  error_message: string | null
  params?: Record<string, unknown> | null
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export type VideoCollectionDetail = VideoCollectionListItem & {
  category_id: number
  raw_video: VideoCollectionRawVideo | null
  transcoded_stream_files: TranscodedStreamFile[]
  decoded_stream_files: DecodedStreamFile[]
}
