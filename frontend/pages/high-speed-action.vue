<template>
  <div class="hsa">
    <div class="hsa__glow hsa__glow--red" aria-hidden="true" />
    <div class="hsa__glow hsa__glow--red-center" aria-hidden="true" />
    <div class="hsa__spotlight" aria-hidden="true" />

    <div class="hsa__noise" aria-hidden="true">
      <svg class="hsa__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="hsa-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#hsa-noise)" />
      </svg>
    </div>

    <div class="hsa__inner">
      <header class="hsa__header">
        <div class="hsa__header-brand">
          <NuxtLink to="/home" class="hsa__logo-link">
            <img class="hsa__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="hsa__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="hsa__crumb">Home</NuxtLink>
            <span class="hsa__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="hsa__crumb hsa__crumb--current">High-Speed Action</span>
          </nav>
        </div>
      </header>

      <main class="hsa__main">
        <section class="hsa__section" aria-labelledby="hsa-pool-title">
          <div class="hsa__section-head">
            <h2 id="hsa-pool-title" class="hsa__section-title">Content Pool</h2>
            <div class="hsa__toolbar" role="toolbar" aria-label="Content pool filters">
              <button type="button" class="hsa__icon-btn" aria-label="Search content pool">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" stroke-linecap="round" />
                </svg>
              </button>
              <label class="hsa__filter">
                <span class="visually-hidden">Time</span>
                <select v-model="poolFilters.time" class="hsa__select" aria-label="Time">
                  <option value="" disabled>Time</option>
                  <option v-for="o in timeOptions" :key="`pt-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Resolution</span>
                <select v-model="poolFilters.resolution" class="hsa__select" aria-label="Resolution">
                  <option value="" disabled>Resolution</option>
                  <option v-for="o in resolutionOptions" :key="`pr-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Type</span>
                <select v-model="poolFilters.type" class="hsa__select" aria-label="Type">
                  <option value="" disabled>Type</option>
                  <option v-for="o in typeOptions" :key="`py-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Size</span>
                <select v-model="poolFilters.size" class="hsa__select" aria-label="Size">
                  <option value="" disabled>Size</option>
                  <option v-for="o in sizeOptions" :key="`ps-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
            </div>
          </div>
          <ul class="hsa__grid hsa__grid--pool" role="list">
            <li v-for="item in contentPool" :key="item.id" class="hsa__tile">
              <NuxtLink :to="item.to" class="hsa__card">
                <span class="hsa__card-visual">
                  <img :src="item.imageUrl" :alt="item.title" loading="lazy" decoding="async" />
                </span>
                <span class="hsa__card-label">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <div class="hsa__rule" role="presentation" />

        <section class="hsa__section" aria-labelledby="hsa-stream-title">
          <div class="hsa__section-head">
            <h2 id="hsa-stream-title" class="hsa__section-title">Streaming Files</h2>
            <div class="hsa__toolbar" role="toolbar" aria-label="Streaming files filters">
              <button type="button" class="hsa__icon-btn" aria-label="Search streaming files">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" stroke-linecap="round" />
                </svg>
              </button>
              <label class="hsa__filter">
                <span class="visually-hidden">Time</span>
                <select v-model="streamFilters.time" class="hsa__select" aria-label="Time">
                  <option value="" disabled>Time</option>
                  <option v-for="o in timeOptions" :key="`st-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Resolution</span>
                <select v-model="streamFilters.resolution" class="hsa__select" aria-label="Resolution">
                  <option value="" disabled>Resolution</option>
                  <option v-for="o in resolutionOptions" :key="`sr-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Type</span>
                <select v-model="streamFilters.type" class="hsa__select" aria-label="Type">
                  <option value="" disabled>Type</option>
                  <option v-for="o in typeOptions" :key="`sy-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
              <label class="hsa__filter">
                <span class="visually-hidden">Size</span>
                <select v-model="streamFilters.size" class="hsa__select" aria-label="Size">
                  <option value="" disabled>Size</option>
                  <option v-for="o in sizeOptions" :key="`ss-${o}`" :value="o">{{ o }}</option>
                </select>
              </label>
            </div>
          </div>
          <ul class="hsa__grid hsa__grid--stream" role="list">
            <li v-for="item in streamingFiles" :key="item.id" class="hsa__tile">
              <NuxtLink :to="item.to" class="hsa__card hsa__card--stream">
                <span class="hsa__folder-tab" aria-hidden="true" />
                <span class="hsa__card-visual">
                  <img :src="item.imageUrl" :alt="item.title" loading="lazy" decoding="async" />
                </span>
                <span class="hsa__card-label">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </main>

      <p class="hsa__watermark" aria-hidden="true">WORKSPACE</p>

      <footer class="hsa__footer">
        <span class="hsa__copyright">@ CSOT 2026</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import nba1Url from '~/assets/nba1.png?url'
