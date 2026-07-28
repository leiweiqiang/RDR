<template>
  <AppWorkspaceShell>
    <div class="app-page-inner">
      <header class="hsa__header">
        <div class="hsa__header-brand">
          <NuxtLink to="/" class="hsa__logo-link">
            <img class="hsa__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="hsa__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="hsa__crumb">Home</NuxtLink>
            <span class="hsa__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="hsa__crumb hsa__crumb--current">{{ categoryTitle || 'Categories' }}</span>
          </nav>
        </div>
      </header>

      <main class="hsa__main">
        <div v-if="pending" class="hsa__status" role="status">
          Loading content...
        </div>
        <div v-else-if="error" class="hsa__status hsa__status--error" role="alert">
          <p>Failed to load content.</p>
          <button type="button" class="hsa__retry" @click="refresh()">Retry</button>
        </div>
        <template v-else>
        <section class="hsa__section" aria-labelledby="hsa-contents-title">
          <div class="hsa__section-head">
            <div class="hsa__section-title-wrap">
              <button type="button" class="hsa__pill-btn" @click="createProjectOpen = true">
                + New Projects
              </button>
              <h2 id="hsa-contents-title" class="hsa__section-title">All Projects</h2>
            </div>
            <div class="hsa__toolbar" role="toolbar" aria-label="All projects filters">
              <div class="hsa__search-wrap">
                <button
                  type="button"
                  class="hsa__icon-btn"
                  :class="{ 'hsa__icon-btn--active': poolSearchOpen || poolSearchQuery }"
                  :aria-expanded="poolSearchOpen"
                  aria-controls="hsa-pool-search"
                  aria-label="Search all projects"
                  @click="togglePoolSearch"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3-3" stroke-linecap="round" />
                  </svg>
                </button>
                <div
                  id="hsa-pool-search"
                  class="hsa__search-field"
                  :class="{ 'hsa__search-field--open': poolSearchOpen }"
                >
                  <div class="hsa__search-field-inner">
                    <label class="visually-hidden" for="hsa-pool-search-input">Search all projects</label>
                    <input
                      id="hsa-pool-search-input"
                      ref="poolSearchInput"
                      v-model="poolSearchQuery"
                      type="search"
                      class="hsa__search-input"
                      placeholder="Search…"
                      autocomplete="off"
                      @keydown.esc="closePoolSearch"
                    />
                  </div>
                </div>
              </div>
              <div
                v-for="field in filterFields"
                :key="field.key"
                class="hsa__filter"
              >
                <label class="hsa__filter-label" :for="`pool-${field.key}`">
                  {{ field.label }}
                </label>
                <AppStringSelect
                  :id="`pool-${field.key}`"
                  v-model="poolFilters[field.key]"
                  :options="field.options"
                  :placeholder="field.label"
                  :aria-label="field.label"
                  trigger-class="hsa__select-trigger"
                />
              </div>
            </div>
          </div>
          <HighSpeedActionEmptyResultsState
            v-if="filteredContentPool.length === 0"
            scope="content"
            :search-query="poolSearchQuery.trim()"
            :has-active-filters="poolHasActiveFilters"
            :has-source-items="contentPool.length > 0"
            @reset="resetPoolQuery"
          />
          <ul v-else class="hsa__grid hsa__grid--pool" role="list">
            <li v-for="item in filteredContentPool" :key="item.id" class="hsa__tile">
              <NuxtLink :to="item.to" class="hsa__card">
                <span class="hsa__card-visual">
                  <img :src="item.imageUrl" :alt="item.title" loading="lazy" decoding="async" />
                </span>
                <span class="hsa__card-label">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
        </template>
      </main>

      <AppSiteFooter />
    </div>
  </AppWorkspaceShell>

  <CreateProjectDialog
    :open="createProjectOpen"
    @close="createProjectOpen = false"
    @submit="onCreateProjectSubmit"
  />
</template>

