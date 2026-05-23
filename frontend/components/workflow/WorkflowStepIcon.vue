<template>
  <span
    class="workflow-step-icon"
    :style="{ '--step-icon-url': `url('${WORKFLOW_STEP_ICON_URL[icon]}')` }"
  />
</template>

<script setup lang="ts">
import { WORKFLOW_STEP_ICON_URL, type WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

defineProps<{
  icon: WorkflowStepIconKey
}>()
</script>

<style scoped>
.workflow-step-icon {
  width: 100%;
  height: 100%;
  display: block;
  background-color: currentColor;
  -webkit-mask: var(--step-icon-url) center / contain no-repeat;
  mask: var(--step-icon-url) center / contain no-repeat;
}
</style>
