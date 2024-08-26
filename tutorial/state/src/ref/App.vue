<template>
  <div id="app">
    <A />
  </div>
</template>

<script setup>
import A from '../components/A.vue'
</script>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
