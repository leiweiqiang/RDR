import { getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const upstreamPath = url.pathname.replace(/^\/api/, '') || '/'
  const base = (process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
  )
  const target = `${base}${upstreamPath}${url.search}`

  return proxyRequest(event, target)
})
