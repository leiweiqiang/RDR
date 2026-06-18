// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  app: {
    pageTransition: {
      name: 'page',
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/content-pool/pool-1',
        '/content-pool/pool-1/targeting',
        '/content-pool/pool-1/metadata-extraction',
        '/content-pool/pool-1/packaging',
        '/content-pool/pool-1/playback',
        '/content-pool/pool-1/playback/targeting',
        '/content-pool/pool-1/playback/decode-sr',
        '/content-pool/pool-1/playback/player',
        '/content-pool/pool-2',
        '/content-pool/pool-2/targeting',
        '/content-pool/pool-2/metadata-extraction',
        '/content-pool/pool-2/packaging',
        '/content-pool/pool-2/playback',
        '/content-pool/pool-2/playback/targeting',
        '/content-pool/pool-2/playback/decode-sr',
        '/content-pool/pool-2/playback/player',
        '/content-pool/pool-3',
        '/content-pool/pool-3/targeting',
        '/content-pool/pool-3/metadata-extraction',
        '/content-pool/pool-3/packaging',
        '/content-pool/pool-3/playback',
        '/content-pool/pool-3/playback/targeting',
        '/content-pool/pool-3/playback/decode-sr',
        '/content-pool/pool-3/playback/player',
        '/content-pool/targeting/pool-1',
        '/content-pool/targeting/pool-2',
        '/content-pool/targeting/pool-3',
      ],
    },
  },
  routeRules: {
    '/api/**': { prerender: false },
    '/collections': { redirect: '/collections/1' },
    '/high-speed-action': { redirect: '/collections/1' },
  },
  runtimeConfig: {
    apiKey: process.env.NUXT_PUBLIC_API_KEY || '',
    apiProxyTarget: process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:8000',
    public: {
      apiKey: process.env.NUXT_PUBLIC_API_KEY || '',
    },
  },
  compatibilityDate: '2025-05-01',
  devServer: {
    host: '0.0.0.0',
  },
  vite: {
    server: {
      // Allow access via reverse proxy hostnames (e.g. rdr.tcl-research.us).
      allowedHosts: true,
    },
  },
})
