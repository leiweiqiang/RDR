<script setup lang="ts">
const { t, featureMeta } = useChatImageI18n()

const sections = computed(() =>
  t.value.features.sections.map((s, i) => ({ ...s, image: featureMeta[i].image, caseLabel: featureMeta[i].caseLabel })),
)
</script>

<template>
  <section id="features" class="scroll-mt-20 border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.features.badge }}</p>
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {{ t.features.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ t.features.desc }}
        </p>
      </div>

      <div class="space-y-16">
        <article
          v-for="(feature, index) in sections"
          :key="feature.title"
          class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
          :class="index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
        >
          <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img
              :src="feature.image"
              :alt="feature.title"
              class="aspect-[7/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{{ feature.tag }}</span>
            <h3 class="mt-4 text-xl font-bold text-foreground sm:text-2xl">{{ feature.title }}</h3>
            <p class="mt-2 text-lg font-medium text-foreground/80">{{ feature.subtitle }}</p>
            <p class="mt-3 text-muted-foreground">{{ feature.description }}</p>
            <p class="mt-4 text-xs text-muted-foreground">{{ feature.caseLabel }}</p>
          </div>
        </article>
      </div>

      <!-- Additional feature blocks -->
      <div class="mt-20 grid gap-8 lg:grid-cols-2">
        <article class="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{{ t.features.promptToImage.tag }}</span>
          <h3 class="mt-4 text-xl font-bold text-foreground">{{ t.features.promptToImage.title }}</h3>
          <p class="mt-2 font-medium text-foreground/80">{{ t.features.promptToImage.subtitle }}</p>
          <p class="mt-3 text-sm text-muted-foreground">
            {{ t.features.promptToImage.desc }}
          </p>
          <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
            <li v-for="bullet in t.features.promptToImage.bullets" :key="bullet" class="flex items-start gap-2">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-[hsl(var(--ci-brand))]" />
              {{ bullet }}
            </li>
          </ul>
        </article>

        <article class="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{{ t.features.referenceEditing.tag }}</span>
          <h3 class="mt-4 text-xl font-bold text-foreground">{{ t.features.referenceEditing.title }}</h3>
          <p class="mt-2 font-medium text-foreground/80">{{ t.features.referenceEditing.subtitle }}</p>
          <p class="mt-3 text-sm text-muted-foreground">
            {{ t.features.referenceEditing.desc }}
          </p>
          <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
            <li v-for="bullet in t.features.referenceEditing.bullets" :key="bullet" class="flex items-start gap-2">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-[hsl(var(--ci-brand))]" />
              {{ bullet }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
