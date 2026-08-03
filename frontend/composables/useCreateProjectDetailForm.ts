import type { CategoryResponse } from '~/types/api/category'
import {
  BITRATE_OPTIONS,
  FPS_OPTIONS,
  RESOLUTION_LABELS,
  RESOLUTION_OPTIONS,
  URL_PROVIDER_OPTIONS,
  captureVideoCover,
  defaultTitleFromFileName,
  defaultTitleFromUrl,
  fileNameFromUrl,
  isDirectMediaUrl,
  nearestBitrateOption,
  nearestFpsOption,
  nearestResolutionOption,
  probeVideoFile,
  probeVideoUrl,
} from '~/utils/videoFileMeta'

export type CreateProjectCategoryOption = Pick<CategoryResponse, 'id' | 'title'>

export function useCreateProjectDetailForm(options: {
  mode: 'upload' | 'url'
  defaultCategoryId: MaybeRefOrGetter<number>
  categories: MaybeRefOrGetter<CreateProjectCategoryOption[]>
}) {
  const title = ref('')
  const provider = ref(options.mode === 'upload' ? 'UserUpload' : 'YouTube')
  const categoryId = ref(toValue(options.defaultCategoryId))
  const resolution = ref('')
  const bitrate = ref('')
  const fps = ref('')
  const duration = ref(0)
  const durationInput = ref('')
  const videoType = ref<string | null>(null)
  const fileName = ref('')
  const sourceUrl = ref('')
  const previewObjectUrl = ref('')
  const coverPreviewUrl = ref('')
  const coverBlob = ref<Blob | null>(null)
  const probing = ref(false)
  const probeError = ref('')
  const submitting = ref(false)
  const submitError = ref('')
  const submitProgress = ref('')
  /** Bumps on reset so in-flight probes do not overwrite a newer form state. */
  let probeGeneration = 0

  const resolutionSelectOptions = computed(() => {
    const labels = RESOLUTION_OPTIONS.map((value) => RESOLUTION_LABELS[value] ?? value)
    if (!resolution.value) return [...labels]
    const currentLabel = RESOLUTION_LABELS[resolution.value] ?? resolution.value
    if (!labels.includes(currentLabel)) return [currentLabel, ...labels]
    return [...labels]
  })

  const resolutionLabel = computed({
    get() {
      if (!resolution.value) return ''
      return RESOLUTION_LABELS[resolution.value] ?? resolution.value
    },
    set(label: string) {
      const found = RESOLUTION_OPTIONS.find((value) => RESOLUTION_LABELS[value] === label)
      if (found) {
        resolution.value = found
        return
      }
      const match = label.match(/(\d+x\d+)/)
      resolution.value = match?.[1] ?? label
    },
  })

  const categoryOptions = computed(() =>
    toValue(options.categories).map((item) => item.title),
  )

  const categoryLabel = computed({
    get() {
      const match = toValue(options.categories).find((item) => item.id === categoryId.value)
      return match?.title ?? ''
    },
    set(label: string) {
      const match = toValue(options.categories).find((item) => item.title === label)
      if (match) categoryId.value = match.id
    },
  })

  const canSubmit = computed(() => {
    const titleOk = title.value.trim().length > 0
    const resolutionOk = /^\d+x\d+$/.test(resolution.value)
    const parsedDuration = duration.value > 0 ? duration.value : Number.parseFloat(durationInput.value)
    const durationOk = Number.isFinite(parsedDuration) && parsedDuration > 0
    const coverOk = coverBlob.value != null
    const categoryOk = categoryId.value > 0
    return titleOk && resolutionOk && durationOk && coverOk && categoryOk && !submitting.value
  })

  function effectiveDuration(): number {
    if (duration.value > 0) return duration.value
    const parsed = Number.parseFloat(durationInput.value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }

  function revokePreviewUrls() {
    if (previewObjectUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewObjectUrl.value)
    }
    if (coverPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreviewUrl.value)
    }
  }

  function resetForm() {
    probeGeneration += 1
    revokePreviewUrls()
    title.value = ''
    provider.value = options.mode === 'upload' ? 'UserUpload' : 'YouTube'
    categoryId.value = toValue(options.defaultCategoryId)
    resolution.value = ''
    bitrate.value = ''
    fps.value = ''
    duration.value = 0
    durationInput.value = ''
    videoType.value = null
    fileName.value = ''
    sourceUrl.value = ''
    previewObjectUrl.value = ''
    coverPreviewUrl.value = ''
    coverBlob.value = null
    probing.value = false
    probeError.value = ''
    submitting.value = false
    submitError.value = ''
    submitProgress.value = ''
  }

  function applyProbedMeta(meta: {
    objectUrl: string
    duration: number
    resolution: string
    bitrate: number | null
    fps: number | null
    videoType: string | null
  }) {
    previewObjectUrl.value = meta.objectUrl
    duration.value = meta.duration
    if (meta.duration > 0) durationInput.value = String(Math.round(meta.duration * 100) / 100)
    // Prefer the exact probed WxH when valid; fall back to nearest known preset.
    if (/^\d+x\d+$/.test(meta.resolution)) {
      resolution.value = meta.resolution
    } else {
      resolution.value = nearestResolutionOption(meta.resolution)
    }
    bitrate.value = nearestBitrateOption(meta.bitrate)
    fps.value = nearestFpsOption(meta.fps) || '30'
    videoType.value = meta.videoType
  }

  async function applyCoverBlob(blob: Blob) {
    if (coverPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreviewUrl.value)
    }
    coverBlob.value = blob
    coverPreviewUrl.value = URL.createObjectURL(blob)
  }

  async function captureCoverFromPreview() {
    if (!previewObjectUrl.value) return
    const blob = await captureVideoCover(previewObjectUrl.value)
    await applyCoverBlob(blob)
  }

  async function initFromFile(file: File) {
    resetForm()
    const generation = probeGeneration
    probing.value = true
    probeError.value = ''
    fileName.value = file.name
    title.value = defaultTitleFromFileName(file.name)
    categoryId.value = toValue(options.defaultCategoryId)
    try {
      const meta = await probeVideoFile(file)
      if (generation !== probeGeneration) {
        URL.revokeObjectURL(meta.objectUrl)
        return
      }
      applyProbedMeta(meta)
      try {
        await captureCoverFromPreview()
      } catch {
        // Cover optional until user uploads one; keep form usable.
      }
    } catch (err) {
      if (generation !== probeGeneration) return
      probeError.value =
        err instanceof Error ? err.message : 'Could not parse video metadata. Please fill in manually.'
      previewObjectUrl.value = URL.createObjectURL(file)
      videoType.value = file.name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? 'mp4'
      fps.value = '30'
    } finally {
      if (generation === probeGeneration) probing.value = false
    }
  }

  async function initFromUrl(url: string) {
    resetForm()
    const generation = probeGeneration
    probing.value = true
    probeError.value = ''
    sourceUrl.value = url
    fileName.value = fileNameFromUrl(url)
    title.value = defaultTitleFromUrl(url)
    categoryId.value = toValue(options.defaultCategoryId)
    provider.value = 'YouTube'
    try {
      if (!isDirectMediaUrl(url)) {
        probeError.value =
          'Browser cannot auto-detect YouTube/Vimeo page URLs. Fill resolution, bitrate, and frame manually, and upload a cover.'
        fps.value = '30'
        return
      }
      const meta = await probeVideoUrl(url, { videoType: null, revokeOnFail: false })
      if (generation !== probeGeneration) return
      applyProbedMeta(meta)
      try {
        await captureCoverFromPreview()
      } catch {
        // User can upload a cover manually (common for CORS-blocked remote URLs).
      }
    } catch (err) {
      if (generation !== probeGeneration) return
      probeError.value =
        err instanceof Error
          ? `${err.message}. Fill video info and upload a cover manually.`
          : 'Could not parse remote video. Fill fields manually.'
      previewObjectUrl.value = ''
      fps.value = '30'
    } finally {
      if (generation === probeGeneration) probing.value = false
    }
  }

  async function onCoverFileSelected(file: File) {
    await applyCoverBlob(file)
  }

  watch(
    () => toValue(options.defaultCategoryId),
    (id) => {
      if (!submitting.value) categoryId.value = id
    },
  )

  return {
    title,
    provider,
    categoryId,
    resolution,
    resolutionLabel,
    bitrate,
    fps,
    duration,
    durationInput,
    videoType,
    fileName,
    sourceUrl,
    previewObjectUrl,
    coverPreviewUrl,
    coverBlob,
    probing,
    probeError,
    submitting,
    submitError,
    submitProgress,
    resolutionSelectOptions,
    categoryOptions,
    categoryLabel,
    bitrateOptions: BITRATE_OPTIONS as unknown as string[],
    fpsOptions: FPS_OPTIONS as unknown as string[],
    providerOptions: URL_PROVIDER_OPTIONS as unknown as string[],
    canSubmit,
    effectiveDuration,
    resetForm,
    initFromFile,
    initFromUrl,
    captureCoverFromPreview,
    onCoverFileSelected,
    applyCoverBlob,
  }
}
