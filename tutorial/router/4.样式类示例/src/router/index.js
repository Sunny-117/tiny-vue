// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', component: Home },
  {
    path: '/about',
    component: () => import('../views/About.vue'),
    children: [
      {
        path: 'team',
        component: () => import('../views/Team.vue')
      },
      {
        path: 'projects',
        component: () => import('../views/Projects.vue'),
        children: [
          {
            path: ':id',
            component: () => import('../views/ProjectDetails.vue'),
            props: true
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
