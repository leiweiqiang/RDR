<template>
  <div class="cvf" :class="{ 'cvf--framed': framed, 'cvf--has-scrub': showScrubber }">
    <div class="cvf__thumb">
      <img class="cvf__cover" :src="imageUrl" alt="" loading="lazy" decoding="async" />
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
        aria-label="Play preview"
        @click="$emit('play')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrBadgeIconUrl from '~/assets/icon-rdr-small-highlight.svg?url'

const props = withDefaults(
  defineProps<{
    imageUrl: string
    framed?: boolean
    showPlay?: boolean
    showMetaBadge?: boolean
    showScrubber?: boolean
  }>(),
  {
    framed: false,
    showPlay: true,
    showMetaBadge: false,
    showScrubber: false,
  },
)

defineEmits<{ play: [] }>()

const scrubModel = defineModel<number>('scrubPosition', { default: 741 })

const tipStyle = computed(() => {
  const pct = (scrubModel.value / 1000) * 100
  return {
    left: `${pct}%`,
    transform: 'translateX(-50%)',
  }
})
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
  z-index: 1;
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
