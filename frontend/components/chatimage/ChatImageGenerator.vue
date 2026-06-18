<script setup lang="ts">
import { ChevronLeft, ChevronRight, Expand, ImagePlus, Sparkles, Upload } from 'lucide-vue-next'

const { t, aspectRatios, carouselImages } = useChatImageI18n()

const mode = ref<'text' | 'image'>('text')
const prompt = ref('')
const resolution = ref('1k')
const qualityIndex = ref(1)
const selectedRatio = ref('1:1')
const activeSlide = ref(0)
const credits = ref(3)

const slides = computed(() =>
  t.value.generator.carousel.map((item, i) => ({ ...item, image: carouselImages[i] })),
)
const activeExample = computed(() => slides.value[activeSlide.value])

function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + slides.value.length) % slides.value.length
}

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % slides.value.length
}

function selectSlide(index: number) {
  activeSlide.value = index
}
</script>

<template>
  <section id="generator" class="scroll-mt-20 border-b border-border/60 bg-gradient-to-b from-secondary/40 to-background py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-10 max-w-3xl text-center">
        <p class="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">
          {{ t.generator.badge }}
        </p>
        <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {{ t.generator.title }}
        </h1>
        <p class="mt-4 text-base text-muted-foreground sm:text-lg">
          {{ t.generator.subtitle1 }}
        </p>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ t.generator.subtitle2 }}
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <!-- Controls panel -->
        <div class="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <!-- Mode tabs -->
          <div class="mb-6 flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              :class="mode === 'text' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              @click="mode = 'text'"
            >
              <Sparkles class="size-4" />
              {{ t.generator.textToImage }}
            </button>
            <button
              type="button"
              class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              :class="mode === 'image' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              @click="mode = 'image'"
            >
              <ImagePlus class="size-4" />
              {{ t.generator.imageToImage }}
            </button>
          </div>

          <!-- Upload area (image mode) -->
          <div
            v-if="mode === 'image'"
            class="mb-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/50 px-4 py-8 transition-colors hover:border-[hsl(var(--ci-brand))]/40 hover:bg-secondary"
          >
            <Upload class="mb-2 size-8 text-muted-foreground" />
            <p class="text-sm font-medium text-foreground">{{ t.generator.uploadTitle }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ t.generator.uploadHint }}</p>
          </div>

          <!-- Model -->
          <div class="mb-5">
            <label class="mb-2 block text-sm font-medium text-foreground">{{ t.generator.imageModel }}</label>
            <div class="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">RDR</span>
                  <span class="rounded-full bg-[hsl(var(--ci-brand))]/10 px-2 py-0.5 text-xs font-medium text-[hsl(var(--ci-brand))]">{{ t.generator.recommended }}</span>
                </div>
                <p class="mt-0.5 text-xs text-muted-foreground">{{ t.generator.modelDesc }}</p>
              </div>
              <span class="text-xs text-muted-foreground">{{ t.generator.credits3 }}</span>
            </div>
          </div>

          <!-- Prompt -->
          <div class="mb-5">
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-foreground">{{ t.generator.promptLabel }}</label>
              <span class="text-xs text-muted-foreground">{{ prompt.length }}/5000</span>
            </div>
            <textarea
              v-model="prompt"
              rows="4"
              maxlength="5000"
              :placeholder="t.generator.promptPlaceholder"
              class="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ci-brand))]/30"
            />
          </div>

          <!-- Resolution -->
          <div class="mb-5">
            <label class="mb-2 block text-sm font-medium text-foreground">{{ t.generator.resolution }}</label>
            <div class="flex gap-2">
              <button
                v-for="res in ['1k', '2k']"
                :key="res"
                type="button"
                class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                :class="resolution === res ? 'border-[hsl(var(--ci-brand))] bg-[hsl(var(--ci-brand))]/5 text-[hsl(var(--ci-brand))]' : 'border-border text-muted-foreground hover:border-foreground/20'"
                @click="resolution = res"
              >
                {{ res }}
              </button>
            </div>
          </div>

          <!-- Quality -->
          <div class="mb-5">
            <label class="mb-2 block text-sm font-medium text-foreground">{{ t.generator.quality }}</label>
            <div class="flex gap-2">
              <button
                v-for="(q, i) in t.generator.qualities"
                :key="q"
                type="button"
                class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                :class="qualityIndex === i ? 'border-[hsl(var(--ci-brand))] bg-[hsl(var(--ci-brand))]/5 text-[hsl(var(--ci-brand))]' : 'border-border text-muted-foreground hover:border-foreground/20'"
                @click="qualityIndex = i"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <!-- Aspect ratio -->
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-foreground">{{ t.generator.aspectRatio }}</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="ratio in aspectRatios"
                :key="ratio"
                type="button"
                class="rounded-lg border px-2 py-2 text-xs font-medium transition-colors"
                :class="selectedRatio === ratio ? 'border-[hsl(var(--ci-brand))] bg-[hsl(var(--ci-brand))]/5 text-[hsl(var(--ci-brand))]' : 'border-border text-muted-foreground hover:border-foreground/20'"
                @click="selectedRatio = ratio"
              >
                {{ ratio }}
              </button>
            </div>
          </div>

          <!-- Generate button -->
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--ci-brand))] px-4 py-3.5 text-sm font-semibold text-[hsl(var(--ci-brand-foreground))] transition-opacity hover:opacity-90"
          >
            <Sparkles class="size-4" />
            {{ t.generator.generateBtn }}
            <span class="ml-1 rounded-md bg-white/20 px-2 py-0.5 text-xs">{{ t.generator.credits3 }}</span>
          </button>
          <p class="mt-3 text-center text-xs text-muted-foreground">{{ t.generator.creditsLeft(credits) }}</p>
        </div>

        <!-- Preview panel -->
        <div class="flex flex-col gap-4">
          <div class="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div class="relative aspect-[4/3] bg-secondary">
              <img
                :src="activeExample.image"
                :alt="activeExample.title"
                class="size-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                class="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <Expand class="size-3.5" />
                {{ t.generator.openPreview }}
              </button>
              <button
                type="button"
                class="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Previous"
                @click="prevSlide"
              >
                <ChevronLeft class="size-5" />
              </button>
              <button
                type="button"
                class="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Next"
                @click="nextSlide"
              >
                <ChevronRight class="size-5" />
              </button>
            </div>
            <div class="p-5">
              <div class="mb-2 flex items-center gap-2">
                <span class="text-sm font-semibold text-foreground">{{ activeExample.title }}</span>
                <span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{{ activeExample.category }}</span>
              </div>
              <p class="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ t.generator.promptWord }}</p>
              <p class="text-sm text-muted-foreground">{{ activeExample.prompt }}</p>
            </div>
          </div>

          <p class="text-center text-xs text-muted-foreground">
            {{ t.generator.watermarkNote }}
          </p>

          <!-- Thumbnail carousel -->
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(example, index) in slides"
              :key="index"
              type="button"
              class="relative shrink-0 overflow-hidden rounded-lg border-2 transition-all"
              :class="activeSlide === index ? 'border-[hsl(var(--ci-brand))] ring-2 ring-[hsl(var(--ci-brand))]/20' : 'border-transparent opacity-70 hover:opacity-100'"
              @click="selectSlide(index)"
            >
              <img
                :src="example.image"
                :alt="example.title"
                class="size-14 object-cover sm:size-16"
                loading="lazy"
              />
              <span class="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[10px] font-medium text-white">
                {{ index + 1 }}
              </span>
            </button>
          </div>

          <!-- Recent generations -->
          <div class="rounded-2xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground">{{ t.generator.recentTitle }}</h3>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ t.generator.recentDesc }}
            </p>
            <div class="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/30 py-10">
              <span class="mb-2 flex size-10 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-muted-foreground">0</span>
              <p class="text-sm text-muted-foreground">{{ t.generator.recentEmpty }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
