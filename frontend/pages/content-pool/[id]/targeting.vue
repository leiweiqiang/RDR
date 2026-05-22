<template>
  <ContentPoolTargetingFormatsPanel
    :preview-image-url="previewImageUrl"
    :original-meta="originalMeta"
    :pool-id="poolId"
  />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-targeting',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl, originalMeta, video } = useContentPoolVideo(poolId)

useHead(() => ({
  title: video.value?.name
    ? `${video.value.name} — Targeting — RDR`
    : 'High-Speed Action — Targeting — RDR',
  meta: [
    {
      name: 'description',
      content: 'Select target output formats (resolution, frame rate, bitrate) for high-speed action content.',
    },
  ],
}))
</script>
