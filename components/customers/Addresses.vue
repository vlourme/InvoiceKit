<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title> Adresses </template>
      <template #description>
        Gerez les adresses du client, ces adresses seront utilisables pour des
        futurs devis, factures ou contrats.
      </template>
      <template #actions>
        <base-button-inline info icon="plus" @click.prevent="dialog = true">
          Ajouter une adresse
        </base-button-inline>
      </template>
    </FormDescription>

    <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-4 font-medium text-gray-600">Adresse</th>
              <th class="text-left p-4 font-medium text-gray-600">Ville</th>
              <th class="text-left p-4 font-medium text-gray-600">Pays</th>
              <th class="p-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody class="divide-y even:bg-gray-100">
            <tr v-for="(item, idx) in addresses" :key="idx">
              <td class="p-3">{{ item.street }}</td>
              <td class="p-3">{{ item.zip }} {{ item.city }}</td>
              <td class="p-3">{{ item.country }}</td>
              <td class="p-3 text-right">
                <button
                  type="button"
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                  @click.prevent="editAddress(item)"
                >
                  Modifier
                </button>

                <button
                  type="button"
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  @click.prevent="deleteAddress(item)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <form @submit.prevent="addAddress">
      <Modal :activator.sync="dialog">
        <template #title>
          {{ update ? 'Mettre à jour une adresse' : 'Ajouter une adresse' }}
        </template>
        <template #icon>
          <base-modal-icon icon="map" />
        </template>
        <template #content>
          <div class="mt-2">
            <base-label for="street">Adresse</base-label>
            <base-input
              id="street"
              v-model="address.street"
              :disabled="role === 0"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="mt-2">
              <base-label for="zip">Code postal</base-label>
              <base-input
                id="zip"
                v-model="address.zip"
                :disabled="role === 0"
                required
              />
            </div>
            <div class="mt-2">
              <base-label for="city">Ville</base-label>
              <base-input
                id="city"
                v-model="address.city"
                :disabled="role === 0"
                required
              />
            </div>
          </div>
          <div class="mt-2">
            <base-label for="country">Pays</base-label>
            <base-input
              id="country"
              v-model="address.country"
              :disabled="role === 0"
              required
            />
          </div>
        </template>
        <template #footer>
          <base-button success type="submit">
            {{ update ? 'Mettre à jour' : 'Ajouter' }}
          </base-button>

          <base-button base type="button" @click.prevent="dialog = false">
            Annuler
          </base-button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import RootState from '~/store'
import { Address, defaultAddress } from '~/types/address'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Computed
    const addresses = computed(() => store.state.payload.addresses)
    const role = computed(() => store.getters['team/role'])
    const customer = computed(() => store.state.payload.customer!)
    const user = computed(() => store.state.auth.user!)

    // Data
    const address = ref(defaultAddress())
    const dialog = ref(false)
    const update = ref(false)

    // Methods
    const addAddress = async () => {
      if (update && address.value.$key) {
        await ctx.$fire.firestore
          .collection('teams')
          .doc(user.value.team!)
          .collection('customers')
          .doc(customer.value.$key!)
          .collection('addresses')
          .doc(address.value.$key)
          .update(address.value)
      } else {
        await ctx.$fire.firestore
          .collection('teams')
          .doc(user.value.team!)
          .collection('customers')
          .doc(customer.value.$key!)
          .collection('addresses')
          .add(address.value)
      }

      address.value = defaultAddress()
      dialog.value = false
      ctx.$notify(
        'Les changements ont étés sauvegardés',
        NotificationType.SUCCESS
      )
    }

    const editAddress = (adr: Address) => {
      address.value = _.cloneDeep(adr)
      update.value = true
      dialog.value = true
    }

    const deleteAddress = async (address: Address) => {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(customer.value.$key!)
        .collection('addresses')
        .doc(address.$key!)
        .delete()

      ctx.$notify("L'adresse à été supprimée", NotificationType.SUCCESS)
    }

    return {
      address,
      dialog,
      update,
      addAddress,
      editAddress,
      deleteAddress,
      addresses,
      role,
    }
  },
})
</script>
