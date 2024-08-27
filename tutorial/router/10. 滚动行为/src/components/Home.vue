<template>
  <div class="container">
    <h1>主页</h1>
    <p>欢迎来到首页!</p>
    <div v-for="i in 200" :key="i">
      <p>主页: 增加一些长内容以便产生滚动.</p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
</style>
