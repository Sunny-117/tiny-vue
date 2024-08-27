<template>
  <div>
    <h1>促销页面</h1>
    <p v-if="newsletter">欢迎新用户</p>
    <p v-else>最新促销信息</p>
  </div>
</template>

<script setup>
const props = defineProps({
  newsletter: {
    type: Boolean,
    required: true
  }
})
console.log(props)
</script>
