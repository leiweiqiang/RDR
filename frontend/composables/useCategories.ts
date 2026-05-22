import { listCategories } from '~/api/categories'
import type { CategoryResponse } from '~/types/api/category'

export type CategoryCard = {
  id: number
  name: string
  title: string
  subtitle: string
  images: string[]
}

function toCategoryCard(category: CategoryResponse): CategoryCard {
  return {
    id: category.id,
    name: category.name,
    title: category.title,
    subtitle: category.description ?? '',
    images: [category.cover],
  }
}

export function useCategories() {
  const categories = ref<CategoryCard[]>([])
  const pending = ref(true)
  const error = ref<Error | null>(null)

  async function refresh() {
    pending.value = true
    error.value = null

    try {
      const response = await listCategories({ per_page: 100 })
      categories.value = response.data.map(toCategoryCard)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      categories.value = []
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    void refresh()
  })

  return {
    categories,
    pending,
    error,
    refresh,
  }
}
