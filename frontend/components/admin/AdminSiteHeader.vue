<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

defineEmits<{
  menu: []
}>()
</script>

<template>
  <header
    class="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-4 md:h-14"
  >
    <button
      type="button"
      class="inline-flex size-9 items-center justify-center rounded-md hover:bg-secondary md:hidden"
      aria-label="Open menu"
      @click="$emit('menu')"
    >
      <Menu class="size-5" />
    </button>
    <div class="h-4 w-px bg-border md:hidden" />
    <nav class="flex items-center gap-1 text-sm text-muted-foreground">
      <span class="hidden sm:inline">Building Your Application</span>
      <span class="hidden sm:inline text-muted-foreground/60">/</span>
      <span class="font-medium text-foreground">Documents</span>
    </nav>
  </header>
</template>
