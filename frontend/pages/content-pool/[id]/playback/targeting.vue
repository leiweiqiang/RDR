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
        <AppStringSelect
          id="pbt-upscale"
          v-model="upscale"
          :options="upscaleOptions"
          placeholder="Upscaling"
          aria-label="Upscaling"
          trigger-class="pbt__select-trigger"
        />
      </section>
      <div class="pbt__connector" aria-hidden="true" />
      <section class="pbt__step pbt__step--disabled" aria-disabled="true">
        <h3 class="pbt__step-label">Step 2: Frame Interpolation</h3>
        <label class="visually-hidden" for="pbt-fps">Frame interpolation</label>
        <AppStringSelect
          id="pbt-fps"
          v-model="fps"
          :options="fpsOptions"
          placeholder="Frame interpolation"
          aria-label="Frame interpolation"
          disabled
          trigger-class="pbt__select-trigger"
        />
      </section>
    </aside>

    <div class="pbt__actions">
      <NuxtLink :to="decodeSrHref" class="pbt__btn-next">Next</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-playback-targeting',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

const decodeSrHref = computed(() => `/content-pool/${poolId.value}/playback/decode-sr`)

const scrub = ref(0)
const upscale = ref('4K')
const fps = ref('120Hz')

const upscaleOptions = ['4K', '1080p', '720p'] as const
const fpsOptions = ['120Hz', '60Hz'] as const

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

:deep(.pbt__select-trigger) {
  width: 100%;
  max-width: 12rem;
  height: auto;
  min-height: 2.25rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.45rem 0.65rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: #111;
  background: #fff;
  box-shadow: none;
  --ring: 222 47% 30%;
}

:deep(.pbt__select-trigger svg) {
  color: #333;
  opacity: 1;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
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
