import { createTranscodeBatch } from '~/api/transcoded-streams'
import { getVideoCollection } from '~/api/video-collections'
import type { TranscodedStreamFile } from '~/types/api/video-collection'
import {
  buildPackagingTranscodeBody,
  createClosedPackagingNotice,
  packagingNoticeFromError,
  summarizeTranscodeCreateResponse,
  type PackagingNotice,
} from '~/utils/packagingTranscode'
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
  stream: TranscodedStreamFile | null
  bitrate: number | null
  fps: number | null
}

function parseCollectionId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function usePackaging(poolId: MaybeRefOrGetter<string>) {
  const poolIdRef = poolId
  const collectionId = computed(() => parseCollectionId(toValue(poolIdRef)))

  const {
    video,
    categoryId,
    previewImageUrl,
    pending: videoPending,
    error: videoError,
    refresh: refreshVideo,
  } = useContentPoolVideo(poolId)

  const transcodedStreams = ref<TranscodedStreamFile[]>([])
  const streamsPending = ref(false)
  const streamsError = ref<Error | null>(null)
  const packagingPending = ref(false)
  const packagingNotice = ref<PackagingNotice>(createClosedPackagingNotice())

  const rawVideoId = computed(() => video.value?.id ?? null)

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
    const cid = collectionId.value
    if (cid == null) {
      transcodedStreams.value = []
      streamsError.value = null
      streamsPending.value = false
      return
    }

    streamsPending.value = true
    streamsError.value = null

    try {
      const collection = await getVideoCollection(cid)
      transcodedStreams.value = collection.transcoded_stream_files
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

  function closePackagingNotice() {
    packagingNotice.value = createClosedPackagingNotice()
  }

  async function runPackaging() {
    const rawId = rawVideoId.value
    const poolId = toValue(poolIdRef)

    if (rawId == null) {
      packagingNotice.value = {
        open: true,
        success: false,
        title: 'Packaging failed',
        message: 'Video is not available.',
      }
      return
    }

    packagingPending.value = true

    try {
      const body = buildPackagingTranscodeBody(poolId, rawId)
      const response = await createTranscodeBatch(body)
      packagingNotice.value = {
        open: true,
        ...summarizeTranscodeCreateResponse(response),
      }
      if (packagingNotice.value.success) {
        await refreshStreams()
      }
    } catch (err) {
      packagingNotice.value = {
        open: true,
        ...packagingNoticeFromError(err),
      }
    } finally {
      packagingPending.value = false
    }
  }

  watch(
    collectionId,
    () => {
      void refreshStreams()
    },
    { immediate: true },
  )

  return {
    video,
    categoryId,
    collectionId,
    previewImageUrl,
    transcodedStreams,
    resultItems,
    metadataType: PACKAGING_METADATA_TYPE,
    pending,
    error,
    packagingPending,
    packagingNotice,
    runPackaging,
    closePackagingNotice,
    refresh,
  }
}
