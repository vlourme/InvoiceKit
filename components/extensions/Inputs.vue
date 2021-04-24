<template>
  <div>
    <div v-for="(field, idx) in inputs" :key="idx" class="mt-2">
      <!-- Label -->
      <base-label :for="field.value">{{ field.name }}</base-label>

      <!-- Select -->
      <base-select
        v-if="field.type === FieldType.Select"
        :id="field.value"
        v-model="container[field.value]"
        :items="field.selects"
      />

      <!-- Textarea -->
      <base-textarea
        v-else-if="field.type === FieldType.Textarea"
        :id="field.value"
        v-model="container[field.value]"
        :placeholder="field.placeholder"
      ></base-textarea>

      <!-- Number -->
      <base-input
        v-else-if="field.type === FieldType.Number"
        :id="field.value"
        v-model.number="container[field.value]"
        :required="field.required"
        :placeholder="field.placeholder"
        type="number"
      />

      <!-- Input -->
      <base-input
        v-else
        :id="field.value"
        v-model.trim="container[field.value]"
        :required="field.required"
        :placeholder="field.placeholder"
        :type="getInputType(field.type)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropOptions } from '@nuxtjs/composition-api'
import { ExtensibleField, FieldType } from '~/types/team'
import { getInputType } from '~/composables/useExtensibleField'

export default defineComponent({
  props: {
    fields: {
      type: Array,
      required: true,
    } as PropOptions<ExtensibleField[]>,
    state: {
      type: Object,
      required: true,
    } as PropOptions<{ [key: string]: any }>,
  },
  setup(props, { emit }) {
    // Computed
    const inputs = computed(() => props.fields ?? [])
    const container = computed({
      get(): { [key: string]: any } {
        return props.state!
      },
      set(v): void {
        emit('update:customer', v)
      },
    })

    return { inputs, container, FieldType, getInputType }
  },
})
</script>
