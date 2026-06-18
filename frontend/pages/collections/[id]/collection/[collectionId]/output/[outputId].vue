<template>
  <AppWorkspaceShell>
    <div class="app-page-inner">
      <header class="cot__header">
        <div class="cot__header-brand">
          <NuxtLink to="/" class="cot__logo-link">
            <img class="cot__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="cot__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="cot__crumb">Home</NuxtLink>
            <span class="cot__crumb-sep" aria-hidden="true">&gt;</span>
            <NuxtLink :to="`/collections/${categoryId}`" class="cot__crumb">{{ categoryTitle || 'Collections' }}</NuxtLink>
            <span class="cot__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="cot__crumb cot__crumb--current">{{ displayFileName || '…' }}</span>
          </nav>
        </div>
      </header>

      <div class="cot__rule" role="presentation" />

      <div v-if="pending" class="cot__status" role="status">Loading output…</div>
      <div v-else-if="error" class="cot__status cot__status--error" role="alert">
        <p>Failed to load output.</p>
        <button type="button" class="cot__retry" @click="refresh()">Retry</button>
      </div>
      <main v-else class="cot__main">
        <div class="cot__video-col">
          <ContentPoolVideoPreviewFrame
            v-model:scrub-position="scrub"
            :image-url="previewCoverUrl"
            :stream-url="streamUrl"
            framed
            show-play
            show-scrubber
          />
          <div class="cot__actions">
            <button type="button" class="cot__btn-next" disabled>Next</button>
          </div>
        </div>

        <div class="cot__bridge" aria-hidden="true">
          <span class="cot__bridge-line" />
        </div>

        <section class="cot__step cot__step--active" aria-labelledby="cot-step-1-title">
          <p class="cot__step-index">Step 1</p>
          <h3 id="cot-step-1-title" class="cot__step-title">Upscaling</h3>
          <ul class="cot__row-list">
            <li v-for="(row, index) in upscaleRows" :key="row.id" class="cot__row">
              <span class="cot__row-check cot__row-check--on" aria-hidden="true" />
              <AppStringSelect
                v-model="row.value"
                :options="upscaleOptionsForRow(index)"
                placeholder="Resolution"
                aria-label="Upscaling resolution"
                trigger-class="cot__select-trigger cot__select-trigger--active"
              />
              <div class="cot__row-actions">
                <button
                  type="button"
                  class="cot__icon-square cot__icon-square--add"
                  aria-label="Add upscaling row"
                  :disabled="!canAddUpscaleRow"
                  @click="addUpscaleRow(index)"
                >
                  +
                </button>
                <button
                  type="button"
                  class="cot__icon-square cot__icon-square--remove"
                  aria-label="Remove upscaling row"
                  @click="removeUpscaleRow(index)"
                >
                  −
                </button>
              </div>
            </li>
          </ul>
        </section>

        <div class="cot__bridge" aria-hidden="true">
          <span class="cot__bridge-line" />
        </div>

        <section class="cot__step cot__step--disabled" aria-labelledby="cot-step-2-title" aria-disabled="true">
          <p class="cot__step-index">Step 2</p>
          <h3 id="cot-step-2-title" class="cot__step-title">Frame Interpolation</h3>
          <ul class="cot__row-list">
            <li v-for="row in fpsRows" :key="row.id" class="cot__row">
              <span class="cot__row-check" aria-hidden="true" />
              <AppStringSelect
                v-model="row.value"
                :options="fpsOptions"
                placeholder="Frame rate"
                aria-label="Frame interpolation"
                disabled
                trigger-class="cot__select-trigger cot__select-trigger--muted"
              />
              <div class="cot__row-actions">
                <button type="button" class="cot__icon-square cot__icon-square--add" aria-label="Add frame row" disabled>+</button>
                <button type="button" class="cot__icon-square cot__icon-square--remove" aria-label="Remove frame row" disabled>−</button>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <AppSiteFooter />
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import { useCollectionOutputPage } from '~/composables/useCollectionOutputPage'
import { formatCollectionFileName } from '~/composables/useVideoCollection'

type ConfigRow = {
  id: string
  value: string
}

const route = useRoute()
const categoryId = computed(() => String(route.params.id))
const collectionId = computed(() => String(route.params.collectionId))
const outputId = computed(() => String(route.params.outputId))

const {
  collection,
  categoryTitle,
  previewCoverUrl,
  streamUrl,
  pending,
  error,
  refresh,
} = useCollectionOutputPage(categoryId, collectionId, outputId)

const displayFileName = computed(() =>
  collection.value ? formatCollectionFileName(collection.value.name) : '',
)

const scrub = ref(0)

const upscaleOptions = ['4K', '2K', '1080p', '720p'] as const
const fpsOptions = ['120Hz', '60Hz'] as const

let nextRowId = 1
function makeRow(value: string): ConfigRow {
  return { id: String(nextRowId++), value }
}

