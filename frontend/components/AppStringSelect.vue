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
    triggerClass?: string | string[] | Record<string, boolean>
  }>(),
  { disabled: false, triggerClass: '', id: undefined },
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
      <SelectItem v-for="opt in options" :key="opt" :value="opt">
        {{ opt }}
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
    <option v-for="opt in options" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>
</template>
