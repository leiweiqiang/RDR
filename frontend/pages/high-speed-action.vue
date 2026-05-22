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

    <p class="hsa__watermark" aria-hidden="true">WORKSPACE</p>

    <div class="hsa__inner">
      <header class="hsa__header">
        <div class="hsa__header-brand">
          <NuxtLink to="/" class="hsa__logo-link">
            <img class="hsa__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="hsa__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="hsa__crumb">Home</NuxtLink>
            <span class="hsa__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="hsa__crumb hsa__crumb--current">{{ categoryTitle || 'High-Speed Action' }}</span>
          </nav>
        </div>
      </header>

      <main class="hsa__main">
        <div v-if="pending" class="hsa__status" role="status">
          Loading content...
        </div>
        <div v-else-if="error" class="hsa__status hsa__status--error" role="alert">
          <p>Failed to load content.</p>
          <button type="button" class="hsa__retry" @click="refresh()">Retry</button>
        </div>
        <template v-else>
        <section class="hsa__section" aria-labelledby="hsa-pool-title">
          <div class="hsa__section-head">
            <h2 id="hsa-pool-title" class="hsa__section-title">Content Pool</h2>
            <div class="hsa__toolbar" role="toolbar" aria-label="Content pool filters">
              <div class="hsa__search-wrap">
                <button
                  type="button"
                  class="hsa__icon-btn"
                  :class="{ 'hsa__icon-btn--active': poolSearchOpen }"
                  :aria-expanded="poolSearchOpen"
                  aria-controls="hsa-pool-search"
                  aria-label="Search content pool"
                  @click="togglePoolSearch"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3-3" stroke-linecap="round" />
                  </svg>
                </button>
                <div
                  id="hsa-pool-search"
                  class="hsa__search-field"
                  :class="{ 'hsa__search-field--open': poolSearchOpen }"
                >
                  <div class="hsa__search-field-inner">
                    <label class="visually-hidden" for="hsa-pool-search-input">Search content pool</label>
                    <input
                      id="hsa-pool-search-input"
                      ref="poolSearchInput"
                      v-model="poolSearchQuery"
                      type="search"
                      class="hsa__search-input"
                      placeholder="Search…"
                      autocomplete="off"
                      @keydown.esc="closePoolSearch"
                    />
                  </div>
                </div>
              </div>
              <div
                v-for="field in filterFields"
                :key="field.key"
                class="hsa__filter"
              >
                <label class="hsa__filter-label" :for="`pool-${field.key}`">{{ field.label }}</label>
                <AppStringSelect
                  :id="`pool-${field.key}`"
                  v-model="poolFilters[field.key]"
                  :options="field.options"
                  :placeholder="field.label"
                  :aria-label="field.label"
                  trigger-class="hsa__select-trigger"
                />
              </div>
            </div>
          </div>
          <ul class="hsa__grid hsa__grid--pool" role="list">
            <li v-for="item in filteredContentPool" :key="item.id" class="hsa__tile">
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
              <div class="hsa__search-wrap">
                <button
                  type="button"
                  class="hsa__icon-btn"
                  :class="{ 'hsa__icon-btn--active': streamSearchOpen }"
                  :aria-expanded="streamSearchOpen"
                  aria-controls="hsa-stream-search"
                  aria-label="Search streaming files"
                  @click="toggleStreamSearch"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3-3" stroke-linecap="round" />
                  </svg>
                </button>
                <div
                  id="hsa-stream-search"
                  class="hsa__search-field"
                  :class="{ 'hsa__search-field--open': streamSearchOpen }"
                >
                  <div class="hsa__search-field-inner">
                    <label class="visually-hidden" for="hsa-stream-search-input">Search streaming files</label>
                    <input
                      id="hsa-stream-search-input"
                      ref="streamSearchInput"
                      v-model="streamSearchQuery"
                      type="search"
                      class="hsa__search-input"
                      placeholder="Search…"
                      autocomplete="off"
                      @keydown.esc="closeStreamSearch"
                    />
                  </div>
                </div>
              </div>
              <div
                v-for="field in filterFields"
                :key="field.key"
                class="hsa__filter"
              >
                <label class="hsa__filter-label" :for="`stream-${field.key}`">{{ field.label }}</label>
                <AppStringSelect
                  :id="`stream-${field.key}`"
                  v-model="streamFilters[field.key]"
                  :options="field.options"
                  :placeholder="field.label"
                  :aria-label="field.label"
                  trigger-class="hsa__select-trigger"
                />
              </div>
            </div>
          </div>
          <ul class="hsa__grid hsa__grid--stream" role="list">
            <li v-for="item in filteredStreamingFiles" :key="item.id" class="hsa__tile">
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
        </template>
      </main>

      <footer class="hsa__footer">
        <span class="hsa__copyright">@ CSOT 2026</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'

