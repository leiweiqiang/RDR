import { apiFetch } from './client'
import type {
  TranscodeTaskBatchResponse,
  TranscodeTaskByVideoListResponse,
  TranscodeTaskCreateBody,
  VideoTranscodedStreamListResponse,
} from '~/types/api/transcode-task'
import type { RawVideoListItem } from '~/types/api/video'

export type ListByVideoParams = {
  page?: number
  per_page?: number
}

export function getVideo(videoId: number): Promise<RawVideoListItem> {
  return apiFetch<RawVideoListItem>(`/videos/${videoId}`)
}

export function listTranscodedStreamsByVideo(
  videoId: number,
  params: ListByVideoParams = {},
): Promise<VideoTranscodedStreamListResponse> {
  return apiFetch<VideoTranscodedStreamListResponse>(`/videos/${videoId}/transcoded-streams`, {
    query: params,
  })
}

export function listTranscodeTasksByVideo(
  videoId: number,
  params: ListByVideoParams & { status?: string } = {},
): Promise<TranscodeTaskByVideoListResponse> {
  return apiFetch<TranscodeTaskByVideoListResponse>(`/videos/${videoId}/transcode-tasks`, {
    query: params,
  })
}

export function createTranscodeTasks(
  videoId: number,
  body: TranscodeTaskCreateBody,
): Promise<TranscodeTaskBatchResponse> {
  return apiFetch<TranscodeTaskBatchResponse>(`/videos/${videoId}/transcode-tasks`, {
    method: 'POST',
    body,
  })
}
