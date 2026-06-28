<template>
  <AppWorkspaceShell>
    <div class="workflow">
      <div class="workflow__hourglass" aria-hidden="true">
        <div class="workflow__tri workflow__tri--left" />
        <div class="workflow__tri workflow__tri--right" />
      </div>

      <div class="app-page-inner workflow__inner">
      <div class="workflow__stage">
        <div class="workflow__hero">
          <p class="workflow__caption">原始4K视屏</p>

          <div
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
      </div>

      <div class="workflow__bottom">
        <section class="workflow__detail" aria-live="polite">
          <h2 class="workflow__detail-title">{{ steps[activeIndex].detailTitle }}</h2>
          <p class="workflow__detail-body">{{ steps[activeIndex].description }}</p>
        </section>

        <footer class="workflow__footer">
          <a href="/home" class="workflow__next">Next</a>
        </footer>
      </div>
      </div>
    </div>
  </AppWorkspaceShell>
</template>

<script setup lang="ts">
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
    id: 'packaging',
    label: 'Metadata Generation & Packaging',
    icon: 'packaging',
    detailTitle: 'Metadata Generation & Packaging — RDR bitstream:',
    description:
      'Synchronize and encapsulate extracted RDR metadata with the source video essence to generate a standardized, AI-enhanced bitstream for downstream TCON processing.',
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
.workflow {
  position: relative;
  min-height: 100dvh;
}

.workflow__hourglass {
  position: fixed;
  top: clamp(5.5rem, 14vh, 9.5rem);
  bottom: clamp(5.5rem, 14vh, 9.5rem);
  left: clamp(3rem, 8vw, 6.25rem);
  right: clamp(3rem, 8vw, 6.25rem);
  z-index: 0;
  pointer-events: none;
}

.workflow__tri {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
}

.workflow__tri--left {
  left: 0;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(255, 255, 255, 0.08) 38%,
    rgba(255, 255, 255, 0.03) 68%,
    transparent 100%
  );
}

.workflow__tri--right {
  right: 0;
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.07) 38%,
    rgba(255, 255, 255, 0.025) 68%,
    transparent 100%
  );
}

.workflow__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: min(100%, 72rem);
  margin-inline: auto;
  box-sizing: border-box;
}

.workflow__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding-block: clamp(1rem, 4vh, 2.5rem) clamp(0.5rem, 2vh, 1rem);
}

.workflow__hero {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  width: 100%;
  min-width: 0;
}

.workflow__bottom {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  width: 100%;
  max-width: 42rem;
  padding-bottom: clamp(0.25rem, 1vh, 0.5rem);
}

.workflow__caption {
  margin: 0;
  font-size: clamp(1.35rem, 2.8vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
}

.workflow__track {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0.5rem 0;
  box-sizing: border-box;
  gap: clamp(0.15rem, 1.2vw, 0.75rem);
}

.workflow__step {
  flex: 1 1 0;
  min-width: 0;
  max-width: 11rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.35rem, 0.8vw, 0.65rem);
  box-sizing: border-box;
  padding: clamp(0.55rem, 1vw, 0.85rem) clamp(0.35rem, 0.8vw, 0.65rem);
  border: none;
  border-radius: 14px;
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
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.workflow__step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: clamp(2rem, 5vw, 3.25rem);
  height: clamp(2rem, 5vw, 3.25rem);
}

.workflow__step-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.workflow__step-label {
  font-size: clamp(0.62rem, 1vw + 0.2rem, 0.82rem);
  font-weight: 300;
  text-align: center;
  line-height: 1.25;
  max-width: 100%;
  overflow-wrap: break-word;
  hyphens: auto;
  min-height: calc(3 * 1.25 * 1em);
  display: grid;
  place-content: center;
  box-sizing: border-box;
}

.workflow__arrow {
  flex: 0 1 1.5rem;
  min-width: 0;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.workflow__arrow-img {
  display: block;
  width: clamp(0.75rem, 2vw, 1.5rem);
  height: auto;
  max-width: 100%;
  object-fit: contain;
}

.workflow__detail {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  width: 100%;
}

.workflow__detail-title {
  margin: 0 0 0.75rem;
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
  flex: 0 0 auto;
  width: auto;
  padding: 0;
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

@media (max-width: 720px) {
  .workflow__track {
    flex-wrap: wrap;
    justify-content: center;
  }

  .workflow__step {
    flex: 1 1 calc(50% - 1rem);
    max-width: none;
  }

  .workflow__arrow {
    display: none;
  }
}
</style>
