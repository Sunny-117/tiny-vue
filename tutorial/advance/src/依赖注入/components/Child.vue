<template>
  <div class="child">
    <h1>这是子组件</h1>
    <DeepChild />
  </div>
</template>

<script setup>
import DeepChild from './DeepChild.vue'
</script>

<style scoped>
.child {
  width: 300px;
  height: 300px;
  border: 1px solid red;
}
</style>
