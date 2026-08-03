<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="npd__backdrop"
      @click.self="onClose"
    >
      <div
        class="npd__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="npd-url-title"
      >
        <h2 id="npd-url-title" class="visually-hidden">New Project — URL</h2>

        <div class="npd__card">
          <div class="npd__hero">
            <div class="npd__preview">
              <video
                v-if="previewObjectUrl"
                class="npd__preview-video"
                :src="previewObjectUrl"
                muted
                playsinline
                preload="metadata"
                crossorigin="anonymous"
              />
              <img
                v-else-if="coverPreviewUrl"
                class="npd__preview-video"
                :src="coverPreviewUrl"
                alt="Cover preview"
              />
              <div v-else class="npd__preview-empty">No preview</div>
              <span class="npd__play" aria-hidden="true">▶</span>
            </div>
            <div class="npd__hero-meta">
              <p class="npd__meta-label">Filename</p>
              <p class="npd__meta-value">{{ fileName || '—' }}</p>
              <p class="npd__meta-label npd__meta-label--spaced">URL</p>
              <p class="npd__meta-value npd__meta-value--url">{{ sourceUrl || '—' }}</p>
            </div>
          </div>

          <label class="visually-hidden" for="npd-url-title-input">Title</label>
          <input
            id="npd-url-title-input"
            v-model="title"
            type="text"
            class="npd__input"
            placeholder="Title"
            autocomplete="off"
          />

          <div class="npd__row">
            <div class="npd__field">
              <span class="npd__field-label">Provider</span>
              <AppStringSelect
                v-model="provider"
                :options="providerOptions"
                placeholder="Provider"
                aria-label="Provider"
                trigger-class="npd__select-trigger"
              />
            </div>
            <div class="npd__field">
              <span class="npd__field-label">Category</span>
              <AppStringSelect
                v-model="categoryLabel"
                :options="categoryOptions"
                placeholder="Category"
                aria-label="Category"
                trigger-class="npd__select-trigger"
              />
            </div>
          </div>

          <section class="npd__section" aria-labelledby="npd-url-info-title">
            <h3 id="npd-url-info-title" class="npd__section-title">Video Information (Default)</h3>
            <div class="npd__row npd__row--3">
              <div class="npd__field">
                <span class="npd__field-label">Resolution</span>
                <AppStringSelect
                  v-model="resolutionLabel"
                  :options="resolutionSelectOptions"
                  placeholder="Resolution"
                  aria-label="Resolution"
                  trigger-class="npd__select-trigger"
                />
              </div>
              <div class="npd__field">
                <span class="npd__field-label">Bit rate</span>
                <AppStringSelect
                  v-model="bitrate"
                  :options="bitrateOptions"
                  placeholder="Bit rate"
                  aria-label="Bit rate"
                  trigger-class="npd__select-trigger"
                />
              </div>
              <div class="npd__field">
                <span class="npd__field-label">Frame</span>
                <AppStringSelect
                  v-model="fps"
                  :options="fpsOptions"
                  placeholder="Frame"
                  aria-label="Frame rate"
                  trigger-class="npd__select-trigger"
                />
              </div>
            </div>
            <p v-if="probing" class="npd__hint">Parsing video metadata…</p>
            <p v-else-if="probeError" class="npd__hint npd__hint--warn">{{ probeError }}</p>
            <div v-if="!duration" class="npd__field" style="margin-top: 0.35rem">
              <span class="npd__field-label">Duration (seconds)</span>
              <input
                v-model="durationInput"
                type="number"
                min="0.1"
                step="0.1"
                class="npd__input"
                placeholder="e.g. 120"
              />
            </div>
          </section>

          <section class="npd__section" aria-labelledby="npd-url-thumb-title">
            <h3 id="npd-url-thumb-title" class="npd__section-title">Video Thumbnail (Default)</h3>
            <div class="npd__thumbs">
              <button
                type="button"
                class="npd__thumb-btn"
                :disabled="!previewObjectUrl || submitting"
                @click="onRecaptureCover"
              >
                <img
                  v-if="coverPreviewUrl"
                  :src="coverPreviewUrl"
                  alt="Cover from video"
                  class="npd__thumb-img"
                />
                <span v-else class="npd__thumb-placeholder">Select from video</span>
              </button>
              <button
                type="button"
                class="npd__thumb-btn"
                :disabled="submitting"
                @click="coverInputRef?.click()"
              >
                <span class="npd__thumb-placeholder">Upload File</span>
              </button>
              <input
                ref="coverInputRef"
                type="file"
                class="visually-hidden"
                accept="image/*"
                @change="onCoverInputChange"
              />
            </div>
          </section>

          <p v-if="submitError" class="npd__error">{{ submitError }}</p>
          <p v-if="submitProgress" class="npd__hint">{{ submitProgress }}</p>

          <button
            type="button"
            class="npd__next"
            :disabled="!canSubmit"
            @click="onSubmit"
          >
            {{ submitting ? 'Submitting…' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { createVideoCollection } from '~/api/video-collections'
import {
  useCreateProjectDetailForm,
  type CreateProjectCategoryOption,
} from '~/composables/useCreateProjectDetailForm'
import { uploadFileWithCredentials } from '~/utils/s3Upload'
import type { VideoCollectionCreateBody } from '~/types/api/video-collection'

const props = defineProps<{
  open: boolean
  url: string
  defaultCategoryId: number
  categories: CreateProjectCategoryOption[]
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const coverInputRef = ref<HTMLInputElement | null>(null)

const form = useCreateProjectDetailForm({
  mode: 'url',
  defaultCategoryId: () => props.defaultCategoryId,
  categories: () => props.categories,
})

const {
  title,
  provider,
  categoryId,
  resolution,
  resolutionLabel,
  bitrate,
  fps,
  duration,
  durationInput,
  fileName,
  sourceUrl,
  previewObjectUrl,
  coverPreviewUrl,
  coverBlob,
  probing,
  probeError,
  submitting,
  submitError,
  submitProgress,
  resolutionSelectOptions,
  categoryOptions,
  categoryLabel,
  bitrateOptions,
  fpsOptions,
  providerOptions,
  canSubmit,
  effectiveDuration,
  resetForm,
  initFromUrl,
  captureCoverFromPreview,
  onCoverFileSelected,
} = form

watch(
  () => [props.open, props.url] as const,
  async ([isOpen, url]) => {
    if (!isOpen) {
      resetForm()
      return
    }
    if (url) await initFromUrl(url)
  },
  { immediate: true },
)

onKeyStroke('Escape', (event) => {
  if (!props.open || submitting.value) return
  event.preventDefault()
  onClose()
})

function onClose() {
  if (submitting.value) return
  resetForm()
  emit('close')
}

async function onRecaptureCover() {
  try {
    await captureCoverFromPreview()
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Failed to capture cover'
  }
}

async function onCoverInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) await onCoverFileSelected(file)
  input.value = ''
}

async function onSubmit() {
  if (!canSubmit.value || !sourceUrl.value) return
  submitting.value = true
  submitError.value = ''
  submitProgress.value = 'Preparing…'

  try {
    if (!coverBlob.value) {
      throw new Error('Cover image is required. Capture from video or upload a file.')
    }

    submitProgress.value = 'Uploading cover…'
    const coverName = `${fileName.value.replace(/\.[^.]+$/, '') || 'cover'}.jpg`
    const coverResult = await uploadFileWithCredentials(coverBlob.value, coverName, 'cover')

    submitProgress.value = 'Creating project…'
    const body: VideoCollectionCreateBody = {
      category_id: categoryId.value,
      is_third_party: true,
      name: title.value.trim(),
      cover: coverResult.publicUrl,
      provider: provider.value || 'Other',
      duration: effectiveDuration(),
      video_metadata: {
        url: sourceUrl.value,
        resolution: resolution.value,
        fps: fps.value ? Number.parseInt(fps.value, 10) : null,
        bitrate: bitrate.value ? Number.parseFloat(bitrate.value) : null,
      },
    }
    await createVideoCollection(body)
    submitProgress.value = ''
    resetForm()
    emit('success')
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Failed to create project'
    submitProgress.value = ''
  } finally {
    submitting.value = false
  }
}
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

.npd__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2rem);
  background: rgba(0, 0, 0, 0.72);
  overflow: auto;
}

