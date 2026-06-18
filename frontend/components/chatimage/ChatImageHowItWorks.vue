<script setup lang="ts">
const { t } = useChatImageI18n()
</script>

<template>
  <section class="border-b border-border/60 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.howItWorks.badge }}</p>
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {{ t.howItWorks.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ t.howItWorks.desc }}
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="(step, index) in t.howItWorks.steps"
          :key="index"
          class="relative rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <span class="inline-flex rounded-xl bg-[hsl(var(--ci-brand))]/10 px-3 py-1.5 text-sm font-bold text-[hsl(var(--ci-brand))]">
            {{ t.howItWorks.stepWord }} {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-4 text-lg font-semibold text-foreground">{{ step.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ step.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
