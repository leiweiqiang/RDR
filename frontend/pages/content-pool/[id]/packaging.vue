<template>
  <ContentPoolPackagingStepPanel
    :preview-image-url="previewImageUrl"
    :video="video"
    :result-items="resultItems"
    :metadata-type="metadataType"
    :pool-id="poolId"
    :pending="pending"
  />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-packaging',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))

const { previewImageUrl, video, resultItems, metadataType, pending } = usePackaging(poolId)

useHead(() => ({
  title: video.value?.name
    ? `${video.value.name} — Metadata Generation and Packaging — RDR`
    : 'High-Speed Action — Metadata Generation and Packaging — RDR',
  meta: [
    {
      name: 'description',
      content: 'Generate RDR metadata and package it with the source video for downstream TCON processing.',
    },
  ],
}))
</script>
