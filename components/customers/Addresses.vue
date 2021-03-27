<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title> Adresses </template>
      <template #description>
        Gerez les adresses du client, ces adresses seront utilisables pour des
        futurs devis, factures ou contrats.
      </template>
      <template #actions>
        <button
          class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
          @click="dialog = true"
        >
          <i class="bx bx-plus mr-2"></i>
          Ajouter une adresse
        </button>
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
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                  @click="editAddress(item)"
                >
                  Modifier
                </button>

                <button
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  @click="deleteAddress(address)"
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
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bxs-map text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #content>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="street">Adresse</label>
            <input
              id="street"
              v-model="address.street"
              :disabled="role === 0"
              type="text"
              required
              class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="mt-2">
              <label class="text-sm text-gray-500" for="zip">Code postal</label>
              <input
                id="zip"
                v-model="address.zip"
                :disabled="role === 0"
                type="text"
                required
                class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              />
            </div>
            <div class="mt-2">
              <label class="text-sm text-gray-500" for="city">Ville</label>
              <input
                id="city"
                v-model="address.city"
                :disabled="role === 0"
                type="text"
                required
                class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              />
            </div>
          </div>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="country">Pays</label>
            <input
              id="country"
              v-model="address.country"
              :disabled="role === 0"
              type="text"
              required
              class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            />
          </div>
        </template>
        <template #footer>
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ update ? 'Mettre à jour' : 'Ajouter' }}
          </button>

          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="dialog = false"
          >
            Annuler
          </button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Address, AddressHeaders } from '@/types/address'
import { mapGetters, mapState } from 'vuex'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'Addresses',
  data: () => ({
    addressHeaders: AddressHeaders,
    address: {} as Address,
    dialog: false,
    update: false,
  }),
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer', 'addresses']),
  },
  methods: {
    async addAddress() {
      if (this.update && this.address.$key) {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('customers')
          .doc(this.customer.$key)
          .collection('addresses')
          .doc(this.address.$key)
          .update(this.address)
      } else {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('customers')
          .doc(this.customer.$key)
          .collection('addresses')
          .add(this.address)
      }

      this.address = {} as Address
      this.dialog = false
      this.$notify(
        'Les changements ont étés sauvegardés',
        NotificationType.SUCCESS
      )
    },

    editAddress(address: Address) {
      this.address = address
      this.update = true
      this.dialog = true
    },

    async deleteAddress(address: Address) {
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('addresses')
        .doc(address.$key!)
        .delete()

      this.$notify("L'adresse à été supprimée", NotificationType.SUCCESS)
    },
  },
})
</script>
