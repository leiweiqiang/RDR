<script setup lang="ts">
import { ChevronDown, LogIn, Menu, Wallet, X } from 'lucide-vue-next'
import ChatImageLogo from '@/components/chatimage/ChatImageLogo.vue'
import { navHrefs } from '@/data/chatimageData'

const { t, toggleLocale } = useChatImageI18n()

const mobileOpen = ref(false)
const credits = ref(3)
const activeHref = ref('#home')

const links = computed(() => t.value.nav.map((label, i) => ({ label, href: navHrefs[i] })))

function closeMobile() {
  mobileOpen.value = false
}

function setActive(href: string) {
  activeHref.value = href
  closeMobile()
}
</script>

<template>
  <header class="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-border/60 bg-card/60 px-3 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:h-16 sm:px-5"
    >
      <!-- Logo -->
      <a href="#home" class="flex shrink-0 items-center text-foreground" aria-label="RDR" @click="setActive('#home')">
        <ChatImageLogo class="h-5 w-auto sm:h-6" />
      </a>

      <!-- Center nav -->
      <nav class="hidden items-center gap-0.5 md:flex">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          :class="activeHref === link.href
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'"
          @click="setActive(link.href)"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Right cluster -->
      <div class="hidden items-center gap-2 md:flex">
        <!-- Credits pill -->
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground">
          {{ credits }}
          <Wallet class="size-4 text-muted-foreground" />
        </span>

        <!-- Language -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          aria-label="Switch language"
          @click="toggleLocale"
        >
          <span class="text-base leading-none">{{ t.header.langFlag }}</span>
          <span>{{ t.header.langLabel }}</span>
          <ChevronDown class="size-3.5 text-muted-foreground" />
        </button>

        <!-- Sign In -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <LogIn class="size-4" />
          {{ t.header.signIn }}
        </button>
      </div>

      <!-- Mobile cluster -->
      <div class="flex items-center gap-2 md:hidden">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground"
          aria-label="Switch language"
          @click="toggleLocale"
        >
          <span class="text-base leading-none">{{ t.header.langFlag }}</span>
        </button>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground">
          {{ credits }}
          <Wallet class="size-4 text-muted-foreground" />
        </span>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-full border border-border"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Menu v-if="!mobileOpen" class="size-5" />
          <X v-else class="size-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileOpen"
      class="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-card p-3 shadow-lg md:hidden"
    >
      <nav class="flex flex-col gap-1">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="activeHref === link.href ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'"
          @click="setActive(link.href)"
        >
          {{ link.label }}
        </a>
        <button
          type="button"
          class="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <LogIn class="size-4" />
          {{ t.header.signIn }}
        </button>
      </nav>
    </div>
  </header>
</template>
