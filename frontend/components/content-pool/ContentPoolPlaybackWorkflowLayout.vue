<template>
  <AppWorkspaceShell>
    <div class="hsa__inner">
      <header class="hsa__header">
        <div class="hsa__header-brand">
          <NuxtLink to="/" class="hsa__logo-link">
            <img class="hsa__logo" :src="rdrLogoUrl" width="80" height="31" alt="RDR" />
          </NuxtLink>
          <nav class="hsa__crumbs" aria-label="Breadcrumb">
            <NuxtLink to="/home" class="hsa__crumb">Home</NuxtLink>
            <span class="hsa__crumb-sep" aria-hidden="true">&gt;</span>
            <span class="hsa__crumb hsa__crumb--current">High-Speed Action</span>
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
import iconLinesUrl from '~/assets/icon-lines.svg?url'
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import type { WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

const props = defineProps<{
  poolId: string
}>()

const route = useRoute()

type PlaybackStep = 'targeting' | 'decode-sr' | 'player'

const activePlaybackStep = computed<PlaybackStep>(() => {
  const p = route.path
  if (p.endsWith('/playback/decode-sr')) return 'decode-sr'
  if (p.endsWith('/playback/player')) return 'player'
  return 'targeting'
})

const steps = computed(() => {
  const id = props.poolId
  const base = `/content-pool/${id}/playback`
  return [
    { id: 'targeting' as const, label: 'Targeting', to: `${base}/targeting`, icon: 'target' satisfies WorkflowStepIconKey },
    { id: 'decode-sr' as const, label: 'Decode & SR', to: `${base}/decode-sr`, icon: 'decode' satisfies WorkflowStepIconKey },
    { id: 'player' as const, label: 'Player', to: `${base}/player`, icon: 'player' satisfies WorkflowStepIconKey },
  ]
})

const stepIndex: Record<string, number> = {
  targeting: 0,
  'decode-sr': 1,
  player: 2,
}

const activeIndex = computed(() => stepIndex[activePlaybackStep.value] ?? 0)

function stepClass(stepId: string) {
  const si = stepIndex[stepId] ?? 0
  const ai = activeIndex.value
  return {
    'hsa__step--done': si < ai,
    'hsa__step--current': si === ai,
    'hsa__step--upcoming': si > ai,
  }
}

const stepperHint = computed(() => {
  switch (activePlaybackStep.value) {
    case 'targeting':
      return 'AI-Driven Pixel Reconstruction.'
    case 'decode-sr':
      return 'Achieve high-performance bitstream parsing and synchronized metadata extraction.'
    case 'player':
      return 'Review the final result.'
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
.hsa__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: min(100%, 1280px);
  margin: 0 auto;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2.25rem) clamp(0.75rem, 2vw, 1.25rem);
}

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
  max-width: min(100%, calc(920px + clamp(18px, 3vw, 28px)));
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
  max-width: 920px;
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
  max-width: min(100%, 52rem);
  margin-left: 0;
  margin-right: 0;
  line-height: 1.5;
  text-align: left;
  letter-spacing: 0.01em;
}

@media (max-width: 900px) {
  .hsa__stepper-wrap {
    max-width: 100%;
  }

  .hsa__stepper-panel {
    max-width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
