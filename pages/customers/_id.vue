<template>
  <form @submit.prevent="updateCustomer">
    <Header>
      {{ customer.fullName }}
      <span v-if="customer.society">@ {{ customer.society }}</span>

      <template v-if="role > 0" #actions>
        <base-nav-button> Mettre à jour </base-nav-button>
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
            <base-button-inline
              danger
              icon="minus"
              @click.prevent="deleteCustomer"
            >
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

    <customers-addresses class="my-4"></customers-addresses>

    <customers-invoices class="my-4"></customers-invoices>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useAsync,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import RootState from '~/store'
import { Customer, defaultCustomer } from '~/types/customer'
import { DialogType } from '~/types/dialog'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()
    const route = useRoute()
    const router = useRouter()

    // Data
    const user = store.state.auth.user!
    const customer = ref(defaultCustomer())

    // Fetch data
    useFetch(async () => {
      const { id } = route.value.params
      await store.dispatch('payload/fetchCustomer', id)
      await store.dispatch('payload/fetchAddresses', id)

      customer.value = store.state.payload.customer!
    })

    // Computed
    const role = computed(() => store.getters['team/role'])

    // Methods
    const updateCustomer = async (): Promise<void> => {
      // Update customer
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.team!)
        .collection('customers')
        .doc(customer.value.$key!)
        .update(customer.value)

      ctx.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
    }

    const deleteCustomer = (): void => {
      ctx.$dialog({
        title: 'Supprimer cette fiche client',
        message:
          'Tout le contenu associé sera supprimé (factures, contrats, etc.) et irrécuperable.',
        type: DialogType.Error,
        callback: async () => await deleteCallback(),
        showCancel: true,
        actionMessage: 'Supprimer',
      })
    }

    const deleteCallback = async (): Promise<void> => {
      // Delete customer
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.team!)
        .collection('customers')
        .doc(customer.value.$key!)
        .delete()

      await router.push('/customers')
    }

    return { updateCustomer, deleteCustomer, customer, role }
  },
  head: {
    title: 'Fiche client',
  },
})
</script>
