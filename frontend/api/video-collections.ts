import { apiFetch } from './client'
import type {
  VideoCollectionCreateBody,
  VideoCollectionDetail,
  VideoCollectionUpdateBody,
} from '~/types/api/video-collection'

export function getVideoCollection(collectionId: number): Promise<VideoCollectionDetail> {
  return apiFetch<VideoCollectionDetail>(`/video-collections/${collectionId}`)
}

export function createVideoCollection(
  body: VideoCollectionCreateBody,
): Promise<VideoCollectionDetail> {
  return apiFetch<VideoCollectionDetail>('/video-collections', {
    method: 'POST',
    body,
  })
}

export function updateVideoCollection(
  collectionId: number,
  body: VideoCollectionUpdateBody,
): Promise<VideoCollectionDetail> {
  return apiFetch<VideoCollectionDetail>(`/video-collections/${collectionId}`, {
    method: 'PUT',
    body,
  })
}
