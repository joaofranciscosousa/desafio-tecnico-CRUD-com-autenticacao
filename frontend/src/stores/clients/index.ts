import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useClientsStore = defineStore('clients', {
  state: (): ClientsState => ({
    loading: false,
    clients: [],
    client: undefined,
    search: '',
    pagination: {
      sortBy: 'name',
      descending: true,
      page: 1,
      pages: 1,
      rowsPerPage: 10,
      rowsNumber: 100,
    },
  }),
  actions: {
    getClients() {
      return new Promise<void>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .get(`/clients`, {
              params: {
                orderBy: this.pagination.sortBy,
                sortBy: this.pagination.descending,
                page: this.pagination.page,
                per_page: this.pagination.rowsPerPage,
                search: this.search,
              },
            })
            .then((res) => {
              this.clients = res.data.data

              this.pagination.page = res.data.pagination.current
              this.pagination.pages = res.data.pagination.pages
              this.pagination.rowsPerPage = res.data.pagination.per_page
              this.pagination.rowsNumber = res.data.pagination.count

              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao buscar os clientes. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
    getClient(id: string) {
      return new Promise<void>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .get(`/clients/${id}`)
            .then((res) => {
              this.client = res.data
              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao buscar o cliente. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
    createClient(name: string, email: string, phone: string, born_date: string) {
      return new Promise<void>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .post(`/clients`, { name, email, phone, born_date })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao criar um cliente. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
    editClient(id: string, name: string, email: string, phone: string, born_date: string) {
      return new Promise<void>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .put(`/clients/${id}`, { name, email, phone, born_date })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao editar os clientes. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
    deleteClient(id: string) {
      return new Promise<void>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .delete(`/clients/${id}`)
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao deletar os clientes. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
  },
})
