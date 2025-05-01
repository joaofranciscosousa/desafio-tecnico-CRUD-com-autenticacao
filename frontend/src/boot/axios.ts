import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { getEnv } from 'src/helper'
import { type App } from 'vue'

const baseURL = getEnv('API')

const consoleInfo = (info: unknown) => console.info(info)
const consoleError = (error: unknown) => console.error(error)

const api = axios.create({
  baseURL,
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
    common: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
    },
  },
})

export default boot(({ app }: { app: App }) => {
  api.interceptors.request.use(
    (config) => {
      consoleInfo(config)
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    (error) => {
      consoleError(error)
      return Promise.reject(error)
    },
  )

  let status_code: number | null = null

  api.interceptors.response.use(
    (response) => {
      consoleInfo(response)
      return response
    },
    (error) => {
      if (error.response) {
        consoleError(error.response)
        status_code = error.response.status
        if (status_code == 401) {
          localStorage.removeItem('token')
          window.location.href = '/authentication'
        }
      } else if (error.request) {
        consoleError(error.request)
      } else {
        consoleError(error.message)
      }
      return Promise.reject(error)
    },
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
