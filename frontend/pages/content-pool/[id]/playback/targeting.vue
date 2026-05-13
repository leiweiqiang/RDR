<template>
  <main class="pbt">
    <div class="pbt__left">
      <ContentPoolVideoPreviewFrame
        v-model:scrub-position="scrub"
        :image-url="previewImageUrl"
        framed
        :show-play="false"
        show-scrubber
      />
    </div>

    <aside class="pbt__aside" aria-labelledby="pbt-aside-title">
      <h2 id="pbt-aside-title" class="visually-hidden">Output steps</h2>
      <section class="pbt__step">
        <h3 class="pbt__step-label">Step 1: Upscaling</h3>
        <label class="visually-hidden" for="pbt-upscale">Upscaling</label>
        <select id="pbt-upscale" v-model="upscale" class="pbt__select">
          <option value="4K">4K</option>
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
        </select>
      </section>
      <div class="pbt__connector" aria-hidden="true" />
      <section class="pbt__step pbt__step--disabled" aria-disabled="true">
        <h3 class="pbt__step-label">Step 2: Frame Interpolation</h3>
        <label class="visually-hidden" for="pbt-fps">Frame interpolation</label>
        <select id="pbt-fps" v-model="fps" class="pbt__select" disabled>
          <option value="120Hz">120Hz</option>
          <option value="60Hz">60Hz</option>
        </select>
      </section>
    </aside>

    <div class="pbt__actions">
      <button type="button" class="pbt__btn-next" @click="goNext">Next</button>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-playback-targeting',
})

const route = useRoute()
const router = useRouter()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

const scrub = ref(741)
const upscale = ref('4K')
const fps = ref('120Hz')

function goNext() {
  router.push(`/content-pool/${poolId.value}/playback/decode-sr`)
}

useHead({
  title: 'High-Speed Action — Targeting — RDR',
  meta: [{ name: 'description', content: 'Configure upscaling and frame interpolation for packaged playback.' }],
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

.pbt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: clamp(0.75rem, 2vw, 1.25rem);
  align-items: start;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.pbt__left {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}

.pbt__aside {
  grid-column: 2;
  grid-row: 1;
  border-radius: 12px;
  padding: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(22, 22, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}

.pbt__step {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.pbt__step--disabled {
  opacity: 0.45;
  pointer-events: none;
}

.pbt__step-label {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
}

.pbt__select {
  width: 100%;
  max-width: 12rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.45rem 2rem 0.45rem 0.65rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: #111;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
    no-repeat right 0.55rem center;
  appearance: none;
  cursor: pointer;
}

.pbt__connector {
  height: 1px;
  margin: 0.85rem 0;
  background: rgba(255, 255, 255, 0.1);
}

.pbt__actions {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  justify-content: flex-start;
}

.pbt__btn-next {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.45rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111;
  background: #fff;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pbt__btn-next:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .pbt {
    grid-template-columns: 1fr;
  }

  .pbt__aside {
    grid-column: 1;
    grid-row: auto;
  }

  .pbt__actions {
    grid-column: 1;
  }
}
</style>
