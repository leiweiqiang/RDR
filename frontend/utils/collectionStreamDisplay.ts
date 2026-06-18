import { formatResolutionLabel } from '~/composables/useContentPoolVideo'
import type { TranscodedStreamFile, VideoCollectionRawVideo } from '~/types/api/video-collection'

export function formatStreamBitrateLabel(bitrate: number | null | undefined): string {
  if (bitrate == null) return '—'
  return `Bite ${bitrate} Mbps`
}

export function formatStreamFpsLabel(fps: number | null | undefined): string {
  if (fps == null) return '—'
  return `Frame ${fps}Hz`
}

export function formatStreamResolutionHeading(resolution: string): string {
  const label = formatResolutionLabel(resolution)
  if (label === '360p' || label === '720p') return 'Low Resolution Streaming'
  if (label === '1080p') return 'High Resolution Streaming'
  if (label === '4K') return 'Ultra High Resolution Streaming'
  return 'Streaming'
}

export function formatMetadataProcessorLabel(processor: string | null | undefined): string {
  if (!processor) return '—'
  if (processor === 'canny') return 'Canny Edge Extraction'
  return processor.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export type StreamSpecColumn = {
  title: string
  resolution: string
  bitrate: string
  fps: string
}

export function buildOriginalSpecColumn(rawVideo: VideoCollectionRawVideo | null): StreamSpecColumn {
  if (!rawVideo) {
    return {
      title: 'Original',
      resolution: '—',
      bitrate: '—',
      fps: '—',
    }
  }

  return {
    title: 'Original',
    resolution: formatResolutionLabel(rawVideo.resolution),
    bitrate: formatStreamBitrateLabel(rawVideo.bitrate),
    fps: formatStreamFpsLabel(rawVideo.fps),
  }
}

export function buildStreamSpecColumn(stream: TranscodedStreamFile): StreamSpecColumn {
  return {
    title: formatStreamResolutionHeading(stream.resolution),
    resolution: formatResolutionLabel(stream.resolution),
    bitrate: formatStreamBitrateLabel(stream.bitrate),
    fps: formatStreamFpsLabel(stream.fps),
  }
}

export function findLowerTierStream(
  streams: TranscodedStreamFile[],
  current: TranscodedStreamFile,
): TranscodedStreamFile | null {
  const currentPixels = parseResolutionPixels(current.resolution)
  const candidates = streams
    .filter((stream) => stream.id !== current.id)
    .filter((stream) => parseResolutionPixels(stream.resolution) < currentPixels)
    .sort(
      (left, right) =>
        parseResolutionPixels(right.resolution) - parseResolutionPixels(left.resolution),
    )

  return candidates[0] ?? null
}

function parseResolutionPixels(resolution: string): number {
  const match = resolution.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/)
  if (!match) return 0
  return Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10)
}
