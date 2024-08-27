<template>
  <div class="page about">
    <h1>关于我们</h1>
    <p>提供专业的前端学习</p>
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from 'vue-router'

console.log('开始渲染About组件')

onBeforeRouteLeave((to, from, next) => {
  console.log('离开About组件')
  next()
})
</script>

<style scoped>
.about {
  text-align: center;
  color: #ff5722;
}
</style>
