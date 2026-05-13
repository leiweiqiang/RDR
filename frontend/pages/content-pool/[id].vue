<template>
  <ContentPoolWorkflowLayout v-if="!isPlaybackRoute" :pool-id="poolId">
    <NuxtPage />
  </ContentPoolWorkflowLayout>
  <NuxtPage v-else />
</template>

<script setup lang="ts">
const route = useRoute()
const poolId = computed(() => String(route.params.id))
const isPlaybackRoute = computed(() => /\/playback(\/|$)/.test(route.path))
</script>
