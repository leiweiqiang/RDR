<template>
  <AppWorkspaceShell :show-watermark="false">
    <div class="app-page-inner workflow__inner" :style="stepsWidthVar">
      <div class="workflow__stage">
        <div class="workflow__column">
          <div class="workflow__track-wrap">
            <div
              ref="trackInnerRef"
              class="workflow__track"
              role="tablist"
              aria-label="Pipeline steps"
            >
              <template v-for="(step, index) in steps" :key="step.id">
                <button
                  type="button"
                  role="tab"
                  class="workflow__step"
                  :class="{ 'workflow__step--active': index === activeIndex }"
                  :aria-selected="index === activeIndex"
                  @click="activeIndex = index"
                >
                  <span class="workflow__step-icon" aria-hidden="true">
                    <img :src="workflowIconUrl[step.icon]" alt="" class="workflow__step-icon-img" />
                  </span>
                  <span class="workflow__step-label">{{ step.label }}</span>
                </button>
                <span v-if="index < steps.length - 1" class="workflow__arrow" aria-hidden="true">
                  <img :src="rightArrowUrl" alt="" class="workflow__arrow-img" width="32" height="32" />
                </span>
              </template>
            </div>
          </div>

          <section class="workflow__detail" aria-live="polite">
            <h2 class="workflow__detail-title">{{ steps[activeIndex].detailTitle }}</h2>
            <p class="workflow__detail-body">{{ steps[activeIndex].description }}</p>
          </section>
        </div>
      </div>

      <footer class="workflow__footer">
        <div class="workflow__footer-inner">
          <!-- Native <a> so navigation works even if this page fails to hydrate (e.g. bad chunk MIME behind a proxy). <button @click> requires JS. -->
          <a href="/home" class="workflow__next">Next</a>
        </div>
      </footer>
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import {
  WORKFLOW_PIPELINE_ARROW_URL as rightArrowUrl,
  WORKFLOW_STEP_ICON_URL as workflowIconUrl,
  type WorkflowStepIconKey as StepIcon,
} from '~/utils/workflowPipelineAssets'

const steps: Array<{
  id: string
  label: string
  icon: StepIcon
  detailTitle: string
  description: string
}> = [
  {
    id: 'content',
    label: 'Content',
    icon: 'content',
    detailTitle: 'Content — Source ingestion:',
    description:
      'Acquire original mezzanine-quality video files (ProRes, DNxHR, or uncompressed) from content providers. These masters retain the fullest detail, color depth, and dynamic range — the foundation for everything downstream.',
  },
  {
    id: 'targeting-a',
    label: 'Targeting',
    icon: 'target',
    detailTitle: 'Targeting — Encode profiles:',
    description:
      'Define output profiles and device tiers: resolution ladders, bitrate budgets, HDR/SDR mapping, and codec constraints so downstream packaging meets platform specifications.',
  },
  {
    id: 'metadata',
    label: 'Metadata Extraction',
    icon: 'metadata',
    detailTitle: 'Metadata extraction — Technical inventory:',
    description:
      'Parse technical metadata from sources — frame rate, color space, aspect ratio, audio layout — and normalize it for automated decisions in packaging and validation.',
  },
  {
    id: 'packaging',
    label: 'Packaging',
    icon: 'packaging',
    detailTitle: 'Packaging — Deliverable mux:',
    description:
      'Mux streams into deliverable containers (MP4, DASH, HLS) with aligned segment boundaries, encryption keys where required, and manifest metadata for players.',
  },
  {
    id: 'targeting-b',
    label: 'Targeting',
    icon: 'target',
    detailTitle: 'Targeting — Distribution mapping:',
    description:
      'Map packaged assets to distribution endpoints and CDN behaviors: cache keys, origin shields, and geo rules so audiences receive the correct renditions.',
  },
  {
    id: 'decode',
    label: 'Decode & SR',
    icon: 'decode',
    detailTitle: 'Decode & SR — Detail recovery:',
    description:
      'Decode compressed streams for analysis and apply super-resolution or detail recovery where policy allows — improving perceived sharpness without hallucinated content.',
  },
  {
    id: 'player',
    label: 'Player',
    icon: 'player',
    detailTitle: 'Player — Playback & QoE:',
    description:
      'Playback with adaptive bitrate switching, caption and audio track selection, and quality-of-experience telemetry to close the loop on real-world viewing.',
  },
]

