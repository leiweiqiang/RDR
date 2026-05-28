import { proxyToBackend } from '~/server/utils/api-proxy'

export default defineEventHandler((event) => proxyToBackend(event))