const upscaleRows = ref<ConfigRow[]>([makeRow('4K'), makeRow('2K')])
const fpsRows = ref<ConfigRow[]>([
  { id: 'fps-1', value: '120Hz' },
  { id: 'fps-2', value: '60Hz' },
])

const canAddUpscaleRow = computed(() => upscaleRows.value.length < upscaleOptions.length)

function upscaleOptionsForRow(rowIndex: number): string[] {
  const usedByOthers = new Set(
    upscaleRows.value.map((row, index) => (index !== rowIndex ? row.value : '')).filter(Boolean),
  )
  return upscaleOptions.filter((option) => !usedByOthers.has(option))
}

function addUpscaleRow(index: number) {
  if (!canAddUpscaleRow.value) return
  const available = upscaleOptions.find(
    (option) => !upscaleRows.value.some((row) => row.value === option),
  )
  upscaleRows.value.splice(index + 1, 0, makeRow(available ?? '1080p'))
}

function removeUpscaleRow(index: number) {
  if (upscaleRows.value.length <= 1) return
  upscaleRows.value.splice(index, 1)
}

useHead(() => ({
  title: displayFileName.value
    ? `${displayFileName.value} — Output — RDR`
    : `${categoryTitle.value || 'Output'} — RDR`,
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

.cot__header {
  display: block;
  margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
}

.cot__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.cot__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.cot__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.cot__crumbs {
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

.cot__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.cot__crumb:hover {
  color: #fff;
}

.cot__crumb--current {
  color: #fff;
}

.cot__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.cot__rule {
  height: 1px;
  margin: 0 0 clamp(1rem, 2.5vw, 1.75rem);
  background: rgba(255, 255, 255, 0.12);
}

.cot__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.cot__status--error p {
  margin: 0;
}

.cot__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.cot__main {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) auto minmax(0, 0.9fr) auto minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(0.35rem, 1vw, 0.75rem);
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.cot__video-col {
  min-width: 0;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cot__bridge {
  display: flex;
  align-items: center;
  align-self: center;
  width: clamp(1.25rem, 3vw, 2.75rem);
  min-height: 5.5rem;
}

.cot__bridge-line {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.55);
}

.cot__actions {
  display: flex;
  justify-content: flex-end;
}

.cot__btn-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.45rem;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111;
  background: #fff;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.cot__btn-next:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.cot__step {
  min-width: 0;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.cot__step-index {
  margin: 0 0 0.2rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.cot__step-title {
  margin: 0 0 clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.95rem, 1.35vw, 1.12rem);
  font-weight: 600;
  line-height: 1.25;
  color: #fff;
  text-align: center;
}

.cot__step--disabled .cot__step-index,
.cot__step--disabled .cot__step-title {
  color: rgba(255, 255, 255, 0.42);
}

.cot__step--disabled {
  pointer-events: none;
}

.cot__row-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cot__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
}

.cot__row-check {
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 3px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: transparent;
}

.cot__row-check--on {
  border-color: #00e676;
  background: #00e676
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L20 7'/%3E%3C/svg%3E")
    center / 0.65rem no-repeat;
  box-shadow: 0 0 10px rgba(0, 230, 118, 0.35);
}

.cot__step--disabled .cot__row-check {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: none;
}

.cot__row-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.cot__icon-square {
  width: 1.65rem;
  height: 1.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0;
  font: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.cot__icon-square--add {
  color: #000;
  background: #00e676;
  border-color: rgba(0, 230, 118, 0.65);
}

.cot__icon-square--remove {
  color: #fff;
  background: #ff528a;
  border-color: rgba(255, 82, 138, 0.65);
}

.cot__step--disabled .cot__icon-square--add {
  color: rgba(0, 0, 0, 0.45);
  background: rgba(0, 230, 118, 0.28);
  border-color: rgba(0, 230, 118, 0.2);
}

.cot__step--disabled .cot__icon-square--remove {
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 82, 138, 0.28);
  border-color: rgba(255, 82, 138, 0.2);
}

.cot__icon-square:disabled {
  opacity: 1;
  cursor: not-allowed;
  filter: none;
  transform: none;
}

:deep(.cot__select-trigger) {
  width: 100%;
  min-width: 0;
  max-width: 9.5rem;
  height: auto;
  min-height: 2rem;
  border-radius: 6px;
  padding: 0.45rem 0.55rem;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  box-shadow: none;
}

:deep(.cot__select-trigger--active) {
  color: #111;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.cot__select-trigger--active svg) {
  color: #222;
  opacity: 1;
}

:deep(.cot__select-trigger--muted) {
  color: rgba(255, 255, 255, 0.42);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.cot__select-trigger--muted svg) {
  color: rgba(255, 255, 255, 0.35);
  opacity: 1;
}

@media (max-width: 1100px) {
  .cot__main {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .cot__bridge {
    display: none;
  }

  .cot__step {
    align-self: stretch;
  }
}
</style>
