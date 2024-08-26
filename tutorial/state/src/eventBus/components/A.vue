<template>
  <div class="a-container">
    <h1>A组件</h1>
    <B />
    <button @click="clickHandle">传递数据</button>
  </div>
</template>

<script setup>
import B from './B.vue'
import eventBus from '../tools/EventBus.js'
function clickHandle() {
  // 通过事件总线来传递数据才 B 组件下面的 C 组件
  eventBus.emit('message', '这是来自于A组件传递过来的数据')
}
</script>

<style scoped>
.a-container {
  border: 2px solid blue;
  padding: 10px;
  margin: 10px;
}
</style>
