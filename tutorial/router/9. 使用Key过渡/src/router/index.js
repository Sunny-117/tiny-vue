import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'ItemList', component: () => import('../views/ItemList.vue') },
  { path: '/item/:id', name: 'ItemDetail', component: () => import('../views/ItemDetail.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