const CATEGORY_NAME = 'high-speed-action'

const { categoryTitle, contentPool, streamingFiles, pending, error, refresh } =
  useCategoryContent(CATEGORY_NAME)

const timeOptions = ['All', 'Last Week', 'Last Month', 'Last Year'] as const
const resolutionOptions = ['All', '4K', '2K', '1080P', '720P', '480P', '360P'] as const
const typeOptions = ['All', '.mp4', '.mov'] as const
const sizeOptions = ['All', 'Large to Small', 'Small to Large'] as const

type FilterKey = 'time' | 'resolution' | 'type' | 'size'

const filterFields: Array<{
  key: FilterKey
  label: string
  options: readonly string[]
}> = [
  { key: 'time', label: 'Time', options: timeOptions },
  { key: 'resolution', label: 'Resolution', options: resolutionOptions },
  { key: 'type', label: 'Type', options: typeOptions },
  { key: 'size', label: 'Size', options: sizeOptions },
]

const poolFilters = ref<Record<FilterKey, string>>({
  time: 'All',
  resolution: '2K',
  type: '.mov',
  size: 'Small to Large',
})

const streamFilters = ref<Record<FilterKey, string>>({
  time: 'All',
  resolution: '2K',
  type: '.mov',
  size: 'Small to Large',
})

const poolSearchOpen = ref(false)
const streamSearchOpen = ref(false)
const poolSearchQuery = ref('')
const streamSearchQuery = ref('')
const poolSearchInput = ref<HTMLInputElement | null>(null)
const streamSearchInput = ref<HTMLInputElement | null>(null)

function filterByQuery<T extends { title: string }>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => item.title.toLowerCase().includes(q))
}

const filteredContentPool = computed(() =>
  filterByQuery(contentPool.value, poolSearchQuery.value),
)

const filteredStreamingFiles = computed(() =>
  filterByQuery(streamingFiles.value, streamSearchQuery.value),
)

function togglePoolSearch() {
  poolSearchOpen.value = !poolSearchOpen.value
  if (!poolSearchOpen.value) {
    poolSearchQuery.value = ''
    return
  }
  nextTick(() => poolSearchInput.value?.focus())
}

function closePoolSearch() {
  poolSearchOpen.value = false
  poolSearchQuery.value = ''
}

function toggleStreamSearch() {
  streamSearchOpen.value = !streamSearchOpen.value
  if (!streamSearchOpen.value) {
    streamSearchQuery.value = ''
    return
  }
  nextTick(() => streamSearchInput.value?.focus())
}

function closeStreamSearch() {
  streamSearchOpen.value = false
  streamSearchQuery.value = ''
}

useHead(() => ({
  title: `${categoryTitle.value || 'High-Speed Action'} — Content — RDR`,
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
}))
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
  align-items: flex-end;
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

.hsa__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.hsa__status--error p {
  margin: 0;
}

.hsa__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.hsa__retry:hover {
  background: rgba(255, 255, 255, 0.14);
}

.hsa__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-start;
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
  align-items: flex-end;
  gap: 0.45rem;
  justify-content: flex-start;
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

.hsa__icon-btn--active {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.1);
}

.hsa__icon-btn svg {
  width: 1rem;
  height: 1rem;
}

.hsa__search-wrap {
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}

.hsa__search-field {
  display: grid;
  grid-template-columns: 0fr;
  transition: grid-template-columns 0.22s ease;
  align-items: flex-end;
}

.hsa__search-field--open {
  grid-template-columns: 1fr;
}

.hsa__search-field-inner {
  overflow: hidden;
  min-width: 0;
}

.hsa__search-input {
  box-sizing: border-box;
  min-width: 0;
  width: clamp(8rem, 18vw, 12.5rem);
  height: 2.1rem;
  padding: 0 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  outline: none;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.hsa__search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.hsa__search-input:focus {
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(0, 0, 0, 0.55);
}

.hsa__search-input::-webkit-search-cancel-button {
  cursor: pointer;
}

.hsa__filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.hsa__filter-label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
}

:deep(.hsa__select-trigger) {
  appearance: none;
  min-width: 5.5rem;
  max-width: 8.5rem;
  height: auto;
  min-height: 2.1rem;
  padding: 0.42rem 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: none;
  --ring: 214 32% 60%;
}

:deep(.hsa__select-trigger svg) {
  color: #a0a0a0;
  opacity: 1;
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
  z-index: 1;
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

  :deep(.hsa__select-trigger) {
    max-width: none;
    flex: 1 1 calc(50% - 0.25rem);
  }
}
</style>
