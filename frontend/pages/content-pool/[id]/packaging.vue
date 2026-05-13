<template>
  <ContentPoolPackagingStepPanel :preview-image-url="previewImageUrl" :pool-id="poolId" />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-packaging',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))
const { previewImageUrl } = useContentPoolPreview(poolId)

useHead({
  title: 'High-Speed Action — Packaging — RDR',
  meta: [
    {
      name: 'description',
      content: 'Package RDR metadata with the source video for downstream TCON processing.',
    },
  ],
})
</script>
