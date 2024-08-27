import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import User from '../views/User.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  // 仅仅需要普通权限即可
  { path: '/user', name: 'User', component: User, meta: { requireAuth: true } },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    // 需要管理员权限
    meta: { requireAuth: true, requireAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 模拟用户登录状态
let currentUserRole = null // 当前用户的角色

// 再提供一些和角色配套的方法
export function login(role) {
  currentUserRole = role
}

export function loginout() {
  currentUserRole = null
}

export function getCurrentUserRole() {
  return currentUserRole
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 判断是否需要权限
  if (to.meta.requireAuth) {
    // 做权限相关的处理
    if (!currentUserRole) {
      // 未登录
      next({ name: 'Login' })
    } else if (to.meta.requireAdmin && currentUserRole !== 'admin') {
      // 进入此分支，说明当前角色是有值的
      // 但是你要进入的页面需要管理员权限，但是当前角色不是管理员
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
