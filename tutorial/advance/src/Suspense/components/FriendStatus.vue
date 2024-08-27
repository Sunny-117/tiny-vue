<template>
  <div class="friend-status">{{ friendStatus }}</div>
</template>

<script setup>
import { ref } from 'vue'

const friendStatus = ref('好友状态：加载中...')

await new Promise((resolve) => setTimeout(resolve, 2000))
friendStatus.value = '好友状态：在线'
console.log('好友状态组件加载完成')
</script>

<style scoped>
.friend-status {
  font-size: 16px;
}
</style>
