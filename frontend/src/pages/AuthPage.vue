<template>
  <q-page class="flex flex-center">
    <q-form
      @submit="handleLogin"
      @validation-error="
        (ref) => {
          // @ts-expect-error not recognize ref `scrollToFieldWithErrorModal`
          scrollToFieldWithErrorModal(ref)
        }
      "
      novalidate
    >
      <q-card style="min-width: 300px; max-width: 400px" flat bordered>
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input outlined v-model="email" label="E-mail" type="email" :rules="textRules" />

          <q-input
            outlined
            v-model="password"
            label="Senha"
            :type="showPassword ? 'password' : 'text'"
            :rules="textRules"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn type="submit" label="Entrar" color="primary" class="full-width" />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { Notify } from 'quasar'
import { useUsersStore } from 'src/stores/users'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    const validates = {
      textRules: [(val: string) => !!val || 'Por favor, preencha este campo'],
    }
    return {
      ...validates,
      email: '',
      password: '',
      showPassword: true,
    }
  },
  methods: {
    ...mapActions(useUsersStore, ['signIn']),
    handleLogin() {
      this.signIn(this.email, this.password)
        .then((data: { token: string }) => {
          localStorage.setItem('token', data.token)
          this.$api.defaults.headers.common['Authorization'] = data.token
          this.$router.push({ name: 'index' })
        })
        .catch((err) => {
          Notify.create({
            message: err.error.response.data.message || err.message,
            color: 'red',
          })
        })
    },
  },
})
</script>

<style scoped>
.q-page {
  background: #f5f5f5;
  height: 100vh;
}
</style>
