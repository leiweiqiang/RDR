import type { RawVideoListItem } from '~/types/api/video'

export type MetadataReviewerItem = {
  key: string
  summary: string
}


export function formatOriginalVideoSummary(video: RawVideoListItem): string {
  const resolution = video.resolution.replace(/x/i, ' X ')
  const parts: string[] = [resolution]
  if (video.fps != null) parts.push(`${video.fps} fps`)
  if (video.bitrate != null) parts.push(`${video.bitrate} Mbps`)
  return parts.join(', ')
}

export function useMetadataExtraction(poolId: MaybeRefOrGetter<string>) {
  const {
    video,
    previewImageUrl,
    pending: videoPending,
    error: videoError,
    refresh: refreshVideo,
  } = useContentPoolVideo(poolId)

  const cannyCoverUrl = computed(() => video.value?.canny_cover ?? '')
  const pending = computed(() => videoPending.value)
  const error = computed(() => videoError.value)

  const reviewerItems = computed<MetadataReviewerItem[]>(() => {
    const currentVideo = video.value
    if (!currentVideo) return []

    return [
      {
        key: 'original',
        summary: formatOriginalVideoSummary(currentVideo),
      },
    ]
  })

  return {
    video,
    previewImageUrl,
    cannyCoverUrl,
    reviewerItems,
    pending,
    error,
    refresh: refreshVideo,
  }
}
