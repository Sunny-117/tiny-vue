<template>
  <div class="b-container">
    <h1>B组件</h1>
    <C />
  </div>
</template>

<script setup>
import C from './C.vue'
</script>

<style scoped>
.b-container {
  border: 2px solid green;
  padding: 10px;
  margin: 10px;
}
</style>
