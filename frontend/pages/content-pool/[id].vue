<template>
  <ContentPoolWorkflowLayout :pool-id="poolId">
    <NuxtPage />
  </ContentPoolWorkflowLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const poolId = computed(() => String(route.params.id))
</script>
