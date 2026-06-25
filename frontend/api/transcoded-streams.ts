import { apiFetch } from './client'
import type { TranscodeBatchCreateBody } from '~/types/api/transcode-task'
import type { TranscodedStreamFile } from '~/types/api/video-collection'

export function createTranscodeBatch(
  body: TranscodeBatchCreateBody,
): Promise<TranscodedStreamFile[]> {
  return apiFetch<TranscodedStreamFile[]>('/transcoded-streams/', {
    method: 'POST',
    body,
  })
}
