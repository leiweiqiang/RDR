<template>
  <div class="landing" :style="{ '--landing-bg': `url(${infinityBgUrl})` }">
    <div class="landing__glow landing__glow--red" aria-hidden="true" />
    <div class="landing__glow landing__glow--red-center" aria-hidden="true" />
    <div class="landing__spotlight" aria-hidden="true" />

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

    <div class="landing__blur-edge" aria-hidden="true">
      <div class="landing__blur-col landing__blur-col--wide" />
      <span class="landing__blur-divider" />
      <div class="landing__blur-col landing__blur-col--narrow" />
      <span class="landing__blur-divider" />
    </div>

    <div class="landing__grid">
      <div class="landing__col landing__col--left">
        <div class="landing__brand">
          <img
            class="landing__logo"
            :src="rdrLogoUrl"
            width="298"
            height="150"
            alt="RDR — Detail Defences Picture Quality"
          />
        </div>
      </div>

      <div class="landing__col landing__col--right">
        <p class="landing__copy">
          RDR brings detail back where it belongs:<br />
          <span class="landing__copy-em">Sharper Structure, Richer Texture, Cleaner Edges,</span><br />
          without sacrificing realism or visual balance.
        </p>
        <NuxtLink to="/workflow" class="landing__cta">Start</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/icon-rdr-large.svg?url'
import infinityBgUrl from '~/assets/infinity-image.png?url'

useHead({
  title: 'RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.landing {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background-color: #000;
  background-image:
    radial-gradient(ellipse 100% 90% at 50% 100%, rgba(120, 8, 28, 0.85) 0%, rgba(55, 4, 14, 0.45) 42%, transparent 58%),
    radial-gradient(ellipse 120% 85% at 0% 100%, rgba(110, 12, 32, 0.72) 0%, rgba(45, 6, 14, 0.35) 38%, transparent 62%),
    linear-gradient(180deg, #000000 0%, #050204 38%, #120208 100%);
  color: #fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.landing__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.landing__glow--red {
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

.landing__glow--red-center {
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

.landing__spotlight {
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

.landing::before {
  content: '';
  position: absolute;
  z-index: 1;
  inset: clamp(1rem, 4vw, 2.75rem);
  background-image: var(--landing-bg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: none;
}

.landing__noise {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.landing__noise-svg {
  width: 100%;
  height: 100%;
}

.landing__blur-edge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: stretch;
  pointer-events: none;
}

.landing__blur-col {
  flex-shrink: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(22px) saturate(1.15);
  -webkit-backdrop-filter: blur(22px) saturate(1.15);
}

.landing__blur-col--wide {
  width: clamp(13rem, 30vw, 21rem);
}

.landing__blur-col--narrow {
  width: clamp(7rem, 14vw, 11.5rem);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px) saturate(1.1);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
}

.landing__blur-divider {
  flex-shrink: 0;
  width: 1px;
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 18%,
    rgba(255, 255, 255, 0.5) 82%,
    rgba(255, 255, 255, 0) 100%
  );
}

.landing__grid {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  align-content: center;
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
  justify-content: center;
  align-items: flex-end;
  text-align: right;
  gap: 1.75rem;
  padding-right: clamp(0.25rem, 2vw, 1rem);
}

.landing__brand {
  position: relative;
  padding-left: clamp(4.5rem, 12vw, 8.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.landing__logo {
  display: block;
  width: clamp(140px, 32vw, 260px);
  height: auto;
  object-fit: contain;
}

.landing__copy {
  margin: 0;
  max-width: 26rem;
  font-size: clamp(0.95rem, 1.25vw, 1.05rem);
  font-weight: 300;
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: #fff;
}

.landing__copy-em {
  font-weight: 700;
  white-space: nowrap;
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
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.landing__cta:hover {
  transform: translateY(-1px);
  background: #22c55e;
  color: #fff;
  box-shadow: 0 8px 28px rgba(34, 197, 94, 0.45);
}

.landing__cta:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .landing__grid {
    grid-template-columns: 1fr;
    align-content: center;
    padding: clamp(1.5rem, 4vw, 2.5rem);
  }

  .landing__col--left {
    padding-left: 0;
    justify-content: center;
  }

  .landing__blur-edge {
    top: 50%;
    left: 50%;
    bottom: auto;
    height: min(52vh, 440px);
    transform: translate(-50%, -50%);
    opacity: 0.92;
  }

  .landing__brand {
    padding-left: 0;
    align-items: center;
    text-align: center;
  }

  .landing__col--right {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-right: 0;
  }

  .landing__copy {
    text-align: center;
    max-width: 22rem;
  }
}
</style>