<script setup lang="ts">
import CreateProjectDialog from '~/components/categories/CreateProjectDialog.vue'
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import {
  filterHighSpeedActionItems,
  type HighSpeedActionFilterKey,
  type HighSpeedActionFilters,
} from '~/utils/highSpeedActionFilters'
import {
  DEFAULT_HIGH_SPEED_ACTION_FILTERS,
  createDefaultHighSpeedActionPageQueryState,
  HIGH_SPEED_ACTION_RESOLUTION_OPTIONS,
  HIGH_SPEED_ACTION_SIZE_OPTIONS,
  HIGH_SPEED_ACTION_TIME_OPTIONS,
  HIGH_SPEED_ACTION_TYPE_OPTIONS,
  loadHighSpeedActionPageQueryState,
  saveHighSpeedActionPageQueryState,
} from '~/utils/highSpeedActionFilterStorage'

const CATEGORY_NAME = 'high-speed-action'

const route = useRoute()
const categoryId = computed(() => String(route.params.id))

const { categoryTitle, categoryName, contentPool, pending, error, refresh } =
  useCategoryContentById(categoryId)

const createProjectOpen = ref(false)

function onCreateProjectSubmit(_payload: { name: string; file?: File; url?: string }) {
  createProjectOpen.value = false
}

const timeOptions = HIGH_SPEED_ACTION_TIME_OPTIONS
const resolutionOptions = HIGH_SPEED_ACTION_RESOLUTION_OPTIONS
const typeOptions = HIGH_SPEED_ACTION_TYPE_OPTIONS
const sizeOptions = HIGH_SPEED_ACTION_SIZE_OPTIONS

type FilterKey = HighSpeedActionFilterKey

const filterFields = [
  { key: 'time' as FilterKey, label: 'Time', options: timeOptions },
  { key: 'resolution' as FilterKey, label: 'Resolution', options: resolutionOptions },
  { key: 'type' as FilterKey, label: 'Type', options: typeOptions },
  { key: 'size' as FilterKey, label: 'Size', options: sizeOptions },
]

const poolFilters = reactive<HighSpeedActionFilters>({
  ...DEFAULT_HIGH_SPEED_ACTION_FILTERS,
})

const poolSearchOpen = ref(false)
const poolSearchQuery = ref('')
const poolSearchInput = ref<HTMLInputElement | null>(null)

const filteredContentPool = computed(() =>
  filterHighSpeedActionItems(contentPool.value, poolSearchQuery.value, {
    time: poolFilters.time,
    resolution: poolFilters.resolution,
    type: poolFilters.type,
    size: poolFilters.size,
  }),
)

function filtersAreActive(filters: HighSpeedActionFilters): boolean {
  return (
    filters.time !== 'All' ||
    filters.resolution !== 'All' ||
    filters.type !== 'All' ||
    filters.size !== 'All'
  )
}

const poolHasActiveFilters = computed(() => filtersAreActive(poolFilters))

function resetPoolQuery() {
  poolSearchQuery.value = ''
  poolSearchOpen.value = false
  Object.assign(poolFilters, DEFAULT_HIGH_SPEED_ACTION_FILTERS)
}

watch(
  [poolFilters, poolSearchQuery],
  () => {
    saveHighSpeedActionPageQueryState(categoryName.value || CATEGORY_NAME, {
      pool: {
        searchQuery: poolSearchQuery.value,
        filters: {
          time: poolFilters.time,
          resolution: poolFilters.resolution,
          type: poolFilters.type,
          size: poolFilters.size,
        },
      },
      stream: createDefaultHighSpeedActionPageQueryState().stream,
    })
  },
  { deep: true },
)

watch(
  categoryName,
  (name) => {
    if (!name) return
    const saved = loadHighSpeedActionPageQueryState(name)
    if (!saved) return

    Object.assign(poolFilters, saved.pool.filters)
    poolSearchQuery.value = saved.pool.searchQuery
  },
  { immediate: true },
)

function togglePoolSearch() {
  poolSearchOpen.value = !poolSearchOpen.value
  if (!poolSearchOpen.value) return
  nextTick(() => poolSearchInput.value?.focus())
}

