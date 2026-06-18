import { listCategories, listVideoCollectionsByCategory } from '~/api/categories'
import type { VideoCollectionListItem } from '~/types/api/video-collection'
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

function toContentPoolItem(
  categoryId: number,
  collection: VideoCollectionListItem,
): ContentPoolItem {
  return {
    id: collection.id,
    title: collection.name,
    imageUrl: collection.cover,
    to: `/collections/${categoryId}/collection/${collection.id}`,
    createdAt: collection.created_at,
    resolution: '',
    fileType: extractFileType(collection.name),
    bitrate: null,
    duration: collection.duration,
  }
}

function parseCategoryId(value: string | number): number | null {
  const n = typeof value === 'number' ? value : Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function useCategoryContentById(categoryId: MaybeRefOrGetter<string | number>) {
  const categoryTitle = ref('')
  const categoryName = ref('')
  const contentPool = ref<ContentPoolItem[]>([])
  const pending = ref(true)
  const error = ref<Error | null>(null)

  async function refresh() {
    const cid = parseCategoryId(toValue(categoryId))
    pending.value = true
    error.value = null

    if (cid == null) {
      categoryTitle.value = ''
      categoryName.value = ''
      contentPool.value = []
      pending.value = false
      return
    }

    try {
      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.id === cid)

      if (!category) {
        throw new Error(`Category id "${cid}" not found`)
      }

      const collectionsResponse = await listVideoCollectionsByCategory(category.id, { per_page: 100 })

      categoryTitle.value = category.title
      categoryName.value = category.name
      contentPool.value = collectionsResponse.data.map((collection) =>
        toContentPoolItem(category.id, collection),
      )
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      categoryTitle.value = ''
      categoryName.value = ''
      contentPool.value = []
    } finally {
      pending.value = false
    }
  }

  watch(
    () => toValue(categoryId),
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    categoryTitle,
    categoryName,
    contentPool,
    pending,
    error,
    refresh,
  }
}

export function useCategoryContent(categoryName: string) {
  const categoryTitle = ref('')
  const contentPool = ref<ContentPoolItem[]>([])
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

      const collectionsResponse = await listVideoCollectionsByCategory(category.id, { per_page: 100 })

      categoryTitle.value = category.title
      contentPool.value = collectionsResponse.data.map((collection) =>
        toContentPoolItem(category.id, collection),
      )
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      categoryTitle.value = ''
      contentPool.value = []
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
    pending,
    error,
    refresh,
  }
}
