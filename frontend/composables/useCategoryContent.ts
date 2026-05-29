import {
  listCategories,
  listTranscodedStreamsByCategory,
  listVideosByCategory,
} from '~/api/categories'
import type { RawVideoListItem } from '~/types/api/video'
import type { TranscodedStreamListItem } from '~/types/api/transcoded-stream'
import { extractFileType } from '~/utils/highSpeedActionFilters'

export type ContentPoolItem = {
  id: number
  title: string
  imageUrl: string
  to: string
  createdAt: string
  resolution: string
  fileType: string
  bitrate: number | null
  duration: number | null
}

export type StreamingFileItem = {
  id: number
  title: string
  imageUrl: string
  to: string
  createdAt: string
  resolution: string
  fileType: string
  bitrate: number | null
  duration: number | null
}

function toContentPoolItem(video: RawVideoListItem): ContentPoolItem {
  return {
    id: video.id,
    title: video.name,
    imageUrl: video.cover,
    to: `/content-pool/${video.id}/targeting`,
    createdAt: video.created_at,
    resolution: video.resolution,
    fileType: extractFileType(video.name, video.storage_path, video.video_type),
    bitrate: video.bitrate,
    duration: video.duration,
  }
}

function toStreamingFileItem(stream: TranscodedStreamListItem): StreamingFileItem {
  return {
    id: stream.id,
    title: stream.name,
    imageUrl: stream.cover,
    to: `/content-pool/${stream.video.id}/playback/targeting`,
    createdAt: stream.created_at,
    resolution: stream.resolution,
    fileType: extractFileType(stream.name, stream.stream_url),
    bitrate: stream.bitrate,
    duration: stream.duration,
  }
}

export function useCategoryContent(categoryName: string) {
  const categoryTitle = ref('')
  const contentPool = ref<ContentPoolItem[]>([])
  const streamingFiles = ref<StreamingFileItem[]>([])
  const pending = ref(true)
  const error = ref<Error | null>(null)

  async function refresh() {
    pending.value = true
    error.value = null

    try {
      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.name === categoryName)

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`)
      }

      const [videosResponse, streamsResponse] = await Promise.all([
        listVideosByCategory(category.id, { per_page: 100 }),
        listTranscodedStreamsByCategory(category.id, { per_page: 100 }),
      ])

      categoryTitle.value = category.title
      contentPool.value = videosResponse.data.map(toContentPoolItem)
      streamingFiles.value = streamsResponse.data.map(toStreamingFileItem)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      categoryTitle.value = ''
      contentPool.value = []
      streamingFiles.value = []
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    void refresh()
  })

  return {
    categoryTitle,
    contentPool,
    streamingFiles,
    pending,
    error,
    refresh,
  }
}
