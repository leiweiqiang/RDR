import { getVideo } from '~/api/videos'
import type { RawVideoListItem } from '~/types/api/video'

function formatResolutionLabel(resolution: string): string {
  const match = resolution.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/)
  if (!match) return resolution
  const width = Number.parseInt(match[1], 10)
  if (width >= 3840) return '4K'
  if (width >= 2560) return '2K'
  if (width >= 1920) return '1080p'
  if (width >= 1280) return '720p'
  return resolution
}

export function formatVideoOriginalMeta(video: RawVideoListItem): string {
  const parts: string[] = []
  if (video.resolution) {
    parts.push(formatResolutionLabel(video.resolution))
  }
  if (video.fps != null) {
    parts.push(`${video.fps} fps`)
  }
  return parts.length ? `Original: ${parts.join(', ')}` : 'Original'
}

function parseVideoId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function useContentPoolVideo(poolId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(poolId))
  const videoId = computed(() => parseVideoId(id.value))

  const { previewImageUrl: fallbackPreviewUrl } = useContentPoolPreview(poolId)

  const video = ref<RawVideoListItem | null>(null)
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const previewImageUrl = computed(() => video.value?.cover ?? fallbackPreviewUrl.value)
  const originalMeta = computed(() =>
    video.value ? formatVideoOriginalMeta(video.value) : 'Original: —',
  )

  async function refresh() {
    const vid = videoId.value
    if (vid == null) {
      video.value = null
      error.value = null
      pending.value = false
      return
    }

    pending.value = true
    error.value = null

    try {
      video.value = await getVideo(vid)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      video.value = null
    } finally {
      pending.value = false
    }
  }

  watch(
    videoId,
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    video,
    previewImageUrl,
    originalMeta,
    pending,
    error,
    refresh,
  }
}
