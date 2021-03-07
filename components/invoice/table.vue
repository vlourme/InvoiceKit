<template>
  <Card no-body :width="1000" class="my-4">
    <template #title>Facturation</template>

    <template #actions>
      <v-btn text color="primary" @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Nouveau prix
      </v-btn>
    </template>

    <v-data-table
      locale="fr-fr"
      :headers="fieldHeaders"
      :items="invoice.data.fields"
      :items-per-page="-1"
    >
      <template #body="props">
        <draggable :list="props.items" tag="tbody">
          <tr v-for="(item, idx) in props.items" :key="idx">
            <td>
              <v-icon class="cursor-move">mdi-menu</v-icon>
            </td>
            <v-menu max-width="150" offset-y>
              <template #activator="{ on, attrs }">
                <td
                  v-bind="attrs"
                  v-on="on"
                  v-html="replaceWithHTMLBreak(item.description)"
                ></td>
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

    <v-dialog v-model="dialog" width="500" @click:outside="closeField">
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
          <v-btn color="error" text @click="closeField">Annuler</v-btn>
          <v-btn color="success" text @click="addField">
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import draggable from 'vuedraggable'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { defaultField, FieldHeaders } from '~/types/invoice'

export default Vue.extend({
  name: 'InvoiceTable',
  components: {
    draggable,
  },
  props: {
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  data: () => ({
    field: defaultField(),
    fieldHeaders: FieldHeaders,
    dialog: false,
    update: -1,
  }),
  computed: {
    invoice: {
      get() {
        return this.invoiceState
      },
      set(val: InvoiceImpl) {
        this.$emit('update:invoice', val)
      },
    },
  },
  methods: {
    addField(): void {
      if (this.update === -1) {
        this.invoice.data.fields.push(this.field)
      } else {
        this.invoice.data.fields[this.update] = this.field
      }

      this.update = -1
      this.field = defaultField()
      this.dialog = false
    },

    replaceWithHTMLBreak(str: string) {
      return str.replace(/\n/g, '<br />')
    },

    closeField() {
      this.field = defaultField()
      this.update = -1
      this.dialog = false
    },

    editField(idx: number): void {
      this.field = this.invoice.data.fields[idx]
      this.update = idx
      this.dialog = true
    },
  },
})
</script>
