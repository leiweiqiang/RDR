<template>
  <div class="landing">
    <div class="landing__hourglass" aria-hidden="true">
      <div class="landing__tri landing__tri--left" />
      <div class="landing__tri landing__tri--right" />
    </div>

    <div class="landing__spotlight" aria-hidden="true" />

    <div class="landing__noise" aria-hidden="true">
      <svg class="landing__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="rdr-landing-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#rdr-landing-noise)" />
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
        <div class="landing__brand landing__reveal landing__reveal--1">
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
        <p class="landing__copy landing__reveal landing__reveal--2">
          RDR brings detail back where it belongs:<br />
          <span class="landing__copy-em">Sharper Structure, Richer Texture, Cleaner Edges,</span><br />
          without sacrificing realism or visual balance.
        </p>
        <NuxtLink to="/workflow" class="landing__cta landing__reveal landing__reveal--3">
          Start
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/icon-rdr-large.svg?url'

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
  position: fixed;
  top: 150px;
  bottom: 150px;
  left: 100px;
  right: 100px;
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

.landing__spotlight {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    ellipse 58% 46% at 50% 38%,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 240, 245, 0.02) 45%,
    transparent 74%
  );
}

.landing__noise {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.12;
  mix-blend-mode: overlay;
}

.landing__noise-svg {
  width: 100%;
  height: 100%;
}

.landing__blur-edge {
  position: fixed;
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
  pointer-events: none;
}

.landing__col {
  display: flex;
  align-items: center;
  min-width: 0;
  pointer-events: auto;
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
  padding-right: 100px;
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
  filter: drop-shadow(0 8px 32px rgba(200, 28, 48, 0.35));
}

.landing__copy {
  margin: 0;
  max-width: 26rem;
  font-size: clamp(0.95rem, 1.25vw, 1.05rem);
  font-weight: 300;
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: #fff;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(0, 0, 0, 0.5);
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

.landing__reveal {
  opacity: 0;
  transform: translateY(18px);
  animation: landing-reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.landing__reveal--1 {
  animation-delay: 0.1s;
}

.landing__reveal--2 {
  animation-delay: 0.28s;
}

.landing__reveal--3 {
  animation-delay: 0.46s;
}

@keyframes landing-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing__reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

@media (max-width: 768px) {
  .landing__grid {
    grid-template-columns: 1fr;
    align-content: center;
    padding: clamp(1.5rem, 4vw, 2.5rem);
  }

  .landing__blur-edge {
    top: 50%;
    left: 50%;
    bottom: auto;
    height: min(52vh, 440px);
    transform: translate(-50%, -50%);
    opacity: 0.92;
  }

  .landing__col--left {
    padding-left: 0;
    justify-content: center;
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

  .landing__copy-em {
    white-space: normal;
  }
}
</style>
