<template>
  <form @submit.prevent="updateCustomer">
    <Header>
      {{ customer.fullName }}
      <span v-if="customer.society">@ {{ customer.society }}</span>

      <template v-if="role > 0" #actions>
        <base-nav-button type="submit" :disabled="!hasChanges">
          Mettre à jour
        </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Mettre à jour un nouveau client</template>
          <template #description>
            Mettre à jour un client pour lui assigner des adresses, factures et
            contrats.
          </template>
          <template v-if="role > 0" #actions>
            <base-button-inline danger icon="minus" @click.prevent="askDelete">
              Supprimer le client
            </base-button-inline>
          </template>
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label for="name">Nom complet</base-label>
        <base-input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="society">Entreprise</base-label>
        <base-input
          id="society"
          v-model="customer.society"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="email">Email</base-label>
        <base-input
          id="email"
          v-model="customer.email"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="phone">Téléphone</base-label>
        <base-input
          id="phone"
          v-model="customer.phone"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="notes">Notes</base-label>
        <base-textarea
          id="notes"
          v-model="customer.notes"
          :disabled="role === 0"
        ></base-textarea>
      </div>
    </FormBox>

    <customers-addresses
      v-if="!$fetchState.pending"
      class="my-4"
    ></customers-addresses>

    <customers-invoices
      v-if="!$fetchState.pending"
      class="my-4"
    ></customers-invoices>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import { DialogType } from '~/types/dialog'
import { NotificationType } from '~/types/notification'
import useCustomer from '~/composables/useCustomer'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const { title } = useMeta()
    const route = useRoute()

    // Data
    const {
      state,
      role,
      hasChanges,
      loadCustomer,
      loadAddresses,
      saveCustomer,
      deleteCustomer,
    } = useCustomer()

    // Fetch data
    useFetch(async () => {
      const id = route.value.params.id
      await loadCustomer(id)
      loadAddresses(id)

      title.value = `${state.customer.value.fullName} — Fiche client`
    })

    const askDelete = (): void => {
      ctx.$dialog({
        title: 'Supprimer cette fiche client',
        message:
          'Tout le contenu associé sera supprimé (factures, contrats, etc.) et irrécuperable.',
        type: DialogType.Error,
        callback: async () => {
          await deleteCustomer()
          ctx.$notify('Le client a été supprimé.', NotificationType.SUCCESS)
        },
        showCancel: true,
        actionMessage: 'Supprimer',
      })
    }

    const updateCustomer = async () => {
      await saveCustomer(true)
      ctx.$notify(
        'Les changements ont étés sauvegardés',
        NotificationType.SUCCESS
      )
    }

    return {
      ...state,
      deleteCustomer,
      updateCustomer,
      hasChanges,
      askDelete,
      role,
    }
  },
  head: {
    title: 'Fiche client',
  },
})
</script>
