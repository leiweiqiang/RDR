import {
  listCategories,
  listTranscodedStreamsByCategory,
  listVideosByCategory,
} from '~/api/categories'
import type { RawVideoListItem } from '~/types/api/video'
import type { TranscodedStreamListItem } from '~/types/api/transcoded-stream'

export type ContentPoolItem = {
  id: number
  title: string
  imageUrl: string
  to: string
}

export type StreamingFileItem = {
  id: number
  title: string
  imageUrl: string
  to: string
}

export type CategoryContent = {
  categoryTitle: string
  contentPool: ContentPoolItem[]
  streamingFiles: StreamingFileItem[]
}

function toContentPoolItem(video: RawVideoListItem): ContentPoolItem {
  return {
    id: video.id,
    title: video.name,
    imageUrl: video.cover,
    to: `/content-pool/${video.id}/targeting`,
  }
}

function toStreamingFileItem(stream: TranscodedStreamListItem): StreamingFileItem {
  return {
    id: stream.id,
    title: stream.name,
    imageUrl: stream.cover,
    to: `/streaming_file/${stream.id}`,
  }
}

export function useCategoryContent(categoryName: string) {
  const { data, pending, error, refresh } = useAsyncData(
    `category-content-${categoryName}`,
    async (): Promise<CategoryContent> => {
      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.name === categoryName)

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`)
      }

      const [videosResponse, streamsResponse] = await Promise.all([
        listVideosByCategory(category.id, { per_page: 100 }),
        listTranscodedStreamsByCategory(category.id, { per_page: 100 }),
      ])

      return {
        categoryTitle: category.title,
        contentPool: videosResponse.data.map(toContentPoolItem),
        streamingFiles: streamsResponse.data.map(toStreamingFileItem),
      }
    },
    { server: false },
  )

  const categoryTitle = computed(() => data.value?.categoryTitle ?? '')
  const contentPool = computed(() => data.value?.contentPool ?? [])
  const streamingFiles = computed(() => data.value?.streamingFiles ?? [])

  return {
    categoryTitle,
    contentPool,
    streamingFiles,
    pending,
    error,
    refresh,
  }
}
