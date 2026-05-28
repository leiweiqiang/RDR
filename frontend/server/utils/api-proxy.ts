import type { H3Event } from 'h3'
import { getRequestURL, proxyRequest } from 'h3'
import { API_KEY_HEADER } from '~/utils/api-config'

function resolveApiProxyTarget(): string {
  const config = useRuntimeConfig()
  return (config.apiProxyTarget || 'http://127.0.0.1:8000').replace(/\/$/, '')
}

function resolveApiKey(): string {
  const config = useRuntimeConfig()
  return config.apiKey || config.public.apiKey || ''
}

export function proxyToBackend(event: H3Event) {
  const url = getRequestURL(event)
  const upstreamPath = url.pathname.replace(/^\/api/, '') || '/'
  const target = `${resolveApiProxyTarget()}${upstreamPath}${url.search}`

  const headers: Record<string, string> = {}
  const apiKey = resolveApiKey()
  if (apiKey) {
    headers[API_KEY_HEADER] = apiKey
  }

  return proxyRequest(event, target, { headers })
}
