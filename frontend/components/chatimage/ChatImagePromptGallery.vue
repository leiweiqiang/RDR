<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { t, promptExampleMeta } = useChatImageI18n()

const examples = computed(() =>
  t.value.prompts.items.map((item, i) => ({
    ...item,
    id: promptExampleMeta[i].id,
    curator: promptExampleMeta[i].curator,
    image: promptExampleMeta[i].image,
  })),
)

const expandedIndex = ref<number | null>(null)

function toggle(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index
}
</script>

<template>
  <section id="prompts" class="scroll-mt-20 border-b border-border/60 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {{ t.prompts.title }}
          </h2>
          <p class="mt-3 max-w-2xl text-muted-foreground">
            {{ t.prompts.desc }}
          </p>
        </div>
        <button type="button" class="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--ci-brand))] hover:underline">
          {{ t.prompts.viewAll }}
          <ArrowRight class="size-4" />
        </button>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article
          v-for="(example, index) in examples"
          :key="index"
          class="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
        >
          <div class="aspect-[3/4] overflow-hidden bg-secondary">
            <img
              :src="example.image"
              :alt="example.title"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-4">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{{ t.prompts.caseLabel }} {{ example.id }}</span>
              <span class="rounded-full bg-[hsl(var(--ci-brand))]/10 px-2 py-0.5 text-xs text-[hsl(var(--ci-brand))]">{{ example.category }}</span>
            </div>
            <h3 class="text-sm font-semibold text-foreground">{{ example.title }}</h3>
            <p class="mt-1 text-xs text-muted-foreground">{{ t.prompts.curatedFrom }} {{ example.curator }}</p>
            <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
              <span class="font-medium text-foreground">{{ t.prompts.promptSample }}</span>
              {{ example.prompt }}
            </p>
            <button
              type="button"
              class="mt-3 text-xs font-medium text-[hsl(var(--ci-brand))] hover:underline"
              @click="toggle(index)"
            >
              {{ expandedIndex === index ? t.prompts.hidePrompt : t.prompts.viewFull }}
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
