import { apiFetch } from './client'
import type { VideoCollectionDetail } from '~/types/api/video-collection'

export function getVideoCollection(collectionId: number): Promise<VideoCollectionDetail> {
  return apiFetch<VideoCollectionDetail>(`/video-collections/${collectionId}`)
}
