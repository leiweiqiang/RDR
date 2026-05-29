<template>
  <div class="sf">
    <div class="sf__glow sf__glow--red" aria-hidden="true" />
    <div class="sf__glow sf__glow--red-center" aria-hidden="true" />
    <div class="sf__spotlight" aria-hidden="true" />

    <div class="sf__noise" aria-hidden="true">
      <svg class="sf__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="sf-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#sf-noise)" />
      </svg>
    </div>

    <p class="sf__watermark" aria-hidden="true">WORKSPACE</p>

    <div class="sf__inner">
      <header class="sf__header">
        <div class="sf__header-brand">
          <NuxtLink to="/" class="sf__logo-link">
            <img class="sf__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="sf__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="sf__crumb">Home</NuxtLink>
            <span class="sf__crumb-sep" aria-hidden="true">&gt;</span>
            <NuxtLink to="/high-speed-action" class="sf__crumb">High-Speed Action</NuxtLink>
            <span class="sf__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="sf__crumb sf__crumb--current">{{ streamingTitle }}</span>
          </nav>
        </div>
      </header>

      <div class="sf__rule" role="presentation" />

      <div class="sf__toolbar">
        <div class="sf__toolbar-left">
          <button type="button" class="sf__icon-btn" aria-label="Search">
            <svg class="sf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" stroke-linecap="round" />
            </svg>
          </button>
          <div
            v-for="field in filterFields"
            :key="field.key"
            class="sf__filter"
          >
            <label class="sf__filter-label" :for="`sf-${field.key}`">
              {{ field.label }}
            </label>
            <AppStringSelect
              :id="`sf-${field.key}`"
              v-model="filterChoices[field.key]"
              :options="field.options"
              :placeholder="field.label"
              :aria-label="field.label"
              trigger-class="sf__select-trigger"
            />
          </div>
        </div>
        <div class="sf__toolbar-right">
          <div class="sf__filter">
            <label class="sf__filter-label" for="sf-stacks-by">
              Stacks by
            </label>
            <AppStringSelect
              id="sf-stacks-by"
              v-model="stacksBy"
              :options="stacksByOptions"
              placeholder="Stacks by"
              aria-label="Stacks by"
              trigger-class="sf__select-trigger"
            />
          </div>
        </div>
      </div>

      <main class="sf__main">
        <div class="sf__grid" role="list">
          <button
            v-for="file in files"
            :key="file.id"
            type="button"
            class="sf__file-card"
            role="listitem"
          >
            <div class="sf__file-thumb" :class="{ 'sf__file-thumb--meta': file.kind === 'metadata' }">
              <template v-if="file.kind === 'index'">
                <svg class="sf__file-svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <rect x="12" y="8" width="40" height="48" rx="4" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                  <path d="M18 18h28M18 26h20" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round" />
                  <g transform="translate(34, 34)">
                    <rect x="0" y="0" width="22" height="18" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" />
                    <path d="M7 5l6 4-6 4V5z" fill="rgba(255,255,255,0.45)" />
                  </g>
                </svg>
              </template>
              <template v-else>
                <svg class="sf__file-svg sf__file-svg--meta" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M14 20h8v24H14V20z" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linejoin="round" />
                  <path d="M42 20h8v24h-8V20z" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linejoin="round" />
                  <path d="M26 32h12" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M32 26l6 6-6 6" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
            </div>
            <span class="sf__file-label">{{ file.label }}</span>
          </button>
        </div>
      </main>

      <footer class="sf__footer">
        <span class="sf__copyright">© CSOT 2026</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'

type FileEntry = {
  id: string
  kind: 'index' | 'metadata'
  label: string
}

const route = useRoute()

const STREAMING_TITLES: Record<string, string> = {
  gunfight: 'Streaming File Name_GunFight',
  f1: 'Streaming File Name_F1',
  s1: 'Streaming File Name_GunFight',
  s2: 'Streaming File Name_F1',
}

const rawId = computed(() => {
  const p = route.params.id
  return Array.isArray(p) ? p[0] ?? '' : p ?? ''
})

const streamingTitle = computed(() => {
  const id = rawId.value
  return STREAMING_TITLES[id] ?? `Streaming File Name_${id}`
})

