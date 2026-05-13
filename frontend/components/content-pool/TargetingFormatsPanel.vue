<template>
  <main class="hsa__main">
    <div class="hsa__preview-col">
      <div class="hsa__preview-card">
        <div class="hsa__preview-thumb">
          <img :src="previewImageUrl" alt="Source video preview" loading="lazy" decoding="async" />
          <button type="button" class="hsa__play" aria-label="Play preview">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </button>
        </div>
        <div class="hsa__preview-meta-row">
          <p class="hsa__preview-meta">Original: 4K, 120 fps</p>
          <button type="button" class="hsa__btn-next" @click="goNext">Next</button>
        </div>
      </div>
    </div>

    <div class="hsa__bridge" aria-hidden="true">
      <span class="hsa__bridge-line" />
      <span class="hsa__bridge-label">target to</span>
      <span class="hsa__bridge-line" />
    </div>

    <section class="hsa__targets" aria-labelledby="hsa-targets-title">
      <h2 id="hsa-targets-title" class="visually-hidden">Target formats</h2>
      <div class="hsa__targets-panel">
        <ul class="hsa__target-list">
          <li v-for="(row, index) in targetRows" :key="row.id" class="hsa__target-row">
            <span
              class="hsa__row-check"
              :class="{ 'hsa__row-check--on': isRowComplete(row) }"
              role="checkbox"
              :aria-checked="isRowComplete(row)"
              :aria-label="isRowComplete(row) ? 'Target row complete' : 'Target row incomplete'"
            />
            <label class="hsa__field">
              <span class="visually-hidden">Resolution</span>
              <select v-model="row.resolution" class="hsa__select hsa__select--panel" aria-label="Resolution">
                <option value="" disabled>Resolution</option>
                <option v-for="opt in resolutionOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </label>
            <label class="hsa__field">
              <span class="visually-hidden">Frames per second</span>
              <select v-model="row.fps" class="hsa__select hsa__select--panel" aria-label="Frames per second">
                <option value="" disabled>Frames</option>
                <option v-for="opt in fpsOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </label>
            <label class="hsa__field">
              <span class="visually-hidden">Bitrate</span>
              <select v-model="row.bitrate" class="hsa__select hsa__select--panel" aria-label="Bitrate in Mbps">
                <option value="" disabled>Bits</option>
                <option v-for="opt in bitrateOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </label>
            <div class="hsa__row-actions">
              <button type="button" class="hsa__icon-square hsa__icon-square--add" aria-label="Add target row" @click="addRowAfter(index)">
                +
              </button>
              <button
                v-if="index > 0"
                type="button"
                class="hsa__icon-square hsa__icon-square--remove"
                aria-label="Remove this row"
                @click="removeRow(index)"
              >
                −
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  previewImageUrl: string
  poolId: string
}>()

const router = useRouter()

const resolutionOptions = ['720 X 405', '1920 X 1080', '360 X 203', '3840 X 2160'] as const
const fpsOptions = ['120 fps', '60 fps', '30 fps', '10 fps'] as const
const bitrateOptions = ['100 Mbps', '50 Mbps', '30 Mbps', '10 Mbps', '2 Mbps'] as const

type TargetRow = {
  id: string
  resolution: string
  fps: string
  bitrate: string
}

let rowId = 0
function makeRow(partial: Partial<TargetRow> = {}): TargetRow {
  rowId += 1
  return {
    id: `r-${rowId}`,
    resolution: partial.resolution ?? '',
    fps: partial.fps ?? '',
    bitrate: partial.bitrate ?? '',
  }
}

const targetRows = ref<TargetRow[]>([
  makeRow({ resolution: '720 X 405', fps: '120 fps', bitrate: '100 Mbps' }),
  makeRow({ resolution: '1920 X 1080', fps: '30 fps', bitrate: '30 Mbps' }),
  makeRow({ resolution: '360 X 203', fps: '10 fps', bitrate: '2 Mbps' }),
  makeRow(),
])

function isRowComplete(row: TargetRow) {
  return !!(row.resolution && row.fps && row.bitrate)
}

function addRowAfter(index: number) {
  targetRows.value.splice(index + 1, 0, makeRow())
}

