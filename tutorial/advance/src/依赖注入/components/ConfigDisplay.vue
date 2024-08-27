<template>
  <div :style="{ color: globalConfig.themeColor }">
    <h2>配置信息</h2>
    <p>主题颜色：{{ globalConfig.themeColor }}</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const globalConfig = inject('globalConfig')
</script>
