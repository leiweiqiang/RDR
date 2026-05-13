// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/content-pool/pool-1',
        '/content-pool/pool-1/targeting',
        '/content-pool/pool-1/metadata-extraction',
        '/content-pool/pool-1/packaging',
        '/content-pool/pool-2',
        '/content-pool/pool-2/targeting',
        '/content-pool/pool-2/metadata-extraction',
        '/content-pool/pool-2/packaging',
        '/content-pool/pool-3',
        '/content-pool/pool-3/targeting',
        '/content-pool/pool-3/metadata-extraction',
        '/content-pool/pool-3/packaging',
        '/content-pool/targeting/pool-1',
        '/content-pool/targeting/pool-2',
        '/content-pool/targeting/pool-3',
      ],
    },
  },
  routeRules: {
    '/api/**': { prerender: false },
  },
  compatibilityDate: '2025-05-01',
})
