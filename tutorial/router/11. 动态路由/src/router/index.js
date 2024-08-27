// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { routesMap } from './roles'

const baseRoutes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: []
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes
})

// 获取 dashboard 路由
const dashboardRoute = router.getRoutes().find((route) => route.path === '/')

/**
 * 清空已有的路由
 */
function clearRoutes() {
  const routes = router.getRoutes()
  routes.forEach((route) => {
    // 如果路由的 name 不为空，并且不是 dashboard 路由，则移除
    if (route.name && route.name !== dashboardRoute.name) {
      router.removeRoute(route.name)
    }
  })
}

/**
 * 根据角色动态的添加路由
 * @param {*} role string （admin、teacher、student）
 */
export function setRoutesbyRole(role) {
  // 1. 先清空已有的路由
  clearRoutes()
  // 2. 根据角色将对应的路由取出来
  const roleRoutes = routesMap[role] || []
  // 3. 动态的给 dashboard 添加子路由
  roleRoutes.forEach((route) => {
    router.addRoute(dashboardRoute.name, route)
  })
}

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 先获取用户的登录状态
  const isLogin = localStorage.getItem('isLogin')
  if (to.path === '/login' && isLogin) {
    // 用户已经登陆了，但是他又想去登陆页，直接跳转到之前所在的页面
    const activeIndexRoute = localStorage.getItem('activeIndex')
    next(activeIndexRoute)
  } else if (to.path !== '/login' && !isLogin) {
    // 用户未登录，但是你又要去受保护的路由，跳转到登陆页
    next('/login')
  } else {
    next()
  }
})

export default router
