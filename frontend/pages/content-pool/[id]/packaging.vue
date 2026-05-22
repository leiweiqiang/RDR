<template>
  <ContentPoolPackagingStepPanel
    :preview-image-url="previewImageUrl"
    :video="video"
    :transcoded-streams="transcodedStreams"
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

const { previewImageUrl, video, transcodedStreams, pending } = usePackaging(poolId)

useHead(() => ({
  title: video.value?.name
    ? `${video.value.name} — Packaging — RDR`
    : 'High-Speed Action — Packaging — RDR',
  meta: [
    {
      name: 'description',
      content: 'Package RDR metadata with the source video for downstream TCON processing.',
    },
  ],
}))
</script>
