<template>
  <div>
    <h1>计数器</h1>
    <p>计数：{{ count }}</p>
    <button @click="count++">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<script>
export default {
  name: 'Counter'
}
</script>

<style>
h1 {
  color: #333;
}
p {
  font-size: 1.5em;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #36a373;
}
</style>
