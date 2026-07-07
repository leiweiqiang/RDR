import { getVideoCollection } from '~/api/video-collections'
import { listCategories } from '~/api/categories'
import type {
  DecodedStreamFile,
  TranscodedStreamFile,
  VideoCollectionDetail,
} from '~/types/api/video-collection'
import { getDecodedStreamCover } from '~/composables/useVideoCollection'

function parseId(value: string): number | null {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

function pickPreviewStream(collection: VideoCollectionDetail) {
  const streams = collection.transcoded_stream_files
  return streams.find((item) => item.status === 'finished') ?? streams[0] ?? null
}

export function useCollectionOutputPage(
  categoryId: MaybeRefOrGetter<string>,
  collectionId: MaybeRefOrGetter<string>,
  outputId: MaybeRefOrGetter<string>,
  sourceStreamId: MaybeRefOrGetter<string> = '',
) {
  const collection = ref<VideoCollectionDetail | null>(null)
  const output = ref<DecodedStreamFile | null>(null)
  const sourceStream = ref<TranscodedStreamFile | null>(null)
  const categoryTitle = ref('')
  const pending = ref(true)
  const error = ref<Error | null>(null)

  const isNewOutput = computed(() => toValue(outputId) === 'new')

  const previewCoverUrl = computed(() => {
    const detail = collection.value
    if (!detail) return ''
    if (output.value) return getDecodedStreamCover(output.value, detail)
    return sourceStream.value?.cover ?? pickPreviewStream(detail)?.cover ?? detail.cover
  })

  const streamUrl = computed(() => {
    const detail = collection.value
    if (!detail) return ''
    if (output.value) {
      return (
        output.value.improved_stream_url ??
        output.value.recovered_stream_url ??
        ''
      )
    }
    // Try to find a decoded stream paired with the source stream
    const pairedDecoded = sourceStream.value
      ? detail.decoded_stream_files.find(
          (item) => item.transcoded_stream_file_id === sourceStream.value!.id,
        )
      : null
    if (pairedDecoded) {
      return pairedDecoded.recovered_stream_url ?? pairedDecoded.improved_stream_url ?? ''
    }
    return sourceStream.value?.stream_url ?? pickPreviewStream(detail)?.stream_url ?? ''
  })

  async function refresh() {
    const cid = parseId(toValue(collectionId))
    const rawOutputId = toValue(outputId)

    pending.value = true
    error.value = null
    collection.value = null
    output.value = null
    sourceStream.value = null
    categoryTitle.value = ''

    if (cid == null) {
      pending.value = false
      error.value = new Error('Invalid collection id')
      return
    }

    try {
      const detail = await getVideoCollection(cid)
      const parsedSourceStreamId = parseId(toValue(sourceStreamId))
      if (parsedSourceStreamId != null) {
        sourceStream.value =
          detail.transcoded_stream_files.find((item) => item.id === parsedSourceStreamId) ?? null
      }

      if (rawOutputId !== 'new') {
        const oid = parseId(rawOutputId)
        if (oid == null) {
          throw new Error(`Invalid output id "${rawOutputId}"`)
        }
        const matchedOutput = detail.decoded_stream_files?.find((item) => item.id === oid)
        if (!matchedOutput) {
          const matchedSourceStream =
            detail.transcoded_stream_files.find((item) => item.id === oid) ?? null
          if (!matchedSourceStream) {
            throw new Error(`Output "${oid}" not found`)
          }
          sourceStream.value = matchedSourceStream
        } else {
          output.value = matchedOutput
        }
      }

      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.id === detail.category_id)

      collection.value = detail
      categoryTitle.value = category?.title ?? 'Categories'
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => [toValue(categoryId), toValue(collectionId), toValue(outputId), toValue(sourceStreamId)],
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    collection,
    output,
    sourceStream,
    categoryTitle,
    isNewOutput,
    previewCoverUrl,
    streamUrl,
    pending,
    error,
    refresh,
  }
}
