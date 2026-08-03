import { apiFetch } from './client'
import type {
  UploadCredentialRequest,
  UploadCredentialResponse,
} from '~/types/api/upload'

export function getUploadCredentials(
  body: UploadCredentialRequest,
): Promise<UploadCredentialResponse> {
  return apiFetch<UploadCredentialResponse>('/uploads/credentials', {
    method: 'POST',
    body,
  })
}
