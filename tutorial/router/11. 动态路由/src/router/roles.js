// 角色和路由之间的关系映射表
export const routesMap = {
  admin: [
    {
      path: '/student',
      name: 'Student',
      component: () => import('../views/Student.vue'),
      meta: { title: '学生模块', icon: 'User' }
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: () => import('../views/Teacher.vue'),
      meta: { title: '教师模块', icon: 'Suitcase' }
    },
    {
      path: '/teaching',
      name: 'Teaching',
      component: () => import('../views/Teaching.vue'),
      meta: { title: '教学模块', icon: 'DataBoard' }
    },
    {
      path: '/course',
      name: 'Course',
      component: () => import('../views/Course.vue'),
      meta: { title: '课程模块', icon: 'Collection' }
    }
  ],
  teacher: [
    {
      path: '/student',
      name: 'Student',
      component: () => import('../views/Student.vue'),
      meta: { title: '学生模块', icon: 'User' }
    },
    {
      path: '/teaching',
      name: 'Teaching',
      component: () => import('../views/Teaching.vue'),
      meta: { title: '教学模块', icon: 'DataBoard' }
    },
    {
      path: '/course',
      name: 'Course',
      component: () => import('../views/Course.vue'),
      meta: { title: '课程模块', icon: 'Collection' }
    }
  ],
  student: [
    {
      path: '/course',
      name: 'Course',
      component: () => import('../views/Course.vue'),
      meta: { title: '课程模块', icon: 'Collection' }
    }
  ]
}
