<template>
  <div class="app-workspace-shell">
    <div class="app-workspace-shell__glow app-workspace-shell__glow--red" aria-hidden="true" />
    <div class="app-workspace-shell__glow app-workspace-shell__glow--red-center" aria-hidden="true" />
    <div class="app-workspace-shell__spotlight" aria-hidden="true" />

    <div class="app-workspace-shell__noise" aria-hidden="true">
      <svg class="app-workspace-shell__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter :id="noiseFilterId" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" :filter="`url(#${noiseFilterId})`" />
      </svg>
    </div>

    <p v-if="showWatermark" class="app-workspace-shell__watermark" aria-hidden="true">
      {{ SITE_WORKSPACE_WATERMARK }}
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { SITE_WORKSPACE_WATERMARK } from '~/utils/siteWorkspace'

withDefaults(
  defineProps<{
    showWatermark?: boolean
  }>(),
  {
    showWatermark: true,
  },
)

const noiseFilterId = `workspace-noise-${useId().replace(/\W/g, '')}`
</script>

<style scoped>
.app-workspace-shell {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background-color: transparent;
  background-image: none;
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.app-workspace-shell__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.app-workspace-shell__glow--red {
  width: min(95vw, 980px);
  height: min(95vw, 980px);
  left: -22%;
  bottom: -35%;
  opacity: 0.55;
  background: radial-gradient(
    circle,
    rgba(160, 24, 48, 0.55) 0%,
    rgba(90, 8, 28, 0.38) 42%,
    rgba(30, 0, 10, 0.12) 68%,
    transparent 76%
  );
}

.app-workspace-shell__glow--red-center {
  width: min(120vw, 1400px);
  height: min(70vh, 900px);
  left: 50%;
  bottom: -40%;
  transform: translateX(-50%);
  opacity: 0.7;
  filter: blur(140px);
  background: radial-gradient(
    ellipse 55% 45% at 50% 100%,
    rgba(200, 28, 48, 0.5) 0%,
    rgba(80, 6, 22, 0.28) 50%,
    transparent 72%
  );
}

.app-workspace-shell__spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 58% 46% at 50% 38%,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 240, 245, 0.02) 45%,
    transparent 74%
  );
}

.app-workspace-shell__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.app-workspace-shell__noise-svg {
  width: 100%;
  height: 100%;
}

.app-workspace-shell__watermark {
  position: fixed;
  right: clamp(0.75rem, 3vw, 2rem);
  bottom: max(clamp(0.75rem, 2vw, 1.25rem), env(safe-area-inset-bottom, 0px));
  margin: 0;
  font-size: clamp(2.25rem, 7vw, 4rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  color: rgba(90, 12, 22, 0.38);
  line-height: 1;
  text-align: right;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
</style>
