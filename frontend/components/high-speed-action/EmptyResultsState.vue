<template>
  <div class="hsa-empty" role="status">
    <div class="hsa-empty__icon-wrap" aria-hidden="true">
      <svg class="hsa-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-3.2-3.2" stroke-linecap="round" />
        <path d="M8.5 11h5" stroke-linecap="round" />
      </svg>
    </div>

    <h3 class="hsa-empty__title">{{ title }}</h3>

    <p v-if="searchQuery" class="hsa-empty__message">
      No {{ scope }} matched
      <span class="hsa-empty__query">"{{ searchQuery }}"</span>.
    </p>
    <p v-else-if="hasActiveFilters" class="hsa-empty__message">
      No {{ scope }} matched your current filters.
    </p>
    <p v-else class="hsa-empty__message">
      No {{ scope }} available yet.
    </p>

    <p v-if="showHint" class="hsa-empty__hint">
      Try a different keyword, broaden your filters, or reset everything below.
    </p>

    <button
      v-if="showReset"
      type="button"
      class="hsa-empty__reset"
      @click="emit('reset')"
    >
      Clear search & filters
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  scope: string
  searchQuery?: string
  hasActiveFilters?: boolean
  hasSourceItems?: boolean
}>()

const emit = defineEmits<{
  reset: []
}>()

const title = computed(() =>
  props.hasSourceItems === false && !props.searchQuery && !props.hasActiveFilters
    ? 'Nothing here yet'
    : 'No results found',
)

const showHint = computed(
  () => !!props.searchQuery || !!props.hasActiveFilters,
)

const showReset = computed(
  () => !!props.searchQuery || !!props.hasActiveFilters,
)
</script>

<style scoped>
.hsa-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: clamp(8rem, 22vw, 11rem);
  padding: clamp(1.25rem, 3vw, 2rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 12px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 0%, rgba(200, 28, 48, 0.12) 0%, transparent 58%),
    rgba(18, 18, 22, 0.82);
  border: 1px dashed rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hsa-empty__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.15rem;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 24px rgba(200, 28, 48, 0.12);
}

.hsa-empty__icon {
  width: 1.35rem;
  height: 1.35rem;
}

.hsa-empty__title {
  margin: 0;
  font-size: clamp(0.92rem, 1.4vw, 1.05rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
}

.hsa-empty__message {
  margin: 0;
  max-width: 26rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.62);
}

.hsa-empty__query {
  color: #fff;
  font-weight: 600;
}

.hsa-empty__hint {
  margin: 0.15rem 0 0;
  max-width: 24rem;
  font-size: 0.72rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
}

.hsa-empty__reset {
  margin-top: 0.45rem;
  border: 1px solid rgba(0, 230, 118, 0.45);
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #00e676;
  background: rgba(0, 230, 118, 0.08);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;
}

.hsa-empty__reset:hover {
  background: rgba(0, 230, 118, 0.14);
  border-color: rgba(0, 230, 118, 0.65);
  transform: translateY(-1px);
}
</style>
