<template>
  <canvas
    ref="canvasRef"
    class="landing-scene"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLandingInfinityScene } from '~/composables/useLandingInfinityScene'

const props = withDefaults(
  defineProps<{
    particleCount?: number
    interactive?: boolean
  }>(),
  {
    interactive: true,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)

useLandingInfinityScene(canvasRef, {
  particleCount: props.particleCount,
  interactive: props.interactive,
})
</script>

<style scoped>
.landing-scene {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
