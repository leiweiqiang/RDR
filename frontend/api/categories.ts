import { apiFetch } from './client'
import type { CategoryListResponse } from '~/types/api/category'
import type { RawVideoListResponse } from '~/types/api/video'
import type { TranscodedStreamListResponse } from '~/types/api/transcoded-stream'
import type { VideoCollectionListResponse } from '~/types/api/video-collection'

export type ListCategoriesParams = {
  page?: number
  per_page?: number
}

export type ListCategoryVideosParams = {
  page?: number
  per_page?: number
  video_type?: string
}

export type ListCategoryTranscodedStreamsParams = {
  page?: number
  per_page?: number
}

export type ListCategoryVideoCollectionsParams = {
  page?: number
  per_page?: number
}

export function listCategories(params: ListCategoriesParams = {}): Promise<CategoryListResponse> {
  return apiFetch<CategoryListResponse>('/categories', {
    query: params,
  })
}

export function listVideosByCategory(
  categoryId: number,
  params: ListCategoryVideosParams = {},
): Promise<RawVideoListResponse> {
  return apiFetch<RawVideoListResponse>(`/categories/${categoryId}/videos`, {
    query: params,
  })
}

export function listTranscodedStreamsByCategory(
  categoryId: number,
  params: ListCategoryTranscodedStreamsParams = {},
): Promise<TranscodedStreamListResponse> {
  return apiFetch<TranscodedStreamListResponse>(`/categories/${categoryId}/transcoded-streams`, {
    query: params,
  })
}

export function listVideoCollectionsByCategory(
  categoryId: number,
  params: ListCategoryVideoCollectionsParams = {},
): Promise<VideoCollectionListResponse> {
  return apiFetch<VideoCollectionListResponse>(`/categories/${categoryId}/video-collections`, {
    query: params,
  })
}
