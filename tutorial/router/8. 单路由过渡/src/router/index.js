import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Contact from '../components/Contact.vue'
import PanelLeft from '../components/PanelLeft.vue'
import PanelRight from '../components/PanelRight.vue'

// 针对每一个路由，设置了一个 transition 字段，用于指定路由切换时的动画效果
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
    // meta: {
    //   transition: 'fade'
    // }
  },
  {
    path: '/about',
    name: 'About',
    component: About
    // meta: {
    //   transition: 'fade'
    // }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
    // meta: {
    //   transition: 'fade'
    // }
  },
  {
    path: '/panel-left',
    name: 'PanelLeft',
    component: PanelLeft
    // meta: {
    //   transition: 'slide-left'
    // }
  },
  {
    path: '/panel-right',
    name: 'PanelRight',
    component: PanelRight
    // meta: {
    //   transition: 'slide-right'
    // }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  switch (to.path) {
    case '/panel-left':
      to.meta.transition = 'slide-left'
      break
    case '/panel-right':
      to.meta.transition = 'slide-right'
      break
    default:
      to.meta.transition = 'fade'
  }
})

export default router
