import type { FetchOptions } from 'ofetch'
import { API_V1_BASE, withApiKeyHeaders } from '~/utils/api-config'

export function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = withApiKeyHeaders(
    (options.headers as Record<string, string> | undefined) ?? {},
  )

  return $fetch<T>(path, {
    ...options,
    baseURL: API_V1_BASE,
    headers,
  })
}
