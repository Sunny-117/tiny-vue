<template>
  <div class="page user">
    <h1>User页面</h1>
    <!-- <p>参数：{{ $route.params.userId }}</p> -->
    <p>参数：{{ userId }}</p>
  </div>
</template>

<script setup>
// import { useRoute } from 'vue-router'
// const route = useRoute() // 获取当前路由
// const userId = route.params.userId // 获取路由参数
// console.log(userId)

// 通过 props 获取路由参数
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})
console.log(props.userId)
</script>

<style scoped>
.user {
  text-align: center;
  color: #ff5722;
}
</style>
