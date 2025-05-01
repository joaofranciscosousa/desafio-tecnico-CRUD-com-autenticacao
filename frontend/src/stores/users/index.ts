import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    loading: false,
    user: {
      name: '',
      email: '',
    },
  }),
  actions: {
    signIn(email: string, password: string): Promise<{ token: string }> {
      return new Promise<{ token: string }>((resolve, reject) => {
        if (!this.loading) {
          this.loading = true

          api
            .post(`/users/sign_in`, { email, password })
            .then((res) => {
              this.user.name = res.data.name
              this.user.email = res.data.email
              resolve(res.data)
            })
            .catch((err) => {
              reject({
                error: err,
                message:
                  'Ocorreu um erro ao fazer o login. Tente recarregar a página. Caso persista, contate o suporte.',
              })
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
  },
})
