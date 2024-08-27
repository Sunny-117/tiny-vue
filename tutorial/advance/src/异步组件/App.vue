<template>
  <div id="app">
    <button @click="loadComponent('Home')">访问主页</button>
    <button @click="loadComponent('About')">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'
// import Home from './components/Home.vue'
// import About from './components/About.vue'

const currentComponent = shallowRef(null)
/**
 *
 * @param name 组件名
 */
const loadComponent = (name) => {
  currentComponent.value = defineAsyncComponent(() => import(`./components/${name}.vue`))
}
</script>
