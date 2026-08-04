import { getVideoCollection } from '~/api/video-collections'
import { listCategories } from '~/api/categories'
import type { DecodedStreamFile, TranscodedStreamFile, VideoCollectionDetail } from '~/types/api/video-collection'
import { extractFileType } from '~/utils/highSpeedActionFilters'

function parseCollectionId(id: MaybeRefOrGetter<string>): ComputedRef<number | null> {
  return computed(() => {
    const raw = toValue(id)
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  })
}

export function formatCollectionAddedDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export function formatCollectionFileName(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, '')
}

export function formatCollectionFileFormat(
  name: string,
  videoType?: string | null,
  storagePath?: string | null,
): string {
  const fileType = extractFileType(name, storagePath, videoType)
  if (!fileType) return '—'
  return fileType.replace(/^\./, '').toUpperCase()
}

export function formatCollectionProvider(provider: string | null): string {
  if (!provider) return '—'
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}

export type StreamStatusTone = 'processing' | 'done' | 'failed' | 'neutral'

export function streamStatusTone(status: string): StreamStatusTone {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'finished' || normalized === 'done' || normalized === 'success') return 'done'
  if (normalized === 'failed' || normalized === 'error') return 'failed'
  if (
    normalized === 'processing' ||
    normalized === 'running' ||
    normalized === 'pending' ||
    normalized === 'started' ||
    normalized === 'in_progress' ||
    normalized === 'wait'
  ) {
    return 'processing'
  }
  return 'neutral'
}

export function streamStatusLabel(status: string): string {
  const tone = streamStatusTone(status)
  if (tone === 'done') return 'Done'
  if (tone === 'failed') return 'Failed'
  if (tone === 'processing') return 'In Processing'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getDecodedStreamParent(
  output: DecodedStreamFile,
  collection: VideoCollectionDetail,
): TranscodedStreamFile | undefined {
  return collection.transcoded_stream_files.find(
    (item) => item.id === output.transcoded_stream_file_id,
  )
}

export function getDecodedStreamCover(
  output: DecodedStreamFile,
  collection: VideoCollectionDetail,
): string {
  return getDecodedStreamParent(output, collection)?.cover ?? collection.cover
}

/**
 * Upscaling / output flow always submits fps: 60. Packaging / Streaming Generation
 * targets use 30fps. Use that to keep upscaled results out of Streaming Generation.
 */
export function isUpscaleTranscodedStream(stream: TranscodedStreamFile): boolean {
  return stream.fps != null && stream.fps >= 60
}

export type CollectionOutputListItem =
  | {
      kind: 'decoded'
      id: number
      name: string
      resolution: string
      fps: number | null
      bitrate: number | null
      status: string
      output: DecodedStreamFile
    }
  | {
      kind: 'upscaled'
      id: number
      name: string
      resolution: string
      fps: number | null
      bitrate: number | null
      status: string
      stream: TranscodedStreamFile
    }

export function getStreamingGenerationStreams(
  collection: VideoCollectionDetail,
): TranscodedStreamFile[] {
  return collection.transcoded_stream_files.filter((stream) => !isUpscaleTranscodedStream(stream))
}

export function getCollectionOutputItems(
  collection: VideoCollectionDetail,
): CollectionOutputListItem[] {
  const decoded = collection.decoded_stream_files ?? []
  const decodedParentIds = new Set(decoded.map((item) => item.transcoded_stream_file_id))

  const decodedItems: CollectionOutputListItem[] = decoded.map((output) => ({
    kind: 'decoded',
    id: output.id,
    name: output.name,
    resolution: output.resolution,
    fps: output.fps,
    bitrate: output.bitrate,
    status: output.status,
    output,
  }))

  const upscaledItems: CollectionOutputListItem[] = collection.transcoded_stream_files
    .filter((stream) => isUpscaleTranscodedStream(stream) && !decodedParentIds.has(stream.id))
    .map((stream) => ({
      kind: 'upscaled',
      id: stream.id,
      name: stream.name,
      resolution: stream.resolution,
      fps: stream.fps,
      bitrate: stream.bitrate,
      status: stream.status,
      stream,
    }))

  return [...decodedItems, ...upscaledItems]
}

export function getCollectionOutputCover(
  item: CollectionOutputListItem,
  collection: VideoCollectionDetail,
): string {
  if (item.kind === 'upscaled') return item.stream.cover || collection.cover
  return getDecodedStreamCover(item.output, collection)
}

export function useVideoCollection(collectionId: MaybeRefOrGetter<string>) {
  const id = parseCollectionId(collectionId)
  const collection = ref<VideoCollectionDetail | null>(null)
  const categoryTitle = ref('')
  const pending = ref(true)
  const error = ref<Error | null>(null)

  async function refresh() {
    const cid = id.value
    if (cid == null) {
      collection.value = null
      categoryTitle.value = ''
      error.value = null
      pending.value = false
      return
    }

    pending.value = true
    error.value = null

    try {
      const detail = await getVideoCollection(cid)
      collection.value = detail

      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.id === detail.category_id)
      categoryTitle.value = category?.title ?? 'Categories'
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      collection.value = null
      categoryTitle.value = ''
    } finally {
      pending.value = false
    }
  }

  watch(id, () => void refresh(), { immediate: true })

  return {
    collection,
    categoryTitle,
    pending,
    error,
    refresh,
  }
}
