<script setup lang="ts">
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div
      class="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      <p class="text-sm text-muted-foreground">Total Revenue</p>
      <p class="mt-2 text-2xl font-semibold tabular-nums">$1,250.00</p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          <TrendingUp class="size-3" />
          +12.5%
        </span>
        <span class="text-xs text-muted-foreground">Trending up this month</span>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">
        Visitors for the last 6 months
      </p>
    </div>

    <div
      class="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      <p class="text-sm text-muted-foreground">New Customers</p>
      <p class="mt-2 text-2xl font-semibold tabular-nums">1,234</p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-destructive"
        >
          <TrendingDown class="size-3" />
          -20%
        </span>
        <span class="text-xs text-muted-foreground">Down 20% this period</span>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">
        Acquisition needs attention
      </p>
    </div>

    <div
      class="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      <p class="text-sm text-muted-foreground">Active Accounts</p>
      <p class="mt-2 text-2xl font-semibold tabular-nums">45,678</p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          <TrendingUp class="size-3" />
          +12.5%
        </span>
        <span class="text-xs text-muted-foreground">Strong user retention</span>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">Engagement exceed targets</p>
    </div>

    <div
      class="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      <p class="text-sm text-muted-foreground">Growth Rate</p>
      <p class="mt-2 text-2xl font-semibold tabular-nums">4.5%</p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          <TrendingUp class="size-3" />
          +4.5%
        </span>
        <span class="text-xs text-muted-foreground">Steady performance</span>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">Meets growth projections</p>
    </div>
  </div>
</template>
