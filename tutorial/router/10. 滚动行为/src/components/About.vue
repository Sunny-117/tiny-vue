<template>
  <div class="container">
    <h1>关于</h1>
    <p>这是关于页面!</p>
    <p id="section1">第一小节</p>
    <div v-for="i in 200" :key="i">
      <p>关于: 这节课介绍vue-router滚动相关知识.</p>
    </div>
    <p id="section2">第二小节</p>
    <div v-for="i in 200" :key="i">
      <p>关于: 这节课介绍vue-router滚动相关知识.</p>
    </div>
    <p id="section3">第三小节</p>
    <div v-for="i in 200" :key="i">
      <p>关于: 这节课介绍vue-router滚动相关知识.</p>
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
