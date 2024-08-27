<template>
  <div class="userInfo">
    <h2>个人信息</h2>
    <p>姓名：{{ userInfo.user.name }}</p>
    <p>年龄：{{ userInfo.user.age }}</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const userInfo = inject('globalConfig')
</script>

<style scoped>
.userInfo {
  width: 200px;
  border: 1px solid red;
}
</style>
