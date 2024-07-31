import './assets/main.css'

import { createApp } from 'vue'
// 引入了根组件
import App from './App.vue'
import { createPinia } from 'pinia'

// 挂载根组件
const app = createApp(App)
// 创建一个 pinia 的实例
const pinia = createPinia()

app.use(pinia).mount('#app')
