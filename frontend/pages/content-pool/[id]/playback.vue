<template>
  <ContentPoolPlaybackWorkflowLayout :pool-id="poolId">
    <NuxtPage />
  </ContentPoolPlaybackWorkflowLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const poolId = computed(() => String(route.params.id))
</script>
