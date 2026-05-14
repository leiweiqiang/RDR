<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { AdminDocRow } from '@/data/adminTableData'

const props = defineProps<{
  data: AdminDocRow[]
}>()

const pageSize = ref(5)
const pageIndex = ref(0)

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.data.length / pageSize.value)),
)

const pageRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return props.data.slice(start, start + pageSize.value)
})

function goPrev() {
  pageIndex.value = Math.max(0, pageIndex.value - 1)
}

function goNext() {
  pageIndex.value = Math.min(pageCount.value - 1, pageIndex.value + 1)
}

function statusClass(status: string) {
  return status === 'Done'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : 'border-amber-200 bg-amber-50 text-amber-900'
}
</script>

<template>
  <div class="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold tracking-tight">Outline</h2>
        <p class="text-sm text-muted-foreground">Sections and reviewers</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <select
          v-model.number="pageSize"
          class="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          @change="pageIndex = 0"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px] text-left text-sm">
        <thead class="border-b border-border bg-secondary/40 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Header</th>
            <th class="px-4 py-3 font-medium">Section Type</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium tabular-nums">Target</th>
            <th class="px-4 py-3 font-medium tabular-nums">Limit</th>
            <th class="px-4 py-3 font-medium">Reviewer</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in pageRows"
            :key="row.id"
            class="border-b border-border last:border-0 hover:bg-secondary/30"
          >
            <td class="px-4 py-3 font-medium text-foreground">
              {{ row.header }}
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ row.type }}
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
                :class="statusClass(row.status)"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-3 tabular-nums text-muted-foreground">
              {{ row.target }}
            </td>
            <td class="px-4 py-3 tabular-nums text-muted-foreground">
              {{ row.limit }}
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ row.reviewer }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-muted-foreground">
        Page {{ pageIndex + 1 }} of {{ pageCount }}
      </p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-40"
          :disabled="pageIndex <= 0"
          aria-label="Previous page"
          @click="goPrev"
        >
          <ChevronLeft class="size-4" />
        </button>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-40"
          :disabled="pageIndex >= pageCount - 1"
          aria-label="Next page"
          @click="goNext"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
