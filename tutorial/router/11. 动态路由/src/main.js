import './assets/main.css'

import { createApp } from 'vue'
// 引入了根组件
import App from './App.vue'
import router, { setRoutesbyRole } from './router'

// 引入组件库
import ElementPlus from 'element-plus'
// 引入组件库相关样式
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 挂载根组件
const app = createApp(App)

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 从本地读取角色
const userRole = localStorage.getItem('userRole')

if (userRole) {
  setRoutesbyRole(userRole)
}

app.use(router).use(ElementPlus).mount('#app')
