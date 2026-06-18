<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const { t, planMeta } = useChatImageI18n()

const billingCycle = ref<'monthly' | 'annually'>('annually')

const plans = computed(() =>
  t.value.pricing.plans.map((plan, i) => ({
    ...plan,
    price: planMeta[i].price,
    billing: planMeta[i].billing,
    highlighted: planMeta[i].highlighted ?? false,
  })),
)
</script>

<template>
  <section id="pricing" class="scroll-mt-20 border-b border-border/60 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-10 max-w-2xl text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-[hsl(var(--ci-brand))]">{{ t.pricing.badge }}</p>
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {{ t.pricing.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ t.pricing.desc }}
        </p>
      </div>

      <!-- Billing toggle -->
      <div class="mb-10 flex items-center justify-center gap-3">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="billingCycle === 'monthly' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
          @click="billingCycle = 'monthly'"
        >
          {{ t.pricing.monthly }}
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="billingCycle === 'annually' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
          @click="billingCycle = 'annually'"
        >
          {{ t.pricing.annually }}
          <span class="rounded-full bg-[hsl(var(--ci-brand))]/10 px-2 py-0.5 text-xs text-[hsl(var(--ci-brand))]">{{ t.pricing.save }}</span>
        </button>
      </div>

      <div class="grid gap-5 lg:grid-cols-4">
        <article
          v-for="plan in plans"
          :key="plan.name"
          class="relative flex flex-col rounded-2xl border p-6 transition-shadow"
          :class="plan.highlighted ? 'border-[hsl(var(--ci-brand))] bg-[hsl(var(--ci-brand))]/5 shadow-lg ring-1 ring-[hsl(var(--ci-brand))]/20' : 'border-border bg-card hover:shadow-md'"
        >
          <span
            v-if="plan.badge"
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--ci-brand))] px-3 py-1 text-xs font-medium text-[hsl(var(--ci-brand-foreground))]"
          >
            {{ plan.badge }}
          </span>

          <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">{{ plan.tier }}</p>
          <h3 class="mt-2 text-xl font-bold text-foreground">{{ plan.name }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{{ plan.tagline }}</p>

          <div class="mt-5 flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">{{ plan.price }}</span>
            <span class="text-sm text-muted-foreground">{{ plan.billing }}</span>
          </div>

          <p v-if="billingCycle === 'annually' && plan.credits" class="mt-1 text-xs text-muted-foreground">
            {{ t.pricing.billedAnnually }} · {{ plan.credits }}
          </p>
          <p class="mt-3 text-xs font-medium text-muted-foreground">{{ t.pricing.usage }}</p>
          <p class="text-sm text-foreground">{{ plan.usage }}</p>

          <ul class="mt-6 flex-1 space-y-3">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check class="mt-0.5 size-4 shrink-0 text-[hsl(var(--ci-brand))]" />
              {{ feature }}
            </li>
          </ul>

          <button
            type="button"
            class="mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            :class="plan.highlighted ? 'bg-[hsl(var(--ci-brand))] text-[hsl(var(--ci-brand-foreground))]' : 'border border-border bg-background text-foreground hover:bg-secondary'"
          >
            {{ plan.cta }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
