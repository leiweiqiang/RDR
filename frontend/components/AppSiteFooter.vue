<template>
  <footer class="app-site-footer">
    <span class="app-site-footer__copyright">{{ SITE_COPYRIGHT_TEXT }}</span>
  </footer>
</template>

<script setup lang="ts">
import { SITE_COPYRIGHT_TEXT } from '~/utils/siteCopyright'
</script>

<style scoped>
.app-site-footer {
  flex: 0 0 auto;
  margin-top: auto;
  padding-top: 1rem;
}

.app-site-footer__copyright {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.32);
  letter-spacing: 0.02em;
}
</style>
