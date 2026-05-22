import { apiFetch } from './client'
import type { RawVideoListItem } from '~/types/api/video'

export function getVideo(videoId: number): Promise<RawVideoListItem> {
  return apiFetch<RawVideoListItem>(`/videos/${videoId}`)
}
