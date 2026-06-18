import type Hls from 'hls.js'

export function useHlsVideo(
  videoRef: Ref<HTMLVideoElement | null>,
  streamUrl: Ref<string | undefined>,
) {
  let hls: Hls | null = null

  function destroy() {
    hls?.destroy()
    hls = null
    const video = videoRef.value
    if (video) {
      video.removeAttribute('src')
      video.load()
    }
  }

  async function attach(url: string) {
    destroy()
    const video = videoRef.value
    if (!video || !url) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      return
    }

    const { default: HlsConstructor } = await import('hls.js')
    if (HlsConstructor.isSupported()) {
      hls = new HlsConstructor()
      hls.loadSource(url)
      hls.attachMedia(video)
    }
  }

  onMounted(() => {
    watch(
      streamUrl,
      (url) => {
        if (!url) {
          destroy()
          return
        }
        void nextTick(() => attach(url))
      },
      { immediate: true },
    )
  })

  onUnmounted(destroy)

  return { destroy }
}
