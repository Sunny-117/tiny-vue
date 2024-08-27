<template>
  <div v-if="errors.length">
    <h1>错误日志</h1>
    <ul>
      <li v-for="error in errors" :key="error.time">{{ error.time }} - {{ error.message }}</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

// 该数组用于存储错误信息
const errors = reactive([])

onMounted(() => {
  // 改写 console.error 方法
  // 之后在使用 console.error 方法打印错误的时候
  // 会自动将错误信息推入到 errors 数组中
  const oldConsoleError = console.error
  console.error = (...args) => {
    // 将错误信息推入到 errors 数组中
    errors.push({
      message: args[0],
      time: new Date().toDateString()
    })
    oldConsoleError.apply(console, args)
  }
})
</script>