import nba2Url from '~/assets/nba2.png?url'
import nba3Url from '~/assets/nba3.png?url'
import streaming1Url from '~/assets/streaming1.png?url'
import streaming2Url from '~/assets/streaming2.png?url'

type PoolItem = { id: string; title: string; imageUrl: string; to: string }
type StreamItem = { id: string; title: string; imageUrl: string; to: string }

const contentPool: PoolItem[] = [
  {
    id: 'pool-1',
    title: 'NBA All-Star Game 2026 1',
    imageUrl: nba1Url,
    to: '/content-pool/pool-1/targeting',
  },
  {
    id: 'pool-2',
    title: 'NBA All-Star Game 2026 2',
    imageUrl: nba2Url,
    to: '/content-pool/pool-2/targeting',
  },
  {
    id: 'pool-3',
    title: 'NBA All-Star Game 2026 3',
    imageUrl: nba3Url,
    to: '/content-pool/pool-3/targeting',
  },
]

const streamingFiles: StreamItem[] = [
  {
    id: 'sf-1',
    title: 'Streaming File Name_Gun…',
    imageUrl: streaming1Url,
    to: '/streaming_file/gunfight',
  },
  {
    id: 'sf-2',
    title: 'Streaming File Name_F1…',
    imageUrl: streaming2Url,
    to: '/streaming_file/f1',
  },
]

const timeOptions = ['Last 24h', 'Last 7d', 'Last 30d', 'All time'] as const
const resolutionOptions = ['4K', '1080p', '720p', 'SD'] as const
const typeOptions = ['Mezzanine', 'Proxy', 'HLS', 'DASH'] as const
const sizeOptions = ['< 5 GB', '5–20 GB', '20–100 GB', '> 100 GB'] as const

const poolFilters = ref({
  time: '',
  resolution: '',
  type: '',
  size: '',
})

const streamFilters = ref({
  time: '',
  resolution: '',
  type: '',
  size: '',
})

useHead({
  title: 'High-Speed Action — Content — RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hsa {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background-color: #000;
  background-image:
    radial-gradient(ellipse 100% 90% at 50% 100%, rgba(120, 8, 28, 0.85) 0%, rgba(55, 4, 14, 0.45) 42%, transparent 58%),
    radial-gradient(ellipse 120% 85% at 0% 100%, rgba(110, 12, 32, 0.72) 0%, rgba(45, 6, 14, 0.35) 38%, transparent 62%),
    linear-gradient(180deg, #000000 0%, #050204 38%, #120208 100%);
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.hsa__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.hsa__glow--red {
  width: min(95vw, 980px);
  height: min(95vw, 980px);
  left: -22%;
  bottom: -35%;
  opacity: 0.55;
  background: radial-gradient(
    circle,
    rgba(160, 24, 48, 0.55) 0%,
    rgba(90, 8, 28, 0.38) 42%,
    rgba(30, 0, 10, 0.12) 68%,
    transparent 76%
  );
}

.hsa__glow--red-center {
  width: min(120vw, 1400px);
  height: min(70vh, 900px);
  left: 50%;
  bottom: -40%;
  transform: translateX(-50%);
  opacity: 0.7;
  filter: blur(140px);
  background: radial-gradient(
    ellipse 55% 45% at 50% 100%,
    rgba(200, 28, 48, 0.5) 0%,
    rgba(80, 6, 22, 0.28) 50%,
    transparent 72%
  );
}

.hsa__spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 58% 46% at 50% 38%,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 240, 245, 0.02) 45%,
    transparent 74%
  );
}

