<template>
  <div id="app">
    <h1>Suspense Event Example</h1>
    <button @click="showComponent = true">加载异步组件</button>
    <!-- 会在适当的时机触发事件 -->
    <Suspense v-if="showComponent" @pending="onPending" @resolve="onResolve" @fallback="onFallback">
      <template #default>
        <AsyncCom />
      </template>
      <template #fallback>
        <LoadingComponent />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import LoadingComponent from './components/LoadingComponent.vue'

const showComponent = ref(false)

// 异步组件
const AsyncCom = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('./components/AsyncComponent.vue'))
    }, 5000)
  })
})

const onPending = () => {
  console.log('当前处于pending状态')
}

const onResolve = () => {
  console.log('异步组件加载完毕！！！')
}

const onFallback = () => {
  console.log('当前处于fallback状态，显示后备内容')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
