import {
  createTranscodeTasks,
  listTranscodedStreamsByVideo,
} from '~/api/videos'
import type { TranscodeParams, VideoTranscodedStreamItem } from '~/types/api/transcode-task'
import {
  apiResolutionForLabel,
  bitrateMbpsForLabel,
  FIXED_TARGET_FPS,
  formatTargetingSelectionSummary,
  loadCompleteTargetingResolutions,
  RESOLUTION_PRESETS,
  streamMatchesTargetingLabel,
} from '~/utils/contentPoolTargeting'

export type MetadataReviewerItem = {
  resolutionLabel: string
  summary: string
  stream: VideoTranscodedStreamItem | null
}

function parseVideoId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function formatStreamSummary(stream: VideoTranscodedStreamItem): string {
  const resolution = stream.resolution.replace(/x/i, ' X ')
  const parts: string[] = [resolution]
  if (stream.fps != null) parts.push(`${stream.fps} fps`)
  if (stream.bitrate != null) parts.push(`${stream.bitrate} Mbps`)
  return parts.join(', ')
}

export function useMetadataExtraction(poolId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(poolId))
  const videoId = computed(() => parseVideoId(id.value))

  const {
    video,
    previewImageUrl,
    pending: videoPending,
    error: videoError,
    refresh: refreshVideo,
  } = useContentPoolVideo(poolId)

  const transcodedStreams = ref<VideoTranscodedStreamItem[]>([])
  const streamsPending = ref(false)
  const streamsError = ref<Error | null>(null)
  const generating = ref(false)
  const generateError = ref<Error | null>(null)

  const cannyCoverUrl = computed(() => video.value?.canny_cover ?? '')
  const pending = computed(() => videoPending.value || streamsPending.value)
  const error = computed(() => streamsError.value ?? videoError.value)

  const targetingResolutions = computed(() => loadCompleteTargetingResolutions(id.value))

  const reviewerItems = computed<MetadataReviewerItem[]>(() =>
    targetingResolutions.value.map((label) => ({
      resolutionLabel: label,
      summary: formatTargetingSelectionSummary(label),
      stream:
        transcodedStreams.value.find((s) =>
          streamMatchesTargetingLabel(s.resolution, label),
        ) ?? null,
    })),
  )

  async function refreshStreams() {
    const vid = videoId.value
    if (vid == null) {
      transcodedStreams.value = []
      streamsError.value = null
      streamsPending.value = false
      return
    }

    streamsPending.value = true
    streamsError.value = null

    try {
      const response = await listTranscodedStreamsByVideo(vid, { per_page: 100 })
      transcodedStreams.value = response.data
    } catch (err) {
      streamsError.value = err instanceof Error ? err : new Error(String(err))
      transcodedStreams.value = []
    } finally {
      streamsPending.value = false
    }
  }

  async function refresh() {
    await Promise.all([refreshVideo(), refreshStreams()])
  }

  watch(
    videoId,
    () => {
      void refreshStreams()
    },
    { immediate: true },
  )

  async function generateMetadata(includeCanny: boolean) {
    const vid = videoId.value
    if (vid == null || !includeCanny) return false

    generating.value = true
    generateError.value = null

    const savedResolutions = loadCompleteTargetingResolutions(id.value)
    const resolutionLabels =
      savedResolutions.length > 0
        ? savedResolutions
        : [RESOLUTION_PRESETS[0].label]

    const params: TranscodeParams[] = resolutionLabels.map((label) => {
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

    try {
      await createTranscodeTasks(vid, { params })
      await refreshStreams()
      return true
    } catch (err) {
      generateError.value = err instanceof Error ? err : new Error(String(err))
      return false
    } finally {
      generating.value = false
    }
  }

  return {
    video,
    previewImageUrl,
    cannyCoverUrl,
    transcodedStreams,
    reviewerItems,
    targetingResolutions,
    pending,
    error,
    generating,
    generateError,
    refresh,
    refreshStreams,
    generateMetadata,
  }
}
