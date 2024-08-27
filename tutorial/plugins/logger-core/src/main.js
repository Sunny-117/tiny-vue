// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// 引入自定义插件
import ErrorLogger from './plugins/ErrorLogger/error-logger'

const app = createApp(App)

// 使用插件
app.use(ErrorLogger, {
  logToConsole: true,
  remotoLogging: true,
  remoteUrl: 'http://localhost:3000/log'
})

app.mount('#app')
