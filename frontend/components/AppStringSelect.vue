<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue: string
    options: readonly string[] | string[]
    placeholder: string
    ariaLabel: string
    disabled?: boolean
    disabledOptions?: readonly string[] | string[]
    disabledOptionHint?: string
    triggerClass?: string | string[] | Record<string, boolean>
  }>(),
  { disabled: false, disabledOptions: () => [], disabledOptionHint: '', triggerClass: '', id: undefined },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/** Reka Select + Popper read `window` during SSR; mount it only after hydration. */
const rekaSelectMounted = ref(false)
onMounted(() => {
  rekaSelectMounted.value = true
})

function onUpdate(v: unknown) {
  emit('update:modelValue', typeof v === 'string' ? v : '')
}

function onNativeChange(e: Event) {
  const el = e.target as HTMLSelectElement
  emit('update:modelValue', el.value)
}

const disabledOptionSet = computed(() => new Set(props.disabledOptions))

function optionLabel(opt: string): string {
  if (!disabledOptionSet.value.has(opt) || !props.disabledOptionHint) return opt
  return `${opt}${props.disabledOptionHint}`
}
</script>

<template>
  <Select
    v-if="rekaSelectMounted"
    :model-value="modelValue || undefined"
    :disabled="disabled"
    @update:model-value="onUpdate"
  >
    <SelectTrigger :id="id" :class="triggerClass" :aria-label="ariaLabel">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="opt in options"
        :key="opt"
        :value="opt"
        :disabled="disabledOptionSet.has(opt)"
        :class="{ 'app-string-select__item--disabled': disabledOptionSet.has(opt) }"
      >
        <span>{{ opt }}</span>
        <span
          v-if="disabledOptionSet.has(opt) && disabledOptionHint"
          class="app-string-select__item-hint"
        >
          {{ disabledOptionHint }}
        </span>
      </SelectItem>
    </SelectContent>
  </Select>
  <select
    v-else
    :id="id"
    :class="triggerClass"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :value="modelValue"
    @change="onNativeChange"
  >
    <option v-for="opt in options" :key="opt" :value="opt" :disabled="disabledOptionSet.has(opt)">
      {{ optionLabel(opt) }}
    </option>
  </select>
</template>

<style scoped>
:deep(.app-string-select__item--disabled) {
  color: #9ca3af;
  cursor: not-allowed;
}

:deep(.app-string-select__item--disabled .app-string-select__item-hint) {
  margin-left: 0.35rem;
  font-weight: 500;
  color: #6b7280;
  opacity: 0.9;
}
</style>
