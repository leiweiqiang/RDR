<template>
  <div class="home">
    <div class="home__glow home__glow--red" aria-hidden="true" />
    <div class="home__glow home__glow--red-center" aria-hidden="true" />
    <div class="home__spotlight" aria-hidden="true" />

    <div class="home__noise" aria-hidden="true">
      <svg class="home__noise-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="home-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="c">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#home-noise)" />
      </svg>
    </div>

    <p class="home__watermark" aria-hidden="true">WORKSPACE</p>

    <div class="home__inner">
      <header class="home__header">
        <NuxtLink to="/" class="home__logo-link" aria-label="RDR home">
          <img
            class="home__logo"
            :src="rdrLogoUrl"
            width="80"
            height="31"
            alt=""
          />
        </NuxtLink>
        <div class="home__progress" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="4" aria-label="Step 1 of 4">
          <span v-for="i in 4" :key="i" class="home__progress-segment" :class="{ 'home__progress-segment--active': i === 1 }" />
        </div>
      </header>

      <main class="home__main">
        <div v-if="pending" class="home__status" role="status">
          Loading categories...
        </div>
        <div v-else-if="error" class="home__status home__status--error" role="alert">
          <p>Failed to load categories.</p>
          <button type="button" class="home__retry" @click="refresh()">Retry</button>
        </div>
        <div v-else class="home__cards" role="listbox" aria-label="Video quality categories">
          <template v-for="cat in categories" :key="cat.id">
            <NuxtLink
              v-if="cat.name === 'high-speed-action'"
              to="/high-speed-action"
              role="option"
              class="home__card"
              :class="{ 'home__card--selected': selectedId === cat.name }"
              :aria-selected="selectedId === cat.name"
              @click="selectedId = cat.name"
            >
              <div class="home__card-visual" :class="{ 'home__card-visual--single': cat.images.length === 1 }">
                <img
                  v-for="(src, imgIndex) in cat.images"
                  :key="imgIndex"
                  class="home__card-img"
                  :src="src"
                  :alt="`${cat.title} — reference ${imgIndex + 1}`"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="home__card-text">
                <span class="home__card-title">{{ cat.title }}</span>
                <span class="home__card-sub">{{ cat.subtitle }}</span>
              </div>
            </NuxtLink>
            <button
              v-else
              type="button"
              role="option"
              class="home__card"
              :class="{ 'home__card--selected': selectedId === cat.name }"
              :aria-selected="selectedId === cat.name"
              @click="selectedId = cat.name"
            >
              <div class="home__card-visual" :class="{ 'home__card-visual--single': cat.images.length === 1 }">
                <img
                  v-for="(src, imgIndex) in cat.images"
                  :key="imgIndex"
                  class="home__card-img"
                  :src="src"
                  :alt="`${cat.title} — reference ${imgIndex + 1}`"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="home__card-text">
                <span class="home__card-title">{{ cat.title }}</span>
                <span class="home__card-sub">{{ cat.subtitle }}</span>
              </div>
            </button>
          </template>
        </div>
      </main>

      <AppSiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import rdrLogoUrl from '~/assets/rdr-logo-small.png?url'

const { categories, pending, error, refresh } = useCategories()

const selectedId = ref<string>('')

watch(
  categories,
  (items) => {
    if (items.length > 0 && !selectedId.value) {
      selectedId.value = items[0].name
    }
  },
  { immediate: true },
)

useHead({
  title: 'Home — RDR',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<style scoped>
.home {
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

.home__glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
}

.home__glow--red {
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

.home__glow--red-center {
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

.home__spotlight {
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

.home__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
}

.home__noise-svg {
  width: 100%;
  height: 100%;
}

.home__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2.25rem) clamp(0.75rem, 2vw, 1.25rem);
  max-width: min(100%, 1440px);
  margin: 0 auto;
}

.home__header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.85rem, 2vw, 1.25rem);
}

.home__logo-link {
  display: block;
  flex: 0 0 auto;
  line-height: 0;
  text-decoration: none;
  color: inherit;
}

.home__logo {
  display: block;
  width: 80px;
  height: 30.57px;
  object-fit: contain;
}

.home__progress {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: min(200px, 46vw);
}

.home__progress-segment {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}

.home__progress-segment--active {
  background: #fff;
}

.home__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding-block: clamp(0.75rem, 2vw, 1.5rem);
}

.home__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: min(68dvh, 720px);
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.72);
}

.home__status--error p {
  margin: 0;
}

.home__retry {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.home__retry:hover {
  background: rgba(255, 255, 255, 0.14);
}

.home__cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.65rem, 1.5vw, 1.15rem);
  width: 100%;
  align-items: stretch;
  min-height: min(68dvh, 720px);
}

.home__card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.35);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.home__card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.home__card--selected {
  border-color: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.85),
    0 18px 48px rgba(0, 0, 0, 0.45);
}

.home__card-visual {
  flex: 1;
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  min-height: 0;
  background: #0a0a0a;
}

.home__card-visual--single {
  grid-template-rows: 1fr;
}

.home__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.home__card-text {
  flex: 0 0 auto;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.2rem;
  padding: clamp(0.65rem, 1.4vw, 0.9rem) clamp(0.5rem, 1.2vw, 0.65rem) clamp(0.75rem, 1.6vw, 1rem);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.55) 100%);
}

.home__card-title {
  font-size: clamp(0.72rem, 1.15vw, 0.95rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.01em;
}

.home__card-sub {
  font-size: clamp(0.62rem, 0.95vw, 0.78rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.3;
}

.home__watermark {
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

@media (max-width: 960px) {
  .home__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: auto;
  }

  .home__card-visual {
    min-height: clamp(200px, 32vw, 280px);
  }

  .home__card-visual--single {
    min-height: clamp(220px, 38vw, 320px);
  }
}

@media (max-width: 520px) {
  .home__cards {
    grid-template-columns: 1fr;
  }
}
</style>
