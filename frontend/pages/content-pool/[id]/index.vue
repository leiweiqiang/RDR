<script setup lang="ts">
const route = useRoute()
const id = String(route.params.id)
await navigateTo(`/content-pool/${id}/targeting`, { replace: true })
</script>

<template>
  <span class="visually-hidden">Redirecting…</span>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
