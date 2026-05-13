<template>
  <div class="cpb-redirect" aria-hidden="true" />
</template>

<script setup lang="ts">
const route = useRoute()
await navigateTo(`/content-pool/${String(route.params.id)}/playback/targeting`, { replace: true })
</script>

<style scoped>
.cpb-redirect {
  min-height: 1px;
}
</style>
