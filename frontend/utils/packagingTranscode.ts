import type { TranscodeBatchCreateBody } from '~/types/api/transcode-task'
import type { TranscodedStreamFile } from '~/types/api/video-collection'
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

export function buildPackagingTranscodeBody(
  poolId: string,
  rawVideoId: number,
): TranscodeBatchCreateBody {
  const savedResolutions = loadCompleteTargetingResolutions(poolId)
  const resolutionLabels =
    savedResolutions.length > 0
      ? savedResolutions
      : [RESOLUTION_PRESETS[0].label]

  const variants = resolutionLabels.map((label) => {
    const resolution = apiResolutionForLabel(label)
    const bitrate = bitrateMbpsForLabel(label)
    if (!resolution || bitrate == null) {
      throw new Error(`Invalid targeting resolution: ${label}`)
    }

    return {
      resolution,
      fps: FIXED_TARGET_FPS,
      bitrate,
    }
  })

  return {
    raw_video_id: rawVideoId,
    metadata_type: 'canny',
    metadata_location: 'metadata_in_manifest',
    variants,
  }
}

function isBatchItemSuccessful(status: number): boolean {
  return status >= 200 && status < 300
}

export function summarizeTranscodeCreateResponse(
  streams: TranscodedStreamFile[],
): Pick<PackagingNotice, 'title' | 'message' | 'success'> {
  if (streams.length === 0) {
    return {
      success: false,
      title: 'Packaging failed',
      message: 'No transcode tasks were created.',
    }
  }

  return {
    success: true,
    title: 'Packaging started',
    message:
      streams.length === 1
        ? 'Transcode task created successfully.'
        : `${streams.length} transcode tasks created successfully.`,
  }
}

/** @deprecated Legacy batch response shape; kept for older callers. */
export function summarizeTranscodeBatchResponse(
  response: { results: Array<{ status: number; message?: string | null; code?: string | null; index: number }> },
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

function formatApiErrorMessage(data: Record<string, unknown>): string | null {
  const details = data.details
  if (Array.isArray(details) && details.length > 0) {
    const lines = details
      .map((detail) => {
        if (!detail || typeof detail !== 'object') return null
        const field = 'field' in detail && typeof detail.field === 'string' ? detail.field : null
        const message =
          'message' in detail && typeof detail.message === 'string' ? detail.message : null
        if (field && message) return `${field}: ${message}`
        return message
      })
      .filter((line): line is string => Boolean(line?.trim()))

    if (lines.length > 0) {
      return lines.join('\n')
    }
  }

  const message = data.message
  return typeof message === 'string' && message.trim() ? message : null
}

export function packagingNoticeFromError(error: unknown): Pick<PackagingNotice, 'title' | 'message' | 'success'> {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data
    if (data && typeof data === 'object') {
      const message = formatApiErrorMessage(data as Record<string, unknown>)
      if (message) {
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
