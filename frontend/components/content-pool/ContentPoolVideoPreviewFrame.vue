<template>
  <div class="cvf" :class="{ 'cvf--framed': framed, 'cvf--has-scrub': showScrubber }">
    <div class="cvf__thumb">
      <video
        v-if="streamUrl"
        ref="videoRef"
        class="cvf__cover cvf__video"
        :poster="imageUrl || undefined"
        playsinline
        preload="metadata"
        muted
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @seeked="onSeeked"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />
      <img
        v-else
        class="cvf__cover"
        :src="imageUrl"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <img
        v-if="showMetaBadge"
        class="cvf__badge"
        :src="rdrBadgeIconUrl"
        width="23"
        height="23"
        alt=""
        aria-hidden="true"
      />
      <button
        v-if="showPlay"
        type="button"
        class="cvf__play"
        :class="{ 'cvf__play--playing': isPlaying }"
        :aria-label="isPlaying ? 'Pause preview' : 'Play preview'"
        @click="onPlayClick"
      >
        <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 6h3v12H8V6zm5 0h3v12h-3V6z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </button>
      <div v-if="showScrubber" class="cvf__scrub-wrap">
        <div class="cvf__scrub-track">
          <span class="cvf__scrub-tip" :style="tipStyle">{{ scrubModel }}</span>
          <input
            v-model.number="scrubModel"
            class="cvf__scrub"
            type="range"
            min="0"
            max="1000"
            :aria-valuetext="String(scrubModel)"
            aria-label="Frame position"
            @pointerdown="onScrubStart"
            @pointerup="onScrubEnd"
            @pointercancel="onScrubEnd"
          />
        </div>
      </div>
      <button
        v-if="showFullscreen && streamUrl"
        type="button"
        class="cvf__fullscreen"
        aria-label="Fullscreen"
        @click="onFullscreenClick"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrBadgeIconUrl from '~/assets/icon-rdr-small-highlight.svg?url'
import { useHlsVideo } from '~/composables/useHlsVideo'

const props = withDefaults(
  defineProps<{
    imageUrl: string
    streamUrl?: string
    framed?: boolean
    showPlay?: boolean
    showMetaBadge?: boolean
    showScrubber?: boolean
    showFullscreen?: boolean
    /** When false, follows shared scrub but does not write playback progress back (for mirrored players). */
    scrubSource?: boolean
  }>(),
  {
    streamUrl: '',
    framed: false,
    showPlay: true,
    showMetaBadge: false,
    showScrubber: false,
    showFullscreen: false,
    scrubSource: true,
  },
)

const emit = defineEmits<{
  play: [playing: boolean]
  'scrub-start': []
  'scrub-end': [resumePlayback: boolean]
}>()

const scrubModel = defineModel<number>('scrubPosition', { default: 0 })

const videoRef = ref<HTMLVideoElement | null>(null)
const streamUrlRef = computed(() => props.streamUrl || undefined)
const duration = ref(0)
const isPlaying = ref(false)
const isScrubbing = ref(false)
const suppressTimeSync = ref(false)
const isUpdatingScrubFromVideo = ref(false)
const resumeAfterScrub = ref(false)

const SCRUB_DEADBAND = 2
const SEEK_TOLERANCE_SEC = 0.2

useHlsVideo(videoRef, streamUrlRef)

const tipStyle = computed(() => {
  const pct = (scrubModel.value / 1000) * 100
  return {
    left: `${pct}%`,
    transform: 'translateX(-50%)',
  }
})

function seekFromScrub(scrub: number) {
  const video = videoRef.value
  if (!video || !Number.isFinite(duration.value) || duration.value <= 0) return

  const targetTime = (scrub / 1000) * duration.value
  if (Math.abs(video.currentTime - targetTime) <= SEEK_TOLERANCE_SEC) return

  suppressTimeSync.value = true
  video.currentTime = targetTime
}

function onSeeked() {
  suppressTimeSync.value = false
}

function onLoadedMetadata() {
  const video = videoRef.value
  if (!video) return
  duration.value = video.duration
  seekFromScrub(scrubModel.value)
}

function onTimeUpdate() {
  if (!props.scrubSource || suppressTimeSync.value || isScrubbing.value) return
  const video = videoRef.value
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

  const nextScrub = Math.round((video.currentTime / video.duration) * 1000)
  if (Math.abs(nextScrub - scrubModel.value) <= SCRUB_DEADBAND) return

  isUpdatingScrubFromVideo.value = true
  scrubModel.value = nextScrub
  nextTick(() => {
    isUpdatingScrubFromVideo.value = false
  })
}

watch(scrubModel, (scrub) => {
  if (!props.streamUrl || isUpdatingScrubFromVideo.value) return
  seekFromScrub(scrub)
})

function onScrubStart() {
  isScrubbing.value = true
  resumeAfterScrub.value = isPlaying.value
  emit('scrub-start')
  if (isPlaying.value) pause()
}

function onScrubEnd() {
  isScrubbing.value = false
  const shouldResume = resumeAfterScrub.value
  resumeAfterScrub.value = false
  emit('scrub-end', shouldResume)
  if (shouldResume) play()
}

function play() {
  const video = videoRef.value
  if (!video) return
  void video.play()
}

function pause() {
  videoRef.value?.pause()
}

function onFullscreenClick() {
  const el = videoRef.value
  if (!el) return
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void el.requestFullscreen()
  }
}

function onPlayClick() {
  const willPlay = !isPlaying.value
  emit('play', willPlay)
  if (willPlay) play()
  else pause()
}

defineExpose({ play, pause })
</script>

<style scoped>
.cvf__thumb {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.cvf--framed .cvf__thumb {
  box-shadow:
    0 0 0 2px #00e5ff,
    inset 0 0 0 1px rgba(0, 0, 0, 0.35);
}

.cvf--has-scrub .cvf__play {
  bottom: 2.75rem;
}

.cvf__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cvf__video {
  background: #0a0a0a;
}

.cvf__badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 23px;
  height: 23px;
  max-width: 23px;
  max-height: 23px;
  flex: none;
  display: block;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
}

.cvf__play {
  position: absolute;
  left: 0.65rem;
  bottom: 0.65rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s ease, background 0.15s ease;
  z-index: 2;
}

.cvf__play:hover {
  transform: scale(1.04);
  background: #fff;
}

.cvf__fullscreen {
  position: absolute;
  right: 0.65rem;
  bottom: 0.65rem;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 6px;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  z-index: 2;
  transition: background 0.15s ease, transform 0.15s ease;
}

.cvf__fullscreen:hover {
  background: rgba(0, 0, 0, 0.75);
  transform: scale(1.05);
}

.cvf__fullscreen svg {
  width: 1.1rem;
  height: 1.1rem;
}

.cvf__play svg {
  width: 1rem;
  height: 1rem;
  margin-left: 2px;
}

.cvf__scrub-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.35rem 0.65rem 0.45rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.78));
  z-index: 3;
}

.cvf__scrub-track {
  position: relative;
  padding-top: 1.25rem;
}

.cvf__scrub {
  width: 100%;
  height: 4px;
  margin: 0;
  appearance: none;
  background: rgba(0, 229, 255, 0.35);
  border-radius: 2px;
  outline: none;
}

.cvf__scrub::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00e5ff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.cvf__scrub::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 50%;
  background: #00e5ff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.cvf__scrub-tip {
  position: absolute;
  top: 0;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #000;
  background: #00e5ff;
  pointer-events: none;
  white-space: nowrap;
}
</style>
