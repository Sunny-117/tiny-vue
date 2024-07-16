import { createRouter, createWebHistory } from 'vue-router'
import Counter from '../components/Counter.vue'
import TextInput from '../components/TextInput.vue'
import CheckboxList from '../components/CheckboxList.vue'
import Timer from '../components/Timer.vue'

const routes = [
  { path: '/', component: Counter },
  { path: '/input', component: TextInput },
  { path: '/checkboxlist', component: CheckboxList },
  { path: '/timer', component: Timer }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
