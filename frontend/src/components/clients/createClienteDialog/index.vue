<template>
  <q-dialog v-model="isVisible" :persistent="loading" class="dialog-add-client">
    <q-card style="width: 100%; max-width: 800px">
      <q-card-section class="q-pa-none q-mb-sm">
        <div class="row items-center q-pa-md">
          <div class="fnt-size-16 fnt-weight-500">
            {{ !!clientId ? 'Editar' : 'Adicionar' }} Cliente
          </div>
        </div>
        <q-separator />
      </q-card-section>
      <q-form @submit="clientId ? edit() : create()" novalidate>
        <q-card-section class="row flex q-col-gutter-sm scroll" style="max-height: 70vh">
          <div class="col-12">
            <label class="required fnt-size-16"> Nome Completo </label>
            <q-input
              v-model="name"
              ref="name"
              color="teal"
              outlined
              dense
              placeholder="Nome e Sobrenome"
              class="q-mt-sm fnt-size-16 fnt-weight-300"
              :rules="textRules"
              :error="!!errorMessages.name"
              :error-message="errorMessages.name"
              @update:model-value="
                () => {
                  errorMessages.name = ''
                }
              "
            />
          </div>
          <div class="col-12">
            <label class="required fnt-size-16"> E-mail </label>
            <q-input
              v-model="email"
              ref="email"
              color="teal"
              outlined
              dense
              placeholder="E-mail"
              class="q-mt-sm fnt-size-16 fnt-weight-300"
              :rules="textRules"
              :error="!!errorMessages.email"
              :error-message="errorMessages.email"
              @update:model-value="
                () => {
                  errorMessages.email = ''
                }
              "
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <label class="required fnt-size-16"> Telefone (somente números) </label>
            <q-input
              v-model.unmasked-value="phone"
              ref="phone"
              color="teal"
              outlined
              dense
              placeholder="Telefone"
              class="q-mt-sm fnt-size-16 fnt-weight-300"
              :rules="textRules"
              :error="!!errorMessages.phone"
              :error-message="errorMessages.phone"
              @update:model-value="
                () => {
                  errorMessages.phone = ''
                }
              "
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <label class="required fnt-size-16"> Data de nascimento </label>
            <q-input
              v-model="bornDate"
              ref="date"
              color="teal"
              outlined
              dense
              placeholder="Data de nascimento"
              class="q-mt-sm fnt-size-16 fnt-weight-300"
              :rules="textRules"
              :error="!!errorMessages.bornDate"
              :error-message="errorMessages.bornDate"
              @update:model-value="
                () => {
                  errorMessages.bornDate = ''
                }
              "
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true" />
              </template>

              <q-popup-proxy
                v-model="showDatePicker"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="bornDate" mask="DD/MM/YYYY" @input="showDatePicker = false" />
              </q-popup-proxy>
            </q-input>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="flex justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              outline
              color="negative"
              v-close-popup
              class="fnt-size-14 fnt-weight-700"
              :disable="loading"
              no-caps
            />
            <q-btn
              label="Salvar"
              outline
              color="primary"
              no-caps
              :loading="loading"
              class="fnt-size-14 fnt-weight-700"
              type="submit"
            />
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { Notify } from 'quasar'
import { useClientsStore } from 'src/stores/clients'
import { defineComponent } from 'vue'
import { validateErrorMessage } from 'src/helper/validateErrorMessage'

export default defineComponent({
  name: 'AddClientDialog',
  data() {
    const clientsStore = useClientsStore()
    const validates = {
      textRules: [(val: string) => !!val || 'Por favor, preencha este campo'],
    }

    return {
      clientsStore,
      isVisible: false,
      clientId: '',
      loading: false,
      name: '',
      email: '',
      phone: '',
      bornDate: '',
      showDatePicker: false,
      ...validates,
      errorMessages: {
        name: '',
        email: '',
        phone: '',
        bornDate: '',
      },
    }
  },
  computed: {
    ...mapState(useClientsStore, ['clients', 'client', 'incomingPagination']),
    formatedBornDate() {
      const splittedDate = this.bornDate.split('/')
      const day = Number(splittedDate[0])
      const month = Number(splittedDate[1]) - 1
      const year = Number(splittedDate[2])
      return new Date(year, month, day).toISOString()
    },
  },
  methods: {
    ...mapActions(useClientsStore, ['createClient', 'editClient', 'getClient', 'getClients']),
    async open(id: string) {
      this.clearFields()
      if (id) {
        this.clientId = id
        this.getClient(id).then(() => {
          if (this.client) {
            this.name = this.client.name
            this.email = this.client.email
            this.phone = this.client.phone
            const splittedDate = this.client.born_date.split('T')[0]?.split('-') ?? ''
            this.bornDate = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
          }
        })
      }
      this.isVisible = true
    },
    create() {
      if (!this.loading) {
        this.loading = true
        this.createClient(this.name, this.email, this.phone, this.formatedBornDate)
          .then(() => {
            Notify.create({
              message: 'Cliente cadastrado com sucesso.',
              color: 'primary',
            })
            this.isVisible = false
          })
          .catch((error) => {
            Notify.create({
              message: error.message,
              color: 'red',
            })
            this.errorMessages = validateErrorMessage(error.error)
          })
          .finally(() => {
            this.getClients()
            this.loading = false
          })
      }
    },
    edit() {
      if (!this.loading) {
        this.loading = true
        this.editClient(this.clientId, this.name, this.email, this.phone, this.formatedBornDate)
          .then(() => {
            Notify.create({
              message: 'Cliente atualizado com sucesso.',
              color: 'primary',
            })
            this.isVisible = false
          })
          .catch((error) => {
            Notify.create({
              message: error.message,
              color: 'red',
            })
            this.errorMessages = validateErrorMessage(error.error)
          })
          .finally(() => {
            this.getClients()
            this.loading = false
          })
      }
    },
    clearFields() {
      this.name = ''
      this.email = ''
      this.phone = ''
      this.bornDate = ''
      this.errorMessages.name = ''
      this.errorMessages.email = ''
      this.errorMessages.phone = ''
      this.errorMessages.bornDate = ''
    },
  },
})
</script>

<style lang="scss">
.dialog-add-client {
  .red {
    color: red;
  }
  .text-privacy-policy {
    margin-left: 0;
    display: flex;
    align-items: center;
  }

  .button-privacy-policy {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
