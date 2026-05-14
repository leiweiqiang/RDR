<template>
  <main class="pbd">
    <section class="pbd__panel" aria-labelledby="pbd-v-title">
      <header class="pbd__head">
        <h2 id="pbd-v-title" class="pbd__title">Video Decode &amp; SR</h2>
        <span class="pbd__pct">{{ videoPct }}%</span>
      </header>
      <ul class="pbd__list">
        <li v-for="(row, i) in videoRows" :key="`v-${i}`" class="pbd__row">
          <span class="pbd__name">Video files name</span>
          <span class="pbd__track" aria-hidden="true">
            <span class="pbd__fill" :style="{ width: `${row.pct}%` }" />
          </span>
          <span v-if="row.pct >= 100" class="pbd__check" aria-label="Complete">✓</span>
        </li>
      </ul>
    </section>

    <section class="pbd__panel" aria-labelledby="pbd-m-title">
      <header class="pbd__head">
        <h2 id="pbd-m-title" class="pbd__title">Decode &amp; SR with Metadata</h2>
        <span class="pbd__pct">{{ metaPct }}%</span>
      </header>
      <ul class="pbd__list">
        <li v-for="(row, i) in metaRows" :key="`m-${i}`" class="pbd__row">
          <span class="pbd__name">Metadata name</span>
          <span class="pbd__track" aria-hidden="true">
            <span class="pbd__fill" :style="{ width: `${row.pct}%` }" />
          </span>
          <span v-if="row.pct >= 100" class="pbd__check" aria-label="Complete">✓</span>
        </li>
      </ul>
    </section>

    <div class="pbd__actions">
      <a :href="playerHref" class="pbd__btn-next">Next</a>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'content-pool-id-playback-decode-sr',
})

const route = useRoute()
const poolId = computed(() => String(route.params.id))

const playerHref = computed(() => `/content-pool/${poolId.value}/playback/player`)

const videoRows = [
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 72 },
  { pct: 55 },
  { pct: 40 },
  { pct: 28 },
  { pct: 18 },
  { pct: 10 },
  { pct: 4 },
]

const metaRows = [
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 100 },
  { pct: 88 },
  { pct: 70 },
  { pct: 52 },
  { pct: 35 },
  { pct: 20 },
]

const videoPct = computed(() =>
  Math.round(videoRows.reduce((a, r) => a + r.pct, 0) / videoRows.length),
)
const metaPct = computed(() =>
  Math.round(metaRows.reduce((a, r) => a + r.pct, 0) / metaRows.length),
)

useHead({
  title: 'High-Speed Action — Decode & SR — RDR',
  meta: [{ name: 'description', content: 'Track decode, super-resolution, and metadata extraction progress.' }],
})
</script>

<style scoped>
.pbd {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  align-items: stretch;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.pbd__panel {
  border-radius: 12px;
  padding: clamp(0.75rem, 1.4vw, 1rem);
  background: rgba(22, 22, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
  min-width: 0;
}

.pbd__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.pbd__title {
  margin: 0;
  font-size: clamp(0.78rem, 1.1vw, 0.9rem);
  font-weight: 700;
  color: #fff;
}

.pbd__pct {
  font-size: 0.78rem;
  font-weight: 700;
  color: #00e676;
}

.pbd__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.pbd__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr) auto;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
}

.pbd__name {
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pbd__track {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.pbd__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #00c853, #00e676);
  min-width: 0;
}

.pbd__check {
  color: #00e676;
  font-weight: 800;
  font-size: 0.75rem;
  width: 1rem;
  text-align: center;
}

.pbd__actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.pbd__btn-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.45rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111;
  background: #d8d8d8;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pbd__btn-next:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .pbd {
    grid-template-columns: 1fr;
  }
}
</style>
