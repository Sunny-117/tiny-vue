<template>
  <div class="c-container">
    <h1>C组件</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import eventBus from '../tools/EventBus.js'

const message = ref('')
onMounted(() => {
  // 订阅事件
  eventBus.on('message', handleMessage)
})

function handleMessage(newMessage) {
  message.value = newMessage
}

onUnmounted(() => {
  // 取消订阅
  eventBus.off('message', handleMessage)
})
</script>

<style scoped>
.c-container {
  border: 2px solid red;
  padding: 10px;
  margin: 10px;
}
</style>
