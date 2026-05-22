export function getPublicApiKey(): string {
  if (import.meta.client && typeof window !== 'undefined') {
    const fromWindow = window.__NUXT__?.config?.public?.apiKey
    if (fromWindow) {
      return fromWindow
    }
  }

  return useRuntimeConfig().public.apiKey
}
