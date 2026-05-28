import type {
  TranscodeParams,
  TranscodeTaskBatchResponse,
} from '~/types/api/transcode-task'
import {
  apiResolutionForLabel,
  bitrateMbpsForLabel,
  FIXED_TARGET_FPS,
  loadCompleteTargetingResolutions,
  RESOLUTION_PRESETS,
} from '~/utils/contentPoolTargeting'

export type PackagingNotice = {
  open: boolean
  title: string
  message: string
  success: boolean
}

export function createClosedPackagingNotice(): PackagingNotice {
  return {
    open: false,
    title: '',
    message: '',
    success: false,
  }
}

export function buildPackagingTranscodeParams(poolId: string): TranscodeParams[] {
  const savedResolutions = loadCompleteTargetingResolutions(poolId)
  const resolutionLabels =
    savedResolutions.length > 0
      ? savedResolutions
      : [RESOLUTION_PRESETS[0].label]

  return resolutionLabels.map((label) => {
    const resolution = apiResolutionForLabel(label)
    const bitrate = bitrateMbpsForLabel(label)
    if (!resolution || bitrate == null) {
      throw new Error(`Invalid targeting resolution: ${label}`)
    }

    return {
      transcode: {
        resolution,
        fps: FIXED_TARGET_FPS,
        bitrate,
      },
      metadata_extractor: {
        processor: 'canny',
        canny_gaussian_sigma: 1.4,
        canny_lower_factor: 0.1,
        canny_upper_factor: 0.3,
      },
    }
  })
}

function isBatchItemSuccessful(status: number): boolean {
  return status >= 200 && status < 300
}

export function summarizeTranscodeBatchResponse(
  response: TranscodeTaskBatchResponse,
): Pick<PackagingNotice, 'title' | 'message' | 'success'> {
  const succeeded = response.results.filter((item) => isBatchItemSuccessful(item.status))
  const failed = response.results.filter((item) => !isBatchItemSuccessful(item.status))

  if (failed.length === 0) {
    return {
      success: true,
      title: 'Packaging started',
      message:
        succeeded.length === 1
          ? 'Transcode task created successfully.'
          : `${succeeded.length} transcode tasks created successfully.`,
    }
  }

  const failureLines = failed.map((item) => {
    const label = item.message || item.code || `Task ${item.index + 1} failed`
    return `• ${label}`
  })

  if (succeeded.length > 0) {
    return {
      success: false,
      title: 'Packaging partially failed',
      message: `${succeeded.length} task(s) succeeded and ${failed.length} failed.\n${failureLines.join('\n')}`,
    }
  }

  return {
    success: false,
    title: 'Packaging failed',
    message: failureLines.join('\n') || 'Failed to create transcode tasks.',
  }
}

export function packagingNoticeFromError(error: unknown): Pick<PackagingNotice, 'title' | 'message' | 'success'> {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message
      if (typeof message === 'string' && message.trim()) {
        return {
          success: false,
          title: 'Packaging failed',
          message,
        }
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return {
      success: false,
      title: 'Packaging failed',
      message: error.message,
    }
  }

  return {
    success: false,
    title: 'Packaging failed',
    message: 'Failed to create transcode tasks.',
  }
}
