<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const { t } = useChatImageI18n()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.faq.badge }}</p>
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {{ t.faq.title }}
        </h2>
      </div>

      <div class="divide-y divide-border rounded-2xl border border-border bg-card">
        <div
          v-for="(item, index) in t.faq.items"
          :key="item.question"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/50 sm:px-6 sm:py-5"
            @click="toggle(index)"
          >
            <span class="text-sm font-medium text-foreground sm:text-base">{{ item.question }}</span>
            <ChevronDown
              class="size-5 shrink-0 text-muted-foreground transition-transform"
              :class="openIndex === index ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-show="openIndex === index"
            class="px-5 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-5"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
