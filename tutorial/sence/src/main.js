// import './assets/main.css'

import { createApp } from 'vue'
// import TreeApp from './TreeApp.vue'
// import DebounceApp from './DebounceApp.vue'
import { ObserveVisibility } from 'vue3-observe-visibility'
import VirtualListAppVue from './VirtualListApp.vue'
// import LazyLoadVue from './LazyLoad.vue'
// import ObserveApp from './ObserveApp.vue'


// const app = createApp(DebounceApp)
const app = createApp(VirtualListAppVue)
app.directive('observe-visibility', ObserveVisibility)


app.mount('#app')
