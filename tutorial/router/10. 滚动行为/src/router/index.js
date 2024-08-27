import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Contact from '../components/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(savedPosition)
    if (savedPosition) {
      // 如果之前有滚动为止，那么滚动到之前的位置
      // 通过 Promise 来实现延迟滚动
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...savedPosition, behavior: 'smooth' })
        }, 2200)
      })
    } else if (to.hash) {
      // 如果有 hash 值，那么滚动到 hash 值对应的元素
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, top: 70, behavior: 'smooth' })
        }, 2200)
      })
    } else {
      // 如果之前没有滚动位置，那么滚动到顶部
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: 'smooth' })
        }, 2200)
      })
    }
  }
})

export default router
