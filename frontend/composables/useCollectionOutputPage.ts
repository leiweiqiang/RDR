import { getVideoCollection } from '~/api/video-collections'
import { listCategories } from '~/api/categories'
import type { DecodedStreamFile, VideoCollectionDetail } from '~/types/api/video-collection'

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
) {
  const collection = ref<VideoCollectionDetail | null>(null)
  const output = ref<DecodedStreamFile | null>(null)
  const categoryTitle = ref('')
  const pending = ref(true)
  const error = ref<Error | null>(null)

  const isNewOutput = computed(() => toValue(outputId) === 'new')

  const previewCoverUrl = computed(() => {
    if (output.value?.cover) return output.value.cover
    const detail = collection.value
    if (!detail) return ''
    return pickPreviewStream(detail)?.cover ?? detail.cover
  })

  const streamUrl = computed(() => {
    if (output.value?.stream_url) return output.value.stream_url
    const detail = collection.value
    if (!detail) return ''
    return pickPreviewStream(detail)?.stream_url ?? ''
  })

  async function refresh() {
    const cid = parseId(toValue(collectionId))
    const rawOutputId = toValue(outputId)

    pending.value = true
    error.value = null
    collection.value = null
    output.value = null
    categoryTitle.value = ''

    if (cid == null) {
      pending.value = false
      error.value = new Error('Invalid collection id')
      return
    }

    try {
      const detail = await getVideoCollection(cid)

      if (rawOutputId !== 'new') {
        const oid = parseId(rawOutputId)
        if (oid == null) {
          throw new Error(`Invalid output id "${rawOutputId}"`)
        }
        const matchedOutput = detail.decoded_stream_files?.find((item) => item.id === oid)
        if (!matchedOutput) {
          throw new Error(`Output "${oid}" not found`)
        }
        output.value = matchedOutput
      }

      const categoriesResponse = await listCategories({ per_page: 100 })
      const category = categoriesResponse.data.find((item) => item.id === detail.category_id)

      collection.value = detail
      categoryTitle.value = category?.title ?? 'Collections'
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => [toValue(categoryId), toValue(collectionId), toValue(outputId)],
    () => {
      void refresh()
    },
    { immediate: true },
  )

  return {
    collection,
    output,
    categoryTitle,
    isNewOutput,
    previewCoverUrl,
    streamUrl,
    pending,
    error,
    refresh,
  }
}
