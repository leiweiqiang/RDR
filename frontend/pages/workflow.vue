<template>
  <div class="workflow">
    <div class="workflow__glow workflow__glow--red" aria-hidden="true" />
    <div class="workflow__glow workflow__glow--red-center" aria-hidden="true" />
    <div class="workflow__spotlight" aria-hidden="true" />

    <div class="workflow__noise" aria-hidden="true">
      <svg class="workflow__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="workflow-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#workflow-noise)" />
      </svg>
    </div>

    <div class="workflow__inner" :style="stepsWidthVar">
      <div class="workflow__stage">
        <div class="workflow__column">
          <div class="workflow__track-wrap">
            <div class="workflow__track">
              <div
                ref="trackInnerRef"
                class="workflow__track-inner"
                role="tablist"
                aria-label="Pipeline steps"
              >
                <template v-for="(step, index) in steps" :key="step.id">
                  <NuxtLink
                    v-if="step.id === 'content'"
                    to="/high-speed-action"
                    role="tab"
                    class="workflow__step"
                    :class="{ 'workflow__step--active': index === activeIndex }"
                    :aria-selected="index === activeIndex"
                    @click="activeIndex = index"
                  >
                    <span class="workflow__step-icon" aria-hidden="true">
                      <WorkflowIcon :name="step.icon" />
                    </span>
                    <span class="workflow__step-label">{{ step.label }}</span>
                  </NuxtLink>
                  <button
                    v-else
                    type="button"
                    role="tab"
                    class="workflow__step"
                    :class="{ 'workflow__step--active': index === activeIndex }"
                    :aria-selected="index === activeIndex"
                    @click="activeIndex = index"
                  >
                    <span class="workflow__step-icon" aria-hidden="true">
                      <WorkflowIcon :name="step.icon" />
                    </span>
                    <span class="workflow__step-label">{{ step.label }}</span>
                  </button>
                  <span v-if="index < steps.length - 1" class="workflow__arrow" aria-hidden="true">→</span>
                </template>
              </div>
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
          <button type="button" class="workflow__next" @click="goNext">Next</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, type PropType, type VNode } from 'vue'

type StepIcon = 'content' | 'target' | 'metadata' | 'packaging' | 'decode' | 'player'

function iconGraphic(name: StepIcon): VNode {
  switch (name) {
    case 'content':
      return h('g', [
        h('rect', { x: '5', y: '10', width: '22', height: '14', rx: '2', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('path', { d: 'M5 14h22', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('path', { d: 'M10 7l4 3H9l4-3z', stroke: 'currentColor', 'stroke-width': '1.2', 'stroke-linejoin': 'round' }),
        h('path', { d: 'M14 16l6 3.5v-7L14 16z', fill: 'currentColor' }),
      ])
    case 'target':
      return h('g', [
        h('circle', { cx: '16', cy: '16', r: '10', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('circle', { cx: '16', cy: '16', r: '6', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('circle', { cx: '16', cy: '16', r: '2', fill: 'currentColor' }),
      ])
    case 'metadata':
      return h('g', [
        h('path', {
          d: 'M9 6h8a4 4 0 014 4v12a4 4 0 01-4 4H9a4 4 0 01-4-4V10a4 4 0 014-4z',
          stroke: 'currentColor',
          'stroke-width': '1.5',
        }),
        h('path', { d: 'M22 12l5-3v14l-5-3', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linejoin': 'round' }),
      ])
    case 'packaging':
      return h('g', [
        h('path', {
          d: 'M6 12l10-4 10 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V12z',
          stroke: 'currentColor',
          'stroke-width': '1.5',
          'stroke-linejoin': 'round',
        }),
        h('path', { d: 'M6 12l10 4 10-4M16 16v12', stroke: 'currentColor', 'stroke-width': '1.5' }),
      ])
    case 'decode':
      return h('g', [
        h('rect', { x: '7', y: '7', width: '18', height: '18', rx: '2', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('path', {
          d: 'M11 21V11h3.5c2 0 3.5 1.2 3.5 3s-1.4 3-3.6 3H13v4',
          stroke: 'currentColor',
          'stroke-width': '1.5',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
        h('circle', { cx: '21', cy: '11', r: '1.2', fill: 'currentColor' }),
      ])
    case 'player':
      return h('g', [
        h('rect', { x: '6', y: '8', width: '20', height: '16', rx: '2', stroke: 'currentColor', 'stroke-width': '1.5' }),
        h('path', { d: 'M14 13l6 3.5L14 20v-7z', fill: 'currentColor' }),
      ])
  }
}

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

function goNext() {
  void navigateTo('/home')
}

const WorkflowIcon = defineComponent({
  name: 'WorkflowIcon',
  props: {
    name: {
      type: String as PropType<StepIcon>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('svg', {
        viewBox: '0 0 32 32',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        class: 'workflow__svg',
        'aria-hidden': 'true',
      }, [iconGraphic(props.name as StepIcon)])
  },
})

useHead({
  title: 'Workflow — RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.workflow {
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

.workflow__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.workflow__glow--red {
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

.workflow__glow--red-center {
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

.workflow__spotlight {
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

.workflow__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.workflow__noise-svg {
  width: 100%;
  height: 100%;
}

.workflow__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: clamp(1.25rem, 4vw, 2rem) clamp(1rem, 3vw, 2.5rem) clamp(1.25rem, 4vw, 2rem);
  max-width: min(100%, 1520px);
  margin: 0 auto;
}

.workflow__stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  min-height: 0;
}

.workflow__column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(1.75rem, 4.5vw, 3rem);
  width: min(100%, var(--workflow-steps-width, 100%));
  margin-inline: auto;
  min-width: 0;
}

.workflow__track-wrap {
  flex: 0 0 auto;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.workflow__track {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: min-content;
  padding: 0.5rem 0;
}

.workflow__track-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(0.5rem, 1.6vw, 1rem);
  flex: 0 0 auto;
  min-width: min-content;
}

.workflow__step {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: clamp(6rem, 14vw, 9.5rem);
  min-width: 5.75rem;
  padding: 0.65rem 0.5rem 0.75rem;
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
  width: clamp(2.75rem, 5.5vw, 3.25rem);
  height: clamp(2.75rem, 5.5vw, 3.25rem);
  color: #fff;
}

.workflow__svg {
  width: 100%;
  height: 100%;
}

.workflow__step-label {
  font-size: clamp(0.65rem, 1.5vw, 0.82rem);
  font-weight: 500;
  text-align: center;
  line-height: 1.25;
  max-width: 100%;
}

.workflow__arrow {
  flex: 0 0 auto;
  align-self: center;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: rgba(255, 255, 255, 0.75);
  user-select: none;
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
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
  min-width: 0;
  overflow-wrap: break-word;
}

.workflow__footer {
  flex: 0 0 auto;
  width: 100%;
  padding-top: clamp(0.75rem, 2vw, 1.25rem);
}

.workflow__footer-inner {
  display: flex;
  justify-content: flex-start;
  width: min(100%, var(--workflow-steps-width, 100%));
  margin-inline: auto;
  min-width: 0;
}

.workflow__next {
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

@media (max-width: 640px) {
  .workflow__track {
    justify-content: flex-start;
  }
}
</style>
