import { listTranscodedStreamsByVideo } from '~/api/videos'
import type { VideoTranscodedStreamItem } from '~/types/api/transcode-task'
import {
  findResolutionPreset,
  FIXED_TARGET_FPS,
  loadCompleteTargetingResolutions,
  RESOLUTION_PRESETS,
  streamMatchesTargetingLabel,
} from '~/utils/contentPoolTargeting'

export const PACKAGING_METADATA_TYPE = 'Canny Edge Extraction'

export type PackagingResultItem = {
  resolutionLabel: string
  resolutionDisplay: string
  stream: VideoTranscodedStreamItem | null
  bitrate: number | null
  fps: number | null
}

function parseVideoId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function usePackaging(poolId: MaybeRefOrGetter<string>) {
  const poolIdRef = poolId
  const videoId = computed(() => parseVideoId(toValue(poolIdRef)))

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

  const pending = computed(() => videoPending.value || streamsPending.value)
  const error = computed(() => streamsError.value ?? videoError.value)

  const resultItems = computed<PackagingResultItem[]>(() => {
    const poolId = toValue(poolIdRef)
    const selectedLabels = loadCompleteTargetingResolutions(poolId)
    const labels =
      selectedLabels.length > 0
        ? selectedLabels
        : RESOLUTION_PRESETS.map((preset) => preset.label)

    return labels.map((label) => {
      const preset = findResolutionPreset(label)
      const stream =
        transcodedStreams.value.find((item) =>
          streamMatchesTargetingLabel(item.resolution, label),
        ) ?? null

      return {
        resolutionLabel: label,
        resolutionDisplay:
          stream?.resolution ??
          (preset ? `${preset.width}x${preset.height}` : label),
        stream,
        bitrate: stream?.bitrate ?? preset?.bitrateMbps ?? null,
        fps: stream?.fps ?? FIXED_TARGET_FPS,
      }
    })
  })

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

  return {
    video,
    previewImageUrl,
    transcodedStreams,
    resultItems,
    metadataType: PACKAGING_METADATA_TYPE,
    pending,
    error,
    refresh,
  }
}
