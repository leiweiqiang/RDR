import { getVideoCollection } from '~/api/video-collections'
import { listCategories } from '~/api/categories'
import type {
  DecodedStreamFile,
  TranscodedStreamFile,
  VideoCollectionDetail,
} from '~/types/api/video-collection'
import {
  buildOriginalSpecColumn,
  buildStreamSpecColumn,
  findLowerTierStream,
  formatMetadataProcessorLabel,
  type StreamSpecColumn,
} from '~/utils/collectionStreamDisplay'

function parseId(value: string): number | null {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

function findDecodedStreamForTranscoded(
  collection: VideoCollectionDetail | null,
  transcodedStream: TranscodedStreamFile | null,
): DecodedStreamFile | null {
  if (!collection || !transcodedStream) return null
  return (
    collection.decoded_stream_files.find(
      (item) => item.transcoded_stream_file_id === transcodedStream.id,
    ) ?? null
  )
}

export function useCollectionStreamPage(
  categoryId: MaybeRefOrGetter<string>,
  collectionId: MaybeRefOrGetter<string>,
  streamId: MaybeRefOrGetter<string>,
) {
  const collection = ref<VideoCollectionDetail | null>(null)
  const stream = ref<TranscodedStreamFile | null>(null)
  const categoryTitle = ref('')
  const pending = ref(true)
  const error = ref<Error | null>(null)

  const originalSpec = computed<StreamSpecColumn>(() =>
    buildOriginalSpecColumn(collection.value?.raw_video ?? null),
  )

  const streamSpec = computed<StreamSpecColumn | null>(() =>
    stream.value ? buildStreamSpecColumn(stream.value) : null,
  )

  const lowerTierSpec = computed<StreamSpecColumn | null>(() => {
    if (!stream.value || !collection.value) return null
    const lowerTier = findLowerTierStream(collection.value.transcoded_stream_files, stream.value)
    return lowerTier ? buildStreamSpecColumn(lowerTier) : null
  })

  const metadataTypeLabel = computed(() =>
    formatMetadataProcessorLabel(stream.value?.params?.metadata_extractor?.processor),
  )

  const decodedStream = computed(() =>
    findDecodedStreamForTranscoded(collection.value, stream.value),
  )

  const previewCoverUrl = computed(() => stream.value?.cover ?? collection.value?.cover ?? '')
  const metadataCoverUrl = computed(() => previewCoverUrl.value)
  const streamUrl = computed(() => {
    const recoveredUrl = decodedStream.value?.recovered_stream_url
    if (recoveredUrl) return recoveredUrl
    return stream.value?.stream_url ?? ''
  })
  const metadataStreamUrl = computed(() => {
    const improvedUrl = decodedStream.value?.improved_stream_url
    if (improvedUrl) return improvedUrl
    return streamUrl.value
  })

  async function refresh() {
    const cid = parseId(toValue(collectionId))
    const sid = parseId(toValue(streamId))

    pending.value = true
    error.value = null
    collection.value = null
    stream.value = null
    categoryTitle.value = ''

    if (cid == null || sid == null) {
      pending.value = false
      error.value = new Error('Invalid collection or stream id')
      return
    }

    try {
      const detail = await getVideoCollection(cid)
      const matchedStream = detail.transcoded_stream_files.find((item) => item.id === sid)

      if (!matchedStream) {
        throw new Error(`Stream "${sid}" not found`)
      }

      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.id === detail.category_id)

      collection.value = detail
      stream.value = matchedStream
      categoryTitle.value = category?.title ?? 'Collections'
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => [toValue(categoryId), toValue(collectionId), toValue(streamId)],
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    collection,
    stream,
    decodedStream,
    categoryTitle,
    originalSpec,
    streamSpec,
    lowerTierSpec,
    metadataTypeLabel,
    previewCoverUrl,
    metadataCoverUrl,
    streamUrl,
    metadataStreamUrl,
    pending,
    error,
    refresh,
  }
}
