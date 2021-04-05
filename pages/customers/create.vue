<template>
  <form @submit.prevent="createCustomer">
    <Header>
      Créer une fiche client

      <template #actions>
        <base-nav-button type="submit"> Enregister </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Créer un nouveau client</template>
          <template #description
            >Créer un nouveau client pour lui assigner des adresses, factures et
            contrats.</template
          >
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label for="name">Nom complet</base-label>
        <base-input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
        />
      </div>

      <div class="mt-2">
        <base-label for="society">Entreprise</base-label>
        <base-input id="society" v-model="customer.society" />
      </div>

      <div class="mt-2">
        <base-label for="email">Email</base-label>
        <base-input id="email" v-model="customer.email" />
      </div>

      <div class="mt-2">
        <base-label for="phone">Téléphone</base-label>
        <base-input id="phone" v-model="customer.phone" />
      </div>

      <div class="mt-2">
        <base-label for="notes">Notes</base-label>
        <base-textarea id="notes" v-model="customer.notes"></base-textarea>
      </div>
    </FormBox>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import RootState from '~/store'
import { defaultCustomer } from '~/types/customer'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    const ctx = useContext()
    const router = useRouter()
    const store = useStore<RootState>()

    // Data
    const customer = ref(defaultCustomer())

    // Computed
    const user = computed(() => store.state.auth.user!)

    // Methods
    const createCustomer = async (): Promise<void> => {
      const doc = await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .add(customer.value)

      router.push(`/customers/${doc.id}`)
    }

    return { customer, createCustomer }
  },
  head: {
    title: 'Créer une fiche client',
  },
})
</script>
