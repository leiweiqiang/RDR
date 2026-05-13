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

    <div class="hsa__inner">
      <header class="hsa__header">
        <div class="hsa__header-brand">
          <NuxtLink to="/home" class="hsa__logo-link">
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
        <div class="hsa__stepper-panel">
          <ol class="hsa__stepper" aria-label="Workflow progress">
            <template v-for="(step, index) in steps" :key="step.id">
              <li class="hsa__step" :class="stepClass(step.id)">
                <NuxtLink :to="step.to" class="hsa__step-link">
                  <span class="hsa__step-icon" aria-hidden="true" v-html="step.icon" />
                  <span class="hsa__step-label">{{ step.label }}</span>
                </NuxtLink>
              </li>
              <li v-if="index < steps.length - 1" class="hsa__step-sep" aria-hidden="true">
                <span class="hsa__step-sep-arrow" />
              </li>
            </template>
          </ol>
          <div class="hsa__stepper-rail" aria-hidden="true">
            <span class="hsa__stepper-rail__hline" />
            <span class="hsa__stepper-rail__vline" />
          </div>
        </div>
        <p class="hsa__stepper-hint">{{ stepperHint }}</p>
      </div>

      <slot />

      <p class="hsa__watermark" aria-hidden="true">WORKSPACE</p>

      <footer class="hsa__footer">
        <span class="hsa__copyright">{{ copyrightText }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'
import { filmIcon, metaIcon, packIcon, targetIcon } from './contentPoolStepIcons'

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
    { id: 'content' as const, label: 'Content', to: '/high-speed-action', icon: filmIcon },
    { id: 'targeting' as const, label: 'Targeting', to: `/content-pool/${id}/targeting`, icon: targetIcon },
    { id: 'metadata-extraction' as const, label: 'Metadata Extraction', to: `/content-pool/${id}/metadata-extraction`, icon: metaIcon },
    { id: 'packaging' as const, label: 'Packaging', to: `/content-pool/${id}/packaging`, icon: packIcon },
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

const copyrightText = computed(() => (activeStepId.value === 'packaging' ? '© CSOT 2024' : '© CSOT 2023'))

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
  background-color: #000;
  background-image:
    radial-gradient(ellipse 100% 90% at 50% 100%, rgba(120, 8, 28, 0.85) 0%, rgba(55, 4, 14, 0.45) 42%, transparent 58%),
    radial-gradient(ellipse 120% 85% at 0% 100%, rgba(110, 12, 32, 0.72) 0%, rgba(45, 6, 14, 0.35) 38%, transparent 62%),
    linear-gradient(180deg, #000000 0%, #050204 38%, #120208 100%);
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
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(0.35rem, 1.2vw, 0.5rem) 0 0;
}

/* Top rounded frame + baseline / left spine per design */
.hsa__stepper-panel {
  position: relative;
  max-width: min(100%, 920px);
  margin: 0 auto;
  padding: clamp(0.65rem, 1.8vw, 0.95rem) clamp(0.75rem, 2vw, 1.35rem) 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.hsa__stepper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem 0.15rem;
  margin: 0;
  padding: 0 0 clamp(0.45rem, 1.2vw, 0.65rem);
  list-style: none;
}

.hsa__step {
  display: flex;
  align-items: stretch;
  list-style: none;
}

.hsa__step-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.38rem;
  min-width: 3.25rem;
  max-width: 6.75rem;
  padding: 0.2rem 0.28rem 0.35rem;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  outline-offset: 3px;
  transition: color 0.18s ease, filter 0.18s ease;
}

.hsa__step-link:hover {
  filter: brightness(1.12);
}

.hsa__step-link:focus-visible {
  outline: 2px solid #00e5ff;
}

.hsa__step-icon {
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  color: currentColor;
}

.hsa__step-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.hsa__step-label {
  display: block;
  text-align: center;
  font-size: clamp(0.58rem, 0.95vw, 0.74rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-transform: none;
  hyphens: auto;
}

.hsa__step--done {
  color: #f0f0f0;
}

.hsa__step--done .hsa__step-label {
  color: rgba(255, 255, 255, 0.92);
}

.hsa__step--current {
  color: #00e5ff;
}

.hsa__step--current .hsa__step-label {
  color: #00f0ff;
  text-shadow:
    0 0 14px rgba(0, 229, 255, 0.45),
    0 0 28px rgba(0, 229, 255, 0.12);
}

.hsa__step--upcoming {
  color: #5c5c5c;
}

.hsa__step--upcoming .hsa__step-label {
  color: #6a6a6a;
}

/* Thin white arrow connectors */
.hsa__step-sep {
  display: flex;
  align-items: center;
  align-self: flex-start;
  padding: 0.48rem 0.08rem 0;
  margin: 0;
  list-style: none;
  pointer-events: none;
}

.hsa__step-sep-arrow {
  display: block;
  width: 1.15rem;
  height: 0.55rem;
  opacity: 0.55;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 8' fill='none'%3E%3Cpath d='M1 4h12M11 1l3 3-3 3' stroke='%23ffffff' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round' opacity='0.9'/%3E%3C/svg%3E")
    center / contain no-repeat;
}

/* Horizontal rule under icon row + vertical spine on the left into workspace */
.hsa__stepper-rail {
  position: relative;
  height: clamp(1.35rem, 3.5vw, 2rem);
  margin: 0 calc(-1 * clamp(0.75rem, 2vw, 1.35rem));
  pointer-events: none;
}

.hsa__stepper-rail__hline {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.32) 8%,
    rgba(255, 255, 255, 0.28) 50%,
    rgba(255, 255, 255, 0.32) 92%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.hsa__stepper-rail__vline {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: calc(100% + clamp(1.75rem, 4vw, 2.75rem));
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.38) 0%,
    rgba(255, 255, 255, 0.22) 45%,
    rgba(255, 255, 255, 0.06) 100%
  );
}

.hsa__stepper-hint {
  margin: clamp(0.65rem, 1.8vw, 0.95rem) 0 0;
  padding-left: clamp(0.35rem, 1.2vw, 0.65rem);
  font-size: clamp(0.78rem, 1.15vw, 0.92rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  max-width: min(100%, 52rem);
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  text-align: center;
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
  z-index: 3;
}

.hsa__footer {
  margin-top: auto;
  padding-top: 1rem;
}

.hsa__copyright {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.32);
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .hsa__stepper-panel {
    max-width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 10px 10px 0 0;
  }

  .hsa__stepper-rail {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }

  .hsa__stepper-rail__vline {
    height: calc(100% + 1.5rem);
  }
}

@media (max-width: 520px) {
  .hsa__step-sep-arrow {
    width: 0.85rem;
    opacity: 0.42;
  }

  .hsa__step-label {
    font-size: 0.52rem;
    letter-spacing: 0.02em;
  }

  .hsa__step-link {
    min-width: 2.85rem;
    max-width: 5.5rem;
    padding-left: 0.15rem;
    padding-right: 0.15rem;
  }
}
</style>
