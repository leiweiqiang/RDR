<script setup lang="ts">
const { t } = useChatImageI18n()
</script>

<template>
  <section class="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.useCases.badge }}</p>
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {{ t.useCases.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ t.useCases.desc }}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="useCase in t.useCases.items"
          :key="useCase.title"
          class="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <p class="text-xs font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ useCase.title }}</p>
          <h3 class="mt-2 text-base font-semibold text-foreground">{{ useCase.heading }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{{ useCase.description }}</p>
          <p class="mt-3 text-xs text-muted-foreground">
            <span class="font-medium text-foreground">{{ t.useCases.examplesLabel }}</span> {{ useCase.examples }}
          </p>
        </article>
      </div>

      <!-- Audience use cases -->
      <div class="mt-20">
        <div class="mx-auto mb-10 max-w-2xl text-center">
          <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.useCases.audienceBadge }}</p>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {{ t.useCases.audienceTitle }}
          </h2>
          <p class="mt-3 text-muted-foreground">
            {{ t.useCases.audienceDesc }}
          </p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="audience in t.useCases.audiences"
            :key="audience.title"
            class="rounded-2xl border border-border bg-card p-6"
          >
            <h3 class="text-base font-semibold text-foreground">{{ audience.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{{ audience.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
