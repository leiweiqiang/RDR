<template>
  <span class="workflow-step-icon" aria-hidden="true" v-html="svgMarkup" />
</template>

<script setup lang="ts">
import iconContentRaw from '~/assets/icon-content.svg?raw'
import iconDecodeSrRaw from '~/assets/icon-decode-sr.svg?raw'
import iconMetadataRaw from '~/assets/icon-metadata.svg?raw'
import iconPackagingRaw from '~/assets/icon-packaging.svg?raw'
import iconPlayerRaw from '~/assets/icon-player.svg?raw'
import iconTargetingRaw from '~/assets/icon-targeting.svg?raw'
import type { WorkflowStepIconKey } from '~/utils/workflowPipelineAssets'

const props = defineProps<{
  icon: WorkflowStepIconKey
}>()

function colorizeSvg(raw: string): string {
  const withClass = raw.replace(/<svg\b/, '<svg class="workflow-step-icon__svg"')
  const parts = withClass.split(/(<defs[\s\S]*?<\/defs>)/gi)

  return parts
    .map((part) => {
      if (/^<defs/i.test(part)) return part
      return part
        .replace(/fill="white"/gi, 'fill="currentColor"')
        .replace(/stroke="white"/gi, 'stroke="currentColor"')
    })
    .join('')
}

const svgByIcon: Record<WorkflowStepIconKey, string> = {
  content: colorizeSvg(iconContentRaw),
  target: colorizeSvg(iconTargetingRaw),
  metadata: colorizeSvg(iconMetadataRaw),
  packaging: colorizeSvg(iconPackagingRaw),
  decode: colorizeSvg(iconDecodeSrRaw),
  player: colorizeSvg(iconPlayerRaw),
}

const svgMarkup = computed(() => svgByIcon[props.icon])
</script>

<style scoped>
.workflow-step-icon {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
}

.workflow-step-icon :deep(.workflow-step-icon__svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
