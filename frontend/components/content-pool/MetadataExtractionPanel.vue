<template>
  <main class="meta__main">
    <div class="meta__left">
      <ContentPoolVideoPreviewFrame
        :image-url="previewImageUrl"
        framed
        show-meta-badge
        show-scrubber
        v-model:scrub-position="scrubPosition"
      />
      <div class="meta__checks" role="group" aria-label="AI enhancement options">
        <label class="meta__check">
          <input v-model="opts.canny" type="checkbox" class="meta__check-input" />
          <span class="meta__check-ui" :class="{ 'meta__check-ui--on': opts.canny }" aria-hidden="true" />
          <span>Canny Edge Extraction</span>
        </label>
        <label class="meta__check">
          <input v-model="opts.spatial" type="checkbox" class="meta__check-input" />
          <span class="meta__check-ui" :class="{ 'meta__check-ui--on': opts.spatial }" aria-hidden="true" />
          <span>Spatial Depth</span>
        </label>
        <label class="meta__check">
          <input v-model="opts.skeleton" type="checkbox" class="meta__check-input" />
          <span class="meta__check-ui" :class="{ 'meta__check-ui--on': opts.skeleton }" aria-hidden="true" />
          <span>Skeleton Keypoints</span>
        </label>
      </div>
      <div class="meta__actions">
        <button type="button" class="meta__btn-generate">Generate RDR Metadata</button>
        <button type="button" class="meta__btn-next" @click="goNext">Next</button>
      </div>
    </div>

    <aside class="meta__right" aria-labelledby="meta-reviewer-title">
      <div class="meta__panel-head">
        <h2 id="meta-reviewer-title" class="meta__panel-title">Metadata Result Reviewer</h2>
        <button type="button" class="meta__icon-edit" aria-label="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4L16.5 3.5z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <details class="meta__acc" open>
        <summary class="meta__acc-sum">
          <span class="meta__tri" aria-hidden="true" />
          720 X 405, 120 fps, 100Mbps
        </summary>
        <div class="meta__acc-body">
          <figure class="meta__thumb-block">
            <img :src="cannyImageUrl" alt="" class="meta__thumb-img meta__thumb-img--canny" />
            <figcaption class="meta__thumb-cap">Canny Edge Extraction</figcaption>
          </figure>
          <figure class="meta__thumb-block">
            <img :src="depthImageUrl" alt="" class="meta__thumb-img meta__thumb-img--depth" />
            <figcaption class="meta__thumb-cap">Spatial Depth</figcaption>
          </figure>
        </div>
      </details>
      <details class="meta__acc">
        <summary class="meta__acc-sum">
          <span class="meta__tri meta__tri--closed" aria-hidden="true" />
          1920 X 1080, 30 fps, 30Mbps
        </summary>
        <div class="meta__acc-body" />
      </details>
      <details class="meta__acc">
        <summary class="meta__acc-sum">
          <span class="meta__tri meta__tri--closed" aria-hidden="true" />
          360 X 203, 10 fps, 2Mbps
        </summary>
        <div class="meta__acc-body" />
      </details>
    </aside>
  </main>
</template>

<script setup lang="ts">
import cannyImageUrl from '~/assets/canny.png?url'
import depthImageUrl from '~/assets/depth.png?url'

const props = defineProps<{
  previewImageUrl: string
  poolId: string
}>()

const router = useRouter()

const scrubPosition = ref(741)

const opts = reactive({
  canny: true,
  spatial: false,
  skeleton: false,
})

function goNext() {
  router.push(`/content-pool/${props.poolId}/packaging`)
}
</script>

<style scoped>
.meta__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  align-items: start;
  flex: 1;
  min-height: 0;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.meta__left {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.meta__checks {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.meta__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.78rem, 1.1vw, 0.9rem);
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
}

.meta__check-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.meta__check-ui {
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 3px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  background: transparent;
}

.meta__check-ui--on {
  border-color: #00e676;
  background: #00e676
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L20 7'/%3E%3C/svg%3E")
    center / 0.65rem no-repeat;
}

.meta__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta__btn-generate {
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

.meta__btn-generate:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.meta__btn-next {
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

.meta__btn-next:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.meta__right {
  min-width: 0;
  border-radius: 12px;
  padding: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(22, 22, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.meta__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.meta__panel-title {
  margin: 0;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  font-weight: 700;
  color: #fff;
}

.meta__icon-edit {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  padding: 0;
  color: #fff;
  background: transparent;
  cursor: pointer;
  opacity: 0.85;
}

.meta__icon-edit:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.06);
}

.meta__icon-edit svg {
  width: 1.1rem;
  height: 1.1rem;
}

.meta__acc {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0;
}

.meta__acc:last-of-type {
  border-bottom: none;
}

.meta__acc-sum {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: clamp(0.78rem, 1.05vw, 0.9rem);
  font-weight: 600;
  color: #fff;
  padding: 0.35rem 0;
}

.meta__acc-sum::-webkit-details-marker {
  display: none;
}

.meta__tri {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #00e676;
  flex-shrink: 0;
  margin-top: 2px;
}

.meta__tri--closed {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid rgba(255, 255, 255, 0.75);
  border-right: none;
}

.meta__acc-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  padding: 0.5rem 0 0.65rem 1.35rem;
}

.meta__thumb-block {
  margin: 0;
  min-width: 0;
}

.meta__thumb-img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  background: #111;
}

.meta__thumb-img--canny,
.meta__thumb-img--depth {
  object-fit: contain;
}

.meta__thumb-cap {
  margin: 0.35rem 0 0;
  font-size: 0.65rem;
  font-weight: 600;
  color: #b8b8b8;
}

@media (max-width: 900px) {
  .meta__main {
    grid-template-columns: 1fr;
  }

  .meta__acc-body {
    grid-template-columns: 1fr;
  }
}
</style>
