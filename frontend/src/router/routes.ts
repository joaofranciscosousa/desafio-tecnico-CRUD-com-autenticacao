import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'index', component: () => import('pages/index/IndexPage.vue') }],
  },
  {
    path: '/authentication',
    component: () => import('layouts/AuthenticationLayout.vue'),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        next({ name: 'index' })
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'authentication',
        component: () => import('src/pages/AuthPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
