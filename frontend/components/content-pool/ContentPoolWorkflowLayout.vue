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
            <NuxtLink :to="collectionsHref" class="hsa__crumb">{{ categoryTitle || 'Categories' }}</NuxtLink>
            <span class="hsa__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="hsa__crumb hsa__crumb--current">{{ videoName || '…' }}</span>
          </nav>
        </div>
      </header>

      <div class="hsa__rule" role="presentation" />

      <div class="hsa__stepper-wrap">
        <div class="hsa__stepper-lines" aria-hidden="true">
          <img :src="iconLinesUrl" alt="" class="hsa__stepper-lines-img" width="21" height="143" />
        </div>
        <div class="hsa__stepper-main">
          <div class="hsa__stepper-panel">
            <WorkflowPipelineStepTrack :steps="steps" :step-class-for-id="stepClass" />
          </div>
          <p class="hsa__stepper-hint">{{ stepperHint }}</p>
        </div>
      </div>

      <slot />

      <AppSiteFooter />
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
import { getVideoCollection } from '~/api/video-collections'
import { listCategories } from '~/api/categories'
import iconLinesUrl from '~/assets/icon-lines.svg?url'
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import type { WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

const props = defineProps<{
  poolId: string
}>()

const route = useRoute()
const videoName = ref('')
const categoryId = ref<number | null>(null)

const collectionsHref = computed(() =>
  categoryId.value != null ? `/categories/${categoryId.value}` : '/categories/1',
)
const categoryTitle = ref('')

function parsePoolId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

async function loadVideoName(poolId: string) {
  const collectionId = parsePoolId(poolId)
  if (collectionId == null) {
    videoName.value = ''
    categoryId.value = null
    categoryTitle.value = ''
    return
  }

  try {
    const collection = await getVideoCollection(collectionId)
    videoName.value = collection.name
    categoryId.value = collection.category_id

    const categoriesResponse = await listCategories({ per_page: 100 })
    const category = categoriesResponse.data.find((item) => item.id === collection.category_id)
    categoryTitle.value = category?.title ?? 'Categories'
  } catch {
    videoName.value = ''
    categoryId.value = null
    categoryTitle.value = ''
  }
}

watch(
  () => props.poolId,
  (poolId) => {
    void loadVideoName(poolId)
  },
  { immediate: true },
)

type Active = 'targeting' | 'metadata-extraction' | 'packaging'

const activeStepId = computed<Active>(() => {
  const p = route.path
  if (p.endsWith('/metadata-extraction')) return 'metadata-extraction'
  if (p.endsWith('/packaging')) return 'packaging'
  return 'targeting'
})

const steps = computed(() => {
  const id = props.poolId
  const contentTo = collectionsHref.value
  return [
    { id: 'content' as const, label: 'Content', to: contentTo, icon: 'content' satisfies WorkflowStepIconKey },
    { id: 'targeting' as const, label: 'Targeting', to: `/content-pool/${id}/targeting`, icon: 'target' satisfies WorkflowStepIconKey },
    {
      id: 'metadata-extraction' as const,
      label: 'Metadata Extraction',
      to: `/content-pool/${id}/metadata-extraction`,
      icon: 'metadata' satisfies WorkflowStepIconKey,
    },
    { id: 'packaging' as const, label: 'Metadata Generation and Packaging', to: `/content-pool/${id}/packaging`, icon: 'packaging' satisfies WorkflowStepIconKey },
  ]
})

const stepIndex: Record<string, number> = {
  content: 0,
  targeting: 1,
  'metadata-extraction': 2,
  packaging: 3,
}

const activeIndex = computed(() => stepIndex[activeStepId.value] ?? 1)

function stepClass(stepId: string) {
  if (stepId === 'content') {
    return { 'hsa__step--done': true }
  }
  const si = stepIndex[stepId] ?? 0
  const ai = activeIndex.value
  return {
    'hsa__step--done': si < ai,
    'hsa__step--current': si === ai,
    'hsa__step--upcoming': si > ai,
  }
}

const stepperHint = computed(() => {
  switch (activeStepId.value) {
    case 'targeting':
      return 'Select your required target format to prepare for the next step.'
    case 'metadata-extraction':
      return 'Select the AI Image Enhancement techniques to apply and generate RDR Metadata.'
    case 'packaging':
      return 'Synchronize and encapsulate extracted RDR Metadata with the source video essence to generate a standardized, AI-enhanced bitstream for downstream TCON processing.'
    default:
      return ''
  }
})

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.hsa__header {
  display: block;
}

.hsa__header-brand {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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

.hsa__rule {
  height: 1px;
  margin: clamp(0.85rem, 2vw, 1.25rem) 0;
  background: rgba(255, 255, 255, 0.12);
}

.hsa__stepper-wrap {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: clamp(0.2rem, 1vw, 0.55rem);
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(0.35rem, 1.2vw, 0.5rem) 0 0;
}

.hsa__stepper-lines {
  flex: 0 0 clamp(15px, 2.4vw, 22px);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  min-height: 0;
  padding-top: clamp(1.5rem, 4vw, 2.1rem);
}

.hsa__stepper-lines-img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: none;
  object-fit: contain;
  object-position: top right;
}

.hsa__stepper-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.hsa__stepper-panel {
  position: relative;
  width: 100%;
  margin: 0;
  padding: clamp(0.65rem, 1.8vw, 0.95rem) clamp(0.75rem, 2vw, 1.35rem) clamp(0.35rem, 1vw, 0.5rem);
  background: transparent;
}

.hsa__stepper-hint {
  margin: clamp(0.65rem, 1.8vw, 0.95rem) 0 0;
  padding-left: clamp(0.35rem, 1.2vw, 0.65rem);
  padding-right: clamp(0.35rem, 1.2vw, 0.65rem);
  font-size: clamp(0.78rem, 1.15vw, 0.92rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  margin-left: 0;
  margin-right: 0;
  line-height: 1.5;
  text-align: left;
  letter-spacing: 0.01em;
}

@media (max-width: 900px) {
  .hsa__stepper-panel {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

</style>
