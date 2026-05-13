import iconContentUrl from '~/assets/icon-content.svg?url'
import iconDecodeSrUrl from '~/assets/icon-decode-sr.svg?url'
import iconMetadataUrl from '~/assets/icon-metadata.svg?url'
import iconPackagingUrl from '~/assets/icon-packaging.svg?url'
import iconPlayerUrl from '~/assets/icon-player.svg?url'
import iconTargetingUrl from '~/assets/icon-targeting.svg?url'
import rightArrowUrl from '~/assets/right-arrow.png?url'

export type WorkflowStepIconKey = 'content' | 'target' | 'metadata' | 'packaging' | 'decode' | 'player'

export const WORKFLOW_STEP_ICON_URL: Record<WorkflowStepIconKey, string> = {
  content: iconContentUrl,
  target: iconTargetingUrl,
  metadata: iconMetadataUrl,
  packaging: iconPackagingUrl,
  decode: iconDecodeSrUrl,
  player: iconPlayerUrl,
}

export const WORKFLOW_PIPELINE_ARROW_URL = rightArrowUrl
