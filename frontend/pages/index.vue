<template>
  <div class="landing">
    <div class="landing__glow landing__glow--red" aria-hidden="true" />
    <div class="landing__glow landing__glow--violet" aria-hidden="true" />

    <div class="landing__hourglass" aria-hidden="true">
      <div class="landing__tri landing__tri--left" />
      <div class="landing__tri landing__tri--right" />
    </div>

    <div class="landing__noise" aria-hidden="true">
      <svg class="landing__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="rdr-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#rdr-noise)" />
      </svg>
    </div>

    <div class="landing__grid">
      <div class="landing__col landing__col--left">
        <div class="landing__glass" aria-hidden="true">
          <span class="landing__glass-line" />
          <span class="landing__glass-panel" />
          <span class="landing__glass-line" />
        </div>
        <div class="landing__brand">
          <img
            class="landing__logo"
            :src="rdrLogoUrl"
            width="80"
            height="31"
            alt="RDR — Detail Defences Picture Quality"
          />
        </div>
      </div>

      <div class="landing__col landing__col--right">
        <p class="landing__copy">
          RDR brings detail back where it belongs: Sharper Structure, Richer Texture, Cleaner Edges,
          without sacrificing realism or visual balance.
        </p>
        <NuxtLink to="/workflow" class="landing__cta">Start</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'

useHead({
  title: 'RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.landing {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.landing__hourglass {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.landing__tri {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
}

.landing__tri--left {
  left: 0;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
  background: linear-gradient(
    90deg,
    #c40000 0%,
    #ff2a00 35%,
    #ffae00 78%,
    #ffff00 100%
  );
  filter: drop-shadow(0 0 80px rgba(255, 40, 0, 0.55));
}

.landing__tri--right {
  right: 0;
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
  background: linear-gradient(
    90deg,
    #fff200 0%,
    #ff8800 18%,
    #ff2200 38%,
    #a4006e 62%,
    #4b0082 82%,
    #1a0028 100%
  );
}

.landing__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.45;
}

.landing__glow--red {
  width: min(70vw, 720px);
  height: min(70vw, 720px);
  left: -12%;
  bottom: -18%;
  background: radial-gradient(circle, rgba(255, 50, 0, 0.9) 0%, transparent 70%);
}

.landing__glow--violet {
  width: min(55vw, 560px);
  height: min(55vw, 560px);
  right: -8%;
  bottom: -22%;
  background: radial-gradient(circle, rgba(90, 20, 140, 0.55) 0%, transparent 68%);
  opacity: 0.35;
}

.landing__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.22;
  mix-blend-mode: overlay;
}

.landing__noise-svg {
  width: 100%;
  height: 100%;
}

.landing__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 100dvh;
  padding: clamp(1.5rem, 4vw, 3.5rem);
  gap: clamp(1rem, 3vw, 2.5rem);
}

.landing__col {
  display: flex;
  align-items: center;
  min-width: 0;
}

.landing__col--left {
  position: relative;
  justify-content: flex-start;
  padding-left: clamp(0.5rem, 2vw, 1.5rem);
}

.landing__col--right {
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 1.75rem;
  padding-right: clamp(0.25rem, 2vw, 1rem);
}

.landing__glass {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: stretch;
  height: min(72vh, 640px);
  z-index: 0;
}

.landing__glass-line {
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 22%,
    rgba(255, 255, 255, 0.55) 78%,
    rgba(255, 255, 255, 0) 100%
  );
}

.landing__glass-panel {
  width: clamp(52px, 8vw, 96px);
  margin: 0 2px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 2px;
}

.landing__brand {
  position: relative;
  z-index: 1;
  padding-left: clamp(4.5rem, 12vw, 8.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.landing__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.landing__copy {
  margin: 0;
  max-width: 26rem;
  font-size: clamp(0.95rem, 1.25vw, 1.05rem);
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: #fff;
}

.landing__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 0.55rem 1.75rem;
  border-radius: 999px;
  background: #fff;
  color: #000;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.landing__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.landing__cta:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .landing__grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }

  .landing__col--left {
    padding-left: 0;
    justify-content: center;
  }

  .landing__glass {
    left: 50%;
    transform: translate(-50%, -50%);
    height: min(48vh, 420px);
    opacity: 0.85;
  }

  .landing__brand {
    padding-left: 0;
    align-items: center;
    text-align: center;
  }

  .landing__col--right {
    align-items: center;
    text-align: center;
    margin-top: auto;
    padding-right: 0;
  }

  .landing__copy {
    text-align: center;
    max-width: 22rem;
  }
}
</style>
