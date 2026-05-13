<template>
  <ContentPoolMetadataExtractionPanel :preview-image-url="previewImageUrl" :pool-id="poolId" />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-metadata-extraction',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

useHead({
  title: 'High-Speed Action — Metadata Extraction — RDR',
  meta: [
    {
      name: 'description',
      content: 'Select AI image enhancement techniques and review RDR metadata.',
    },
  ],
})
</script>
