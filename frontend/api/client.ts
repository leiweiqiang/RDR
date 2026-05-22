import type { FetchOptions } from 'ofetch'
import { getPublicApiKey } from '~/utils/api-key'

export function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  }

  const apiKey = getPublicApiKey()
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  return $fetch<T>(path, {
    ...options,
    baseURL: '/api/v1',
    headers,
  })
}