const resolutionFilterOptions = ['All', '4K', '1080P', '720P', '360P'] as const
const framesFilterOptions = [
  'All',
  'Less than 12fps',
  '12 fps',
  '24 fps',
  '48 fps',
  '64 fps',
  '128 fps',
  'Higher than 128 fps',
] as const
const bitrateFilterOptions = [
  'All',
  'Less than 8Mbps',
  '24 Mbps',
  '48 Mbps',
  '100 Mbps',
  'Higher than 100 Mbps',
] as const

type FilterKey = 'resolution' | 'frames' | 'mbps'

const filterFields = [
  { key: 'resolution' as FilterKey, label: 'Resolution', options: resolutionFilterOptions },
  { key: 'frames' as FilterKey, label: 'Frames', options: framesFilterOptions },
  { key: 'mbps' as FilterKey, label: 'Mbps', options: bitrateFilterOptions },
]

const filterChoices = ref<Record<FilterKey, string>>({
  resolution: 'All',
  frames: '24 fps',
  mbps: '48 Mbps',
})

const stacksByOptions = ['Name', 'Type'] as const
const stacksBy = ref('Name')

const files: FileEntry[] = [
  { id: 'i1', kind: 'index', label: 'Name_index_1' },
  { id: 'm1', kind: 'metadata', label: 'Name_Metadata_1' },
  { id: 'i2', kind: 'index', label: 'Name_index_2' },
  { id: 'm2', kind: 'metadata', label: 'Name_Metadata_2' },
]

useHead(() => ({
  title: `${streamingTitle.value} — RDR`,
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
}))
</script>

<style scoped>
.sf {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background-color: transparent;
  background-image: none;
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.sf__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.sf__glow--red {
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

.sf__glow--red-center {
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

.sf__spotlight {
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

.sf__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.sf__noise-svg {
  width: 100%;
  height: 100%;
}

.sf__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: min(100%, 1440px);
  margin: 0 auto;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2.25rem) clamp(0.75rem, 2vw, 1.25rem);
}

.sf__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.sf__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.sf__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.sf__crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  row-gap: 0.15rem;
  min-width: 0;
  font-size: clamp(0.85rem, 1.2vw, 1.05rem);
  font-weight: 500;
  color: #a0a0a0;
}

.sf__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.sf__crumb:hover {
  color: #fff;
}

.sf__crumb--current {
  color: #fff;
}

.sf__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.sf__rule {
  height: 1px;
  margin: clamp(0.85rem, 2vw, 1.25rem) 0;
  background: rgba(255, 255, 255, 0.14);
}

.sf__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 0.75rem 1.25rem;
  margin-bottom: clamp(1.25rem, 2.5vw, 1.75rem);
}

.sf__toolbar-left,
.sf__toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem;
}

.sf__filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.sf__filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
}

.sf__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.sf__icon-btn:hover {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
}

.sf__icon {
  width: 1.1rem;
  height: 1.1rem;
}

.sf__toolbar-left :deep(.sf__select-trigger) {
  min-width: 8.25rem;
  max-width: 12rem;
}

:deep(.sf__select-trigger) {
  appearance: none;
  min-width: 6.5rem;
  height: auto;
  min-height: 2.1rem;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: none;
  --ring: 214 32% 60%;
}

:deep(.sf__select-trigger svg) {
  color: #a0a0a0;
  opacity: 1;
}

.sf__main {
  flex: 1;
  min-height: 0;
  padding-bottom: clamp(2rem, 5vw, 3rem);
}

.sf__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.35rem);
  max-width: 920px;
}

.sf__file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-align: center;
  min-width: 0;
}

.sf__file-card:hover .sf__file-thumb {
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.sf__file-thumb {
  width: 100%;
  aspect-ratio: 1;
  max-width: 160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.sf__file-svg {
  width: 52%;
  height: 52%;
}

.sf__file-label {
  font-size: clamp(0.62rem, 0.95vw, 0.72rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.3;
  word-break: break-all;
  max-width: 100%;
}

.sf__watermark {
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
  z-index: 1;
}

.sf__footer {
  margin-top: auto;
  padding-top: 0.5rem;
}

.sf__copyright {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.32);
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .sf__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }
}

@media (max-width: 520px) {
  .sf__grid {
    grid-template-columns: 1fr;
  }
}
</style>