.hsa__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.hsa__noise-svg {
  width: 100%;
  height: 100%;
}

.hsa__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: min(100%, 1280px);
  margin: 0 auto;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2.25rem) clamp(0.75rem, 2vw, 1.25rem);
}

.hsa__header {
  display: block;
}

.hsa__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.hsa__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.hsa__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.hsa__crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  row-gap: 0.15rem;
  min-width: 0;
  font-size: clamp(0.95rem, 1.35vw, 1.125rem);
  font-weight: 500;
  color: #a0a0a0;
}

.hsa__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.hsa__crumb:hover {
  color: #fff;
}

.hsa__crumb--current {
  color: #fff;
}

.hsa__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.hsa__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  padding-block: clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 2.5vw, 2rem);
  min-height: 0;
}

.hsa__section {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.8vw, 1.1rem);
  min-width: 0;
}

.hsa__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
}

.hsa__section-title {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
}

.hsa__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  justify-content: flex-end;
}

.hsa__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: #c8c8c8;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.hsa__icon-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
}

.hsa__icon-btn svg {
  width: 1rem;
  height: 1rem;
}

.hsa__filter {
  min-width: 0;
}

.hsa__select {
  appearance: none;
  min-width: 5.5rem;
  max-width: 8.5rem;
  padding: 0.42rem 1.65rem 0.42rem 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
}

.hsa__select option {
  color: #111;
  background: #fff;
}

.hsa__grid {
  display: grid;
  gap: clamp(0.65rem, 1.5vw, 1rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hsa__grid--pool {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hsa__grid--stream {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: calc(66.666% + 0.5rem);
}

.hsa__tile {
  min-width: 0;
}

.hsa__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: rgba(12, 12, 14, 0.85);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 12px 28px rgba(0, 0, 0, 0.4);
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

a.hsa__card {
  text-decoration: none;
}

.hsa__card:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.16),
    0 16px 36px rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
}

.hsa__card--stream {
  position: relative;
}

.hsa__folder-tab {
  position: absolute;
  top: 0;
  left: 0.65rem;
  z-index: 2;
  width: 2.75rem;
  height: 0.55rem;
  border-radius: 0 0 6px 6px;
  background: linear-gradient(180deg, rgba(55, 55, 62, 0.98) 0%, rgba(35, 35, 40, 0.95) 100%);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.hsa__card-visual {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  overflow: hidden;
}

.hsa__card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hsa__card-label {
  display: block;
  padding: clamp(0.55rem, 1.2vw, 0.75rem) clamp(0.5rem, 1.1vw, 0.65rem);
  font-size: clamp(0.72rem, 1.1vw, 0.85rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.35;
}

.hsa__rule {
  height: 1px;
  margin: 0;
  background: rgba(255, 255, 255, 0.12);
  border: none;
}

.hsa__watermark {
  position: fixed;
  right: clamp(0.75rem, 3vw, 2rem);
  bottom: max(clamp(0.75rem, 2vw, 1.25rem), env(safe-area-inset-bottom, 0px));
  margin: 0;
  font-size: clamp(2.25rem, 7vw, 4rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  color: rgba(90, 12, 22, 0.38);
  line-height: 1;
  text-align: right;
  pointer-events: none;
  user-select: none;
  z-index: 3;
}

.hsa__footer {
  margin-top: auto;
  padding-top: 1rem;
}

.hsa__copyright {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.32);
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .hsa__grid--pool {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hsa__grid--stream {
    max-width: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .hsa__grid--pool,
  .hsa__grid--stream {
    grid-template-columns: 1fr;
  }

  .hsa__toolbar {
    width: 100%;
    justify-content: flex-start;
  }

  .hsa__select {
    max-width: none;
    flex: 1 1 calc(50% - 0.25rem);
  }
}
</style>
