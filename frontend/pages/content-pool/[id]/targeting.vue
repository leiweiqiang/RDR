<template>
  <ContentPoolTargetingFormatsPanel :preview-image-url="previewImageUrl" :pool-id="poolId" />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-targeting',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

useHead({
  title: 'High-Speed Action — Targeting — RDR',
  meta: [
    {
      name: 'description',
      content: 'Select target output formats (resolution, frame rate, bitrate) for high-speed action content.',
    },
  ],
})
</script>
