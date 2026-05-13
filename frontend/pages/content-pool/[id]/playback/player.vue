<template>
  <main class="pbp">
    <div class="pbp__col">
      <p class="pbp__caption">Without RDR Metadata</p>
      <ContentPoolVideoPreviewFrame
        v-model:scrub-position="scrub"
        :image-url="previewImageUrl"
        framed
        :show-play="false"
        :show-meta-badge="false"
        show-scrubber
      />
    </div>
    <div class="pbp__col">
      <p class="pbp__caption">With RDR Metadata</p>
      <ContentPoolVideoPreviewFrame
        v-model:scrub-position="scrub"
        :image-url="previewImageUrl"
        framed
        show-meta-badge
        :show-play="false"
        show-scrubber
      />
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-playback-player',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

const scrub = ref(741)

useHead({
  title: 'High-Speed Action — Player — RDR',
  meta: [{ name: 'description', content: 'Compare playback with and without RDR metadata.' }],
})
</script>

<style scoped>
.pbp {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  align-items: start;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.pbp__col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pbp__caption {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 900px) {
  .pbp {
    grid-template-columns: 1fr;
  }
}
</style>
