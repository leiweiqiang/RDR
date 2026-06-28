<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="create-project__backdrop"
      @click.self="closeDialog"
    >
      <div
        class="create-project__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <h2 id="create-project-title" class="create-project__title">Create New Project</h2>

        <div class="create-project__card">
          <label class="visually-hidden" for="create-project-name">Project Name</label>
          <input
            id="create-project-name"
            ref="nameInputRef"
            v-model="projectName"
            type="text"
            class="create-project__input"
            placeholder="Project Name"
            autocomplete="off"
          />

          <input
            ref="fileInputRef"
            type="file"
            class="visually-hidden"
            accept="video/*,.mp4,.mov,.mkv,.webm"
            @change="onFileChange"
          />
          <button
            type="button"
            class="create-project__upload"
            @click="openFilePicker"
          >
            <span class="create-project__upload-icon" aria-hidden="true">+</span>
            <span class="create-project__upload-text">
              {{ selectedFile ? selectedFile.name : 'Upload your file here' }}
            </span>
          </button>
        </div>

        <button
          type="button"
          class="create-project__add-btn"
          :disabled="!canSubmit || submitting"
          @click="submitProject"
        >
          {{ submitting ? 'Adding…' : 'Add' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { name: string; file: File }]
}>()

const projectName = ref('')
const selectedFile = ref<File | null>(null)
const submitting = ref(false)
const nameInputRef = ref<HTMLInputElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const canSubmit = computed(
  () => projectName.value.trim().length > 0 && selectedFile.value != null,
)

function resetForm() {
  projectName.value = ''
  selectedFile.value = null
  submitting.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function closeDialog() {
  if (submitting.value) return
  resetForm()
  emit('close')
}

function openFilePicker() {
  fileInputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
}

function submitProject() {
  if (!canSubmit.value || !selectedFile.value || submitting.value) return
  submitting.value = true
  emit('submit', {
    name: projectName.value.trim(),
    file: selectedFile.value,
  })
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
      return
    }
    nextTick(() => nameInputRef.value?.focus())
  },
)

onKeyStroke('Escape', (event) => {
  if (!props.open) return
  event.preventDefault()
  closeDialog()
})

defineExpose({
  finishSubmit() {
    submitting.value = false
    resetForm()
    emit('close')
  },
  failSubmit() {
    submitting.value = false
  },
})
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

.create-project__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2rem);
  background: rgba(0, 0, 0, 0.72);
}

.create-project__panel {
  width: min(100%, 34rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.create-project__title {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 600;
  color: #fff;
}

.create-project__card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: clamp(1rem, 2.5vw, 1.35rem);
  border-radius: 14px;
  background: #fff;
}

.create-project__input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 8px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: #111;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  outline: none;
}

.create-project__input::placeholder {
  color: rgba(0, 0, 0, 0.38);
}

.create-project__input:focus {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.28);
}

.create-project__upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  width: 100%;
  min-height: clamp(10rem, 28vw, 13.5rem);
  padding: 1.25rem;
  border: none;
  border-radius: 8px;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: box-shadow 0.15s ease, background 0.15s ease;
}

.create-project__upload:hover {
  background: #fafafa;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.create-project__upload-icon {
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  color: rgba(0, 0, 0, 0.35);
}

.create-project__upload-text {
  max-width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  word-break: break-word;
}

.create-project__add-btn {
  align-self: center;
  min-width: 7.5rem;
  padding: 0.55rem 2rem;
  border: none;
  border-radius: 999px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
  background: #00e676;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(0, 230, 118, 0.35);
  transition: filter 0.15s ease, transform 0.15s ease;
}

.create-project__add-btn:hover:not(:disabled) {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.create-project__add-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
