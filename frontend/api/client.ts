import type { FetchOptions } from 'ofetch'

export function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  }

  if (config.public.apiKey) {
    headers['X-API-Key'] = config.public.apiKey
  }

  return $fetch<T>(path, {
    ...options,
    baseURL: '/api/v1',
    headers,
  })
}
