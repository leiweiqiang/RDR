<template>
  <ol class="hsa__stepper" aria-label="Workflow progress">
    <template v-for="(step, index) in steps" :key="step.id">
      <li class="hsa__step" :class="stepClassForId(step.id)">
        <NuxtLink :to="step.to" class="hsa__step-link">
          <span class="hsa__step-icon" aria-hidden="true">
            <WorkflowStepIcon :icon="step.icon" class="hsa__step-icon-img" />
          </span>
          <span class="hsa__step-label">{{ step.label }}</span>
        </NuxtLink>
      </li>
      <li v-if="index < steps.length - 1" class="hsa__step-sep" aria-hidden="true">
        <img :src="WORKFLOW_PIPELINE_ARROW_URL" alt="" class="hsa__step-sep-img" width="24" height="24" />
      </li>
    </template>
  </ol>
</template>

<script setup lang="ts">
import { WORKFLOW_PIPELINE_ARROW_URL, type WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

defineProps<{
  steps: Array<{ id: string; label: string; to: string; icon: WorkflowStepIconKey }>
  stepClassForId: (id: string) => Record<string, boolean>
}>()
</script>

<style scoped>
.hsa__stepper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
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

.hsa__step-icon-img {
  width: 100%;
  height: 100%;
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

.hsa__step--done .hsa__step-icon {
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

.hsa__step--current .hsa__step-icon {
  color: #00f0ff;
}

.hsa__step--upcoming {
  color: #5c5c5c;
}

.hsa__step--upcoming .hsa__step-label {
  color: #6a6a6a;
}

.hsa__step--upcoming .hsa__step-icon {
  color: #6a6a6a;
}

.hsa__step-sep {
  display: flex;
  align-items: center;
  align-self: flex-start;
  padding: 0.42rem 0.06rem 0;
  margin: 0;
  list-style: none;
  pointer-events: none;
}

.hsa__step-sep-img {
  display: block;
  width: clamp(0.85rem, 1.6vw, 1.1rem);
  height: auto;
  object-fit: contain;
  opacity: 0.72;
}

@media (max-width: 520px) {
  .hsa__step-sep-img {
    width: clamp(0.72rem, 3vw, 0.9rem);
    opacity: 0.55;
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
