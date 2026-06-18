<template>
  <AppWorkspaceShell>
    <div class="app-page-inner">
      <header class="sg__header">
        <div class="sg__header-brand">
          <NuxtLink to="/" class="sg__logo-link">
            <img class="sg__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="sg__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="sg__crumb">Home</NuxtLink>
            <span class="sg__crumb-sep" aria-hidden="true">&gt;</span>
            <NuxtLink :to="`/collections/${categoryId}`" class="sg__crumb">{{ categoryTitle || 'Collections' }}</NuxtLink>
            <span class="sg__crumb-sep" aria-hidden="true">&gt;</span>
            <NuxtLink :to="collectionHref" class="sg__crumb">{{ displayFileName || '…' }}</NuxtLink>
            <span class="sg__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="sg__crumb sg__crumb--current">{{ streamDisplayName || '…' }}</span>
          </nav>
        </div>
      </header>

      <div class="sg__rule sg__rule--top" role="presentation" />

      <div v-if="pending" class="sg__status" role="status">Loading stream…</div>
      <div v-else-if="error" class="sg__status sg__status--error" role="alert">
        <p>Failed to load stream.</p>
        <button type="button" class="sg__retry" @click="refresh()">Retry</button>
      </div>
      <template v-else-if="stream && streamSpec">
        <section class="sg__specs" aria-label="Stream specifications">
          <div class="sg__spec-col">
            <h2 class="sg__spec-title">{{ originalSpec.title }}</h2>
            <p class="sg__spec-line sg__spec-line--primary">{{ originalSpec.resolution }}</p>
            <p class="sg__spec-line sg__spec-line--accent">{{ originalSpec.bitrate }}</p>
            <p class="sg__spec-line sg__spec-line--accent">{{ originalSpec.fps }}</p>
          </div>
          <div class="sg__spec-col">
            <h2 class="sg__spec-title">{{ streamSpec.title }}</h2>
            <p class="sg__spec-line sg__spec-line--primary">{{ streamSpec.resolution }}</p>
            <p class="sg__spec-line sg__spec-line--accent">{{ streamSpec.bitrate }}</p>
            <p class="sg__spec-line sg__spec-line--accent">{{ streamSpec.fps }}</p>
          </div>
          <div class="sg__spec-col">
            <template v-if="lowerTierSpec">
              <p class="sg__spec-line sg__spec-line--primary">{{ lowerTierSpec.resolution }}</p>
              <p class="sg__spec-line sg__spec-line--accent">{{ lowerTierSpec.bitrate }}</p>
              <p class="sg__spec-line sg__spec-line--accent">{{ lowerTierSpec.fps }}</p>
            </template>
            <template v-else>
              <p class="sg__spec-line sg__spec-line--primary">—</p>
              <p class="sg__spec-line sg__spec-line--accent">—</p>
              <p class="sg__spec-line sg__spec-line--accent">—</p>
            </template>
          </div>
          <div class="sg__spec-col">
            <div class="sg__meta-row">
              <span class="sg__meta-label">Metadata Type</span>
              <span class="sg__meta-value">{{ metadataTypeLabel }}</span>
            </div>
            <div class="sg__meta-row">
              <span class="sg__meta-label">Location</span>
              <span class="sg__meta-value">—</span>
            </div>
          </div>
        </section>

        <section class="sg__compare" aria-label="Metadata comparison">
          <div class="sg__compare-col">
            <p class="sg__compare-label">Without RDR Metadata</p>
            <ContentPoolVideoPreviewFrame
              ref="withoutMetaPreviewRef"
              v-model:scrub-position="scrub"
              :image-url="previewCoverUrl"
              :stream-url="streamUrl"
              framed
              show-play
              :show-meta-badge="false"
              show-scrubber
              @play="syncPreviewPlayback"
              @scrub-start="onCompareScrubStart"
              @scrub-end="onCompareScrubEnd"
            />
          </div>
          <div class="sg__compare-col">
            <p class="sg__compare-label">With RDR Metadata</p>
            <ContentPoolVideoPreviewFrame
              ref="withMetaPreviewRef"
              v-model:scrub-position="scrub"
              :image-url="metadataCoverUrl"
              :stream-url="streamUrl"
              :scrub-source="false"
              framed
              show-play
              show-meta-badge
              show-scrubber
              @play="syncPreviewPlayback"
              @scrub-start="onCompareScrubStart"
              @scrub-end="onCompareScrubEnd"
            />
          </div>
        </section>

        <div class="sg__actions">
          <NuxtLink :to="collectionHref" class="sg__done-btn">Done</NuxtLink>
        </div>
      </template>

      <AppSiteFooter />
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import { useCollectionStreamPage } from '~/composables/useCollectionStreamPage'
import { formatCollectionFileName } from '~/composables/useVideoCollection'

