export const API_KEY_HEADER = 'X-API-Key'
export const API_V1_BASE = '/api/v1'

export function getApiKey(): string {
  const config = useRuntimeConfig()
  return config.public.apiKey || config.apiKey || ''
}

export function withApiKeyHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return headers
  }

  return {
    ...headers,
    [API_KEY_HEADER]: apiKey,
  }
}
