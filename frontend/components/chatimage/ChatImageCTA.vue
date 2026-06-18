<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

const { t } = useChatImageI18n()
</script>

<template>
  <section class="border-b border-border/60 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--ci-brand))] to-violet-700 px-6 py-12 text-center sm:px-12 sm:py-16">
        <div class="relative z-10 mx-auto max-w-2xl">
          <p class="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">{{ t.cta.badge }}</p>
          <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {{ t.cta.title }}
          </h2>
          <p class="mt-3 text-white/80">
            {{ t.cta.desc }}
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#generator"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--ci-brand))] transition-opacity hover:opacity-90"
            >
              <Sparkles class="size-4" />
              {{ t.cta.open }}
            </a>
            <a
              href="#pricing"
              class="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {{ t.cta.pricing }}
            </a>
          </div>
        </div>
        <!-- Decorative blobs -->
        <div class="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  </section>
</template>
