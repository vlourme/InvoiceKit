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
import Vue from 'vue'
import { Address } from '@/types/address'
import { mapGetters, mapState } from 'vuex'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'Addresses',
  data: () => ({
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
