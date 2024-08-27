<template>
  <div class="async-component">
    <h2>异步组件加载</h2>
    <p>这是一个异步组件加载测试</p>
  </div>
</template>

<script setup>
console.log('异步组件加载完毕')
</script>

<style scoped>
.async-component {
  font-size: 16px;
  color: green;
}
</style>
