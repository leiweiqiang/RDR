export type PaginationMeta = {
  page: number
  per_page: number
  total_count: number
  total_pages: number
}

export type ApiErrorResponse = {
  status: number
  code: string
  message: string
  trace_id: string
  details?: Array<{
    field: string
    message: string
    type: string
  }>
}
