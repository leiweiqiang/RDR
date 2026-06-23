import { getVideoCollection } from '~/api/video-collections'
import type { VideoCollectionDetail } from '~/types/api/video-collection'
import type { RawVideoListItem } from '~/types/api/video'

export function formatResolutionLabel(resolution: string): string {
  const match = resolution.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/)
  if (!match) return resolution
  const width = Number.parseInt(match[1], 10)
  if (width >= 3840) return '4K'
  if (width >= 1920) return '1080p'
  if (width >= 1280) return '720p'
  if (width >= 640) return '360p'
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

function parseCollectionId(poolId: string): number | null {
  const n = Number.parseInt(poolId, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

function mapCollectionToVideo(collection: VideoCollectionDetail): RawVideoListItem {
  const raw = collection.raw_video

  return {
    id: raw?.id ?? collection.id,
    name: collection.name,
    cover: collection.cover,
    canny_cover: raw?.canny_cover ?? null,
    provider: collection.provider,
    storage_path: raw?.storage_path ?? '',
    duration: collection.duration,
    resolution: raw?.resolution ?? '',
    fps: raw?.fps ?? null,
    bitrate: raw?.bitrate ?? null,
    video_type: raw?.video_type ?? '',
    created_at: collection.created_at,
    updated_at: collection.updated_at,
  }
}

function isDemoPoolId(poolId: string): boolean {
  return /^pool-\d+$/i.test(poolId)
}

export function useContentPoolVideo(poolId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(poolId))
  const collectionId = computed(() => parseCollectionId(id.value))

  const { previewImageUrl: demoPreviewUrl } = useContentPoolPreview(poolId)

  const video = ref<RawVideoListItem | null>(null)
  const transcodedStreamResolutions = ref<string[]>([])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const previewImageUrl = computed(() => {
    if (video.value?.cover) return video.value.cover
    if (isDemoPoolId(id.value)) return demoPreviewUrl.value
    return ''
  })
  const originalMeta = computed(() =>
    video.value ? formatVideoOriginalMeta(video.value) : 'Original: —',
  )

  async function refresh() {
    const cid = collectionId.value
    if (cid == null) {
      video.value = null
      transcodedStreamResolutions.value = []
      error.value = null
      pending.value = false
      return
    }

    pending.value = true
    error.value = null
    video.value = null
    transcodedStreamResolutions.value = []

    try {
      const collection = await getVideoCollection(cid)
      video.value = mapCollectionToVideo(collection)
      transcodedStreamResolutions.value = collection.transcoded_stream_files.map(
        (stream) => stream.resolution,
      )
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      video.value = null
      transcodedStreamResolutions.value = []
    } finally {
      pending.value = false
    }
  }

  watch(
    collectionId,
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    video,
    transcodedStreamResolutions,
    previewImageUrl,
    originalMeta,
    pending,
    error,
    refresh,
  }
}
