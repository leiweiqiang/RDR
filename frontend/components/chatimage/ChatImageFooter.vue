<script setup lang="ts">
import ChatImageLogo from '@/components/chatimage/ChatImageLogo.vue'

const { t } = useChatImageI18n()

const productHrefs = ['#home', '#generator', '#pricing']
const resourceHrefs = ['#features', '#', '#']
const hotHrefs = ['#prompts', '#tools', '#features']
</script>

<template>
  <footer class="border-t border-border/60 bg-secondary/30 py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <a href="#home" class="flex items-center text-foreground" aria-label="RDR">
            <ChatImageLogo class="h-5 w-auto" />
          </a>
          <p class="mt-4 max-w-xs text-sm text-muted-foreground">
            {{ t.footer.desc }}
          </p>
          <div class="mt-4 flex gap-3">
            <a
              href="#generator"
              class="rounded-lg bg-[hsl(var(--ci-brand))] px-4 py-2 text-xs font-medium text-[hsl(var(--ci-brand-foreground))] transition-opacity hover:opacity-90"
            >
              {{ t.footer.openGenerator }}
            </a>
            <a
              href="#pricing"
              class="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {{ t.footer.viewPricing }}
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground">{{ t.footer.product }}</h4>
          <ul class="mt-4 space-y-2">
            <li v-for="(label, i) in t.footer.links.product" :key="label">
              <a :href="productHrefs[i]" class="text-sm text-muted-foreground hover:text-foreground">{{ label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground">{{ t.footer.resources }}</h4>
          <ul class="mt-4 space-y-2">
            <li v-for="(label, i) in t.footer.links.resources" :key="label">
              <a :href="resourceHrefs[i]" class="text-sm text-muted-foreground hover:text-foreground">{{ label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground">{{ t.footer.hotBlogs }}</h4>
          <ul class="mt-4 space-y-2">
            <li v-for="(label, i) in t.footer.links.hotBlogs" :key="label">
              <a :href="hotHrefs[i]" class="text-sm text-muted-foreground hover:text-foreground">{{ label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
        <p class="text-xs text-muted-foreground">{{ t.footer.copyright }}</p>
        <div class="flex gap-4">
          <a href="#" class="text-xs text-muted-foreground hover:text-foreground">{{ t.footer.terms }}</a>
          <a href="#" class="text-xs text-muted-foreground hover:text-foreground">{{ t.footer.privacy }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
