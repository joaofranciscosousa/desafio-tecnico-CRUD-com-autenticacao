<template>
  <q-page class="q-pa-lg" style="background-color: #f0f0f0">
    <div class="q-mb-sm">
      <span class="fnt-size-18">
        Lista de clientes
        <Loading v-if="loading" :show="true" size="16px" class="inline-block" />
        <span v-else>({{ pagination.rowsNumber }})</span>
      </span>
    </div>
    <div class="row justify-between q-col-gutter-sm">
      <div class="col-xs-12 col-sm-8">
        <q-input
          v-model="clientStore.search"
          dense
          outlined
          placeholder="Buscar..."
          debounce="1000"
          clearable
          class="bg-white q-mb-md"
          @update:model-value="() => fetchClients()"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="22px" color="grey-5" />
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-btn
          label="Adicionar cliente"
          icon="add"
          color="primary"
          class="full-width fnt-weight-700"
          no-caps
          @click="() => openAddClientDialog()"
        />
      </div>
    </div>
    <q-table
      :columns="columns"
      :rows="clients"
      row-key="id"
      :pagination="pagination"
      :loading="loading"
      hide-pagination
      flat
      no-data-label="Nenhum cliente encontrado."
      style="max-height: none"
    >
      <template #body="props">
        <q-tr :props="props" class="q-mb-lg q-tr">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'actions'">
              <div class="hidden-xs">
                <q-btn
                  v-for="action of actions"
                  :key="action.name"
                  :icon="action.icon"
                  color="grey-8"
                  size="sm"
                  flat
                  round
                  @click="action.action(props)"
                >
                  <q-tooltip v-if="$q.screen.gt.xs">
                    {{ action.label }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>

            <div v-else>
              {{ col.value }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div v-if="pagination.pages > 1" class="flex justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.pages"
        color="grey"
        active-color="primary"
        active-design="unelevated"
        :max-pages="$q.screen.gt.xs ? 6 : 4"
        active-text-color="white"
        direction-links
        flat
        round
        @update:model-value="fetchClients"
      />
    </div>
  </q-page>

  <add-client-dialog ref="clientDialog" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useClientsStore } from 'src/stores/clients'
import { columns } from './constants'
import AddClientDialog from 'src/components/clients/createClienteDialog/index.vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  components: { AddClientDialog },
  data() {
    const clientStore = useClientsStore()

    return {
      clientStore,
      columns,
      actions: [
        {
          name: 'edit',
          label: 'Editar cliente',
          icon: 'edit',
          action: (props: unknown) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.openAddClientDialog(props.key)
          },
        },
        {
          name: 'delete',
          label: 'Exluir cliente',
          icon: 'delete',
          action: (props: unknown) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.delete(props.key)
          },
        },
      ],
    }
  },
  computed: {
    ...mapState(useClientsStore, ['clients', 'loading', 'pagination']),
  },
  watch: {
    'clientStore.search'() {
      this.fetchClients()
    },
  },
  created() {
    this.fetchClients()
  },
  methods: {
    ...mapActions(useClientsStore, ['getClients', 'deleteClient']),
    fetchClients() {
      this.getClients()
    },
    delete(id: string) {
      this.deleteClient(id)
        .then(() => {
          Notify.create({
            message: 'Cliente excluído com sucesso.',
            color: 'primary',
          })
        })
        .catch((error) => {
          Notify.create({
            message: error.message,
            color: 'red',
          })
        })
        .finally(() => {
          this.getClients()
        })
    },
    openAddClientDialog(id?: string) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.$refs.clientDialog.open(id)
    },
  },
})
</script>