const activeIndex = ref(0)

const trackInnerRef = ref<HTMLElement | null>(null)
const stepsWidthPx = ref(0)

const stepsWidthVar = computed(() => ({
  '--workflow-steps-width': stepsWidthPx.value > 0 ? `${stepsWidthPx.value}px` : '100%',
}))

let trackInnerResizeObserver: ResizeObserver | null = null

function syncStepsWidth() {
  const el = trackInnerRef.value
  if (!el) return
  stepsWidthPx.value = Math.round(el.getBoundingClientRect().width)
}

onMounted(() => {
  syncStepsWidth()
  void nextTick(() => syncStepsWidth())

  const el = trackInnerRef.value
  if (el && typeof ResizeObserver !== 'undefined') {
    trackInnerResizeObserver = new ResizeObserver(() => syncStepsWidth())
    trackInnerResizeObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  trackInnerResizeObserver?.disconnect()
  trackInnerResizeObserver = null
})

useHead({
  title: 'Workflow — RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.workflow__stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-height: 0;
}

.workflow__column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(1.75rem, 4.5vw, 3rem);
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  min-width: 0;
}

.workflow__track-wrap {
  flex: 0 0 auto;
  align-self: stretch;
  overflow-x: hidden;
  overflow-y: visible;
  margin-top: calc(100dvh / 3);
  padding-inline: 0.5rem;
  padding-bottom: 0.5rem;
}

.workflow__track {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0.5rem 0;
  box-sizing: border-box;
  gap: clamp(0.08rem, 1.1vw, 0.65rem);
}

.workflow__step {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.2rem, 0.65vw, 0.5rem);
  box-sizing: border-box;
  padding: clamp(0.35rem, 0.45vw + 0.2rem, 0.65rem) clamp(0.12rem, 0.35vw + 0.1rem, 0.5rem) clamp(0.4rem, 0.5vw + 0.25rem, 0.75rem);
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease;
}

.workflow__step:hover {
  background: rgba(255, 255, 255, 0.04);
}

.workflow__step--active {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.workflow__step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: clamp(1.05rem, 4.2vw + 1.2rem, 3.25rem);
  height: clamp(1.05rem, 4.2vw + 1.2rem, 3.25rem);
}

.workflow__step-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.workflow__step-label {
  font-size: clamp(0.52rem, 0.9vw + 0.45rem, 0.82rem);
  font-weight: 300;
  text-align: center;
  line-height: 1.25;
  max-width: 100%;
  overflow-wrap: break-word;
  hyphens: auto;
  /* Reserve 3 lines so wrapping never changes step / track vertical size */
  min-height: calc(3 * 1.25 * 1em);
  display: grid;
  place-content: center;
  box-sizing: border-box;
}

.workflow__arrow {
  flex: 0 1 1.25rem;
  min-width: 0;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.workflow__arrow-img {
  display: block;
  width: clamp(0.55rem, 1.8vw + 0.35rem, 1.75rem);
  height: auto;
  max-width: 100%;
  object-fit: contain;
}

.workflow__detail {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  min-height: 0;
  min-width: 0;
  width: 100%;
}

.workflow__detail-title {
  margin: 0 0 1rem;
  font-size: clamp(1rem, 2.2vw, 1.2rem);
  font-weight: 700;
  line-height: 1.35;
}

.workflow__detail-body {
  margin: 0;
  font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  font-weight: 300;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
  min-width: 0;
  overflow-wrap: break-word;
}

.workflow__footer {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1.25rem) 0 0;
}

.workflow__footer-inner {
  display: flex;
  justify-content: flex-start;
  width: min(100%, var(--workflow-steps-width, 100%));
  margin-inline: auto;
  min-width: 0;
}

.workflow__next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 0.6rem 2rem;
  border-radius: 999px;
  background: #00ff41;
  color: #000;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.workflow__next:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 10px 32px rgba(0, 255, 65, 0.25);
}

.workflow__next:active {
  transform: translateY(0);
}
</style>
