<script setup lang="ts">
import {
  BarChart3,
  ClipboardList,
  Database,
  File,
  Folder,
  HelpCircle,
  LayoutDashboard,
  List,
  PanelLeft,
  Search,
  Settings,
  Users,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const route = useRoute()

const props = withDefaults(
  defineProps<{
    mobileOpen?: boolean
  }>(),
  { mobileOpen: false },
)

function navClass(to: string) {
  const active = route.path === to
  return cn(
    'flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    active && 'bg-sidebar-accent text-sidebar-accent-foreground',
  )
}

const emit = defineEmits<{
  'update:mobileOpen': [value: boolean]
}>()

function closeMobile() {
  emit('update:mobileOpen', false)
}

const navMain = [
  { title: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { title: 'Lifecycle', to: '/workflow', icon: List },
  { title: 'Analytics', to: '/admin', icon: BarChart3 },
  { title: 'Projects', to: '/content-pool/pool-1', icon: Folder },
  { title: 'Team', to: '/admin', icon: Users },
]

const navSecondary = [
  { title: 'Settings', to: '/admin', icon: Settings },
  { title: 'Get Help', to: '/admin', icon: HelpCircle },
  { title: 'Search', to: '/admin', icon: Search },
]

const documents = [
  { name: 'Data Library', to: '/admin', icon: Database },
  { name: 'Reports', to: '/admin', icon: ClipboardList },
  { name: 'Word Assistant', to: '/admin', icon: File },
]
</script>

<template>
  <div
    v-if="props.mobileOpen"
    class="fixed inset-0 z-40 bg-black/60 md:hidden"
    aria-hidden="true"
    @click="closeMobile"
  />
  <aside
    :class="
      cn(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:z-0 md:translate-x-0 md:border-r',
        props.mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )
    "
  >
    <div class="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
      <div
        class="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
      >
        <PanelLeft class="size-4" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-semibold">RDR</span>
        <span class="text-xs text-sidebar-foreground/70">Admin</span>
      </div>
      <button
        type="button"
        class="ml-auto rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
        aria-label="Close menu"
        @click="closeMobile"
      >
        <span class="text-lg leading-none">×</span>
      </button>
    </div>

    <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-3">
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in navMain"
          :key="item.title"
          :to="item.to"
          :class="navClass(item.to)"
          @click="closeMobile"
        >
          <component :is="item.icon" class="size-4 shrink-0 opacity-80" />
          {{ item.title }}
        </NuxtLink>
      </nav>

      <div>
        <p class="mb-2 px-2 text-xs font-medium text-sidebar-foreground/60">
          Documents
        </p>
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="doc in documents"
            :key="doc.name"
            :to="doc.to"
            class="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            @click="closeMobile"
          >
            <component :is="doc.icon" class="size-4 shrink-0 opacity-80" />
            {{ doc.name }}
          </NuxtLink>
        </nav>
      </div>

      <nav class="mt-auto flex flex-col gap-1 border-t border-sidebar-border pt-4">
        <NuxtLink
          v-for="item in navSecondary"
          :key="item.title"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          @click="closeMobile"
        >
          <component :is="item.icon" class="size-4 shrink-0 opacity-80" />
          {{ item.title }}
        </NuxtLink>
      </nav>
    </div>

    <div class="border-t border-sidebar-border p-3">
      <div class="flex items-center gap-3 rounded-md px-2 py-2">
        <div
          class="flex size-9 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground"
        >
          AD
        </div>
        <div class="min-w-0 flex-1 leading-tight">
          <p class="truncate text-sm font-medium">Admin</p>
          <p class="truncate text-xs text-sidebar-foreground/70">
            admin@example.com
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
