<template>
  <div>
    <div v-for="(field, idx) in inputs" :key="idx" class="mt-2">
      <!-- Label -->
      <base-label :for="field.value">{{ field.name }}</base-label>

      <!-- Select -->
      <base-select
        v-if="field.type === FieldType.Select"
        :id="field.value"
        v-model="customer[field.value]"
        :items="field.selects"
      />

      <!-- Textarea -->
      <base-textarea
        v-else-if="field.type === FieldType.Textarea"
        :id="field.value"
        v-model="customer[field.value]"
        :placeholder="field.placeholder"
      ></base-textarea>

      <!-- Number -->
      <base-input
        v-else-if="field.type === FieldType.Number"
        :id="field.value"
        v-model.number="customer[field.value]"
        :required="field.required"
        :placeholder="field.placeholder"
        :type="number"
      />

      <!-- Input -->
      <base-input
        v-else
        :id="field.value"
        v-model.trim="customer[field.value]"
        :required="field.required"
        :placeholder="field.placeholder"
        :type="getInputType(field.type)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropOptions } from '@nuxtjs/composition-api'
import { Customer } from '~/types/customer'
import { ExtensibleField, FieldType } from '~/types/team'
import { getInputType } from '~/composables/useExtensibleField'

export default defineComponent({
  props: {
    fields: {
      type: Array,
      required: true,
    } as PropOptions<ExtensibleField[]>,
    customerState: {
      type: Object,
      required: true,
    } as PropOptions<Customer>,
  },
  setup(props, { emit }) {
    // Computed
    const inputs = computed(() => props.fields ?? [])
    const customer = computed({
      get(): Customer {
        return props.customerState!
      },
      set(v): void {
        emit('update:customer', v)
      },
    })

    return { inputs, customer, FieldType, getInputType }
  },
})
</script>
