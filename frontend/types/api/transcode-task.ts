import type { PaginationMeta } from './common'

export type MetadataExtractorProcess = 'canny' | 'spatial_depth' | 'skeleton_keypoints'

export type MetadataExtractorRequest = {
  processor: MetadataExtractorProcess
}

export type MetadataStorage = 'metadata_in_manifest' | 'metadata_in_video'

export type MetadataExtractorConfig = MetadataExtractorRequest & {
  canny_gaussian_sigma?: number | null
  canny_lower_factor?: number | null
  canny_upper_factor?: number | null
}

export type TranscodeConfig = {
  resolution: string
  fps: number
  bitrate: number
}

export type TranscodeParams = {
  transcode: TranscodeConfig
  metadata_extractor: MetadataExtractorConfig
  metadata_storage?: MetadataStorage
}

export type TranscodeTaskCreateBody = {
  targets: TranscodeConfig[]
  metadata_extractor: MetadataExtractorRequest
  metadata_storage: MetadataStorage
}

export type TranscodeBatchCreateBody = {
  raw_video_id: number
  metadata_type?: MetadataExtractorProcess | null
  metadata_location?: MetadataStorage | null
  variants: TranscodeConfig[]
}

export type TranscodeTaskResponse = {
  task_id: string
  raw_video_id: number
  params: TranscodeParams
  status: string
  progress: number
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export type TranscodeTaskBatchResultItem = {
  index: number
  status: number
  data: TranscodeTaskResponse | null
  code: string | null
  message: string | null
}

export type TranscodeTaskBatchResponse = {
  results: TranscodeTaskBatchResultItem[]
}

export type TranscodeTaskByVideoItem = {
  task_id: string
  params: TranscodeParams
  status: string
  progress: number
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export type TranscodeTaskByVideoListResponse = {
  data: TranscodeTaskByVideoItem[]
  pagination: PaginationMeta
}

export type VideoTranscodedStreamItem = {
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
  transcode_task_id: number | null
  category_id: number
  created_at: string
  updated_at: string
}

export type VideoTranscodedStreamListResponse = {
  data: VideoTranscodedStreamItem[]
  pagination: PaginationMeta
}
