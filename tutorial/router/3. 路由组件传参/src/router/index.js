import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import User from '../components/User.vue'
import Promotion from '../components/Promotion.vue'
import Search from '../components/Search.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/user/:userId(\\d+)', name: 'User', component: User, props: true },
  {
    path: '/promotion',
    name: 'Promotion',
    component: Promotion,
    props: {
      newsletter: true
    }
  },
  {
    path: '/search',
    component: Search,
    props: (route) => ({ query: route.query.q })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
