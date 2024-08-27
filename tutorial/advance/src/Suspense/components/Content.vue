<template>
  <div class="content">
    <h2>第二部分内容</h2>
    <Suspense>
      <template #default>
        <div>
          <AsyncActivityFeed />
          <AsyncStats />
        </div>
      </template>
      <template #fallback>
        <LoadingComponent />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import LoadingComponent from './LoadingComponent.vue'

// 异步组件
const AsyncActivityFeed = defineAsyncComponent(() => {
  // 模拟从服务器加载组件
  return new Promise((resolve) => {
    // 8秒后加载活动提要组件
    setTimeout(() => {
      resolve(import('./ActivityFeed.vue'))
    }, 8000)
  })
})
const AsyncStats = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    // 5秒后加载活动提要组件
    setTimeout(() => {
      resolve(import('./Stats.vue'))
    }, 5000)
  })
})
</script>

<style scoped>
.content {
  padding: 10px;
}
</style>
