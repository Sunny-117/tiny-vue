<template>
  <div>
    <h1>错误插件使用示例</h1>
    <button @click="triggerError">触发错误</button>
    <!-- 使用由ErrorLogger插件所提供的组件 -->
    <ErrorLogger />
  </div>
</template>

<script setup>
function triggerError() {
  // 触发一个错误
  throw new Error('这是一个错误呀！！！')
}
</script>
