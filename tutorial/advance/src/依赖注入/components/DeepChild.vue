<template>
  <div class="deepchild">
    <h1>DeepChild组件</h1>
    <p>{{ receivedData }}</p>
    <p>{{ receivedData2 }}</p>
    <p>{{ receivedData3 }}</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const receivedData = inject('appData')
const receivedData2 = inject('message')
const receivedData3 = inject('message2', 'default value')
</script>

<style scoped>
.deepchild {
  width: 200px;
  height: 200px;
  border: 1px solid blue;
}
</style>
