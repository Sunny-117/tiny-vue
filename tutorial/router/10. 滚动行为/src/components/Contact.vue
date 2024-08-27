<template>
  <div class="container">
    <h1>联系我们</h1>
    <p>这是联系页面!</p>
    <div v-for="i in 200" :key="i">
      <p>联系: 通过官方渠道联系我们.</p>
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