const route = useRoute()
const categoryId = computed(() => String(route.params.id))
const collectionId = computed(() => String(route.params.collectionId))
const streamId = computed(() => String(route.params.streamId))

const {
  collection,
  stream,
  categoryTitle,
  originalSpec,
  streamSpec,
  lowerTierSpec,
  metadataTypeLabel,
  previewCoverUrl,
  metadataCoverUrl,
  streamUrl,
  pending,
  error,
  refresh,
} = useCollectionStreamPage(categoryId, collectionId, streamId)

const collectionHref = computed(
  () => `/collections/${categoryId.value}/collection/${collectionId.value}`,
)

const displayFileName = computed(() =>
  collection.value ? formatCollectionFileName(collection.value.name) : '',
)

const streamDisplayName = computed(() => stream.value?.name ?? '')

const withoutMetaPreviewRef = ref<{ play: () => void; pause: () => void } | null>(null)
const withMetaPreviewRef = ref<{ play: () => void; pause: () => void } | null>(null)
const previewPlaying = ref(false)
const resumeAfterCompareScrub = ref(false)

function syncPreviewPlayback(playing: boolean) {
  previewPlaying.value = playing
  if (playing) {
    withoutMetaPreviewRef.value?.play()
    withMetaPreviewRef.value?.play()
  } else {
    withoutMetaPreviewRef.value?.pause()
    withMetaPreviewRef.value?.pause()
  }
}

function onCompareScrubStart() {
  resumeAfterCompareScrub.value = previewPlaying.value
  syncPreviewPlayback(false)
}

function onCompareScrubEnd(shouldResume: boolean) {
  if (resumeAfterCompareScrub.value && shouldResume) syncPreviewPlayback(true)
  resumeAfterCompareScrub.value = false
}

const scrub = ref(0)

useHead(() => ({
  title: stream.value?.name
    ? `${stream.value.name} — Streaming — RDR`
    : `${categoryTitle.value || 'Streaming'} — RDR`,
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
}))
</script>

<style scoped>
.sg__header {
  display: block;
  margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
}

.sg__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.sg__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.sg__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.sg__crumbs {
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

.sg__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.sg__crumb:hover {
  color: #fff;
}

.sg__crumb--current {
  color: #fff;
}

.sg__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.sg__rule {
  height: 1px;
  margin: clamp(0.85rem, 2vw, 1.25rem) 0;
  background: rgba(255, 255, 255, 0.12);
}

.sg__rule--top {
  margin-top: 0;
  margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
}

.sg__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.sg__status--error p {
  margin: 0;
}

.sg__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.sg__specs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  padding-bottom: clamp(1.25rem, 2.5vw, 2rem);
}

.sg__spec-col {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
  padding-inline: clamp(0.75rem, 1.5vw, 1.25rem);
  border-left: 1px solid rgba(255, 255, 255, 0.14);
}

.sg__spec-col:first-child {
  padding-left: 0;
  border-left: none;
}

.sg__spec-title {
  margin: 0 0 0.15rem;
  font-size: clamp(0.95rem, 1.35vw, 1.1rem);
  font-weight: 600;
  color: #fff;
}

.sg__spec-line {
  margin: 0;
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  font-weight: 600;
  line-height: 1.35;
}

.sg__spec-line--primary {
  color: #fff;
}

.sg__spec-line--accent {
  color: #00e676;
}

.sg__meta-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  min-width: 0;
}

.sg__meta-label {
  flex: 0 0 auto;
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  font-weight: 600;
  color: #fff;
}

.sg__meta-value {
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  font-weight: 600;
  color: #00e676;
}

.sg__compare {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  padding-bottom: clamp(1.25rem, 2.5vw, 2rem);
}

.sg__compare-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sg__compare-label {
  margin: 0;
  font-size: clamp(0.95rem, 1.35vw, 1.1rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.sg__actions {
  display: flex;
  justify-content: flex-start;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.sg__done-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1.35rem;
  border: none;
  border-radius: 999px;
  background: #00e676;
  color: #000;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  box-shadow: 0 0 14px rgba(0, 230, 118, 0.35);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.sg__done-btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .sg__specs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sg__spec-col:nth-child(odd) {
    padding-left: 0;
    border-left: none;
  }

  .sg__spec-col:nth-child(even) {
    border-left: 1px solid rgba(255, 255, 255, 0.14);
  }

  .sg__compare {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .sg__specs {
    grid-template-columns: 1fr;
  }

  .sg__spec-col {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    padding-top: 0.85rem;
  }

  .sg__spec-col:first-child {
    border-top: none;
    padding-top: 0;
  }
}
</style>
