<template>
  <div class="component">
    <h1>计时器</h1>
    <p>时间: {{ formattedTime }}</p>
    <button @click="startTimer" :disabled="timerRunning">开始</button>
    <button @click="stopTimer" :disabled="!timerRunning">停止</button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const seconds = ref(0)
const milliseconds = ref(0)
const timerRunning = ref(false)
let timer

const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true
    timer = setInterval(() => {
      milliseconds.value++
      if (milliseconds.value >= 100) {
        milliseconds.value = 0
        seconds.value++
      }
    }, 10)
  }
}

const stopTimer = () => {
  if (timerRunning.value) {
    timerRunning.value = false
    clearInterval(timer)
  }
}

const formattedTime = computed(() => {
  const ms = milliseconds.value.toString().padStart(2, '0')
  const s = seconds.value.toString().padStart(2, '0')
  return `${s}:${ms}`
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<script>
export default {
  name: 'Timer'
}
</script>

<style>
.component {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #333;
}
p {
  font-size: 1.5em;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
}
button:hover {
  background-color: #36a373;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
