<template>
  <div
    class="page-transition-root"
    :style="{ '--rdr-page-bg-image': `url(${JSON.stringify(appBackgroundImageUrl)})` }"
  >
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import appBackgroundImageUrl from '~/assets/background-image.png?url'
</script>

<style>
html,
body {
  margin: 0;
  min-height: 100%;
  background-color: #000;
}

.page-transition-root {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #000;
  background-image: var(--rdr-page-bg-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
