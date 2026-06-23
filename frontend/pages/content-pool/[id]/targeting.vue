<template>
  <ContentPoolTargetingFormatsPanel
    :preview-image-url="previewImageUrl"
    :original-meta="originalMeta"
    :pool-id="poolId"
    :existing-stream-resolutions="transcodedStreamResolutions"
    :pending="pending"
  />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-targeting',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl, originalMeta, video, transcodedStreamResolutions, pending } = useContentPoolVideo(poolId)

useHead(() => ({
  title: video.value?.name
    ? `${video.value.name} — Targeting — RDR`
    : 'Targeting — RDR',
  meta: [
    {
      name: 'description',
      content: 'Select target output formats (resolution, frame rate, bitrate) for high-speed action content.',
    },
  ],
}))
</script>
