import { listTranscodedStreamsByVideo } from '~/api/videos'
import type { VideoTranscodedStreamItem } from '~/types/api/transcode-task'

function parseVideoId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function usePackaging(poolId: MaybeRefOrGetter<string>) {
  const videoId = computed(() => parseVideoId(toValue(poolId)))

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
    pending,
    error,
    refresh,
  }
}