.npd__panel {
  width: min(100%, 40rem);
}

.npd__card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: clamp(1rem, 2.5vw, 1.4rem);
  border-radius: 14px;
  background: #fff;
}

.npd__hero {
  display: grid;
  grid-template-columns: minmax(8rem, 11rem) minmax(0, 1fr);
  gap: 0.85rem;
  align-items: start;
}

.npd__preview {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
}

.npd__preview-video,
.npd__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.npd__preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.8rem;
}

.npd__play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #00e676;
  color: #000;
  font-size: 0.7rem;
  pointer-events: none;
}

.npd__hero-meta {
  min-width: 0;
  padding-top: 0.2rem;
}

.npd__meta-label {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
}

.npd__meta-label--spaced {
  margin-top: 0.65rem;
}

.npd__meta-value {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  word-break: break-word;
}

.npd__meta-value--url {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.npd__input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: none;
  border-radius: 8px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: #111;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  outline: none;
}

.npd__input:focus {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.28);
}

.npd__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.npd__row--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.npd__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.npd__field-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.npd__select-trigger) {
  width: 100%;
  min-height: 2.25rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.npd__section {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.npd__section-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #111;
}

.npd__thumbs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.npd__thumb-btn {
  aspect-ratio: 16 / 10;
  border: none;
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.npd__thumb-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.npd__thumb-placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
}

.npd__hint {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(0, 0, 0, 0.55);
}

.npd__hint--warn {
  color: #c62828;
}

.npd__error {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #c62828;
  text-align: center;
}

.npd__next {
  align-self: center;
  min-width: 7.5rem;
  margin-top: 0.25rem;
  padding: 0.55rem 2rem;
  border: none;
  border-radius: 999px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(0, 230, 118, 0.35);
}

.npd__next:hover:not(:disabled) {
  filter: brightness(1.06);
}

.npd__next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 640px) {
  .npd__hero,
  .npd__row,
  .npd__row--3,
  .npd__thumbs {
    grid-template-columns: 1fr;
  }
}
</style>
