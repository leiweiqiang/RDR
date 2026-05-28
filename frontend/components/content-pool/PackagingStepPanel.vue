<template>
  <main class="pkg__main">
    <div v-if="pending" class="pkg__status" role="status">Loading packaging…</div>
    <template v-else>
      <div class="pkg__left">
        <ContentPoolVideoPreviewFrame
          :image-url="previewImageUrl"
          framed
          show-meta-badge
          :show-play="false"
          :show-scrubber="false"
        />
        <div class="pkg__radios" role="radiogroup" aria-label="Metadata placement">
          <label class="pkg__radio">
            <input v-model="placement" class="pkg__radio-input" type="radio" value="manifest" />
            <span class="pkg__radio-dot" :class="{ 'pkg__radio-dot--on': placement === 'manifest' }" aria-hidden="true" />
            <span>Metadata in Manifest</span>
          </label>
          <label class="pkg__radio pkg__radio--disabled">
            <input class="pkg__radio-input" type="radio" value="video" disabled />
            <span class="pkg__radio-dot" aria-hidden="true" />
            <span>Metadata in Video</span>
          </label>
        </div>
        <div class="pkg__actions">
          <button
            type="button"
            class="pkg__btn-primary"
            :disabled="packagingPending"
            @click="emit('run-packaging')"
          >
            {{ packagingPending ? 'Packaging…' : 'Metadata Generation and Packaging' }}
          </button>
          <NuxtLink to="/high-speed-action" class="pkg__btn-next">Next</NuxtLink>
        </div>
      </div>

      <aside class="pkg__spec" aria-labelledby="pkg-spec-title">
        <h2 id="pkg-spec-title" class="visually-hidden">Output specifications</h2>
        <section v-if="video" class="pkg__block">
          <h3 class="pkg__block-title">Original</h3>
          <dl class="pkg__dl">
            <div class="pkg__row">
              <dt>Resolution</dt>
              <dd>{{ video.resolution }}</dd>
            </div>
            <div class="pkg__row">
              <dt>Bitrate</dt>
              <dd>
                <span class="pkg__val">{{ formatBitrate(video.bitrate) }}</span>
              </dd>
            </div>
            <div class="pkg__row">
              <dt>Frame Rate</dt>
              <dd>
                <span class="pkg__val">{{ formatFrameRate(video.fps) }}</span>
              </dd>
            </div>
            <div class="pkg__row">
              <dt>Metadata Type</dt>
              <dd>
                <span class="pkg__val">{{ metadataType }}</span>
              </dd>
            </div>
          </dl>
        </section>
        <section
          v-for="item in resultItems"
          :key="item.resolutionLabel"
          class="pkg__block"
        >
          <h3 class="pkg__block-title">
            Low Resolution Streaming ({{ item.resolutionDisplay }})
          </h3>
          <dl class="pkg__dl">
            <div class="pkg__row">
              <dt>Bitrate</dt>
              <dd>
                <span class="pkg__val">{{ formatBitrate(item.bitrate) }}</span>
              </dd>
            </div>
            <div class="pkg__row">
              <dt>Frame Rate</dt>
              <dd>
                <span class="pkg__val">{{ formatFrameRate(item.fps) }}</span>
              </dd>
            </div>
            <div class="pkg__row">
              <dt>Metadata Type</dt>
              <dd>
                <span class="pkg__val">{{ metadataType }}</span>
              </dd>
            </div>
          </dl>
        </section>
        <p v-if="video && resultItems.length === 0" class="pkg__empty">
          No target resolutions selected. Configure targets on the Targeting step first.
        </p>
      </aside>
    </template>

    <div
      v-if="packagingNotice.open"
      class="pkg__dialog-backdrop"
      @click.self="emit('close-packaging-notice')"
    >
      <div
        class="pkg__dialog"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="dialogTitleId"
        :aria-describedby="dialogMessageId"
      >
        <h3 :id="dialogTitleId" class="pkg__dialog-title">{{ packagingNotice.title }}</h3>
        <p :id="dialogMessageId" class="pkg__dialog-message">{{ packagingNotice.message }}</p>
        <button
          type="button"
          class="pkg__dialog-btn"
          :class="{ 'pkg__dialog-btn--error': !packagingNotice.success }"
          @click="emit('close-packaging-notice')"
        >
          OK
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PackagingResultItem } from '~/composables/usePackaging'
import type { PackagingNotice } from '~/utils/packagingTranscode'
import type { RawVideoListItem } from '~/types/api/video'

defineProps<{
  previewImageUrl: string
  video: RawVideoListItem | null
  resultItems: PackagingResultItem[]
  metadataType: string
  poolId: string
  pending?: boolean
  packagingPending?: boolean
  packagingNotice: PackagingNotice
}>()

const emit = defineEmits<{
  'run-packaging': []
  'close-packaging-notice': []
}>()

const dialogTitleId = 'pkg-dialog-title'
const dialogMessageId = 'pkg-dialog-message'

const placement = ref<'manifest' | 'video'>('manifest')

function formatBitrate(bitrate: number | null | undefined): string {
  if (bitrate == null) return '—'
  return `${bitrate} Mbps`
}

function formatFrameRate(fps: number | null | undefined): string {
  if (fps == null) return '—'
  return `${fps}Hz`
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

.pkg__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(0.75rem, 2vw, 1.25rem);
  align-items: start;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.pkg__status {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.pkg__left {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.pkg__spec {
  min-width: 0;
  border-radius: 12px;
  padding: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(22, 22, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}

.pkg__block + .pkg__block {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.pkg__block-title {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  text-transform: none;
}

.pkg__empty {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}

.pkg__dl {
  margin: 0;
}

.pkg__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  font-size: 0.78rem;
  padding: 0.2rem 0;
}

.pkg__row dt {
  margin: 0;
  color: #9a9a9a;
  font-weight: 600;
}

.pkg__row dd {
  margin: 0;
  font-weight: 700;
  color: #fff;
}

.pkg__val {
  color: #00e676;
}

.pkg__radios {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pkg__radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.78rem, 1.05vw, 0.88rem);
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
}

.pkg__radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pkg__radio-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.pkg__radio-dot--on {
  background: #00e676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.55);
}

.pkg__radio--disabled {
  color: rgba(255, 255, 255, 0.35);
  cursor: not-allowed;
}

.pkg__radio--disabled .pkg__radio-dot {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.pkg__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pkg__btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.5rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0, 230, 118, 0.35);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pkg__btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.pkg__btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: none;
  transform: none;
  box-shadow: none;
}

.pkg__dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.62);
}

.pkg__dialog {
  width: min(100%, 24rem);
  border-radius: 12px;
  padding: 1.15rem 1.2rem 1rem;
  background: rgba(22, 22, 26, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
}

.pkg__dialog-title {
  margin: 0 0 0.55rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.pkg__dialog-message {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.78);
  white-space: pre-line;
}

.pkg__dialog-btn {
  margin-top: 1rem;
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  color: #000;
  background: #00e676;
  cursor: pointer;
}

.pkg__dialog-btn--error {
  background: #ff5252;
  color: #fff;
}

.pkg__btn-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.35rem;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(0, 230, 118, 0.35);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pkg__btn-next:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .pkg__main {
    grid-template-columns: 1fr;
  }
}
</style>
