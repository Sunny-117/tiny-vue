<template>
  <div class="page home">
    <h1>欢迎来到首页</h1>
    <p>首页内容</p>
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from 'vue-router'

console.log('开始渲染Home组件')

onBeforeRouteLeave((to, from, next) => {
  console.log('离开Home组件')
  next()
})
</script>

<style scoped>
.home {
  text-align: center;
  color: #4caf50;
}
</style>
