import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Contact from '../components/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  // { path: '/about', name: 'About', component: About, alias: '/abc' },
  {
    path: '/about',
    name: 'About',
    components: {
      default: About,
      sidebar: Contact
    },
    alias: '/abc',
    redirect: '/contact'
  },
  { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
