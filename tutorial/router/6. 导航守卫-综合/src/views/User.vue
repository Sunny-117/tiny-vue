<template>
  <div>
    <h1>用户页面</h1>
    <p>用户ID: {{ $route.params.id }}</p>
  </div>
</template>

<script setup>
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

console.log('开始渲染User组件')

onBeforeRouteUpdate((to, from, next) => {
  console.log('更新User组件')
  console.log('参数从', from.params.id, '更新为', to.params.id)
  next()
})

onBeforeRouteLeave((to, from, next) => {
  console.log('User组件离开')
  if (window.confirm('你确定要离开吗？')) {
    next()
  } else {
    next(false)
  }
})
</script>
