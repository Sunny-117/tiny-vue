import { createApp } from 'vue'
import App from './App.vue'
import VueLazyload from 'vue3-lazyload'

const app = createApp(App)

app.use(VueLazyload, {
  loading: 'https://dummyimage.com/600x400/cccccc/000000&text=Loading', // 图片加载时显示的占位图片
  error: 'https://dummyimage.com/600x400/ff0000/ffffff&text=Error' // 图片加载失败时显示的图片
})

app.mount('#app')
