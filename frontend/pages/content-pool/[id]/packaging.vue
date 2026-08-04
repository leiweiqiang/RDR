<template>
  <ContentPoolPackagingStepPanel
    :preview-image-url="previewImageUrl"
    :video="video"
    :result-items="resultItems"
    :metadata-type="metadataType"
    :pool-id="poolId"
    :pending="pending"
    :packaging-pending="packagingPending"
    :packaging-notice="packagingNotice"
    @run-packaging="runPackaging"
    @close-packaging-notice="onClosePackagingNotice"
  />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-packaging',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))

const {
  previewImageUrl,
  video,
  categoryId,
  collectionId,
  resultItems,
  metadataType,
  pending,
  packagingPending,
  packagingNotice,
  runPackaging,
  closePackagingNotice,
} = usePackaging(poolId)

function onClosePackagingNotice() {
  const wasSuccess = packagingNotice.value.success
  closePackagingNotice()
  if (!wasSuccess) return

  // Return to the collection processing page (Streaming Generation list).
  if (categoryId.value != null && collectionId.value != null) {
    void navigateTo(`/categories/${categoryId.value}/collection/${collectionId.value}`)
    return
  }
  void navigateTo(categoryId.value != null ? `/categories/${categoryId.value}` : '/categories/1')
}

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
