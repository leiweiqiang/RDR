import type { PaginationMeta } from './common'

export type CategoryResponse = {
  id: number
  name: string
  title: string
  description: string | null
  cover: string
  created_at: string
  updated_at: string
}

export type CategoryListResponse = {
  data: CategoryResponse[]
  pagination: PaginationMeta
}
