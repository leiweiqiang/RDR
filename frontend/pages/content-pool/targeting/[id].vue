<script setup lang="ts">
const route = useRoute()
const id = String(route.params.id)
await navigateTo(`/content-pool/${id}/targeting`, { replace: true })
</script>

<template>
  <span />
</template>
