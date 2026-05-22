<template>
  <ContentPoolMetadataExtractionPanel
    :preview-image-url="previewImageUrl"
    :canny-cover-url="cannyCoverUrl"
    :transcoded-streams="transcodedStreams"
    :pool-id="poolId"
    :pending="pending"
    :generating="generating"
    @generate="onGenerate"
  />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-metadata-extraction',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))

const {
  previewImageUrl,
  cannyCoverUrl,
  transcodedStreams,
  pending,
  generating,
  video,
  generateMetadata,
} = useMetadataExtraction(poolId)

async function onGenerate(includeCanny: boolean) {
  await generateMetadata(includeCanny)
}

useHead(() => ({
  title: video.value?.name
    ? `${video.value.name} — Metadata Extraction — RDR`
    : 'High-Speed Action — Metadata Extraction — RDR',
  meta: [
    {
      name: 'description',
      content: 'Select AI image enhancement techniques and review RDR metadata.',
    },
  ],
}))
</script>
