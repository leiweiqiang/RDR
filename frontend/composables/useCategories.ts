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
  const { data, pending, error, refresh } = useLazyAsyncData(
    'categories-list',
    async () => {
      const response = await listCategories({ per_page: 100 })
      return response.data.map(toCategoryCard)
    },
    {
      server: false,
      default: () => [] as CategoryCard[],
    },
  )

  const categories = computed(() => data.value ?? [])

  return {
    categories,
    pending,
    error,
    refresh,
  }
}
