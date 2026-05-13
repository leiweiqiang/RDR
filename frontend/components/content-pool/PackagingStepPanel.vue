<template>
  <main class="pkg__main">
    <div class="pkg__left">
      <ContentPoolVideoPreviewFrame
        :image-url="previewImageUrl"
        framed
        show-meta-badge
        :show-scrubber="false"
      />
      <div class="pkg__radios" role="radiogroup" aria-label="Metadata placement">
        <label class="pkg__radio">
          <input v-model="placement" class="pkg__radio-input" type="radio" value="manifest" />
          <span class="pkg__radio-dot" :class="{ 'pkg__radio-dot--on': placement === 'manifest' }" aria-hidden="true" />
          <span>Metadata in Manifest</span>
        </label>
        <label class="pkg__radio">
          <input v-model="placement" class="pkg__radio-input" type="radio" value="video" />
          <span class="pkg__radio-dot" :class="{ 'pkg__radio-dot--on': placement === 'video' }" aria-hidden="true" />
          <span>Metadata in Video</span>
        </label>
      </div>
    </div>

    <aside class="pkg__spec" aria-labelledby="pkg-spec-title">
      <h2 id="pkg-spec-title" class="visually-hidden">Output specifications</h2>
      <section class="pkg__block">
        <h3 class="pkg__block-title">Original</h3>
        <dl class="pkg__dl">
          <div class="pkg__row">
            <dt>Resolution</dt>
            <dd>4K</dd>
          </div>
          <div class="pkg__row">
            <dt>Bitrate</dt>
            <dd><span class="pkg__val">100 Mbps</span></dd>
          </div>
          <div class="pkg__row">
            <dt>Frame Rate</dt>
            <dd><span class="pkg__val">120Hz</span></dd>
          </div>
        </dl>
      </section>
      <section class="pkg__block">
        <h3 class="pkg__block-title">Final Result (720p)</h3>
        <dl class="pkg__dl">
          <div class="pkg__row">
            <dt>Bitrate</dt>
            <dd><span class="pkg__val">100 Mbps</span></dd>
          </div>
          <div class="pkg__row">
            <dt>Frame Rate</dt>
            <dd><span class="pkg__val">30Hz</span></dd>
          </div>
        </dl>
      </section>
      <section class="pkg__block">
        <h3 class="pkg__block-title">Final Result (360p)</h3>
        <dl class="pkg__dl">
          <div class="pkg__row">
            <dt>Bitrate</dt>
            <dd><span class="pkg__val">10 Mbps</span></dd>
          </div>
          <div class="pkg__row">
            <dt>Frame Rate</dt>
            <dd><span class="pkg__val">30Hz</span></dd>
          </div>
        </dl>
      </section>
    </aside>

    <div class="pkg__actions">
      <button type="button" class="pkg__btn">Packaging</button>
      <button type="button" class="pkg__btn" @click="goNext">Next</button>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  previewImageUrl: string
  poolId: string
}>()

const router = useRouter()

const placement = ref<'manifest' | 'video'>('manifest')

function goNext() {
  router.push('/home')
}
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.pkg__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  grid-template-rows: auto auto;
  gap: clamp(0.75rem, 2vw, 1.25rem);
  align-items: start;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.pkg__left {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.pkg__spec {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  border-radius: 12px;
  padding: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(22, 22, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}

.pkg__block + .pkg__block {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.pkg__block-title {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  text-transform: none;
}

.pkg__dl {
  margin: 0;
}

.pkg__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  font-size: 0.78rem;
  padding: 0.2rem 0;
}

.pkg__row dt {
  margin: 0;
  color: #9a9a9a;
  font-weight: 600;
}

.pkg__row dd {
  margin: 0;
  font-weight: 700;
  color: #fff;
}

.pkg__val {
  color: #00e676;
}

.pkg__radios {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pkg__radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.78rem, 1.05vw, 0.88rem);
  font-weight: 600;
  color: #e8e8e8;
  cursor: pointer;
}

.pkg__radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pkg__radio-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.pkg__radio-dot--on {
  background: #00e676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.55);
}

.pkg__actions {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pkg__btn {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.45rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0, 230, 118, 0.35);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pkg__btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .pkg__main {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .pkg__spec {
    grid-column: 1;
    grid-row: auto;
  }

  .pkg__actions {
    grid-column: 1;
  }
}
</style>
