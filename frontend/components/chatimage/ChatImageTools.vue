<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { t, toolMeta } = useChatImageI18n()

const tools = computed(() => t.value.tools.items.map((item, i) => ({ ...item, image: toolMeta[i].image, slug: toolMeta[i].slug })))
</script>

<template>
  <section id="tools" class="scroll-mt-20 border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.tools.badge }}</p>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {{ t.tools.title }}
          </h2>
          <p class="mt-3 max-w-2xl text-muted-foreground">
            {{ t.tools.desc }}
          </p>
        </div>
        <button type="button" class="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--ci-brand))] hover:underline">
          {{ t.tools.viewMore }}
          <ArrowRight class="size-4" />
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <article
          v-for="tool in tools"
          :key="tool.slug"
          class="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
        >
          <div class="aspect-[4/3] overflow-hidden bg-secondary">
            <img
              :src="tool.image"
              :alt="tool.title"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="flex flex-1 flex-col p-4">
            <h3 class="text-sm font-semibold text-foreground">{{ tool.title }}</h3>
            <p class="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{{ tool.description }}</p>
            <button
              type="button"
              class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--ci-brand))] hover:underline"
            >
              {{ t.tools.openTool }}
              <ArrowRight class="size-3" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
