<script setup lang="ts">
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

function onUpdate(v: unknown) {
  emit('update:modelValue', typeof v === 'string' ? v : '')
}
</script>

<template>
  <ClientOnly>
    <Select
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
    <template #fallback>
      <div
        :id="id"
        :class="triggerClass"
        :aria-label="ariaLabel"
        role="status"
      >
        {{ modelValue || placeholder }}
      </div>
    </template>
  </ClientOnly>
</template>
