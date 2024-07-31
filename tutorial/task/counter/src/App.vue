<template>
  <div class="counter">
    <h1>计数器：{{ conterStore.count }}</h1>
    <button @click="conterStore.increment">增加</button>
    <button @click="conterStore.decrement">减少</button>
  </div>
</template>

<script setup>
import { useCounterStore } from './stores/useCounterStore.js'
// 获取数据仓库
const conterStore = useCounterStore()
</script>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