function removeRow(index: number) {
  if (index <= 0 || targetRows.value.length <= 1) return
  targetRows.value.splice(index, 1)
}

function goNext() {
  router.push(`/content-pool/${props.poolId}/metadata-extraction`)
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

.hsa__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.15fr);
  align-items: start;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  flex: 1;
  min-height: 0;
  padding-bottom: clamp(1rem, 3vw, 2rem);
}

.hsa__preview-col {
  min-width: 0;
}

.hsa__preview-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.hsa__preview-thumb {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #0a0a0a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.hsa__preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hsa__play {
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
}

.hsa__play:hover {
  transform: scale(1.04);
  background: #fff;
}

.hsa__play svg {
  width: 1rem;
  height: 1rem;
  margin-left: 2px;
}

.hsa__preview-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hsa__preview-meta {
  margin: 0;
  font-size: clamp(0.78rem, 1.1vw, 0.9rem);
  font-weight: 600;
  color: #fff;
}

.hsa__btn-next {
  border: none;
  border-radius: 8px;
  padding: 0.45rem 1.35rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0, 230, 118, 0.4);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.hsa__btn-next:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.hsa__bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding-top: clamp(2rem, 12vw, 5rem);
  min-width: 4.5rem;
}

.hsa__bridge-line {
  flex: 1;
  width: 1px;
  min-height: 1.25rem;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.55), transparent);
}

.hsa__bridge-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
}

.hsa__targets {
  min-width: 0;
}

.hsa__targets-panel {
  position: relative;
  border-radius: 10px;
  padding: clamp(1rem, 2vw, 1.35rem);
  background: rgba(28, 28, 32, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.hsa__target-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.hsa__target-row {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto;
  align-items: center;
  gap: 0.45rem;
}

.hsa__row-check {
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 3px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  background: transparent;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.hsa__row-check--on {
  border-color: #00e676;
  background: #00e676
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L20 7'/%3E%3C/svg%3E")
    center / 0.65rem no-repeat;
  box-shadow: 0 0 10px rgba(0, 230, 118, 0.45);
}

.hsa__field {
  min-width: 0;
}

.hsa__select {
  appearance: none;
  width: 100%;
  padding: 0.45rem 1.85rem 0.45rem 0.55rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.45rem center;
}

.hsa__select--panel {
  color: #111;
  background-color: #fff;
  border-color: rgba(0, 0, 0, 0.12);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.hsa__select option {
  color: #111;
  background: #fff;
}

.hsa__row-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.hsa__icon-square {
  width: 1.65rem;
  height: 1.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.hsa__icon-square--add {
  color: #000;
  background: #00e676;
  border-color: rgba(0, 230, 118, 0.65);
}

.hsa__icon-square--remove {
  color: #fff;
  background: #ff5252;
  border-color: rgba(255, 82, 82, 0.55);
}

.hsa__icon-square:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .hsa__main {
    grid-template-columns: 1fr;
  }

  .hsa__bridge {
    flex-direction: row;
    padding-top: 0;
    min-width: 0;
    width: 100%;
  }

  .hsa__bridge-line {
    width: auto;
    height: 1px;
    min-height: 0;
    flex: 1;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }

  .hsa__target-row {
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(4, auto);
  }

  .hsa__row-check {
    grid-column: 1;
    grid-row: 1 / span 4;
    align-self: start;
    margin-top: 0.42rem;
  }

  .hsa__field:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
  }

  .hsa__field:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }

  .hsa__field:nth-child(4) {
    grid-column: 2;
    grid-row: 3;
  }

  .hsa__row-actions {
    grid-column: 2;
    grid-row: 4;
    justify-self: end;
  }
}

@media (max-width: 520px) {
  .hsa__target-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .hsa__row-check {
    grid-column: 1;
    grid-row: 1;
    margin-top: 0;
  }

  .hsa__field:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }

  .hsa__field:nth-child(3) {
    grid-column: 1;
    grid-row: 3;
  }

  .hsa__field:nth-child(4) {
    grid-column: 1;
    grid-row: 4;
  }

  .hsa__row-actions {
    grid-column: 1;
    grid-row: 5;
    justify-self: start;
  }
}
</style>
