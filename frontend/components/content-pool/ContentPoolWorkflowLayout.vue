<template>
  <div class="hsa">
    <div class="hsa__glow hsa__glow--red" aria-hidden="true" />
    <div class="hsa__glow hsa__glow--red-center" aria-hidden="true" />
    <div class="hsa__spotlight" aria-hidden="true" />

    <div class="hsa__noise" aria-hidden="true">
      <svg class="hsa__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="cpw-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#cpw-noise)" />
      </svg>
    </div>

    <p class="hsa__watermark" aria-hidden="true">WORKSPACE</p>

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
  </div>
</template>

<script setup lang="ts">
import iconLinesUrl from '~/assets/icon-lines.svg?url'
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import type { WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

const props = defineProps<{
  poolId: string
}>()

const route = useRoute()

type Active = 'targeting' | 'metadata-extraction' | 'packaging'

const activeStepId = computed<Active>(() => {
  const p = route.path
  if (p.endsWith('/metadata-extraction')) return 'metadata-extraction'
  if (p.endsWith('/packaging')) return 'packaging'
  return 'targeting'
})

const steps = computed(() => {
  const id = props.poolId
  return [
    { id: 'content' as const, label: 'Content', to: '/high-speed-action', icon: 'content' satisfies WorkflowStepIconKey },
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
.hsa {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background-color: transparent;
  background-image: none;
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.hsa__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.hsa__glow--red {
  width: min(95vw, 980px);
  height: min(95vw, 980px);
  left: -22%;
  bottom: -35%;
  opacity: 0.55;
  background: radial-gradient(
    circle,
    rgba(160, 24, 48, 0.55) 0%,
    rgba(90, 8, 28, 0.38) 42%,
    rgba(30, 0, 10, 0.12) 68%,
    transparent 76%
  );
}

.hsa__glow--red-center {
  width: min(120vw, 1400px);
  height: min(70vh, 900px);
  left: 50%;
  bottom: -40%;
  transform: translateX(-50%);
  opacity: 0.7;
  filter: blur(140px);
  background: radial-gradient(
    ellipse 55% 45% at 50% 100%,
    rgba(200, 28, 48, 0.5) 0%,
    rgba(80, 6, 22, 0.28) 50%,
    transparent 72%
  );
}

.hsa__spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 58% 46% at 50% 38%,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 240, 245, 0.02) 45%,
    transparent 74%
  );
}

.hsa__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.hsa__noise-svg {
  width: 100%;
  height: 100%;
}

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

.hsa__watermark {
  position: fixed;
  right: clamp(0.75rem, 3vw, 2rem);
  bottom: max(clamp(0.75rem, 2vw, 1.25rem), env(safe-area-inset-bottom, 0px));
  margin: 0;
  font-size: clamp(2.25rem, 7vw, 4rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  color: rgba(90, 12, 22, 0.38);
  line-height: 1;
  text-align: right;
  pointer-events: none;
  user-select: none;
  z-index: 1;
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
