<template>
  <AppWorkspaceShell>
    <div class="app-page-inner">
      <header class="col__header">
        <div class="col__header-brand">
          <NuxtLink to="/" class="col__logo-link">
            <img class="col__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="col__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="col__crumb">Home</NuxtLink>
            <span class="col__crumb-sep" aria-hidden="true">&gt;</span>
            <NuxtLink :to="`/categories/${categoryId}`" class="col__crumb">{{ categoryTitle || 'Categories' }}</NuxtLink>
            <span class="col__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="col__crumb col__crumb--current">{{ displayFileName || '…' }}</span>
          </nav>
        </div>
      </header>

      <div v-if="pending" class="col__status" role="status">Loading collection…</div>
      <div v-else-if="error" class="col__status col__status--error" role="alert">
        <p>Failed to load collection.</p>
        <button type="button" class="col__retry" @click="refresh()">Retry</button>
      </div>
      <template v-else-if="collection">
        <div class="col__rule col__rule--top" role="presentation" />

        <section class="col__summary" aria-label="Video details">
          <div class="col__summary-thumb">
            <img :src="collection.cover" :alt="displayFileName" loading="lazy" decoding="async" />
          </div>
          <dl class="col__summary-meta">
            <div class="col__summary-row">
              <dt>File Name</dt>
              <dd>{{ displayFileName }}</dd>
            </div>
            <div class="col__summary-row">
              <dt>Format</dt>
              <dd>{{ fileFormat }}</dd>
            </div>
            <div class="col__summary-row">
              <dt>Added Date</dt>
              <dd>{{ addedDate }}</dd>
            </div>
            <div class="col__summary-row">
              <dt>Provider</dt>
              <dd>{{ providerLabel }}</dd>
            </div>
          </dl>
        </section>

        <div class="col__rule" role="presentation" />

        <section class="col__section" aria-labelledby="col-stream-title">
          <div class="col__section-head">
            <div class="col__section-title-wrap">
              <h2 id="col-stream-title" class="col__section-title">Streaming Generation</h2>
              <NuxtLink :to="targetingHref" class="col__pill-btn">+ Streaming</NuxtLink>
            </div>
            <div class="col__toolbar" role="toolbar" aria-label="Streaming generation filters">
              <button type="button" class="col__icon-btn" aria-label="Search streaming files">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" stroke-linecap="round" />
                </svg>
              </button>
              <div
                v-for="field in filterFields"
                :key="`stream-${field.key}`"
                class="col__filter"
              >
                <label class="col__filter-label" :for="`stream-${field.key}`">{{ field.label }}</label>
                <AppStringSelect
                  :id="`stream-${field.key}`"
                  v-model="streamFilters[field.key]"
                  :options="field.options"
                  :placeholder="field.label"
                  :aria-label="field.label"
                  trigger-class="col__select-trigger"
                />
              </div>
              <div class="col__filter col__filter--stacks">
                <label class="col__filter-label" for="stream-stacks-by">Stacks by</label>
                <AppStringSelect
                  id="stream-stacks-by"
                  v-model="streamStacksBy"
                  :options="stacksByOptions"
                  placeholder="Stacks by"
                  aria-label="Stacks by"
                  trigger-class="col__select-trigger"
                />
              </div>
            </div>
          </div>

          <ul v-if="filteredStreams.length > 0" class="col__grid" role="list">
            <li v-for="stream in filteredStreams" :key="stream.id" class="col__tile">
              <button type="button" class="col__card" @click="goToStream(stream.id)">
                <span class="col__card-visual">
                  <img :src="stream.cover" :alt="stream.name" loading="lazy" decoding="async" />
                  <span
                    class="col__status-bar"
                    :class="`col__status-bar--${streamStatusTone(stream.status)}`"
                  >
                    {{ streamStatusLabel(stream.status) }}
                  </span>
                </span>
                <span class="col__card-label">{{ stream.name }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="col__empty">No streaming files yet.</p>
        </section>

        <div class="col__rule" role="presentation" />

        <section class="col__section" aria-labelledby="col-output-title">
          <div class="col__section-head">
            <div class="col__section-title-wrap">
              <h2 id="col-output-title" class="col__section-title">Outputs</h2>
            </div>
            <div class="col__toolbar" role="toolbar" aria-label="Output filters">
              <button type="button" class="col__icon-btn" aria-label="Search outputs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" stroke-linecap="round" />
                </svg>
              </button>
              <div
                v-for="field in filterFields"
                :key="`output-${field.key}`"
                class="col__filter"
              >
                <label class="col__filter-label" :for="`output-${field.key}`">{{ field.label }}</label>
                <AppStringSelect
                  :id="`output-${field.key}`"
                  v-model="outputFilters[field.key]"
                  :options="field.options"
                  :placeholder="field.label"
                  :aria-label="field.label"
                  trigger-class="col__select-trigger"
                />
              </div>
            </div>
          </div>
          <ul v-if="filteredOutputs.length > 0" class="col__grid" role="list">
            <li v-for="output in filteredOutputs" :key="`${output.kind}-${output.id}`" class="col__tile">
              <button type="button" class="col__card" @click="goToOutput(output)">
                <span class="col__card-visual">
                  <img
                    :src="getCollectionOutputCover(output, collection)"
                    :alt="output.name"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    class="col__status-bar"
                    :class="`col__status-bar--${streamStatusTone(output.status)}`"
                  >
                    {{ streamStatusLabel(output.status) }}
                  </span>
                </span>
                <span class="col__card-label">{{ output.name }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="col__empty col__empty--large">No Outputs</p>
        </section>
      </template>

      <AppSiteFooter />
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import { formatResolutionLabel } from '~/composables/useContentPoolVideo'
import type { CollectionOutputListItem } from '~/composables/useVideoCollection'
import {
  formatCollectionAddedDate,
  formatCollectionFileFormat,
  formatCollectionFileName,
  formatCollectionProvider,
  getCollectionOutputCover,
  getCollectionOutputItems,
  getStreamingGenerationStreams,
  streamStatusLabel,
  streamStatusTone,
  useVideoCollection,
} from '~/composables/useVideoCollection'

const route = useRoute()
const categoryId = computed(() => String(route.params.id))
const collectionId = computed(() => String(route.params.collectionId))

const { collection, categoryTitle, pending, error, refresh } = useVideoCollection(collectionId)

const displayFileName = computed(() =>
  collection.value ? formatCollectionFileName(collection.value.name) : '',
)

const fileFormat = computed(() => {
  if (!collection.value) return '—'
  return formatCollectionFileFormat(
    collection.value.name,
    collection.value.raw_video?.video_type,
    collection.value.raw_video?.storage_path,
  )
})

const addedDate = computed(() =>
  collection.value ? formatCollectionAddedDate(collection.value.created_at) : '—',
)

const providerLabel = computed(() =>
  collection.value ? formatCollectionProvider(collection.value.provider) : '—',
)

const targetingHref = computed(() => `/content-pool/${collectionId.value}/targeting`)

function goToStream(streamId: number) {
  // Clicking a streaming generation item initiates the Upscaling / output flow
  // for that specific stream — keep the stream id so the preview shows it.
  void navigateTo({
    path: newOutputHref.value,
    query: { stream: String(streamId) },
  })
}

function streamPagePath(streamId: number) {
  return `/categories/${categoryId.value}/collection/${collectionId.value}/stream/${streamId}`
}

function outputPagePath(outputId: number | 'new') {
  return `/categories/${categoryId.value}/collection/${collectionId.value}/output/${outputId}`
}

function goToOutput(output: CollectionOutputListItem) {
  // Decoded outputs compare via their parent stream id; upscaled transcodes
  // are themselves the stream to open on the side-by-side page.
  const streamId =
    output.kind === 'decoded' ? output.output.transcoded_stream_file_id : output.stream.id
  void navigateTo(streamPagePath(streamId))
}

const newOutputHref = computed(() => outputPagePath('new'))

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
const stacksByOptions = ['Name', 'Type'] as const

type FilterKey = 'resolution' | 'frames' | 'mbps'

const filterFields = [
  { key: 'resolution' as FilterKey, label: 'Resolution', options: resolutionFilterOptions },
  { key: 'frames' as FilterKey, label: 'Frames', options: framesFilterOptions },
  { key: 'mbps' as FilterKey, label: 'Mbps', options: bitrateFilterOptions },
]

const streamFilters = reactive<Record<FilterKey, string>>({
  resolution: 'All',
  frames: 'All',
  mbps: 'All',
})

const outputFilters = reactive<Record<FilterKey, string>>({
  resolution: 'All',
  frames: 'All',
  mbps: 'All',
})

const streamStacksBy = ref<string>('Name')

function resolutionMatchesFilter(streamResolution: string, filter: string): boolean {
  if (filter === 'All') return true
  return formatResolutionLabel(streamResolution).toUpperCase() === filter.toUpperCase()
}

function fpsMatchesFilter(fps: number | null, filter: string): boolean {
  if (filter === 'All') return true
  if (fps == null) return false
  if (filter === 'Less than 12fps') return fps < 12
  if (filter === 'Higher than 128 fps') return fps > 128
  const match = filter.match(/^(\d+)\s*fps$/i)
  if (!match) return true
  return fps === Number.parseInt(match[1], 10)
}

function bitrateMatchesFilter(bitrate: number | null, filter: string): boolean {
  if (filter === 'All') return true
  if (bitrate == null) return false
  if (filter === 'Less than 8Mbps') return bitrate < 8
  if (filter === 'Higher than 100 Mbps') return bitrate > 100
  const match = filter.match(/^(\d+)\s*Mbps$/i)
  if (!match) return true
  return bitrate === Number.parseInt(match[1], 10)
}

const filteredStreams = computed(() => {
  const streams = collection.value ? getStreamingGenerationStreams(collection.value) : []
  return streams.filter(
    (stream) =>
      resolutionMatchesFilter(stream.resolution, streamFilters.resolution) &&
      fpsMatchesFilter(stream.fps, streamFilters.frames) &&
      bitrateMatchesFilter(stream.bitrate, streamFilters.mbps),
  )
})

const filteredOutputs = computed(() => {
  const outputs = collection.value ? getCollectionOutputItems(collection.value) : []
  return outputs.filter(
    (output) =>
      resolutionMatchesFilter(output.resolution, outputFilters.resolution) &&
      fpsMatchesFilter(output.fps, outputFilters.frames) &&
      bitrateMatchesFilter(output.bitrate, outputFilters.mbps),
  )
})

useHead(() => ({
  title: displayFileName.value
    ? `${displayFileName.value} — Collection — RDR`
    : 'Collection — RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
}))
</script>

<style scoped>
.col__header {
  display: block;
  margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
}

.col__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.col__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.col__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.col__crumbs {
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

.col__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.col__crumb:hover {
  color: #fff;
}

.col__crumb--current {
  color: #fff;
}

.col__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.col__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.col__status--error p {
  margin: 0;
}

.col__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.col__summary {
  --col-card-gap: clamp(0.85rem, 2vw, 1.35rem);
  --col-card-columns: 5;
  --col-card-width: calc(
    (100% - (var(--col-card-columns) - 1) * var(--col-card-gap)) / var(--col-card-columns)
  );
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.5vw, 2rem);
  padding-block: clamp(0.5rem, 1.5vw, 1rem);
}

.col__summary-thumb {
  flex: 0 0 var(--col-card-width);
  width: var(--col-card-width);
  max-width: var(--col-card-width);
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 12px 28px rgba(0, 0, 0, 0.4);
}

.col__summary-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.col__summary-meta {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  gap: clamp(0.55rem, 1vw, 0.75rem);
  margin: 0;
}

.col__summary-row {
  display: flex;
  align-items: baseline;
  gap: clamp(1.25rem, 2.5vw, 2rem);
  min-width: 0;
}

.col__summary-row dt {
  flex: 0 0 6.75rem;
  margin: 0;
  font-size: clamp(0.88rem, 1.25vw, 1rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
}

.col__summary-row dd {
  flex: 0 0 auto;
  margin: 0;
  font-size: clamp(0.88rem, 1.25vw, 1rem);
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.col__rule {
  height: 1px;
  margin: clamp(0.85rem, 2vw, 1.25rem) 0;
  background: rgba(255, 255, 255, 0.12);
}

.col__rule--top {
  margin-top: clamp(0.5rem, 1.5vw, 1rem);
  margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
}

.col__section {
  display: flex;
  flex-direction: column;
  gap: clamp(0.85rem, 2vw, 1.25rem);
  padding-bottom: clamp(0.5rem, 1.5vw, 1rem);
}

.col__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 1rem;
}

.col__section-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  min-width: 0;
}

.col__section-title {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
}

.col__pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.col__pill-btn:hover:not(:disabled) {
  filter: brightness(0.96);
}

.col__pill-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.col__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.45rem;
  justify-content: flex-end;
  margin-left: auto;
}

.col__filter--stacks {
  margin-left: 0.35rem;
}

.col__icon-btn {
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
}

.col__icon-btn svg {
  width: 1rem;
  height: 1rem;
}

.col__filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.col__filter-label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

:deep(.col__select-trigger) {
  appearance: none;
  min-width: 5.5rem;
  max-width: 8.5rem;
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
}

:deep(.col__select-trigger svg) {
  color: #a0a0a0;
}

.col__grid {
  --col-card-gap: clamp(0.85rem, 2vw, 1.35rem);
  --col-card-columns: 5;
  --col-card-width: calc(
    (100% - (var(--col-card-columns) - 1) * var(--col-card-gap)) / var(--col-card-columns)
  );
  display: grid;
  grid-template-columns: repeat(var(--col-card-columns), minmax(0, 1fr));
  gap: var(--col-card-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

.col__tile {
  min-width: 0;
}

.col__card {
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
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.col__card:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.16),
    0 16px 36px rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
}

.col__card-visual {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  overflow: hidden;
}

.col__card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.col__status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.35rem 0.5rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  color: #fff;
}

.col__status-bar--processing {
  background: rgba(0, 229, 255, 0.92);
  color: #002028;
}

.col__status-bar--done {
  background: rgba(0, 230, 118, 0.92);
  color: #002818;
}

.col__status-bar--failed {
  background: rgba(255, 82, 138, 0.92);
  color: #fff;
}

.col__status-bar--neutral {
  background: rgba(255, 255, 255, 0.75);
  color: #111;
}

.col__card-label {
  display: block;
  padding: clamp(0.55rem, 1.2vw, 0.75rem) clamp(0.5rem, 1.1vw, 0.65rem);
  font-size: clamp(0.72rem, 1.1vw, 0.85rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.35;
  word-break: break-word;
}

.col__empty {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
}

.col__empty--large {
  min-height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.18);
}

@media (max-width: 900px) {
  .col__summary,
  .col__grid {
    --col-card-columns: 3;
  }

  .col__summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .col__summary-meta {
    width: auto;
  }

  .col__section-head {
    flex-direction: column;
    align-items: stretch;
  }

  .col__toolbar {
    justify-content: flex-start;
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .col__summary,
  .col__grid {
    --col-card-columns: 2;
  }
}

@media (max-width: 400px) {
  .col__summary,
  .col__grid {
    --col-card-columns: 1;
  }
}
</style>
