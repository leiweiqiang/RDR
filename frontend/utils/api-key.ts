export function getPublicApiKey(): string {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.__NUXT__?.config?.public?.apiKey ?? ''
  }

  return useRuntimeConfig().public.apiKey
}
