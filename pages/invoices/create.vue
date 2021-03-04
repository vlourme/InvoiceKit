<template>
  <Header>
    <Card margin :width="1000">
      <template #title> Créer une facture </template>

      <template #actions>
        <v-btn text color="success" @click="createInvoice">
          <v-icon left>mdi-check</v-icon>
          Créer
        </v-btn>
      </template>

      <v-form v-model="valid">
        <v-text-field
          v-model="invoice.data.id"
          label="Identifiant"
          prepend-icon="mdi-pound"
          placeholder="41-FR/2021"
          :rules="[(v) => !!v || 'L\'identifiant est obligatoire']"
        />

        <v-row>
          <v-col>
            <v-select
              v-model="invoice.data.type"
              :items="types"
              prepend-icon="mdi-file"
              label="Type de document"
            ></v-select>
          </v-col>
          <v-col>
            <v-dialog
              ref="dialog"
              v-model="dateMenu"
              :return-value.sync="invoice.data.date"
              persistent
              width="290px"
              @click:outside="dateMenu = false"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="invoice.data.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="invoice.data.date"
                locale="fr-fr"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="error" @click="dateMenu = false">
                  Annuler
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(invoice.data.date)"
                >
                  Confirmer
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-form>
    </Card>

    <Card no-body :width="1000" class="my-4">
      <template #title>Facturation</template>

      <template #actions>
        <v-btn text color="primary" @click="itemDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Nouveau prix
        </v-btn>
      </template>

      <v-data-table
        locale="fr-fr"
        :headers="fieldHeaders"
        :items="invoice.data.fields"
      >
        <template #body="props">
          <draggable :list="props.items" tag="tbody">
            <tr v-for="(item, idx) in props.items" :key="idx">
              <td>
                <v-icon class="cursor-move">mdi-menu</v-icon>
              </td>
              <v-menu max-width="150" offset-y>
                <template #activator="{ on, attrs }">
                  <td v-bind="attrs" v-on="on">{{ item.description }}</td>
                </template>
                <v-list dense color="grey darken-3">
                  <v-list-item link @click="editField(idx)">
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Modifier</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="invoice.data.fields.splice(idx, 1)">
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Supprimer</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              <td>{{ item.quantity }}</td>
              <td>
                <div class="d-flex flex-column justify-center">
                  {{ item.price }} €
                  <span class="font-weight-bold text-caption grey--text">
                    {{ item.tax }}% taxes
                  </span>
                </div>
              </td>
              <td>{{ invoice.getPriceAtIndex(idx) }} €</td>
            </tr>
          </draggable>
        </template>
      </v-data-table>
    </Card>

    <v-dialog v-model="itemDialog" width="500">
      <v-card>
        <v-card-title>Ajouter un objet</v-card-title>

        <v-card-text>
          <v-textarea
            v-model="field.description"
            label="Description"
            rows="3"
          ></v-textarea>

          <v-row>
            <v-col>
              <v-text-field v-model.number="field.quantity" label="Quantité" />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="field.price"
                label="Prix HT"
                suffix="€"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="field.tax"
                label="Taxes"
                suffix="%"
                type="number"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="itemDialog = false">Annuler</v-btn>
          <v-btn color="success" text @click="addField">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="promotionDialog" width="500">
      <v-card>
        <v-card-title>Ajouter une réduction</v-card-title>

        <v-card-text>
          <v-text-field
            v-model.number="invoice.data.promotion"
            label="Réduction (en pourcentage)"
            append-icon="mdi-percentage"
            type="number"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="promotionDialog = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="depositDialog" width="500">
      <v-card>
        <v-card-title>Ajouter un acompte</v-card-title>

        <v-card-text>
          <v-text-field
            v-model.number="invoice.data.deposit"
            label="Acompte (en Euro)"
            append-icon="mdi-currency-eur"
            type="number"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="depositDialog = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <invoice-sidebar
      :customer="customer"
      :promotion-dialog.sync="promotionDialog"
      :deposit-dialog.sync="depositDialog"
      :invoice="invoice"
    />
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  defaultField,
  Field,
  FieldHeaders,
  InvoiceIndex,
  Type,
} from '@/types/invoice'
import draggable from 'vuedraggable'
import { Customer } from '~/types/customer'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { Address } from '~/types/address'
import { mapDocument } from '~/helpers/DocumentMapper'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'CreateInvoice',
  components: {
    draggable,
  },
  layout: 'dashboard',
  data: () => ({
    customer: {} as Customer,
    field: defaultField(),
    invoice: new InvoiceImpl(),
    types: [
      { text: 'Facture', value: Type.Invoice },
      { text: 'Devis', value: Type.Estimation },
    ],
    fieldHeaders: FieldHeaders,
    itemDialog: false,
    promotionDialog: false,
    depositDialog: false,
    dateMenu: false,
    update: -1,
    valid: false,
  }),
  async fetch() {
    // Type fix
    const query = this.$route.query as { [key: string]: string }

    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(query.customer)
      .onSnapshot((snapshot) => {
        this.customer = mapDocument<Customer>(snapshot)
      })

    const doc = await this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(query.customer)
      .collection('addresses')
      .doc(query.address)
      .get()

    this.invoice.data.address = mapDocument<Address>(doc)
  },
  head: {
    title: 'Créer une facture',
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    addField(): void {
      if (this.update === -1) {
        this.invoice.data.fields.push(this.field)
      } else {
        this.invoice.data.fields[this.update] = this.field
      }

      this.update = -1
      this.field = defaultField() as Field
      this.itemDialog = false
    },

    editField(idx: number): void {
      this.field = this.invoice.data.fields[idx]
      this.update = idx
      this.itemDialog = true
    },

    async createInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      // Create invoice
      const doc = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .add(this.invoice.data)

      // Register in a indexed list
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .add({
          id: this.invoice.data.id,
          link: doc.id,
          customer: this.customer,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as InvoiceIndex)
    },
  },
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
