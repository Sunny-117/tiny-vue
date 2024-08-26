import './assets/styles.css'

import { createApp } from 'vue'
// import RefApp from './ref/App.vue'
// import EventBusApp from './eventBus/App.vue'
import customApp from './custom/App.vue'

const app = createApp(customApp)

app.mount('#app')
