import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    // 动态路由：后面会跟上用户名
    path: '/chat/:username',
    name: 'chat',
    component: Chat
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
