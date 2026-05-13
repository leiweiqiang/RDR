<template>
  <div class="page-transition-root">
    <NuxtPage />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  background-color: #000;
}

.page-transition-root {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #000;
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
