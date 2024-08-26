import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles.css'

import { logPlugin } from './plugins/logPlugin.js'
import piniaPersitteState from 'pinia-plugin-persistedstate'

// 创建并配置Pinia
const pinia = createPinia()
pinia.use(logPlugin)
pinia.use(piniaPersitteState)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