function closePoolSearch() {
  poolSearchOpen.value = false
  poolSearchQuery.value = ''
}

useHead(() => ({
  title: `${categoryTitle.value || 'Categories'} — Projects — RDR`,
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
}))
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hsa__header {
  display: block;
}

.hsa__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-width: 0;
}

.hsa__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
}

.hsa__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.hsa__crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  row-gap: 0.15rem;
  min-width: 0;
  font-size: clamp(0.95rem, 1.35vw, 1.125rem);
  font-weight: 500;
  color: #a0a0a0;
}

.hsa__crumb {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.hsa__crumb:hover {
  color: #fff;
}

.hsa__crumb--current {
  color: #fff;
}

.hsa__crumb-sep {
  color: #707070;
  font-weight: 400;
}

.hsa__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  padding-block: clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 2.5vw, 2rem);
  min-height: 0;
}

.hsa__section {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.8vw, 1.1rem);
  min-width: 0;
}

.hsa__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 8rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.hsa__status--error p {
  margin: 0;
}

.hsa__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.hsa__retry:hover {
  background: rgba(255, 255, 255, 0.14);
}

.hsa__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 0.75rem 1rem;
}

.hsa__section-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 0.85rem;
  min-width: 0;
}

.hsa__pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.hsa__pill-btn:hover {
  filter: brightness(0.96);
}

.hsa__section-title {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
}

.hsa__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.45rem;
  justify-content: flex-end;
  margin-left: auto;
}

.hsa__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: #c8c8c8;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.hsa__icon-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
}

.hsa__icon-btn--active {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.1);
}

.hsa__icon-btn svg {
  width: 1rem;
  height: 1rem;
}

.hsa__search-wrap {
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}

.hsa__search-field {
  display: grid;
  grid-template-columns: 0fr;
  transition: grid-template-columns 0.22s ease;
  align-items: flex-end;
}

.hsa__search-field--open {
  grid-template-columns: 1fr;
}

.hsa__search-field-inner {
  overflow: hidden;
  min-width: 0;
}

.hsa__search-input {
  box-sizing: border-box;
  min-width: 0;
  width: clamp(8rem, 18vw, 12.5rem);
  height: 2.1rem;
  padding: 0 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  outline: none;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.hsa__search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.hsa__search-input:focus {
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(0, 0, 0, 0.55);
}

.hsa__search-input::-webkit-search-cancel-button {
  cursor: pointer;
}

.hsa__filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.hsa__filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
}

:deep(.hsa__select-trigger) {
  appearance: none;
  min-width: 5.5rem;
  max-width: 8.5rem;
  height: auto;
  min-height: 2.1rem;
  padding: 0.42rem 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: none;
  --ring: 214 32% 60%;
}

:deep(.hsa__select-trigger svg) {
  color: #a0a0a0;
  opacity: 1;
}

.hsa__grid {
  display: grid;
  gap: clamp(0.65rem, 1.5vw, 1rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hsa__grid--pool {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hsa__tile {
  min-width: 0;
}

.hsa__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: rgba(12, 12, 14, 0.85);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 12px 28px rgba(0, 0, 0, 0.4);
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

a.hsa__card {
  text-decoration: none;
}

.hsa__card:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.16),
    0 16px 36px rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
}

.hsa__card-visual {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  overflow: hidden;
}

.hsa__card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hsa__card-label {
  display: block;
  padding: clamp(0.55rem, 1.2vw, 0.75rem) clamp(0.5rem, 1.1vw, 0.65rem);
  font-size: clamp(0.72rem, 1.1vw, 0.85rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.35;
}

@media (max-width: 560px) {
  .hsa__grid--pool {
    grid-template-columns: 1fr;
  }

  .hsa__toolbar {
    width: 100%;
    justify-content: flex-start;
  }

  :deep(.hsa__select-trigger) {
    max-width: none;
    flex: 1 1 calc(50% - 0.25rem);
  }
}
</style>
