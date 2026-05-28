<template>
  <main class="hsa__main">
    <div class="hsa__preview-col">
      <div class="hsa__preview-card">
        <div class="hsa__preview-thumb">
          <img :src="previewImageUrl" alt="Source video preview" loading="lazy" decoding="async" />
        </div>
        <div class="hsa__preview-meta-row">
          <p class="hsa__preview-meta">{{ originalMeta }}</p>
          <NuxtLink
            v-if="canProceed"
            :to="metadataExtractionHref"
            class="hsa__btn-next"
          >
            Next
          </NuxtLink>
          <button
            v-else
            type="button"
            class="hsa__btn-next hsa__btn-next--disabled"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div class="hsa__bridge" aria-hidden="true">
      <span class="hsa__bridge-line" />
      <span class="hsa__bridge-label">target to</span>
      <span class="hsa__bridge-line" />
    </div>

    <section class="hsa__targets" aria-labelledby="hsa-targets-title">
      <div class="hsa__targets-panel">
        <h2 id="hsa-targets-title" class="visually-hidden">Target formats</h2>
        <div class="hsa__target-list-head" aria-hidden="true">
          <span class="hsa__target-list-head-spacer" />
          <span class="hsa__target-list-head-label">Resolution</span>
          <span class="hsa__target-list-head-label">Frame Rate</span>
          <span class="hsa__target-list-head-label">Bitrate</span>
          <span class="hsa__target-list-head-spacer" />
        </div>
        <ul class="hsa__target-list">
          <li v-for="(row, index) in targetRows" :key="row.id" class="hsa__target-row">
            <span
              class="hsa__row-check"
              :class="{ 'hsa__row-check--on': isRowComplete(row) }"
              role="checkbox"
              :aria-checked="isRowComplete(row)"
              :aria-label="isRowComplete(row) ? 'Target row complete' : 'Target row incomplete'"
            />
            <div class="hsa__field">
              <span class="visually-hidden">Resolution</span>
              <AppStringSelect
                v-model="row.resolution"
                :options="resolutionOptionsForRow(index)"
                placeholder="Resolution"
                aria-label="Resolution"
                trigger-class="hsa__select-trigger hsa__select-trigger--panel"
              />
            </div>
            <div class="hsa__field">
              <span class="visually-hidden">Frames per second</span>
              <div class="hsa__field-fixed" :aria-label="`Frames per second: ${FIXED_FPS}`">{{ FIXED_FPS }}</div>
            </div>
            <div class="hsa__field">
              <span class="visually-hidden">Bitrate</span>
              <div
                class="hsa__field-fixed"
                :aria-label="bitrateAriaLabel(row.resolution)"
              >
                {{ bitrateLabel(row.resolution) }}
              </div>
            </div>
            <div class="hsa__row-actions">
              <button
                type="button"
                class="hsa__icon-square hsa__icon-square--add"
                aria-label="Add target row"
                :disabled="!canAddRow"
                @click="addRowAfter(index)"
              >
                +
              </button>
              <button
                v-if="targetRows.length > 1"
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
import {
  bitrateLabelForResolution,
  FIXED_FPS_LABEL,
  loadTargetingResolutionRows,
  RESOLUTION_OPTION_LABELS,
  RESOLUTION_PRESETS,
  saveTargetingResolutionRows,
} from '~/utils/contentPoolTargeting'

const props = defineProps<{
  previewImageUrl: string
  originalMeta: string
  poolId: string
}>()

const metadataExtractionHref = computed(
  () => `/content-pool/${props.poolId}/metadata-extraction`,
)

const resolutionOptions = RESOLUTION_OPTION_LABELS
const FIXED_FPS = FIXED_FPS_LABEL

function bitrateLabel(resolution: string): string {
  return bitrateLabelForResolution(resolution)
}

function bitrateAriaLabel(resolution: string): string {
  const label = bitrateLabel(resolution)
  return resolution ? `Bitrate: ${label}` : 'Bitrate'
}

type TargetRow = {
  id: string
  resolution: string
}

let rowId = 0
function makeRow(partial: Partial<TargetRow> = {}): TargetRow {
  rowId += 1
  return {
    id: `r-${rowId}`,
    resolution: partial.resolution ?? '',
  }
}

const targetRows = ref<TargetRow[]>([makeRow()])

function restoreTargetRowsFromStorage() {
  rowId = 0
  const saved = loadTargetingResolutionRows(props.poolId)
  if (saved == null || saved.length === 0) {
    targetRows.value = [makeRow()]
    return
  }
  targetRows.value = saved.map((resolution) => makeRow({ resolution }))
}

restoreTargetRowsFromStorage()

watch(
  () => props.poolId,
  () => {
    restoreTargetRowsFromStorage()
  },
)

watch(
  targetRows,
  (rows) => {
    saveTargetingResolutionRows(
      props.poolId,
      rows.map((row) => row.resolution),
    )
  },
  { deep: true },
)

const canAddRow = computed(
  () => targetRows.value.length < RESOLUTION_PRESETS.length,
)

function resolutionOptionsForRow(rowIndex: number): string[] {
  const usedByOthers = new Set(
    targetRows.value
      .map((row, i) => (i !== rowIndex ? row.resolution : ''))
      .filter(Boolean),
  )
  return resolutionOptions.filter((opt) => !usedByOthers.has(opt))
}

function isRowComplete(row: TargetRow) {
  return !!row.resolution
}

const canProceed = computed(
  () => targetRows.value.length > 0 && targetRows.value.every(isRowComplete),
)

function addRowAfter(index: number) {
  if (!canAddRow.value) return
  targetRows.value.splice(index + 1, 0, makeRow())
}

function removeRow(index: number) {
  if (targetRows.value.length <= 1) return
  targetRows.value.splice(index, 1)
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
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

.hsa__btn-next--disabled,
.hsa__btn-next--disabled:hover {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
  filter: none;
  transform: none;
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

.hsa__target-list-head {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto;
  align-items: end;
  gap: 0.45rem;
  margin-bottom: 0.45rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hsa__target-list-head-spacer {
  width: 1rem;
}

.hsa__target-list-head-label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
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

:deep(.hsa__select-trigger) {
  appearance: none;
  width: 100%;
  height: auto;
  min-height: 2rem;
  padding: 0.45rem 0.55rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: none;
}

:deep(.hsa__select-trigger--panel) {
  color: #111;
  background-color: #fff;
  border-color: rgba(0, 0, 0, 0.12);
}

:deep(.hsa__select-trigger--panel svg) {
  color: #222;
  opacity: 1;
}

.hsa__field-fixed {
  width: 100%;
  min-height: 2rem;
  padding: 0.45rem 0.55rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: #666;
  background-color: #f0f0f0;
  box-sizing: border-box;
  cursor: not-allowed;
  user-select: none;
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

.hsa__icon-square--add:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  filter: none;
  transform: none;
}

.hsa__icon-square--add:disabled:hover {
  filter: none;
  transform: none;
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

  .hsa__target-list-head {
    display: none;
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
