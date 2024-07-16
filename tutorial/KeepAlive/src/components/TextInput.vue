<template>
  <div>
    <h1>文本输入</h1>
    <input type="text" v-model="text" placeholder="请输入内容..." />
    <p>你输入的内容为：{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

<script>
export default {
  name: 'TextInput'
}
</script>

<style>
h1 {
  color: #333;
}
input {
  padding: 10px;
  font-size: 1em;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}
p {
  font-size: 1.2em;
}
</style>
