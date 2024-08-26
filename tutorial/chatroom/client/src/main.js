import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { io } from 'socket.io-client'

const app = createApp(App)

app.use(router)

// 创建一个 socket 客户端实例
const socket = io('http://localhost:3000', {
  // 这里是在配置客户端与服务器端建立连接的优先级列表
  // 1. 第一优先级使用 websocket
  // 2. 第二优先级使用 polling（长轮询）
  // 3. 第三优先级使用 flashsocket
  transports: ['websocket', 'polling', 'flashsocket']
})

// 将 socket 实例挂载到 app.config.globalProperties 上
app.config.globalProperties.$socket = socket

app.mount('#app')
